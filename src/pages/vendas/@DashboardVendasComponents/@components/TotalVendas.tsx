import InputSelect from "@/components/InputSelect/Index";
import { TotalProcess } from "@/interfaces/Vendas/MenuPrincipal";
import { Chip, Paper } from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from "react";

type PropsType = {
    totalProcess?: TotalProcess
};

type ItemsType = {
    label: string,
    param: 'rascunhos' | 'entregues' | 'revisoes' | 'arquivados' | 'finalizados'
};

const TotalVendas = (props: PropsType) => {
    const { totalProcess } = props;

    const listItems: ItemsType[] = [
        { label: 'Rascunhos', param: 'rascunhos' },
        { label: 'Entregues', param: 'entregues' },
        { label: 'Revisões', param: 'revisoes' },
        // { label: 'Arquivados', param: 'arquivados' },
    ];

    return (
        <Paper className='total-vendas'>
            <div className='title-table'>
                <div className='label-table'>
                    <span>Total de vendas</span>
                    <Chip size='small' label={listItems.map((e) => totalProcess?.[e.param] || 0).reduce((a, b) => a + b)} className='chip' />
                </div>

                <div className='filter-table'>
                    {/* <InputSelect option={['2023']} onChange={(e) => setFilterVendas(e.target.value as string)} value={filterVendas.toString()} label={''} name={''} /> */}
                </div>
            </div>
            <div className="chart-container">
                {
                    <PieChart
                        colors={['#13D0AB', '#FD7622', '#FFC43E']}
                        series={[
                            {
                                data: listItems.map((e, index) => ({
                                    id: index,
                                    value: totalProcess?.[e.param] || 0,
                                    label: e.label
                                })),
                                innerRadius: '50%',
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                cx: '75%',

                                // cy: 0,
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
                        // width={400}
                        // height={300}

                    />}
            </div>
            <div className="label-chart">
                {listItems.map((e) => (
                    <div className="labels" key={e.param}>
                        <p>{totalProcess?.[e.param]}</p>
                        <span>{e.label}</span>
                    </div>
                ))}

            </div>

        </Paper>
    )

};

export default TotalVendas