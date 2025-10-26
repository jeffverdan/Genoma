import React, { useState, useEffect } from 'react';
import ButtonComponent from '@/components/ButtonComponent';
import { HiArrowPath } from 'react-icons/hi2';
import { differenceInMinutes } from 'date-fns';
import SalvarFila from '@/apis/postSalvarFila';
import getDataGraficoPosVenda from '@/apis/getDataGraficoPosVenda';
import DataGridComponent from '@/components/DataGrid';
import { GridColDef, GridColumnGroupingModel, GridPreProcessEditCellProps, GridRenderCellParams } from '@mui/x-data-grid';
import { Checkbox } from '@mui/material';

type RowsType = {
    responsavel: string,
    id: number,
    total: number,
    a_vista: number,
    financiado: number,
    fgts: number,
    consorcio: number,
    em_dia: number,
    alerta: number,
    atrasado: number,
    sem_prazo: number,
    sem_pagamento: number,
    total_processos: number,
    check_a_vista: 0 | 1,
    check_financiado: 0 | 1
};

export default function GerenciamentoFila() {
    const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
    const [timeDifference, setTimeDifference] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [rowsData, setRowsData] = useState<RowsType[]>([]);
    const [collumns, setCollumns] = useState<GridColDef[]>([
        { field: 'responsavel', headerName: 'Responsável', minWidth: 150 },
        { field: 'total', headerClassName: 'col-total', headerName: 'Total', align: 'center', headerAlign: 'center', width: 62 },
        { field: 'a_vista', headerName: 'À vista', align: 'center', headerAlign: 'center', width: 78 },
        { field: 'financiado', headerName: 'Financiado', align: 'center', headerAlign: 'center', width: 102  },
        { field: 'fgts', headerName: 'FGTS', align: 'center', headerAlign: 'center', width: 78  },
        { field: 'consorcio', headerName: 'Consórcio', align: 'center', headerAlign: 'center', width: 102  },
        { field: 'em_dia', headerName: 'Em dia', align: 'center', headerAlign: 'center' },
        { field: 'alerta', headerName: 'Alerta', align: 'center', headerAlign: 'center' },
        { field: 'atrasado', headerName: 'Atrasado', align: 'center', headerAlign: 'center' },
        {
            field: 'check_a_vista',
            headerName: 'A vista',
            headerClassName: 'check-fila',
            resizable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params: GridRenderCellParams<any, boolean>) => (
                <Checkbox
                    key={params.id}
                    className=''
                    checked={params.value}
                    onChange={(event: any, checked: boolean) => handleValue(params, checked)}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            ),
        },
        {
            field: 'check_financiado',
            headerName: 'Financiado',
            headerClassName: 'check-fila',
            resizable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params: GridRenderCellParams<any, boolean>) => (
                <Checkbox
                    key={params.id}
                    className=''
                    checked={params.value}
                    onChange={(event: any, checked: boolean) => handleValue(params, checked)}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            ),
        },
    ]);

    useEffect(() => {
        lists();
    }, []);

    const lists = async () => {
        setLoading(true);
        setTimeDifference("0 minutos");
        const now = new Date();
        setLastUpdated(now);
        const dataChart2 = await getDataGraficoPosVenda() as unknown as RowsType[];
        if (dataChart2) {
            setRowsData(dataChart2);
        }
        setLoading(false);
    };

    const returnTotal = () => {
        if (rowsData) {
            return rowsData.reduce((acc, value) => acc + value.total, 0)
        } else return 'Carregando...'
    };

    const columnGroupingModel: GridColumnGroupingModel = [
        {
            groupId: `Vendas em andamento: ${returnTotal()}`,
            description: '',
            headerClassName: 'col-group',
            children: [
                { field: 'responsavel' },
                { field: 'total' },
            ],
        },
        {
            groupId: 'Formas pagamento',
            description: '',
            headerClassName: 'col-group',
            children: [
                { field: 'a_vista' },
                { field: 'financiado' },
                { field: 'fgts' },
                { field: 'consorcio' },
            ],
        }, {
            groupId: 'Status',
            description: '',
            headerClassName: 'col-group',
            children: [
                { field: 'em_dia' },
                { field: 'alerta' },
                { field: 'atrasado' },
            ],
        },
        {
            groupId: 'Gerenciamento de fila',
            headerClassName: 'col-group check-fila',
            children: [
                { field: 'check_a_vista' },
                { field: 'check_financiado' }
            ],
        },
    ];

    async function handleValue(props: GridRenderCellParams<any, boolean>, value: boolean) {
        setLoading(true);
        
        const id = props.id
        const keyCheck = props.field as 'check_financiado' | 'check_a_vista'
        const key = keyCheck.replace('check_', '') as 'financiado' | 'a_vista';

        await SalvarFila({
            tipo: key,
            valor_checked: !!value,
            usuario_id: id
        });

        lists();
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeDifference(calculateTimeDifference());
        }, 60000); // Atualiza a cada minuto (60000 milissegundos)

        return () => {
            clearInterval(intervalId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const calculateTimeDifference = (): string | null => {
        if (lastUpdated) {
            const minutesDifference = differenceInMinutes(new Date(), lastUpdated);
            return `${minutesDifference} minutos`;
        }
        return null;
    };

    return (
        <div className='gerenciamentoPosvenda-container'>
            <div className='header-gerenciamento'>
                <div className='atualizar-lista'>
                    <ButtonComponent
                        size={'medium'}
                        variant={'text'}
                        name={'atualizar-painel'}
                        onClick={() => lists()}
                        label={'Atualizar lista'}
                        endIcon={<HiArrowPath className={loading ? 'rotate' : ''} />}
                    />
                    <span>{lastUpdated ? `Há ${timeDifference}` : ''}</span>
                </div>
            </div>
            <div className='graphics-container'>
                <DataGridComponent columns={collumns} rows={rowsData} columnGrouping={columnGroupingModel} loading={loading} />
            </div>
        </div>
    )
}