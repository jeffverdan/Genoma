import axiosInstance from '../http/axiosInterceptorInstance';

interface PropsType {
  parcela_id: number | string; 
  finance_status_id: number | string; 
  observacao?: string; 
  data_cancelamento?: string;
  responsaveis_boletos_editados?: number[] | null;
}

interface ResponseType {
  "status": string,
  "message": string
}

// 15 - Concluido
// 8 - Cancelado
// 7 - Pago

async function AlterarStatusFinanceiroParcela(props : PropsType): Promise<ResponseType | undefined> {    
    let data;
    
    await axiosInstance.post('alterar_status_parcela', {
      usuario_id: localStorage.getItem('usuario_id'),
      ...props
     }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res !== undefined) {
            if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
              // localStorage.clear();
            } else {
              console.log("AlterarStatusFinanceiro: ", res);
              data = res.data;
              
            }
          }
        })

    return data;
}

export default AlterarStatusFinanceiroParcela;