import { dataDocument, Tipos } from "../Users/document"

type statusType = {
  status:
  "Entrada" |
  "Análise" |
  "Certidões" |
  "Taxas" |
  "Escritura" |
  "Registro" |
  "Finalizado" |
  "Criação Registro de Sina" |
  "Venda Completa" |
  "Vendedor Completo" |
  "Comprador Completo" |
  "Venda Incompleta" |
  "Vendedor Incompleto" |
  "Comprador incompleto" |
  "Criação de rascunho" |
  "Upload de recibo" |
  "Boletim de venda Imovel" |
  "Boletim de venda Vendedores" |
  "Boletim de venda Compradores" |
  "Boletim de venda Comissão" |
  "Averbação" |
  "Venda devolvida" |
  "Arquivado" |
  "Revisão sem Comprador" |
  "Pré-venda" |
  "Franqueado responsável pela pós-negociação" |
  "Cancelado" |
  "ITBI" |
  "Banco e Documentação" |
  "Engenharia" |
  "Conformidade" |
  "Emissão de Contrato" |
  "Arquivado" |
  "Upload de recibo" |
  null
}

interface historicoProcesso {
  antigo_responsavel: string | null
  complemento: string | null
  data_escritura: string | null
  data_historico: string | null
  data_cancelamento: string | null
  data_previsao: string | null
  documento_id: number | null
  hora_escritura: string | null
  identifica_documento: "imóvel" | "pessoa_fisica" | "pessoa_juridica" | "comissão" | "Comissão" | "nota" | "boleto_financeiro" | null
  link: ""
  logradouro: string | null
  mensagem: string | null
  mensagem_solicitacao: string | null
  motivo_escritura: string | null
  nome: string | null
  nome_solicitacao: string | null
  novo_responsavel: string | null
  numero: string | null
  papel: string | null
  processo_id: number | null
  responsavel_antigo_id: string | null
  responsavel_novo_id: string | null
  resposta_gerente_id: string | number | null
  solicitacao_id: string | null
  status: "Entrada" | "Análise" | "Certidões" | "Taxas" | "Escritura" | "Registro" | "Finalizado" | "Criação Registro de Sina" | "Venda Completa" | "Vendedor Completo" |
  "Comprador Completo" | "Venda Incompleta" | "Vendedor Incompleto" | "Comprador incompleto" | "Criação de rascunho" | "Upload de recibo" | "Boletim de venda Imovel" |
  "Boletim de venda Vendedores" | "Boletim de venda Compradores" | "Boletim de venda Comissão" | "Averbação" | "Venda devolvida" | "Arquivado" | "Revisão sem Comprador" |
  "Pré-venda" | "Franqueado responsável pela pós-negociação" | "Cancelado" | "ITBI" | "Banco e Documentação" | "Engenharia" | "Conformidade" | "Emissão de Contrato" |
  "Arquivado" | "Upload de recibo" | "Cancelado" | "Enviado para revisão" | null
  status_escritura: string | null
  status_id: string | number | null
  status_solicitacao: string | null
  tipos_multiplos_documentos: Tipos[]
  unidade: string | null
  tag?: "Imóvel" | "Pessoa Física" | "Pessoa Jurídica" | "Comissão" | "Status"
  hora_historico: string | null
  nome_responsavel_alteracao: string | null
  nome_gerente_processo: string | null
  nota_id?: number
  titulo?: string
  descricao?: string
  importante?: number
  documento_deletado?: number
  nome_cartorio?: string
  cep?: string
  uf?: string
  bairro?: string
  nome_tipo_rgi?: string
  protocolo_rgi?: string
  imovel_id?: number
  recibo?: string
  nova_data_agendamento?: string
  observacao_compradores?: string
  observacao_vendedores?: string
  observacao_compradores_juridicos?: string
  observacao_vendedores_juridicos?: string
  observacao_imovel?: string
  observacao_recibo?: string
  status_anterior_processo_id?: number | null
  data_previsao_termino_solicitacao?: string | null
  observacao?: string | null
  grupo_servico_id?: number | null
  empresa?: {
    nome_fantasia: string
    pj_usuario_id: number
    razao_social: string
  }
  cliente?: {
    name: string
    perfil: "Vendedor" | "Comprador"
    usuario_id: number
  }

  pagadores?: {
    id?: number,
    usuario_id?: number,
    valor_pagamento?: string,
    boleto_id?: number | null,
    data_envio?: string | null,
    comfirmacao_pagamento?: number | string,
    usuario_nome?: string,
    nome_boleto?: string,
    tipo_documento_id?: number | string,
    data_vencimento?: string,
    papel_id?: number,
    papel?: string
  }[]

  pagadores_historico?: {
    name?: string,
    usuario_id?: number,
    valor_pagamento?: string,
  }[]

  nome_corretor_parcela?: string
  valor_confirmado_parcela_corretor?: string
  status_membro_partilha_id?: number
  status_parcela_id?: number
  valor_transferido?: string 
  valor_faltante?: string 
  valor_pagamento?: string
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
  documentos?: {
    data: dataDocument[],
  },
  valor_pago?: string,
  valor_juros?: string,
  valor_multa?: string,
  data_pagamento?: string,
  imovel_logradouro?: string,
  imovel_numero?: string,
  imovel_unidade?: string,
  imovel_complemento?: string,
  imovel_bairro?: string,
  imovel_uf?: string,
}

export type { historicoProcesso, statusType }