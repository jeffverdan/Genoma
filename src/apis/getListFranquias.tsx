import axiosInstance from '../http/axiosInterceptorInstance';

// API SENDO USADA NA SAFEBOX E NO GENOMA

export default async function getListFranquias() {
    const usuario_id = localStorage.getItem('usuario_id');
    let data;
    
    await axiosInstance.get('listar_conta_benesh', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    })
        .then(res => {
          if (res !== undefined) {
            if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
              localStorage.clear();
            } else {
                console.log(res);
                data = res.data               
              
            }
          }
        })

    return data || [];
}