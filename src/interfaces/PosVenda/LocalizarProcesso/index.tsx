import ImovelData from '@/interfaces/Imovel/imovelData';
import Pessoa from '@/interfaces/Users/userData';
import { DeadlineTypes, retornoApi } from '../Agenda';


interface ProcessType {
    imovel: ImovelData
    gerente: {
        data: Pessoa[]
    }
    responsaveis?: {
      data?: Pessoa[]
    }
    vendedores: Pessoa[]
    vendedores_pf: Pessoa[]
    vendedores_pj: Pessoa[]
    compradores: Pessoa[]
    compradores_pf: Pessoa[]
    compradores_pj: Pessoa[]
    status_devolucao_id: number | undefined
    solicitacao_nucleo?: {
        id: number;
        observacao: string;
        data_criacao: string;
        servico_detalhado: ServicoDetalhado;
        valor_servico_detalhado?: ServicoDetalhado;
        grupo_id?: number | null;
    }[]
    data_status_entrada: string
    lista_status: listaStatus[]
    status: {
      data: {
        data_expiracao_status: string
        data_historico: string
        id: number | string
        mensagem: string
        mensagem_vendedor_comprador: string | null
        status: string
        status_anterior: number | string
        status_relacao_processo_id: number | string
        status_visualizacao: number | string
      }[]
    }
    mapa_prioridades?: retornoApi
    deadline?: DeadlineTypes
};

interface listaStatus {
  id: string | number,
  label: string
}

// Solocitação Serviço
interface TipoServico {
  id: number;
  nome: string;
  created_at: string | null;
  updated_at: string | null;
}

interface ServicoDetalhado {
  id: number;
  nome: string;
  tipo_servico: TipoServico;
  grupo_id?: number | null
}

export default ProcessType