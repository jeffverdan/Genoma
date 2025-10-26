import React from 'react'
import { Chip, Paper } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import ButtonComponent from '@/components/ButtonComponent';

type PropsType = {
    list: TListaConcluidos[]
    selectedConcluido: number
    setSelectedConcluido: (index: number) => void
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

export default function CardGraficoConcluidos({list, selectedConcluido, setSelectedConcluido}: PropsType) {
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

    const total = selectedConcluido === 0 
        ? list?.reduce((acc, item) => acc + (item?.a_vista || 0) + (item?.financiamento || 0) + (item?.fgts || 0) + (item?.consorcio || 0), 0)
        : list?.reduce((acc, item) => acc + (item?.prefeitura || 0) + (item?.uniao || 0) + (item?.igreja || 0) + (item?.familia || 0), 0);

    const legendas = selectedConcluido === 0 
        ? [
            { dataKey: 'a_vista', label: 'À vista', color: '#14B8AA', total: list?.reduce((acc, item) => acc + (item?.a_vista || 0), 0) },
            { dataKey: 'financiamento', label: 'Financiamento', color: '#01655D', total: list?.reduce((acc, item) => acc + (item?.financiamento || 0), 0) },
            { dataKey: 'fgts', label: 'FGTS', color: '#FF7A11', total: list?.reduce((acc, item) => acc + (item?.fgts || 0), 0) },
            { dataKey: 'consorcio', label: 'Consórcio', color: '#CC8E00', total: list?.reduce((acc, item) => acc + (item?.consorcio || 0), 0) },
        ]
        : [
            { dataKey: 'prefeitura', label: 'Prefeitura', color: '#CD8FBC', total: list?.reduce((acc, item) => acc + (item?.prefeitura || 0), 0) },
            { dataKey: 'uniao', label: 'União', color: '#4E79A7', total: list?.reduce((acc, item) => acc + (item?.uniao || 0), 0) },
            { dataKey: 'igreja', label: 'Igreja', color: '#CE7456', total: list?.reduce((acc, item) => acc + (item?.igreja || 0), 0) },
            { dataKey: 'familia', label: 'Família', color: '#5C9055', total: list?.reduce((acc, item) => acc + (item?.familia || 0), 0) },
        ];

    const handleChangeChart = () => {
        setSelectedConcluido(selectedConcluido === 0 ? 1 : 0);
    }

    return (
        <Paper className='card-chart'>
            <div className='title-table'>
                <div className='label-table' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span>Comparativo</span>
                    
                    <div style={{display: 'flex', gap: '10px'}}>
                        <ButtonComponent 
                            style={{marginBottom: '0'}} 
                            size={'large'} 
                            variant={'text'} 
                            startIcon={''} 
                            label={'Pagamentos'} 
                            onClick={(e) => setSelectedConcluido(0)} 
                        />

                        <ButtonComponent 
                            style={{marginBottom: '0'}} 
                            size={'large'} 
                            variant={'text'} 
                            startIcon={''} 
                            label={'Laudemios'} 
                            onClick={(e) => setSelectedConcluido(1)} 
                        />
                    </div>
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
                        },
                    ]}
                    series={legendas}
                    {...chartSetting}
                />
                )}
            </div>
            
            <div className="label-chart">
                {legendas?.map((item, index) => (
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
