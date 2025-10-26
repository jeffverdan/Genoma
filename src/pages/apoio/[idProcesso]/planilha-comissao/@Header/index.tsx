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
import { DadosProcessoType } from '@/interfaces/Apoio/planilhas_comissao';

interface HeaderProps {
    imovel: DadosProcessoType | undefined
    urlVoltar?: string,
    onVoltar?: () => void,
    urlSair?: string,
    title?: string,
    tabs?: headerTabsType
    setTabs?: (tabs: headerTabsType | {}) => void
    disableTabs?: boolean
    FootButton?: React.ElementType
    salvarSair?: () => void
    gerente?: Pessoa
    posVenda?: Pessoa
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
    const { imovel, urlVoltar, urlSair, title, tabs, setTabs, disableTabs, FootButton, salvarSair, gerente, onVoltar, posVenda } = props;
    // const user = props.user || '';
    const [userName, setUserName] = useState<string | null>();
    const router = useRouter();

    useEffect(() => {
        setUserName(localStorage.getItem('nome_usuario'));
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
                        <h4 className='title-apoio'>
                            {userName ? userName + ', v' : 'V'}
                            eja suas planilhas de comissão de vendas.
                        </h4>

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

                            </div>
                        </div>
                    </div>
                    <div className='avatares-container'>
                        {imovel?.pos_venda_id && <div className='gerente-container'>
                            <Avatar alt={imovel?.pos_venda_name} />

                            <div className="gerente-info">
                                <p className="funcao">PÓS-VENDA</p>
                                <p className="name">{`${imovel?.pos_venda_name || '---'}`}</p>
                            </div>
                        </div>}

                        {imovel?.gerente_id && <div className='gerente-container'>
                            <Avatar alt={imovel?.gerente_name} />

                            <div className="gerente-info">
                                <p className="funcao">Gerente</p>
                                <p className="name">{`${imovel?.gerente_name || '---'}`}</p>
                                <p className="local">{`${imovel?.loja_name}`}</p>
                            </div>
                        </div>}
                    </div>
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
                                        className={item.active ? 'active' : 'hidden'}
                                        iconPosition="start"
                                        disabled={disableTabs}
                                    />
                                ))}
                            </Tabs>
                        </div>
                    }

                    {FootButton && <FootButton />}
                </div>
            </div>
        </div>
    )
}