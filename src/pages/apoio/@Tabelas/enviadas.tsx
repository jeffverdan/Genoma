
import MenuTableApoio from '@/components/Apoio/MenuTable';
import ButtonComponent from '@/components/ButtonComponent';
import SkeletonTableApoio from '@/components/Skeleton/Apoio/skeletonTable';
import { DataRows } from '@/interfaces/Apoio/tabelas';
import { Chip, Table, TableBody, TableHead, TableRow, Avatar, TableCell, Link, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/router';

const columns = [
    { id: 'pos_venda', label: 'Pós-venda', minWidth: '79px', align: 'left' },
    { id: 'data_entrada', label: 'Entrada', minWidth: '90px', align: 'left' },
    { id: 'franquia', label: 'Franquia', minWidth: '92px', align: 'left' },
    { id: 'endereco', label: 'Endereço', minWidth: '15.7vw', align: 'left' },
    { id: 'comissao', label: 'Comissão', minWidth: '7vw', align: 'left' },
    { id: 'vgv', label: 'VGV', minWidth: '8vw', align: 'left' },
    { id: 'data_assinatura', label: 'Data de Assinatura', minWidth: '90px', align: 'left' },
    { id: 'gerente', label: 'Gerente', minWidth: '79px', align: 'left' },
    { id: 'data_envio', label: 'Data de envio', minWidth: '90px', align: 'left' },
    { id: 'tools', label: '', minWidth: '65px', align: 'center' },
] as const;

interface PropsData {
    rows: DataRows[]
    tabIndex: number
    loading: boolean
}

export default function Enviadas({ rows, tabIndex, loading }: PropsData) {
    const [isHover, setIsHover] = useState(0);
    const router = useRouter();

    return (
        <>
            <Table stickyHeader>
                <TableHead className='head-table'>
                    <TableRow sx={{ height: '82px' }}>
                        {columns.map((column, index) => (
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
                    ? <SkeletonTableApoio columns={columns} />
                    : <TableBody>
                        {rows?.map((row) => {
                            return (
                                <TableRow
                                    hover
                                    key={row.processo_id}
                                    tabIndex={-1}
                                    className={`row-table`}
                                    onMouseEnter={() => setIsHover(row.processo_id)}
                                >
                                    <TableCell padding='none'>
                                        <div className={`first ${isHover === row.processo_id && 'rowHover'}`}>
                                            <div className='col avatar' style={{ width: columns[0].minWidth }}>
                                                <Avatar sx={{ width: 28, height: 28, bgcolor: '' }} alt={row.pos_venda_name?.toUpperCase()} />
                                                <Chip size='small' className='chip' label={`${row?.pos_venda_name?.toUpperCase()}`} />
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col data' style={{ width: columns[1]?.minWidth }}>
                                                <p>{row.data_entrada}</p>
                                                <span>{row.hora_entrada}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col text' style={{ width: columns[2]?.minWidth }}>
                                                <p>{row.loja_name}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className='cursorClick' padding='none' onClick={() => router.push(`/apoio/${row.processo_id}/detalhes-processo`)}>
                                        <div className={`col-table`}>
                                            <div className='col text' style={{ width: columns[3]?.minWidth }}>
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
                                            <div className='col text' style={{ width: columns[4]?.minWidth }}>
                                                <p>{row.valor_comissao}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col text' style={{ width: columns[5]?.minWidth }}>
                                                <p>{row.valor_venda}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col data' style={{ width: columns[6]?.minWidth }}>
                                                <p>{row.data_assinatura}</p>
                                                <span>{row.hora_assinatura}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col avatar' style={{ width: columns[7]?.minWidth }}>
                                                <Avatar sx={{ width: 28, height: 28, bgcolor: '' }} alt={row.gerente_name?.toUpperCase()} />
                                                <Chip size='small' className='chip' label={`${row?.gerente_name?.toUpperCase()}`} />
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none'>
                                        <div className={`col-table green`}>
                                            <div className='col text' style={{ width: columns[8]?.minWidth }}>
                                                <p>{row.datas_parcelas}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col actions' style={{ width: columns[9]?.minWidth }}>
                                                <MenuTableApoio className={isHover === row.processo_id ? '' : 'hidden'} id={row.processo_id} label={'Opções'} />
                                            </div>
                                        </div>
                                    </TableCell>

                                </TableRow>
                            );
                        })}
                    </TableBody>
                }


            </Table>
            {(!!rows && rows.length === 0) &&
                <TableRow
                    tabIndex={-1}
                    className='row-table'
                >
                    <TableCell style={{ border: 'none' }}>Nenhum processo encontrado</TableCell>
                </TableRow>
            }
        </>
    )
};