import axiosInstance from '../http/axiosInterceptorInstance';

interface PropsType {
  id: string | number
  tipo: 'vendedores' | 'compradores' | 'imóvel' | 'documento'
  referencia_id: string | number
  campo: string
  valor_recibo: string | number
  valor_cadastro: string | number
  valor_edit: string | number
  validar_campos: boolean // CHECK IA - TRUE = GERENTE CONFIRMA DADOS CADASTRADOS ESTÃO CERTOS E DADOS DA IA ERRADA
  processo_id: string | number
  ocr_id?: string | number
}

type ResponseType = {
  id: number | string
  msg: string
  status: boolean
}

async function saveConflitos(data: PropsType): Promise<ResponseType | undefined> {
  
  const token = localStorage.getItem('token');
  let result
  
  await axiosInstance.post('salvar_divergencia', {
    ...data,
    usuario_id: localStorage.getItem('usuario_id')
  }, {
    headers: { Authorization: `Bearer ${token}` },
    onUploadProgress: (progressEvent) => {
    //   const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0)) * 100);
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

export default saveConflitos;