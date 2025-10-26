interface FormValuesType {
    data_assinatura: string
    observacao: string
    imovel_id: string | number
    processo_id: string | number
    informacao_imovel_id: string | number
    prazo_type: string
    reciboType: 'manual' | 'docusign'    
    prazo_escritura: string
    posvenda_franquia: '0' | '1'
    valor_comissao_liquida: string
    deducao: string
    valor_comissao_total: string
    emailCheck: '0' | '1'
    data_previsao_escritura: string

    reforco: string
    id_responsavel_chaves: string | number
    reforco_observacao: string
}

export default FormValuesType