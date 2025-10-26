import { APIResType, RowsType } from '@/interfaces/Financeiro/Listas';
import axiosInstance from '../http/axiosInterceptorInstance';
import { FiltersKeys, FiltersType } from '@/components/Filters/interfaces';
import { EnderecoFilterData } from '@/interfaces/PosVenda/FiltroEndereco';

interface PropsType {
    page: number;
    tabela: 'a_receber' | 'a_pagar' | 'concluido' | 'cancelado' 
    filtro?: {
        endereco: string | EnderecoFilterData | null;
        periodo_inicial: string;
        periodo_final: string;
        filtro_loja: FiltersType[] | undefined;
        filtro_cliente_gerente: FiltersType[] | undefined;
        filtro_status: FiltersType[] | undefined;
        filtro_tipo_venda: FiltersType[] | undefined;
        filtro_status_financeiro: FiltersType[] | undefined;
    };
    ordenacao?: {
        patch: string;
        id: number;
    }
};

interface ApiResponseType {
    rows: RowsType[];
    total: number;
    totalRows: number;
    last_page: number;
}

const arrFilter = [
    { filtro: 'filtro_tipo_venda', param: 'tipo_venda' },
    { filtro: 'filtro_status', param: 'status_id' },
    { filtro: 'filtro_cliente_gerente', param: 'filtro_cliente_gerente' },
    { filtro: 'filtro_loja', param: 'loja_id' },
    { filtro: 'filtro_status_financeiro', param: 'finance_status_id' }
] as const

const STATUS_COLOR = [
    { key: "aguardando planilha", color: "neutral" },
    { key: "aguardando pagamento", color: "orange" },
    { key: "aguardando recibo de sinal", color: "orange" },
    { key: "aguardando certidões", color: "orange" },
    { key: "aguardando escritura", color: "orange" },
    { key: "aguardando registro", color: "orange" },
    { key: "cobrança solicitada", color: "primary" },
    { key: "cobrança permitida", color: "green" },
    { key: "PAGO", color: "green" }
] as const;

async function postFinanceiroTable(props: PropsType): Promise<ApiResponseType> {
    const { page, filtro, ordenacao, tabela } = props;
    const token = localStorage.getItem('token');
    let data: ApiResponseType = {
        rows: [],
        total: 0,
        totalRows: 0,
        last_page: 0
    };

    // TRANSFORMA STRING FORMAS DE PAGAMENTO EM UM ARRAY
    const returnFormaPagamento = (value: string) => {
        if (!value) return [""];
        const newValue = value.trim().split(", ");
        return newValue.map((e) => e.replace(",", ""));
    };

    const arrayData = new FormData();
    arrayData.append('usuario_id', localStorage.getItem('usuario_id') || '');
    arrayData.append('aba_financeiro', tabela);    
    arrayData.append('page', page.toString());
    arrayData.append('filtro_endereco', typeof filtro?.endereco === 'string' ? filtro?.endereco : filtro?.endereco?.logradouro || "");
    arrayData.append('filtro_numero', typeof filtro?.endereco === 'string' ? '' : filtro?.endereco?.numero || "");
    arrayData.append('ordenacao', ordenacao?.patch ? `${ordenacao.patch}_${ordenacao.id}` : '');
    arrayData.append('filtro_periodo_inicial', filtro?.periodo_inicial || '');
    arrayData.append('filtro_periodo_final', filtro?.periodo_final || '');

    arrFilter.forEach((key) => {
        (filtro?.[key.filtro] as FiltersType[])?.forEach((e, index) => {
            if (e.id) {
                arrayData.append(`${key.param}[${index}]`, (e.id || '').toString())
            } else if (e.label) {
                arrayData.append(`${key.param}[${index}]`, e.label)
            }
        })
    });

    await axiosInstance.post('listagem_financeiro_genoma', arrayData, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }).then((res: APIResType) => {
        if (res?.data) {
            console.log('Response from listagem_financeiro_genoma:', res.data);            

            data = {
                rows: res.data.data.map((row, index) => ({
                    ...row,
                    loja_nome: row.loja_name,
                    tipo_integral_parcelado: row.tipo_venda === 'Integral' ? 'integral' : 'partes',
                    status_nome: row.status_atual,
                    status_color: STATUS_COLOR.find(e => e.key === row.status_parcela.toLowerCase())?.color || 'neutral', // TODO: MUDAR PARA A COR CORRETA
                    status_visualizacao_atual: row.status_atual_id,                    
                })),
                total: res.data.total,
                totalRows: res.data.per_page,
                last_page: res.data.last_page
            };
        }
    })

    return data;
};

export default postFinanceiroTable;