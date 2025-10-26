import axiosInstance from '../http/axiosInterceptorInstance';


interface ResponseType {
  conflitos: {
    "id": string | number,
    "tipo": "vendedores" | "compradores" | "imóvel",
    "referencia_id": null | string | number,
    "campo": string,
    "valor_recibo": string,
    "valor_cadastro": string,
    "valor_editado": null | string,
    "validar_campos": 0 | 1,
    "processo_id": number | string,
    "ocr_id": number | string
  }[]
  status: "ok"
}

async function getConflitosRecibo(processo_id?: number | string): Promise<ResponseType | undefined> {
  if (!processo_id) return;
  let data;

  await axiosInstance.post('exibir_divergencia', { processo_id }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  }).then(res => {
    if (res?.data) {
      console.log(res.data);
      data = res.data;
    }
  });

  return data;
}

export default getConflitosRecibo;