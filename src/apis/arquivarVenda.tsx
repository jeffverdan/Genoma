import axiosInstance from '../http/axiosInterceptorInstance';

type Props = {
    id: number
}

async function ArquivarVenda(props: Props) {  
  const token = localStorage.getItem('token');
  const usuario_id = localStorage.getItem('usuario_id');
  let result
  
  await axiosInstance.post('arquivar_adicionados', {
    "usuario_id": usuario_id,
    "processo_id": props.id,
  }, {
    headers: { Authorization: `Bearer ${token}` },
    onUploadProgress: (progressEvent) => {
      const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0)) * 100);
      // setProgressBar([{percent: percentage, status: 'active'}]);
    },
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

export default ArquivarVenda;