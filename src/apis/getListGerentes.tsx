import axiosInstance from '../http/axiosInterceptorInstance';

// API SENDO USADA NA SAFEBOX E NO GENOMA
interface PropsType {
  completa?: boolean // ATIVA LISTA COMPLETA DE GERENTES
}

async function getListGerentes({completa} : PropsType) {
    const usuario_id = localStorage.getItem('usuario_id');
    let data;
    
    await axiosInstance.post('listar_gerentes', {
      gg_id: completa ? undefined : usuario_id,
      // perfil: 'diretor_geral'
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
              data = listaGerentes.map((gerente: any) => { return { "usuario_id": gerente.id, id: gerente.id, "label": gerente.name } });
            }
          }
        })

    return data || [];
}

export default getListGerentes;