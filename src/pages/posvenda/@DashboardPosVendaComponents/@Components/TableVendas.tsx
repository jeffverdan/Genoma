import React, { useEffect, useRef, useState } from 'react';
import Button from '@/components/ButtonComponent';
import { HiEllipsisHorizontal, HiCheck, HiPencil } from 'react-icons/hi2';
import { Chip, Table, TableBody, TableHead, TableRow, TableCell, Avatar, Tooltip } from '@mui/material';
import { HiInformationCircle } from 'react-icons/hi';
import { format, parse, differenceInDays } from 'date-fns';
import { CurrencyDollarIcon, DocumentTextIcon, HomeModernIcon } from '@heroicons/react/24/solid';
import SellerIco from '@/images/Seller_ico';
import BuyerIco from '@/images/Buyer_ico';
import dayjs from 'dayjs';
import MenuOpcoesVenda from '@/components/PosVenda/MenuOpcoesVenda';
import SkeletonTablePos from '@/components/Skeleton/PosVenda/skeletonTable';
import { useRouter } from 'next/router';
import DataRows from '@/interfaces/PosVenda/DadosPainelTeste';
import { arrDeadLines } from '@/functions/returnDeadLines';


interface Column {
    id:
    'pos_venda' | 'endereco' | 'status' | 'prazo_status' | 'data_entrada' | 'forma_pagamento' | 'laudemio' | 'gerente' | 'tools' |
    'data_assinatura' | 'prazo_escritura' | 'res_pos_venda' | 'recibo' | 'ico_correcoes' | 'dias_corridos' | 'data_pedido' |
    'data_conclusao' | 'data_cancelamento';
    label: string;
    minWidth?: string;
    align?: 'right' | 'center';
    padding?: string | number;
}

interface PropsData {
    // loadingMenu: boolean
    rows: DataRows[]
    loading: boolean
    setLoading: (e: boolean) => void
    userId: number | undefined
    tabIndex: number
    collapseMenuPrincipal: boolean
    returnList: (idArrayVendas?: number) => Promise<void>
    openDialog: boolean
    setOpenDialog: (e: boolean) => void
    typeDialog?: string
    setTypeDialog: (e: string) => void
}

export default function TableVendas(props: PropsData,) {
    const router = useRouter();
    const { rows, loading, setLoading, userId, tabIndex, collapseMenuPrincipal, openDialog, setOpenDialog, typeDialog, setTypeDialog, returnList } = props;
    const gerenteDivRef = useRef<HTMLDivElement>(null);
    const [divWidth, setDivWidth] = useState<number>(0);

    const getDivWidth = () => {
        if (gerenteDivRef.current) {
            setDivWidth(gerenteDivRef.current.offsetWidth || 0);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            getDivWidth();
        }, 600)
    }, [collapseMenuPrincipal])

    useEffect(() => {
        // Chamada inicial para obter a largura da div
        getDivWidth();

        // Event listener para atualizar a largura quando o tamanho da janela muda
        const handleResize = () => getDivWidth();
        window.addEventListener('resize', handleResize);

        // Removendo o event listener ao desmontar o componente
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // LISTA DE PROCESSOS
    const [isHover, setIsHover] = useState(0);
    const [columns, setColumns] = useState<Column[]>([]);

    useEffect(() => {
        setIsHover(rows[0]?.id || 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows])

    useEffect(() => {
        if (tabIndex === 3) setColumns(columnsAndamento);
        else if (tabIndex === 4) setColumns(columnsRevisoes);
        else if (tabIndex === 5) setColumns(columnsFinalizados)
        else setColumns(columnsCancelados);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabIndex]);

    const columnsAndamento: Column[] = [
        { id: 'pos_venda', label: 'Pós-venda', minWidth: '6.60%', },
        { id: 'endereco', label: 'Endereço', minWidth: '29.65%' },
        { id: 'status', label: 'Status', minWidth: '7.51%' },
        { id: 'prazo_status', label: 'Prazo do Status', minWidth: '118px' },
        { id: 'data_entrada', label: `Data/hora de entrada`, minWidth: '9.68%' },
        { id: 'forma_pagamento', label: 'Forma de pagamento', minWidth: '9.45%' },
        { id: 'laudemio', label: 'Laudêmio', minWidth: '9.45%' },
        { id: 'gerente', label: 'Gerente', minWidth: '8.31%', },
        { id: 'tools', label: '', minWidth: '23%', align: 'right' },
    ];

    const columnsRevisoes: Column[] = [
        { id: 'pos_venda', label: 'Pós-venda', minWidth: '7%' },
        { id: 'endereco', label: 'Endereço', minWidth: '28%' },
        { id: 'data_assinatura', label: 'Data de Assinatura', minWidth: '10%' },
        { id: 'data_pedido', label: 'Data do Pedido', minWidth: '10%' },
        { id: 'dias_corridos', label: 'Dias corridos da venda', minWidth: '7%', padding: '0px' },
        { id: 'ico_correcoes', label: 'Correções', minWidth: '1%', padding: '16px 0px 0px 16px' },
        { id: 'laudemio', label: 'Laudêmio', minWidth: '9.45%' },
        { id: 'gerente', label: 'Gerente', minWidth: '6%', },
        { id: 'tools', label: '', minWidth: '12%', align: 'right', padding: '16px 16px 0px 0px' },
    ];

    const columnsFinalizados: Column[] = [
        { id: 'pos_venda', label: 'Pós-venda', minWidth: '9%', align: 'center' },
        { id: 'endereco', label: 'Endereço', minWidth: '30%' },
        { id: 'data_conclusao', label: 'Data de conclusão', minWidth: '10%' },
        { id: 'forma_pagamento', label: 'Forma de pagamento', minWidth: '10%' },
        { id: 'laudemio', label: 'Laudêmio', minWidth: '10%' },
        { id: 'gerente', label: 'Gerente', minWidth: '9%', align: 'center' },
        { id: 'tools', label: '', minWidth: '40%', align: 'right' },
    ];

    const columnsCancelados: Column[] = [
        { id: 'pos_venda', label: 'Pós-venda', minWidth: '9%', align: 'center' },
        { id: 'endereco', label: 'Endereço', minWidth: '30%' },
        { id: 'data_cancelamento', label: 'Data de cancelamento', minWidth: '10%' },
        { id: 'forma_pagamento', label: 'Forma de pagamento', minWidth: '10%' },
        { id: 'laudemio', label: 'Laudêmio', minWidth: '9%', align: 'center' },
        { id: 'gerente', label: 'Gerente', minWidth: '9%', align: 'center' },
        { id: 'tools', label: '', minWidth: '40%', align: 'right' },
    ];

    const [today] = useState(format(new Date(), 'dd-MM-yyyy'));
    function comparaDate(prazo: string | undefined) {
        if (!prazo) return ''
        const todayFormat = parse(today, 'dd-MM-yyyy', new Date());
        const dateCompare = parse(prazo.replace(/\//g, '-'), 'dd-MM-yyyy', new Date());
        const daysDifference = differenceInDays(dateCompare, todayFormat);
        if (!dateCompare) return ''
        if (dateCompare < todayFormat) {
            return 'Vencida';
        }
        else if (daysDifference <= 3 && daysDifference >= 0) {
            return 'Alerta';
        }
        else {
            return 'Em dia';
        }
    };

    const calcDiasCorridos = (value?: string) => {
        let result = 0 as number
        if (value) {
            const data = value.split("/");
            const oldDataFormat = data[2] + '-' + data[1] + '-' + data[0];
            const newData = dayjs(oldDataFormat);
            const today = dayjs();
            result = (today.diff(newData, 'day'));
        }
        return result;
    };

    const ReturnIconsTable = (props: { row?: DataRows }) => {
        const { row } = props;
        return (
            <>
                <div className={`tooltip fixed`} >
                    <HomeModernIcon className={row?.imovel ? 'sucess' : ''} height={18} />
                    <span className='tooltip-text fixed'>Imóvel</span>
                </div>

                <div className={`tooltip fixed`} >
                    <SellerIco className={row?.vendedor ? 'sucess' : ''} height={20} />
                    <span className='tooltip-text fixed'>Vendedores</span>
                </div>

                <div className={`tooltip fixed`} >
                    <BuyerIco className={row?.comprador ? 'sucess' : ''} height={20} />
                    <span className='tooltip-text fixed'>Compradores</span>
                </div>

                <div className='tooltip fixed' >
                    <DocumentTextIcon className={row?.recibo ? 'sucess' : ''} height={18} />
                    <span className='tooltip-text fixed'>Recibo de sinal</span>
                </div>

                {
                    tabIndex !== 4 &&
                    <div className='tooltip fixed' >
                        <CurrencyDollarIcon className={row?.comissaoId ? 'sucess' : ''} height={18} />
                        <span className='tooltip-text fixed'>Comissão</span>
                    </div>
                }
            </>
        )
    };

    const handleMenu = async (e?: string) => {
        if (e) router.push(`/posvenda${e}`);
    };

    return (
        <>
            <Table stickyHeader>
                <TableHead className='head-table'>
                    <TableRow sx={{ height: '82px' }}>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align}
                            // style={{ padding: column.padding, paddingBottom: '18px' }}
                            >
                                {loading ? '' : column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                {(!loading) ?

                    <TableBody>
                        {/* {(!!rows && rows.length === 0) &&
                            <TableRow
                                tabIndex={-1}
                                className='row-table'
                            >
                                <TableCell>Nenhum processo encontrado</TableCell>
                            </TableRow>
                        } */}

                        {rows?.map((row) => {
                            return (
                                <>
                                    <TableRow
                                        hover
                                        key={row.id}
                                        tabIndex={-1}
                                        className={`row-table ${row.visualizado ? 'visualizado' : 'aguardando-click'}`}
                                        onMouseEnter={() => setIsHover(row.id)}
                                    >
                                        <TableCell style={{ width: columns[0]?.minWidth }} padding='none'>
                                            <div className={`container-col-gerente ${isHover === row.id && 'rowHover'}`}>
                                                <div className='resp-pos-venda'>
                                                    <Avatar sx={{ width: 28, height: 28, bgcolor: '' }} alt={row.posvendaName} />
                                                    <Chip className='chip neutral chip-name' label={`${row.posvendaName1?.toUpperCase()}${row.posvendaName2 ? ' ' + row.posvendaName2?.[0] + '.' : ''}`} />
                                                </div>
                                            </div>
                                        </TableCell>


                                        <TableCell
                                            style={{ width: columns[1]?.minWidth, cursor: 'pointer' }}
                                            onClick={() => router.push(`posvenda/${row.id}/detalhes-venda`)}
                                        >
                                            <div className='col-endereco' ref={gerenteDivRef}>
                                                {/* <div className='tooltip fixed' > */}
                                                <div className='' >
                                                    <p>{row.endereco}</p>
                                                    <span className='complemento'>{row.complemento}</span>
                                                    {/* <span className='tooltip-text fixed'>{row.endereco + ', ' + row.complemento}</span> */}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {tabIndex === 3 &&
                                            // ABA ANDAMENTO
                                            <>
                                                <TableCell style={{ width: columns[2]?.minWidth }}>
                                                    <div className='col-status'>
                                                        <Chip label={row.statusPosVenda ? row.statusPosVenda.toUpperCase() : ''} className={'chip primary'} />
                                                        <p>{row.dataStatusAlterado || '---'}</p>

                                                        <div  className='deadlines-container'>
                                                            {arrDeadLines.map((deadline) =>
                                                                !!row.deadline?.[deadline.key][0] ?
                                                                    <Tooltip key={deadline.key} title={`${row.deadline?.[deadline.key].length > 1 ? deadline.labelPlural : deadline.labelSingular}`}>

                                                                        <Chip
                                                                            className={`chip ${deadline.color}`}
                                                                            label={`${row.deadline?.[deadline.key].length}`}
                                                                        />
                                                                    </Tooltip>
                                                                    : <></>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className={`col-prazo-escritura ${isHover === row.id && 'hover'} ${comparaDate(row.prazoStatus)} `} style={{ width: columns[3]?.minWidth }}>
                                                    <div>
                                                        <p>{row.prazoStatus}</p>
                                                        <span>{comparaDate(row.prazoStatus)}</span>
                                                    </div>
                                                </TableCell>

                                                <TableCell className={`col-data-entrada`} style={{ width: columns[4]?.minWidth }}>
                                                    <div>
                                                        <p>{row.dataEntrada}</p>
                                                        <span>{row.horaEntrada}</span>
                                                    </div>
                                                </TableCell>

                                                <TableCell style={{ width: columns[5]?.minWidth }}>
                                                    <div className='col-forma-pagamento'>
                                                        {row.formaPagamento?.map((payment: string, index) => (
                                                            <div key={index}>
                                                                {payment && <Chip className='chip neutral' label={payment.toUpperCase()} />}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                            </>
                                        }

                                        {tabIndex === 4 &&
                                            // ABA REVISÃO
                                            <>
                                                <TableCell style={{ width: columns[2]?.minWidth }}>
                                                    <div className='col-data-assinatura'>
                                                        {row.dataAssinatura}
                                                    </div>
                                                </TableCell>

                                                <TableCell className={`col-pedido-revisao`} style={{ width: columns[3]?.minWidth }}>
                                                    <p>{row.dataStatusAlterado || "---"}</p>
                                                    <span>{row.posvendaName ? "Por " + row.posvendaName : "---"}</span>
                                                </TableCell>

                                                <TableCell
                                                    style={{ width: columns[4]?.minWidth, padding: columns[4]?.padding }}
                                                    className={`col-dias-corridos ${calcDiasCorridos(row.dataAssinatura) > 15 ? 'red' : calcDiasCorridos(row.dataAssinatura) > 5 ? 'yellow' : 'green'}`}
                                                >
                                                    {calcDiasCorridos(row.dataAssinatura)}
                                                </TableCell>

                                                <TableCell style={{ width: columns[5]?.minWidth, minWidth: '96px', padding: columns[5].padding }} className='col-icons-revisoes'>
                                                    <ReturnIconsTable row={row} />
                                                </TableCell>
                                            </>
                                        }

                                        <TableCell style={{ width: columns[6]?.minWidth }} >    
                                            <div className='col-forma-pagamento'>
                                                {row.laudemios?.map((laudemio, index) => (
                                                    <Chip className='chip primary' label={laudemio && laudemio.nome_tipo_laudemio.toUpperCase()} key={index} />
                                                ))}
                                            </div>
                                        </TableCell>

                                        {(tabIndex === 3 || tabIndex === 4) &&
                                            <>
                                                <TableCell style={{ width: columns[6]?.minWidth }} >
                                                    <div className='col-gerente'>
                                                        <Avatar sx={{ width: 28, height: 28, bgcolor: '' }} alt={row.gerente?.toUpperCase()} />
                                                        <Chip size='small' label={`${row.gerente.toUpperCase()}${divWidth > 191 ? " " + row.gerenteName2?.toUpperCase() : ""}`} />
                                                    </div>
                                                </TableCell>

                                                <TableCell style={{ width: columns[7]?.minWidth, padding: columns[7]?.padding }}>
                                                    {isHover === row.id &&
                                                        <div className='col-tools'>
                                                            {tabIndex === 3 ?
                                                                <MenuOpcoesVenda
                                                                    id={row.id}
                                                                    responsavelId={Number(row.responsavelPosVendaId)}
                                                                    label='Opções'
                                                                    startIcon={<HiEllipsisHorizontal fill='white' size={20} />}
                                                                    tools
                                                                    loading={loading}
                                                                    setLoading={setLoading}
                                                                    openDialog={openDialog}
                                                                    setOpenDialog={setOpenDialog}
                                                                    setTypeDialog={setTypeDialog}
                                                                    returnList={returnList}
                                                                    statusProcesso={row.statusProcessoAtual}
                                                                    progress_status_progresses_id={row.progress_status_progresses_id}
                                                                />
                                                                :
                                                                <Button
                                                                    size={'small'}
                                                                    variant={'contained'}
                                                                    name={'entregar'}
                                                                    labelColor={'white'}
                                                                    startIcon={<HiInformationCircle />}
                                                                    label={'Ver revisão'}
                                                                    onClick={() => router.push(`/posvenda/${row.id}/devolucao`)}
                                                                />

                                                            }
                                                        </div>
                                                    }
                                                </TableCell>
                                            </>
                                        }

                                        {tabIndex === 5 &&
                                            // ABA FINALIZADOS
                                            <>
                                                <TableCell style={{ width: columns[2]?.minWidth }}>
                                                    <div className='col-data_conclusao'>
                                                        {/* <Chip className='chip primary' label='Finalizados' /> */}
                                                        <p>{row.dataStatusAlterado}</p>
                                                    </div>
                                                </TableCell>

                                                <TableCell style={{ width: columns[3]?.minWidth }}>
                                                    <div className='col-forma-pagamento'>
                                                        {row.formaPagamento?.map((payment: string, index) => (
                                                            <div key={index}>
                                                                {payment && <Chip className='chip neutral' label={payment.toUpperCase()} />}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>


                                                <TableCell style={{ width: columns[4]?.minWidth }} >
                                                    <div className='col-gerente'>
                                                        <Avatar sx={{ width: 28, height: 28, bgcolor: '' }} alt={row.gerente?.toUpperCase()} />
                                                        <Chip className='chip neutral' label={`${row.gerente.toUpperCase()}${divWidth > 191 ? " " + row.gerenteName2?.toUpperCase() : ""}`} />
                                                    </div>
                                                </TableCell>

                                                <TableCell style={{ width: columns[5]?.minWidth }}>
                                                    {isHover === row.id &&
                                                        <div className='col-tools'>
                                                            <Button size={'small'} variant={'contained'} name={'entregar'} labelColor={'white'} startIcon={<HiInformationCircle />} label={'Ver detalhes'} onClick={() => handleMenu(`/${row.id}/detalhes-venda`)} />
                                                        </div>
                                                    }
                                                </TableCell>
                                            </>
                                        }

                                        {tabIndex === 6 &&
                                            // ABA CANCELADOS
                                            <>
                                                <TableCell style={{ width: columns[2]?.minWidth }}>
                                                    <div className='col-data_conclusao'>
                                                        {/* <Chip className='chip primary' label='Finalizados' /> */}
                                                        <p>{row.dataCancelamento}</p>
                                                    </div>
                                                </TableCell>

                                                <TableCell style={{ width: columns[3]?.minWidth }}>
                                                    <div className='col-forma-pagamento'>
                                                        {row.formaPagamento?.map((payment: string, index) => (
                                                            <div key={index}>
                                                                {payment && <Chip className='chip neutral' label={payment.toUpperCase()} />}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>


                                                <TableCell style={{ width: columns[4]?.minWidth }} >
                                                    <div className='col-gerente'>
                                                        <Avatar sx={{ width: 28, height: 28, bgcolor: '' }} alt={row.gerente?.toUpperCase()} />
                                                        <Chip className='chip neutral' label={`${row.gerente.toUpperCase()}${divWidth > 191 ? " " + row.gerenteName2?.toUpperCase() : ""}`} />
                                                    </div>
                                                </TableCell>

                                                <TableCell style={{ width: columns[5]?.minWidth }}>
                                                    {isHover === row.id &&
                                                        <div className='col-tools'>
                                                            <Button size={'small'} variant={'contained'} name={'entregar'} labelColor={'white'} startIcon={<HiInformationCircle />} label={'Ver detalhes'} onClick={() => handleMenu(`/${row.id}/detalhes-venda`)} />
                                                        </div>
                                                    }
                                                </TableCell>
                                            </>
                                        }

                                    </TableRow>
                                </>
                            );
                        })}
                    </TableBody>

                    : <SkeletonTablePos tabIndex={tabIndex} />
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
}