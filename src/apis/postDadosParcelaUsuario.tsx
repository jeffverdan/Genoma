import axiosInstance from '../http/axiosInterceptorInstance';

async function PostDadosParcelaUsuario(id: string) {  
  const token = localStorage.getItem('token') || '';
  const usuario_id = localStorage.getItem('usuario_id') || '';
  let result
  
  await axiosInstance.post('dados_parcela_usuario', {
    "usuario_id": usuario_id,
    "parcela_id": id,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then(res => {
    result = res.data;
    console.log(res);
    // setProgressBar([{percent: 100, status: 'success'}]); 
  })
  .catch(function (error) {
    console.log(error);
    // setProgressBar([{percent: 0, status: 'error'}]);
  })

return result;
};

export default PostDadosParcelaUsuario;