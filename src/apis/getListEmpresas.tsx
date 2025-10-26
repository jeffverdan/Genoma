import axiosInstance from '../http/axiosInterceptorInstance';

type ResponseType = {
  "id": string | number,
  usuario_id: number,
  "nome_empresarial": string,
  label: string,

  "nome": string,
  "created_at": null | string,
  "updated_at": null | string,
  "empresa_id": string | number,
  "cnpj": string,
  "creci": string,
  "verificar_franquia": 0 | 1,
  "pix": string,
  "agencia": string,
  "numero_conta": string,
  "banco_id": string | number,
  "nome_banco": string
}

// API SENDO USADA NA SAFEBOX E NO GENOMA

export default async function getListEmpresas(): Promise<ResponseType[]> {
    const usuario_id = localStorage.getItem('usuario_id');
    let data;
    
    await axiosInstance.get('listar_empresas', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    })
        .then(res => {
          if (res !== undefined) {
            if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
              localStorage.clear();
            } else {
                console.log(res);
                data = res.data.dados_lojas.map((empresa: any) => ({...empresa, usuario_id: empresa.id | empresa.usuario_id,  label: empresa.nome_empresarial }))               
              
            }
          }
        })

    return data || [];
}