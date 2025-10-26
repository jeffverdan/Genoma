import axiosInstance from '../http/axiosInterceptorInstance';

export default async function enviarPlanilhaApoio(idParcela: string | number) {    
    let data;
    
    await axiosInstance.get('salvar_planilha', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
            parcela_id: idParcela,
            usuario_id: localStorage.getItem('usuario_id') || ''
        }
    })
        .then(res => {
          if (res !== undefined) {
            if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
              localStorage.clear();
            } else if(res) {
                console.log(res);
              
            }
          }
        })

    return data || [];
}