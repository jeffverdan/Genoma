import Axios from 'axios';
import axiosInstance from '../http/axiosInterceptorInstance';

async function getListaOrigemComprador() {

    let data;
    const error = 'Erro ao retornar o processo';

    await axiosInstance.get('lista_origem_cliente', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }).then(res => {
        data = res.data;
        console.log(data);
    })
    .catch(err => {
        console.log(error);
    })
    return data;
};

export default getListaOrigemComprador;