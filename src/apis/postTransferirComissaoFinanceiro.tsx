import axiosInstance from '../http/axiosInterceptorInstance';

interface PropsType {  
  parcela_id: string | number
  usuario_id?: string | number
  empresa_id?: string | number
  tipo: string
  valor_transferido: string // Valor que será transferido, pode ser o valor total ou parcial
  data_transferencia: string // AAAA/MM/DD
  valor_total: string
  observacao?: string
  documento_id?: string | number
  financeiro_id?: string | number
}

interface ResponseType {
  "status": string,
  "message": string
}

async function TransferirComissao(props : PropsType): Promise<ResponseType | undefined> {    
    let data;
    
    await axiosInstance.post('alterar_status_financeiro', {
      ...props,
      finance_status_id: 12, // "Transferido"
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
              console.log("TransferirComissao: ", res);
              data = res.data;
              
            }
          }
        })

    return data;
}

export default TransferirComissao;