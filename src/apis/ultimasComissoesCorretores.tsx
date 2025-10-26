import { ItemListRecentsType, VendedorApiArr } from '@/interfaces/Corretores';
import axiosInstance from '../http/axiosInterceptorInstance';
import formatoMoeda from '@/functions/formatoMoedaViewApenas';
// import formatoMoeda from '@/functions/formatoMoeda';

type Props = {
  ano: number
  tipo?: "andamento" | "finalizado" | "cancelado"
}

type ResponseApi = {
  data: {
    listagem: [{
      "processo_id": string | number,
      "imovel_id": number,
      "logradouro": string,
      "numero": string | null,
      "unidade": string | null,
      "complemento": string | null,
      "bairro": string,
      "cidade": string,
      "uf": string,
      "dia_pagamento": string | null, // DD/MM/AAAA
      "valor_gg": string | null,
      "valor_gerente": string | null,
      "valor_vendedor": string | null,
      "valor_opcionista": string | null,
      "soma": string,
      "cod_imovel": string,
      "valor_venda": string,
      "data_assinatura": string,
      "valor_anunciado": string,
      "previsao_escritura": string, // DD/MM/AAAA
      "vendedores": VendedorApiArr[]
      tipo_comissao: "partes" | "integral"
      numero_parcela: string
      total_parcelas: number
      parcela_id: number
      documentos: {
        data: {
          arquivo: string,
          id: number,
          identifica_documento: string,
          identifica_documento_id: string,
          identificacao: string | null,
          link: string | null ,
          nome_original: string,
          nome_tipo: string | null,
          solicitacao_id: string | null,
          tipo_documento_id: string | null,
          tipo_documento: {
            id: number,
            documento_id: number,
            tipo_documento_id: number,
            processo_id: number,
            data_emissao: number | string | null,
            validade_dias: number | string | null,
            data_vencimento: number | string | null,
            nome: string
          }
        }[]
      }

      "dados_corretor": {
        "name": string,
        "cpf": string | null,
        "creci": string | null,
        "nome_empresa": string | null,
        "cnpj": string | null,
        "tipo_pessoa": 0 | 1
    }
    }],
    somatorio_total: string | null
  }
};

type ReturnType = {
  list: ItemListRecentsType[] | [],
  valorTotal: string | undefined
}

async function ultimasComissoesCorretores(props: Props): Promise<ReturnType> {
  const token = localStorage.getItem('token');
  const usuario_id = localStorage.getItem('usuario_id');
  const { ano, tipo } = props;

  let result: ReturnType = {
    list: [],
    valorTotal: "-----"
  };

  const returnType = () => {
    switch (tipo) {
      case 'andamento':
        return 'andamento';
      case 'finalizado':
        return 'concluidos';
      case 'cancelado':
        return 'cancelados';
      default:
        return 'producao-anual';
    }
  };

  await axiosInstance.post('ultimas_comissoes', {
    usuario_id,
    ano,
    filtro_listagem: tipo || ''
  }, {
    headers: { Authorization: `Bearer ${token}` },
    onUploadProgress: (progressEvent) => {
      const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0)) * 100);
      // setProgressBar([{percent: percentage, status: 'active'}]);
    },
  })
    .then((res: ResponseApi) => {
      console.log(res);
      
      result = {
        list: res.data.listagem.map((item) => ({
          id: item.processo_id,
          imovel_id: item?.imovel_id,
          logradouro: item.logradouro,
          numero: item.numero,
          complemento: item.complemento,
          bairro: item.bairro,
          unidade: item.unidade,
          type: returnType(),
          estado: item.uf,
          valor: formatoMoeda(item.soma)?.replace('R$', '').trim(),
          data: (item.dia_pagamento === '00/00/0000' ? item.previsao_escritura : item.dia_pagamento) || 'Não definida',
          cod_imovel: item.cod_imovel,
          data_assinatura: item.data_assinatura || 'Não definida',
          previsao_escritura: item.previsao_escritura || 'Não definida',
          valor_venda: formatoMoeda(item.valor_venda)?.replace('R$', '').trim(),
          valor_anunciado: formatoMoeda(item.valor_anunciado)?.replace('R$', '').trim(),
          vendedores: item.vendedores,
          tipo_comissao: item.tipo_comissao,
          numero_parcela: item.numero_parcela,
          dados_corretor: item.dados_corretor,
          total_parcelas: item.total_parcelas,
          documentos: item?.documentos,
          parcela_id: item?.parcela_id,
        })),
        valorTotal: res.data.somatorio_total ? formatoMoeda(res.data.somatorio_total).replace('R$', '').trim() : '-.---,--'
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

export default ultimasComissoesCorretores;