import axiosInstance from '../http/axiosInterceptorInstance';

type progress = {
  percent: number
  status: string
}

interface Props {
  data: FormData
  setProgressBar: (prevState: [progress]) => void
}

async function SaveComprovantePagamento(props: Props) {
  const { data, setProgressBar } = props;
  const token = localStorage.getItem('token');
  let result
  console.log(data);
  
  await axiosInstance.post('salvar_comprovante_pagamento', data, {
    headers: { Authorization: `Bearer ${token}` },
    onUploadProgress: (progressEvent) => {
      const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0)) * 100);
      setProgressBar([{percent: percentage, status: 'active'}]);
    },
  })
  .then(res => {
    result = res.data;
    console.log(res);
    setProgressBar([{percent: 100, status: 'success'}]); 
  })
  .catch(function (error) {
    console.log(error);
    setProgressBar([{percent: 0, status: 'error'}]);
  })

return result;
};

export default SaveComprovantePagamento;