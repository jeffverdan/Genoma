import { DeadlineTypes, retornoApi } from "../Agenda";

interface DataRows extends retornoApi {
    id: number;
    posvendaName?: string;
    posvendaName1?: string;
    posvendaName2?: string;
    dataEntrada: string;
    horaEntrada: string;
    gerente: string;
    gerenteName2?: string;
    gerenteId: number;
    nomeCompletoGerente?: string;
    endereco: string;
    complemento?: string;
    statusPosVenda?: string;
    prazoStatus?: string;
    formaPagamento?: string[];
    responsavelPosVendaId?: string;
    dataAssinatura?: string;
    dataStatusAlterado?: string;
    dataCancelamento?: string;
    imovel?: boolean;
    recibo?: boolean;
    comprador: boolean;
    vendedor: boolean;
    statusProcessoAtual?: number;
    visualizado: boolean;
    progress_status_progresses_id: number;
    comissaoId?: number;
    laudemios?: { nome_tipo_laudemio: string}[]
    deadline: DeadlineTypes
    // progresso: number;
    // data: string;
    // statusGerente?: string;
    // prazoEscritura?: string;
    // reciboId?: string;
    // imovelId?: string;
    // origemRecibo?: string;
    // dataPrazoPos?: string;
    // comissaoId?: string;
    // foguetes: number;
}

export default DataRows