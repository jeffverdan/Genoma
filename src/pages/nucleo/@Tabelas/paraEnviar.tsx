
import MenuTableApoio from '@/components/Nucleo/MenuTable';
import ButtonComponent from '@/components/ButtonComponent';
import { DataRows } from '@/interfaces/Nucleo/dataRows';
import { Chip, Table, TableBody, TableHead, TableRow, Avatar, TableCell, Link, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/router';
import SkeletonTableNucleo from '@/components/Skeleton/Nucleo/skeletonTable';
import postAlterarVisualizacaoNucleo from '@/apis/postAlterarVisualizacaoNucleo';

const columns = [
    { id: 'pos_venda', label: 'Pós-venda', minWidth: '97px', align: 'center', padding: '' },
    { id: 'gerente', label: 'Gerente', minWidth: '79px', align: 'center', padding: '' },
    { id: 'loja', label: 'Loja', minWidth: '75px', align: 'left', padding: '' },
    { id: 'endereco', label: 'Imóvel', minWidth: '230px', align: 'left', padding: '' },
    { id: 'solicitacao_onus', label: 'Solicitação de Ônus Reais', minWidth: '85px', align: 'left', padding: '0' },
    { id: 'espaco', label: '', minWidth: '15px', align: 'left', padding: 'inherit' },
    { id: 'certidao_comarca', label: 'Certidão de outra comarca', minWidth: '85px', align: 'left', padding: '0' },
    { id: 'data_solicitacao', label: 'Solicitação', minWidth: '75px', align: 'left', padding: '' },
    { id: 'data_previsao', label: 'Previsão', minWidth: '75px', align: 'left', padding: '' },
    { id: 'servicos', label: 'Serviços', minWidth: '200px', align: 'left', padding: '' },
    { id: 'novo', label: '', minWidth: '45px', align: 'center', padding: '' },
    { id: 'tools', label: '', minWidth: '200px', align: 'center', padding: '' },
] as const;

interface PropsData {
    rows: DataRows[]
    tabIndex: number
    loading: boolean
}

export default function Enviadas({ rows, loading, tabIndex }: PropsData) {
    const [isHover, setIsHover] = useState(0);
    const router = useRouter();

    function formatoDataCurto(value: string){
        const explodeData = value?.split('/');
        const dataCurta = explodeData?.[0] + '/' + explodeData?.[1] || '---';
        return dataCurta;
    }

    function somenteAno(value: string){
        const explodeData = value?.split('/');
        const dataCurta = explodeData?.[2] || '';
        return dataCurta;
    }

    const handleServico = async (row: DataRows) => {
        console.log('ROWS: ' , row)
       
        if(row?.status_visualizacao_atual === 0){
            await postAlterarVisualizacaoNucleo(row?.id_relacao_status);
        }

        router.push(`/nucleo/${row.processo_id}/servicos/${row.id}`)
    }

    return (
        <>
            <Table stickyHeader>
                <TableHead className='head-table'>
                    <TableRow sx={{ height: '82px' }}>
                        {columns.map((column, index) => (
                            <TableCell
                                key={column.id}
                                align={column.align}
                                className={index === 0 ? 'first' : ''}
                                style={{ width: column.minWidth, padding: column.padding }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                {loading
                    ? <SkeletonTableNucleo tabIndex={tabIndex} />
                    : <TableBody>
                        {rows?.map((row) => {
                            return (
                                <TableRow
                                    hover
                                    key={row.id}
                                    tabIndex={-1}
                                    className={`row-table ${row.status_visualizacao_atual === 0 ? 'novo' : ''}`}
                                    onMouseEnter={() => setIsHover(row.id)}
                                >
                                    <TableCell style={{ width: columns[0]?.minWidth }} padding='none'>
                                        <div className={`first ${isHover === row.id && 'rowHover'} col-table`}>
                                            <div className='col avatar'>
                                                <Avatar sx={{ width: 28, height: 28, bgcolor: '' }} alt={row.nome_responsavel?.toUpperCase()} />
                                                <Chip size='small' className='chip' label={`${row?.nome_responsavel?.toUpperCase().split(' ')[0]}`} />
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell style={{ width: columns[1]?.minWidth }} padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col avatar'>
                                                <Avatar sx={{ width: 28, height: 28, bgcolor: '' }} alt={row.nome_gerente?.toUpperCase()} />
                                                <Chip size='small' className='chip' label={`${row?.nome_gerente?.toUpperCase().split(' ')[0]}`} />
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell style={{ width: columns[2]?.minWidth }} padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col text'>
                                                <p>{row.nome_loja}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell style={{ width: columns[3]?.minWidth }} className='cursorClick' padding='none' onClick={() => handleServico(row)}>
                                        <div className={`col-table`}>
                                            <div className='col text'>
                                                <p>{row.logradouro}{row.numero && ', ' + row.numero}</p>
                                                <span>
                                                    {!!row.unidade && !!row.complemento ? row.unidade + ', ' + row.complemento : !!row.unidade ? row.unidade : !!row.complemento ? row.complemento : ''} - {row.bairro}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell style={{ width: columns[4]?.minWidth }} padding='none'>
                                        <div className={`col-table ${row.onus_solicitada === 1 ? 'green' : 'red'}`}>
                                            <div className='col text'>
                                                <p>{row.onus_solicitada === 1 ? 'Sim' : 'Não' }</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell style={{ width: columns[5]?.minWidth }} padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col text'>
                                                <p></p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell style={{ width: columns[6]?.minWidth }} padding='none'>
                                        <div className={`col-table ${row.vendedor_comarca === 1 ? 'green' : 'red'}`}>
                                            <div className='col data'>
                                                <p>{row.vendedor_comarca === 1 ? 'Sim' : 'Não'}</p>
                                                <span>{row?.quantidade_comarca || ''}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell style={{ width: columns[7]?.minWidth }} padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col data'>
                                                <p>{formatoDataCurto(row?.data_solicitacao)}</p>
                                                <span>{somenteAno(row?.data_solicitacao)}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell style={{ width: columns[8]?.minWidth }} padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col data'>
                                                {
                                                    row?.nome?.map((data: { data_previsao?: string }) =>
                                                        <>
                                                            <p>{data?.data_previsao ? formatoDataCurto(data?.data_previsao) : '---'}</p>
                                                        </>   
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell style={{ width: columns[9]?.minWidth }} padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col data'>
                                                {
                                                    row?.nome?.map((data: any) => <Chip size='medium' key={data.id} className='chip' label={`${data.nome.toUpperCase()}`} />)
                                                }
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* <TableCell style={{ width: columns[8]?.minWidth }} padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col text'>
                                                {row.comissao_incompleta
                                                    ? '---'
                                                    : <p>{row.tipo_venda}</p>
                                                }
                                                <span>{row.quantidade_parcela > 1 && row.quantidade_parcela + 'x'}</span>
                                            </div>
                                        </div>
                                    </TableCell> */}

                                    <TableCell style={{ width: columns[10]?.minWidth }} padding='none'>
                                        <div className={`col-table no-pading`}>
                                            <div className='col actions'>
                                                { row.status_visualizacao_atual === 0 && <Chip size='small' className='chip green' label='novo' /> }
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell style={{ width: columns[6]?.minWidth }} padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col actions'>
                                                <MenuTableApoio 
                                                    className={isHover === row.id ? '' : 'hidden'} 
                                                    id={row.processo_id} 
                                                    relacaoStatus={row?.id_relacao_status} 
                                                    servicos={row.id}
                                                    statusAtual={row?.status_visualizacao_atual} 
                                                    label={'Opções'} 
                                                />
                                            </div>
                                        </div>
                                    </TableCell>

                                </TableRow>
                            );
                        })}
                    </TableBody>
                }


            </Table>
            {(!!rows && rows.length === 0) &&
                <TableRow
                    tabIndex={-1}
                    className='row-table'
                >
                    <TableCell style={{ border: 'none' }}>Nenhum processo encontrado</TableCell>
                </TableRow>
            }
        </>
    )
};