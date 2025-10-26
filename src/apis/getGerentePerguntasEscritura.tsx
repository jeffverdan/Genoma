import axiosInstance from '../http/axiosInterceptorInstance';

async function getGerentePerguntasEscritura() {
  //const usuario_id = localStorage.getItem('usuario_id');
  const token = localStorage.getItem('token');
  let data;

  await axiosInstance.get('listar_perguntas', {
      headers: {
        Authorization: `Bearer ${token}`,
    }
  }).then(res => {
    if (!res) {
      data = false;
    }
    if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
      data = false
    } else {
      data = res.data.data;    
    }
  })

  return data;
};

export default getGerentePerguntasEscritura;