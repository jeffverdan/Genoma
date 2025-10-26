import axiosInstance from '../http/axiosInterceptorInstance';

interface ResponseType {
  nome: string,
  ocr: string
  processo_id: number,
  tipo: 'recibo'
}

async function getOCR(processo_id?: number | string): Promise<ResponseType | undefined> {
  if (!processo_id) return;
  let data;

  await axiosInstance.get('exibir_ocr/' + processo_id, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  }).then(res => {
    if (res?.data) {
      console.log(res.data);
      data = res.data?.ocr;
    }
  });

  return data;
}

export default getOCR;