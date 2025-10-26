import React, { Dispatch, ReactComponentElement, ReactElement, SetStateAction, useEffect, useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ButtonSalvarSair from '@/components/ButtonSalvarSair';
import Button from '@/components/ButtonComponent';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Avatar, Chip, Skeleton } from '@mui/material';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import ImovelDataType from '@/interfaces/Imovel/imovelData';
import Pessoa from '@/interfaces/Users/userData';
import { DadosProcessType } from '@/interfaces/Financeiro/Status';

interface HeaderProps {
    imovel?: ImovelDataType | DadosProcessType,
    urlVoltar?: string,
    onVoltar?: () => void,
    tabs?: headerTabsType
    setTabs?: (tabs: headerTabsType | {}) => void
    disableTabs?: boolean
    FootButton?: React.ElementType
    salvarSair?: () => void
    gerente?: Pessoa
    responsavel?: Pessoa | { name: string }
    Menu?: () => JSX.Element
}

type tabsType = {
    label: string,
    active: boolean,
}

interface headerTabsType {
    tabs: tabsType[],
    selectTab: number,
}

export default function Header(props: HeaderProps) {
    const { imovel, urlVoltar, tabs, setTabs, disableTabs, FootButton, salvarSair, gerente, onVoltar, Menu, responsavel } = props;
    // const user = props.user || '';
    const [userName, setUserName] = useState<string | null>();
    const router = useRouter();
    
    const nomeGerente = gerente?.name || (imovel as DadosProcessType)?.gerente_name;
    const lojaGerente = gerente?.loja?.data[0]?.nome || (imovel as DadosProcessType)?.loja_name || '';
    const nomesPagamento: any = (imovel as ImovelDataType)?.informacao?.forma_pagamento_nome?.split(',');

    const nomeResponsavel = responsavel?.name || (imovel as DadosProcessType)?.pos_venda_name || '';

    useEffect(() => {
        setUserName(localStorage.getItem('nome_usuario'));
    }, []);
    console.log(nomesPagamento)

    const handleTab = (e: React.SyntheticEvent<Element, Event>, value: number) => {
        if (setTabs) {
            setTabs({ ...tabs, selectTab: value });
        }
    };

    return (
        <div className="header-page">
            <div className="content">
                <div className="nav">
                    {!!urlVoltar ?
                        <Button
                            label="Voltar"
                            name="minimal"
                            size="medium"
                            variant="text"
                            id='btn-back'
                            startIcon={<ArrowBackIcon className="icon icon-left" />}
                            // onClick={() => onVoltar ? onVoltar() : router.push(urlVoltar)}
                            onClick={() => onVoltar ? onVoltar() : router.back()}
                        />
                        :
                        salvarSair && <Button
                            label="Salvar e sair"
                            size="medium"
                            variant="outlined"
                            name='salvar-sair'
                            startIcon={<ArrowLeftOnRectangleIcon className="icon icon-left" />}
                            onClick={() => salvarSair()}
                        />
                    }

                </div>

                <section className='container-info'>

                    <div className="info">
                        <h3></h3>

                        <div className="address">
                            <div className="row">
                                <LocationOnIcon className="icon-header" id="map-ico" />
                                {imovel?.logradouro ? <span data-testid="header-state">{imovel.bairro || ""} - {imovel.cidade || ""}</span> : <Skeleton width={180} animation="wave" />}
                            </div>
                            <div className="row">
                                {imovel?.logradouro ?
                                    <span data-testid="header-adress">
                                        {(imovel.logradouro || "") + ', ' + (imovel.numero || '') + ' ' + (imovel.unidade && '/ ' + imovel.unidade + ' ' || '') + (imovel.complemento && '/ ' + imovel.complemento || '')}
                                    </span>
                                    : <Skeleton width={380} animation="wave" />
                                }

                                <div className="tags">
                                    {
                                        (imovel as ImovelDataType)?.informacao?.forma_pagamento_nome &&
                                            nomesPagamento?.map((pagamento: any) =>
                                                <>
                                                    <Chip className='chip green' label={pagamento} />
                                                </>
                                            )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {nomeResponsavel && <div className='gerente-container'>
                        <Avatar sx={{ width: 67, height: 67, bgcolor: '' }} alt={nomeResponsavel} />

                        <div className="gerente-info">
                            <p className="funcao">Pós-venda</p>
                            <p className="name">{`${nomeResponsavel}`}</p>
                        </div>
                    </div>}

                    {nomeGerente && <div className='gerente-container'>
                        <Avatar sx={{ width: 67, height: 67, bgcolor: '' }} alt={nomeGerente} />

                        <div className="gerente-info">
                            <p className="funcao">Gerente</p>
                            <p className="name">{`${nomeGerente}`}</p>
                            <p className="local">{`${lojaGerente}`}</p>
                        </div>
                    </div>}
                </section>

                <div className='tabs-buttons'>
                    {!!tabs &&
                        <div className='tab-menu'>
                            <Tabs value={tabs.selectTab} onChange={handleTab} className='' >
                                {tabs.tabs.map((item, index) => (
                                    <Tab
                                        key={index}
                                        label={item.label}
                                        id={index.toString()}
                                        className={item.active ? 'active tab' : 'hidden tab'}
                                        iconPosition="start"
                                        disabled={disableTabs}
                                    />
                                ))}
                            </Tabs>
                            {Menu && Menu()}
                        </div>
                    }

                    {FootButton && <FootButton />}
                </div>
            </div>
        </div>
    )
}