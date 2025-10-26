import InputSelect from "@/components/InputSelect/Index";
import { Alert, AlertTitle, Chip, Paper, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material"
import { useEffect, useState } from "react";
import { HiBuildingOffice2 } from 'react-icons/hi2';
import SkeletonTable from '@/components/Skeleton/GerentesGG/skeletonTableMenuPrincipal';
import router from 'next/router';
import LoadingBar from '@/components/LoadingBar';
import Foguetes from '@/components/Foguetes';
import Link from "next/link";
import ButtonComponent from "@/components/ButtonComponent";
import { DataOptionFilterVendas, DataRowsVenda } from "@/interfaces/Vendas/MenuPrincipal";

interface PropsType {
    rowsVendas: DataRowsVenda, 
    loading: boolean, 
    setSelectedIndex: (index: number) => void,
    filterVendas: string, 
    setFilterVendas: (e: string) => void
}

export default function VendasRecentes(props: PropsType) {
    const { rowsVendas, loading, setSelectedIndex, filterVendas, setFilterVendas } = props;
    const [optionFilterVendas] = useState<DataOptionFilterVendas[]>([
        { id: '1', name: 'Em rascunho', typeApi: 'rascunhos' },
        { id: '2', name: 'Revisão', typeApi: 'revisoes' },
        { id: '3', name: 'Entregues', typeApi: 'entregues' },
        { id: '4', name: 'Lixeira', typeApi: 'arquivados' },
        { id: '5', name: 'Finalizados', typeApi: 'finalizados' },
    ]);
    const [userId, setUserId] = useState<number | undefined>();
    const [perfilLogin, setPerfilLogin] = useState('');

    useEffect(() => {
        setUserId(Number(localStorage.getItem('usuario_id')));

        const perfil = localStorage.getItem('perfil_login');

        if(perfil !== null){
            setPerfilLogin(perfil);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilter = (e:  SelectChangeEvent<unknown>) => {
        const value = e.target.value as string;
        setFilterVendas(value);
    };

    return (
        <Paper className='vendas-recentes'>
            <div className='title-table'>
                <div className='label-table'>
                    <HiBuildingOffice2 />
                    <span>Vendas recentes</span>
                    { rowsVendas?.totalRows && <Chip size='small' label={rowsVendas.totalRows} className='chip' /> }
                </div>

                <div className='filter-table'>
                    <span>Filtrar:</span>
                    <InputSelect option={optionFilterVendas} onChange={handleFilter} value={filterVendas?.toString()} label={''} name={''} />
                </div>
            </div>
            <TableContainer className='table-container' component={Paper}>
                <Table aria-label="simple table">
                    {!loading ? <SkeletonTable /> :
                        <TableBody>
                            {(!rowsVendas?.rows[0]) &&
                                // LISTA VAZIA
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        Nenhum processo encontrado
                                    </TableCell>
                                </TableRow>
                            }

                            {rowsVendas?.rows.map((row, index) => {
                                // LIMITE DE 7 ITENS 
                                if (index <= 6) return (
                                    <TableRow
                                        key={row.id}
                                        onClick={() => router.push(
                                            row?.statusGerente === 'COLETANDO ASSINATURAS'
                                                ? `vendas/entregar-venda/${row.id}/checkout`
                                                : userId === row.gerenteId
                                                    ? perfilLogin === 'Gerente Geral' || !perfilLogin ? `vendas/detalhes-venda/${row.id}` : `vendas/gerar-venda/${row.id}/dashboard`
                                                    : `vendas/detalhes-venda/${row.id}`
                                        )}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <div className='row-table'>
                                                <span>{row.endereco}</span>
                                                {
                                                    row?.statusGerente === 'COLETANDO ASSINATURAS'
                                                        ?
                                                        <div className="tag-list-default">
                                                            <Chip size='small' label={row?.statusGerente} className={'working'} style={{ cursor: 'pointer' }} />
                                                        </div>
                                                        : ''
                                                }
                                                <div className='porcentagem'>
                                                    {row.progresso?.toFixed()}%
                                                    <LoadingBar progress={Number(row.progresso)} />
                                                    {/* <Foguetes quantidade={row.foguetes} /> */}
                                                    {/* <Button
                                                                    label={''}
                                                                    size={'small'} 
                                                                    variant={'text'}
                                                                    name={'ellipsis'}
                                                                    startIcon={<HiEllipsisHorizontal />}
                                                                    onClick={() => router.push(
                                                                        row?.statusGerente === 'COLETANDO ASSINATURAS' 
                                                                        ? `vendas/entregar-venda/${row.id}/checkout` 
                                                                        : userId === row.gerenteId 
                                                                         ? `vendas/gerar-venda/${row.id}/dashboard`
                                                                         : `vendas/detalhes-venda/${row.id}`
                                                                    )} 
                                                                /> */}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            {rowsVendas?.errorApi && <Alert severity="error">
                                <AlertTitle color='red'>{rowsVendas.errorApi}</AlertTitle>
                                <span>{rowsVendas.errorApi} </span><Link href="/">Relogar</Link>
                            </Alert>}
                        </TableBody>
                    }
                </Table>
            </TableContainer>
            <div className='footer-table'>
                {rowsVendas?.totalRows > 7 ? <p>Mais {rowsVendas?.totalRows - 7}...</p> : <div></div>}
                <ButtonComponent size={'large'} variant={'text'} name={''} label={'Ir para a listagem'} onClick={() => setSelectedIndex(Number(filterVendas) + 2)} />
            </div>
        </Paper>
    )
};