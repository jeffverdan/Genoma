import { ArrayResponsaveisPagamentoType, DadosProcessType, PeriodoPagamentoType } from "../Financeiro/Status"

type ExibirPendenciasType = {
    "dados_processo": DadosProcessType,
    "dados_comissao_geral": {
        "comissao_id": number,
        "valor_comissao_total": string,
        "deducao": string | null,
        "valor_comissao_liquida": string,
        "forma_pagamento": string,
        "tipo": "PARCELADO" | "À VISTA",
        "quantidade_parcelas": number
    }
    "dados_parcela": {
        "parcela_id": number,
        "periodo_pagamento": PeriodoPagamentoType,
        "valor_parcela": string,
        "planilha_id": number,
        "numero_parcela": string,
        "responsaveis_pagamento": ArrayResponsaveisPagamentoType[]
    }
    "pendencia_id": number,
    "visualizacao_pendencia": string
    "pendencia_concluida": 0 | 1
    "compradores_vendedores": {
        "id": number,
        "name": string
    }[]
};

export type { ExibirPendenciasType }