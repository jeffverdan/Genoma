type DataRows = {
    id: number,
    processo_id: number,
    servico_detalhado_id: number,
    responsavel_requisicao_id: number,
    data_solicitacao: string,
    imovel_id: number,
    logradouro: string,
    numero: string,
    complemento: string,
    unidade: string,
    bairro: string,
    nome_status: string,
    nome_responsavel: string,
    nome: [],
    nome_gerente: string,
    nome_loja: string,
    status_atual: number,
    data_previsao: string,
    status_visualizacao_atual: number,
    core_requests_status_requests_id: number,
    status_ordenacao: number,
    onus_solicitada: number | null,
    vendedor_comarca: number | null,
    id_relacao_status: number
    quantidade_comarca?: number | null,
}

type tabType = {
    label: string,
    // active: boolean,
}

type tabsType = {
    tabs: tabType[],
    selectTab: number,
};

export type { DataRows, tabsType }