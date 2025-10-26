import HeadSeo from "@/components/HeadSeo";
import BuyerIco from "@/images/Buyer_ico";
import { CheckCircleIcon, TrashIcon, WalletIcon } from "@heroicons/react/24/solid";
import { HiChevronDoubleLeft, HiChevronDown, HiChevronUp, HiCurrencyDollar } from "react-icons/hi2";
import { Collapse, Divider, List, ListItemButton } from '@mui/material';
import { useEffect, useState } from "react";
import ButtonComponent from "@/components/ButtonComponent";
import SwipeableViews from "react-swipeable-views-react-18-fix";
import MenuComission from "./@Tabelas";
import { ARRAY_MENU_COMISSION_TYPE } from "@/interfaces/Financeiro/Listas";

const ARRAY_MENU = [
    {
        label: "Comissões", icon: <HiCurrencyDollar className="icon-menu" />, submenu: true
    },
];

const ARRAY_COMISSAO: ARRAY_MENU_COMISSION_TYPE[] = [
    { label: "A receber", icon: <WalletIcon className="icon-menu" />, param: "a_receber" },
    { label: "A pagar", icon: <BuyerIco className="icon-menu" height={20} />, param: "a_pagar" },
    { label: "Concluídos", icon: <CheckCircleIcon className="icon-menu" />, param: "concluido" },
    { label: "Cancelados", icon: <TrashIcon className="icon-menu" />, param: "cancelado" },
];

export default function Financeiro() {
    const [collapseComissao, setCollapseComissao] = useState(true);
    const [collapseMenu, setCollapseMenu] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [subMenuSelect, setSubMenuSelect] = useState(0);

    useEffect(() => {
        const collapse = localStorage.getItem('collapseMenu');
        setCollapseMenu(collapse ? JSON.parse(collapse) : true);
        const menuSelected = Number(localStorage.getItem('financeiro_menu'));
        const subMenuSelected = Number(localStorage.getItem('financeiro_submenu')) || 0; // É REMOVIDO NO ARQUIVO @Tabelas
        localStorage.removeItem('financeiro_menu');
        if (!isNaN(menuSelected) && menuSelected >= 0) {
            handleChangeSubMenu(subMenuSelected, menuSelected);
        }
    }, []);

    const handleCollapse = () => {
        // CAIXA PRETA ANIMAÇÃO DE MENU PRINCIPAL
        // setCollapseVendas(false);
        localStorage.setItem('collapseMenu', JSON.stringify(collapseMenu));
        const $section = document.getElementById('collapseButton');
        const $icon = document.getElementsByClassName('iconCollapse')[0];
        $icon.classList.toggle('rotate180');
        if (collapseMenu) {
            $section?.classList.remove('w106');
            $section?.classList.add('w295');
        } else {
            $section?.classList.remove('w295');
            $section?.classList.add('w106');
        }
    };

    const handleChangeMenu = (menuIndex: number) => {
        setSelectedIndex(menuIndex);
        if (menuIndex === 0) {
            setCollapseComissao((prev) => !prev);
            if (subMenuSelect === -1) setSubMenuSelect(0);
        }
    };
    const handleChangeSubMenu = (subMenuIndex: number, menuIndex: number) => {
        setSelectedIndex(menuIndex);
        setSubMenuSelect(subMenuIndex);
    };

    return (
        <>
            <HeadSeo titlePage={"Financeiro"} description="" />
            <div className="painel-financeiro">
                <div className="menu-lateral">
                    <Collapse orientation="horizontal" in={collapseMenu} collapsedSize={106} timeout={collapseMenu ? 0 : 700} addEndListener={handleCollapse}>
                        <div id='collapseButton' className={`w295`}>
                            <div className={`collapseButton`}>
                                <ButtonComponent size={'large'} variant={'text'} name={'collapse'} label={''} onClick={() => setCollapseMenu((prev) => !prev)} endIcon={<HiChevronDoubleLeft className='colorP500 iconCollapse' />} fullWidth />
                                <Divider />
                            </div>

                            <div className={`list-items`}>
                                <List className='menu-items'>
                                    {ARRAY_MENU.map((item, index) => (
                                        <ListItemButton
                                            key={index}
                                            className='item'
                                            selected={index === selectedIndex}
                                            onClick={() => handleChangeMenu(index)}
                                        >
                                            {item.icon} {collapseMenu ? item.label : ""} {item.submenu && collapseMenu ? collapseComissao ? <HiChevronUp size={22} /> : <HiChevronDown size={22} /> : ""}
                                        </ListItemButton>
                                    ))}
                                </List>
                                
                                    <Collapse in={collapseComissao}>
                                        <List className={collapseMenu ? 'venda-items' : 'menu-items'}>
                                            {ARRAY_COMISSAO.map((items, index) => (
                                                <ListItemButton
                                                    key={index}
                                                    className='item'
                                                    selected={subMenuSelect === index}
                                                    onClick={() => handleChangeSubMenu(index, 0)}
                                                >
                                                   {items.icon} {collapseMenu ? items.label : ""}
                                                </ListItemButton>
                                            ))}
                                        </List>
                                    </Collapse>
                                
                            </div>
                            {/* <div className='w295'></div> */}
                        </div>
                    </Collapse>

                </div>

                <div className="content-container">
                    {selectedIndex === 0 && <MenuComission subMenuSelect={subMenuSelect} setSubMenuSelect={setSubMenuSelect} ARRAY_COMISSAO={ARRAY_COMISSAO} />}
                </div>
            </div>
        </>
    )
}
