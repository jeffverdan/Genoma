import Axios from 'axios';

async function getDetailedServices() {
  let servicos;

  await Axios.get(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'servicos_detalhados', {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  })
    .then(res => {
      if (res !== undefined) {
        if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
          localStorage.clear();
        } else {
          servicos = res.data.data;
        }
      }
    })
  return servicos;
};
export default getDetailedServices;