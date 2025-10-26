import { Tipos } from "../Users/document"

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
  identifica_documento: "imóvel" | "pessoa_fisica" | "pessoa_juridica" | "comissão" | null
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
  resposta_gerente_id: string | null
  solicitacao_id: string | null
  status: "Entrada" | "Análise" | "Certidões" | "Taxas" | "Escritura" | "Registro" | "Finalizado" | "Criação Registro de Sina" | "Venda Completa" | "Vendedor Completo" |
  "Comprador Completo" | "Venda Incompleta" | "Vendedor Incompleto" | "Comprador incompleto" | "Criação de rascunho" | "Upload de recibo" | "Boletim de venda Imovel" |
  "Boletim de venda Vendedores" | "Boletim de venda Compradores" | "Boletim de venda Comissão" | "Averbação" | "Venda devolvida" | "Arquivado" | "Revisão sem Comprador" |
  "Pré-venda" | "Franqueado responsável pela pós-negociação" | "Cancelado" | "ITBI" | "Banco e Documentação" | "Engenharia" | "Conformidade" | "Emissão de Contrato" |
  "Arquivado" | "Upload de recibo" | "Cancelado" | null
  status_escritura: string | null
  status_id: string | null
  status_solicitacao: string | null
  tipos_multiplos_documentos: Tipos[]
  unidade: string | null
  tag?: "Imóvel" | "Pessoa Física" | "Pessoa Jurídica" | "Comissão" | "Status"
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
}

export type { historicoProcesso, statusType }