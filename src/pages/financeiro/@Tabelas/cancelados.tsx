
import { Chip, Table, TableBody, TableHead, TableRow, Avatar, TableCell, Link, Snackbar, Alert, Skeleton, LinearProgress, Tooltip } from '@mui/material';
import { RowsType } from "@/interfaces/Financeiro/Listas";
import { useState } from 'react';
import { useRouter } from 'next/router';
import MenuTable from './ActionBtnMenu';
import formatoMoeda from '@/functions/formatoMoedaViewApenas';
import dynamic from 'next/dynamic';
import SkeletonTableA_Pagar from '@/components/Skeleton/Financeiro/SkeletonTableA_Pagar';

interface PropsType {
    rows: RowsType[]
    loading: boolean
}


const COLUMNS = [
    { id: 'loja_nome', label: 'Loja', minWidth: '79px', align: 'left' },
    { id: 'logradouro', label: 'Endereço', minWidth: '15.7vw', align: 'left' },
    { id: 'valor_parcela', label: 'Valor da parcela', minWidth: '140px', align: 'left' },
    { id: 'data_assiantura', label: 'Data de assinatura', minWidth: '121px', align: 'left' },
    { id: 'data_cancelamento', label: 'Data de cancelamento', minWidth: '121px', align: 'left' },
    { id: 'tipo_integral_parcelado', label: 'Tipo', minWidth: '79px', align: 'left' },
    { id: 'btns_action', label: '', minWidth: '65px', align: 'center' }
] as const;

export default function TableCancelados(props: PropsType) {
    const { rows, loading } = props;
    const [isHover, setIsHover] = useState(0);
    const router = useRouter();

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

                                    <TableCell padding='none' style={{ width: COLUMNS[2]?.minWidth }}>
                                        <div className={`col-table red`} >
                                            <div className='col text' >
                                                <p>{row.valor_parcela}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none' style={{ width: COLUMNS[3]?.minWidth }}>
                                        <div className={`col-table`} >
                                            <div className='col data'>
                                                <p>{row.data_assinatura}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none' style={{ width: COLUMNS[4]?.minWidth }}>
                                        <div className={`col-table red`} >
                                            <div className='col data'>
                                                <p>{row.data_cancelamento}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col text' style={{ width: COLUMNS[5]?.minWidth }}>
                                                <p>{row.tipo_integral_parcelado === 'partes' ? "Parcelado" : "Integral"}</p>
                                                <span>{row.tipo_integral_parcelado === 'partes' && "Parcela " + row.numero_parcela}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col actions' style={{ width: COLUMNS[6]?.minWidth }}>
                                                <MenuTable
                                                    processo_id={row.processo_id}
                                                    parcela_id={row.parcela_id}
                                                    label='Opções'
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
