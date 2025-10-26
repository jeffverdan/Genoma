import ButtonComponent from "@/components/ButtonComponent";
import { differenceInMinutes, format } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HiArrowPath } from "react-icons/hi2";
import Single from "@/images/single.png";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CardValor from "../../mobile/@Components/@ListVendas/CardValorAccordion";
import { ItemListRecentsType, listAndamentoType, ReturnTypeOpcoes, TypeComissionsCorretores, TYPES_COMISSION_TYPE, UrlsAnunciosType } from "@/interfaces/Corretores";
import UltimasComissoes from "./@ElementosPainelPrincipal/TableUltimasComissoes";
import RecentQuestions from "../../mobile/@Components/@ListVendas/RecentesQuestions";
import { StarIcon } from "@heroicons/react/24/solid";
import { Tab, Tabs, Chip, Avatar } from '@mui/material/';
import getOpcoesCorretores from "@/apis/getOpcoesCorretores";
import GraficoPrincipal from "../../mobile/@Components/@Graphics/GraficoPrincipal";
import GraficosTemps from "../../mobile/@Components/@Graphics/GraficosTemps";
import { KeyInvestimentoType, ListInvestimentoType, TabsInvestimentoType } from "@/interfaces/Corretores/investimento";
import TableList from "./@ElementosInvestimento/TableList";
import AutoComplete from "@/components/AutoComplete";
import { DataFilter } from "@/interfaces/PosVenda/FiltroEndereco";
import { OptionData } from "@/components/AutoComplete/interface";

interface PropsType {
    loadingList: boolean;
    tabSelected: number;
    setTabSelected: (e: number) => void;
    tabsInvestimento: TabsInvestimentoType[];
    setTabsInvestimento: (e: TabsInvestimentoType[]) => void;
    setSelectProcess: ( e: ItemListRecentsType | null ) => void
    selectProcess: ItemListRecentsType | null
    listAndamento: listAndamentoType;
    setSelectedTab: (e: number) => void;
    getListAndamento: () => void;
}

export default function Investimento(props: PropsType) {
    const { tabSelected, setTabSelected, tabsInvestimento, setTabsInvestimento, loadingList, setSelectProcess, selectProcess, listAndamento, setSelectedTab, getListAndamento } = props;
    const [timeDifference, setTimeDifference] = useState<string | null>("0 minutos");
    const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
    const [loading, setLoading] = useState(false);
    const [diferencaVgv, setDiferencaVgv] = useState(0);
    // const [selectProcess, setSelectProcess] = useState<ListInvestimentoType | null>(null);
    // FILTRO ENDEREÇO
    const [adressFilter, setAdressFilter] = useState<DataFilter>({
        endereco: null,
    });

    // ORDENAÇÃO
    const orderInicialValue = { patch: '', id: 0 };
    const [selectOrder, setSelectOrder] = useState<{ patch: string, id: number }>(orderInicialValue);

    const returnList = async () => {
        setLoading(true);
        const list = await getOpcoesCorretores({ ano: '' });
        if (!!list) {
            console.log(list);

            setDiferencaVgv(Number(list?.diferenca_vgv))
            tabsInvestimento.forEach((tab, index) => {
                if (tab.label === 'VGV') {
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


    useEffect(() => {
        returnList();
    }, []);

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

    const handleTab = (event: React.SyntheticEvent, newValue: number) => {
        console.log("Tab changed to:", newValue);

        sessionStorage.setItem('investimento_menu_item', String(newValue));

        //Limpa os filtros
        setAdressFilter({ endereco: '' });

        setTabSelected(newValue);
    };

    useEffect(() => {
        getList();
    }, [tabSelected]);

    const handleFilterEndereco = (event: any, newValue: string | OptionData | null) => {
        const value = typeof newValue === 'string' ? { logradouro: newValue } : newValue;
        console.log(newValue);
        
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

    const getList = async () => {
        const key = tabsInvestimento[tabSelected].label.toLowerCase() as KeyInvestimentoType;
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
        if(selectOrder.patch === 'valor_opcao') {
            filteredList.sort((a, b) => {
                const valorA = parseFloat(a.valor_anunciado.replace(/\./g, '').replace(',', '.'));
                const valorB = parseFloat(b.valor_anunciado.replace(/\./g, '').replace(',', '.'));
                return selectOrder.id === 1 ? (valorB - valorA) : (valorA - valorB);
            });            
        }
        else if (selectOrder.patch === 'data_atualizacao') {
            filteredList.sort((a, b) => {
                // Converter data para formato YYYY-MM-DD para correta ordenação
                const dataA =  a.data_atualizacao.includes('/') ? a.data_atualizacao.split('/').reverse().join('-') : a.data_atualizacao;
                const dataB =  b.data_atualizacao.includes('/') ? b.data_atualizacao.split('/').reverse().join('-') : b.data_atualizacao;
            
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

    return (        
        <div className="painel-investimento">
            <div className="header-container">
                <div className="title">
                    <div className="icon">
                        <StarIcon width={20} />
                        <span>Investimento</span>
                    </div>
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

                <Tabs value={tabSelected} onChange={handleTab} className={`tabs-container`} aria-label="icon label tabs">
                    {tabsInvestimento?.map((tab) => (
                        <Tab key={tab.label} label={`${tab.label} ${tab.opcoes ? '('+ tab.opcoes +')' : ''}`} id={tab.label} icon={tab.icon} iconPosition="start" />
                    ))}
                </Tabs>
            </div>

            {tabSelected === 0 && <>
                <div className="cards icon-copy">
                    <Image src={Single} alt="Carteira VGV" width={20} height={20} />
                    <span>Explore sua carteira de investimento e impulsione suas vendas.</span>
                </div>

                <GraficoPrincipal
                    title="VGV"
                    // dataAtual={dataAtual}
                    soma_total={tabsInvestimento[0].valor_total}
                    quantidade_total={tabsInvestimento[0].opcoes}
                    DATA_CHART={tabsInvestimento.filter(item => item.label !== 'VGV')}
                    vgv={diferencaVgv}
                />

                <div className="graficos-container">
                    {tabsInvestimento.filter(item => item.label !== 'VGV').map((item, index) => (
                        <GraficosTemps
                            key={index}
                            index={index}
                            icon={item.icon}
                            chipColor={item.chipColor}
                            opcoes={item.opcoes}
                            label={item.label}
                            value={item.value}
                            color={item.color}
                            valor_total={item.valor_total}
                            setSelectTabInvest={setTabSelected}
                        />
                    ))}
                </div>
            </>
            }

            {(tabSelected && tabSelected) > 0 && (
                <>
                    <AutoComplete options={tabsInvestimento[tabSelected].list} value={adressFilter.endereco} onChange={handleFilterEndereco} />

                    <TableList
                        loading={loading}
                        setSelectProcess={setSelectProcess}
                        selectProcess={selectProcess}
                        list={tabsInvestimento[tabSelected].list}
                        getList={getList}
                        setSelectOrder={setSelectOrder}
                        selectOrder={selectOrder}
                    />
                </>
            )}

        </div>
    )
}