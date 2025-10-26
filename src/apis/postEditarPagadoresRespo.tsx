import { ArrayResponsaveisPagamentoType } from '@/interfaces/Financeiro/Status';
import axiosInstance from '../http/axiosInterceptorInstance';

interface PropsType {
    responsaveis_pagamento: ArrayResponsaveisPagamentoType[]
    parcela_id: number
}

async function editarPagadoresResponsaveis(props: PropsType) {
    const { responsaveis_pagamento, parcela_id } = props;
    let data = {
        status: false,
        message: ''
    };
    await axiosInstance.post('salvar_pagadores_pendencia', {
        responsaveis_pagamento,
        parcela_id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
    .then((res: { data: { status: boolean, message: string }}) => {
        if (!!res.data) {
            data = res.data;
        }
    })   
    .catch(error => {
        console.log(error);
    })

    return data;
}
export default editarPagadoresResponsaveis