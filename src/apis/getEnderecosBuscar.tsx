import Axios from 'axios';
import axiosInstance from '../http/axiosInterceptorInstance';

// TYPE PEGA PERFIS DE GERENTES E POSVENDA
type DataListagem = {
  tipo_listagem?: 'rascunhos' | 'entregues' | 'arquivados' | 'revisoes' | 'finalizados' | 'andamento' | 'finalizadas' | 'revisoes' | 'cancelados';
  envio_planilha?: number
  buscar?: string
};

async function getEnderecosBuscar({tipo_listagem, envio_planilha,buscar}: DataListagem) {  
  let data;

  /* await Axios.get(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'lista_enderecos', {
    params: {
      usuario_id,
      tipo_listagem,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  }).then(res => {
    if (res !== undefined) {
      if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
        //localStorage.clear();
      } else {        
        data = res.data;
      }
    }
  }).catch(err => {
    console.log(err);
  }) */

  try {
    const res = await axiosInstance.get('buscar_endereco_listagem', {
      params: {
        usuario_id: localStorage.getItem('usuario_id'),
        tipo_listagem,
        envio_planilha,
        buscar
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

export default getEnderecosBuscar;