import { EnderecoFilterData } from '@/interfaces/PosVenda/FiltroEndereco';
import axiosInstance from '../http/axiosInterceptorInstance';
import { FiltersKeys, FiltersToolbar, FiltersType } from '@/components/Filters/interfaces';
import { ArrDocs, retornoApi } from '@/interfaces/PosVenda/Agenda';
import dayjs from 'dayjs';
import { tratamentoApiMapaPrioridades } from '@/functions/returnDeadLines';

type DataListagem = 'andamento' | 'finalizadas' | 'revisoes' | 'cancelados' | undefined;


interface DataFilter extends FiltersToolbar {
  endereco?: EnderecoFilterData | string | null
}



type ArrFilterType = {
  filtro: FiltersKeys,
  param: string
}
// const arrFilter: FiltersKeys[] = ['filtro_gerente', 'filtro_responsavel', 'filtro_status', 'filtro_status_rascunho', 'filtro_pagamento', 'filtro_recibo', 'filtro_correcoes'];
const arrFilterPos: ArrFilterType[] = [
  { filtro: 'filtro_gerente', param: 'gerente_id' },
  { filtro: 'filtro_responsavel', param: 'responsavel_id' },
  { filtro: 'filtro_status', param: 'status_id' },
  { filtro: 'filtro_pagamento', param: 'forma_pagamento_id' },  
  { filtro: 'filtro_clientes', param: 'array_clientes' },  
  { filtro: 'filtro_laudemio', param: 'tipo_laudemio' },
  { filtro: 'filtro_prazo_status', param: 'prazo_status' }
]

let data: any;

async function getListaVendasPosVenda(
  tipo_listagem: 'andamento' | 'finalizadas' | 'revisoes' | 'cancelados' | undefined,
  page: number,
  filters?: DataFilter,
  selectOrder?: { patch: string, id: number }
) {
  let arrayData = new FormData();
  console.log(selectOrder);


  arrayData.append('usuario_id', localStorage.getItem('usuario_id') || '');
  arrayData.append('tipo_listagem', tipo_listagem?.toString() || '');
  arrayData.append('page', page.toString());
  arrayData.append('filtro_endereco', typeof filters?.endereco === 'string' ? filters?.endereco : filters?.endereco?.logradouro || "");
  arrayData.append('filtro_numero', typeof filters?.endereco === 'string' ? '' : filters?.endereco?.numero || "");
  arrayData.append('ordenacao', selectOrder?.patch ? `${selectOrder.patch}_${selectOrder.id}` : '');

  // arrayData.append('gerente_id', 
  // arrayData.append('forma_pagamento_id',
  // arrayData.append('responsavel_id',
  // arrayData.append('status_id',
  console.log(filters);

  arrFilterPos.forEach((key: ArrFilterType) => {
    (filters?.[key.filtro] as FiltersType[])?.forEach((e, index) => {
      if (e.cpf_cnpj) {
        arrayData.append(`${key.param}[${index}]`, e.cpf_cnpj)
      } else if (e.id) {
        arrayData.append(`${key.param}[${index}]`, (e.id || '').toString())
      } else if (e.label) {
        arrayData.append(`${key.param}[${index}]`, e.label)
      }
    })
  });

  

  // API SENDO USADA NA SAFEBOX E GENOMA
  await axiosInstance.post('dados_painel_teste', arrayData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    onUploadProgress: (progressEvent) => {
      // const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0 )) * 100);      
      // progressBar[index_Doc] = { percent: percentage, status: 'active', error: '' };
      // setProgressBar([...progressBar]);
    },

  })
    .then(res => {
      console.log('dados_painel_teste: ', res);
      // data = res.data;
      if (res.data)
        data = {
          last_page: res.data.total_pagina,
          total: res.data.total_processos_filtrados,

        data: res.data.processos.data.map((process: any, index: number) => ({
          ...process,
          id: process.id,
          posvendaName: process.responsavel_atual_nome,
          posvendaName1: process.responsavel_atual_nome?.split(" ")[0],
          posvendaName2: process.responsavel_atual_nome?.split(" ")[1]?.length > 2 ? process.responsavel_atual_nome.split(" ")[1] : process.responsavel_atual_nome?.split(" ")[2],
          dataEntrada: res.data.data_entrada[index]?.split(" ")[0],
          horaEntrada: res.data.data_entrada[index]?.split(" ")[1],
          gerente: process.gerente_atual_nome.split(" ")[0],
          gerenteName2: process.gerente_atual_nome.split(" ")[1],
          gerenteId: Number(process.gerente_atual),
          nomeCompletoGerente: process.gerente_atual_nome,
          endereco: `${process.logradouro}, ${process.numero}${process.unidade ? " / " + process.unidade : ""}`,
          complemento: `${!!process.complemento ? process.complemento + ', ' : ""}${process.bairro}`,
          statusPosVenda: process.status_nome,
          prazoStatus: process.data_expiracao_status,
          formaPagamento: process.forma_pagamento?.trim().split(","),
          responsavelPosVendaId: process.responsavel_atual,
          // dataStatusAlterado: process.data_alteracao_status,
          dataAssinatura: process.data_assinatura,
          dataStatusAlterado: process.data_mudanca_status,
          dataCancelamento: process.data_cancelamento,
          // reciboId: process.recibo_id,
          // origemRecibo: process.recibo_type === 'manual' ? 'Manualmente' : 'DocuSign',
          imovel: process.devolucao_imovel === 1,
          recibo: process.devolucao_recibo === 1,
          comprador: process.devolucao_comprador === 1,
          vendedor: process.devolucao_vendedor === 1,
          // comissaoId: process.comissao?.id,
          // foguetes: process.foguete,
          // recibo_type: process.recibo_type,
          // envelope_id: process.envelope_id,
          progress_status_progresses_id: process.progress_status_progresses_id,
          statusProcessoAtual: process.status_processo_atual,
          visualizado: process.status_visualizacao_atual === 1,
          laudemios: process.laudemios,
          dataEscritura: dayjs(process.data_assinatura_original).add(Number(process.prazo_escritura), 'day'),
          ...tratamentoApiMapaPrioridades(process)
        }))
      }
      // progressBar[index_Doc] = { percent: 100, status: 'success', error: '' };
      // setProgressBar([...progressBar]);
    })
    .catch(function (error) {
      console.log(error);
      // progressBar[index_Doc] = { percent: 0, status: 'error', error: '' };
      // setProgressBar([...progressBar]);
    })

  return data;
}

export default getListaVendasPosVenda;