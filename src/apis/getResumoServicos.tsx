import Axios from 'axios';
import axiosInstance from '../http/axiosInterceptorInstance';

async function getResumoServicos(params: any) {  
  let data;

  const filtrosIndividuais = Object.entries(params.filters).reduce((acc: any, [key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      value.forEach((item, index) => {
        acc[`${key}[${index}]`] = item.id;
      });
    }
    return acc;
  }, {});

  try {
    const res = await axiosInstance.get('lista_resumida_nucleo_genoma', {
      params: {
        responsavel_id: Number(localStorage.getItem('usuario_id')) || 0,
        page: params.page,
        status_id: params.status,
        logradouro: params.filtro_endereco,
        numero: params.filtro_numero,
        ...filtrosIndividuais,
        usuario_id: params.filtro_cliente,
        ordenacao: params.selectOrder?.patch ? `${params.selectOrder.patch}_${params.selectOrder.id}` : ''
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    }); // Replace with your API endpoint

    // Handle the response data here
    if (res !== undefined) {
      if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
        //localStorage.clear();
      } else {
        data = res.data;
      }
    }
  } catch (error) {
    console.log("endeço");
    // Handle the error here
    console.error(error);
  }

  return data;
};

export default getResumoServicos;