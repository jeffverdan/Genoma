import axiosInstance from '../http/axiosInterceptorInstance';

async function getListaClientesNucleo(status_id: Number) {
    // console.log(status_id)
    let data;
    await axiosInstance.get('filtro_clientes_nucleo',{
        params: {
            status_id: status_id,
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
                const listaClientes = res.data;
                data = listaClientes.map((cliente: any) => { return { id: cliente.id, "label": cliente.nome } });
            }
        }
    })   
    .catch(error => {
        console.log(error);
    })

    return data;
}
export default getListaClientesNucleo