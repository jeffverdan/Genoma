import { ParcelaProcessoResponse } from '@/interfaces/Financeiro/Status';
import axiosInstance from '../http/axiosInterceptorInstance';

const LISTA_FORMA_PAGAMENTO = [
    { name: 'Espécie', id: 'especie' },
    { name: 'Depósito', id: 'deposito' },
    { name: 'TED/DOC', id: 'ted_doc' },
    { name: 'PIX', id: 'pix' },
    { name: 'Cheque/Cheque adm.', id: 'cheque' },
];

const LISTA_STATUS = [
    { name: 'SOLICITADO', color: 'primary' },
    { name: 'CONCLUÍDO', color: 'primary' },
    { name: "COBRANÇA SOLICITADA", color: "primary" },
    { name: 'EM TRANSFERÊNCIA', color: 'green' },
    { name: 'TRANSFERIDO', color: 'green' },
    { name: 'LIBERADO', color: 'green' },
    { name: 'PAGO', color: 'green' },
    { name: "COBRANÇA PERMITIDA", color: "green" },
    { name: 'AGUARDANDO MOMENTO', color: 'yellow' },
    { name: 'AGUARDANDO PAGAMENTO', color: 'yellow' },
    { name: "AGUARDANDO RECIBO DE SINAL", color: "yellow" },
    { name: 'AGUARDANDO CERTIDÕES', color: 'yellow' },
    { name: 'AGUARDANDO ESCRITURA', color: 'yellow' },
    { name: 'AGUARDANDO REGISTRO', color: 'yellow' },
    { name: "AGUARDANDO PLANILHA", color: "neutral" },
    { name: "BOLETO ENVIADO", color: "neutral" },
    { name: 'CANCELADO', color: 'red' },
    // QUALQUER OUTRO GREEN
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

async function ParcelaProcessoById({ parcela_id, processo_id }: { parcela_id: string | number, processo_id: string | number }): Promise<ParcelaProcessoResponse | undefined> {
    let data;
    await axiosInstance.post('retorna_parcela_financeiro', {
        processo_id,
        parcela_id
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    })
        .then((res: { data: ParcelaProcessoResponse }) => {
            data = {
                ...res.data,
                comissao_geral: {
                    ...res.data.comissao_geral,
                    tipo_pagamento: res.data.comissao_geral.comissao === "partes" ? "Parcelada" : "Integral",
                    liquida: LISTA_FORMA_PAGAMENTO.find((item) => item.id === res.data.comissao_geral.liquida)?.name || res.data.comissao_geral.liquida,
                },
                parcela: {
                    ...res.data.parcela,
                    ultima_data_envio: res.data.parcela.ultima_data_envio.slice(0,16),
                    status: {
                        ...res.data.parcela.status,
                        color: LISTA_STATUS.find((item) => item.name === res.data.parcela.status.status_parcela?.toUpperCase())?.color || 'green',
                    }
                },
                rateio: {
                    valor_total: res.data.usuarios_agrupado.reduce((acc, curr) => acc + parseFloat(curr.valor_total.toFixed(2)), 0),
                    valor_restante: res.data.usuarios_agrupado.reduce((acc, curr) => acc + parseFloat(curr.valor_faltante.toFixed(2)), 0),
                    valor_transferido: res.data.usuarios_agrupado.reduce((acc, curr) => acc + parseFloat(curr.valor_transferido.toFixed(2)), 0),                    
                },
                usuarios_agrupado: [
                    ...res.data.usuarios_agrupado.map((usuario) => ({
                        ...usuario,
                        cpf_cnpj: usuario.cnpj || '',
                        usuario_id: usuario.usuario_id || usuario.empresa_id,
                        status_color: LISTA_STATUS.find((item) => item.name === usuario.nome_status?.toUpperCase())?.color || 'green',
                    }))
                ],
                arrayDatasTransf: orderDate([...new Set(res.data.transferencias.map(e => e.data_transferencia))])
            }        
            console.log('RETORNO :', res);


})
        .catch (err => {
    console.log(err);
})
return data;
}

export default ParcelaProcessoById;