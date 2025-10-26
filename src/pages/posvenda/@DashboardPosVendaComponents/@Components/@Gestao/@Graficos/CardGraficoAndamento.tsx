import { FiltersToolbar } from "@/components/Filters/interfaces";
import InputSelect from "@/components/InputSelect/Index";
import MenuGestaoFiltroGrafico from "@/components/PosVenda/MenuGestaoFiltroGrafico.";
import { Chip, Paper } from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from "react";
import { HiEllipsisHorizontal } from "react-icons/hi2";

type PropsType = {
    totalProcess?: TotalProcessType
    type: string
    list: ItemsType[]
    title: string
    setSelectedIndex?: (index: number) => void
    filtersToolbar: FiltersToolbar,
    setFiltersToolbar: (e: FiltersToolbar) => void
};

type TotalProcessType = {
    em_dia?: number,
    em_alerta?: number,
    atrasados?: number
    avista?: number,
    financiamento?: number,
    FGTS?: number,
    consorcio?: number
    prefeitura?: number,
    uniao?: number,
    igreja?: number,
    familia?: number,
    total?: number
}

type ItemsType = {
    id: string,
    label: string,
    menu: string,
    param: 'em_dia' | 'em_alerta' | 'atrasados' | 'avista' | 'financiamento' | 'FGTS' | 'consorcio' | 'prefeitura' | 'uniao' | 'igreja' | 'familia',
    cor: string,
    check: boolean,
};

const CardGraficoAndamento = (props: PropsType) => {
    const { totalProcess, type, list, title, setSelectedIndex, filtersToolbar, setFiltersToolbar } = props;
    // const total = list?.map((e) => totalProcess?.[e?.param] || 0).reduce((a, b) => a + b, 0);
    const total = totalProcess?.total

    return (
        <Paper className='card-pie-chart'>
            <div className='title-table'>
                <div className='label-table'>
                    <span>{title}</span>
                </div>
            </div>
            <div className="chart-container">
                {list && list.length > 0 && (
                    <PieChart
                        colors={list.map((e) => e?.cor || '#000')}
                        series={[
                            {
                                data: list.map((e, index) => ({
                                    id: index,
                                    value: totalProcess?.[e?.param] || 0,
                                    label: e?.label || 'N/A',
                                })),
                                innerRadius: '50%',
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                cx: '75%',
                            },
                        ]}
                        slotProps={{
                            legend: {
                                hidden: true,
                                labelStyle: {
                                    fontSize: 14,
                                },
                                direction: 'row',
                                position: { vertical: 'bottom', horizontal: 'middle' },
                                padding: 0,
                            },
                        }}
                        width={300}
                        height={300}
                    />
                )}
            </div>
            
            <div className="label-chart">
                {list?.map((e) => (
                    <div className="labels" key={e?.param}>
                        <p style={{color: e?.cor}}>{totalProcess?.[e?.param]}</p>
                        <span>{e?.label}</span>
                    </div>
                ))}
            </div>

            <div className="info-chart">
                <p>Total - {total || 0} processo{(total || 0) > 1 ? 's' : ''}</p>
                <div>
                    <MenuGestaoFiltroGrafico
                        label='Ver filtrado'
                        startIcon={<HiEllipsisHorizontal fill='#464F53' size={20} />}
                        list={list || []}
                        type={type}
                        tools
                        setSelectedIndex={setSelectedIndex}
                        filtersToolbar={filtersToolbar}
                        setFiltersToolbar={setFiltersToolbar}
                    />
                </div>
            </div>
        </Paper>
    );
};

export default CardGraficoAndamento