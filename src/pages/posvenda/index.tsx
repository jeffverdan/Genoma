import React, { useState, useEffect } from 'react';
import HeadSeo from '@/components/HeadSeo';
import Button from '@/components/ButtonComponent';
import { useRouter } from 'next/router';
import { HiChevronDoubleLeft, HiChevronDown, HiChevronUp, HiPlus } from 'react-icons/hi';
import { HiBuildingOffice2, HiCalendar, HiUserGroup, HiHome } from 'react-icons/hi2';
import { Collapse, Divider, List, ListItemButton } from '@mui/material';
import { FormatListBulleted } from '@mui/icons-material';
import MenuVendas from './@DashboardPosVendaComponents/MenuVendas';
import GetTotalProcessos from '@/apis/getTotalProcessPosVenda';
import Corner from '@/components/Corner';
import AgendaPosVenda from './@DashboardPosVendaComponents/MapaPrioridades';
import { CalendarIcon } from '@heroicons/react/24/solid';
import GerenciamentoFila from './@DashboardPosVendaComponents/@Components/@Gestao/GerenFilaPosVenda';
import Gestao from './@DashboardPosVendaComponents/Gestao';

interface DataMenuSecundario {
    id: number
    label: string;
    typeApi: 'andamento' | 'finalizadas' | 'revisoes' | 'cancelados'
    contador?: number
};

interface DataMenuGestao {
    id: number
    label: string;
    typeApi: 'grafico' | 'fila_de_responsaveis' | 'processos_gerente' | 'escrituras',
    contador?: number
};

interface DataMenuPrincipal {
    id: number
    label: string;
    icon: JSX.Element;
};

export default function Vendas() {
    const router = useRouter();
    const title: string = "Dashboard";
    const [collapseVendas, setCollapseVendas] = useState(false);
    const [collapseGestao, setCollapseGestao] = useState(false);
    const [collapseMenu, setCollapseMenu] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ id: string | null, perfil: string | null }>({
        id: '',
        perfil: ''
    })

    const menuPrincipal: DataMenuPrincipal[] = [
        { id: 0, label: 'Gestão', icon: <HiHome size={22} /> },
        { id: 1, label: 'Mapa de prioridades', icon: <HiCalendar size={22} /> },
        // { id: 1, label: 'Tarefas', icon: <FormatListBulleted /> },
        { id: 2, label: 'Vendas', icon: <HiBuildingOffice2 size={22} /> },
        // 3 4 5 6 = MENUS SECUNDARIOS DE VENDA
    ];

    const [menuSecundario, setMenuSecundario] = useState<DataMenuSecundario[]>([
        { id: 3, label: 'Em andamento', typeApi: 'andamento' },
        { id: 4, label: 'Revisão', typeApi: 'revisoes' },
        { id: 5, label: 'Concluídos', typeApi: 'finalizadas' },
        { id: 6, label: 'Cancelados', typeApi: 'cancelados' },
    ]);

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [typeDialog, setTypeDialog] = useState<string>('');
    const [awaitApi, setAwaitApi] = useState(true);

    useEffect(() => {
        const perfilLoginId = localStorage.getItem('perfil_login_id') || '';
        const navCoordenacao =  localStorage.getItem('nav_coordenacao') || ''

        if(perfilLoginId === '10'){
            if(!navCoordenacao || navCoordenacao === '0'){
                localStorage.setItem('nav_coordenacao', '0')
                setSelectedIndex(0);
                setCollapseGestao(true);
            } else {
                setSelectedIndex(3);
                setCollapseVendas(true);
            }
        } else {
            setSelectedIndex(3);
            setCollapseVendas(true);
        }

        setUser({
            id: localStorage.getItem('usuario_id'),
            perfil: localStorage.getItem('perfil_login')
        })
        if (sessionStorage.getItem('type') !== null) {
            const tipo: any = sessionStorage.getItem('type');
            setTypeDialog(tipo)
            setOpenDialog(true);
        }
        else {
            setOpenDialog(false);
        }

        if (!menuSecundario[0].contador) countTotalProcess();
        sessionStorage.removeItem('type');
    }, [])

    const countTotalProcess = async () => {
        const count = await GetTotalProcessos() as any;
        console.log(menuSecundario[0].contador);
        if (count) {
            menuSecundario[0].contador = count.andamento;
            menuSecundario[1].contador = count.revisoes;
            menuSecundario[2].contador = count.finalizadas;
            menuSecundario[3].contador = count.cancelados;
        };
        setMenuSecundario([...menuSecundario]);
        setAwaitApi(false);
    };

    const handleCollapse = () => {
        // CAIXA PRETA ANIMAÇÃO DE MENU PRINCIPAL
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
        console.log('menuIndex', menuIndex);
        console.log('selectedIndex', selectedIndex);
        console.log('colapse Venda: ' , collapseVendas)
        

        if (menuIndex === 2) {
            setCollapseVendas((oldValue) => !oldValue);
            console.log('TESTE VENDAS')
            if (selectedIndex === menuIndex) return ''
            else if (selectedIndex <= 2) {
                if(collapseVendas) setSelectedIndex(3)
            }
        }
        else if(menuIndex === 0){
            setSelectedIndex(menuIndex)
            if(localStorage.getItem('perfil_login_id') === '10') localStorage.setItem('nav_coordenacao', '0')
        }

        else if (menuIndex < 2) {
            // LOGICA MENU PRINCIPAL
            setSelectedIndex(menuIndex);

        } else {
            // LOGICA MENU SECUNDARIO
            setSelectedIndex(menuIndex);
            if(localStorage.getItem('perfil_login_id') === '10') {
                if(menuIndex >= 8){
                    localStorage.setItem('nav_coordenacao', '0')
                }
                else{
                    localStorage.setItem('nav_coordenacao', '1')
                }
            }
        }
    };

    return (
        <>
            {/*SEO*/}
            <HeadSeo titlePage={title} description="Pós Venda" />
            <main className='dashboard-gerente'>
                <div className={`menu-lateral`}>
                    <Collapse orientation="horizontal" in={collapseMenu} collapsedSize={106} timeout={collapseMenu ? 0 : 700} addEndListener={handleCollapse}>
                        <div id='collapseButton' className={`w295`}>
                            <div className={`collapseButton`}>
                                <Button size={'large'} variant={'text'} name={'collapse'} label={''} onClick={() => setCollapseMenu((prev) => !prev)} endIcon={<HiChevronDoubleLeft className='colorP500 iconCollapse' />} fullWidth />
                                <Divider />
                            </div>

                            <div className={`list-items`}>
                                <List className='menu-items'>
                                    {menuPrincipal.filter(e => e.id === 0 && user.perfil === 'Coordenadora de Pós-Negociação').map((item) => (
                                        <ListItemButton
                                            key={item.id}
                                            className='item'
                                            selected={item.id === selectedIndex}
                                            onClick={() => handleChangeMenu(item.id)}
                                        >
                                            {item.icon} {collapseMenu ? item.label : ""}
                                        </ListItemButton>
                                    ))}
                                </List>

                                <List className='menu-items'>
                                    {menuPrincipal.filter(e => e.id <= 2 && e.id >= 1).map((item) => (
                                        <ListItemButton
                                            key={item.id}
                                            className='item'
                                            selected={selectedIndex === item.id || item.id === 2 && selectedIndex > 2 && selectedIndex < 7}
                                            onClick={() => handleChangeMenu(item.id)}
                                        >
                                         {item.icon} {collapseMenu ? item.label : ""} {item.id === 2 && collapseMenu ? collapseVendas ? <HiChevronUp size={22} /> : <HiChevronDown size={22} /> : ""}
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
                                                    {items.label} {items.contador ? ` (${items.contador}) ` : ''}
                                                </ListItemButton>
                                            ))}
                                        </List>
                                    </Collapse>
                                }
                            </div>
                        </div>
                    </Collapse>
                </div>

                <div className='content-dashboard'>
                    {(selectedIndex === 0) &&
                        <Gestao
                            selectedIndex={selectedIndex}
                            setSelectedIndex={setSelectedIndex}
                            collapseMenu={collapseMenu}
                        />
                    }

                    {selectedIndex === 1 &&
                        <AgendaPosVenda
                            user={user}
                            selectedIndex={selectedIndex}
                            setSelectedIndex={setSelectedIndex}
                            collapseMenu={collapseMenu}
                        />
                    }
                    {!awaitApi && selectedIndex > 2 && selectedIndex < 7 && 
                        <MenuVendas
                            loadingMenu={loading}
                            setLoading={setLoading}
                            selectedIndex={selectedIndex}
                            setSelectedIndex={setSelectedIndex}
                            collapseMenu={collapseMenu}
                            setCollapseVendas={setCollapseVendas}
                            openDialog={openDialog}
                            setOpenDialog={setOpenDialog}
                            typeDialog={typeDialog}
                            setTypeDialog={setTypeDialog}
                            countTotalProcess={menuSecundario.map((e => e.contador))}
                        />}
                </div>
            </main>

            {
                openDialog === true &&
                <Corner
                    open={openDialog}
                    setOpen={setOpenDialog}
                    vertical="bottom"
                    horizontal="right"
                    direction="up"
                    type={typeDialog}
                    className='bottom-10'
                />
            }
        </>
    )
}