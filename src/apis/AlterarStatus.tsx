import { DataToSave } from '@/interfaces/PosVenda/AlterarStatus';
import axiosInstance from '../http/axiosInterceptorInstance';

async function AlterarStatus(props: DataToSave) {
    let data;
    
    
    await axiosInstance.post('salvar_status_processo', {
        responsavel_alteracao_id: localStorage.getItem('usuario_id'),
        ...props,
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    })
        .then(res => {
            if (res?.data?.status) {
                localStorage.clear();
            } else {
                data = res?.data;
            }
        })
        .catch(function (error) {
            console.log(error);
        })

    return data;
};

export default AlterarStatus;