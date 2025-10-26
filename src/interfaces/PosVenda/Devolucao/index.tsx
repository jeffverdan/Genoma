import Pessoa from "@/interfaces/Users/userData";

type ChecksReviewType = { recibo: boolean; imovel: boolean; vendedor_pf: boolean; vendedor_pj: boolean; comprador_pf: boolean; comprador_pj: boolean }

type ItemsCorrecoes = { 
    id: number
    id_correcao: number
    nome: string
    tipo: "Imóvel" | "Pessoa Jurídica" | "Pessoa Física" | "Representante" | "Correções do recibo de sinal"
    saved: boolean 
}

type ListCorrecoes = { imovel: ItemsCorrecoes[], recibo: ItemsCorrecoes[], pf: ItemsCorrecoes[], pj: ItemsCorrecoes[], representante: ItemsCorrecoes[] }

type SelectType = {
    id: number | string
    nome?: string
    nome_empresa?: string // APENAS QUANDO REPRESENTANTES
    representante?: boolean // APENAS QUANDO REPRESENTANTES
    socio?: boolean // APENAS QUANDO REPRESENTANTES
    reviewChecks: ItemsCorrecoes[]
};

type PessoaType = {
    reviews?: SelectType[],
    obs?: string
    data?: Pessoa // USADO EM DEVOLUÇÃO
  };

type DataToSaveType = {
    imovel: {
        reviewChecks?: ItemsCorrecoes[]
        obs?: string
    }
    recibo: {
        reviewChecks?: ItemsCorrecoes[]
        obs?: string
    }
    vendedor_pf: PessoaType
    vendedor_pj: PessoaType
    comprador_pf: PessoaType
    comprador_pj: PessoaType
    // incompleto: {
    //     vendedor?: boolean
    //     comprador?: boolean
    //     obs?: string
    // }
}

type ErrorUsers = {
    reviews?: {
        errorUser: boolean,
        errorCheck: boolean,
    }[],
    obs?: boolean
}

type ErrorDataType = {
    imovel: {
        reviewChecks?: boolean
        obs?: boolean
    }
    recibo: {
        reviewChecks?: boolean
        obs?: boolean
    }
    vendedor_pf: ErrorUsers
    vendedor_pj: ErrorUsers
    comprador_pf: ErrorUsers
    comprador_pj: ErrorUsers
    // incompleto: {
    //     checkUsers?: boolean
    //     obs?: boolean
    // }
}

type TipoDevolucaoAPI = {
    id: number
    nome: string
    tipo: "Imóvel" | "Pessoa Jurídica" | "Pessoa Física" | "Representante" | "Correções do recibo de sinal"
    tipo_pessoa: 'vendedor' | 'comprador' | null
    id_correcao: number
    check_gerente: 0 | 1
}

export type { ChecksReviewType, ListCorrecoes, ItemsCorrecoes, SelectType, DataToSaveType, ErrorDataType, TipoDevolucaoAPI, PessoaType }