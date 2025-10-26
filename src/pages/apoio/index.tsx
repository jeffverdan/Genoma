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
import { Paper, TableContainer } from "@mui/material";
import ParaEnviarTable from "./@Tabelas/paraEnviar";
import { FiltersToolbar, FiltersType } from "@/components/Filters/interfaces";
import { DataRows, tabsType } from "@/interfaces/Apoio/tabelas";
import SwipeableViews from "react-swipeable-views-react-18-fix";
import Enviadas from "./@Tabelas/enviadas";
import listaApoio from "@/apis/postListaApoio";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { DataFilter, EnderecoFilterData } from '@/interfaces/PosVenda/FiltroEndereco';
import getEnderecos from '@/apis/getEnderecos';
import AutoCompleteGerentes from "@/components/AutoCompleteGerentes";
import getListGerentesPosVenda from "@/apis/getListGerentesPosVenda";

const filtersInicialValueTab1 = {
    filtro_gerente: [],
    filtro_responsavel: [],
    filtro_loja: [],
    filtro_tipo_venda: []
};

const filtersInicialValueTab2 = {
    filtro_gerente: [],
    filtro_responsavel: [],
    filtro_loja: [],
    filtro_tipo_venda: []
};

const orderInicialValue = { patch: '', id: 0 };

export default function Apoio() {
    const [filtersActive, setFiltersActive] = useState<FiltersToolbar>({});
    const [filtersTabs, setFiltersTabs] = useState<FiltersToolbar[]>([filtersInicialValueTab2, filtersInicialValueTab2]);
    const [selectOrder, setSelectOrder] = useState<{ patch: string, id: number }>(orderInicialValue);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
    const [timeDifference, setTimeDifference] = useState<string | null>("0 minutos");
    const [userName, setUserName] = useState("");
    const [tabs, setTabs] = useState<tabsType>({
        tabs: [
            { label: 'Para enviar' },
            { label: 'Enviados' },
        ], selectTab: -1
    });
    // LISTA DE PROCESSOS
    const [rows, setRows] = useState<DataRows[]>([])
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [hiddenChangeLog, setHiddenChangeLog] = useState(false);
    const [adressFilter, setAdressFilter] = useState<DataFilter>({
        endereco: null,
    });
    const [listEnderecos, setListEnderecos] = useState([]);
    const [gerentesList, setGerentesList] = useState<GerentesOptionData[]>([]);
    const [currentCount, setCurrentCount] = useState<NodeJS.Timeout>();

    useEffect(() => {
        const name = localStorage.getItem('nome_usuario') as string;
        setUserName(name);
        const tabSelected = Number(localStorage.getItem('tabSelected'));
        setTabs({ ...tabs, selectTab: tabSelected || 0 });        
        loadingLocalFilters();        
        listsLoading();
    }, []);

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
    };

    const listsLoading = async () => {       
        getListEnderecos();
        const gerentes = await getListGerentesPosVenda({}) as unknown as FiltersType[];            
        setGerentesList(gerentes || []);   
    };

    const getListEnderecos = async () => {
        const typeList = {
            tipo_listagem: 'entregues' as const,
            envio_planilha: tabs.selectTab > 0 ? tabs.selectTab : 0
        }
        const getListEnderecos = await getEnderecos(typeList) as unknown as [];
        setListEnderecos(getListEnderecos);
    };

    useEffect(() => {
        if (tabs.selectTab >= 0) getListEnderecos();
    },[tabs])

    useEffect(() => {
        // setLoading(true);
        if (tabs.selectTab >= 0) { 
            localStorage.setItem('tabSelected', tabs.selectTab.toString());
            getListTable();
        }
    }, [page, tabs.selectTab]);

    const getListTable = async () => {
        setLoading(true);
        const tab = tabs.selectTab === -1 ? 0 : tabs.selectTab;

        const data = {
            page: page,
            envio_planilha: tab,
            filters: filtersActive,
            filtro_endereco: typeof adressFilter?.endereco === 'string' ? adressFilter?.endereco : adressFilter?.endereco?.logradouro || "",
            filtro_numero: typeof adressFilter?.endereco === 'string' ? '' : adressFilter?.endereco?.numero || "",
            selectOrder
        };

        const list = await listaApoio(data);
        if (list) {
            setRows(list.data);
            setTotalPages(list.last_page);
            setTotalRows(list.total);
        }
        setLoading(false);
    };

    const handleTab = (e: React.SyntheticEvent<Element, Event>, value: number) => {
        setFiltersActive({ ...filtersTabs[value] });
        setTabs({ ...tabs, selectTab: value });
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

    const returnListFilters = async () => {
        const tab = tabs.selectTab === -1 ? 0 : tabs.selectTab;
        filtersTabs[tab] = { ...filtersActive };
        setFiltersTabs([...filtersTabs]);
        getListTable();
    };

    const onGerenteFilter = (event: React.SyntheticEvent, value: GerentesOptionData[]) => {  
        clearTimeout(currentCount);
        const tab = tabs.selectTab === -1 ? 0 : tabs.selectTab;
        console.log(value);
        filtersActive.filtro_gerente = value;
        filtersTabs[tab].filtro_gerente = value;
        
        setCurrentCount(setTimeout(() => {            
            setFiltersTabs([...filtersTabs]);
            getListTable();
        }, 1000));      
    };

    return (
        <>
            <HeadSeo titlePage={"Apoio"} description="" />
            <div className="list-apoio">
                <div className="menu-bar">
                    <div className="menu-buttons tab-menu">
                        <Tabs value={tabs.selectTab} onChange={handleTab} className='' >
                            {tabs.tabs.map((item, index) => (
                                <Tab
                                    key={index}
                                    disabled={loading}
                                    label={item.label}
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
                            disabled={loading}
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
                                    <p>{userName?.split(" ")[0]}, esses são os seus processos.</p>
                                    <span>Você tem, <b>{totalRows}</b> novos processos que precisam de uma planilha de comissão.</span>
                                </div>
                            </div>
                            <div className="action-container">
                                <XMarkIcon width={20} height={20} className="icon-close" onClick={() => setHiddenChangeLog(true)} />
                                {/* <ButtonComponent size={'small'} variant={'outlined'} name={''} label={'Ver Changelog do painel'} /> */}
                            </div>
                        </div>
                    }

                    <div className='filters-row'>
                        <AutoComplete options={listEnderecos} value={adressFilter.endereco} onChange={handleFilterEndereco} />
                        <AutoCompleteGerentes options={gerentesList} onChange={onGerenteFilter} />
                    </div>


                    <SwipeableViews
                        axis={'x'}
                        index={tabs.selectTab}
                        onChangeIndex={handleTab}
                        className='swipe-container'
                    >
                        {tabs?.tabs.map((tab, index) => (
                            <div className='list-table' key={index} hidden={index != tabs.selectTab}>
                                <div className='list-tools'>
                                    <div className='filters'>
                                        <Filters
                                            tab={tabs.selectTab}
                                            setSelectFilters={setFiltersActive}
                                            selectFilters={filtersActive}
                                            returnList={returnListFilters}
                                            // gerente
                                            posVenda
                                            lojas
                                            tipoVenda
                                        />

                                        <OrderBy
                                            setSelectOrders={setSelectOrder}
                                            selectOrders={selectOrder}
                                            returnList={getListTable}
                                            dataEntrada
                                            dataAssinatura
                                            valorComissao
                                            valorVenda
                                        />
                                    </div>
                                    <div className='pagination'>
                                        <span>Mostrando <span className='colorP500'>{rows.length}</span> de <span className='colorP500'>{totalRows}</span> vendas.</span>
                                        <Pagination shape={'rounded'} count={totalPages} page={page} onChange={(e, newPage) => setPage(newPage)} />
                                    </div>

                                </div>

                                <div className='list-content'>
                                    <Paper sx={{ width: '100%', overflow: `hidden` }} elevation={0}>
                                        <TableContainer className={`table ${hiddenChangeLog ? 'no-changelog' : ''}`}>
                                            {tabs.selectTab === 0 && <ParaEnviarTable rows={rows} tabIndex={0} loading={loading} />}
                                            {tabs.selectTab === 1 && <Enviadas rows={rows} tabIndex={0} loading={loading} />}
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
        </>
    )
}
