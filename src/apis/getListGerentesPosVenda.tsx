import axiosInstance from '../http/axiosInterceptorInstance';

// API SENDO USADA NA SAFEBOX E NO GENOMA NA LISTA DE FILTRO DE GERENTES DE PÓS VENDA
interface PropsType {
  tipo_listagem?: 'andamento' | 'revisao' | 'concluidos' | 'cancelados'
}

async function getListGerentesPosVenda({tipo_listagem} : PropsType) {    
    let data;
    
    await axiosInstance.post('listar_gerentes_genoma', {
      tipo_listagem,
      loja_id: localStorage.getItem('loja_id'), 
      perfil_login_id: localStorage.getItem('perfil_login_id')
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
                console.log(res);
                
              const listaGerentes = res.data.data;
              data = listaGerentes.map((gerente: any) => { return { id: gerente.id, "label": gerente.name } });
            }
          }
        })

    return data;
}

export default getListGerentesPosVenda;