import axiosInstance from '../http/axiosInterceptorInstance';

type Props = {
  envelopeId: number | string;
  justificativa_cancelamento: string
}

async function cancelarDocusign(props: Props) {  
  const token = localStorage.getItem('token');
  const { envelopeId, justificativa_cancelamento } = props;
  let result
  
  await axiosInstance.post('cancelar_envelope', {
    envelopeId,
    justificativa_cancelamento
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

export default cancelarDocusign;