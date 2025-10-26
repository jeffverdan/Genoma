import axiosInstance from '../http/axiosInterceptorInstance';

async function getLojas() {
  let lojas;
  try {
    const res = await axiosInstance.get('listar_lojas', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    if (res !== undefined) {
      if (res.data?.status && (res.data.status === 498 || res.data.status === 401)) {
        //localStorage.clear();
      } else {
        lojas = res.data.data.map((e: any) => ({ ...e, label: e.nome }));
      }
    }
  } catch (error) {
    console.error(error);
  }

  return lojas;
};

export default getLojas;