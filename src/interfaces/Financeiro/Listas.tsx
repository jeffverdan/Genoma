import { ArrayResponsaveisPagamentoType, UserToPayType } from "./Status";

type DataRows = {
    processo_id: number
    parcela_id: number
    numero_parcela: string
    total_parcelas: string
    valor_parcela: string 
    data_prevista: string
    data_criacao_status: string
    logradouro: string
    numero: string
    unidade: string | null
    complemento: string | null
    bairro: string
    cidade: string
    uf: string
    data_assinatura: string
    loja_name: string
    loja_id: number
    status_atual_id: number
    status_atual: string
    tipo_venda: "Integral" | "Parcelada" 
    responsaveis_pagamento: ArrayResponsaveisPagamentoType[]
    status_parcela: string
    usuarios_agrupados: UserToPayType[]
    data_cancelamento: string // DATA DE CANCELAMENTO DA PARCELA
};

type APIResType = {
    data: {
        data: DataRows[];
        per_page: number
        prev_page_url: null
        to: number
        total: number
        last_page: number
    }
}

type RowsType = {
    // TABLE A RECEBER
    loja_nome: string
    logradouro: string
    numero: string
    unidade: string | null
    complemento: string | null
    bairro: string
    cidade: string
    uf: string
    valor_parcela: string // VALOR DA COMISSÃO DESSA PARCELA
    data_cancelamento: string // DATA DE CANCELAMENTO DA PARCELA
    data_assinatura: string
    data_prevista: string
    data_criacao_status: string // DATA DE ALTERAÇÃO DO STATUS
    tipo_integral_parcelado: "partes" | "integral" | ""
    total_parcelas: string
    numero_parcela: string
    responsaveis_pagamento: ArrayResponsaveisPagamentoType[]
    status_nome: string
    status_color: 'orange' | 'green' | 'red' | 'neutral' | 'primary'
    status_visualizacao_atual: number
    processo_id: number
    parcela_id: number
    status_parcela: string

    // TABLE A PAGAR
    usuarios_agrupados: UserToPayType[]
}

type ARRAY_MENU_COMISSION_TYPE =  { 
    label: string; 
    icon: JSX.Element, 
    param: 'a_receber' | 'a_pagar' | 'concluido' | 'cancelado' 
}

type ComissaoUserType = { valor: string, nome: string, valor_pago: string, id: number };

export type { DataRows, APIResType, RowsType, ComissaoUserType, ARRAY_MENU_COMISSION_TYPE };