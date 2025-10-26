import { ComissaoDataType, DadosProcessoType } from '@/interfaces/Apoio/planilhas_comissao';
import axiosInstance from '../http/axiosInterceptorInstance';

const formasPagamento = [
  { name: 'Selecione', id: '' },
  { name: 'Espécie', id: 'especie' },
  { name: 'Depósito', id: 'deposito' },
  { name: 'TED/DOC', id: 'ted_doc' },
  { name: 'PIX', id: 'pix' },
  { name: 'Cheque/Cheque adm.', id: 'cheque' },
];

const listOpcionistasPercents = ([
  { value: 'simples', label: 'Simples', percent: 16 },
  { value: 'com_chave', label: 'Com chave', percent: 18 },
  { value: 'exclusividade', label: 'Exclusividade', percent: 20 },
  { value: 'lançamento', label: 'Lançamento', percent: 8 },
]);

interface ResponseType {
  comissao: ComissaoDataType
  imovel: DadosProcessoType
}

export default async function getDataPlanilhaComissao(processo_id: number | string): Promise<ResponseType | undefined> {  
  let data;

  await axiosInstance.post('retornar_comissao', { processo_id: processo_id }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  }).then(res => {
    if (res?.data && res.data.comissao && res.data.dados_processo) {
      console.log(res.data);
      const { comissao, dados_processo } = res.data;
      data = { 
        comissao: {
          ...comissao,
          comissao: comissao.comissao || 'integral',
          quantidade_parcelas: comissao.quantidade_parcelas?.length,
          tipo_pagamento: comissao.comissao === 'partes' ? 'Parcelada' : !!comissao.comissao ? 'Integral' : '',
          forma_pagamento: formasPagamento.find(e => e.id === comissao.liquida)?.name || '',
          porcentagem_corretores_opicionistas_comissao: listOpcionistasPercents.find((e) => e.value === comissao.porcentagem_corretores_opicionistas_comissao)?.percent
        },
        imovel: dados_processo
      }
    }
  });

  return data;
}