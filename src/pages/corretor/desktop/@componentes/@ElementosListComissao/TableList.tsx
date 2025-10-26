import OrderBy from "@/pages/corretor/components/OrderBy";
import { ItemListRecentsType } from "@/interfaces/Corretores";
import { Chip, Table, TableBody, TableHead, TableRow, TableCell, Avatar, Skeleton, Pagination } from '@mui/material';
import { PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import ButtonComponent from "@/components/ButtonComponent";
import converterParaReal from "@/functions/converterParaReal";
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from "next/router";
import ProgressBar from '@/components/ProgressBar';

interface PropsType {
    list: ItemListRecentsType[]
    getList: () => Promise<void>
    selectOrder: SelectOrderType
    setSelectOrder: (e: SelectOrderType) => void
    setSelectProcess: (e: ItemListRecentsType | null) => void
    selectProcess: ItemListRecentsType | null
    loading: boolean;
    listagemUltimaComissao: ItemListRecentsType[]; // Lista de últimas comissões
    statusIdMenu?: number; // Status do menu
    setListProcess: (e: ItemListRecentsType[]) => void; // Função para atualizar a lista de processos
    returnList: (limite?: number, status?: number) => void
    loadingOrder: boolean;
    setLoadingOrder: (e: boolean) => void;
    page?: number; // Página atual
    setPage: (e: number) => void; // Função para atualizar a página
    rows?: any[]; // Dados da tabela
    setRows: (e: []) => void; // Função para atualizar as linhas
    totalRows?: number; // Total de linhas
    setTotalRows: (e: number) => void; // Função para atualizar o total de linhas
    totalPages?: number; // Total de páginas
    setTotalPages: (e: number) => void; // Função para atualizar o total de páginas
    // refreshOrder: () => Promise<void>
}

type SelectOrderType = {
    patch: string;
    id: number;
}

type Colunas = {
    label?: string,
    key?: string,
    align: "left" | "center" | "right" | "inherit" | "justify" | undefined
}

export default function TableList(props: PropsType) {
    const { page, setPage, totalRows, setTotalRows, setTotalPages, totalPages, rows, setRows, list, getList, selectOrder, setSelectOrder, setSelectProcess, loading, statusIdMenu, setListProcess, returnList, loadingOrder, setLoadingOrder } = props;
    const [tipoOrdenacao, setTipoOrdenacao] = useState<number>(0);
    // const [loadingOrder, setLoadingOrder] = useState<boolean>(true);
    const router = useRouter();

    const getColunaLabel = (statusIdMenu?: number) => {
        switch (statusIdMenu) {
            case 9: return 'Previsão de pagamento';
            case 12: return 'Última transferência';
            case 13: return 'Data de conclusão';
            case 16: return 'Data de cancelamento';
            case 11: return 'Data de solicitação';
            case 10: return 'Data de liberação';
            default: return 'Data de liberação';
        }
    };

    const colunas: Colunas[] = [
        { label: 'Status', key: '', align: 'left' },
        { label: 'Valor de comissão', key: '', align: 'left' },
        { label: 'Cód. do imóvel', key: '', align: 'left' },
        { label: 'Endereço', key: '', align: 'left' },
        { label: getColunaLabel(statusIdMenu), key: '', align: 'center' },
        { label: '', key: '', align: 'center' }, // ACTIONS BTN
    ];

    const labelChipAndDate = (item: ItemListRecentsType) => {
        if (item?.finance_status_id === '9') {
            return { label: "Em andamento", labelDate: "Previsão de pagamento", chip: 'yellow600' };
        }
        else if (item?.finance_status_id === '12') {
            return { label: "Em transferência", labelDate: "Última transferência", chip: 'yellow500' };
        }
        else if (item?.finance_status_id === '13') {
            // ID 13 Transferido como Concluído
            return { label: "Concluídos", labelDate: "Data de conclusão", chip: 'green500' };
        }
        else if (item?.finance_status_id === '16') {
            return { label: "Cancelado", labelDate: "Data de cancelamento", chip: 'red500' };
        }
        else if (item?.finance_status_id === '11') {
            return { label: "Solicitado", labelDate: "Data de solicitação", chip: 'primary500' };
        }
        else if (item?.finance_status_id === '10') {
            return { label: "Liberado", labelDate: "Data de liberação", chip: 'green500' };
        }
    };    

    // const refreshOrder = async () => {
    //     returnList(0, statusIdMenu);
    //     setListProcess(list);
    //     // setLoadingOrder(false);
    // }

    console.log('statusIdMenu TABLELIST: ', statusIdMenu)

    const urlRedirect = useCallback((parcelaId: string) => {
        const corretorId = localStorage.getItem('usuario_id') || '';
        return router.push(`/corretor/${corretorId}/parcela/${parcelaId}`);
    }, [router, statusIdMenu]);

    function convertReal(value: string | number | null | undefined): string {
        if (value === null || value === undefined) return '0,00';

        // Se já for número, só formatar
        if (typeof value === 'number') {
            return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // Remove tudo que não for número ou vírgula/ponto
        let valorLimpo = value.toString().replace(/[^0-9.,]/g, '');

        // Se vier no formato brasileiro (tem vírgula e ponto)
        if (valorLimpo.match(/^\d{1,3}(\.\d{3})*,\d{2}$/)) {
            // Troca ponto por nada e vírgula por ponto para virar float
            valorLimpo = valorLimpo.replace(/\./g, '').replace(',', '.');
        } else if (valorLimpo.match(/^\d+(\.\d{2})$/)) {
            // Formato americano: 3000.00
            // Nada a fazer, já está correto
        } else if (valorLimpo.match(/^\d+,\d{2}$/)) {
            // Formato brasileiro sem milhar: 3000,00
            valorLimpo = valorLimpo.replace(',', '.');
        }

        const numero = parseFloat(valorLimpo);

        if (isNaN(numero)) return '0,00';

        return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    return (
        <div className="table-container">
            <div className="table-tools" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <OrderBy
                    key={statusIdMenu}
                    setSelectOrders={setSelectOrder}
                    selectOrders={selectOrder}
                    returnList={getList}
                    dataAmdamento={statusIdMenu === 9}
                    dataTansferencia={statusIdMenu === 12}
                    dataConclusao={statusIdMenu === 14}
                    dataCancelamento={statusIdMenu === 16}
                    dataSolicitacao={statusIdMenu === 11}
                    dataLiberacao={statusIdMenu === 10}
                    valorComissao
                />

                <div className='pagination' style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>Mostrando <span className='colorP500'>{list?.length}</span> de <span className='colorP500'>{totalRows}</span> vendas.</span>
                    <Pagination shape={'rounded'} count={totalPages} page={page} onChange={(e, newPage) => [setPage(newPage), localStorage.setItem('page', String(newPage)), returnList(5, statusIdMenu)]} />
                </div>
            </div>
            
            <Table className="table-list">
                <TableHead className='head-table'>
                    <TableRow sx={{ height: '82px' }}>
                        {colunas.map((column, index) => (
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
                                <TableCell width={190}>
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
                                <TableCell width={150}>
                                    <Skeleton width={100} height={20} />
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
                                <TableCell className="btn-actions" align="left" width={230}>

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
                                onClick={() => urlRedirect(String(item?.parcela_id))}
                                // onMouseEnter={() => setIsHover(row.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell width={190}>
                                    <Chip className={`chip ${labelChipAndDate(item)?.chip}`} label={labelChipAndDate(item)?.label} style={{ marginRight: '8px' }} />
                                    {labelChipAndDate(item)?.label !== 'Em andamento' ? <Chip className={`chip neutral500`} label={`${item?.soma_porcentagem || 0}%`} /> : ''}
                                </TableCell>

                                <TableCell width={200}>
                                    {
                                        item.finance_status_id === '12'
                                        ?
                                        <div className="progress-container">
                                            <div className={`progress-value`}>R$ {convertReal(item?.valor_transferido ?? 0)} DE {convertReal(item?.soma ?? 0)}</div>
                                            <ProgressBar progress={item?.porcentagem_faltante} />
                                        </div>
                                        :
                                        <div className="valor-date">
                                            <div className="valor-container">
                                                <span className="sigla">R$</span>
                                                <span className="valor">{converterParaReal(item?.soma ?? 0) || "-----"}</span>
                                            </div>
                                            <span className="tipo">{(item.tipo_comissao === 'partes' ? `Parcela ${item.numero_parcela} ${item.total_parcelas ? 'de ' + item.total_parcelas : ''}` : 'Á Vista')}</span>
                                        </div>
                                    }
                                    
                                </TableCell>

                                <TableCell width={150}>
                                    <Chip className="chip neutral" label={item.cod_imovel} />
                                </TableCell>

                                <TableCell className="endereco-container" height={'auto'} style={{ minHeight: '85px', alignItems: 'center' }}>
                                    <Avatar>{item.url_imagens ? <Image height={40} width={40} src={item.url_imagens} alt={"Fotografio imóvel"} /> : <PhotoIcon width={20} />}</Avatar>
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

                                <TableCell className={`data-container ${labelChipAndDate(item)?.chip} `} align="center" width={145}>
                                    <span className="data">{item?.data_ordenacao_exibicao || 'Não definida'}</span>
                                </TableCell>

                                <TableCell className="btn-actions" align="left" width={230}>
                                    <div className="row">
                                        <ButtonComponent
                                            name="btn-list"
                                            variant="contained"
                                            size="small"
                                            label={item.type === 'producao-anual' ? 'Ver comissão' : 'Ver valor'}
                                            // onClick={() => setSelectProcess(item)}
                                            onClick={() => urlRedirect(String(item?.parcela_id))}
                                            labelColor="white"
                                        />
                                    </div>
                                    {/* <span className="data">{item.data}</span> */}
                                </TableCell>
                            </TableRow>
                        ))}
                    {(list?.length === 0 && !loading) && <div className="empty-list">Essa lista está vazia.</div>}
                </TableBody>
            </Table>
        </div>
    )
}
