import OrderBy from "@/components/OrderBy";
import { ItemListRecentsType, UrlsAnunciosType } from "@/interfaces/Corretores";
import { Chip, Table, TableBody, TableHead, TableRow, TableCell, Avatar, Tooltip, Skeleton } from '@mui/material';
import { useCallback, useState } from "react";
import { ListBulletIcon, PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import ButtonComponent from "@/components/ButtonComponent";
import { ListInvestimentoType } from "@/interfaces/Corretores/investimento";
import SnowflakeIcon from "@/images/SnowflakeIcon";
import HotSteamIcon from "@/images/HotSteamIcon";
import FlameIcon from "@/images/FlameIcon";
import { useRouter } from "next/router";

interface PropsType {
    list: ListInvestimentoType[]
    getList: () => Promise<void>
    selectOrder: SelectOrderType
    setSelectOrder: (e: SelectOrderType) => void
    setSelectProcess: ( e: ItemListRecentsType | null ) => void
    selectProcess: ItemListRecentsType | null
    loading: boolean;
}

type SelectOrderType = {
    patch: string;
    id: number;
}


export default function TableList(props: PropsType) {    
    const router = useRouter();
    const { list, getList, selectOrder, setSelectOrder, selectProcess, setSelectProcess, loading } = props;

    const COLUNAS = [
        { label: 'Status', key: '', align: 'left' },
        { label: 'Valor de opção', key: '', align: 'left' },
        { label: 'Endereço', key: '', align: 'left' },
        { label: 'Última atualização', key: '', align: 'left' },
    ] as const;

    const labelChipAndDate = (item: ListInvestimentoType) => {
        if (item.temperatura_calculada === 'frio') {
            return { label: "Frio", icon: <SnowflakeIcon height={20} />, chip: 'purple' }
        } else if (item.temperatura_calculada === 'morno') {
            return { label: "Morno", icon: <HotSteamIcon height={20} />, chip: 'neutral' }
        } else if (item.temperatura_calculada === 'quente') {
            return { label: "Quente", icon: <FlameIcon height={20} />, chip: 'red' }
        } else {
            return { label: "", icon: <span />, chip: '' }
        }
    };

    const urlRedirect = useCallback((parcelaId: string) => {
        const corretorId = localStorage.getItem('usuario_id') || '';
        return router.push(`/corretor/${corretorId}/investimento/${parcelaId}`);
    }, [router]);

    return (
        <div className="table-container">
            <div className="table-tools">
                <OrderBy
                    setSelectOrders={setSelectOrder}
                    selectOrders={selectOrder}
                    returnList={getList}
                    dataAtualizacao
                    valorOpcao
                />
            </div>
            <Table className="table-list">
                <TableHead className='head-table'>
                    <TableRow sx={{ height: '82px' }}>
                        {COLUNAS.map((column, index) => (
                            <TableCell
                                key={index}
                                align={column.align}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {loading ?
                        ([1, 2, 3]).map(item => (
                            <TableRow
                                key={item}
                                tabIndex={-1}
                                className={`row-table`}
                            >
                                <TableCell width={90}>
                                    <Skeleton width={190} height={20} />
                                </TableCell>
                                <TableCell width={200}>
                                    <div className="valor-date">
                                        <div className="valor-container">
                                            <span className="sigla">R$</span>
                                            <Skeleton width={100} height={20} />
                                        </div>
                                        <span className="tipo"><Skeleton width={150} height={20} /></span>
                                    </div>
                                </TableCell>
                                <TableCell className="endereco-container" height={'auto'} style={{ minHeight: '85px', alignItems: 'center' }} width={350}>
                                    <Avatar>
                                        <Skeleton variant="circular" width={40} height={40} />
                                    </Avatar>
                                    <div className="info-container">
                                        <Skeleton width={200} height={20} />
                                        <Skeleton width={250} height={20} />
                                    </div>
                                </TableCell>
                                <TableCell className="" align="center" width={145}>
                                    <Skeleton width={150} height={20} />
                                </TableCell>
                            </TableRow>

                        ))
                        : list?.map((item, index) => (
                            <TableRow
                                hover
                                key={index}
                                tabIndex={-1}
                                className={`row-table`}
                                // onClick={() => setSelectProcess(item)}
                                onClick={() => urlRedirect(String(item?.imovel_id))}
                                // onMouseEnter={() => setIsHover(row.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell width={90}>
                                    <div className={"icon " + labelChipAndDate(item).chip}>
                                        {labelChipAndDate(item).icon}
                                        <Chip className={`chip ${labelChipAndDate(item)?.chip}`} label={labelChipAndDate(item)?.label} />
                                    </div>
                                </TableCell>

                                <TableCell width={200}>
                                    <div className="valor-container">
                                        <span className="sigla">R$</span>
                                        <span className="valor">{item?.valor_anunciado || "-----"}</span>
                                    </div>
                                </TableCell>

                                <TableCell className="endereco-container" height={'auto'} style={{ minHeight: '85px', alignItems: 'center' }}>
                                    <Avatar>{item.link_imagem_miniatura ? <Image height={40} width={40} src={item.link_imagem_miniatura} alt={"Fotografia imóvel"} /> : <PhotoIcon width={20} />}</Avatar>
                                    <div className="info-container">
                                        <span className="logradouro">
                                            {item.logradouro}
                                            {item.numero && ', ' + item.numero}
                                        </span>
                                        <span className="complemento">
                                            {/* {item.complemento}
                                        {(item.complemento && item.bairro) && ' - '}
                                        {item.bairro} */}

                                            {/* {(item.unidade) && ' / '} */}
                                            {item.unidade}
                                            {!!item.complemento?.trim() && ' / '}
                                            {item.complemento}
                                            {(item.bairro) && ' - '}
                                            {item.bairro}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell width={150}>
                                    {item.data_atualizacao ?
                                        <span className="data-liberacao">{item.data_atualizacao}</span>
                                        : <span className="data-liberacao">-----</span>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    {(list?.length === 0 && !loading) && <div className="empty-list">Essa lista está vazia.</div>}
                </TableBody>
            </Table>
        </div>
    )
}