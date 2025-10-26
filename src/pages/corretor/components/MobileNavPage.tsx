// MODELO DE MENU FOOTER PARA MOBILE DAS URLS INTERNAS DE INVESTIMENTO E COMISSÃO (PARCELA)
import React, {useState, useEffect} from 'react'
import { InicialFooterTabType } from "@/interfaces/Corretores";
import { CurrencyDollarIcon, HomeIcon, LifebuoyIcon, WalletIcon } from "@heroicons/react/24/solid";
import { Tab, Tabs } from '@mui/material/';
import { useRouter } from 'next/router';

type IProps = {
    slug?: string | string[] | undefined
}

export default function MobileNavPage({slug}: IProps) {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState(0);
    const [tabs, setTabs] = useState<InicialFooterTabType[]>([
        { id: 0, label: "Principal", icon: <HomeIcon width={20} /> },
        { id: 1, label: "Comissão", icon: <CurrencyDollarIcon width={20} /> },
        { id: 2, label: "Investimento", icon: <WalletIcon width={20} /> },
        { id: 3, label: "Ajuda", icon: <LifebuoyIcon width={20} /> },
    ]);

    useEffect(() => {
        // Prioriza o slug para definir a aba ativa
        if (slug === 'parcela') {
            setSelectedTab(1);
            return;
        }
        if (slug === 'investimento') {
            setSelectedTab(2);
            return;
        }

        // Se o slug não definir a aba, usa o valor salvo na sessão
        const openMenu = sessionStorage.getItem('comissao_menu');
        const tabIndex = parseInt(openMenu || '0', 10);

        // Garante que o valor está dentro dos limites das abas existentes
        if (tabIndex >= 0 && tabIndex < tabs.length) {
            setSelectedTab(tabIndex);
        } else {
            setSelectedTab(0);
        }
    }, [slug]); // Executa apenas no início e quando o slug mudar

    const handleTabClick = (value: number) => {
        setSelectedTab(value);
        sessionStorage.setItem('comissao_menu', String(value));
        
        if(value !== 1){
            sessionStorage.removeItem('comissao_type_menu');
            sessionStorage.removeItem('comissao_menu_status');
        }
        
        router.push('/corretor/');
    };

    return (
        <div className="footer-tabs">
            <Tabs value={selectedTab} className="tabs-container" aria-label="icon label tabs">
                {tabs?.map((tab, index) => (
                    <Tab key={index} icon={tab.icon} label={tab.label} onClick={() => handleTabClick(index)} />
                ))}
            </Tabs>
        </div>
    )
}
