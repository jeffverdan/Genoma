import React, {useState} from 'react';
import { Collapse, Divider, List, ListItemButton } from '@mui/material';
import Button from '@/components/ButtonComponent';
import { HiIdentification, HiCurrencyDollar, HiKey } from 'react-icons/hi';
import { HiArrowLeft, HiBuildingOffice2, HiChevronDoubleLeft } from 'react-icons/hi2';
import ButtonComponent from '@/components/ButtonComponent';
import { useRouter } from 'next/router';

interface IBlocks {
    id: number,
    name: string,
    title: string,
}[]

interface Props {
    setBlocks: (e: IBlocks[]) => void
    setSelectMenu: (e: number) => void
    loading?: Boolean
    setLoading: (e: boolean) => void
};

interface DataMenuSecundario {
    id: number
    label: string;
    typeApi: 'dados_pessoais' | 'dados_bancarios' | 'dados_login',
    icon: JSX.Element;
};

export default function Menu({setBlocks, setSelectMenu, loading, setLoading}: Props) {   
    const menuSecundario: DataMenuSecundario[] = [
        { id: 0, label: 'Dados Pessoais', typeApi: 'dados_pessoais', icon: <HiIdentification size={22} /> },
        { id: 1, label: 'Dados bancários', typeApi: 'dados_bancarios', icon: <HiCurrencyDollar size={22} /> },
        { id: 2, label: 'Dados de login', typeApi: 'dados_login', icon: <HiKey size={22} /> },
    ];

    const [collapseMenu, setCollapseMenu] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [collapseVendas, setCollapseVendas] = useState(true);
    const router = useRouter();

    const handleChangeMenu = (menuIndex: number) => {
        setLoading(true);

        setSelectedIndex(menuIndex);
        setSelectMenu(menuIndex);
        
        setTimeout(() => {
            setLoading(false);
        }, 600)
    };

    const handleCollapse = () => {
        // CAIXA PRETA ANIMAÇÃO DE MENU PRINCIPAL
        setCollapseVendas(false);
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

    const handleBack = () => {
        router.back();
    }

    return (
        <main className='nav-menu'>
            <div className={`menu-lateral`}>
                <Collapse orientation="horizontal" in={collapseMenu} collapsedSize={106} timeout={collapseMenu ? 0 : 700} addEndListener={handleCollapse}>
                    <div id='collapseButton' className={`w295`}>
                        <div className={`list-items`}>
                            {collapseMenu &&
                                <Collapse in={collapseVendas}>
                                    <List className='venda-items'>
                                        {menuSecundario.map((items) => (
                                            <ListItemButton
                                                key={items.id}
                                                selected={selectedIndex === items.id}
                                                onClick={() => handleChangeMenu(items.id)}
                                            >
                                                {items.icon} {items.label}
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Collapse>}
                        </div>
                    </div>
                </Collapse>
                <Divider className='divider' />
                <div className="menu-voltar">
                    <ButtonComponent
                        size={"large"}
                        variant={"text"}
                        name={"previous"}
                        label={"Voltar para o painel"}
                        startIcon={<HiArrowLeft className='primary500' />}
                        onClick={(e) => handleBack()}
                    />
                </div>
            </div>
        </main>
    )
}
