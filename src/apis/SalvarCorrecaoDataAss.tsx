import axiosInstance from '../http/axiosInterceptorInstance';

interface Props {
    processo_id: string | number
    data_assinatura: string
}

async function SalvarCorrecaoDataAss({ processo_id, data_assinatura }: Props) {
    let data;
    const error = 'Erro ao retornar os laudemios';
    await axiosInstance.post('salvar_correcao_data_assinatura', {
        processo_id,
        data_assinatura
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }).then(res => {
        data = res.data;
        console.log("salvar_correcao_data_assinatura ", data);
    })
        .catch(err => {
            console.log(error);
        })
    return data;
}

export default SalvarCorrecaoDataAss;