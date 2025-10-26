import axiosInstance from '../http/axiosInterceptorInstance';

interface PropsType {
  usuario_id: number | string;
  parcela_id: number | string; 
  finance_status_id: number | string; 
  observacao?: string; 
  financeiro_id: string;
}

interface ResponseType {
  "status": string,
  "message": string
}

async function AlterarStatusFinanceiro(props : PropsType): Promise<ResponseType | undefined> {    
    let data;
    
    await axiosInstance.post('alterar_status_financeiro', {
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

export default AlterarStatusFinanceiro;