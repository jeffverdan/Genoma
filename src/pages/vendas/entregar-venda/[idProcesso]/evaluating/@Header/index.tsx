import React, { Dispatch, ReactComponentElement, ReactElement, ReactNode, SetStateAction, useEffect, useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ButtonSalvarSair from '@/components/ButtonSalvarSair';
import Button from '@/components/ButtonComponent';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Chip, Skeleton } from '@mui/material';

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
    title?: string | ReactNode,
    tabs?: headerTabsType
    setTabs?: (tabs: headerTabsType | {}) => void
    disableTabs?: boolean
    quantConflitos?: number
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
    const { imovel, urlVoltar, urlSair, title, tabs, setTabs, disableTabs, quantConflitos } = props;
    // const user = props.user || '';
    const [userName, setUserName] = useState<string | null>();
    const router = useRouter();
    const pageUrl = router.asPath;
    const [removeBackBtn, setRemoveBackBtn] = useState(false);

    const removeBack = () => {
        const splitPageUrl: any[] = pageUrl.split('/');
        if (splitPageUrl[4] === 'checkout') setRemoveBackBtn(true);
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
                    {/* {urlVoltar ?
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

                    {!!urlSair && <ButtonSalvarSair url={urlSair} />} */}
                </div>

                <div className="info">
                    <div className='title-container'>
                        <h3 className="bold">{title}</h3>
                        {!!quantConflitos && <Chip className='chip red' label={quantConflitos + (quantConflitos > 1 ? ' correções' : ' correção')} />}
                    </div>

                    {!!imovel &&
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
                    }
                </div>
            </div>
        </div>
    )
}