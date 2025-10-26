type DataRows = {
    bairro: string
    complemento: string | null
    data_assinatura: string // FECHAMENTO
    hora_assinatura: string // FECHAMENTO
    data_entrada: string
    gerente_id: number    
    gerente_name: string
    hora_entrada: string
    logradouro: string
    loja_name: string // FRANQUIA
    numero: string
    pos_venda_id: number
    pos_venda_name: string
    processo_id: number
    status_visualizacao_atual: 0 | 1
    tipo_venda: 'Integral' | 'Parcelado' | 'Não cadastrado'
    unidade: string
    valor_comissao: string
    valor_venda: string // VGV
    quantidade_parcela: number
    comissao_incompleta: boolean
    datas_parcelas: string
}

type tabType = {
    label: string,
    // active: boolean,
}

type tabsType = {
    tabs: tabType[],
    selectTab: number,
};

export type { DataRows, tabsType }