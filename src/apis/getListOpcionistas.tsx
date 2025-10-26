import axiosInstance from '../http/axiosInterceptorInstance';

async function getListOpcionistas() {
    let data;
    
    await axiosInstance.get('lista_opcionista', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res !== undefined) {
            if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
              localStorage.clear();
            } else {
              const opcionistas = res.data;
              
              opcionistas.forEach((e: any) => {
                if(e.cpf_cnpj.length > 14) e.cnpj = e.cpf_cnpj
                else e.cpf = e.cpf_cnpj
                e.label = e.nome;
                e.nome_empresarial = e.nome_empresa;
              })
              data = opcionistas.filter((item: any )=> !!item.nome || !!item.nome_empresa);
            }
            // console.log(data);
            
          }
        })

    return data;
}

export default getListOpcionistas;