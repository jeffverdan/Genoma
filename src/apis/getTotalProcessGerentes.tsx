import axiosInstance from '../http/axiosInterceptorInstance';

async function GetTotalProcessos() {
    let data;

    await axiosInstance.get('contador_processos', {
        params: {
            usuario_id: localStorage.getItem('usuario_id'),
            loja_id: localStorage.getItem('loja_id'),
            perfil_login_id: localStorage.getItem('perfil_login_id')
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