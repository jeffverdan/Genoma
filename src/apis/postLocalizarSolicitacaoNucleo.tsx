import Pessoa from '@/interfaces/Users/userData';
import axiosInstance from '../http/axiosInterceptorInstance';

async function PostLocalizarSolicitacaoNucleo(idProcesso: any) {
    let data;
    
    await axiosInstance.post('localizar_processo', {
            'processo_id': idProcesso
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res => {
            data = res.data;
        })
        .catch(err => {
            console.log(err);
        })
    return data;
}

export default PostLocalizarSolicitacaoNucleo;