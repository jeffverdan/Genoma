import axiosInstance from '../http/axiosInterceptorInstance';

interface Props {
    processo_id: string | number
    valorCusto: string
    valorServico: string
    valorTotal: string
}

async function salvarValoresCusto({ valorCusto, valorServico, valorTotal, processo_id }: Props) {
    let data;
    await axiosInstance.post('salvar_boleto_servico', {
        processo_id,
        valorCusto,
        valorServico,
        valorTotal,
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }).then(res => {
        data = res.data;
        console.log("salvar_correcao_data_assinatura ", data);
    }).catch(err => {
        console.log(err);
    })
    return data;
}

export default salvarValoresCusto;