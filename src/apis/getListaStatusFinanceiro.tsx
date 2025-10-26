import { StatusParcelaType } from '@/interfaces/Financeiro/Status';
import axiosInstance from '../http/axiosInterceptorInstance';
// STATUS DE PARCELA

interface ResApiStatus {
    grupo_status: "Parcela"
    id: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 
    nome_status: StatusParcelaType
}

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

//FUNÇÃO PARA CAPTALIZAR A LISTA DE STATUS DE FINANCEIRO
const toUpperCaseFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function ListaStatusFinanceiro() {
    let data;
    await axiosInstance.get('lista_status_financeiro', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    })
    .then(res => {
        if (res !== undefined) {
            if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
                localStorage.clear();
            } else {
                data = res.data.filter((f: ResApiStatus) => f.id !== 8).map((e: ResApiStatus) => ({
                    id: e.id,
                    nome: toUpperCaseFirstLetter(e.nome_status),
                    label: toUpperCaseFirstLetter(e.nome_status),
                    color: LISTA_STATUS.find((item) => item.name === (e.nome_status))?.color || 'green',
                }));
            }
        }
    })   
    .catch(error => {
        console.log(error);
    })

    return data;
}
export default ListaStatusFinanceiro