interface pessoasType {
    nome: string
    data_envio: string
    email: string
    data_envio_format: string
    hora_envio: string
}

interface EnvelopeDocusign {
    assitantes_total: string
    data_envio: Date
    nao_assinados: pessoasType[] | []
    quantidade_nao_assinantes: number
    assinados: pessoasType[] | []
    quantidade_assinantes: number
    data_envio_format: string
    hora_envio: string
}

export type { EnvelopeDocusign, pessoasType }