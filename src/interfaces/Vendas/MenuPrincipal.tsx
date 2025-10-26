type DataOptionFilterVendas = {
    id: string;
    name: string;
    typeApi: 'rascunhos' | 'entregues' | 'arquivados' | 'revisoes' | 'finalizados';
};

type DataListagem = {
    tipo_listagem?: 'rascunhos' | 'entregues' | 'arquivados' | 'revisoes' | 'finalizados'
};

type DataRow = {
    id: number
    gerente: string;
    gerenteName2?: string;
    gerenteId: number;
    endereco: string;
    complemento?: string;
    progresso: number;
    foguetes: number;
    data: string;
    status: string;
    posvendaName?: string;
    envelope_id?: number;
    recibo_type?: 'manual' | 'docusign';
    statusGerente?: string;
    // PENDENCIAS
    processo_id: number,
    imovel_id: number,
    loja_id: number,
    logradouro: string,
    numero: string,
    unidade: string,
    bairro: string,
    cidade: string,
    uf: string,
    recibo: string | null,
    status_processo_id: number,
    porcentagem_cadastro_total: string,
    porcentagem_comissao: number,
    pendencia: [
        'recibo' | 'não tem pendencia de recibo',
        'comissao' | 'não tem pendencia de comissão'
    ]
    data_pendencia: string
    menssagem: string
    tag: TagType
};

type TagType = {
    color: 'green' | 'neutral'
    label: string
}

type DataRowsVenda = {
    length: number;
    rows: DataRow[];
    totalRows: number;
    errorApi: string;
};

type TotalProcess = {
    rascunhos?: number
    entregues?: number
    revisoes?: number
    arquivados?: number
    finalizados?: number
};



type ResApiType = {
    "processo_id": number,
    "imovel_id": number,
    "loja_id": number,
    "logradouro": string,
    "numero": string,
    "unidade": string,
    "complemento": string | null,
    "bairro": string,
    "cidade": string,
    "uf": string,
    "recibo_type": "manual" | "docusign",
    "recibo": string,
    "status_processo_id": number,
    "finance_status_id": string,
    "pendencia_id": number,
    "parcela_id": number,
    "pendencia_concluida": 0 | 1,
    "status_visualizacao": 0 | 1,
    "pendencia": "Cobrança solicitada",
    "dono_pendencia_id": number
    "numero_parcela": number
    "total_parcelas": number
}

type DataRowsPendencias = {
    length: number;
    rows: ResApiType[];
    totalRows: number;
    errorApi: string;
};

export type { TotalProcess, DataRowsVenda, TagType, DataRow, DataListagem, DataOptionFilterVendas, ResApiType, DataRowsPendencias }