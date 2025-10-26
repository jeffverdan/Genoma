import axiosInstance from '../http/axiosInterceptorInstance';

// API SENDO USADA NO AUTOCOMPLETE DE COMISSAO

type UserType = {
    usuario_id: number,
    name: string,
    cpf: string,
    nome_empresarial: string,
    cnpj: string,
    creci: string,
    agencia: string,
    numero_conta: string,
    banco_id: number,
    perfil_id: number,
    perfil: string,
    label: string
}

interface ResponseType {
    gerentes: UserType[],
    gerentes_gerais: UserType[]
}

async function getListGerentesPosVenda(): Promise<ResponseType | undefined> {    
    let data;
    
    await axiosInstance.post('listar_gerentes_gg_comissao', {     
      
      
     }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res !== undefined) {
            if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
              localStorage.clear();
            } else {
                console.log(res.data.data);
                res.data.data.forEach((gerente: any) => {
                    gerente.label = gerente.name ? gerente.name : gerente.nome_empresarial;
                })
                
              data = { 
                gerentes: res.data.data.filter((gerente: any) => gerente.perfil_id === 3),
                gerentes_gerais: res.data.data.filter((gerente: any) => gerente.perfil_id === 4)
              }

            //   data = listaGerentes.map((gerente: any) => { return { id: gerente.id, "label": gerente.name } });
            }
          }
        })

    return data;
}

export default getListGerentesPosVenda;