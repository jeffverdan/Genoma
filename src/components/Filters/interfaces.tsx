type FiltersKeys = keyof FiltersToolbar;

type FiltersToolbar = {
    filtro_gerente?: FiltersType[]
    filtro_cliente?: FiltersType[]
    filtro_responsavel?: FiltersType[]
    filtro_status?: FiltersType[]
    filtro_status_rascunho?: FiltersType[]
    filtro_pagamento?: FiltersType[]
    filtro_recibo?: FiltersType[]
    filtro_correcoes?: FiltersType[]
    filtro_loja?: FiltersType[]
    filtro_tipo_venda?: FiltersType[]    
    filtro_solicitacao_onus?: FiltersType[]
    filtro_certidoes_comarca?: FiltersType[] 
    filtro_clientes?: FiltersType[]
    filtro_laudemio?: FiltersType[]
    filtro_prazo_status?: FiltersType[]
    filtro_cliente_gerente?: FiltersType[]
    filtro_status_financeiro?: FiltersType[]
}

type FiltersType = {    
    id: string | number,
    label: string,
    check?: boolean,
    cpf_cnpj?: string
    color?: string,
}

export type { FiltersType, FiltersToolbar, FiltersKeys }