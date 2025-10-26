export default interface EntregarVenda {
  processo_id: string,
  informacao_imovel_id?: string,
  imovel_id?: string, 
  prazo_type?: string,
  reciboType?: "manual" | "docusign",
  data_assinatura?: string,
  prazo_escritura?: string,
  posvenda_franquia?: string,
  valor_comissao_total?: string,
  deducao?: string,
  valor_comissao_liquida?: string,
  emailCheck?: string,
  data_previsao_conclusao_venda?: string,
  data_previsao_escritura?: string,
  observacao?: string  

  reforco?: string
  id_responsavel_chaves?: string | number
  reforco_observacao?: string

  testemunhas?: {
    id?: string | number,
    name?: string,
    email?: string,
    tipo_pessoa?: number
  }[]
}