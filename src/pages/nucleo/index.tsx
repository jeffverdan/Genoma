import ButtonComponent from "@/components/ButtonComponent";
import HeadSeo from "@/components/HeadSeo";
import { useEffect, useState } from "react";
import { HiArrowPath } from "react-icons/hi2";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Image from "next/image";
import Single from "@/images/single.png";
import AutoComplete from "@/components/AutoComplete";
import { OptionData } from "@/components/AutoComplete/interface";
import { GerentesOptionData } from "@/components/AutoCompleteGerentes/interface";
import { Pagination } from "@mui/lab";
import Filters from "@/components/Filters";
import OrderBy from "@/components/OrderBy";
import { Chip, Paper, TableContainer } from "@mui/material";
import ParaEnviarTable from "./@Tabelas/paraEnviar";
import { DataRows, tabsType } from "@/interfaces/Nucleo/dataRows";
import SwipeableViews from "react-swipeable-views-react-18-fix";
import Enviadas from "./@Tabelas/enviadas";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { DataFilter, ClienteDataFilter } from '@/interfaces/PosVenda/FiltroEndereco';
import getEnderecos from '@/apis/getEnderecos';
import getListGerentesPosVenda from "@/apis/getListGerentesPosVenda";
import getResumoServicos from "@/apis/getResumoServicos";
import { differenceInMinutes, format } from 'date-fns';
import { FiltersKeys, FiltersToolbar, FiltersType } from '@/components/Filters/interfaces';
import getTotalProcessNucleo from '@/apis/getTotalProcessNucleo';
import getListaClientesNucleo from "@/apis/getListaClientesNucleo";
import Corner from "@/components/Corner";
import FilterClientes from '@/components/AutoCompleteFilterClientes';
import { ClientesOptionData } from '@/components/AutoCompleteFilterClientes/interface';
import getListClientesPosVenda from '@/apis/getListaClientesPosVenda';
import InputSelect from "@/components/InputSelect/Index";

const filtersInicialValueTab1 = {
    filtro_gerente: [],
    filtro_clientes: [],
    filtro_responsavel: [],
    filtro_loja: [],
    filtro_tipo_venda: [],
    filtro_solicitacao_onus: [],
    filtro_certidoes_comarca: [],
    filtro_ordenacao: [],
};

const filtersInicialValueTab2 = {
    filtro_gerente: [],
    filtro_clientes: [],
    filtro_responsavel: [],
    filtro_loja: [],
    filtro_tipo_venda: [],
    filtro_solicitacao_onus: [],
    filtro_certidoes_comarca: [],
    filtro_ordenacao: [],
};

const orderInicialValue = { patch: '', id: -1 };

interface ITotalProcessos {
    finalizadas: number,
    andamento: number,
}

export default function Nucleo() {
    const [filtersActive, setFiltersActive] = useState<FiltersToolbar>({});
    const [filtersTabs, setFiltersTabs] = useState<FiltersToolbar[]>([filtersInicialValueTab1, filtersInicialValueTab2]);
    const [selectOrder, setSelectOrder] = useState<{ patch: string, id: number }>(orderInicialValue);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
    const [timeDifference, setTimeDifference] = useState<string | null>("0 minutos");
    const [userName, setUserName] = useState("");
    // LISTA DE PROCESSOS
    const [rows, setRows] = useState<DataRows[]>([])
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [hiddenChangeLog, setHiddenChangeLog] = useState(false);
    const [adressFilter, setAdressFilter] = useState<DataFilter>({
        endereco: null,
    });

    const [tabs, setTabs] = useState<tabsType>({
        tabs: [
            { label: 'Em andamento' },
            { label: 'Finalizados' },
        ], selectTab: -1
    });

    const TABS = [
        {COMPONENT: <ParaEnviarTable rows={rows} tabIndex={0} loading={loading} />},
        {COMPONENT: <Enviadas rows={rows} tabIndex={0} loading={loading} />},
    ];
    const [listEnderecos, setListEnderecos] = useState([]);
    // const [gerentesList, setGerentesList] = useState<GerentesOptionData[]>([]);
    const [clientesList, setClientesList] = useState<ClientesOptionData[]>([]);
    const [paginateList, setPaginateList] = useState(0);
    const filtersInicialValue = {
        filtro_gerente: [],
        filtro_clientes: [],
        filtro_responsavel: [],
        filtro_loja: [],
        filtro_tipo_venda: [],
        filtro_solicitacao_onus: [],
        filtro_certidoes_comarca: [],
        filtro_ordenacao: [],
    };
    const [filtersToolbar, setFiltersToolbar] = useState<FiltersToolbar>(filtersInicialValue);
    const [totalProcessos, setTotalProcessos] = useState<ITotalProcessos>();
    const [statusTab, setStatusTab] = useState<number>(0);
    const [qtdNovos, setQtdNovos] = useState(0);
    const [openCorner, setOpenCorner] = useState(false);
    const [loadingList, setLoadingList] = useState(true);
    const [currentCount, setCurrentCount] = useState<NodeJS.Timeout>();

    useEffect(() => {
        if(sessionStorage.getItem('finalizar') === 'true'){
            setOpenCorner(true)
            sessionStorage.removeItem('finalizar')
        }

        const name = localStorage.getItem('nome_usuario') as string;
        setUserName(name);
        setTabs({ ...tabs, selectTab: 0 });        
        loadingLocalFilters();        
    }, []);    
    
    useEffect(() => {
        if (tabs.selectTab >= 0) {
            listsLoading();
        };
    }, [tabs])

    useEffect(() => {
        // setLoading(true);
        console.log("TabSelected: ", tabs.selectTab);
        
        if (tabs.selectTab >= 0) getListTable();
    }, [page, tabs.selectTab]);

    const loadingLocalFilters = () => {
        tabs.tabs.forEach((e, index) => {
            const localKey = `filters_${index}`
            const filters = localStorage.getItem(localKey);
            if (filters) {
                filtersTabs[index] = JSON.parse(filters);
                index === 0 && setFiltersActive(JSON.parse(filters));
            } else {
                index === 0 && setFiltersActive(filtersInicialValueTab1);
            }
        });

        if(localStorage.getItem('filter_endereco') !== null){
            const filterEnderecoLocal: any = localStorage.getItem('filter_endereco') || '' ; 
            let arrFilterEndereco = JSON.parse(filterEnderecoLocal);
            adressFilter.endereco = arrFilterEndereco || '';
            setAdressFilter({...adressFilter});
        }

        // if(localStorage.getItem('filter_cliente') !== null){
        //     const filterClienteLocal: any = localStorage.getItem('filter_cliente') || '' ; 
        //     let arrFilterCliente = JSON.parse(filterClienteLocal);
        //     clienteFilter.cliente = arrFilterCliente || '';
        //     setClienteFilter({...clienteFilter});
        // }

        if(localStorage.getItem('filtro_ordenacao') !== null){
            const filterOrdenacaLocal: any = localStorage.getItem('filtro_ordenacao') || '' ; 
            let arrFilterOrdenacao = JSON.parse(filterOrdenacaLocal);
            setSelectOrder(arrFilterOrdenacao)
        }

        if(localStorage.getItem('hidden_change_log') !== null){
            setHiddenChangeLog(true)
        }
    };

    const listsLoading = async () => {
        setLoadingList(true);

        listaClientes();
        getListEnderecos();
        
        setLoadingList(false);
        // const gerentes = await getListGerentesPosVenda({}) as unknown as FiltersType[];            
        // setGerentesList(gerentes || []);   
    };

    const getListEnderecos = async () => {
        const typeList = {
            tipo_listagem: 'entregues' as const,
            envio_planilha: tabs.selectTab > 0 ? tabs.selectTab : 0
        }
        const getListEnderecos = await getEnderecos(typeList) as unknown as [];
        setListEnderecos(getListEnderecos);
    };

    const listaClientes = async () => {
        const value = tabs.selectTab === 0 ? 1 : 4;
        const clientes = await getListaClientesNucleo(value);
        setClientesList(clientes || []);
    };

    const calculateTimeDifference = (): string | null => {
        if (lastUpdated) {
            const minutesDifference = differenceInMinutes(new Date(), lastUpdated);
            return `${minutesDifference} minutos`;
        }
        return null;
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeDifference(calculateTimeDifference());
        }, 60000); // Atualiza a cada minuto (60000 milissegundos)

        return () => {
            clearInterval(intervalId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getListTable = async () => {
        setLoading(true);

        const processos: any = await getTotalProcessNucleo();
        // console.log('PROCESSOS: ' , processos);
        setTotalProcessos(processos);

        const now = new Date();
        setLastUpdated(now);
        setTimeDifference("0 minutos");
        const tab = tabs.selectTab === -1 ? 0 : tabs.selectTab;
        
        const data = {
            page: page,
            filters: filtersActive,
            filtro_endereco: typeof adressFilter?.endereco === 'string' ? adressFilter?.endereco : adressFilter?.endereco?.logradouro || "",
            filtro_numero: typeof adressFilter?.endereco === 'string' ? '' : adressFilter?.endereco?.numero || "",
            filtro_clientes: typeof filtersToolbar?.filtro_clientes === 'string' ? '' : filtersToolbar?.filtro_clientes || "",
            selectOrder,
            status: tab === 0 ? 1 : 4
        };
        console.log("Data: ", data);
        
        const list = await getResumoServicos(data);
        if (list) {
            setRows(list.solicitacoes.data);
            setTotalPages(list?.total_pagina);
            setTotalRows(list?.total_solicitacoes_filtradas);
            setPaginateList(list?.solicitacoes?.to);
            setQtdNovos(list?.solicitacoes?.data?.filter((data: any) => data?.status_visualizacao_atual === 0)?.length || 0)

            // const processos = list.solicitacoes.data.map((data: any) => data);
            // console.log('PROCESSOS: ', processos);
        }

        const filtersLocal = localStorage.getItem('filters_' + tabs.selectTab) || '';
        if (filtersLocal) {
            const objFilters: FiltersToolbar = JSON.parse(filtersLocal);
            setFiltersToolbar(objFilters);
            setFiltersActive(objFilters);
        }
        setLoading(false);
    };

    const handleTab = (e: React.SyntheticEvent<Element, Event>, value: number) => {
        // setFiltersActive({ ...filtersTabs[value] });
        const filtersLocal = localStorage.getItem('filters_' + tabs.selectTab) || '';
        if (filtersLocal) {
            const objFilters: FiltersToolbar = JSON.parse(filtersLocal);
            setFiltersToolbar(objFilters);
            setFiltersActive(objFilters);
        }
        setTabs({ ...tabs, selectTab: value });
        console.log("SelectTab: ", value);
        
        setStatusTab(value === 0 ? 1 : 4);
        setPage(1);
    };

    const handleFilterEndereco = (event: any, newValue: string | OptionData | null) => {
        const value = typeof newValue === 'string' ? { logradouro: newValue } : newValue;
        if (!newValue) {
            localStorage.removeItem('filter_endereco');
            adressFilter.endereco = newValue;
        } else {
            adressFilter.endereco = value;
            localStorage.setItem('filter_endereco', JSON.stringify(value))
        }
        setAdressFilter({ ...adressFilter });
        getListTable();
    };

    const onClienteFilter = (event: React.SyntheticEvent, value: (ClientesOptionData | string)[]) => {
        clearTimeout(currentCount);

        clientesList.forEach((c: any) => {
            c.check = false;
        });
        const valueArr = value.map((e) => {
            console.log(e);

            if (typeof e === 'string') {
                return { id: '', label: e, check: true, cpf_cnpj: '' }
            } else {
                clientesList.forEach((c: any) => {
                    if (e.id === c.id) c.check = true;
                });
                return { ...e, check: true }
            }
        });
        filtersToolbar.filtro_clientes = valueArr;

        localStorage.setItem('filters_' + tabs.selectTab, JSON.stringify(filtersToolbar));

        setCurrentCount(setTimeout(() => {
            setFiltersToolbar({ ...filtersToolbar });
            setClientesList([...clientesList]);
            getListTable()
        }, 1000));
    };

    const handleDelete = (chave: FiltersKeys, index: number) => {
        if (filtersToolbar[chave] !== undefined) {
          filtersToolbar[chave]?.splice(index, 1);
        }
        localStorage.setItem('filters_' + tabs.selectTab, JSON.stringify(filtersToolbar));
        setFiltersToolbar({ ...filtersToolbar });
        getListTable();
    };

    const ReturnFilterToolbar = ({ filter, chave, index }: { filter?: FiltersType, chave: FiltersKeys, index: number }) => {
        return (
          <Chip        
            className='filter-chip'
            label={filter?.label}
            variant="outlined"
            // onClick={handleClick}
            onDelete={() => handleDelete(chave, index)}
            // onDelete={() => console.log("AEEEE", chave)}
          />
        )
    };

    // console.log('FILTERS ACTIVE: ', filtersActive);
    // console.log('FILTERS TOOLLBARS: ', filtersToolbar);

    const handleChangeLog = () => {
        setHiddenChangeLog(true)
        localStorage.setItem('hidden_change_log', 'true');
    };

    return (
        <>
            <HeadSeo titlePage={"Núcleo"} description="" />
            <div className="list-nucleo">
                <div className="menu-bar">
                    <div className="menu-buttons tab-menu">
                        <Tabs value={tabs.selectTab} onChange={handleTab} className='' >
                            {tabs.tabs.map((item, index) => (
                                <Tab
                                    key={index}
                                    label={item.label + ` (${index === 0 ? totalProcessos?.andamento || 0 : totalProcessos?.finalizadas || 0 })`}
                                    id={index.toString()}
                                    className={'item-tab'}
                                    iconPosition="start"
                                />
                            ))}
                        </Tabs>
                    </div>

                    <div className='atualizar-lista'>
                        <ButtonComponent
                            size={'medium'}
                            variant={'text'}
                            name={'atualizar-painel'}
                            onClick={() => getListTable()}
                            label={'Atualizar painel'}
                            endIcon={<HiArrowPath className={loading ? 'rotate' : ''} />}
                        />
                        <span>{lastUpdated ? `Há ${timeDifference}` : ''}</span>
                    </div>
                </div>

                <div className="list-container">
                    {!hiddenChangeLog &&
                        <div className='changelog-container'>
                            <div className='title-container'>
                                <Image src={Single} alt={"changelog-img"} />
                                <div className='changelog-title'>
                                    <p>{userName.split(" ")[0]}, boas vindas ao novo painel do Núcleo.</p>
                                    <span>Você tem, <b>{qtdNovos || 0}</b> serviços novos.</span>
                                </div>
                            </div>
                            <div className="action-container">
                                <XMarkIcon width={20} height={20} className="icon-close" onClick={() => handleChangeLog()} />
                            </div>
                        </div>
                    }

                    <div className='filters-row'>
                        <AutoComplete options={listEnderecos} value={adressFilter.endereco} onChange={handleFilterEndereco} loading={loadingList} />
                        {/* <AutoCompleteClientes options={clientesList} value={clienteFilter.cliente as ClientesOptionData | null} onChange={onClienteFilter} /> */}
                        <FilterClientes options={clientesList} onChange={onClienteFilter} loading={loadingList} />
                    </div>


                    <SwipeableViews
                        axis={'x'}
                        index={tabs.selectTab}
                        onChangeIndex={handleTab}
                        className='swipe-container'
                    >
                        {TABS.map((TAB, index) => (
                            <div className='list-table' key={index} hidden={index != tabs.selectTab}>
                                <div className='list-tools'>
                                    <div className='filters'>
                                        <Filters
                                            tab={tabs.selectTab}
                                            setSelectFilters={setFiltersActive}
                                            selectFilters={filtersActive}
                                            returnList={getListTable}
                                            // gerente
                                            posVenda
                                            lojas
                                            certidoesComarca
                                            solicitacaoOnus
                                        />

                                        <OrderBy
                                            setSelectOrders={setSelectOrder}
                                            selectOrders={selectOrder}
                                            returnList={getListTable}
                                            dataSolicitacao
                                        />
                                    </div>
                                    <div className='pagination'>
                                        <span>Mostrando <span className='colorP500'>{paginateList}</span> de <span className='colorP500'>{totalRows}</span> vendas.</span>

                                        <Pagination shape={'rounded'} count={totalPages} page={page} onChange={(e, newPage) => setPage(newPage)} />
                                        {/* SELECT COM NUMERO DE PAGINAS */}
                                        <InputSelect
                                            option={Array.from(new Array(totalPages), (val, index) => ({id: index + 1, label: index + 1}))}
                                            label={''}
                                            value={page}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                setPage(value)
                                            }}
                                            name={'select_rows_page'}
                                            className="select-pagination"
                                        />
                                    </div>

                                </div>

                                <div className='toolbar-filters'>
                                    {(Object.keys(filtersToolbar) as FiltersKeys[]).map(chave =>
                                        !!filtersToolbar[chave] && filtersToolbar[chave]?.map((e, index) => e.check && <ReturnFilterToolbar key={index} filter={e} chave={chave} index={index} />)
                                    )}

                                </div>

                                <div className='list-content'>
                                    <Paper sx={{ width: '100%', overflow: `hidden` }} elevation={0}>
                                        <TableContainer className={`table ${hiddenChangeLog ? 'no-changelog' : ''}`}>
                                            {TAB.COMPONENT}
                                        </TableContainer>
                                        <div className='footer-pagination'>
                                            {/* <Pagination shape={'rounded'} count={totalPages} page={page} onChange={(e, newPage) => setPage(newPage)} /> */}
                                        </div>
                                    </Paper>
                                </div>

                            </div>
                        ))}
                    </SwipeableViews>
                </div>
            </div>

            {
                openCorner === true &&
                <Corner 
                    open={openCorner}
                    setOpen={setOpenCorner}
                    vertical="bottom"
                    horizontal="right"
                    direction="up"
                    type={'finalizar-pedido'}
                    className='bottom-10'
                />
            }
        </>
    )
}
