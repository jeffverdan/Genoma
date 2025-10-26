import React, { useState, useEffect } from 'react';

import Button from '@/components/ButtonComponent';
import { HiTrash } from 'react-icons/hi';
import { FaFilter } from 'react-icons/fa'
import { HiArrowPath, HiBuildingOffice2, HiBarsArrowDown } from 'react-icons/hi2';
import { Link, Paper, Pagination, TableContainer, AlertTitle, Alert, Autocomplete, TextField, InputAdornment, Chip } from '@mui/material';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { differenceInMinutes } from 'date-fns';
import GerenteTable from './@gerenteTable';
import GerenteGeralTable from './@gerenteGeralTable';
import AutoComplete from '@/components/AutoComplete';
import getListaVendasGerenteGG from '@/apis/getListaVendasGerenteGG';
import getEnderecos from '@/apis/getEnderecos';
import Filters from '@/components/Filters';
import { log } from 'console';
import OrderBy from '@/components/OrderBy';
import GetTotalProcessos from '@/apis/getTotalProcessGerentes';
import { DataListagem, TotalProcess } from '@/interfaces/Vendas/MenuPrincipal';
import { FiltersKeys, FiltersToolbar, FiltersType } from '@/components/Filters/interfaces';
import { EnderecoFilterData } from '@/interfaces/PosVenda/FiltroEndereco';

interface DataRows {
  id: number
  gerente: string;
  gerenteName2?: string;
  gerenteId: number;
  endereco: string;
  complemento?: string;
  progresso: number;
  data: string;
  statusGerente?: string;
  statusPosVenda?: string;
  dataAssinatura?: string;
  dataStatusAlterado?: string;
  prazoEscritura?: string;
  formaPagamento?: [];
  responsavelPosVendaId?: string;
  recibo?: string;
  reciboId?: string;
  imovelId?: string;
  origemRecibo?: string;
  posvendaName?: string;
  dataPrazoPos?: string;
  comprador: boolean;
  vendedor: boolean;
  comissaoId?: string;
  foguetes: number;
}

interface DataFilter {
  endereco: EnderecoFilterData | null
}

interface DataError {
  title: string;
  subtitle: string;
}

interface DataArrayVenda {
  id: number
  label: string;
  typeApi: 'rascunhos' | 'entregues' | 'arquivados' | 'revisoes' | 'finalizados'
};

interface Props {
  loadingMenu: boolean
  selectedIndex: number
  setSelectedIndex: (index: number) => void
  collapseMenu: boolean
  totalProcess?: TotalProcess
  setTotalProcess: (e: TotalProcess) => void
}

export default function MenuVendas(props: Props) {
  const { selectedIndex, setSelectedIndex, collapseMenu, loadingMenu, totalProcess, setTotalProcess} = props;
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<string | null>("");
  const [userId, setUserId] = useState<number | undefined>();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [timeDifference, setTimeDifference] = useState<string | null>(null);
  const [error, setError] = useState<DataError>();

  // LISTA DE PROCESSOS
  const [rows, setRows] = useState<DataRows[]>([])
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // const [totalProcess, setTotalProcess] = useState<TotalProcess>();

  // ESTADOS DE FILTROS  
  const [listEnderecos, setListEnderecos] = useState([]);
  const [filters, setFilters] = useState<DataFilter>({
    endereco: null,
  })

  const filtersInicialValue = {
    filtro_gerente: [],
    filtro_responsavel: [],
    filtro_status: [],
    filtro_status_rascunho: [],
    filtro_pagamento: [],
    filtro_recibo: [],
    filtro_correcoes: [],
  };
  const [filtersToolbar, setFiltersToolbar] = useState<FiltersToolbar>(filtersInicialValue);

  // ORDER
  const orderInicialValue = { patch: '', id: 0 };
  const [selectOrder, setSelectOrder] = useState<{ patch: string, id: number }>(orderInicialValue);

  useEffect(() => {
    if (userId && selectedIndex >= 3) returnList(selectedIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, userId, selectedIndex]);

  const arrayVenda: DataArrayVenda[] = [
    { id: 3, label: 'Em rascunho', typeApi: 'rascunhos' },
    { id: 4, label: 'Revisão', typeApi: 'revisoes' },
    { id: 5, label: 'Entregues', typeApi: 'entregues' },
    { id: 6, label: 'Lixeira', typeApi: 'arquivados' },
    { id: 7, label: 'Finalizados', typeApi: 'finalizados' },
  ];

  const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedIndex(newValue + 3);
    setSelectOrder(orderInicialValue);
    // setFiltersToolbar(filtersInicialValue);

    if (page === 0) {
      // returnList(newValue + 3)
    } else {
      setPage(0);
    }
  };

  useEffect(() => {
    setUserProfile(localStorage.getItem('perfil_login'));
    setUserId(Number(localStorage.getItem('usuario_id')));
    setPage(Number(localStorage.getItem('page')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnList = async (idArrayVendas?: number, notLoading?: boolean) => {
    if(!notLoading) setLoading(true);
    if (!idArrayVendas) idArrayVendas = selectedIndex;

    const now = new Date();
    setLastUpdated(now);
    setTimeDifference("0 minutos");
    localStorage.setItem('page', page.toString());
    const typeList = arrayVenda.find((lista) => lista.id === idArrayVendas)?.typeApi as DataListagem;
    const getListEnderecos = await getEnderecos(typeList) as unknown as [];
    setListEnderecos(getListEnderecos);

    // Recuperando os filtros caso tenham sido usados /////////////////////////////////////////
    let filtersObj = {
        ...filters,
        ...filtersToolbar
    }

    const filtersLocal = localStorage.getItem('filters_posvenda') || '';
    if (filtersLocal) {
        const objFilters: FiltersToolbar = JSON.parse(filtersLocal);
        
        setFiltersToolbar(objFilters);
        filtersObj = {...filtersObj, ...objFilters}
    }

    const filterEnd = localStorage.getItem('filter_endereco');
    if (filterEnd) {
        // console.log(filterEnd);
        filters.endereco = JSON.parse(filterEnd);
        filtersObj = {...filtersObj, endereco: JSON.parse(filterEnd)}
    }
    /////////////////////////////////////////////////////////////////////////////////////////
                
    const res = await getListaVendasGerenteGG(userId, typeList, page, filtersObj, selectOrder) as any;    
    // console.log('RES: ' , res)
    if (res) {
      if (res.data) {
        // console.log("Processos Mapeados ", res.data);        
        setRows(res.data);
        setTotalPages(res.last_page);
        setTotalRows(res.total);
        const total: unknown  = await GetTotalProcessos();
        setTotalProcess(total as TotalProcess);
        // console.log(total);        
      } else {
        // Tratar caso em que um erro ocorre
        setError(res.message);
        setTotalPages(1);
        setTotalRows(0);
        setRows([]);
      }
    } else {
      // Tratar caso em que 'res' é undefined
    }
    setTimeout(() => {
      if(!notLoading) setLoading(false);
    }, 500);
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

  const handleFilterEndereco = (event: any, newValue: string | EnderecoFilterData | null) => {
    // console.log(newValue);
    // console.log(event.target.value);
    const value = typeof newValue === 'string' ? { logradouro: newValue } : newValue;

    if (typeof newValue === 'string') {
      localStorage.removeItem('filter_endereco');
      filters.endereco = {
        logradouro: newValue
      }
    } else {
      filters.endereco = value;
      localStorage.setItem('filter_endereco', JSON.stringify(value))
    }
    setFilters({ ...filters });
    returnList(selectedIndex);
  };

  const handleDelete = (chave: FiltersKeys, index: number) => {
    // console.log(filtersToolbar);
    if (filtersToolbar[chave] !== undefined) {
      filtersToolbar[chave]?.splice(index, 1);
      // console.log(filtersToolbar);
      // setFiltersToolbar({ ...filtersToolbar });
    }
    localStorage.setItem('filters_posvenda', JSON.stringify(filtersToolbar));
    setFiltersToolbar({ ...filtersToolbar });
    returnList();
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

  const returnTotalProcessLabel = (index: number) => {
    // { id: 3, label: 'Em rascunho', typeApi: 'rascunhos' },
    // { id: 4, label: 'Revisão', typeApi: 'revisoes' },
    // { id: 5, label: 'Entregues', typeApi: 'entregues' },
    // { id: 6, label: 'Lixeira', typeApi: 'arquivados' },

  };

  return (
    <div className='painelVendas-container'>
      <div className='header-dashboard'>
        <div className='info-header'>
          <div className='menu-info'>
            <HiBuildingOffice2 />
            <span>Vendas</span>
          </div>
          <div className='atualizar-lista'>
            <Button size={'medium'} variant={'text'} name={'atualizar-painel'} onClick={() => returnList(selectedIndex)} label={'Atualizar painel'} endIcon={<HiArrowPath className={loading ? 'rotate' : ''} />} />
            <span>{lastUpdated ? `Hà ${timeDifference}` : ''}</span>
          </div>
        </div>

        <div className='tab-menu'>
          <Tabs value={selectedIndex - 3} onChange={handleChangeTabs} className='tab-list'>
            {arrayVenda.map((item) => (
              <Tab 
                key={item.id} 
                label={`${item.label} ${totalProcess?.[item.typeApi] ? '(' + totalProcess[item.typeApi] + ')' : ''}`} 
                id={item.id.toString()} 
                iconPosition="start" 
                icon={item.label === 'Lixeira' ? <HiTrash /> : ""} 
              />
            ))}
          </Tabs>
        </div>

      </div>
      <div className='adress-filter'>
        <AutoComplete options={listEnderecos} value={filters.endereco} onChange={handleFilterEndereco} />
      </div>
      <div className='list-table'>
        <div className='list-tools'>
          <div className='filters'>
            <Filters
              gerente={userProfile !== 'Gerente'}
              formaPagamento={selectedIndex === 5}
              posVenda={selectedIndex === 5}
              status={selectedIndex === 5}
              modoRecibo={selectedIndex === 5}
              correcoes={selectedIndex === 4}
              statusRascunho={selectedIndex === 3 || selectedIndex === 6}
              setSelectFilters={setFiltersToolbar}
              selectFilters={filtersToolbar}
              returnList={returnList}
            />
            {(selectedIndex === 3 || selectedIndex === 4) &&
              <OrderBy
                setSelectOrders={setSelectOrder}
                selectOrders={selectOrder}
                returnList={returnList}
                rank={selectedIndex === 3}
                dataAssinatura={selectedIndex === 4}
                dataPedido={selectedIndex === 4}
                diasCorridos={selectedIndex === 4}
              />
            }
            {(selectedIndex === 5) &&
              <OrderBy
                setSelectOrders={setSelectOrder}
                selectOrders={selectOrder}
                returnList={returnList}
                dataAssinatura
                prazoEscritura
                status
              />
            }
          </div>
          <div className='pagination'>
            <span>Mostrando <span className='colorP500'>{rows.length}</span> de <span className='colorP500'>{totalRows}</span> vendas.</span>

            <Pagination shape={'rounded'} count={totalPages} page={page} onChange={(e, newPage) => setPage(newPage)} />
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
              {userProfile === 'Gerente'
                ? <GerenteTable rows={rows} returnList={returnList} loadingMenu={loadingMenu} loading={loading} userId={userId} tabIndex={selectedIndex} collapseMenuPrincipal={collapseMenu} />
                : <GerenteGeralTable rows={rows} returnList={returnList} loadingMenu={loadingMenu} loading={loading} userId={userId} tabIndex={selectedIndex} collapseMenuPrincipal={collapseMenu} />
              }
              {error?.title && <Alert severity="error">
                <AlertTitle color='red'>{error.title}</AlertTitle>
                <span>{error.subtitle} </span><Link href="/">Relogar</Link>
              </Alert>}
            </TableContainer>
            <div className='footer-pagination'>
              {/* <Pagination shape={'rounded'} count={totalPages} page={page} onChange={(e, newPage) => setPage(newPage)} /> */}
            </div>
          </Paper>

        </div>
      </div>
    </div>
  )
}