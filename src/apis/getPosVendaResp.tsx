import axiosInstance from '../http/axiosInterceptorInstance';

type resType = {
  id: number | string,
  label: string,
  a_vista: boolean,
  financiado: boolean
  processos_em_andamento: number,
  firstName: string,
  secondName: string | undefined
}

// LISTA DE RESPONSAVEIS DO POS VENDA
async function getPosVendaResp(tipoListagem?: string) {
  const token = localStorage.getItem('token');
  let data;

  await axiosInstance.post('listar_responsaveis', {
    'tipo_listagem': tipoListagem ? tipoListagem : ''
  }, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => {
    if (res !== undefined) {
      if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
        
      } else {
        const lista_responsaveis = res.data.data;
        data = lista_responsaveis.map((usuario: any) => ({
           id: usuario.id, 
           label: usuario.name,
           a_vista: !!usuario.a_vista,
           financiado: !!usuario.financiado,
           processos_em_andamento: usuario.total_processos_andamento,
           firstName: usuario.name.split(' ')[0],
           secondName: usuario.name.split(' ')[1]?.length > 2 ? usuario.name.split(' ')[1] : usuario.name.split(' ')[2]
          }));
      }
    }
  }).catch(err => {
    console.log(err);
  })

  return data as resType[] | undefined;
};

export default getPosVendaResp;