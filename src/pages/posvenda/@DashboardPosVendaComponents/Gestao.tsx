import React, { useState, useEffect } from 'react';
import { HiTrash } from 'react-icons/hi';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { FiltersKeys, FiltersToolbar, FiltersType } from '@/components/Filters/interfaces';
import Graficos from './@Components/@Gestao/@Graficos/Graficos';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import { HomeIcon } from '@heroicons/react/24/solid';
import GerenciamentoFila from './@Components/@Gestao/GerenFilaPosVenda';
import Escrituras from './@Components/@Gestao/@Escrituras';
import getGraficosEscrituras from '@/apis/getGraficoEscrituras';

interface DataError {
    title: string;
    subtitle: string;
}
interface DataArrayGestao {
    id: number
    label: string;
    typeApi: 'grafico' | 'fila_de_responsaveis' | 'processos_gerente' | 'escrituras',
};

// interface DataListagem {
//     tipo_listagem?: 'grafico' | 'fila_de_responsaveis' | 'processos_gerente' | 'escrituras',
//     buscar: string,
// }

interface Props {
    selectedIndex: number
    setSelectedIndex: (e: number) => void
    collapseMenu: boolean
}

export default function Gestao(props: Props) {
    const { selectedIndex, setSelectedIndex, collapseMenu } = props; // INDEX DO MENU PRINCIPAL
    const [indexTabs, setIndexTabs] = useState(-1); // INDEX DAS TABS 
    const [widthDiv, setWidthDiv] = useState<number | string>('100%');
    const filtersInicialValue = {
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
    const [filtersToolbar, setFiltersToolbar] = useState<FiltersToolbar>(filtersInicialValue);


    // ORDER
    const orderInicialValue = { patch: '', id: 0 };
    const [selectOrder, setSelectOrder] = useState<{ patch: string, id: number }>(orderInicialValue);

    useEffect(() => {
        setSelectOrder(orderInicialValue);
        setIndexTabs(0);
    }, [selectedIndex]);


    const arrayVenda: DataArrayGestao[] = [
        { id: 0, label: 'Gráficos', typeApi: 'grafico' },
        { id: 1, label: 'Fila de responsáveis', typeApi: 'fila_de_responsaveis' },
        // { id: 2, label: 'Processos por gerente', typeApi: 'processos_gerente' },
        { id: 2, label: 'Escrituras', typeApi: 'escrituras' },
    ];

    useEffect(() => {
        setTimeout(() => {
            if (!collapseMenu) setWidthDiv('calc(100vw - 107px');
            else setWidthDiv('calc(100vw - 296px');
        }, 200)
    }, [collapseMenu]);

    const ARRAY_SWIPE = [
        { component: <Graficos
            setSelectedIndex={setSelectedIndex}
            filtersToolbar={filtersToolbar}
            setFiltersToolbar={setFiltersToolbar}
        />, },
        { component:  <GerenciamentoFila /> },
        { component:  <Escrituras />}
    ];

    return (
        <div className='menu-gestao-container' style={{ width: widthDiv }}>
            <div className='header-container'>
                <div className='title-container'>
                    <HomeIcon />
                    <h4 className='p1'>Gestão</h4>
                </div>
                <div className='tab-menu'>
                    <Tabs value={indexTabs} onChange={(e: any, value) => setIndexTabs(value)} className='tab-list'>
                        {arrayVenda?.map((item) => (
                            <Tab
                                key={item.id}
                                label={`${item.label}`}
                                value={item.id}
                                iconPosition="start"
                            />
                        ))}
                    </Tabs>
                </div>
            </div>

            <div className='gestao-content'>
                <SwipeableViews
                    axis="x"
                    index={indexTabs}
                    // onChangeIndex={handleTab}
                    className=""
                >

                    {ARRAY_SWIPE.map((item, i) => (
                        <div key={i}>
                            {item.component}
                        </div>
                    ))
                    }
                </SwipeableViews>
            </div>
        </div>
    )
}