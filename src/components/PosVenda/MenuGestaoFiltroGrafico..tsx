import { Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import ButtonComponent from '../ButtonComponent';
import { FiltersToolbar } from '../Filters/interfaces';

type Props = {    
    tools?: boolean
    startIcon?: JSX.Element
    label: string
    list: ItemsType[]
    type: string
    setSelectedIndex?: (index: number) => void,
    filtersToolbar: FiltersToolbar,
    setFiltersToolbar: (e: FiltersToolbar) => void
}

type ItemsType = {
    label: string,
    menu: string,
    param: 'em_dia' | 'em_alerta' | 'atrasados' | 'avista' | 'financiamento' | 'FGTS' | 'consorcio' | 'prefeitura' | 'uniao' | 'igreja' | 'familia',
    cor: string,
};

export default function MenuGestaoFiltroGrafico(props: Props) {
    const { startIcon, label, list, type, tools, setSelectedIndex, filtersToolbar, setFiltersToolbar } = props;
    const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
    // const router = useRouter();
    const open = Boolean(anchorMenu);
    const filtersInicialValue: FiltersToolbar = {
        filtro_gerente: [],
        filtro_responsavel: [],
        filtro_status: [],
        filtro_status_rascunho: [],
        filtro_pagamento: [],
        filtro_recibo: [],
        filtro_correcoes: [],
        filtro_clientes: [],
        filtro_laudemio: [],
        filtro_prazo_status: [],
    };

    useEffect(() => {
        const filtersLocal = localStorage.getItem('filters_posvenda');
        if (filtersLocal) {
            const parsedFilters = JSON.parse(filtersLocal);
            setFiltersToolbar({
                ...filtersToolbar,
                ...parsedFilters,
            });
        }
    }, [setFiltersToolbar]);
    
    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorMenu(null);
    };

    const handleMenu = async (item: any) => {
        // Redefine filtersToolbar para filtersInicialValue
        let atualizarFiltersToolbar = { ...filtersInicialValue };

        if (type === 'pagamentos') {
            const existePagamentos = filtersToolbar.filtro_pagamento || [];
            const itemAdicionado = existePagamentos?.some(
                (pagamento) => pagamento.id === item.id
            );

            if (!itemAdicionado) {
                atualizarFiltersToolbar = {
                    ...atualizarFiltersToolbar,
                    filtro_pagamento: [
                        // ...existePagamentos,
                        { id: item?.id, check: item?.check, label: item?.label }
                    ]
                };
            }
        } else if (type === 'laudemios') {
            const existeLaudemios = filtersToolbar.filtro_laudemio || [];
            const itemAdicionado = existeLaudemios.some(
                (laudemio) => laudemio.id === item.id
            );

            if (!itemAdicionado) {
                atualizarFiltersToolbar = {
                    ...atualizarFiltersToolbar,
                    filtro_laudemio: [
                        // ...existeLaudemios,
                        { id: item.id, check: item.check, label: item.label }
                    ]
                };
            }
        } else if (type === 'status') {
            const existePrazoStatus = filtersToolbar.filtro_prazo_status || [];
            const itemAdicionado = existePrazoStatus.some(
                (status) => status.id === item.id
            );

            if (!itemAdicionado) {
                atualizarFiltersToolbar = {
                    ...atualizarFiltersToolbar,
                    filtro_prazo_status: [
                        // ...existePrazoStatus,
                        { id: item.id, check: item.check, label: item.label }
                    ]
                };
            }
        }

        // Atualiza o estado e salva no localStorage
        setFiltersToolbar(atualizarFiltersToolbar);
        localStorage.setItem('filters_posvenda', JSON.stringify(atualizarFiltersToolbar));
        localStorage.setItem('nav_coordenacao', '3')
        
        // TAB DE ANDAMENTO
        if(setSelectedIndex) {
            setSelectedIndex(3)
        }
    };

    return (
        <div className=''>
            <ButtonComponent
                size={'small'}
                variant={'text'}
                startIcon={startIcon}
                label={label}
                onClick={handleOpenMenu}
                labelColor='#464F53'
            />
            <Menu
                id="basic-menu"
                anchorEl={anchorMenu}
                className='dashboard-button-editar'
                open={open}
                onClose={handleCloseMenu}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <p className='menu-title'>VER MAIS</p>

                {
                    list.map((item, index) => (
                        <MenuItem key={index} onClick={(e) => handleMenu(item)} className='green'> {item?.menu} </MenuItem>
                    ))
                }
            </Menu>
        </div>
    )
}