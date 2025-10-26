

import { useEffect, useState } from 'react';
import Button from '@/components/ButtonComponent';
import { InicialFooterTabType, ItemListRecentsType, listAndamentoType, TYPES_COMISSION_TYPE, UrlsAnunciosType, ValoresProducao } from '@/interfaces/Corretores';
import { ArrowLeftIcon, CurrencyDollarIcon, HomeIcon, LifebuoyIcon, WalletIcon } from '@heroicons/react/24/solid';
import MenuLateral from './@componentes/MenuLateral';
import PainelPrincipal from './@componentes/PainelPrincipal';
import ultimasComissoesCorretores from '@/apis/ultimasComissoesCorretores';
import ListComissao from './@componentes/ListComissao';
import Ajuda from '../mobile/@Ajuda';
import apiUrlsAnuncios from "@/apis/apiUrlsAnuncios";
import DetalhesVenda from '../mobile/@Components/@DetalhesVenda';
import ButtonComponent from "@/components/ButtonComponent";
import Investimento from './@componentes/Investimento';
import SnowflakeIcon from '@/images/SnowflakeIcon';
import HotSteamIcon from '@/images/HotSteamIcon';
import FlameIcon from '@/images/FlameIcon';
import { TabsInvestimentoType } from '@/interfaces/Corretores/investimento';
import PostListaOpcoes from '@/apis/postListaOpcoes';
import { set } from 'cypress/types/lodash';
import postValoresComissaoPorStatus from '@/apis/postValoresComissaoPorStatus';
import converTerParaReal from '@/functions/converterParaReal';
import Megaphone from '@/images/MegafoneIcon';
import Oportunidades from './@componentes/Oportunidades';

const TYPES_COMISSION = [
  { id: 10, label: 'Liberado', key: 'liberado' },
  { id: 11, label: 'Solicitado', key: 'solicitado' },
  { id: 12, label: 'Em transferência', key: 'transferencia' },
  { id: 9, label: 'Em andamento', key: 'andamento' },
  // { id: 14, label: 'Concluídos', key: 'concluidos' },
  { id: 13, label: 'Concluído', key: 'concluidos' }, // ID 13 Transferido como Concluído
  { id: 16, label: 'Cancelado', key: 'cancelados' },
  // { label: 'Cancelados', key: 'cancelados' },
  // { label: 'Sacado', key: 'sacado' },
] as TYPES_COMISSION_TYPE;

type TEndereco = {
  id?: number;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
};

export default function CorretoresDesktop() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectTabTypeComission, setSelectTabTypeComission] = useState(0);
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
      {id: 16, label: 'Cancelado', status: 'cancelado', style: 'red500', valor: '', qtd: '0', endereco: []},
  ])
  const [listagemUltimaComissao, setListagemUltimaComissao] = useState<ItemListRecentsType[]>([]);
  const [statusIdMenu, setStatusIdMenu] = useState<number>(0); // Status Liberado 
  const [listaEnderecos, setListaEnderecos] = useState<ItemListRecentsType[]>([]);

  const [tabsInvestimento, setTabsInvestimento] = useState<TabsInvestimentoType[]>([
    { label: 'VGV', value: 0, color: '#FFB74D', chipColor: 'yellow', icon: undefined, opcoes: 0, valor_total: '', list: [] },
    { label: 'Frio', value: 0, color: '#ACA9FF', chipColor: 'purple', icon: <SnowflakeIcon height={20} fill="#ACA9FF" />, opcoes: 0, valor_total: '', list: [] },
    { label: 'Morno', value: 0, color: '#74848B', chipColor: 'neutral', icon: <HotSteamIcon height={20} fill="#74848B" />, opcoes: 0, valor_total: '', list: [] },
    { label: 'Quente', value: 0, color: '#FF7878', chipColor: 'red', icon: <FlameIcon height={20} width={20} fill="#FF7878" />, opcoes: 0, valor_total: '', list: [] },
  ]);
  const [loadingInvestimento, setLoadingInvestimento] = useState(false);
  const [tabsInvestimentoSelected, setTabsInvestimentoSelected] = useState(0);

  const [tabs, setTabs] = useState<InicialFooterTabType[]>([
    { id: 0, label: "Principal", icon: <HomeIcon width={20} /> },
    { id: 1, label: "Comissão", icon: <CurrencyDollarIcon width={20} />, submenu: true },
    { id: 2, label: "Investimento", icon: <WalletIcon width={20} />, submenu: true },
    { id: 3, label: "Oportunidades", icon: <Megaphone width={20} /> },
    { id: 4, label: "Ajuda", icon: <LifebuoyIcon width={20} /> },
  ]);

  const [selectProcess, setSelectProcess] = useState<ItemListRecentsType | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [backHeader, setBackHeader] = useState<boolean>(true);

  const [rows, setRows] = useState<[]>([])
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const returnMenu = async () => {
    if(sessionStorage.getItem('prevPath') !== '/corretor/'){
      setPage(localStorage.getItem('page') ? Number(localStorage.getItem('page')) : 1);
      
      const comissaoMenuSession = (sessionStorage.getItem('comissao_menu') ? sessionStorage.getItem('comissao_menu') : '0');
      const comissaorMenuStatusSession = sessionStorage.getItem('comissao_menu_status') || '0';
      const comissaoTypeMenu = sessionStorage.getItem('comissao_type_menu') || '-1';
      const investimentosMenuSession = sessionStorage.getItem('investimento_menu_item') || '0';
      setSelectedIndex(Number(comissaoMenuSession));
      setStatusIdMenu(Number(comissaorMenuStatusSession));
      setSelectTabTypeComission(Number(comissaoTypeMenu));
      setTabsInvestimentoSelected(Number(investimentosMenuSession));
    }
    else{
      setPage(1);
      localStorage.setItem('page', '1');

      setSelectedIndex(0);
      setStatusIdMenu(0);
      setSelectTabTypeComission(0);
      setTabsInvestimentoSelected(0);
      sessionStorage.removeItem('comissao_menu');
      sessionStorage.removeItem('comissao_menu_status');  
      sessionStorage.removeItem('comissao_type_menu');
      sessionStorage.removeItem('investimento_menu_item');
    }
  }

  const getListAndamento = async (limite?: number, status?: number) => {
    console.log('statusIdMenu: ', statusIdMenu)
    setListagemUltimaComissao([]);
    setLoading(true);
    const filtersLocal = localStorage.getItem('filter_endereco') || '';
    let dadosEndereco = {
      logradouro: '',
      numero: '',
      unidade: '',
      complemento: '',
    }

    const tipo = 'desktop';
    const localPage = Number(localStorage.getItem('page')) || 0;
    const dataLimite = (status === undefined || status === 0) || limite === undefined ? 5 : (limite ?? 0);
    const comissaorMenuStatusSession = sessionStorage.getItem('comissao_menu_status') || '0';
    const dataStatus = status ?? (Number(comissaorMenuStatusSession) > 0 ? Number(comissaorMenuStatusSession) : statusIdMenu);

    if (filtersLocal && dataStatus !== 0 /*status !== undefined*/) {
      const objFilters = JSON.parse(filtersLocal);
      dadosEndereco.logradouro = objFilters?.logradouro;
      dadosEndereco.numero = objFilters?.numero;
      dadosEndereco.unidade = objFilters?.unidade;
      dadosEndereco.complemento = objFilters?.complmento;
    }

    const dataEndereco = dataStatus === 0 ? '' : dadosEndereco;
    console.log('DATASTATUS: ', dataStatus)
    // const data: any = await postValoresComissaoPorStatus(dataLimite, dataStatus, dadosEndereco, page, tipo);
    const data: any = await postValoresComissaoPorStatus(dataLimite, dataStatus, dataEndereco, localPage, tipo);
    if (data) {
      setPage(localPage);
      setRows(data);
      setTotalPages(data.total_pagina);
      setTotalRows(data.total_solicitacoes_filtradas);      
    } else {
      setPage(1);
      setTotalPages(1);
      setTotalRows(0);
      setRows([]);
    }

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

    // const enderecosComissao = data?.finance_statuses?.find((d: any) => d.id === status || statusIdMenu)
    // console.log('DATA ENDEREÇO: ', enderecosComissao?.endereco)

    if(/*status === undefined*/ dataStatus === 0) getListsInvestimento()

    setLoading(false);
  }
  // console.log('VALOR PRODUÇÂO: ', valoresProducao)

  useEffect(() => {
    getListAndamento();
  }, []);

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
    setTabsInvestimento([...tabsInvestimento]); // Atualiza o estado para re-renderizar
    console.log("Lista Investimento: ", tabsInvestimento[1]);
    setLoadingInvestimento(false);
  };

  useEffect(() => {
    returnMenu();
  }, []);

  useEffect(() => {
    getListAndamento();
  }, [/*page*/]);

  const refreshListAndamento = async (limite?: number, status?: number) => {
    getListAndamento();
  };

  // console.log('SELECTPROCESS PAINEL: ', selectProcess)

  return (
    <>
      <div className='page-principal-container'>
        <>
            <MenuLateral
              tabs={tabs}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              listAndamento={listAndamento}
              listConcluidos={listConcluidos}
              listCancelados={listCancelados}
              TYPES_COMISSION={TYPES_COMISSION}
              tabsInvestimento={tabsInvestimento}
              setSelectTabTypeComission={setSelectTabTypeComission}
              selectTabTypeComission={selectTabTypeComission}
              tabsInvestimentoSelected={tabsInvestimentoSelected}
              setTabsInvestimentoSelected={setTabsInvestimentoSelected}
              listagemUltimaComissao={listagemUltimaComissao}
              setListagemUltimaComissao={setListagemUltimaComissao}
              returnList={getListAndamento}
              valoresProducao={valoresProducao}
              statusIdMenu={statusIdMenu} 
              setStatusIdMenu={setStatusIdMenu}
              page={page}
              setPage={setPage}
              listaEnderecos={listaEnderecos}
              setListaEnderecos={setListaEnderecos} 
            />

            {selectedIndex === 0 &&
              <PainelPrincipal
                setSelectProcess={setSelectProcess}
                selectProcess={selectProcess}
                returnList={getListAndamento}
                loading={loading}
                listAndamento={listAndamento}
                setSelectedIndex={setSelectedIndex}
                loadingCancelados={loadingCancelados}
                listCancelados={listCancelados}
                loadingConcluidos={loadingConcluidos}
                listConcluidos={listConcluidos}
                TYPES_COMISSION={TYPES_COMISSION}
                setSelectTabTypeComission={setSelectTabTypeComission}
                valoresProducao={valoresProducao}
                listagemUltimaComissao={listagemUltimaComissao}
                statusIdMenu={statusIdMenu} 
              />
            }
            {selectedIndex === 1 &&
              <ListComissao
                setSelectProcess={setSelectProcess}
                selectProcess={selectProcess}
                returnList={getListAndamento}
                refreshListAndamento={refreshListAndamento}
                listagemUltimaComissao={listagemUltimaComissao}
                setListagemUltimaComissao={setListagemUltimaComissao}
                valoresProducao={valoresProducao}
                loading={loading}
                listAndamento={listAndamento}
                listConcluidos={listConcluidos}
                listCancelados={listCancelados}
                setSelectedIndex={setSelectedIndex}
                TYPES_COMISSION={TYPES_COMISSION}
                setSelectTabTypeComission={setSelectTabTypeComission}
                selectTabTypeComission={selectTabTypeComission}
                statusIdMenu={statusIdMenu} 
                setStatusIdMenu={setStatusIdMenu}
                page={page}
                setPage={setPage}
                rows={rows}
                setRows={setRows}
                totalRows={totalRows}
                setTotalRows={setTotalRows}
                totalPages={totalPages}
                setTotalPages={setTotalPages}
                listaEnderecos={listaEnderecos}
                setListaEnderecos={setListaEnderecos} 
              />
            }
            {selectedIndex === 2 &&
              <Investimento
                loadingList={loadingInvestimento}
                tabsInvestimento={tabsInvestimento}
                setTabsInvestimento={setTabsInvestimento}
                setTabSelected={setTabsInvestimentoSelected}
                tabSelected={tabsInvestimentoSelected}
                setSelectProcess={setSelectProcess}
                selectProcess={selectProcess}
                listAndamento={listAndamento}
                setSelectedTab={setSelectedTab}
                getListAndamento={refreshListAndamento}
              />
            }
            {selectedIndex === 3 &&
              <Oportunidades />
            }
             {selectedIndex === 4 &&
              <Ajuda />
            }
          </>
      </div>
    </>
  )
}