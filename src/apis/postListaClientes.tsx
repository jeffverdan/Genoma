import axiosInstance from '../http/axiosInterceptorInstance';

async function postListaClientes() {
    let data;
    await axiosInstance.post('cliente_filtro', {
        'token': localStorage.getItem('token')
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
    .then(res => {
        if (res !== undefined) {
            if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
                localStorage.clear();
            } else {
                const listaClientes = res.data;
                data = listaClientes.map((cliente: any) => { return { id: cliente.id, "label": cliente.name } });
            }
        }
    })   
    .catch(error => {
        console.log(error);
    })

    return data;
}
export default postListaClientes