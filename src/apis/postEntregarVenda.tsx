import axiosInstance from '../http/axiosInterceptorInstance';
import FormValues from '@/interfaces/Vendas/EntregarVenda'

async function EntregarVenda(data: FormValues) {
  
  const token = localStorage.getItem('token');
  let result
  
  await axiosInstance.post('entregar_venda', {
    ...data,
    usuario_id: localStorage.getItem('usuario_id')
  }, {
    headers: { Authorization: `Bearer ${token}` },
    onUploadProgress: (progressEvent) => {
      const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0)) * 100);
      // setProgressBar([{percent: percentage, status: 'active'}]);
    },
  })
  .then(res => {
    result = res?.data;
    console.log(res);
    // setProgressBar([{percent: 100, status: 'success'}]); 
  })
  .catch(function (error) {
    console.log(error);
    // setProgressBar([{percent: 0, status: 'error'}]);
  })

return result;
};

export default EntregarVenda;