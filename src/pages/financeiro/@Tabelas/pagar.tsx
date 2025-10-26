import { Chip, Table, TableBody, TableHead, TableRow, Avatar, TableCell, Link, Snackbar, Alert, Skeleton, LinearProgress, Tooltip } from '@mui/material';
import { RowsType } from "@/interfaces/Financeiro/Listas";
import { useState } from 'react';
import { useRouter } from 'next/router';
import MenuTable from './ActionBtnMenu';
import formatoMoeda from '@/functions/formatoMoedaViewApenas';
import dynamic from 'next/dynamic';
import SkeletonTableA_Pagar from '@/components/Skeleton/Financeiro/SkeletonTableA_Pagar';
import { CornerDateType } from '@/interfaces/Financeiro/Status';

const TooltipClientOnly = dynamic(() => import('@mui/material/Tooltip'), { ssr: false });

interface PropsType {
    rows: RowsType[]
    loading: boolean
    retunProcess: () => void
}

const COLUMNS = [
    { id: 'loja_nome', label: 'Loja', minWidth: '79px', align: 'left' },
    { id: 'logradouro', label: 'Endereço', minWidth: '15.7vw', align: 'left' },
    { id: 'data_assinatura', label: 'Data de assinatura', minWidth: '79px', align: 'left' },
    { id: 'tipo_integral_parcelado', label: 'Tipo', minWidth: '79px', align: 'left' },
    { id: 'rateio', label: 'Rateio', minWidth: '13vw', align: 'left' },
    { id: 'btns_action', label: '', minWidth: '65px', align: 'center' }
] as const;

export default function TablePagar(props: PropsType) {
    const { rows, loading, retunProcess } = props;
    const [isHover, setIsHover] = useState(0);
    const router = useRouter();

    const returnRateio = (row: RowsType) => {
        const total = row.valor_parcela ? parseFloat(row.valor_parcela.replace('R$ ', '').replace('.', '').replace(',', '.')) : 0;
        const valorPagoTotal = (row.usuarios_agrupados).reduce((acc, comissao) => {
            const valorPago = comissao.valor_transferido ? comissao.valor_transferido : 0;
            return acc + valorPago;            
        }, 0);
        const rateio = `${formatoMoeda(valorPagoTotal)} de ${row.valor_parcela}`;
        const percentPago = ((valorPagoTotal / total) * 100);
        const status = percentPago === 100 ? 'Pago' : 'em andamento';

        return { rateio, percentPago, status };
    };

    const returnTooltipHTML = (row: RowsType) => {
        type KeyComissoesType = 'comunicacao' | 'corretores_opcionistas' | 'corretores_vendedores' | 'empresas' | 'gerentes' | 'gerentes_gerais' | 'royalties';

        const returnValorAPagar = (valorPago: string, valorTotal: string) => {
            const valorPagoFloat = parseFloat(valorPago.replace('R$ ', '').replace('.', '').replace(',', '.'));
            const valorTotalFloat = parseFloat(valorTotal.replace('R$ ', '').replace('.', '').replace(',', '.'));
            return formatoMoeda((valorTotalFloat - valorPagoFloat).toFixed(2));
        }

        return (
            <div className=''>
                {row.usuarios_agrupados.map((user, index) => {
                    const comissoesPagas = user.valor_transferido;
                    const comissoesNaoPagas = user.valor_faltante;

                    return (
                        <div key={index}>
                            <div className='rateio-item'>
                                <span>{user.nome.split(' ')[0]}:</span>
                                {comissoesPagas < comissoesNaoPagas ?
                                    <>
                                        <span className='orange'>A pagar:</span>
                                        <span className='orange'>{formatoMoeda(comissoesNaoPagas)}</span>
                                    </>
                                    :
                                    <>
                                        <span className='green'>Pago:</span>
                                        <span className='green'>{formatoMoeda(comissoesPagas)}</span>
                                    </>
                                }
                            </div>
                        </div>
                    );
                })}


            </div>
        )
    };

    return (
        <>
            <Table stickyHeader>
                <TableHead className='head-table'>
                    <TableRow sx={{ height: '82px' }}>
                        {COLUMNS.map((column, index) => (
                            <TableCell
                                key={column.id}
                                align={column.align}
                                className={index === 0 ? 'first' : ''}
                                style={{ width: column.minWidth }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                {loading
                    ? <SkeletonTableA_Pagar columns={COLUMNS} />
                    : <TableBody>
                        {rows?.map((row, index) => {
                            return (
                                <TableRow
                                    hover
                                    key={index}
                                    tabIndex={-1}
                                    className={`row-table ${row.status_visualizacao_atual === 0 ? 'novo' : ''}`}
                                    onMouseEnter={() => setIsHover(index)}
                                >
                                    <TableCell padding='none'>
                                        <div className={`first ${isHover === index && 'rowHover'}`}>
                                            <div className='col text' style={{ width: COLUMNS[0].minWidth }}>
                                                <Chip size='small' className='chip neutral' label={`${row?.loja_nome?.toUpperCase()}`} />
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className='cursorClick' padding='none' onClick={() => router.push(`/financeiro/${row.processo_id}/detalhes-processo`)}>
                                        <div className={`col-table`}>
                                            <div className='col text' style={{ width: COLUMNS[1]?.minWidth }}>
                                                <p>{row.logradouro}{row.numero && ', ' + row.numero}</p>
                                                <span>
                                                    {row.unidade}
                                                    {(!!row.unidade && !!row.complemento) ? ', ' + row.complemento : row.complemento}
                                                    {(!!row.unidade || !!row.complemento) && ' - '}
                                                    {row.bairro}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col data' style={{ width: COLUMNS[2]?.minWidth }}>
                                                <p>{row.data_assinatura}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col text' style={{ width: COLUMNS[3]?.minWidth }}>
                                                <p>{row.tipo_integral_parcelado === 'partes' ? "Parcelado" : "Integral"}</p>
                                                <span>{row.tipo_integral_parcelado === 'partes' && "Parcela " + row.numero_parcela}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none'>
                                        <div className={`col-table`}>
                                            <TooltipClientOnly
                                                title={returnTooltipHTML(row)}
                                                placement='top'
                                                slotProps={{
                                                    tooltip: { className: 'tooltip-rateio' }
                                                }}
                                            >
                                                <div className='col graph' style={{ width: COLUMNS[4]?.minWidth }}>
                                                    <p>{returnRateio(row).rateio}</p>
                                                    <LinearProgress variant="determinate" value={returnRateio(row).percentPago} />
                                                    <Chip label={returnRateio(row).status} className='chip primary' />
                                                </div>
                                            </TooltipClientOnly>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col actions' style={{ width: COLUMNS[5]?.minWidth }}>
                                                <MenuTable
                                                    processo_id={row.processo_id}
                                                    parcela_id={row.parcela_id}
                                                    label='Opções'
                                                    cancelar
                                                    retunProcess={retunProcess}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>

                                </TableRow>
                            );
                        })}
                    </TableBody>
                }
                {(!!rows && rows.length === 0) &&
                    <TableBody>
                        <TableRow tabIndex={-1} className='row-table'>
                            <TableCell colSpan={COLUMNS.length} style={{ border: 'none' }}>
                                Nenhum processo encontrado
                            </TableCell>
                        </TableRow>
                    </TableBody>
                }
            </Table>
        </>
    )
}
