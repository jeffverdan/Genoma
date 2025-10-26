

type pessoaType = {
    nome: string,
    estado_civil: string,
    cpf: string,
    regime_casamento?: string
    tipo: 'vendedores' | 'compradores'
    nome_mae: string
    nome_pai: string
}

type jsonFormatType = {
    vendedores: pessoaType[],
    compradores: pessoaType[],
    imovel: {
        logradouro: string,
        numero: string,
        unidade: string,
        bairro: string,
        uf: string,
        inscricao_municipal: string
    },
    foreiro: {
        tipo: 'União' | 'Prefeitura' | 'Família' | 'Igreja'
        complemento?: string
    }[]
    prazo_escritura: number
    valor_venda: string
    data_recibo: string
    documento_valido: boolean
    tipo_escritura: string
};

export type { pessoaType, jsonFormatType }