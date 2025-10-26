import ButtonComponent from "@/components/ButtonComponent";
import FlameIcon from "@/images/FlameIcon";
import HotSteamIcon from "@/images/HotSteamIcon";
import SnowflakeIcon from "@/images/SnowflakeIcon";
import { WalletIcon } from "@heroicons/react/24/solid";
import { Tab, Tabs } from '@mui/material/';
import { useEffect, useState } from "react";
import { ReturnTypeOpcoes, listAndamentoType, ItemListRecentsType } from "@/interfaces/Corretores";
import GraficoPrincipal from "./@Components/@Graphics/GraficoPrincipal";
import GraficosTemps from "./@Components/@Graphics/GraficosTemps";
import { BarsArrowDownIcon, MagnifyingGlassIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { HiArrowPath } from "react-icons/hi2";
import { differenceInMinutes, format } from "date-fns";
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import ListComission from "./@Components/@ListaInvestimento";
import PostListaOpcoes from "@/apis/postListaOpcoes";
import LoadingList from './@Components/@LoadingList';
import DetalhesVenda from '../mobile/@Components/@DetalhesVenda';
import OrderBy from "@/components/OrderBy";
import AutoComplete from "@/components/AutoComplete";
import { DataFilter } from "@/interfaces/PosVenda/FiltroEndereco";
import { OptionData } from "@/components/AutoComplete/interface";
import AutoCompleteMobile from "@/components/AutoCompleteMobile";
import { KeyInvestimentoType, ListInvestimentoType, TabsInvestimentoType } from "@/interfaces/Corretores/investimento";
import getOpcoesCorretores from "@/apis/getOpcoesCorretores";
interface PropsType {
    // QUESTIONS: QuestionsType
    tabsInvestimento: any[],
    selectTabInvest: number;
    setSelectTabInvest: (e: number) => void;
    getListsInvestimento: () => void;
    loadingList: boolean;
    selectProcess: ItemListRecentsType | null
    setSelectProcess: (e: ItemListRecentsType | null) => void
    getListAndamento: () => void
    setTabsInvestimento: (e: TabsInvestimentoType[]) => void;
}

export default function Investimento({ loadingList, tabsInvestimento, selectTabInvest, setSelectTabInvest, getListsInvestimento, selectProcess, setSelectProcess, getListAndamento, setTabsInvestimento }: PropsType) {
    const [lastUpdated] = useState<Date | null>(new Date());
    const [timeDifference, setTimeDifference] = useState<string | null>("0 minutos");
    const [diferencaVgv, setDiferencaVgv] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);

    const [listAndamento, setListAndamento] = useState<listAndamentoType>({
        list: [],
        valorTotal: "-----"
    });

    // FILTRO ENDEREÇO
    const [filterAdressActive, setFilterAdressActive] = useState(false);
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

    const getList = async () => {
        const key = tabsInvestimento[selectTabInvest].label.toLowerCase() as KeyInvestimentoType;
        const list = JSON.parse(localStorage.getItem(`list_investimento_${key}`) || '[]') as ListInvestimentoType[];
        console.log(key, "List before filter:", list);

        const filteredList = list.filter((item) => {
            if (typeof adressFilter.endereco === 'string') {
                return item.logradouro.includes(adressFilter.endereco);
            } else if (adressFilter.endereco?.imovel_id) {
                return item.imovel_id === (adressFilter.endereco.imovel_id || item.imovel_id);
            } else if (adressFilter.endereco?.logradouro) {
                return item.logradouro.toLowerCase().includes(adressFilter.endereco.logradouro.toLowerCase());
            } else {
                return item;
            }
        });
        console.log(selectOrder);

        if (selectOrder.patch === 'valor_opcao') {
            filteredList.sort((a, b) => {
                const valorA = parseFloat(a.valor_anunciado.replace(/\./g, '').replace(',', '.'));
                const valorB = parseFloat(b.valor_anunciado.replace(/\./g, '').replace(',', '.'));
                console.log(valorA, valorB, "Valor A e B");
                return selectOrder.id === 1 ? (valorB - valorA) : (valorA - valorB);
            });
        }
        else if (selectOrder.patch === 'data_atualizacao') {
            filteredList.sort((a, b) => {
                // Converter data para formato YYYY-MM-DD para correta ordenação
                const dataA = a.data_atualizacao.includes('/') ? a.data_atualizacao.split('/').reverse().join('-') : a.data_atualizacao;
                const dataB = b.data_atualizacao.includes('/') ? b.data_atualizacao.split('/').reverse().join('-') : b.data_atualizacao;

                if (dataA !== dataB) {
                    // Ordena por data primeiro
                    return selectOrder.id === 1 ? dataB.localeCompare(dataA) : dataA.localeCompare(dataB);
                }

                // Se as datas forem iguais, ordena por valor
                const valorA = parseFloat(a.valor_anunciado.replace(/\./g, '').replace(',', '.'));
                const valorB = parseFloat(b.valor_anunciado.replace(/\./g, '').replace(',', '.'));
                return valorA - valorB;
            });
        }

        console.log("Filtered List:", filteredList);
        tabsInvestimento.forEach((tab, index) => {
            if (tab.label.toLowerCase() === key) {
                tabsInvestimento[index].list = filteredList;
            }
        })
        setTabsInvestimento([...tabsInvestimento]); // Atualiza o estado para re-renderizar               
    };

    useEffect(() => {
        console.log('selectTabInvest: ', selectTabInvest);
        getList();
    }, [selectTabInvest]);

    const handleTab = (event: React.SyntheticEvent, value: any) => {
        sessionStorage.setItem('investimento_menu_item', String(value));
        setSelectTabInvest(value);
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
        getList();
    };

    useEffect(() => {
        returnList();
    }, []);

    const returnList = async () => {
        setLoading(true);
        const list = await getOpcoesCorretores({ ano: '' });
        if (!!list) {
            console.log(list);

            setDiferencaVgv(Number(list?.diferenca_vgv))
            tabsInvestimento.forEach((tab, index) => {
                if (tab.label === 'Carteira') {
                    tabsInvestimento[index].opcoes = list.quantidade_total;
                    tabsInvestimento[index].valor_total = list.soma_total;
                } else if (tab.label === 'Frio') {
                    tabsInvestimento[index].value = Number(list.porcentagem_frio);
                    tabsInvestimento[index].opcoes = list.quantidade_frio;
                    tabsInvestimento[index].valor_total = list.valor_frio;
                } else if (tab.label === 'Morno') {
                    tabsInvestimento[index].value = Number(list.porcentagem_morno);
                    tabsInvestimento[index].opcoes = list.quantidade_morno;
                    tabsInvestimento[index].valor_total = list.valor_morno;
                } else if (tab.label === 'Quente') {
                    tabsInvestimento[index].value = Number(list.porcentagem_quente);
                    tabsInvestimento[index].opcoes = list.quantidade_quente;
                    tabsInvestimento[index].valor_total = list.valor_quente;
                }
            });
            setTabsInvestimento([...tabsInvestimento]); // Atualiza o estado para re-renderizar
        }
        console.log("Lista opcoes: ", list);
        setLoading(false);
    };

    return (
        <>
            <div className="investimento-container">
                <Tabs
                    value={selectTabInvest}
                    onChange={handleTab}
                    className={`tabs-container`}
                    variant="scrollable"
                    scrollButtons="auto"
                    // allowScrollButtonsMobile
                    aria-label="icon label scrollable tabs"
                    sx={{
                        '& .MuiTabs-scrollButtons': {
                            '&.Mui-disabled': {
                                opacity: 0.3
                            }
                        }
                    }}
                >
                    {tabsInvestimento?.map((tab, index) => (
                        <Tab key={index} label={tab.label} id={tab.label} icon={tab.icon} iconPosition="start" />
                    ))}
                </Tabs>

                {
                    selectTabInvest !== 0 ?
                        <div className="filters-container">
                            <ButtonComponent size="medium" variant="text" label="Buscar" startIcon={<MagnifyingGlassIcon />} onClick={() => setFilterAdressActive(true)} />
                            <OrderBy
                                setSelectOrders={setSelectOrder}
                                selectOrders={selectOrder}
                                returnList={getList}
                                dataAtualizacao
                                valorOpcao
                            />

                            <AutoCompleteMobile
                                modalOpen={filterAdressActive}
                                setModalOpen={setFilterAdressActive}
                                options={tabsInvestimento?.[selectTabInvest]?.list}
                                value={adressFilter?.endereco}
                                onChange={handleFilterEndereco}
                            />
                        </div>
                        :
                        ''
                }

                {
                    selectTabInvest === 0 &&
                    <>
                        <div className="title-container">
                            <h4>
                                {/* {`Olá, ${userData.name}!`}<br /> */}
                                Explore sua carteira de investimento e impulsione suas vendas.
                            </h4>
                        </div>

                        <div className="painel-investimento-m">
                            <div className="header-container">
                                <div className="title">
                                    <div className='atualizar-lista'>
                                        <ButtonComponent
                                            size={'medium'}
                                            variant={'text'}
                                            name={'atualizar-painel'}
                                            onClick={() => returnList()}
                                            label={'Atualizar painel'}
                                            endIcon={<HiArrowPath className={loading ? 'rotate' : ''} />}
                                        />
                                        <span className="subtitle">{lastUpdated ? `Há ${timeDifference}` : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }

                {
                    loading && selectTabInvest !== 0
                        ?
                        <LoadingList />
                        :
                        <>
                            <SwipeableViews
                                axis="x"
                                index={selectTabInvest}
                                onChangeIndex={handleTab}
                                className="swipe-container"
                            >
                                {tabsInvestimento?.map((tab, index) => (
                                    <div key={index}>
                                        {selectTabInvest === index && (
                                            <>
                                                {index === 0 && (
                                                    <div className="content-container">
                                                        <GraficoPrincipal
                                                            title="Carteira"
                                                            soma_total={tabsInvestimento[0]?.valor_total}
                                                            vgv={diferencaVgv}
                                                            quantidade_total={tabsInvestimento[0]?.opcoes}
                                                            DATA_CHART={tabsInvestimento?.filter(item => item.label !== 'Carteira')}
                                                        />
                                                        {tabsInvestimento
                                                            .filter((item) => item.label !== "Carteira")
                                                            .map((item, innerIndex) => (
                                                                <GraficosTemps
                                                                    key={innerIndex}
                                                                    index={innerIndex}
                                                                    icon={item.icon}
                                                                    chipColor={item.chipColor}
                                                                    opcoes={item.opcoes}
                                                                    label={item.label}
                                                                    value={item.value}
                                                                    color={item.color}
                                                                    valor_total={item.valor_total}
                                                                    setSelectTabInvest={setSelectTabInvest}
                                                                />
                                                            ))}
                                                    </div>
                                                )}
                                                {index > 0 && (
                                                    <ListComission
                                                        list={tabsInvestimento[selectTabInvest].list}
                                                        setSelectProcess={setSelectProcess}
                                                        typeList={tabsInvestimento[index].label.toLowerCase()}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </ SwipeableViews>
                        </>
                }
            </div>
        </>
    )
}