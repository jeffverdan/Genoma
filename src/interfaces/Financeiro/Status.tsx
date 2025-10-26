type ParcelaProcessoResponse = {
    dados_processo: DadosProcessType,
    comissao_geral: ComissionType,
    parcela: ParcelaType;
    usuarios_agrupado: UserToPayType[];
    "resumo_venda": {
        "valor_total_dna": number,
        "valor_dna": number,
        "valor_benesh": number
    },
    rateio: {
        valor_total: number;
        valor_restante: number;
        valor_transferido: number;
    },
    transferencias: TransferenciasType[]
    arrayDatasTransf: string[]
}

type TransferenciasType = {
    "valor_transferido": string | null,
    "valor_faltante": string | null,
    "data_criacao": string,
    "data_transferencia": string,
    "finance_status_id": 12 | 13,
    "nome_status": "EM TRANSFERÊNCIA" | "TRANSFERIDO",
    "comprovante_id": number | null,
    "nome_original": string | null
    "nome_destinatario": string
}

type StatusParcelaType = "AGUARDANDO PLANILHA" | "AGUARDANDO MOMENTO" | "COBRANÇA SOLICITADA" | "COBRANÇA PERMITIDA" | "BOLETO ENVIADO" | "AGUARDANDO PAGAMENTO" | "PAGO" | "Cancelado" | "CONCLUÍDO";

type ComissionType = {
    id: number;
    processo_id: number;
    comissao: "partes" | "integral";
    tipo_pagamento: "Parcelada" | "Integral";
    verificar_enviar_planilha: number;
    valor_comissao_total: string;
    deducao: string | null;
    liquida: string;
    valor_comissao_liquida: string;
    observacoes: string | null;
    data_atualizacao: string;
    valor_receber_empresa: string | null;
    valor_receber_empresa_opcao: string;
    porcentagem_comissao_gerentes: string;
    porcentagem_comissao_gerente_gerais: string;
    porcentagem_corretores_vendedores_comissao: string;
    porcentagem_corretores_opicionistas_comissao: string;
    porcentagem_empresa: string;
    desconto_empresa: string | null;
    status_visualizacao_apoio: 0 | 1;
    verificar_repasse: null | 0 | 1;
    parcelas_empresa: ParcelaEmpresaType[];
    // vendedor_responsavel_pagamento: any[];
    // observacao_responsavel_pagamento: any;
    ultima_observacao_gerente: string | null;
};

type DadosProcessType = {
    "processo_id": number,
    "codigo": string,
    "logradouro": string,
    "uf": string,
    "cidade": string,
    "numero": string,
    "unidade": string | null,
    "complemento": null | string,
    "bairro": string,
    "data_assinatura": string,
    "loja_name": string,
    "loja_id": number,
    "gerente_id": number,
    "gerente_name": string,
    "pos_venda_id": number,
    "pos_venda_name": string,
    "id_gg_loja": number
}

type ArrayResponsaveisPagamentoType = {
    "id": number | null;
    "usuario_id": number | null;
    "valor_pagamento": string,
    "boleto_id": null | number,
    "data_envio": null | string,
    "comfirmacao_pagamento": 0 | 1,
    "usuario_nome": string,
    "nome_boleto": null | string,
    "tipo_documento_id": null | number,
    "papel": "Vendedor" | "Comprador",
    "data_vencimento": null | string,
    "data_emissao": null | string,
    "data_validade": null | string,
}

type PeriodoPagamentoType = "1" | "2" | "3" | "4" | "5";

type UserToPayType = {
    "usuario_id": number | null,
    "empresa_id": number | null,
    "nome": string,
    "valor_total": number,
    "valor_faltante": number | 0,
    "valor_transferido": number | 0,
    "data_criacao": null | string,
    "data_transferencia": null | string,
    "finance_status_id": number | null,
    "nome_status": string | null,
    "tipo": "empresa" | "usuario"
    status_color: 'green' | 'orange' | 'primary',
    "cnpj": string | null,
    "cpf_cnpj": string | null,
    'dados_bancarios': {
        "id": number,
        "agencia": string | null,
        "numero_conta": string | null,
        "pix": string | null,
        "usuario_id": number,
        "banco_id": number | null,
        "created_at": string,
        "updated_at": string,
        "tipo_chave_pix_id": string | null
    }
}

type PlanilhasDocType = {
    "id": number,
    "processo_id": number,
    "tipo_documento_id": null | number,
    "link": null,
    "identifica_documento": string | null,
    "identifica_documento_id": string | null,
    "created_at": string,
    "updated_at": string,
    "arquivo": string,
    "core_request_id": null,
    "nome_original": string,
    "active": 1 | 0,
    "parcela_id": number
}

type ParcelaEmpresaType = {
    "id": number,
    "valor_parcela": string,
    "periodo_pagamento": PeriodoPagamentoType,
    "dia_pagamento": string,
    "processo_id": number,
    "comissao_id": number,
    "created_at": string,
    "updated_at": string,
    "numero_parcela": string,
    "comfirmacao_pagamento": 0 | 1,
    "ultima_data_envio": string,
    "valor_transferido": null | string,
    "valor_faltante": null | string,
    "data_comissao": string,
    "nome_periodo": string,
    "responsaveis_pagamento": []
}

type ParcelaType = {
    id: number | null;
    processo_id: number | null;
    comissao_id: number | null;
    periodo_pagamento: PeriodoPagamentoType;
    dia_pagamento: string;
    numero_parcela: string;
    valor_parcela: string;
    ultima_data_envio: string;
    data_criacao: string;
    data_ultima_atualizacao: string;
    corretores_vendedores: ArrayPessoaType[];
    corretores_opcionistas: ArrayPessoaType[];
    tipo_laudo_opcionista_label: string | null;
    gerentes: ArrayPessoaType[];
    diretores_gerais: ArrayPessoaType[] | [];
    repasse_franquias: ArrayPessoaType[] | [];
    royalties: RoyaltiesComunicacaoType;
    comunicacao: RoyaltiesComunicacaoType;
    empresas: EmpresaType[];
    planilha_id: number | null;
    planilhas: PlanilhasDocType[];
    valor_transferido: string | null;
    valor_faltante: number | null;
    responsaveis_pagamento: ArrayResponsaveisPagamentoType[];
    status: {
        finance_status_id: 5 | 6 | 7 | null
        status_parcela: StatusParcelaType | null
        color: "green" | "orange" | "primary" | "neutral" | "red" | null
    }
    quantidade_parcela?: number
    boleto_enviado?: boolean
    total_excedentes?: string
    total_multa?: string
    total_juros?: string
}

type EmpresaType = {
    "empresa_id": number,
    "nome_empresarial": string,
    "cnpj": string,
    "creci": string,
    "relacao_id": number,
    "porcentagem_real": string,
    "valor_real": string,
    "desconto": null | string,
    "bonificacao": string | null,
    "tipo_pagamento": "pix" | "banco",
    "nome_banco": string | null,
    "agencia": string | null,
    "numero_conta": string | null,
    "pix": string | null,
    "tipo_chave_pix_id": null | number,
    "banco_id": number | null,
}

type RoyaltiesComunicacaoType = {
    "porcentagem_real": string,
    "valor_real": string
    "comissao_id": number,
    "empresa_id": null,
    "parcela_id": number,
    "company_bank_details_id": number,
    "tipo_pagamento": "pix" | "banco",
    "agencia": string | null,
    "numero_conta": string | null,
    "pix": null | string,
    "tipo_chave_pix_id": null | number,
    "banco_id": number | null,
    "nome_banco": string | null,
    "company_commission_id": number,
    "nome_empresarial": string,
    "cnpj": string,
    "creci": string | null,
    "tipo": "royalties" | "comunicacao",
}

type ArrayPessoaType = {
    "porcentagem_real": string,
    "porcentagem_comissao": string | null,
    "valor_real": string,
    "usuario_id": number,
    "comissao_id": number,
    "empresa_id": number | null,
    "parcela_id": number,
    "total_comissao": string,
    "name": string,
    "cpf": string,
    "desconto": null | string,
    "tipo_pessoa": "PF" | "PJ",
    "nome_empresarial": null | string,
    "cnpj": null | string,
    "tipo_pagamento": "pix" | "banco",
    "dados_bancario_receber_id": number,
    "agencia": string | null,
    "numero_conta": null | string,
    "pix": string | null,
    "banco_id": null | number,
    "nome_banco": null | string,
    "creci": string | null,
    "tipo_chave_pix_id": null | number,
    "chave_pix": null | string
}

type CornerDateType = { open: boolean; title: string; subtitle: string; actionPrimary?: () => void; labelPrimary?: string; contador?: number; secondaryAction?: () => void; labelSecondary?: string; }

export type { ParcelaProcessoResponse, DadosProcessType, ComissionType, ArrayResponsaveisPagamentoType, PeriodoPagamentoType, UserToPayType, PlanilhasDocType, ParcelaEmpresaType, EmpresaType, RoyaltiesComunicacaoType, ArrayPessoaType, StatusParcelaType, CornerDateType, ParcelaType };