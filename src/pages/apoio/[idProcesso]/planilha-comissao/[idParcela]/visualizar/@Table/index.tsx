import { TypeGetListChavesPix } from "@/apis/Interfaces/typeGetListChavesPix";
import formatoMoeda from "@/functions/formatoMoedaViewApenas";
import { ComissaoDataType, ComissaoIndividuoType, DadosProcessoType, ParcelaComissoesType } from "@/interfaces/Apoio/planilhas_comissao";
import { Chip, Table, TableBody, TableHead, TableRow, TableCell, Avatar, TableFooter, Divider } from '@mui/material';

interface ParcelaDataType {
    comissao: ComissaoDataType
    imovel: DadosProcessoType
}

interface PropsType {
    dataParcela: ParcelaComissoesType | undefined;
    listChavesPix: TypeGetListChavesPix | undefined;
    rows: Row[];
}

type keysType = 'papel' | 'porcentagem_real' | 'desconto' | 'valor_real' | 'nome_planilha' | 'cpf_cnpj' | 'creci' | 'dados_pagamento';
interface Column {
    id: keysType
    label: string;
    minWidth?: string;
    // align?: 'right' | 'center';
    padding?: string | number;
}

interface Row extends ComissaoIndividuoType {
    papel: string
    nome_planilha: string
    cpf_cnpj: string
    class: string
}

const returnDadosPagamentos = (row: Row) => {
    return (
        <div className="dados-pagamento">
            {row.tipo_pagamento === 'pix' ?
                <>
                    <Chip className="green chip" label={'pix'} />
                    {row.chave_pix && <Chip className="chip" label={row.chave_pix} />}
                    {row.pix && <Chip className="chip" label={row.pix} />}
                </>
                : row.tipo_pagamento === 'banco' ?
                    <>
                        <Chip className="green chip" label={'banco'} />
                        {row.nome_banco && <Chip className="chip" label={row.nome_banco} />}
                        {row.agencia && <Chip className="chip" label={row.agencia} />}
                        {row.numero_conta && <Chip className="chip" label={row.numero_conta} />}
                    </>
                    : <></>
            }
        </div>
    )
};

const formatValue = (row: Row, key: keysType) => {
    if (key !== 'dados_pagamento') {        
        if(key === 'desconto' && (row[key] || row.bonificacao)) {
            const valor = (formatNumber(row.bonificacao || '')) - formatNumber(row[key]);                         
            return `${valor > 0 ? '+' : ''} ${formatoMoeda(valor || '')}`;
        } else if (!row[key]) {
            return '---'; 
        } else if(key === 'valor_real') {            
            const valor = formatoMoeda(row[key] || '');            
            return valor;
        } else if (key === 'porcentagem_real') {
            return `${Number(row[key]).toFixed(2).replace('.', ',')}%`;
        } else {
            return row[key];
        }
    }
};

const formatNumber = (value: string | null) => {
    if (!value) return 0;
    // const newValue = formatoMoeda(value);
    return Number((value.replace(/[R$.]+/g, '')).replace(",", "."));
};

const returnTotalComissao = (rows: Row[], key: 'valor_real' | 'desconto') => {
    let total = 0;
    rows?.forEach(row => {
        const value = formatNumber(formatoMoeda(row[key] || ''));        
        
        total = total + (value > 0 ? value : 0);
    });
    return formatoMoeda(total.toFixed(2));
};

const returnTotalPorcentagem = (rows: Row[]) => {
    let total = 0;
    rows?.forEach(row => {
        const value = parseFloat(Number(row.porcentagem_real).toFixed(2));   
        total += value;
    });
    return total;
};

const returnTotalComissaoEmpresa = (rows: Row[]) => {
    let total = 0;    
    rows?.filter(e => e.cpf_cnpj === '48.271.471/0001-60').forEach(row => {
        // const value = formatNumber(row[key]?.includes('R$') ? formatoMoeda(row[key] || '') : formatoMoeda(Number(row[key]).toFixed(2) || ''));        
        const value = formatNumber(formatoMoeda(row.valor_real || ''));
        total += Number(value);
    });
    console.log(total);
    
    return formatoMoeda(total.toFixed(2));
};

export default function TablePlanilha(props: PropsType) {
    const { dataParcela, rows } = props;
    console.log(rows);
    

    const columns: Column[] = [
        { id: 'papel', label: '', minWidth: '12.5vw' },
        { id: 'porcentagem_real', label: 'TOTAL COMISSÃO', minWidth: '5vw' },
        { id: 'desconto', label: 'DIFERENÇA', minWidth: '10vw' },
        { id: 'valor_real', label: 'A RECEBER', minWidth: '9vw' },
        { id: 'nome_planilha', label: 'NOME', minWidth: '22vw' },
        { id: 'cpf_cnpj', label: 'CNPJ(MEI) / CPF', minWidth: '12.5vw' },
        { id: 'creci', label: 'CRECI', minWidth: '8vw' },
        { id: 'dados_pagamento', label: 'DADOS DE PAGAMENTO', minWidth: '16.5vw' },
    ];

    return (
        <div className="container-table-planilha">
            <Table stickyHeader>
                <TableHead className='head-table'>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                style={{ width: column.minWidth }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody className="body-table">
                    {rows?.map((row, index) => {
                        return (
                            <TableRow className="row-table" key={index} hover tabIndex={-1}>
                                {columns.map((column) => {
                                    const value = column.id !== 'dados_pagamento' ? formatValue(row, column.id) : returnDadosPagamentos(row);
                                    return (
                                        <TableCell key={column.id} className={row.class} style={{ width: column.minWidth }}>
                                            {value || '---'}
                                            {/* {column.id === 'dados_pagamento' && value} */}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>

                <TableFooter className="footer-table">
                    <TableRow>
                        <TableCell className="green">
                            Total
                        </TableCell>
                        <TableCell className={returnTotalPorcentagem(rows) === 100 ? 'green' : 'red'}>
                            {returnTotalPorcentagem(rows) + '%'}
                        </TableCell>
                        <TableCell>
                            {returnTotalComissao(rows, 'desconto')}
                        </TableCell>
                        <TableCell>
                            {returnTotalComissao(rows, 'valor_real')}
                        </TableCell>

                        <TableCell className="valores-comissao" colSpan={4}>
                            <div className="valor">
                                <span>Valor total de comissão líquida =</span>
                                <p>{dataParcela?.valor_parcela}</p>
                            </div>
                            <Divider />
                            <div className="valor">
                                <span>Comissão da empresa (DNA) = </span>
                                <p>{returnTotalComissaoEmpresa(rows)}</p>
                            </div>

                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}