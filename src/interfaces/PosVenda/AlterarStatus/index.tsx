// TYPE DO PARAMETRO DA API salvar_status_processo
type DataToSave = {
    gerente_id?: string | number,
    status_processo_id?: string | number,
    processo_id: string | number,
    processo_nome: string,    

    mensagem?: string,
    responsavel_vendedor?: string | number,
    responsavel_comprador?: string | number,

    // TAXAS - ESCRITURA - ENGENHARIA
    banco?: string,
    hora_engenharia?: string,
    data_engenharia?: string,

    check_engenharia?: boolean,
    check_banco?: {
        doc_vendedor?: boolean,
        doc_comprador?: boolean,
        doc_imovel?: boolean
    }

    nome_cartorio?: string,
    local_escritura?: string | number,
    data_escritura?: string,
    hora_escritura?: string,
    cep_escritura?: string,
    endereco_escritura?: string,
    numero_escritura?: string | number,
    unidade_escritura?: string,
    complemento_escritura?: string,
    cidade_escritura?: string,
    estado_escritura?: string,
    bairro_escritura?: string,

    protocolo_rgi?: string,
    tipo_rgi?: string,
    check_registro?: boolean,

    pendencia_taxa?: {id: string | number, name?: string, topico_id?: number}[]

};

// TYPE DO FORM EM ALTERAR STATUS
interface FormValues extends DataToSave {       
    // AVERBAÇÃO
    quant_vendedores_averb?: number
    vendedores_averb?:  {
        id: number | string,
        tipo: {
            id_vinculo_tipo?: string
            id: number | string
        }[]
    }[]
    
    // TAXAS
    pendencia_taxa?: {id: string | number, name?: string, topico_id?: number}[]
}

type Visualizar = {
    status?: string,
    status_id?: number, 
    nome?: string,
    mensagem?: string,
    data?: string,
    data_expiracao?: string

    // AVERBAÇÂO
    averbacao?: {
        id?: number,
        nome?: string,
        tipo_averbacao?: {
            sub_topico?: string
        }[]
    }[],

    // TAXAS e ITBI
    responsaveis_venda?: {
        id?: number,
        nome_comprador?: string,
        nome_vendedor?: string,
        comprador_id?: number | string,
        vendedor_id: number | string,
    }[],
    pendencias?: {
        id: number | string,
        nome?: string,
        name?: string,
        topico_id?: number
    }[],
    inscricao_municipal?: string

    // ENGENHARUA
    engenharia?: {
        check_engenharia?: number,
        data_engenharia?: string,
        hora_engenharia?: string,
        id?: number,
        banco_id: number,
        nome_banco?: string
    }[],

    // BANCO E DOCUMENTAÇÂO
    banco_documentos?: {
        doc_comprador?: number,
        doc_vendedor?: number,
        doc_imovel?: number,
    }[]

    // ESCRITURA
    data_hora?: string,
    escritura?: {
        cartorio_id?: number,
        cep?: string,
        bairro?: string,
        cidade?: string, 
        complemento?: string,
        data_escritura?: string,
        hora_escritura?: string,
        local_escritura?: string,
        logradouro?: string,
        numero?: number,
        uf?: string,
        unidade?: string,
    }

    // REGISTRO
    registro?: {
        id?: number,
        protocolo_rgi?: string,
        tipo_rgi_id?: string,
        check_registro?: number,
    }

    // LAUDÊMIO
    laudemio?: {
        nome_tipo_laudemio?: string,
        nome_lista_laudemio?: string,
    }[]

    // AVERBACAO
    quant_vendedores_averb?: number
    vendedores_averb?:  {
        id: number | string,
        tipo: {
            id_vinculo_tipo?: string
            id: number | string
        }[]
    }[]
}

export type { DataToSave, FormValues, Visualizar };