import { ArrayResponsaveisPagamentoType } from '@/interfaces/Financeiro/Status';
import axiosInstance from '../http/axiosInterceptorInstance';

interface PropsType {
    pendencia_id: number
    parcela_id: number
    usuario_id: string
}

async function concluirPendencia(props: PropsType) {
    const { pendencia_id, parcela_id, usuario_id } = props;
    let data;
    await axiosInstance.post('concluir_pendecia', {
        pendencia_id,
        parcela_id,
        usuario_id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
    .then(res => {
        if (!!res.data) {
            data = res.data;
        }
    })   
    .catch(error => {
        console.log(error);
    })

    return data;
}
export default concluirPendencia