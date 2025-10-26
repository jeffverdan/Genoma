import React from 'react'
import { Chip, Paper } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';

type PropsType = {
    list: TListaProjecao[]
}

type TListaProjecao = {
    month: string,
    em_dia: number,
    em_alerta: number,
    atrasados: number
}

export default function CardGraficoProjecao({list}: PropsType) {
    const currentYear = new Date().getFullYear();
    const chartSetting = {
        yAxis: [
          {
            label: currentYear.toString(),
            width: 60,
          },
        ],
        height: 300,
    };

    const valueFormatter = (value: number) => {
        return `${value}`;
    };

    const total = list?.reduce((acc, item) => acc + item.em_dia + item.em_alerta + item.atrasados, 0);

    return (
        <Paper className='card-chart'>
            <div className='title-table'>
                <div className='label-table' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span>Projeção</span>
                    <span>Status</span>
                </div>
            </div>
            <div className="chart-container">
                {list && list.length > 0 && (
                <BarChart
                    dataset={list}
                    xAxis={[
                        {
                            dataKey: 'month', 
                            scaleType: 'band', 
                            // label: currentYear.toString(), 
                        },
                    ]}
                    series={[
                        { dataKey: 'em_dia', label: 'Em dia', valueFormatter, color: '#6B9539' },
                        { dataKey: 'em_alerta', label: 'Em alerta', valueFormatter, color: '#CC8E00' },
                        { dataKey: 'atrasados', label: 'Atrasados', valueFormatter, color: '#E33838' },
                    ]}
                    {...chartSetting}
                />
                )}
            </div>
            
            <div className="label-chart">
                {[
                    { label: 'Em dia', color: '#6B9539', total: list?.reduce((acc, item) => acc + item.em_dia, 0) },
                    { label: 'Em alerta', color: '#CC8E00', total: list?.reduce((acc, item) => acc + item.em_alerta, 0) },
                    { label: 'Atrasados', color: '#E33838', total: list?.reduce((acc, item) => acc + item.atrasados, 0) },
                ].map((item, index) => (
                    <div className="labels" key={index}>
                        <p style={{ color: item.color }}>{item.total}</p>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>

            <div className="info-chart">
                <p>Total -  {total}</p>
            </div>
        </Paper>
    );
}
