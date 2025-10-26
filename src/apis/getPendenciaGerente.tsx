import { ParcelaProcessoResponse } from '@/interfaces/Financeiro/Status';
import { ExibirPendenciasType } from '@/interfaces/Vendas/Pendencias';
import axiosInstance from '../http/axiosInterceptorInstance';

const LISTA_FORMA_PAGAMENTO = [
    { name: 'Espécie', id: 'especie' },
    { name: 'Depósito', id: 'deposito' },
    { name: 'TED/DOC', id: 'ted_doc' },
    { name: 'PIX', id: 'pix' },
    { name: 'Cheque/Cheque adm.', id: 'cheque' },
];

const LISTA_PERIODOS = [
    { name: 'Recibo de Sinal', id: '1' },
    { name: 'Certidões', id: '2' },
    { name: 'Escritura', id: '3' },
    { name: 'Registro', id: '4' }
];

const orderDate = (datas: string[]) => {
    if(!datas) return [];
    return datas.sort((a, b) => {
        const [diaA, mesA, anoA] = a.split("/").map(Number);
        const [diaB, mesB, anoB] = b.split("/").map(Number);
      
        // Criando objetos Date (ano, mês-1, dia)
        const dataA = new Date(anoA, mesA - 1, diaA);
        const dataB = new Date(anoB, mesB - 1, diaB);
      
        return dataB.getTime() - dataA.getTime(); // Mais recente primeiro
      });
}

interface PropsType {
    parcela_id: string | number, processo_id: string | number, pendencia_id?: string | number
}

async function GerentePendenciasById({ parcela_id, processo_id, pendencia_id }: PropsType): Promise<ExibirPendenciasType | undefined> {
    let data;
    await axiosInstance.post('exibir_pendencia', {
        processo_id,
        parcela_id,
        pendencia_id,
        usuario_id: localStorage.getItem('usuario_id')
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    })
        .then((res: { data: ExibirPendenciasType }) => {            
            data = {...res.data,
                dados_parcela: {
                    ...res.data.dados_parcela,
                    periodo_pagamento: LISTA_PERIODOS.find(item => item.id === res.data.dados_parcela?.periodo_pagamento)?.name || res.data.dados_parcela?.periodo_pagamento,                    
                },
                dados_comissao_geral: {
                    ...res.data.dados_comissao_geral,
                    forma_pagamento: LISTA_FORMA_PAGAMENTO.find(item => item.id === res.data.dados_comissao_geral?.forma_pagamento)?.name || res.data.dados_comissao_geral?.forma_pagamento
                }
            }        
            console.log('RETORNO :', res);


})
        .catch (err => {
    console.log(err);
})
return data;
}

export default GerentePendenciasById;