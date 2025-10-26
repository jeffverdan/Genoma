import React, { useState, useEffect } from 'react';

import Button from '@/components/ButtonComponent';
import { HiTrash } from 'react-icons/hi';
import { HiArrowPath } from 'react-icons/hi2';
import { Link, Paper, Pagination, TableContainer, AlertTitle, Alert, Chip } from '@mui/material';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { differenceInMinutes } from 'date-fns';
import AutoComplete from '@/components/AutoComplete';
import AutoCompleteTesteBuscar from '@/components/AutoCompleteTesteBuscar';
import Filters from '@/components/Filters';
import OrderBy from '@/components/OrderBy';
import TableVendas from './@Components/TableVendas';
import DataRows from '@/interfaces/PosVenda/DadosPainelTeste';

import getEnderecosBuscar from '@/apis/getEnderecosBuscar';
import GetTotalProcessos from '@/apis/getTotalProcessPosVenda';
import getListaVendasPosVenda from '@/apis/getListaVendasPosVenda';
import { DataFilter, EnderecoFilterData } from '@/interfaces/PosVenda/FiltroEndereco';
import { FiltersKeys, FiltersToolbar, FiltersType } from '@/components/Filters/interfaces';
import getListaClientesNucleo from '@/apis/getListaClientesNucleo';
import FilterClientes from '@/components/AutoCompleteFilterClientes';
import { ClientesOptionData } from '@/components/AutoCompleteFilterClientes/interface';
import getListClientesPosVenda from '@/apis/getListaClientesPosVenda';
import dayjs from 'dayjs';
import { returnDeadLines } from '@/functions/returnDeadLines';

interface DataError {
    title: string;
    subtitle: string;
}

interface DataArrayVenda {
    id: number
    label: string;
    typeApi: 'andamento' | 'finalizadas' | 'revisoes' | 'cancelados'
};

interface DataListagem {
    tipo_listagem?: 'andamento' | 'finalizadas' | 'revisoes' | 'cancelados',
    buscar: string,
}

type ListClientesType = {
    cpf_cnpj: string
    id: string | number
    name: string
    label: string
}

interface Props {
    loadingMenu: boolean
    setLoading: (e: boolean) => void
    selectedIndex: number
    setSelectedIndex: (index: number) => void
    collapseMenu: boolean
    setCollapseVendas: (e: boolean) => void
    openDialog: boolean
    setOpenDialog: (e: boolean) => void
    typeDialog?: string
    setTypeDialog: (e: string) => void
    countTotalProcess: (number | undefined)[]
}

export default function MenuVendas(props: Props) {
    const { selectedIndex, setSelectedIndex, collapseMenu, setCollapseVendas, loadingMenu, setLoading, openDialog, setOpenDialog, typeDialog, setTypeDialog, countTotalProcess } = props;
    const [userId, setUserId] = useState<number | undefined>();
    const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
    const [timeDifference, setTimeDifference] = useState<string | null>(null);

    const [error, setError] = useState<DataError>();

    // LISTA DE PROCESSOS
    const [rows, setRows] = useState<DataRows[]>([])
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // ESTADOS DE FILTROS  
    const [listEnderecos, setListEnderecos] = useState([]);
    const [filters, setFilters] = useState<DataFilter>({
        endereco: null,
    });
    const [awaitApi, setAwaitApi] = useState(true);
    const [currentCount, setCurrentCount] = useState<NodeJS.Timeout>();

    const [searchTerm, setSearchTerm] = useState<string | null>(null);

    const filtersInicialValue = {
        filtro_gerente: [],
        filtro_responsavel: [],
        filtro_status: [],
        filtro_status_rascunho: [],
        filtro_pagamento: [],
        filtro_recibo: [],
        filtro_correcoes: [],
        filtro_clientes: [],
        filtro_laudemio: [],
        filtro_prazo_status: [],
    };
    const [filtersToolbar, setFiltersToolbar] = useState<FiltersToolbar>(filtersInicialValue);
    const [clientesList, setClientesList] = useState<ListClientesType[] | []>([]);
    const [loadingFilter, setLoadingFilter] = useState(false);

    // ORDER
    const orderInicialValue = { patch: '', id: -1 };
    const [selectOrder, setSelectOrder] = useState<{ patch: string, id: number }>(orderInicialValue);

    useEffect(() => {
        if(selectedIndex > 2)  {
            setSelectOrder(orderInicialValue);
            returnList();
            readFilters(selectedIndex);
        } 
    }, [selectedIndex]);

    const arrayVenda: DataArrayVenda[] = [
        { id: 3, label: 'Em andamento', typeApi: 'andamento' },
        { id: 4, label: 'Revisão', typeApi: 'revisoes' },
        { id: 5, label: 'Concluídos', typeApi: 'finalizadas' },
        { id: 6, label: 'Cancelados', typeApi: 'cancelados' },
    ];

    const handleChangeTabs = (newValue: number) => {
        setSelectedIndex(newValue + 3);
    };
    console.log('SELECTINDEX VENDAS: ', selectedIndex);

    useEffect(() => {
        if (selectedIndex === 3) setCollapseVendas(true)
        setUserId(Number(localStorage.getItem('usuario_id')));
        setPage(Number(localStorage.getItem('page')));
    }, []);

    const returnList = async (pageParam?: number) => {
        if (!pageParam) pageParam = page
        else if (pageParam) setPage(pageParam);

        if (selectedIndex > 2) {
            clearTimeout(currentCount);

            setLoading(true);
            setCurrentCount(setTimeout(async () => {
                const now = new Date();
                setLastUpdated(now);
                setTimeDifference("0 minutos");
                localStorage.setItem('page', pageParam?.toString() || '1');     
                const typeList = arrayVenda.find((lista) => lista.id === selectedIndex)?.typeApi;                

                let filtersObj = {
                    ...filters,
                    ...filtersToolbar
                }

                const filtersLocal = localStorage.getItem('filters_posvenda') || '';
                if (filtersLocal) {
                    const objFilters: FiltersToolbar = JSON.parse(filtersLocal);

                    setFiltersToolbar(objFilters);
                    filtersObj = { ...filtersObj, ...objFilters }
                }

                const filterEnd = localStorage.getItem('filter_endereco');
                if (filterEnd) {
                    // console.log(filterEnd);
                    filters.endereco = JSON.parse(filterEnd);
                    filtersObj = { ...filtersObj, endereco: JSON.parse(filterEnd) }
                };

                const res = await getListaVendasPosVenda(typeList, Number(pageParam), filtersObj, selectOrder) as any;

                if (res) {
                    if (res.data) {
                        setAwaitApi(false);
                        const data = res.data.map((e: DataRows) => ({
                            ...e,
                            deadline: returnDeadLines(dayjs(), e)
                        }));

                        setRows(data);
                        setTotalPages(res.last_page);
                        setTotalRows(res.total);

                    } else {
                        // Tratar caso em que um erro ocorre
                        setError(res.message);
                        setTotalPages(1);
                        setTotalRows(0);
                        setRows([]);
                    }
                } 
                setLoading(false);
            }, 1000));
        }
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

    const calculateTimeDifference = (): string | null => {
        if (lastUpdated) {
            const minutesDifference = differenceInMinutes(new Date(), lastUpdated);
            return `${minutesDifference} minutos`;
        }
        return null;
    };

    const handleFilterEnderecoTeste = (newValue: string | EnderecoFilterData | null) => {

        if (typeof newValue === 'string') {
            setFilters({ ...filters, endereco: newValue });
            setSearchTerm(newValue);
        } else {
            setFilters({ ...filters, endereco: newValue });
            setListEnderecos([]);
        }
    };

    // Efeito para aguardar antes de chamar a API
    useEffect(() => {
        if (searchTerm === '') {
            returnList();
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            const typeList = arrayVenda.find((lista) => lista.id === selectedIndex)?.typeApi || {};
            const getListEnderecos = await getEnderecosBuscar({
                tipo_listagem: typeList,
                ...typeList,
                buscar: searchTerm
            } as DataListagem);

            setListEnderecos(getListEnderecos as unknown as []);
        }, 1000); // 🔥 Aguarda 500ms após o último caractere digitado

        return () => clearTimeout(delayDebounceFn); // Cancela o timeout se o usuário continuar digitando
    }, [searchTerm, selectedIndex]);

    // Função de onChange no AutoComplete
    const handleSelectEndereco = (event: React.KeyboardEvent, newValue: EnderecoFilterData | null) => {
        const value = typeof newValue === 'string' ? { logradouro: newValue } : newValue;
        if (!newValue) {
            // Verifica se a tecla pressionada é 'Enter'

            filters.endereco = newValue;
        } else {
            filters.endereco = value;
        }

        localStorage.removeItem('filter_endereco');
        setFilters({ ...filters });
        returnList()
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Evita o comportamento padrão

            if (filters.endereco) {
                returnList(); // Chama a busca com o que foi digitado
            }
        }
    };

    const handleDelete = (chave: FiltersKeys, index: number) => {
        if (filtersToolbar[chave] !== undefined) {
            filtersToolbar[chave]?.splice(index, 1);
        }

        const selectedIds = new Set(filtersToolbar.filtro_clientes?.map(e => e.id));
        clientesList.forEach((c: any) => {
            c.check = selectedIds.has(c.id);
        });

        localStorage.setItem('filters_posvenda', JSON.stringify(filtersToolbar));
        setFiltersToolbar({ ...filtersToolbar });
        returnList();
    };

    const readFilters = async (value: number) => {
        setLoadingFilter(true);
        const typeList = arrayVenda.find((lista) => lista.id === value)?.typeApi;

        // FILTER CLIENTES
        const clientes = await getListClientesPosVenda(typeList || 'andamento');
        clientes?.forEach((e: any) => e.check = false);
        const filtersLocal = localStorage.getItem('filters_posvenda') || '';

        if (filtersLocal) {
            const objFilters: FiltersToolbar = JSON.parse(filtersLocal);
            console.log(objFilters.filtro_clientes);

            objFilters.filtro_clientes?.forEach((e) => {
                clientes?.forEach((c: any) => {
                    if (e.id === c.id) c.check = true;
                });
            });
        }
        setClientesList(clientes || []);

        setLoadingFilter(false);
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

        localStorage.setItem('filters_posvenda', JSON.stringify(filtersToolbar));

        setCurrentCount(setTimeout(() => {
            setFiltersToolbar({ ...filtersToolbar });
            setClientesList([...clientesList]);
            returnList();
        }, 1000));
    };

    console.log(rows);

    return (
        <div className='painelVendas-container'>
            <div className='header-dashboard'>
                <div className='tab-menu'>
                    <Tabs value={selectedIndex - 3} onChange={(e: any, value) => handleChangeTabs(value)} className='tab-list'>
                        {arrayVenda?.map((item, index) => (
                            <Tab
                                key={item.id}
                                label={`${item.label} ${countTotalProcess?.[index] ? '(' + countTotalProcess?.[index] + ')' : ''}`}
                                id={item.id.toString()}
                                iconPosition="start"
                                icon={item.label === 'Lixeira' ? <HiTrash /> : ""}
                            />
                        ))}
                    </Tabs>

                    <div className='atualizar-lista'>
                        <Button
                            size={'medium'}
                            variant={'text'}
                            name={'atualizar-painel'}
                            onClick={() => returnList()}
                            label={'Atualizar painel'}
                            endIcon={<HiArrowPath className={loadingMenu ? 'rotate' : ''} />}
                        />
                        <span>{lastUpdated ? `Há ${timeDifference}` : ''}</span>
                    </div>
                </div>

            </div>
            <div className='adress-filter'>

                <AutoCompleteTesteBuscar
                    options={listEnderecos}
                    value={filters.endereco}
                    onInputChange={(event, newValue) => {
                        handleFilterEnderecoTeste(newValue); // Quando o valor muda no input (digitação) 
                    }}

                    onChange={(event, newValue) => {
                        handleSelectEndereco(event, newValue); // Quando o usuário seleciona um item da lista
                    }}
                    onKeyDown={handleKeyDown}
                />

                <FilterClientes options={clientesList} onChange={onClienteFilter} loading={loadingFilter} />
            </div>
            <div className='list-table'>
                <div className='list-tools'>
                    {!awaitApi &&
                        <div className='filters'>
                            <Filters
                                setSelectFilters={setFiltersToolbar}
                                selectFilters={filtersToolbar}
                                returnList={returnList}
                                posVenda
                                status={selectedIndex === 3}
                                formaPagamento={selectedIndex === 3 || selectedIndex === 5}
                                gerente
                                laudemio
                                prazo // Prazo do status
                                orderBy={'pos-venda'}
                                selectedIndex={selectedIndex}
                            />
                            {(selectedIndex === 3 || selectedIndex === 4) &&
                                <OrderBy
                                    setSelectOrders={setSelectOrder}
                                    selectOrders={selectOrder}
                                    returnList={returnList}
                                    dataEntrada={selectedIndex === 3}
                                    status={selectedIndex === 3}
                                    dataAssinatura={selectedIndex === 4}
                                    dataPedido={selectedIndex === 4}
                                    diasCorridos={selectedIndex === 4}
                                />
                            }

                        </div>
                    }
                    <div className='pagination'>
                        <span>Mostrando <span className='colorP500'>{rows.length}</span> de <span className='colorP500'>{totalRows}</span> vendas.</span>

                        <Pagination shape={'rounded'} count={totalPages} page={page} onChange={(e, newPage) => returnList(newPage)} />
                    </div>

                </div>

                <div className='toolbar-filters'>
                    {(Object.keys(filtersToolbar) as FiltersKeys[]).map(chave =>
                        !!filtersToolbar[chave] && filtersToolbar[chave]?.map((e, index) => e.check && <ReturnFilterToolbar key={index} filter={e} chave={chave} index={index} />)
                    )}

                </div>

                <div className='list-content'>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }} elevation={0}>
                        <TableContainer className='table'>

                            <TableVendas
                                rows={rows}
                                returnList={returnList}
                                loading={loadingMenu}
                                setLoading={setLoading}
                                userId={userId}
                                tabIndex={selectedIndex}
                                collapseMenuPrincipal={collapseMenu}
                                openDialog={openDialog}
                                setOpenDialog={setOpenDialog}
                                typeDialog={typeDialog}
                                setTypeDialog={setTypeDialog}
                            />

                            {error?.title && <Alert severity="error">
                                <AlertTitle color='red'>{error.title}</AlertTitle>
                                <span>{error.subtitle} </span><Link href="/">Relogar</Link>
                            </Alert>}
                        </TableContainer>
                        <div className='footer-pagination'>
                            <Pagination shape={'rounded'} count={totalPages} page={page} onChange={(e, newPage) => returnList(newPage)} />
                        </div>
                    </Paper>

                </div>
            </div>
        </div>
    )
}