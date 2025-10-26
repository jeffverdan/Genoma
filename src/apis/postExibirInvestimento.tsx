import { ItemListRecentsType, VendedorApiArr } from '@/interfaces/Corretores';
import axiosInstance from '../http/axiosInterceptorInstance';
import formatoMoeda from '@/functions/formatoMoedaViewApenas';

async function PostExibirInvestimento(imovel_id: number) {

  const token = localStorage.getItem('token');
  const usuario_id = localStorage.getItem('usuario_id');

  let data;

  await axiosInstance.post('exibir_investimento', {
    imovel_id,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      console.log(res);
      data = res.data
    })
    .catch(function (error) {
      console.log(error);
    })
  console.log(data);
  return data;
};

export default PostExibirInvestimento;