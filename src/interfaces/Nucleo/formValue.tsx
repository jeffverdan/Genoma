type FormValues = {
    status_servico: string,
    observacao: string,
    dataPrevisao: string
    quantidade_vendedores: number | string
    quantidade_compradores: number | string
    vendedores: Usuario[]
    compradores: Usuario[]
    tipoDocumento: string
}

type Usuario = {
    id?: number;
    nome?: string;
}

export type {FormValues, Usuario}
