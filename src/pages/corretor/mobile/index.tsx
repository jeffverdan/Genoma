import { useEffect, useState } from "react";
import InicialOnboarding from "./@Components/InicialOnboarding";
import FooterTabs from "./@Components/FooterTabs";
import { CurrencyDollarIcon, HomeIcon, LifebuoyIcon, WalletIcon } from "@heroicons/react/24/solid";
import { InicialFooterTabType, ItemListRecentsType, listAndamentoType, QuestionsType, UrlsAnunciosType, ReturnTypeOpcoes, ValoresProducao } from "@/interfaces/Corretores";
import Principal from "./@Principal";
import SwipeableViews from "react-swipeable-views-react-18-fix";
import Comissao from "./@Comissao";
import Ajuda from "./@Ajuda";
import ultimasComissoesCorretores from "@/apis/ultimasComissoesCorretores";
import getOpcoesCorretores from "@/apis/getOpcoesCorretores";
import Investimento from "./@Investimento";
import FlameIcon from "@/images/FlameIcon";
import HotSteamIcon from "@/images/HotSteamIcon";
import SnowflakeIcon from "@/images/SnowflakeIcon";
import { TabsInvestimentoType } from "@/interfaces/Corretores/investimento";
import PostListaOpcoes from "@/apis/postListaOpcoes";
import postValoresComissaoPorStatus from "@/apis/postValoresComissaoPorStatus";
import converTerParaReal from "@/functions/converterParaReal";

export default function MobilePage() {
  const [inicialAcess, setInicialAcess] = useState<boolean>(false); // FALSE DESATIVA AS ONBOARDINGS
  const [tabs, setTabs] = useState<InicialFooterTabType[]>([
    { id: 0, label: "Principal", icon: <HomeIcon width={20} /> },
    { id: 1, label: "Comissão", icon: <CurrencyDollarIcon width={20} /> },
    { id: 2, label: "Investimento", icon: <WalletIcon width={20} /> },
    { id: 3, label: "Ajuda", icon: <LifebuoyIcon width={20} /> },
  ]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectTabType, setSelectTabType] = useState(0);

  const [loading, setLoading] = useState(true);
  const [listAndamento, setListAndamento] = useState<listAndamentoType>({
    list: [],
    valorTotal: "-----"
  });
  const [loadingConcluidos, setLoadingConcluidos] = useState(true);
  const [listConcluidos, setListConcluidos] = useState<listAndamentoType>({
    list: [],
    valorTotal: "-----"
  });
  const [loadingCancelados, setLoadingCancelados] = useState(true);
  const [listCancelados, setListCancelados] = useState<listAndamentoType>({
    list: [],
    valorTotal: "-----"
  });

  const [valoresProducao, setValoresProducao] = useState<ValoresProducao[]>([
      {id: '', label: 'Valor total', status: '', style: '', valor: '', qtd: '0', endereco: []},
      {id: 9, label: 'Em Andamento', status: 'andamento', style: 'yellow600', valor: '', qtd: '0', endereco: []},
      {id: 10, label: 'Liberado', status: 'liberado', style: 'green500', valor: '', qtd: '0', endereco: []},
      {id: 11, label: 'Solicitado', status: 'solicitado', style: 'primary500', valor: '', qtd: '0', endereco: []},
      {id: 12, label: 'Em Transferência', status: 'transferencia', style: 'green500', valor: '', qtd: '0', endereco: []},
      // {id: 14, label: 'Concluído', status: 'concluido', style: 'green500', valor: '', qtd: '0', endereco: []},
      {id: 13, label: 'Concluído', status: 'concluido', style: 'green500', valor: '', qtd: '0', endereco: []}, // ID 13 Transferido mas exibindo como Concluído
      {id: 16, label: 'Cancelado', status: 'cancelado', style: 'red500', valor: '', qtd: '0'},
  ])
  const [listagemUltimaComissao, setListagemUltimaComissao] = useState<ItemListRecentsType[]>([]);

  // ABAS COMISSÃO
  const [selectTabComissao, setSelectTabComissao] = useState<number>(0);
  const [typesComission] = useState([
      // { label: 'Produção', key: 'andamento' },
      { id: 10, label: 'Liberado', key: 'liberado' },
      { id: 11, label: 'Solicitado', key: 'solicitado' },
      { id: 12, label: 'Em transferência', key: 'transferencia' },
      { id: 9, label: 'Em andamento', key: 'andamento' },
      // { id: 14, label: 'Concluídos', key: 'concluidos' },
      { id: 13, label: 'Concluído', key: 'concluidos' }, // ID 13 Transferido mas exibindo como Concluído
      { id: 16, label: 'Cancelado', key: 'cancelados' },
      // { label: 'Cancelados', key: 'cancelados' },
      // { label: 'Sacado', key: 'sacado' },
  ]);

  // ABAS INVESTIMENTO
  const [selectTabInvest, setSelectTabInvest] = useState<number>(0);
  const [tabsInvestimento, setTabsInvestimento] = useState<TabsInvestimentoType[]>([
    { label: 'Carteira', value: 0, color: '#FFB74D', chipColor: 'yellow', icon: <WalletIcon height={20} fill="#01988C" />, opcoes: 0, valor_total: '', list: [] },
    { label: 'Frio', value: 0, color: '#ACA9FF', chipColor: 'purple', icon: <SnowflakeIcon height={20} fill="#ACA9FF" />, opcoes: 0, valor_total: '', list: [] },
    { label: 'Morno', value: 0, color: '#74848B', chipColor: 'neutral', icon: <HotSteamIcon height={20} fill="#74848B" />, opcoes: 0, valor_total: '', list: [] },
    { label: 'Quente', value: 0, color: '#FF7878', chipColor: 'red', icon: <FlameIcon height={20} width={20} fill="#FF7878" />, opcoes: 0, valor_total: '', list: [] },
  ]);
  const [loadingInvestimento, setLoadingInvestimento] = useState(false);
  const [tabsInvestimentoSelected, setTabsInvestimentoSelected] = useState(0);

  const [selectProcess, setSelectProcess] = useState<ItemListRecentsType | null>(null);
  const [listProcess, setListProcess] = useState<ItemListRecentsType[]>([]);
  const [statusIdMenu, setStatusIdMenu] = useState<number>(0); // Status Liberado 

  const returnMenu = async () => {
    if(sessionStorage.getItem('prevPath') !== '/corretor/'){
      const comissaoMenuSession = (sessionStorage.getItem('comissao_menu') ? sessionStorage.getItem('comissao_menu') : '0');
      const comissaorMenuStatusSession = sessionStorage.getItem('comissao_menu_status') || '0';
      const comissaoTypeMenu = sessionStorage.getItem('comissao_type_menu') || '-1';
      const investimentosMenuSession = sessionStorage.getItem('investimento_menu_item') || '0';
      
      setSelectedTab(Number(comissaoMenuSession));
      setStatusIdMenu(Number(comissaorMenuStatusSession));
      setSelectTabType(Number(comissaoTypeMenu));
      setSelectTabInvest(Number(investimentosMenuSession));
    }
    else{
      setStatusIdMenu(0);
      setSelectTabType(0);
      setSelectTabInvest(0);
      sessionStorage.removeItem('comissao_menu');
      sessionStorage.removeItem('comissao_menu_status');  
      sessionStorage.removeItem('comissao_type_menu');
      sessionStorage.removeItem('investimento_menu_item');
    }
  }

  const getListsInvestimento = async () => {
    setLoadingInvestimento(true);
    const tabs = ['frio', 'morno', 'quente'];
    const promises = tabs.map(tab => PostListaOpcoes(tab));
    const results = await Promise.all(promises);
    tabs.forEach((tab, index) => {
      const tabData = results[index];
      localStorage.setItem(`list_investimento_${tab}`, JSON.stringify(tabData || []));
      if (tabData) {
        const updatedTab: TabsInvestimentoType = {
          ...tabsInvestimento[index + 1],
          list: tabData || []
        };
        tabsInvestimento[index + 1] = updatedTab;
      }
    });
  };

  const getListAndamento = async (limite?: number, status?: number) => {
    setListagemUltimaComissao([]);
    setLoading(true);
    const filtersLocal = localStorage.getItem('filter_endereco') || '';
    
    let dadosEndereco = {
      logradouro: '',
      numero: '',
      unidade: '',
      complemento: '',
    }
    
    const tipo = 'mobile';
    const page = 0;
    const comissaorMenuStatusSession = sessionStorage.getItem('comissao_menu_status') || '0';
    const dataStatus = Number(comissaorMenuStatusSession) ?? (Number(comissaorMenuStatusSession) > 0 ? status : statusIdMenu);
    // const data: any = await postValoresComissaoPorStatus(status === undefined || status === 0 ? 5 : limite, status, dadosEndereco, page, tipo);
    // const dataLimite = (status === undefined || status === 0) || limite === undefined ? 5 : limite
    const dataLimite = dataStatus === 0 ? 5 : limite;
    console.log('DATALIMITE: ' , dataLimite)
    
    if (filtersLocal && dataStatus !== 0 /*status !== undefined*/) {
        const objFilters = JSON.parse(filtersLocal);
        dadosEndereco.logradouro = objFilters?.logradouro;
        dadosEndereco.numero = objFilters?.numero;
        dadosEndereco.unidade = objFilters?.unidade;
        dadosEndereco.complemento = objFilters?.complmento;
    }

    const dataEndereco = dataStatus === 0 ? '' : dadosEndereco
    const data: any = await postValoresComissaoPorStatus(dataLimite, dataStatus, dataEndereco, page, tipo);
    valoresProducao[0].valor = converTerParaReal(data?.valor_total); // Valor total
    data?.finance_statuses?.forEach((item: any) => {
      valoresProducao.forEach((valor) => {
        if (valor.id === item.id) {
          valor.valor = converTerParaReal(item.valor_receber);
          valor.qtd = item.qtd;
          valor.endereco = item.endereco;
        }
      });
    });
    setValoresProducao([...valoresProducao]);
    setListagemUltimaComissao(data?.listagem_ultima_comissao || []);
    if(/*status === undefined*/ dataStatus === 0) getListsInvestimento()
    setLoading(false);
  }

  const refreshListAndamento = async (limite?: number, status?: number) => {
    getListAndamento();
  };

  useEffect(() => {
    returnMenu();
  }, []);

  useEffect(() => {
    getListAndamento();
  }, []);

  return (
    <div className="corretor inicial-page">
      {inicialAcess
        ? <InicialOnboarding inicialAcess={inicialAcess} setInicialAcess={setInicialAcess} />
        :
        <>
          <SwipeableViews
            axis={'x'}
            index={selectedTab}
            disabled
            enableMouseEvents={false}
            ignoreNativeScroll={true}
            // onChangeIndex={handleTab}
            className='swipe-principal-container'
          >
            {tabs.map((tab, index) => (
              <div key={index} hidden={index != selectedTab} className="swipe-horizontal" >
                {index === 0 &&
                  <Principal
                    setSelectedTab={setSelectedTab}
                    listAndamento={listAndamento}
                    loading={loading}
                    listCancelados={listCancelados}
                    loadingCancelados={loadingCancelados}
                    listConcluidos={listConcluidos}
                    loadingConcluidos={loadingConcluidos}
                    setSelectTabType={setSelectTabType}
                    selectProcess={selectProcess}
                    setSelectProcess={setSelectProcess}
                    getListAndamento={getListAndamento}
                    listProcess={listProcess}
                    setListProcess={setListProcess}
                    valoresProducao={valoresProducao}
                    listagemUltimaComissao={listagemUltimaComissao}
                  />
                }
                {index === 1 && <Comissao
                  typesComission={typesComission}
                  selectTabType={selectTabType}
                  listAndamento={listAndamento}
                  setSelectTabType={setSelectTabType}
                  selectProcess={selectProcess}
                  setSelectProcess={setSelectProcess}
                  setSelectedTab={setSelectedTab}
                  // getListAndamento={getListAndamento}
                  listProcess={listProcess}
                  setListProcess={setListProcess}
                  listagemUltimaComissao={listagemUltimaComissao}
                  valoresProducao={valoresProducao}
                  returnList={getListAndamento}
                  refreshListAndamento={refreshListAndamento}
                  statusIdMenu={statusIdMenu}
                  setStatusIdMenu={setStatusIdMenu}
                />}
                {index === 2 && <Investimento
                  tabsInvestimento={tabsInvestimento}
                  selectTabInvest={selectTabInvest}
                  setTabsInvestimento={setTabsInvestimento}
                  setSelectTabInvest={setSelectTabInvest}
                  getListsInvestimento={getListsInvestimento}
                  loadingList={loadingInvestimento}
                  selectProcess={selectProcess}
                  setSelectProcess={setSelectProcess}
                  getListAndamento={refreshListAndamento}
                />}
                {index === 3 && <Ajuda />}
              </div>
            ))}
          </SwipeableViews>
          <FooterTabs
            tabs={tabs}
            setTabs={setTabs}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            setSelectTabInvest={setSelectTabInvest}
            setSelectProcess={setSelectProcess}
            listagemUltimaComissao={listagemUltimaComissao}
            returnList={getListAndamento}
            valoresProducao={valoresProducao}
            selectTabType={selectTabType}
            setSelectTabType={setSelectTabType}
            statusIdMenu={statusIdMenu}
            setStatusIdMenu={setStatusIdMenu}
          />
        </>
      }
    </div>
  );
}