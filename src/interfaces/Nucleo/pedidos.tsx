export default interface PedidosNucleo {
    documentos?: {
        data?: {
            arquivo?: string,
            id?: number,
            identifica_documento?: string,
            identifica_documento_id?: string,
            link?: string,
            nome_original?: string,
            solicitacao_id?: number | string,
            tipo_documento?: {
                id?: number,
                nome?: string,
                tipo?: string,
                validade_dias?: string,
            }[],
            tipo_documento_id?: number,
            tipos_multiplos_documentos?: Tipos[],
        }[]
    };
    Documentos?: {
        data?: {
            arquivo?: string,
            id?: number,
            identifica_documento?: string,
            identifica_documento_id?: string,
            link?: string,
            nome_original?: string,
            solicitacao_id?: number | string,
            tipo_documento?: {
                id?: number,
                nome?: string,
                tipo?: string,
                validade_dias?: string,
            },
            tipo_documento_id?: number,
            tipos_multiplos_documentos?: Tipos[],
        }[]
    };
    contador_concluido?: number,
    data_criacao?: string,
    onus_solicitada?: number | null,
    justificativa_onus?: string | null,
    vendedor_comarca?: number | null,
    comarca?: {
        estado_id?: string | number | null
        name?: string,
        usuario_id?: number | null
    }[],
    grupo_id?: number | null,
    id?: number
    observacao?: string 
    responsavel_requisicao?: {
        ddi?: string,
        id?: number,
        name?: string,
        telefone?: string
    }[]
    servico_detalhado: {
        id?: number,
        nome?: string,
        tipo_servico: {
            id?: number,
            nome?: string,
        },
    }
    status_solicitação?: {
        data: {
            id?: number,
            id_relacao_status?: number,
            status_ant_solicitacao_id?: number,
            status_visualizacao?: number,
            status?: string,
            data_previsao?: string,
            mensagem?: string
        }[];
    };
    valor_servico_detalhado?: {
        nome?: string,
        id?: number
    } | string


    servicos_pedido: {
        data: {
            id: number,
            observacao: string | null,
            responsavel_requisicao: {
                id: number,
                name: string,
                ddi: string,
                telefone: string,
            },
            contador_concluido?: number,
            data_criacao: string,
            servico_detalhado: {
                id: number,
                nome: string,
                tipo_servico: {
                    id: number,
                    nome: string,
                    // created_at: null,
                    // updated_at: null
                }
            },
            status_solicitação: {
                data: {
                    id: number,
                    data_previsao?: string,
                    status: string,
                    status_ant_solicitacao_id: number,
                    mensagem: string,
                    status_visualizacao: number,
                    id_relacao_status: number
                }[]
                
            },
            Documentos: {
                data?: {
                    arquivo?: string,
                    id?: number,
                    identifica_documento?: string,
                    identifica_documento_id?: string,
                    identificacao?: string,
                    link?: string,
                    nome_original?: string,
                    solicitacao_id?: number | string,
                    tipo_documento?: {
                        id?: number,
                        nome?: string,
                        tipo?: string,
                        validade_dias?: string,
                    },
                    tipo_documento_id?: number,
                    tipos_multiplos_documentos?: Tipos[],
                }[]
            },
            valor_servico_detalhado: {
                servico_detalhado_id: number,
                valor_tipo_id: number | string | null,
                detalhe_servico: {
                    id: number,
                    nome: string,
                    tipo_servico_id: number,
                    // created_at: null,
                    // updated_at: null
                }
            },
            grupo_id: number
        }[]
    },
}[]

interface Tipos {
    data_emissao?: string
    data_vencimento?: string
    documento_id?: string | number
    id?: string | number
    nome_tipo?: string
    processo_id?: string | number
    tipo_documento_id?: string | number
    validade_dias?: string
}