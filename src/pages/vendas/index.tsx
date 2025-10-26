import React, { useState, useEffect } from 'react';
import HeadSeo from '@/components/HeadSeo';
import Button from '@/components/ButtonComponent';
import { useRouter } from 'next/router';
import { HiChevronDoubleLeft, HiChevronDown, HiChevronUp, HiHome, HiPlus } from 'react-icons/hi';
import { HiBuildingOffice2 } from 'react-icons/hi2';
import { Collapse, Divider, List, ListItemButton } from '@mui/material';
import { FormatListBulleted } from '@mui/icons-material';
import MenuVendas from './@DashboardVendasComponents/@menuVendas';
import MenuPrincipal from './@DashboardVendasComponents/@menuPrincipal';
import GetTotalProcessos from '@/apis/getTotalProcessGerentes';
import Corner from '@/components/Corner';
import { TotalProcess } from '@/interfaces/Vendas/MenuPrincipal';
import { toastEmitter } from '@/functions/toastEmitter';

interface DataMenuSecundario {
    id: number
    label: string;
    typeApi: 'rascunhos' | 'entregues' | 'arquivados' | 'revisoes' | 'finalizados'
};

interface DataMenuPrincipal {
    id: number
    label: string;
    icon: JSX.Element;
};

export default function Vendas() {
    const router = useRouter();
    const title: string = "Dashboard";
    const [collapseVendas, setCollapseVendas] = useState(true);
    const [collapseMenu, setCollapseMenu] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [cornerConfirm, setCornerConfirm] = useState(false);
    const [urlCorner, setUrlCorner] = useState('')
    const [totalProcess, setTotalProcess] = useState<TotalProcess>();
    const [papel, setPapel] = useState('');
    const [cornerType, setCornerType] = useState('confirm-reenvio-devolucao');

    useEffect(() => {
        const vendaEntregueId = localStorage.getItem('venda_entregue');
        if(vendaEntregueId) {
            setCornerType('concluir-processo');
            setUrlCorner(`vendas/detalhes-venda/${vendaEntregueId}/`);
            setCornerConfirm(true);
            localStorage.removeItem('venda_entregue');
        }
    },[])

    const menuPrincipal: DataMenuPrincipal[] = [
        { id: 0, label: 'Painel Principal', icon: <HiHome size={22} /> },
        // { id: 1, label: 'Pendências', icon: <FormatListBulleted /> },
        { id: 2, label: 'Vendas', icon: <HiBuildingOffice2 size={22} /> },
    ];

    const [menuSecundario, setMenuSecundario] = useState<DataMenuSecundario[]>([
        { id: 3, label: 'Em rascunho', typeApi: 'rascunhos' },
        { id: 4, label: 'Revisão', typeApi: 'revisoes' },
        { id: 5, label: 'Entregues', typeApi: 'entregues' },
        { id: 6, label: 'Lixeira', typeApi: 'arquivados' },
        { id: 7, label: 'Finalizados', typeApi: 'finalizados' },
    ]);    

    useEffect(() => {
        const storage = globalThis?.sessionStorage;
        const prev = storage.getItem('prevPath');        
        localStorage.removeItem('prevPath');
        const perfilLogin = localStorage.getItem('perfil_login');

        if (prev?.includes('entregar-venda') && prev?.includes('checkout') && sessionStorage.getItem('exibir-entregues') === 'true') setSelectedIndex(5);
        else if (prev?.includes('entregar-venda')) setSelectedIndex(3);
        else if (prev?.includes('revisar-venda')) setSelectedIndex(4);
        else if (prev?.includes('detalhes-venda')) setSelectedIndex(5);
        else if (prev?.includes('gerar-venda')) setSelectedIndex(3);   

        setTimeout(() => {
            sessionStorage.removeItem('exibir-entregues'); 
        }, 1000);

        sessionStorage.removeItem('urlCadastro');
        const modals = storage.getItem('confirmRenvioVenda');
        if (modals) {
            setUrlCorner(`/vendas/detalhes-venda/${modals}/`)
            setCornerConfirm(true)
            sessionStorage.removeItem('confirmRenvioVenda');
        }

        if(perfilLogin !== null){
            setPapel(perfilLogin);
        }
    }, []);

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

    const handleChangeMenu = (menuIndex: number) => {
        // setLoading(true);

        if (menuIndex === 2) {
            setCollapseVendas((oldValue) => !oldValue);
            if (selectedIndex <= 2) setSelectedIndex(3);
        }
        else if (menuIndex < 2) {
            // LOGICA MENU PRINCIPAL
            setSelectedIndex(menuIndex);

        } else {
            // LOGICA MENU SECUNDARIO
            setSelectedIndex(menuIndex);
        }
        setTimeout(() => {
            // setLoading(false);
        }, 600)
    };

    return (
        <>
            {/*SEO*/}
            <HeadSeo titlePage={title} description="Alguma coisa aqui" />
            <main className='dashboard-gerente'>
                <div className={`menu-lateral`}>
                    <Collapse orientation="horizontal" in={collapseMenu} collapsedSize={106} timeout={collapseMenu ? 0 : 700} addEndListener={handleCollapse}>
                        <div id='collapseButton' className={`w295`}>
                            <div className={`collapseButton`}>
                                <Button size={'large'} variant={'text'} name={'collapse'} label={''} onClick={() => setCollapseMenu((prev) => !prev)} endIcon={<HiChevronDoubleLeft className='colorP500 iconCollapse' />} fullWidth />
                                <Divider className='divider' />
                            </div>

                            <div className={`list-items`}>
                                {
                                    (papel === "Gerente Geral" || papel === "Diretor Comercial" || !papel)
                                    ? ''
                                    : <Button size={'large'} variant={'contained'} name={'gerar-venda item'} onClick={() => router.push('/vendas/gerar-venda')} label={collapseMenu ? 'Gerar vendas' : ""} endIcon={<HiPlus />} fullWidth />
                                }

                                <List className='menu-items'>
                                    {menuPrincipal.map((item) => (
                                        <ListItemButton
                                            key={item.id}
                                            className='item'
                                            disabled={item.id === 1}
                                            selected={selectedIndex === item.id || item.id === 2 && selectedIndex > 2}
                                            onClick={() => handleChangeMenu(item.id)}
                                        >
                                            {item.icon} {collapseMenu ? item.label : ""} {item.id === 2 && collapseMenu ? collapseVendas ? <HiChevronDown size={22} /> : <HiChevronUp size={22} /> : ""}
                                        </ListItemButton>
                                    ))}
                                </List>
                                {collapseMenu &&
                                    <Collapse in={collapseVendas}>
                                        <List className='venda-items'>
                                            {menuSecundario.map((items) => (
                                                <ListItemButton
                                                    key={items.id}
                                                    selected={selectedIndex === items.id}
                                                    onClick={() => handleChangeMenu(items.id)}
                                                >
                                                    {items.label + ' ' + (totalProcess?.[items.typeApi] ? '(' + totalProcess?.[items.typeApi] + ')' : '')}
                                                </ListItemButton>
                                            ))}
                                        </List>
                                    </Collapse>}
                            </div>
                            {/* <div className='w295'></div> */}
                        </div>
                    </Collapse>
                </div>

                <div className='content-dashboard'>
                    {selectedIndex === 0 && <MenuPrincipal selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} collapseMenu={collapseMenu} />}
                    {selectedIndex > 2 && <MenuVendas totalProcess={totalProcess} setTotalProcess={setTotalProcess} loadingMenu={loading} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} collapseMenu={collapseMenu} />}
                </div>
            </main>
            <Corner
                open={cornerConfirm}
                setOpen={setCornerConfirm}
                vertical={'bottom'}
                horizontal={'right'}
                direction={'up'}
                type={cornerType}
                className='confirm-reenvio'
                url={urlCorner}
            />
        </>
    )
}