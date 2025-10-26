import { useEffect, useState } from "react"
import { Tab, Tabs, Chip, Avatar } from '@mui/material/';
import ButtonComponent from "@/components/ButtonComponent";
import { BarsArrowDownIcon, MagnifyingGlassIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { ItemListRecentsType, listAndamentoType, TypeComissionsCorretores, UrlsAnunciosType, ValoresProducao } from "@/interfaces/Corretores";
import ListComission from "./@Components/@AbaComissao/List";
import OrderBy from "@/pages/corretor/components/OrderBy";
import AutoCompleteMobile from "@/components/AutoCompleteMobile";
import { OptionData } from "@/components/AutoComplete/interface";
import { DataFilter } from '@/interfaces/PosVenda/FiltroEndereco';
import DetalhesVenda from "./@Components/@DetalhesVenda";

interface PropsType {
    selectTabType: number
    setSelectTabType: (e: number) => void
    listAndamento: listAndamentoType
    selectProcess: ItemListRecentsType | null
    setSelectProcess: (e: ItemListRecentsType | null) => void
    setSelectedTab?: (e: number) => void;
    // getListAndamento: (limite?: number, status?: number) => void
    listProcess: any
    setListProcess: any
    typesComission: { label: string, key: string, id?: number }[]
    listagemUltimaComissao: ItemListRecentsType[]; // Lista de últimas comissões
    valoresProducao: ValoresProducao[]
    returnList: (limite?: number, status?: number) => void
    refreshListAndamento: (limite?: number, status?: number) => void
    statusIdMenu?: number; // Status do menu
    setStatusIdMenu: (e: number) => void; // Função para atualizar o status do menu
}

export default function Comissao(props: PropsType) {
    const { selectTabType, setSelectTabType, listAndamento, selectProcess, setSelectProcess, setSelectedTab, listProcess, setListProcess, typesComission, listagemUltimaComissao, returnList, refreshListAndamento, statusIdMenu, setStatusIdMenu, valoresProducao } = props;

    // FILTRO ENDEREÇO
    const [filterAdressActive, setFilterAdressActive] = useState(false);
    const [adressFilter, setAdressFilter] = useState<DataFilter>({
        endereco: null,
    });
    const [validarFilter, setValidarFilter] = useState(false);
    const [listaEnderecos, setListaEnderecos] = useState<ItemListRecentsType[]>([]);

    // ORDENAÇÃO
    const orderInicialValue = { patch: '', id: 0 };
    const [selectOrder, setSelectOrder] = useState<{ patch: string, id: number }>(orderInicialValue);

    const loadingLocalFilters = () => {
        if(localStorage.getItem('filter_endereco') !== null){
            const filterEnderecoLocal: any = localStorage.getItem('filter_endereco') || '' ; 
            let arrFilterEndereco = JSON.parse(filterEnderecoLocal);
            adressFilter.endereco = arrFilterEndereco || '';
            setAdressFilter({...adressFilter});
        }
    };

    const getListEnderecos = async () => {
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
        loadingLocalFilters();
        getListEnderecos(); // This will update listaEnderecos

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
    }, [listagemUltimaComissao, selectOrder, statusIdMenu, valoresProducao]) // Re-run when list data or sort order changes

    const handleTab = (event: React.SyntheticEvent, value: any) => {
        // Passar para o navegador o id do status selecionado no submenu de Comissão
        sessionStorage.setItem('comissao_menu_status', String(typesComission[value].id));
        sessionStorage.setItem('comissao_type_menu', String(value));
        sessionStorage.removeItem('investimento_menu_item');

        setSelectTabType(value);
        returnList(0, typesComission[value].id); // Fetches the new list for the tab
        setStatusIdMenu(Number(typesComission[value]?.id));
        // setListProcess is now handled by the useEffect
    };

    const handleFilterEndereco = (event: any, newValue: string | OptionData | null) => {
        console.log('QUALQUER COISA')
        const value = typeof newValue === 'string' ? { logradouro: newValue } : newValue;
        if (!newValue) {
            localStorage.removeItem('filter_endereco');
            adressFilter.endereco = newValue;
        } else {
            adressFilter.endereco = value;
            localStorage.setItem('filter_endereco', JSON.stringify(value))
        }
        returnList(0, typesComission[selectTabType].id, ); // Re-fetch list with address filter
        // setListProcess is now handled by the useEffect
        setAdressFilter({ ...adressFilter });
    };

    const onBlurFilter = (event: React.FocusEvent<HTMLInputElement>) => {
        if(!!event.target.value){
            setValidarFilter(true);    
        }
        else{
            setValidarFilter(false);
        }
    }

    const getList = async () => {
        // Sempre chama refreshListAndamento quando getList é acionado pelo OrderBy,
        // garantindo uma nova chamada à API. A ordenação local será então aplicada a esses dados.
        if (statusIdMenu) {
            refreshListAndamento(0, typesComission[selectTabType]?.id);
        }
    };

    return (
        <>
            <div className="comission-container">
                {!!typesComission?.[1] && 
                    <Tabs 
                        value={selectTabType} 
                        onChange={handleTab} 
                        // className={`tabs-container ${selectTabType >= 2 ? 'hidden-next' : 'hidden-prev'}`} 
                        // className={`tabs-container`}
                        style={{backgroundColor: '#fff', borderBottom: '1px solid #E0E7EB'}}
                        aria-label="icon label scrollable tabs"
                        variant="scrollable"
                        scrollButtons="auto"
                        // allowScrollButtonsMobile
                        sx={{
                            '& .MuiTabs-scrollButtons': {
                                '&.Mui-disabled': {
                                    opacity: 0.3
                                }
                            }
                        }}
                    >
                        {typesComission.map((tab, index) => (
                            <Tab key={index} label={tab.label} id={tab.key} style={{height: '64px'}}/>
                        ))}
                    </Tabs>
                }

                <div className="filters-container">
                    <ButtonComponent size="medium" variant="text" label="Buscar" startIcon={<MagnifyingGlassIcon />} onClick={() => setFilterAdressActive(true)} />
                    {/* <OrderBy
                        setSelectOrders={setSelectOrder}
                        selectOrders={selectOrder}
                        returnList={returnList}
                        dataLiberacao
                        valorComissao
                    /> */}

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

                    <AutoCompleteMobile 
                        modalOpen={filterAdressActive} 
                        setModalOpen={setFilterAdressActive}
                        options={listaEnderecos} 
                        value={adressFilter.endereco} 
                        onChange={handleFilterEndereco} 
                        validarFilter={validarFilter} 
                        onBlurFilter={onBlurFilter}
                    />
                </div>

                <ListComission list={listProcess} setSelectProcess={setSelectProcess} listagemUltimaComissao={listagemUltimaComissao} statusIdMenu={statusIdMenu} setStatusIdMenu={setStatusIdMenu} />
            </div>
        </>
    )
}