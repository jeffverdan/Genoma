
type Tipos = {
  data_emissao: string | null
  data_vencimento: string | null
  documento_id: string | number
  id: string | number
  nome_tipo: string
  processo_id: string | number
  tipo_documento_id: string | number
  validade_dias: string | null
  nome_original?: string | number
  arquivo?: string
}

type dataDocument = {
  active?: 0 | 1
  arquivo: string
  nome_tipo?: string
  created_at: string
  id: string | number
  identifica_documento: "imóvel" | "imovel" | "comissão" | "vendedor" | "comprador"
  identifica_documento_id: string
  nome_original: string | number
  processo_id: string | number
  tipo_documento: {
    id: number
    tipo: string
    nome: string
    documento_id: string | number
    processo_id: string | number,
    validade_dias?: string 
    data_vencimento?: string,
    data_emissao?: string,
    tipo_documento_id: string | number
  } | null
  tipo_documento_id: string | number | null
  tipos_multiplos_documentos?: Tipos[] // USADO EM VENDEDORES E COMPRADORES
  tipo_documento_ids: Tipos[] // USADO EM IMOVEL
  solicitacao_id?: string | number
  link?: string,
}

interface Document {
  data: dataDocument[]
}

export type { dataDocument, Document, Tipos }