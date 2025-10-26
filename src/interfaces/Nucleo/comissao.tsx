import { dataDocument } from "../Users/document"

type comissaoEnvolvidos = {
  cpf_cnpj?: string
  empresa_cnpj?: string
  agencia?: string
  banco_id?: string
  banco_nome?: string
  cnpj?: string
  cpf?: string
  creci?: string
  desconto?: string
  id: string | number
  name?: string
  nome_empresarial?: string
  numero_conta?: string
  pix?: string
  chave_pix?: "CPF ou CNPJ" | "Celular" | "E-mail" | "Chave aleatória"
  porcentagem_comissao?: string
  porcentagem_real?: string
  tipo_pagamento?: "pix" | "banco"
  tipo_pessoa?: "PF" | "PJ"
  usuario_id?: string | number
  valor_real?: string
  tipo_laudo_opcionista?: "simples" | "com_chave" | "exclusividade" | "lançamento"
  tipo_laudo_opcionista_label?: "Simples" | "Com chave" | "Exclusividade" | "Lançamentos" | "Tipo não cadastrado"
  total_comissao_corretor?: string
  tipo_chave_pix_id?: string
  value_autocomplete?: { usuario_id: number, label: string }
}

type dadosEmpresas = {
  cnpj: string
  creci: string
  empresa_id: number
  id: number
  nome: string
  nome_empresarial: string
  verificar_franquia: 0 | 1
}

type vendedorResponsavel = {
  id: number,
  numero_parcela: string
  observacoes: string | null
  parcela_valor: string
  processo_id: number
  usuario_id: number
  name: string
}

type dadosComissao = {
  agencia: string
  banco_id: number
  cpf_cnpj: string
  creci: string
  ddi: string
  desconto: string | null
  name: string
  nome_banco: string
  nome_real: string
  numero_conta: string
  pix: string
  porcentagem_comissao?: string
  porcetagem_comissao?: string // DIRETOR TA RETORNANDO ASSIM
  telefone: string | ''
  usuario_id: number
  valor_real: string
}

type dadosComissaoEmpresas = {
  agencia: string
  banco_id: number
  cnpj: string | null
  creci: string
  desconto: string | null
  empresa_id: number
  nome_banco: string
  nome_empresarial: string
  numero_conta: string
  pix: string
  porcentagem_real: string
  relacao_empresa_comissao_id: number
  tipo_pagamento: 'banco' | 'pix'
  valor_real: string
}

type dadosRepasseType = {
  valor_benesh_comunicacao: string | number
  agencia: string | null
  banco_id: number | null
  cnpj?: string
  comissao_id: number
  company_bank_details_id: number
  created_at: string
  creci_empresa: string
  desconto: string | ""
  empresa_cnpj: string
  empresa_id: null
  empresa_resse_id: number
  id: number
  nome_banco: string | null
  nome_empresarial: string
  numero_conta: string | null
  pix: string
  porcentagem: string
  processo_id: number
  repasse_franquia: null
  tipo_pagamento: string
  updated_at: string
  valor_real: string
}

interface comissaoType {
  bloco?: string
  comissao: "partes" | "integral"
  tipo: 'Parcelada' | 'Integral'
  comissao_empresas: dadosComissaoEmpresas[]
  data_motivo?: string
  deducao?: string
  empresa_desconto?: string
  empresa_porcentagem?: string
  id: number | string
  liquida?: 'especie' | 'deposito' | 'ted_doc' | 'pix' | 'cheque'
  forma_pagamento: 'Espécie' | 'Depósito' | 'TED/DOC' | 'PIX' | 'Cheque/Cheque adm.'
  observacao_responsavel_pagamento?: string
  observacoes?: string
  processo_id: number | string
  data_atualizacao: string
  dados_comunicacao?: dadosRepasseType
  dados_repasse?: dadosRepasseType
  dados_royalties?: dadosRepasseType
  dados_diretor_comercial?: dadosComissao
  dados_empresas?: dadosEmpresas[]
  // repase_franquia_id?: string
  status_visualizacao_apoio?: 0 | 1
  valor_comissao_gerente?: string
  valor_comissao_gg?: string
  valor_comissao_liquida?: string
  valor_comissao_total?: string
  valor_parte_dois?: string
  valor_parte_um?: string
  valor_receber_empresa?: string
  valor_receber_empresa_opcao?: string
  vericar_enviar_planilha?: 0 | 1
  verificar_enviar_planilha?: 0 | 1
  // verificar_repasse?: string
  parcelas_empresa?: {
    id: string | number
    comissao_id: string | number
    processo_id: string | number
    valor_parcela: string
    periodo_pagamento: string
    data_comissao: string
    dia_pagamento: string
    numero_parcela?: string
    nome_periodo?: string
  }[]
  quantidade_gg?: string,
  comissao_gerente_gerais?: comissaoEnvolvidos[]
  comissao_gerentes?: comissaoEnvolvidos[]
  corretores_opicionistas_comissao?: comissaoEnvolvidos[]
  corretores_vendedores_comissao?: comissaoEnvolvidos[]
  loja?: {
    empresa_id: number
    gerente_geral_id: number
    id: number
    nome: string
    nome_gerente_geral: string
  }
  documentos: {
    data: dataDocument[]
  }
  vendedor_responsavel_pagamento: vendedorResponsavel[] | []
  verificar_repasse: "true" | "false"
}

export type { comissaoType, comissaoEnvolvidos, dadosRepasseType }