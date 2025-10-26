type MultiDocsType = {
    id: string | number,
    file: string,
    info_id?: string | number,
    item: {
      id: string | number,
      values: string | number,
      validade_dias?: string | null,
      nome?: string
      data_vencimento?: string | null
      data_emissao?: string | null
    }[]
  }

  export type { MultiDocsType }