import Pessoa from "../Users/userData"
import { Laudemios } from "./laudemiosType"
import { comissaoType } from "./comissao"
import { historicoProcesso } from "./historicoProcesso"
import { ItemsCorrecoes, SelectType, TipoDevolucaoAPI, PessoaType } from "../PosVenda/Devolucao"
import { dataDocument } from '@/interfaces/Users/document';

export default interface ImovelData {
  email_check?: string
  bairro?: string
  cidade?: string
  uf?: string
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  codigo?: string
  unidade?: string
  type?: 'vendedores' | 'compradores'
  envelope_id?: string
  documentos?: {
    data: dataDocument[],
  },
  imovel?: {
    documentos: dataDocument[],
    email_check?: '0' | '1'
    informacao?: {
      tipo_dias: "1" | '0'
    }
  }
  informacao?: {
    id: string
    bens_moveis?: string // CLAUSULA DÉCIMA
    excecoes?: string // CLAUSULA SEGUNDA
    cartorio?: string
    data_assinatura: string
    escritura: string
    matricula: string
    vaga: string
    inscricaoMunicipal: string
    recibo?: string
    rgi?: string
    prazo?: string
    tipo_escritura?: string
    recibo_type?: 'manual' | 'docusign'
    lavrada: string
    livro: string
    folha: string
    ato: string
    valoMulta: string
    forma_pagamento: string
    forma_pagamento_nome: string
    valorSinal: string
    valor_venda: string
    valor_anunciado: string
    prazo_escritura: string
    observacao_pagamento: string
    observacao?: string
  }
  laudemios?: Laudemios[]
  vendedores?: Pessoa[]
  compradores?: Pessoa[]
  gerente?: Pessoa[]
  foguete?: number
  franquia?: 0 | 1
  porcenagem_preenchida_compradores?: number
  porcenagem_preenchida_imovel?: number
  porcenagem_preenchida_rascunho?: number
  porcenagem_preenchida_vendedores?: number
  porcentagem_total_concluida?: number
  porcentagem_preenchida_comissao?: number
  emails_todos_envolvidos?: 0 | 1
  todos_documentos_compradores?: 0 | 1
  todos_documentos_vendedores?: 0 | 1
  clausula_segunda?: 0 | 1
  imovel_id?: string
  id?: string
  comissao?: comissaoType
  processo_id?: string
  historico_processo?: historicoProcesso[]
  uso_docusing?: 0 | 1
  dados_escritura?: {
    complemento: string
    data_escritura: string
    hora_escritura: string
    logradouro: string
    motivo_escritura: string
    numero: string
    resposta_gerente_id: number
    status_escritura: string
    unidade: string
    nome_cartorio?: string
    cep?: string
  }
  status?: {
    created_at: string | null
    id: number | string //status_processo_id
    mensagem_vendedor_comprador: string | null
    status: string // STATUS NAME
    pivot: {
      created_at: string | null
      data_expiracao_status: string | null
      id: number | string
      processo_id: number | string
      status_anterior_processo_id: number | string
      status_processo_id: number | string
      status_visualizacao: 1
      updated_at: string
    }
  }[]
  devolucoes?: {
    cadastro_incompleto_comprador: 0 | 1
    cadastro_incompleto_observacao: string | null
    cadastro_incompleto_vendedor: 0 | 1
    comissao: 0 | 1
    comissao_observacao: string | null
    comissao_verific_save: 0 | 1
    compradores: 0 | 1
    compradores_observacao: string | null
    compradores_juridicos: 0 | 1
    compradores_juridicos_observacao: string | null
    compradores_verific_save: 0 | 1
    id: number
    progress_status_progresses_id: number
    recibo_sinal: 0 | 1
    recibo_sinal_observacao: string | null
    recibo_sinal_save: 0 | 1
    tipo_devolucao: {
      data: TipoDevolucaoAPI[]
    }
    user_id: number
    valores_documentos_imovel: 0 | 1
    valores_documentos_imovel_observacao: string | null
    valores_documentos_imovel_verific_save: 0 | 1
    vendedores: 0 | 1
    vendedores_observacao: string | null
    vendedores_juridicos: 0 | 1
    vendedores_juridicos_observacao: string | null
    vendedores_verific_save: 0 | 1
    imovel: {
      reviewChecks?: ItemsCorrecoes[]
      obs?: string
    }
    recibo: {
      reviewChecks?: ItemsCorrecoes[]
      obs?: string
    }
    vendedor_pf: PessoaType
    vendedor_pj: PessoaType
    comprador_pf: PessoaType
    comprador_pj: PessoaType
    incompleto: {
      vendedor?: boolean
      comprador?: boolean
      obs?: string
    }
  }
  pendencias?: {
    card_id: string
    dividasIptu: boolean
    dividasIptu_id: string
    nonoDistrito: boolean
    nonoDistrito_id: string
    taxaIncendioAtrasada: boolean
    taxaIncendioAtrasada_id: string
  }
  testemunhas?: {
    data?: {
      id: number,
      nome: string,
      email: string 
    }[]
  },
  copia?: {
    data?: {
      id: number,
      nome: string,
      email: string 
    }[]
  }

  nome_responsavel_alteracao?: string
  nome_corretor_parcela?: string
  valor_confirmado_parcela_corretor?: string
  status_membro_partilha_id?: number
  valor_transferido?: string 
  dados_bancarios_parcela?: {
    id?: number,
    agencia?: string,
    numero_conta?: string,
    pix?: string,
    usuario_id?: number,
    banco_id?: number,
    created_at?: string,
    updated_at?: string,
    tipo_chave_pix_id?: number,
    principal?: number,
    apelido?: string,
    tipo_pagamento_selecionado?: string,
    nome_banco?: string,
    chave_pix?: string
  }
  documento_transferencia?: {
    id?: number,
    tipo_documento_id?: number,
    nome_tipo?: string,
    link?: string,
    identifica_documento?: string,
    identifica_documento_id?: string,
    arquivo?: string,
    tipo_documento?: number,
    solicitacao_id?: number,
    nome_original?: string,
    tipos_multiplos_documentos?: {
        id?: number,
        documento_id?: number,
        tipo_documento_id?: number,
        processo_id?: number,
        data_emissao?: string,
        validade_dias?: string,
        data_vencimento?: string,
        nome_tipo?: string
    }[],
    tipo_documento_ids?: {
        id?: number,
        documento_id?: number,
        tipo_documento_id?: number,
        processo_id?: number,
        data_emissao?: string,
        validade_dias?: string,
        data_vencimento?: string,
        nome_tipo?: string
    }[],
    identificacao?: number | string,
    parcela_id?: number
  }
}