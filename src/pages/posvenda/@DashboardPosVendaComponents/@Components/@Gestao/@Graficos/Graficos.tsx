import React, {useState, useEffect} from 'react'
import CardGraficosAndamento from './CardGraficoAndamento'
import getGestaoGraficos from '@/apis/getGestaoGraficos';
import SkeletonCardGraficos from './SkeletonCardGraficos';
import { FiltersToolbar } from '@/components/Filters/interfaces';
import CardGraficoProjecao from './CardGraficoProjecao';
import CardGraficoConcluidos from './CardGraficoConcluidos';

type ItemsType = {
    id: string,
    label: string,
    menu: string,
    param: 'em_dia' | 'em_alerta' | 'atrasados' | 'avista' | 'financiamento' | 'FGTS' | 'consorcio' | 'prefeitura' | 'uniao' | 'igreja' | 'familia'
    cor: string,
    check: boolean,
};

type TotalProcessType = {
    prazo_status_andamento?: {
        em_dia?: number,
        em_alerta?: number,
        atrasados?: number,
        total: number,
    },
    forma_pagamento_andamento?: {
        avista?: number,
        financiamento?: number,
        FGTS?: number,
        consorcio?: number,
        total: number,
    },
    laudemios_andamento?: {
        prefeitura?: number,
        uniao?: number,
        igreja?: number,
        familia?: number,
        total: number,
    }
}

type TListaProjecao = {
    month: string,
    em_dia: number,
    em_alerta: number,
    atrasados: number
}

type TListaConcluidos = {
    month?: string,
    a_vista?: number,
    financiamento?: number,
    fgts?: number,
    consorcio?: number
    prefeitura?: number,
    uniao?: number, 
    igreja?: number,
    familia?: number
}

type PropsType = { 
    setSelectedIndex?: (index: number) => void
    filtersToolbar: FiltersToolbar,
    setFiltersToolbar: (e: FiltersToolbar) => void
}

export default function Graficos({setSelectedIndex, filtersToolbar, setFiltersToolbar} : PropsType) {
    const [totalProcess, setTotalProcess] = useState<TotalProcessType>();
    const [loading, setLoading] = useState(true);
    const [selectedConcluido, setSelectedConcluido] = useState<number>(0);
    
    // Gráfico de Andamento
    const listStatus: ItemsType[] = [
        { id: 'em_dia', label: 'Em dia', param: 'em_dia', cor: '#6B9539', menu: 'Todos em dia', check: true },
        { id: 'alerta', label: 'Em alerta', param: 'em_alerta', cor: '#CC8E00', menu: 'Todos em alerta', check: true },
        { id: 'atrasados', label: 'Vencidos', param: 'atrasados', cor: '#E33838', menu: 'Vencidos', check: true },
    ];

    const listPagamentos: ItemsType[] = [
        { id: '1', label: 'À vista', param: 'avista', cor: '#14B8AA', menu: 'Todos em a vista', check: true },
        { id: '2', label: 'Financiamento', param: 'financiamento', cor: '#01655D', menu: 'Todos em financiamento', check: true },
        { id: '3', label: 'FGTS', param: 'FGTS', cor: '#FF7A11', menu: 'Todos em FGTS', check: true },
        { id: '4', label: 'Consórcio', param: 'consorcio', cor: '#CC8E00', menu: 'Todos em consórcio', check: true },
    ];

    const listLaudemios: ItemsType[] = [
        { id: 'prefeitura', label: 'Prefeitura', param: 'prefeitura', cor: '#CD8FBC', menu: 'Todos de prefeitura', check: true },
        { id: 'uniao', label: 'União', param: 'uniao', cor: '#4E79A7', menu: 'Todos de união', check: true },
        { id: 'igreja', label: 'Igreja', param: 'igreja', cor: '#CE7456', menu: 'Todos de igreja', check: true },
        { id: 'familia', label: 'Família', param: 'familia', cor: '#5C9055', menu: 'Todos de família', check: true },
    ];

    useEffect(() => {
        const returnGestaoGraficos = async () => {
            const data: any = await getGestaoGraficos();            
            if(data){
                setTotalProcess(data);
                setLoading(false)
            }
        } 
        returnGestaoGraficos();
    },[])
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Gráfico de Projeção
    const listaProjecao: TListaProjecao[] = [
        { month: 'Janeiro', em_dia: 10, em_alerta: 2, atrasados: 1 },
        { month: 'Fevereiro', em_dia: 5, em_alerta: 3, atrasados: 2 },
        { month: 'Março', em_dia: 0, em_alerta: 1, atrasados: 9 },
    ];

    // Gráfico de Concluídos
    const listaConcluidosPagamentos: TListaConcluidos[] = [
        { month: 'Janeiro', a_vista: 10, financiamento: 12, fgts: 5, consorcio: 1 },
        { month: 'Fevereiro', a_vista: 7, financiamento: 10, fgts: 8, consorcio: 0 },
        { month: 'Março', a_vista: 3, financiamento: 20, fgts: 7, consorcio: 2 },
    ];

    const listaConcluidosLaudemios: TListaConcluidos[] = [
        { month: 'Janeiro', prefeitura: 10, uniao: 2, igreja: 1, familia: 0 },
        { month: 'Fevereiro', prefeitura: 20, uniao: 8, igreja: 2, familia: 17 },
    ];

    return (
        <div className="gestao-graficos">
            {
                loading 
                ?
                <SkeletonCardGraficos />  
                : 
                <>
                    <h2>Em andamento</h2>
                    <div className="content">
                        <CardGraficosAndamento 
                            type="status" 
                            title="Status" 
                            list={listStatus} 
                            totalProcess={totalProcess?.prazo_status_andamento} 
                            setSelectedIndex={setSelectedIndex} 
                            filtersToolbar={filtersToolbar}
                            setFiltersToolbar={setFiltersToolbar}
                        />
                        <CardGraficosAndamento 
                            type="pagamentos" 
                            title="Pagamentos" 
                            list={listPagamentos} 
                            totalProcess={totalProcess?.forma_pagamento_andamento} 
                            setSelectedIndex={setSelectedIndex} 
                            filtersToolbar={filtersToolbar}
                            setFiltersToolbar={setFiltersToolbar}
                        />
                        <CardGraficosAndamento 
                            type="laudemios" 
                            title="Laudêmios" 
                            list={listLaudemios} 
                            totalProcess={totalProcess?.laudemios_andamento} 
                            setSelectedIndex={setSelectedIndex} 
                            filtersToolbar={filtersToolbar}
                            setFiltersToolbar={setFiltersToolbar}
                        />
                    </div>

                    {/* <div className='content'>
                        <CardGraficoProjecao 
                            list={listaProjecao}
                        />
                    </div>

                    <h2>Concluídos</h2>
                    <div className='content'>
                        <CardGraficoConcluidos
                            list={selectedConcluido === 0 ? listaConcluidosPagamentos : listaConcluidosLaudemios}
                            selectedConcluido={selectedConcluido}
                            setSelectedConcluido={setSelectedConcluido}
                        />
                    </div> */}
                </>
            }
            
        </div>
    )
}
