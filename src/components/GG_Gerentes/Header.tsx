import React, { Dispatch, ReactComponentElement, ReactElement, SetStateAction, useEffect, useState } from 'react';
import InputCodImovel from '@/components/Vendas/InputCodImovel';
import Mapa from '@/components/Vendas/Mapa';
import VendasContext from '@/context/VendasContext';
import { MyImovel } from '@/interfaces/Imovel';
import ButtonBack from '@/components/ButtonBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ButtonSalvarSair from '@/components/ButtonSalvarSair';
import Button from '@/components/ButtonComponent';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Skeleton } from '@mui/material';

interface HeaderProps {
    imovel: {
        bairro?: string
        cidade?: string
        logradouro?: string
        numero?: string
        complemento?: string
        unidade?: string
        type?: 'vendedores' | 'compradores'
    }
    urlVoltar?: string,
    urlSair?: string,
    title?: string,
    tabs?: headerTabsType
    setTabs?: (tabs: headerTabsType | {}) => void
    disableTabs?: boolean
    FootButton?: React.ElementType
}

type tabsType = {
    label: string,
    disable?: boolean,
    icon?: ReactElement
}

interface headerTabsType {
    tabs: tabsType[],
    selectTab: number,
}

export default function Header(props: HeaderProps) {
    const { imovel, urlVoltar, urlSair, title, tabs, setTabs, disableTabs, FootButton } = props;
    // const user = props.user || '';
    const [userName, setUserName] = useState<string | null>();
    const router = useRouter();
    const pageUrl = router.asPath;
    const [removeBackBtn, setRemoveBackBtn] = useState(false);

    const removeBack = () => {
        const splitPageUrl: any[] = pageUrl.split('/');   
        if(splitPageUrl[4] === 'checkout') setRemoveBackBtn(true);
    }

    useEffect(() => {
        setUserName(localStorage.getItem('nome_usuario'));
        removeBack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTab = (e: React.SyntheticEvent<Element, Event>, value: number) => {
        if (setTabs) {
            setTabs({ ...tabs, selectTab: value });
        }
    };

    return (
        <div className="header-page">
            <div className="content">
                <div className="nav">
                    {urlVoltar ?
                        <Button
                            label="Voltar"
                            name="minimal"
                            size="medium"
                            variant="text"
                            id='btn-back'
                            startIcon={<ArrowBackIcon className="icon icon-left" />}
                            onClick={() => router.push(urlVoltar)}
                        />
                        :
                        <div></div>
                    }

                    {!!urlSair && <ButtonSalvarSair url={urlSair} />}
                </div>

                <div className="info">
                    {title
                        ? (userName ? <h3 className="bold">{!!userName && userName + ", "}{title}</h3> : <Skeleton width={380} animation="wave" />)
                        : <h3></h3>
                    }

                    <div className="address">
                        <div className="row">
                            <LocationOnIcon className="icon-header" id="map-ico" />
                            {imovel.logradouro ? <span data-testid="header-state">{imovel.bairro || ""} - {imovel.cidade || ""}</span> : <Skeleton width={180} animation="wave" />}
                        </div>
                        <div className="row">
                            {imovel.logradouro ?
                                <span data-testid="header-adress">
                                    {(imovel.logradouro || "") + ', ' + (imovel.numero || '') + ' ' + (imovel.unidade && '/ ' + imovel.unidade + ' ' || '') + (imovel.complemento && '/ ' + imovel.complemento || '')}
                                </span>
                                : <Skeleton width={380} animation="wave" />
                            }
                        </div>
                    </div>
                </div>
                <div className='tabs-buttons'>
                    {!!tabs &&
                        <div className='tab-menu'>
                            <Tabs value={tabs.selectTab} onChange={handleTab} className='' >
                                {tabs.tabs.map((item, index) => {
                                    if(!item.disable) return (
                                    <Tab
                                        key={index}
                                        label={item.label}
                                        id={index.toString()}
                                        className={tabs.selectTab === index ? 'check' : 'uncheck'}
                                        iconPosition="start"
                                        icon={item.icon}
                                        disabled={disableTabs}
                                    />
                                )})}
                            </Tabs>
                        </div>
                    }                                      
                    {FootButton && <FootButton />}
                </div>
            </div>
        </div>
    )
}