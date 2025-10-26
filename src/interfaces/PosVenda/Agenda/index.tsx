import { Dayjs } from 'dayjs';

type ColorTypes = {
    msg: JSX.Element,
    action_route?: string
    action_label?: string
    action_params?: string
    action_link?: string
}

type DeadlineTypes = {
    vermelhos: ColorTypes[],
    laranjas: ColorTypes[],
    amarelos: ColorTypes[]
}

type statusType = 'Entrada' | 'Análise' | 'Certidões' | 'Taxas' | 'Escritura' | 'Registro' | 'Finalizado' | 'Criação Registro de Sinal' | 'Venda Completa' | 'Vendedor Completo' | 'Comprador Completo' | 'Venda Incompleta' | 'Vendedor Incompleto' | 'Comprador incompleto' | 'Criação de rascunho' | 'Upload de recibo' | 'Boletim de venda Imovel' | 'Boletim de venda Vendedores' | 'Boletim de venda Compradores' | 'Boletim de venda Comissão' | 'Averbação' | 'Correção solicitada' | 'Arquivado' | 'Revisão sem Comprador' | 'Pré-venda' | 'Franqueado responsável pela pós-negociação' | 'Cancelado' | 'ITBI' | 'Banco e Documentação' | 'Engenharia' | 'Conformidade' | 'Emissão de Contrato' | 'Laudêmio'

type retornoApi = {
    id: number
    processo_id: number
    logradouro: string
    imovel_id: number
    uf: string
    cidade: string
    numero: string
    unidade?: string
    complemento?: string
    comfirmacao_gerente_id: string | null
    comfirmacao_gerente: string | null
    data_reagendada_gerente: string | null
    data_agenda_pos: string | null
    data_assinatura: string
    data_analise: string
    prazo_escritura: string
    dataEscritura: Dayjs
    dataEscrituraFormat: string
    responsavel_id: number
    nome_responsavel_02: string // NOME + SEGUNDO NOME ABREVIADO
    certidao: ArrDocs[]
    itbi: ArrDocs[]
    deadline: DeadlineTypes
    status: statusType
    status_processo_id: number
}

type ArrDocs = {
    id: number
    documento_id: number
    tipo: string
    data_validade: Date
    dias_prazo: string
    data_entrada_documento: string
    id_dono_documento: string
}

export type { retornoApi, DeadlineTypes, ArrDocs }