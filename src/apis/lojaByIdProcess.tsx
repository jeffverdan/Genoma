import axiosInstance from '../http/axiosInterceptorInstance';

interface LojaType  {
  id: number | string,
  nome: string,
  empresa_id: number | string,
}

async function LojaByIDProcess(processo_id: Number): Promise<LojaType | undefined> {  
  const token = localStorage.getItem('token');  
  let result
  
  await axiosInstance.post('retornar_loja', {    
    processo_id
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

export default LojaByIDProcess;