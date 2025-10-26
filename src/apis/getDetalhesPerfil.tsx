import axiosInstance from '../http/axiosInterceptorInstance';

async function getDetalhesPerfil(usuarioId: string) {
    let data;
    await axiosInstance.get('dados_perfil', {
        params: {
            usuario_id: usuarioId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    })
    .then(res => {
        if (res !== undefined) {
            if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
                localStorage.clear();
            } else {
                data = res.data;
            }
        }
    })   
    .catch(error => {
        console.log(error);
    })

    return data;
}
export default getDetalhesPerfil