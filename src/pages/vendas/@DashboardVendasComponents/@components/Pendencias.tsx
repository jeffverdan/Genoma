import InputSelect from "@/components/InputSelect/Index";
import { Alert, AlertTitle, Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material"
import { useEffect, useState } from "react";
import SkeletonTable from '@/components/Skeleton/GerentesGG/skeletonTableMenuPrincipal';
import router from 'next/router';
import Link from "next/link";
import ButtonComponent from "@/components/ButtonComponent";
import { ListBulletIcon } from "@heroicons/react/24/solid";
import { DataOptionFilterVendas, DataRowsPendencias, ResApiType } from "@/interfaces/Vendas/MenuPrincipal";

interface PropsType {
    rowsPendencias: DataRowsPendencias,
}

export default function Pendencias({ rowsPendencias }: PropsType) {
    const [optionFilterVendas] = useState<DataOptionFilterVendas[]>([
        { id: '1', name: 'Hoje', typeApi: 'rascunhos' },
        // { id: '2', name: 'Revisão', typeApi: 'revisoes' },
        // { id: '3', name: 'Entregues', typeApi: 'entregues' },
        // { id: '4', name: 'Lixeira', typeApi: 'arquivados' },
    ]);
    const [filterVendas, setFilterVendas] = useState('1');
    const [userId, setUserId] = useState<number | undefined>();
    const [loadingPendencias, setLoadingPendencias] = useState(false);

    useEffect(() => {
        setUserId(Number(localStorage.getItem('usuario_id')));
    }, []);

    const onClickRow = (row: ResApiType) => {
        if(row.pendencia === 'Cobrança solicitada') return router.push(`/vendas/pendencias/${row.processo_id}/${row.parcela_id}/${row.pendencia_id}`);
    };

    const returnEndereco = (dadosProcesso: ResApiType | undefined): string => {
        if (dadosProcesso === undefined) return '';
        const { logradouro, numero, unidade, complemento, bairro, cidade, uf } = dadosProcesso;
        return `${logradouro}, ${numero}${unidade ? ' ' + unidade + ',' : ''}${complemento ? ' ' + complemento + ',' : ''} ${bairro}, ${cidade} - ${uf}`;
    };

    return (
        <>
            {(!!rowsPendencias?.rows[0]) &&
                <Paper className='vendas-recentes'>
                    <div className='title-table'>
                        <div className='label-table'>
                            <ListBulletIcon />
                            <span>Pendências</span>
                            <Chip size='small' label={rowsPendencias.totalRows} className='chip' />
                        </div>

                        <div className='filter-table'>
                            <span>Filtrar:</span>
                            <InputSelect option={optionFilterVendas} onChange={(e) => setFilterVendas(e.target.value as string)} value={filterVendas.toString()} label={''} name={''} />
                        </div>
                    </div>
                    <TableContainer className='table-container' component={Paper}>
                        <Table aria-label="simple table">
                            {loadingPendencias ? <SkeletonTable /> :
                                <TableBody>
                                    {rowsPendencias.rows.map((row, index) => {
                                        // LIMITE DE ITENS DESATIVADO
                                        // if (index <= 6) 
                                        return (
                                            <TableRow
                                                key={index}
                                                onClick={() => onClickRow(row)}
                                                style={{ cursor: 'pointer' }}
                                                className="pendencias-table-row"
                                            >
                                                <TableCell component="th" scope="row">
                                                    <div className='pendencias-msg'>
                                                        <p>{row.pendencia}</p>
                                                        <span>{returnEndereco(row)}</span>
                                                    </div>
                                                </TableCell>

                                                <TableCell component="th" scope="row">
                                                    <div className='pendencias-tags'>
                                                        {row.numero_parcela ? <span className="s2">PARCELA {row.numero_parcela} DE {row.total_parcelas}</span> : <div></div>}
                                                        {row.status_visualizacao === 0 ? <Chip size='small' label={'NOVO'} className='chip green' /> : <div></div>}
                                                        <ButtonComponent
                                                            label="Revisar dados"
                                                            size="small"
                                                            variant="contained"
                                                            onClick={() => onClickRow(row)}
                                                            labelColor="white"
                                                        />

                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                    {rowsPendencias.errorApi && <Alert severity="error">
                                        <AlertTitle color='red'>{rowsPendencias.errorApi}</AlertTitle>
                                        <span>{rowsPendencias.errorApi} </span><Link href="/">Relogar</Link>
                                    </Alert>}
                                </TableBody>
                            }
                        </Table>
                    </TableContainer>
                    <div className='footer-table'>
                        {/* {rowsPendencias.totalRows > 7 ? <p>Mais {rowsPendencias.totalRows - 7}...</p> : <div></div>}
                <ButtonComponent size={'large'} variant={'text'} name={''} label={'Ir para a listagem'} /> */}
                    </div>
                </Paper>}
        </>
    )
};