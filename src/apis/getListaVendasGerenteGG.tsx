import { DataListagem } from '@/interfaces/Vendas/MenuPrincipal';
import axiosInstance from '../http/axiosInterceptorInstance';
import { FiltersKeys, FiltersToolbar, FiltersType } from '@/components/Filters/interfaces';
import { EnderecoFilterData } from '@/interfaces/PosVenda/FiltroEndereco';


interface DataFilter extends FiltersToolbar {
  endereco?: EnderecoFilterData | null
}


const arrFilter: FiltersKeys[] = ['filtro_gerente', 'filtro_responsavel', 'filtro_status', 'filtro_status_rascunho', 'filtro_pagamento', 'filtro_recibo', 'filtro_correcoes'];

let data: any;

async function getListaVendasGerenteGG(
  usuario_id: number | undefined,
  tipo_listagem: DataListagem,
  page: number,
  filters?: DataFilter,
  selectOrder?:{ patch: string, id: number }
) {
  let arrayData = new FormData();

  const lojaId = localStorage.getItem('loja_id') || '';
  const perfilLoginId = localStorage.getItem('perfil_login_id') || '';
  const usuarioId = localStorage.getItem('usuario_id') || ''

  // arrayData.append('usuario_id', usuario_id?.toString() || '');
  arrayData.append('usuario_id', usuarioId);
  arrayData.append('tipo_listagem', tipo_listagem.toString());
  arrayData.append('page', page.toString());
  arrayData.append('filtro_endereco', filters?.endereco?.logradouro || "");
  arrayData.append('filtro_numero', filters?.endereco?.numero || "");
  arrayData.append('ordenacao', selectOrder?.patch ? `${selectOrder.patch}_${selectOrder.id}` : '');
  arrayData.append('loja_id', lojaId)
  arrayData.append('perfil_login_id', perfilLoginId);

  arrFilter.forEach((key: FiltersKeys) => {
    (filters?.[key] as FiltersType[])?.forEach((e, index) => arrayData.append(`${key}[${index}]`, e.id.toString() || ''))
  })

  await axiosInstance.post('listagem_vendas', arrayData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    onUploadProgress: (progressEvent) => {
      // const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0 )) * 100);      
      // progressBar[index_Doc] = { percent: percentage, status: 'active', error: '' };
      // setProgressBar([...progressBar]);
    },

  })
    .then(res => {
      data = res?.data;
      console.log('RES DATA: ' , data)
      data = {
        ...data, data: res?.data?.data?.map((process: any) => ({
          id: process.processo_id,
          gerente: process.nome_gerente.split(" ")[0],
          gerenteName2: process.nome_gerente.split(" ")[1],
          gerenteId: Number(process.gerente_id),
          nomeCompleto: process.nome_gerente,
          data: process.ultima_alteracao,
          endereco: `${process.logradouro}, ${process.numero}${process.unidade ? " / " + process.unidade : ""}`,
          complemento: `${!!process.complemento ? process.complemento + ', ' : ""}${process.bairro}`,
          progresso: process.porcentagem_total_concluida,
          statusGerente: process.status_rascunho,
          statusPosVenda: process.nome_status,
          dataStatusAlterado: process.data_alteracao_status,
          dataAssinatura: process.data_assinatura,
          dataCancelamento: process.data_cancelamento,
          prazoEscritura: process.prazo_escritura,
          dataPrazoPos: process.data_expiracao_status,
          statusId: process.status_id,
          formaPagamento: process.nome_forma_pagamento?.split(","),
          responsavelPosVendaId: process.responsavel_id,
          posvendaName: process.nome_pos_responsavel,
          recibo: process.recibo,
          reciboId: process.recibo_id,
          imovelId: process.imovel_id,
          origemRecibo: process.recibo_type === 'manual' ? 'Manualmente' : 'DocuSign',
          comprador: !!process?.compradores?.[0],
          vendedor: !!process?.vendedores?.[0],
          comissaoId: process.comissao?.id,
          foguetes: process.foguete,
          recibo_type: process.recibo_type,
          envelope_id: process.envelope_id,
          devolucaoComissao: process.devolucao_comissao,
          devolucaoComprador: process.devolucao_comprador,
          devolucaoVendedor: process.devolucao_vendedor,
          devolucaoId: process.devolucao_id,
          devolucaoImovel: process.devolucao_imovel,
          devolucaoRecibo: process.devolucao_recibo,
          porcentagemPreenchidaImovel: process.porcenagem_preenchida_imovel,
          porcentagemPreenchidaVendedores: process.porcenagem_preenchida_vendedores,
          porcentagemPreenchidaCompradores: process.porcenagem_preenchida_compradores,
          porcentagemPreenchidaRascunho: process.porcenagem_preenchida_rascunho,
          porcentagemPreenchidaComissao: process.porcentagem_preenchida_comissao,
          porcentagemPreenchidaConcluida: process.porcentagem_total_concluida,
        }))
      }
      console.log(res);
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

export default getListaVendasGerenteGG;