import React, { useState, useEffect, ReactElement } from 'react';
import { GetServerSideProps } from 'next';

import getProcesso from '@/apis/getProcesso';
import HeadSeo from '@/components/HeadSeo';
import Header from '@/components/GG_Gerentes/Header';
import imovelDataInterface from '@/interfaces/Imovel/imovelData'

import { RocketLaunch } from '@mui/icons-material';
import { CurrencyDollarIcon, HomeModernIcon } from '@heroicons/react/24/solid';
import BuyerIco from '@/images/Buyer_ico';
import SellerIco from '@/images/Seller_ico';
import Rank from './@ResumoContents/@Rank';
import ResumoImovel from './@ResumoContents/@Imovel';
import ResumoPessoa from './@ResumoContents/@Pessoa';
import ResumoComissao from './@ResumoContents/@Comissao';
// import SwipeableViews from 'react-swipeable-views';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import ButtonComponent from '@/components/ButtonComponent';
import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import { HiCurrencyDollar, HiHome, HiPencil } from 'react-icons/hi2';
import { useRouter } from 'next/router';
import TypePessoa from '@/interfaces/Users/userData';

type tabs = {
  label: string,
  icon: ReactElement
}

interface headerTabsType {
  tabs: tabs[],
  selectTab: number,
};

const ResumoVenda = ({ idProcesso }: { idProcesso: any }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imovelData, setImovelData] = useState<imovelDataInterface>({});
  const [headerTabs, setHeaderTabs] = useState<headerTabsType>({
    tabs: [
      { label: "Pontuação", icon: <RocketLaunch /> },
      { label: "Imóvel", icon: <HomeModernIcon height={20} /> },
      { label: "Vendedores", icon: <SellerIco height={20} /> },
      { label: "Compradores", icon: <BuyerIco height={20} /> },
      { label: "Comissão", icon: <CurrencyDollarIcon height={20} /> },
    ],
    selectTab: 0
  })

  const realocandoRepresentantes = (oldValue: TypePessoa[]) => {
    // ATIVAR QUANDO QUISER SEPARAR OS REPRESENTANTES IGUAL É FEITO NO "DETALHES"
    const newValue: TypePessoa[] = []

    oldValue?.forEach(e => {
        newValue.push(e);
        e.representante_socios?.data.forEach(r => {
          r.vinculo_empresa = {
            razao_social: e.razao_social || '',
            id: Number(e.id),
            nome_fantasia: e.nome_fantasia || '',
        }
            newValue.push(r);
        });
    });
    return newValue;
};

  const getImovelData = async () => {
    setLoading(true);

    const data = await getProcesso(idProcesso, router) as any;
    if (data) {      
      // ATIVAR QUANDO QUISER SEPARAR OS REPRESENTANTES IGUAL É FEITO NO "DETALHES"
      // data.vendedores = realocandoRepresentantes(data.vendedores || []);
      // data.compradores = realocandoRepresentantes(data.compradores || []);
      setImovelData(data as imovelDataInterface);
    }
    setLoading(false);
  };

  useEffect(() => {
    getImovelData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTab = (value: number) => {
    if (headerTabs) {
      setHeaderTabs({ ...headerTabs, selectTab: value });
    }
  };

  const FootButton = () => {
    const [anchorMenu, setAnchorMenu] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorMenu);

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
      setAnchorMenu(null);
    };

    const handleMenu = (e: string) => {      
      router.push(`/vendas/gerar-venda/${imovelData?.id}/dashboard/${e}`);      
    };

    console.log(imovelData)

    return (
      <div className='header-button-editar'>
      {
        imovelData.envelope_id === '' || imovelData.envelope_id === null && 
        <ButtonComponent 
          size={'large'} 
          variant={'text'} 
          startIcon={<HiPencil size={20} />}
          label={'Editar dados'}
          onClick={handleOpenMenu}
        />
      }
      <Menu
        id="basic-menu"
        anchorEl={anchorMenu}
        className='header-button-editar'
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <p className='menu-title'>EDITAR DADOS</p>
        <MenuItem onClick={() => handleMenu('imovel')}><ListItemIcon> <HiHome size={20} /> </ListItemIcon>  Imóvel </MenuItem>
        <MenuItem onClick={() => handleMenu('vendedores')}> <ListItemIcon> <SellerIco height={20} /> </ListItemIcon>  Vendedores </MenuItem>
        <MenuItem onClick={() => handleMenu('compradores')}> <ListItemIcon> <BuyerIco height={20} /> </ListItemIcon>  Compradores </MenuItem>
        <MenuItem onClick={() => handleMenu('comissao')}> <ListItemIcon> <HiCurrencyDollar size={20} />  </ListItemIcon> Comissão </MenuItem>
      </Menu>
      </div>
    )
  }

  return (
    <>
      <HeadSeo titlePage={"Resumo da Venda"} description='Resumo da venda' />
      <Header
        imovel={imovelData}
        urlVoltar={`/vendas/entregar-venda/${idProcesso}/`}
        // urlSair={'/vendas'}
        title={'saiba mais sobre a sua pontuação'}
        tabs={headerTabs}
        disableTabs={loading}
        setTabs={setHeaderTabs as (tabs: headerTabsType | {}) => void}
        FootButton={FootButton}
      />
      <SwipeableViews
        axis={'x'}
        index={headerTabs.selectTab}
        onChangeIndex={handleTab}
      >
        {headerTabs.tabs.map((tab, index) => (
          <div key={index} hidden={index != headerTabs.selectTab}>
            {/* {tab.page} */}
            {headerTabs.selectTab === 0 && <Rank imovelData={imovelData} loading={loading} />}
            {headerTabs.selectTab === 1 && <ResumoImovel imovelData={imovelData} />}
            {headerTabs.selectTab === 2 && <ResumoPessoa imovelData={imovelData} pessoa='vendedores' />}
            {headerTabs.selectTab === 3 && <ResumoPessoa imovelData={imovelData} pessoa='compradores' />}
            {headerTabs.selectTab === 4 && <ResumoComissao imovelData={imovelData} />}
          </div>
        ))}
      </SwipeableViews>
    </>
  )
}

// EXECUTA ANTES DO DASHBOARD
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { idProcesso } = context.params as { idProcesso: string };
  return { props: { idProcesso } };
};

export default ResumoVenda;