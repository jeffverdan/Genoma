import Pessoa from "../Users/userData"
import { Laudemios } from "./laudemiosType"
// import { comissaoType } from "./comissao"
import { historicoProcesso } from "./historicoProcesso"
import { ItemsCorrecoes, SelectType, TipoDevolucaoAPI, PessoaType } from "../PosVenda/Devolucao"
import { dataDocument, Document } from "../Users/document"

export default interface Nucleo {
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
    documentos: Document,
    informacao?: {
      tipo_dias: "1" | '0'
    }
    vendedores?: { data?: Pessoa[] }
    compradores?: { data?: Pessoa[] }
  }
  informacao?: {
    id: string
    bens_moveis?: string // CLAUSULA DÉCIMA
    excecoes?: string // CLAUSULA SEGUNDA
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
  // comissao?: comissaoType
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
  }
  status?: {
    data: {
      data_expiracao_status: string
      data_historico: string
      id: string | number
      mensagem: string
      mensagem_vendedor_comprador: string
      status: string
      status_anterior: string | number
      status_relacao_processo_id: string | number
      status_visualizacao: string | number
    }[]
  }
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
  responsaveis?: {
    data: Pessoa[]
  }
}

