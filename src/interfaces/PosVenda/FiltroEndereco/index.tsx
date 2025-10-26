type EnderecoFilterData = {
    id?: string
    processo_id?: number,
    imovel_id?: number,
    logradouro: string,
    numero?: string | null,
    complemento?: string | null,
    unidade?: string | null,
    bairro?: string,
    cidade?: string,    
}

type ClientFielterData = {
    id?: number,
    name?: string,
    label?: string,
}

interface DataFilter {
    endereco: EnderecoFilterData | string | null
}

interface ClienteDataFilter {
    cliente: ClientFielterData | string | null
}

export type { DataFilter, EnderecoFilterData, ClientFielterData, ClienteDataFilter }