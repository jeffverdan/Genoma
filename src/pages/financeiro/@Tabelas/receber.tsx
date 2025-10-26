import { Chip, Table, TableBody, TableHead, TableRow, Avatar, TableCell, Link, Snackbar, Alert, Skeleton, Collapse } from '@mui/material';
import { RowsType } from "@/interfaces/Financeiro/Listas";
import SkeletonTableComissao from '@/components/Skeleton/Financeiro/SkeletonTable';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MenuTable from './ActionBtnMenu';
import { useResizeObserver } from '@/hooks/useResizeObserver';
import { CornerDateType } from '@/interfaces/Financeiro/Status';

interface PropsType {
    rows: RowsType[]
    loading: boolean
    retunProcess: () => void
}

const COLUMNS = [
    { id: 'loja_nome', label: 'Loja', minWidth: '79px', align: 'left' },
    { id: 'logradouro', label: 'Endereço', minWidth: '15vw', align: 'left' },
    { id: 'valor_parcela', label: 'Valor da parcela', minWidth: '99px', align: 'left' },
    { id: 'data_assinatura', label: 'Data de assinatura', minWidth: '79px', align: 'left' },
    { id: 'data_prevista', label: 'Data prevista', minWidth: '79px', align: 'left' },
    { id: 'tipo_integral_parcelado', label: 'Tipo', minWidth: '79px', align: 'left' },
    { id: 'array_pagadores', label: 'Confirmação de pagadores', minWidth: '79px', align: 'left' },
    { id: 'status_posvenda', label: 'Status Pós-Venda', minWidth: '5vw', align: 'left' },
    { id: 'status_financeiro', label: 'Status Financeiro', minWidth: '5vw', align: 'left' },
    { id: 'btns_action', label: '', minWidth: '65px', align: 'center' }
] as const;

export default function TableReceber(props: PropsType) {
    const { rows, loading, retunProcess } = props;
    const [isHover, setIsHover] = useState(0);
    const router = useRouter();
    const { ref, size } = useResizeObserver<HTMLDivElement>();

    const returnStatusPagadores = (row: RowsType) => {
        const pagos = row.responsaveis_pagamento.filter(e => !!e.comfirmacao_pagamento).length;
        const total = row.responsaveis_pagamento.length;
        const label = total > 0 ? `${pagos} de ${total}` : '---';

        return {
            label,
            className: pagos === total ? 'green' : 'orange',
            status: total > 0 ? pagos === total ? 'Pago' : 'Aguardando' : ''
        };
    };

    return (
        <div ref={ref}>
            <Table stickyHeader >
                <TableHead className='head-table'>
                    <TableRow sx={{ height: '82px' }}>
                        {COLUMNS.filter((e, index) => size.width > 1400 ? true : e.id !== 'array_pagadores').map((column, index) => (
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
                    ? <SkeletonTableComissao columns={COLUMNS} />
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
                                        <div className={`col-table green`}>
                                            <div className='col text ' style={{ width: COLUMNS[2]?.minWidth }}>
                                                <p>{row.valor_parcela}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col data' style={{ width: COLUMNS[3]?.minWidth }}>
                                                <p>{row.data_assinatura}</p>
                                            </div>
                                        </div>
                                    </TableCell>



                                    <TableCell padding='none'>
                                        <div className={`col-table green`}>
                                            <div className='col data' style={{ width: COLUMNS[4]?.minWidth }}>
                                                <p>{row.data_prevista}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col text' style={{ width: COLUMNS[5]?.minWidth }}>
                                                <p>{row.tipo_integral_parcelado === 'partes' ? "Parcelado" : "Integral"}</p>
                                                <span>{row.tipo_integral_parcelado === 'partes' && row.numero_parcela + '/' + row.total_parcelas}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {size.width > 1400 &&
                                        <TableCell padding='none'>
                                            <div className={`col-table`}>
                                                <div className='col text' style={{ width: COLUMNS[6]?.minWidth }}>
                                                    <p>{returnStatusPagadores(row).label}</p>
                                                    <span className={returnStatusPagadores(row).className}>{returnStatusPagadores(row).status}</span>
                                                </div>
                                            </div>
                                        </TableCell>}


                                    <TableCell padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col status' style={{ width: COLUMNS[7]?.minWidth }}>
                                                <Chip size='small' className={`chip primary`} label={`${row.status_nome.toUpperCase()}`} />
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col status' style={{ width: COLUMNS[8]?.minWidth }}>
                                                <Chip size='small' className={`chip ${row.status_color}`} label={`${row.status_parcela.toUpperCase()}`} />
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col actions' style={{ width: COLUMNS[9]?.minWidth }}>
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


        </div>
    )
}
