import axiosInstance from '../http/axiosInterceptorInstance';

async function GetTotalProcessos() {
    let data;

    await axiosInstance.get('contador_processo_pos_venda', {
        params: {
            usuario_id: localStorage.getItem('usuario_id')
        },
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }).then(res => {
        data = res.data
        console.log("Total processos: ", data);
    })
        .catch(err => {
            console.log(err);
        })
    return data;
}

export default GetTotalProcessos;