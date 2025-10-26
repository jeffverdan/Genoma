import Axios from 'axios';
import axiosInstance from '../http/axiosInterceptorInstance';

async function getCpfDadosUsuario(cpf: string) {

    let data;
    const msgCopyNana = {
        title: 'Ops, seu tempo de login expirou!',
        subtitle: 'Mas não tem problema, basta realizar o login novamente.'
    };
    
    await axiosInstance.post('verificar_usuario_cpf', {
            'cpf': cpf
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => {
            if(res.data?.usuario) {
                data = {...res.data.usuario, uf: res.data.usuario.estado};
                console.log('Dados vindos pelo CPF: ' , data);
            }
        })
        .catch(err => {
            console.log(err);
            data = err;
            data.message = data.response.data.message === "The token has been blacklisted" ? msgCopyNana : data.response.data.message
        })
    return data;
}

export default getCpfDadosUsuario;