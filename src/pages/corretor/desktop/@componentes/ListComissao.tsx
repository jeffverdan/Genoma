import ButtonComponent from "@/components/ButtonComponent";
import { ItemListRecentsType, listAndamentoType, TypeComissionsCorretores, TYPES_COMISSION_TYPE, UrlsAnunciosType, ValoresProducao } from "@/interfaces/Corretores";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { differenceInMinutes } from "date-fns";
import { useEffect, useState } from "react";
import { HiArrowPath } from "react-icons/hi2";
import { Tab, Tabs, Chip, Avatar } from '@mui/material/';
import AutoComplete from "@/components/AutoComplete";
import { DataFilter } from "@/interfaces/PosVenda/FiltroEndereco";
import { OptionData } from "@/components/AutoComplete/interface";
import TableList from "./@ElementosListComissao/TableList";
import ultimasComissoesCorretores from "@/apis/ultimasComissoesCorretores";

interface PropsType {
    returnList: (limite?: number, status?: number) => void
    loading: boolean
    setSelectedIndex: (e: number) => void
    setSelectProcess: ( e: ItemListRecentsType | null ) => void
    selectProcess: ItemListRecentsType | null
    listAndamento: listAndamentoType
    listConcluidos: listAndamentoType
    listCancelados: listAndamentoType
    TYPES_COMISSION: TYPES_COMISSION_TYPE
    selectTabTypeComission: number
    setSelectTabTypeComission: (e: number) => void
    listagemUltimaComissao: ItemListRecentsType[]; // Lista de últimas comissões
    setListagemUltimaComissao: (e: ItemListRecentsType[]) => void
    valoresProducao: ValoresProducao[]
    statusIdMenu?: number; // Status do menu
    setStatusIdMenu: (e: number) => void; // Função para atualizar o status do menu
    // refreshListAndamento?: () => void; // Função para atualizar a lista de andamento
    page?: number; // Página atual
    setPage: (e: number) => void; // Função para atualizar a página
    rows?: any[]; // Dados da tabela
    setRows: (e: []) => void; // Função para atualizar as linhas
    totalRows?: number; // Total de linhas
    setTotalRows: (e: number) => void; // Função para atualizar o total de linhas
    totalPages?: number; // Total de páginas
    setTotalPages: (e: number) => void; // Função para atualizar o total de páginas
    listaEnderecos: ItemListRecentsType[];
    setListaEnderecos: (e: ItemListRecentsType[]) => void; // Função para atualizar a lista de endereços
    refreshListAndamento: (limite?: number, status?: number) => void; // Função para atualizar a lista de andamento
}

export default function ListComissao(props: PropsType) {
    const { page, setPage, totalRows, setTotalRows, setTotalPages, totalPages, rows, setRows, returnList, loading, listAndamento, listCancelados, listConcluidos, setSelectProcess, selectProcess, TYPES_COMISSION, selectTabTypeComission, setSelectTabTypeComission, listagemUltimaComissao, setListagemUltimaComissao, valoresProducao, statusIdMenu, setStatusIdMenu, listaEnderecos, setListaEnderecos, refreshListAndamento } = props;
    const [timeDifference, setTimeDifference] = useState<string | null>("0 minutos");
    const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
    const [listProcess, setListProcess] = useState<ItemListRecentsType[]>([]);
    const [loadingOrder, setLoadingOrder] = useState<boolean>(true);
    // const [listaEnderecos, setListaEnderecos] = useState<ItemListRecentsType[]>([]);

    console.log('VALORES PRODUÇÂO: ', valoresProducao)

    // FILTRO ENDEREÇO
    const [adressFilter, setAdressFilter] = useState<DataFilter>({
        endereco: null,
    });

    // ORDENAÇÃO
    const orderInicialValue = { patch: '', id: 0 };
    const [selectOrder, setSelectOrder] = useState<{ patch: string, id: number }>(orderInicialValue);

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
    }, []);

    useEffect(() => {
        const now = new Date();
        setLastUpdated(now);
    }, [listAndamento]);

    const handleTab = (event: React.SyntheticEvent, value: any) => {
        // Passar para o navegador o id do status selecionado no submenu de Comissão
        sessionStorage.setItem('comissao_menu_status', String(TYPES_COMISSION[value].id));
        sessionStorage.setItem('comissao_type_menu', String(value));
        sessionStorage.removeItem('investimento_menu_item');

        setSelectTabTypeComission(value);
        returnList(0, TYPES_COMISSION[value].id); // Fetches the new list for the tab
        setStatusIdMenu(TYPES_COMISSION[value].id);
        // setListProcess(listagemUltimaComissao) is now handled by the useEffect
    };

    const loadingLocalFilters = () => {
        if(localStorage.getItem('filter_endereco') !== null){
            const filterEnderecoLocal: any = localStorage.getItem('filter_endereco') || '' ; 
            let arrFilterEndereco = JSON.parse(filterEnderecoLocal);
            adressFilter.endereco = arrFilterEndereco || '';
            setAdressFilter({...adressFilter});
        }
    };

    const getListEnderecos = async () => {
        console.log('CAIU NA LISTA DE ENDEREÇOS')
        setListaEnderecos(
            (valoresProducao?.find((data) => data.id === statusIdMenu)?.endereco || [])
                .map((item: any) => ({
                    ...item,
                    logradouro: item.logradouro ?? "",
                    // Add other required ItemListRecentsType properties with default values if needed
                }))
        )
        // setListProcess is now handled by the useEffect
    }
    useEffect(() => {
        setLoadingOrder(true);
        loadingLocalFilters();
        getListEnderecos();

        // Apply sorting if an order filter is active when listagemUltimaComissao changes or selectOrder changes
        const filterOrdenacao = localStorage.getItem('filtro_ordenacao');
        const parsedFilterOrdenacao = filterOrdenacao ? JSON.parse(filterOrdenacao) : null;

        if (parsedFilterOrdenacao && parsedFilterOrdenacao.patch && parsedFilterOrdenacao.id) {
            const listToSort = [...listagemUltimaComissao];
            const sortedList = listToSort.sort((a, b) => {
                let compareA: any;
                let compareB: any;

                switch (parsedFilterOrdenacao.patch) {
                    case 'data_andamento':
                    case 'data_transferencia':
                    case 'data_conclusao':
                    case 'data_cancelamento':
                    case 'data_solicitacao':
                    case 'data_liberacao':
                        // Assuming data_ordenacao_exibicao is in DD/MM/YYYY format
                        compareA = a.data_ordenacao_exibicao ? new Date(a.data_ordenacao_exibicao.split('/').reverse().join('-')) : null;
                        compareB = b.data_ordenacao_exibicao ? new Date(b.data_ordenacao_exibicao.split('/').reverse().join('-')) : null;
                        break;
                    case 'valor_comissao':
                        // compareA = parseFloat(a.soma?.toString().replace('.', '').replace(',', '.') || '0');
                        // compareB = parseFloat(b.soma?.toString().replace('.', '').replace(',', '.') || '0');
                        compareA = parseFloat(a.soma?.toString().replace(/\./g, '').replace(',', '.') || '0');
                        compareB = parseFloat(b.soma?.toString().replace(/\./g, '').replace(',', '.') || '0');
                        break;
                    default:
                        return 0;
                }

                if (compareA === null && compareB === null) return 0;
                if (compareA === null) return parsedFilterOrdenacao.id === 1 ? 1 : -1; // Nulls at end for ascending, at start for descending
                if (compareB === null) return parsedFilterOrdenacao.id === 1 ? -1 : 1;

                if (compareA < compareB) {
                    // return parsedFilterOrdenacao.id === 1 ? -1 : 1;
                    return parsedFilterOrdenacao.id === 1 ? 1 : -1;
                }
                if (compareA > compareB) {
                    // return parsedFilterOrdenacao.id === 1 ? 1 : -1;
                    return parsedFilterOrdenacao.id === 1 ? -1 : 1;
                }
                return 0;
            });
            setListProcess(sortedList);
        } else {
            setListProcess(listagemUltimaComissao); // If no order filter, just use the raw fetched list
        }
        setLoadingOrder(false);
    }, [listagemUltimaComissao, selectOrder]) // Re-run when list data or sort order changes

    console.log('LIST PROCESS: ', listProcess)

    // useEffect(() => {
    //     //getList();
    // },[/*selectTabTypeComission*/]);

    const getList = async (key?: TypeComissionsCorretores) => {
        // Sempre chama refreshListAndamento quando getList é acionado pelo OrderBy,
        // A chamada da API agora é feita diretamente pelo OrderBy através da prop returnList.
        // Esta função agora apenas serve para passar a referência de `refreshListAndamento` para os filhos.
        refreshListAndamento(0, TYPES_COMISSION[selectTabTypeComission].id);
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
        returnList(0, TYPES_COMISSION[selectTabTypeComission].id, ); // Re-fetch list with address filter
        // setListProcess(listagemUltimaComissao) is now handled by the useEffect
        setAdressFilter({ ...adressFilter });
    };

    const returnListLength = (key: TypeComissionsCorretores, statusId: number) => {
        switch (String(statusId)) {
            case '9':
                return '(' + valoresProducao?.find((data) => data.id === statusId)?.qtd + ')' || '';
            case '10':
                return '(' + valoresProducao?.find((data) => data.id === statusId)?.qtd + ')' || '';
            case '11':
                return '(' + valoresProducao?.find((data) => data.id === statusId)?.qtd + ')' || '';
            case '12':
                return '(' + valoresProducao?.find((data) => data.id === statusId)?.qtd + ')' || '';
            case '13':
                return '(' + valoresProducao?.find((data) => data.id === statusId)?.qtd + ')' || ''; // ID 13 Tranferido sendo exibido como Concluído
            case '16':
                return '(' + valoresProducao?.find((data) => data.id === statusId)?.qtd + ')' || '';
            default:
                return '';
        }
    };

    return (
        <div className="lista-comissao">
            <div className="header-lista">
                <div className="refresh-container">
                    <div className='header-title'>
                        <CurrencyDollarIcon />
                        <span>Comissão</span>
                    </div>
                    <div className='atualizar-lista'>
                        <ButtonComponent
                            size={'medium'}
                            variant={'text'}
                            name={'atualizar-painel'}
                            onClick={() => returnList(0, statusIdMenu)}
                            label={'Atualizar painel'}
                            endIcon={<HiArrowPath className={loading ? 'rotate' : ''} />}
                        />
                        <span className="subtitle">{lastUpdated ? `Há ${timeDifference}` : ''}</span>
                    </div>
                </div>

                <div className="tabs-container">
                    <Tabs value={selectTabTypeComission} onChange={handleTab} className={`tabs-container ${selectTabTypeComission >= 2 ? 'hidden-next' : 'hidden-prev'}`} aria-label="icon label tabs">
                        {TYPES_COMISSION?.map((tab, index) => (
                            <Tab key={index} label={tab.label + ' ' + returnListLength(tab.key, tab.id)} id={tab.key} />
                        ))}
                    </Tabs>
                </div>
            </div>
            {/* valoresProducao?.find((data) => data.id === statusIdMenu)?.endereco || [] */}
            <AutoComplete options={listaEnderecos} value={adressFilter.endereco} onChange={handleFilterEndereco} />
            {/* <AutoComplete options={listProcess|| []} value={adressFilter.endereco} onChange={handleFilterEndereco} /> */}

            <TableList 
                setLoadingOrder={setLoadingOrder} 
                loadingOrder={loadingOrder} 
                statusIdMenu={statusIdMenu} 
                loading={loading} 
                setSelectProcess={setSelectProcess} 
                selectProcess={selectProcess} 
                list={listProcess} 
                setListProcess={setListProcess} 
                getList={getList} 
                setSelectOrder={setSelectOrder} 
                selectOrder={selectOrder} 
                listagemUltimaComissao={listagemUltimaComissao} 
                returnList={returnList} 
                // refreshOrder={refreshOrder}
                page={page}
                setPage={setPage}
                rows={rows}
                setRows={setRows}
                totalRows={totalRows}
                setTotalRows={setTotalRows}
                totalPages={totalPages}
                setTotalPages={setTotalPages}
            />
        </div>
    )
}