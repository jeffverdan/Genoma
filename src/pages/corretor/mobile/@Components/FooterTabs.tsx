import ButtonComponent from "@/components/ButtonComponent";
import { InicialFooterTabType, ItemListRecentsType, ValoresProducao } from "@/interfaces/Corretores";
import { Tab, Tabs } from '@mui/material/';
import { useState } from "react";

interface PropsType {
    tabs: InicialFooterTabType[]
    setTabs: (e: InicialFooterTabType[]) => void;
    selectedTab: number
    selectTabType: number;
    setSelectedTab: (e: number) => void;
    setSelectTabInvest: (e: number) => void
    setSelectProcess: (e: ItemListRecentsType | null) => void
    listagemUltimaComissao: ItemListRecentsType[]; // Lista de últimas comissões
    returnList: (limite?: number, status?: number) => void
    valoresProducao: ValoresProducao[]
    statusIdMenu?: number; // Status do menu
    setStatusIdMenu: (e: number) => void; // Função para atualizar o status do menu
    setSelectTabType: (e: number) => void; // Função para atualizar o selectTabType
}

export default function FooterTabs(props: PropsType) {
    const { tabs, setTabs, selectTabType, setSelectTabType, setSelectedTab, selectedTab, setSelectTabInvest, setSelectProcess, returnList, valoresProducao, statusIdMenu, setStatusIdMenu } = props;
    const handleTabInvest = () => {
        setSelectTabInvest(0);
        setSelectProcess(null);
    }

    const handleTab = (event: React.SyntheticEvent, value: any) => {
        console.log('event: ' , event)
        console.log('value: ', value)
        console.log('selectTabType: ', selectTabType)
        setSelectedTab(value);
        setSelectProcess(null);

        switch (selectTabType) {
            case 0:
                setStatusIdMenu(10) // Liberado
                break;

            case 1:
                setStatusIdMenu(11) // Solicitado
                break;

            case 2:
                setStatusIdMenu(12) // Em transferência
                break;
            
            case 3:
                setStatusIdMenu(9) // Em andamento
                break;

            case 4:
                setStatusIdMenu(13) // Concluídos
                break;

            case 5:
                setStatusIdMenu(16) // Cancelados
                break;
        
            default:
                break;
        }

        sessionStorage.setItem('comissao_menu', value);

        if(value > 1) {
            if(value === 2) {
                sessionStorage.setItem('investimento_menu_item', '0')
                sessionStorage.removeItem('comissao_type_menu');
                sessionStorage.removeItem('comissao_menu_status');
            }
            else sessionStorage.removeItem('investimento_menu_item');
            returnList(0, statusIdMenu)
        }
        else if (value === 1) {
            // const status = sessionStorage.getItem('comissao_menu_status') || '10'
            // const typeMenu = sessionStorage.getItem('comissao_type_menu') || '0'
            
            sessionStorage.setItem('comissao_menu_status', '10');
            sessionStorage.setItem('comissao_type_menu', '0');
            sessionStorage.removeItem('investimento_menu_item');
            // const indexType = Number(sessionStorage.getItem('comissao_type_menu'));
            setSelectTabType(0);
            returnList(0, statusIdMenu || 10)
        }
        else {
            sessionStorage.removeItem('comissao_type_menu');
            sessionStorage.removeItem('comissao_menu_status');
            sessionStorage.removeItem('investimento_menu_item');

            returnList()
        }
    };

    return (
        <div className="footer-tabs">
            <Tabs value={selectedTab} onChange={handleTab} className="tabs-container" aria-label="icon label tabs">
                {tabs?.map((tab, index) => (
                    <Tab key={index} icon={tab.icon} label={tab.label} onClick={handleTabInvest} />
                ))}
            </Tabs>
        </div>
    )
}