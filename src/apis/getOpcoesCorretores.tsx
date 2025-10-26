import { ItemListRecentsType, ReturnTypeOpcoes, VendedorApiArr } from '@/interfaces/Corretores';
import axiosInstance from '../http/axiosInterceptorInstance';
import formatoMoeda from '@/functions/formatoMoedaViewApenas';
// import formatoMoeda from '@/functions/formatoMoeda';

type Props = {
  ano: string
}

async function getOpcoesCorretores(props: Props): Promise<ReturnTypeOpcoes> {
    const token = localStorage.getItem('token');
    const usuario_id = localStorage.getItem('usuario_id');
    const { ano } = props;

    let result: ReturnTypeOpcoes = {
            porcentagem_quente: null,
            porcentagem_morno: null,
            porcentagem_frio: null,

            valor_quente: '',
            valor_morno: "",
            valor_frio: "",

            soma_total: "",
            quantidade_total: 0,
            quantidade_quente: 0,
            quantidade_morno: 0,
            quantidade_frio: 0,
            diferenca_vgv: 0,
    };

  await axiosInstance.post('dashboard_corretor', {
    usuario_id,
    ano,
  }, {
    headers: { Authorization: `Bearer ${token}` },
    // onUploadProgress: (progressEvent) => {
    //   const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0)) * 100);
    //   // setProgressBar([{percent: percentage, status: 'active'}]);
    // },
  })
    .then((res: {data: ReturnTypeOpcoes}) => {
      console.log(res);
      
      result = {
          porcentagem_quente: res.data.porcentagem_quente,
          porcentagem_morno: res.data.porcentagem_morno,
          porcentagem_frio: res.data.porcentagem_frio,

          valor_quente: res.data.valor_quente ? formatoMoeda(res.data.valor_quente).replace('R$', '').trim() : '-.---,--',
          valor_morno: res.data.valor_morno ? formatoMoeda(res.data.valor_morno).replace('R$', '').trim() : '-.---,--',
          valor_frio: res.data.valor_frio ? formatoMoeda(res.data.valor_frio).replace('R$', '').trim() : '-.---,--',

          soma_total: res.data.soma_total ? formatoMoeda(res.data.soma_total).replace('R$', '').trim() : '-.---,--',
          quantidade_total: res.data.quantidade_total || 0,
          quantidade_quente: res.data.quantidade_quente || 0,
          quantidade_morno: res.data.quantidade_morno || 0,
          quantidade_frio: res.data.quantidade_frio || 0,

          diferenca_vgv: res.data.diferenca_vgv ? Number(res.data.diferenca_vgv) : 0,
        //    usuario_id: res.data.usuario_id,
      }
      // setProgressBar([{percent: 100, status: 'success'}]); 
    })
    .catch(function (error) {
      console.log(error);
      // setProgressBar([{percent: 0, status: 'error'}]);
    })
  console.log(result);
  return result;
};

export default getOpcoesCorretores;