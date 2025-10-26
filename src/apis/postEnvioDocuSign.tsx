// import Axios from 'axios';
import axiosInstance from '../http/axiosInterceptorInstance';
import FormValues from '@/interfaces/Vendas/EntregarVenda'

async function postEnvioDocuSign(idProcesso: string, data: FormValues) {
    const token = localStorage.getItem('token');
    let result;

    await axiosInstance.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'enviando_docusign', {...data, processo_id: idProcesso}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    })
        .then(res => {
        if (res.data.status && res.data.status === (401 || 498)) {
            localStorage.clear();
        } else {
            result = res.data;

            //recarregaDocs();
        }
        })
        .catch(function (error) {
            console.log(error);
        })

    return result;
};

export default postEnvioDocuSign;