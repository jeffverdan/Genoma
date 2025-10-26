import Axios from 'axios';
// import Serve from '../app/serve';

async function getTypeServices() {
  let servicos;    

  await Axios.get(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'tipo_servicos', {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
})
    .then(res => {
        if (res !== undefined) {
            if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
                localStorage.clear();
            } else {
                const listaTipoServico = res.data.data;
                servicos = listaTipoServico.map((servico: any) => { return { "id": servico.id, "nome": servico.nome } });                
            }
        }
    })
  return servicos;
};
export default getTypeServices;