type ListaDocumentosType = { 
    id: number | string, 
    nome: string, 
    tipo: 'imóvel' | 'pessoa fisica' | 'pessoa fisica vendedor' | 'pessoa fisica comprador' | 'pessoa juridica' | 'pessoa juridica vendedor' | 'pessoa juridica comprador' | 'pessoa fisica e juridica' | 'boleto' | 'comissao', 
    validade_dias: string | null 
}

export type { ListaDocumentosType }