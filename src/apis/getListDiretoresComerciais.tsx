import axiosInstance from '../http/axiosInterceptorInstance';

// API SENDO USADA NA SAFEBOX E NO GENOMA

export default async function getListDiretoresComerciais() {
  const usuario_id = localStorage.getItem('usuario_id');
  let data;

  await axiosInstance.get('listar_diretores_comerciais', {
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
          data = res.data;
          data.forEach((e: any) => {
            if(e.cpf_cnpj?.length > 14) e.cnpj = e.cpf_cnpj
            else e.cpf = e.cpf_cnpj
            e.label = e.name;
            e.nome_empresarial = e.nome_empresa;
          })

        }
      }
    })

  return data || [];
}