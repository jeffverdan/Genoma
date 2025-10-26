import { ItemListRecentsType, VendedorApiArr } from '@/interfaces/Corretores';
import axiosInstance from '../http/axiosInterceptorInstance';
import formatoMoeda from '@/functions/formatoMoedaViewApenas';

type ListaOpcoes = {
    imovel_id: number,
    logradouro: string,
    numero: string,
    unidade: string,
    complemento: string,
    bairro: string,
    cidade: string,
    uf: string,
    cod_imovel: string,
    valor_anunciado: string,
    tipo_imovel: string,
    data_criacao_midas: string,
    data_atualizacao: string,
    data_atualizacao_formato_banco: string,
    tipo_opcao: string,
    link_anuncio: string,
    link_imagem_miniatura: string,
    link_imagem_principal: string,
    status_midas: string,
    temperatura_calculada: string

}

async function PostListaOpcoes(tab: string) {
  // TAB
  // 1 - FRIO
  // 2 - MORNO
  // 3 - QUENTE

  console.log('TAB: ', tab)

  const token = localStorage.getItem('token');
  const usuario_id = localStorage.getItem('usuario_id');

  let data;

  await axiosInstance.post('listagem_opcoes', {
    usuario_id,
    temperatura: tab
  }, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      res.data = res.data.map((item: ListaOpcoes) => ({
        ...item,
        valor_anunciado: formatoMoeda(item.valor_anunciado)?.replace('R$', '').trim(),
      }))
      data = res.data;
    })
    .catch(function (error) {
      console.log(error);
    })
  return data;
};

export default PostListaOpcoes;