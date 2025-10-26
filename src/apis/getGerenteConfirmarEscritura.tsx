import axiosInstance from '../http/axiosInterceptorInstance';

async function getGerenteConfirmarEscritura() {
  const usuario_id = localStorage.getItem('usuario_id');
  const token = localStorage.getItem('token');
  let data;

  await axiosInstance.get('gerente_confirmar_escritura', {
      headers: {
        Authorization: `Bearer ${token}`,
    }, params: {
      usuario_id: usuario_id,
    }
  }).then(res => {
    if (!res) {
      data = false;
    }
    if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
      data = false
    } else {
      data = res.data;    
    }
  })

  return data;
};

export default getGerenteConfirmarEscritura;