import { dataDocument, Document } from "@/interfaces/Users/document"


// lista_entrega_das_chaves
//     { topico_id: 2, id: 1, name: 'À vista' },
//     { topico_id: 2, id: 2, name: 'Financiamento' },
//     { topico_id: 2, id: 7, name: 'Financiamento + FGTS' },
//     { topico_id: 2, id: 3, name: 'FGTS' },
//     { topico_id: 2, id: 4, name: 'Consórcio' },
//     { id: 9, name: 'Consórcio + FGTS', topico_id: 2 }

type ApiTopicosAnaliseType = {
    // RETORNO DAS LISTAS USADAS EM ANALISE
    vendedores_envolvidos: {
        id: number | string,
        nome: string,
        razao_social?: string | null,
        nome_fantasia?: string | null,
        tipo_pessoa: number
    }[],
    compradores_envolvidos: {
        id: number | string,
        nome: string,
        tipo_pessoa: number
    }[]
    bancos: { id: number | string, name: string }[],
    lista_topicos: [
        { id: '', name: "Selecione..." },
        { id: 1, name: 'Averbação' },
        { id: 2, name: 'Entrega das chaves' },
        { id: 3, name: 'Imóvel com laudêmio' },
        { id: 4, name: 'Imóvel com pendência de taxa' },
        { id: 5, name: 'Reforço de sinal' },
        { id: 6, name: 'Outro' }
    ],
    tipos: {
        lista_averbacao: [
            { id: '', name: "Selecione..." },
            { topico_id: 1, id: 1, name: 'Construção' },
            { topico_id: 1, id: 2, name: 'Casamento' },
            { topico_id: 1, id: 3, name: 'Logradouro' },
            { topico_id: 1, id: 4, name: 'Cadastro municipal' },
            { topico_id: 1, id: 5, name: 'Cancelamento de usufruto' },
            { topico_id: 1, id: 6, name: 'Separação ou divórcio' },
            { topico_id: 1, id: 7, name: 'União estável' },
            { topico_id: 1, id: 8, name: 'Maior idade' },
            { topico_id: 1, id: 9, name: 'Baixa de Alienação Fiduciária' }
        ],
        lista_entrega_das_chaves: { topico_id?: number, id: number | string, name: string }[],
        lista_imovel_pendencia_taxa: [
            { topico_id: 4, id: 11, name: 'Taxa de incêndio atrasada' },
            { topico_id: 4, id: 12, name: 'Dívidas de IPTU' },
            {
                topico_id: 4,
                id: 13,
                name: '9º Distribuidor de Execuções Fiscais'
            }
        ],
        lista_imovel_com_laudemio: [{ topico_id: 3, id: 14, name: 'Laudemios' }],
        lista_reforco_sinal: [
            { topico_id: 5, id: 15, name: 'Após as certidões' },
            { topico_id: 5, id: 16, name: 'Outro período' }
        ],
        lista_outros: [
            { id: '', name: 'ASSUNTO' },
            { topico_id: 6, id: 17, name: 'Imóvel' },
            { topico_id: 6, id: 18, name: 'Recibo de sinal' },
            { topico_id: 6, id: 19, name: 'Vendedores' },
            { topico_id: 6, id: 20, name: 'Compradores' },
            { topico_id: 6, id: 21, name: 'Cadastro da venda' }
        ]
    },

    // LISTAS ADICIONADAS NO FRONT
    qtdVendedores?: number,
    qtdCompradores?: number,
    quantVendedores: {
        id: string | number,
        name: string | number
    }[],
    listaVendedores?: {
        id: number | string;
        name: string | undefined;
        documentos: Document | undefined;
    }[]
    listaCompradores?: {
        id: number | string;
        name: string | undefined;
        documentos: Document | undefined;
    }[]
}

type SelectsType = {
    card_id: string
    topico_id?: number | string,
    processo_id: string,
    topicos?: TopicType[]

    data?: TopicType[]

    // CARD 1 AVERBAÇÃO
    quantAverbacao?: number | string
    vendedoresAverbacao?: {
        id: number | string,
        tipo: {
            id_vinculo_tipo?: string
            id: number | string
        }[]
    }[]

    // CARD 2 ENTREGA CHAVES
    formPagamento?: number | string
    vendedorResponsavel?: number | string
    bancoResponsavel?: number | string
    id_vinculo_card?: number | string

    // CARD 3 LAUDEMIOS
    obsLaudemios?: string

    // CARD 4 PENDENCIAS
    pendencia?: {
        id_vinculo_tipo?: string
        id: number | string
    }[]

    // CARD 5 REFORÇO DE SINAL
    momentoReforco?: string
    observacaoReforco?: string

    // CARD 6 OUTROS
    observacaoOutros?: string
    assuntoOutros?: number | string
};

type TopicType = {
    id: number,
    observacao: string,
    topico_id: number,
    name: string,
    topico: string,
    subtopico_id: number,
    subtopico_id_vendedor: number,
    banks_id: number | string
    vendedor_salvo: string,
    nome_banco: string | null,
    tag?: string,
    ponto_atencao?: string
}

type ApiReturnTopicType = {
    card_id: number,
    topico_id: number,
    topico: string,
    processo_id: number | string,
    data: TopicType[]

    // PARTE CRIADA NO FRONT
    quantAverbacao?: number | string,
    vendedoresAverbacao?: {
        id: number | string,
        tipo: {
            id_vinculo_tipo?: string | number
            id: number | string
        }[]
    }[]

    // CARD 2 ENTREGA CHAVES
    formPagamento?: number | string
    vendedorResponsavel?: number | string
    bancoResponsavel?: number | string
    id_vinculo_card?: number | string

    // CARD 3 LAUDEMIOS
    obsLaudemios?: string

    // CARD 4 PENDENCIAS
    pendencia?: {
        id_vinculo_tipo?: string | number
        id: number | string
    }[]

    // CARD 5 REFORÇO DE SINAL
    momentoReforco?: string
    observacaoReforco?: string

    // CARD 6 OUTROS
    observacaoOutros?: string
    assuntoOutros?: number | string
}

export type { ApiTopicosAnaliseType, SelectsType, TopicType, ApiReturnTopicType }