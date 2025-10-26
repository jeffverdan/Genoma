import React, { useState, useEffect } from 'react';
import { HiArrowPath, HiBuildingOffice2, HiEllipsisHorizontal } from 'react-icons/hi2';
import Button from '@/components/ButtonComponent';
import Single from "@/images/single.png";
import Image from 'next/image';
import { Badge, Chip, Paper, TableBody, TableCell, TableContainer, TableRow, Table, AlertTitle, Alert } from '@mui/material';
import InputSelect from '@/components/InputSelect/Index';
import LoadingBar from '@/components/LoadingBar';
import Foguetes from '@/components/Foguetes';
import { differenceInMinutes, format } from 'date-fns';
import getListaVendasGerenteGG from '@/apis/getListaVendasGerenteGG';
import Link from 'next/link';
import SkeletonTable from '@/components/Skeleton/GerentesGG/skeletonTableMenuPrincipal';
import router from 'next/router';
import { Diversity1 } from '@mui/icons-material';
import VendasRecentes from './@components/VendasRecentes';
import Pendencias from './@components/Pendencias';
import TotalVendas from './@components/TotalVendas';
import GetTotalProcessos from '@/apis/getTotalProcessGerentes';
import GetPendencias from '@/apis/getPendenciasGG_Gerente';
import { DataListagem, DataOptionFilterVendas, DataRow, DataRowsPendencias, DataRowsVenda, TotalProcess } from '@/interfaces/Vendas/MenuPrincipal';

interface Props {
    selectedIndex: number
    setSelectedIndex: (index: number) => void
    collapseMenu: boolean
};

export default function MenuPrincipal(props: Props) {
    const { setSelectedIndex, selectedIndex } = props;

    const [loading, setLoading] = useState(true);
    const [totalProcess, setTotalProcess] = useState<TotalProcess>();
    const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
    const [timeDifference, setTimeDifference] = useState<string | null>("0 minutos");
    const [filterVendas, setFilterVendas] = useState('1');
    const [userName, setUserName] = useState("");
    const [today] = useState(format(new Date(), 'dd-MM-yyyy'));
    const [userId, setUserId] = useState<number | undefined>();
    const [rowsVendas, setRowsVendas] = useState<DataRowsVenda>({
        rows: [],
        totalRows: 0,
        errorApi: '',
        length: 0
    });
    const [rowsPendencias, setRowsPendencias] = useState<DataRowsPendencias>({
        rows: [],
        totalRows: 0,
        errorApi: '',
        length: 0
    });

    const getDataPendencia = async () => {
        const data = await GetPendencias();
        console.log("GetPendencias: ", data);
        if (data) {
            setRowsPendencias({
                rows: data,
                totalRows: data.length,
                errorApi: '',
                length: data.length
            })
        }
    };

    console.log(rowsPendencias);
    

    useEffect(() => {
        const name = localStorage.getItem('nome_usuario') as string;
        setUserName(name);
    }, []);

    const [optionFilterVendas] = useState<DataOptionFilterVendas[]>([
        { id: '1', name: 'Em rascunho', typeApi: 'rascunhos' },
        { id: '2', name: 'Revisão', typeApi: 'revisoes' },
        { id: '3', name: 'Entregues', typeApi: 'entregues' },
        { id: '4', name: 'Lixeira', typeApi: 'arquivados' },
        { id: '5', name: 'Finalizados', typeApi: 'finalizados' },
    ]);

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

    useEffect(() => {
        setUserId(Number(localStorage.getItem('usuario_id')));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (userId && selectedIndex < 3) returnList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    useEffect(() => {
        if (userId && selectedIndex < 3) listProcess(true);
    },[filterVendas])

    const listProcess = async (load?: boolean) => {
        load && setLoading(false);
        const now = new Date();
        setLastUpdated(now);
        setTimeDifference("0 minutos");
        const type = optionFilterVendas.find((filter) => filter.id === filterVendas)?.typeApi as DataListagem;
        const res = await getListaVendasGerenteGG(userId, type, 1) as any;
        if (res) {
            if (res.data) {
                // console.log("Processos Mapeados ", res.data);
                rowsVendas.rows = res.data;
                rowsVendas.totalRows = res.total;
            } else {
                // Tratar caso em que um erro ocorre
                rowsVendas.errorApi = res.message;
                rowsVendas.rows = [];
                rowsVendas.totalRows = 0;
            }
            setRowsVendas({ ...rowsVendas });
        } else {
            // Tratar caso em que 'res' é undefined
        }
        load && setLoading(true);
        return res;
    };

    const returnList = async () => {
        setLoading(false);
        const res = await listProcess();
        console.log(res);

        if (res.data) {
            const total = await GetTotalProcessos();
            setTotalProcess(total);
            getDataPendencia();
        }
        setTimeout(() => {
            setLoading(true);
        }, 1000);
    };

    return (
        <div className='painelPrincipal-container'>
            <div className='header-container'>
                <div className='header-title'>
                    <span className='date'>{today}</span>
                    <span><b>Olá {userName.split(" ")[0]}</b>, acompanhe suas pendências, notificações, e análise das suas vendas.</span>
                </div>
                <div className='atualizar-lista'>
                    <Button
                        size={'medium'}
                        variant={'text'}
                        name={'atualizar-painel'}
                        onClick={() => returnList()}
                        label={'Atualizar painel'}
                        endIcon={<HiArrowPath className={!loading ? 'rotate' : ''} />}
                    />
                    <span>{lastUpdated ? `Há ${timeDifference}` : ''}</span>
                </div>
            </div>

            <div className='changelog-container'>
                <div className='title-container'>
                    <Image src={Single} alt={"changelog-img"} />
                    <div className='changelog-title'>
                        <p>{userName.split(" ")[0]}, boas vindas ao seu novo painel.</p>
                        {/* <span>Você tem, <b>3</b> pendências e <b>6</b> notificações novas.</span> */}
                    </div>
                </div>
                <div></div>
                {/* <Button disabled size={'small'} variant={'outlined'} name={''} label={'Ver Changelog do painel'} /> */}
            </div>

            <div className='content-container'>
                <div className='collum-1'>
                    {rowsPendencias.rows.length > 0 && <Pendencias rowsPendencias={rowsPendencias} />}

                    <VendasRecentes rowsVendas={rowsVendas} loading={loading} setSelectedIndex={setSelectedIndex} filterVendas={filterVendas} setFilterVendas={setFilterVendas} />
                </div>
                <div className='collum-2'>
                    <TotalVendas totalProcess={totalProcess} />
                </div>

            </div>
        </div>
    )
}