import { useEffect, useState } from "react";
import { differenceInMinutes, format } from "date-fns";
import ButtonComponent from "@/components/ButtonComponent";
import { HiArrowPath } from "react-icons/hi2";
import { CurrencyDollarIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Chip, Pagination, Paper, Tab, TableContainer, Tabs } from "@mui/material";
import AutoComplete from "@/components/AutoComplete";
import { OptionData } from "@/components/AutoComplete/interface";
import { GerentesOptionData } from "@/components/AutoCompleteGerentes/interface";
import AutoCompleteGerentes from "@/components/AutoCompleteGerentes";
import dayjs from "dayjs";
import DateInputComponent from "@/components/Date";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { DataFilter } from "@/interfaces/PosVenda/FiltroEndereco";
import { FiltersKeys, FiltersToolbar, FiltersType } from "@/components/Filters/interfaces";
import Filters from "@/components/Filters";
import OrderBy from "@/components/OrderBy";
import TableReceber from "./receber";
import TablePagar from "./pagar";
import TableConcluidos from "./concluidos";
import TableCancelados from "./cancelados";
import { ARRAY_MENU_COMISSION_TYPE, RowsType } from "@/interfaces/Financeiro/Listas";
import postFinanceiroTable from "@/apis/postFinanceiroComissaoTable";
import getEnderecosBuscar from "@/apis/getEnderecosBuscar";
import getEnderecos from "@/apis/getEnderecos";
import getListGerentesPosVenda from "@/apis/getListGerentesPosVenda";
import getListClientesGerentes from "@/apis/getListaClientes_Gerentes";
import FilterClientes from "@/components/AutoCompleteFilterClientes";
import { ClientesOptionData } from "@/components/AutoCompleteFilterClientes/interface";
import { X } from "@mui/icons-material";
import CornerFinanceiro from "../@Corners";
import { CornerDateType } from "@/interfaces/Financeiro/Status";

interface PropsType {
    subMenuSelect: number
    setSubMenuSelect: (e: number) => void
    ARRAY_COMISSAO?: ARRAY_MENU_COMISSION_TYPE[];
}

const filtersInicialValueTab = {
    filtro_status: [],
    filtro_tipo_venda: [],
    filtro_loja: [],
    filtro_cliente_gerente: [],
    filtro_status_financeiro: []
};

const orderInicialValue = { patch: '', id: -1 };

export default function MenuComission(props: PropsType) {
    const { subMenuSelect, setSubMenuSelect, ARRAY_COMISSAO } = props;
    const [timeDifference, setTimeDifference] = useState<string | null>("0 minutos");
    const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
    const [loading, setLoading] = useState(false);
    const [loadingListFilters, setLoadingListFilters] = useState(false);

    const [listEnderecos, setListEnderecos] = useState([]);
    const [gerentesList, setGerentesList] = useState<GerentesOptionData[]>([]);
    const [currentCount, setCurrentCount] = useState<NodeJS.Timeout>();
    const [filterDate, setFilterDate] = useState<{ from: dayjs.Dayjs | undefined, to: dayjs.Dayjs | undefined }>({
        from: undefined,
        to: undefined
    });
    const [adressFilter, setAdressFilter] = useState<DataFilter>({
        endereco: null,
    });
    const [filtersActive, setFiltersActive] = useState<FiltersToolbar>(filtersInicialValueTab);
    const [selectOrder, setSelectOrder] = useState<{ patch: string, id: number }>(orderInicialValue);

    const [rows, setRows] = useState<RowsType[]>([]);
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(-1);
    const [totalPages, setTotalPages] = useState(0);
    
    const [cornerData, setCornerData] = useState<CornerDateType>({
        open: false,
        title: '',
        subtitle: '',
        actionPrimary: undefined,
        labelPrimary: undefined,
        contador: undefined,
        secondaryAction: undefined,
        labelSecondary: undefined,
    });

    const calculateTimeDifference = (): string | null => {
        if (lastUpdated) {
            const minutesDifference = differenceInMinutes(new Date(), lastUpdated);
            return `${minutesDifference} minutos`;
        }
        return null;
    };

    const handleDelete = (chave: FiltersKeys, index: number) => {
        if (filtersActive[chave] !== undefined) {
            filtersActive[chave]?.splice(index, 1);
        }

        const selectedIds = new Set(filtersActive.filtro_clientes?.map(e => e.id));
        gerentesList.forEach((c: any) => {
            c.check = selectedIds.has(c.id);
        });

        localStorage.setItem('filters_financeiro', JSON.stringify(filtersActive));
        setFiltersActive({ ...filtersActive });
        returnList();
    };

    const ReturnFilterToolbar = ({ filter, chave, index }: { filter?: FiltersType, chave: FiltersKeys, index: number }) => {
        return (
            <Chip
                className='filter-chip'
                label={filter?.label}
                variant="outlined"
                onDelete={() => handleDelete(chave, index)}
            />
        )
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeDifference(calculateTimeDifference());
        }, 60000); // Atualiza a cada minuto (60000 milissegundos)

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const getFiltersList = async () => {        
        setLoadingListFilters(true);
        const typeList = {
            aba_financeiro: ARRAY_COMISSAO?.[subMenuSelect]?.param,
        } as const;
        const getListEnderecos = await getEnderecos(typeList) as unknown as [];
        setListEnderecos(getListEnderecos || []);
        const gerentes = await getListClientesGerentes(typeList) as unknown as FiltersType[];
        setGerentesList(gerentes || []);
        setLoadingListFilters(false);
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
        returnList();
    };

    const onGerenteFilter = (event: React.SyntheticEvent, value: (ClientesOptionData | string)[]) => {
        clearTimeout(currentCount);

        gerentesList.forEach((c: any) => {
            c.check = false;
        });
        const valueArr = value.map((e) => {
            console.log(e);

            if (typeof e === 'string') {
                return { id: '', label: e, check: true, cpf_cnpj: '' }
            } else {
                gerentesList.forEach((c: any) => {
                    if (e.id === c.id) c.check = true;
                });
                return { ...e, check: true }
            }
        });
        filtersActive.filtro_clientes = valueArr;

        setCurrentCount(setTimeout(() => {
            setFiltersActive(filtersActive);
            returnList();
        }, 1000));
    };

    const handleChangeData = (date: dayjs.Dayjs | null, key: "from" | "to") => {
        if (!date) return;
        console.log(date.format('YYYY-MM-DD'));
        const dateValue = date.format('YYYY-MM-DD');

        const newFilterDate = { ...filterDate, [key]: dateValue === 'Invalid Date' ? undefined : date };
        if (newFilterDate) setFilterDate(newFilterDate);

        // Atualiza o localStorage com a nova data
        localStorage.setItem(`filter_date_${key}`, dateValue === 'Invalid Date' ? '' : date.toISOString());
    };

    const loadingFilters = () => {
        const storedEndereco = localStorage.getItem('filter_endereco');
        const storedFromDate = localStorage.getItem('filter_date_from');
        const storedToDate = localStorage.getItem('filter_date_to');
        if (storedEndereco) {
            const parsedEndereco = JSON.parse(storedEndereco);
            setAdressFilter({ endereco: parsedEndereco });
        }
        if (storedFromDate) {
            const fromDate = dayjs(storedFromDate);
            setFilterDate((prev) => ({ ...prev, from: fromDate.isValid() ? fromDate : undefined }));
        }
        if (storedToDate) {
            const toDate = dayjs(storedToDate);
            setFilterDate((prev) => ({ ...prev, to: toDate.isValid() ? toDate : undefined }));
        }
        getFiltersList()
    };

    const onCancelar = () => {
        setCornerData({
            open: true,
            title: 'Você cancelou a cobrança!',
            subtitle: `Você pode conferir as cobranças canceladas na aba “Cancelados” no seu painel.`,
            actionPrimary: () => setCornerData({ open: false, title: '', subtitle: '' }),
            labelPrimary: 'Continuar',
            labelSecondary: 'Ir para aba Cancelados',
            secondaryAction: () =>{ 
                setSubMenuSelect(3)
                setCornerData({ open: false, title: '', subtitle: '' })
            },
        });
        returnList();
    };

    const returnList = async () => {        
        setLoading(true);
        clearTimeout(currentCount);
        setCurrentCount(setTimeout(async () => {
            setLastUpdated(new Date());
            setTimeDifference(calculateTimeDifference());
            const subMenuSelected = localStorage.getItem('financeiro_submenu') ? Number(localStorage.getItem('financeiro_submenu')) : subMenuSelect;
            localStorage.removeItem('financeiro_submenu');

            const props = {
                page,
                filtro: {
                    filtro_cliente_gerente: filtersActive.filtro_clientes || [],
                    filtro_status: filtersActive.filtro_status || [],
                    filtro_tipo_venda: filtersActive.filtro_tipo_venda || [],
                    filtro_loja: filtersActive.filtro_loja || [],
                    endereco: adressFilter.endereco,
                    periodo_inicial: filterDate.from?.format('YYYY-MM-DD') || '',
                    periodo_final: filterDate.to?.format('YYYY-MM-DD') || '',
                    filtro_status_financeiro: filtersActive.filtro_status_financeiro || []
                },
                ordenacao: selectOrder,
                tabela: ARRAY_COMISSAO?.[subMenuSelected].param || "a_receber"
            } as const
            const res = await postFinanceiroTable(props);            
            console.log(`returnList: `, res);

            setRows(res.rows || []);
            setTotalPages(res.last_page);
            setTotalRows(res.total);
            setLoading(false);
        }, 100));
    };

    useEffect(() => {
        console.log(subMenuSelect, page, filterDate);
        
        if (filterDate.to && filterDate.from) {
            returnList();
        } else if (!filterDate.to && !filterDate.from) {
            returnList();
        } 
    }, [subMenuSelect, page, filterDate]);

    useEffect(() => {   
        console.log(totalRows);
        if (totalRows === -1) loadingFilters();
        else getFiltersList();           
    }, [subMenuSelect]); // Atualiza a lista quando TAB, PAGE ou FilterData são alterados

    useEffect(() => {
           
    },[filterDate]);

    const onChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setLoading(true);
        localStorage.removeItem('filters_financeiro');
        setSubMenuSelect(newValue);
        clearFilterDate();
        setSelectOrder(orderInicialValue); // Reseta a ordenação ao mudar de aba
        setFiltersActive(filtersInicialValueTab); // Reseta os filtros ao mudar de aba
        setPage(1); // Reseta a página ao mudar de aba
        setRows([]); // Limpa as linhas para evitar dados desatualizados
    };

    const clearFilterDate = () => {
        const inputFrom = document.querySelector('.filter-date.from input') as HTMLInputElement;
        const inputTo = document.querySelector('.filter-date.to input') as HTMLInputElement;
        if (inputFrom) inputFrom.value = '';
        if (inputTo) inputTo.value = '';
        setFilterDate({ from: undefined, to: undefined });
        localStorage.removeItem('filter_date_from');
        localStorage.removeItem('filter_date_to');
    };

    return (
        <div className="table-container">
            <div className='header-container'>
                <div className="row">
                    <div className='header-title'>
                        <CurrencyDollarIcon className="icon-menu" />
                        <span>Comissões</span>
                    </div>
                    <div className='atualizar-lista'>
                        <ButtonComponent
                            size={'medium'}
                            variant={'text'}
                            name={'atualizar-painel'}
                            onClick={() => returnList()}
                            label={'Atualizar painel'}
                            endIcon={<HiArrowPath className={"icon-menu " + (loading ? 'rotate' : '')} />}
                        />
                        <span className="subtitle">{lastUpdated ? `Há ${timeDifference}` : ''}</span>
                    </div>
                </div>

                <div className="row">
                    <Tabs value={subMenuSelect} onChange={onChangeTab} className='tab-list'>
                        {ARRAY_COMISSAO?.map((item, index) => (
                            <Tab
                                key={index}
                                label={`${item.label}`}
                                id={index.toString()}
                                iconPosition="start"
                                icon={item.icon}
                                disabled={loading}
                            />
                        ))}
                    </Tabs>
                </div>
            </div>

            <div className="lists-container">
                <div className='filters-row'>
                    <AutoComplete options={listEnderecos} value={adressFilter.endereco} onChange={handleFilterEndereco} loading={loadingListFilters} />
                    {/* <AutoCompleteGerentes options={gerentesList} onChange={onGerenteFilter}  loading={loadingListFilters} /> */}
                    <FilterClientes options={gerentesList} onChange={onGerenteFilter} loading={loadingListFilters} clientesAndGerentes />
                </div>
                <div className="filters-row date">
                    De
                    <DateInputComponent
                        name="filter-date-from"
                        value={filterDate?.from}
                        onChange={(date) => handleChangeData(date, 'from')}
                        className='filter-date from'
                        maxDate={filterDate?.to} // Impede a seleção de uma data anterior à data "to" se já estiver definida
                    />
                    Até
                    <DateInputComponent
                        name="filter-date-to"
                        value={filterDate?.to || null}
                        onChange={(date) => handleChangeData(date, 'to')}
                        className='filter-date to'
                        minDate={filterDate?.from} // Impede a seleção de uma data posterior à data "from" se já estiver definida
                    />

                    {/* <ButtonComponent
                        size={'large'}
                        variant={'outlined'}
                        name={'filter-date'}
                        disabled={!filterDate?.to || !filterDate?.from}
                        onClick={() => returnList()}
                        label={''}
                        endIcon={<MagnifyingGlassIcon height={24} />}
                    /> */}

                    {/* <ButtonComponent
                        size={'large'}
                        variant={'outlined'}
                        name={'filter-date-clear'}
                        disabled={!filterDate?.to && !filterDate?.from}
                        onClick={() => clearFilterDate()}
                        label={''}
                        endIcon={<XMarkIcon width={26} />}
                    /> */}

                </div>

                <div className="list-table">
                    <div className='list-tools'>
                        <div className='filters'>
                            <Filters
                                // tab={tabs.selectTab}
                                setSelectFilters={setFiltersActive}
                                selectFilters={filtersActive}
                                returnList={returnList}
                                lojas
                                status={subMenuSelect === 0}
                                statusFinanceiroFilter={subMenuSelect === 0}
                                tipoVenda
                                perfilFinanceiro
                                localStorageKey={'filters_financeiro'}
                            />

                            <OrderBy
                                setSelectOrders={setSelectOrder}
                                selectOrders={selectOrder}
                                returnList={returnList}
                                valorParcela={[0, 3].includes(subMenuSelect)}
                                dataAssinatura
                                dataPrevista={subMenuSelect === 0}
                                valorRateio={[1, 2].includes(subMenuSelect)}
                                dataParcelaCancelamento={subMenuSelect === 3}
                                dataFinanceiroConcluido={subMenuSelect === 2}
                            />
                        </div>
                        <div className='pagination'>
                            <span>Mostrando <span className='colorP500'>{rows.length}</span> de <span className='colorP500'>{totalRows}</span> vendas.</span>

                            <Pagination shape={'rounded'} count={totalPages} page={page} onChange={(e, newPage) => setPage(newPage)} />
                        </div>
                    </div>

                    <div className='toolbar-filters'>
                        {(filterDate.from && filterDate.to) && (
                            <Chip
                                className='filter-chip'
                                label={`${filterDate.from.format('DD/MM/YYYY')} - ${filterDate.to.format('DD/MM/YYYY')}`}
                                variant="outlined"
                                onDelete={() => clearFilterDate()}
                            />
                        )}
                        {(Object.keys(filtersActive) as FiltersKeys[]).map(chave =>
                            !!filtersActive[chave] && filtersActive[chave]?.map((e, index) => e.check && <ReturnFilterToolbar key={index} filter={e} chave={chave} index={index} />)
                        )}
                    </div>

                    <div className='list-content'>
                        <Paper sx={{ width: '100%', overflow: `hidden` }} elevation={0}>
                            <TableContainer className={`table`}>
                                {subMenuSelect === 0 && <TableReceber rows={rows} loading={loading} retunProcess={onCancelar} />}
                                {subMenuSelect === 1 && <TablePagar rows={rows} loading={loading} retunProcess={onCancelar} />}
                                {subMenuSelect === 2 && <TableConcluidos rows={rows} loading={loading} />}
                                {subMenuSelect === 3 && <TableCancelados rows={rows} loading={loading} />}
                            </TableContainer>
                            <div className='footer-pagination'>
                                {/* <Pagination shape={'rounded'} count={totalPages} page={page} onChange={(e, newPage) => setPage(newPage)} /> */}
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>

            <CornerFinanceiro
                open={cornerData.open}
                setOpen={() => setCornerData(prev => ({ ...prev, open: false }))}
                title={cornerData.title}
                subtitle={cornerData.subtitle}
                actionPrimary={cornerData.actionPrimary}
                labelPrimary={cornerData.labelPrimary}
                contador={cornerData.contador}
                secondaryAction={cornerData.secondaryAction}
                labelSecondary={cornerData.labelSecondary}
            />
        </div>
    )
}
