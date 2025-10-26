import axiosInstance from '../http/axiosInterceptorInstance';

// API SENDO USADA NA SAFEBOX E NO GENOMA NA LISTA DE FILTRO DE GERENTES DE PÓS VENDA
interface PropsType {
  usuario_id: number;
  parcela_id: number;
  finance_status_id: number;  
  soma?: number;
}

interface ResponseType {
  "status": string,
  "message": string
}

async function postAlterarStatusCorretorPagamento({usuario_id, parcela_id, finance_status_id, soma} : PropsType): Promise<ResponseType | undefined> {    
    let data;
    
    await axiosInstance.post('alterar_status_financeiro', {
      usuario_id,
      parcela_id, 
      finance_status_id,
      soma
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

export default postAlterarStatusCorretorPagamento;