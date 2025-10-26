
import MenuTableApoio from '@/components/Nucleo/MenuTable';
import ButtonComponent from '@/components/ButtonComponent';
import { DataRows } from '@/interfaces/Nucleo/dataRows';
import { Chip, Table, TableBody, TableHead, TableRow, Avatar, TableCell, Link, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/router';
import SkeletonTableNucleo from '@/components/Skeleton/Nucleo/skeletonTable';
import postAlterarVisualizacaoNucleo from '@/apis/postAlterarVisualizacaoNucleo';

// const columns = [
//     { id: 'pos_venda', label: 'Pós-venda', minWidth: '7.3%', align: 'left' },
//     { id: 'data_entrada', label: 'Entrada', minWidth: '6.7%', align: 'left' },
//     { id: 'franquia', label: 'Franquia', minWidth: '7.6%', align: 'left' },
//     { id: 'endereco', label: 'Endereço', minWidth: '19.7%', align: 'left' },
//     { id: 'comissao', label: 'Comissão', minWidth: '9.8%', align: 'left' },
//     { id: 'vgv', label: 'VGV', minWidth: '10.5%', align: 'left' },
//     { id: 'data_assinatura', label: 'Data de Assinatura', minWidth: '6.7%', align: 'left' },
//     { id: 'gerente', label: 'Gerente', minWidth: '7.3%', align: 'left' },
//     { id: 'data_envio', label: 'Data de envio', minWidth: '6.1%', align: 'left' },
//     { id: 'tools', label: '', minWidth: '5%', align: 'center' },
// ] as const;

const columns = [
    { id: 'pos_venda', label: 'Pós-venda', minWidth: '97px', align: 'center' },
    { id: 'gerente', label: 'Gerente', minWidth: '79px', align: 'center' },
    { id: 'loja', label: 'Loja', minWidth: '75px', align: 'left' },
    { id: 'endereco', label: 'Imóvel', minWidth: '230px', align: 'left' },
    { id: 'data_previsao', label: 'Previsão', minWidth: '75px', align: 'left' },
    { id: 'servicos', label: 'Serviços', minWidth: '200px', align: 'left' },
    { id: 'tools', label: '', minWidth: '200px', align: 'center' },
] as const;

interface PropsData {
    rows: DataRows[]
    tabIndex: number
    loading: boolean
}

export default function Enviadas({ rows, tabIndex, loading }: PropsData) {
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
       
        // if(row?.status_visualizacao_atual === 0){
        //     await postAlterarVisualizacaoNucleo(row?.id_relacao_status);
        // }
       
        router.push(`/nucleo/${row.processo_id}/detalhes-venda`)
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
                                style={{ width: column.minWidth }}
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
                                    className={`row-table`}
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

                                    <TableCell style={{ width: columns[3]?.minWidth }} className='cursorClick' padding='none' onClick={() => router.push(`/nucleo/${row.processo_id}/detalhes-processo`)}>
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

                                    <TableCell style={{ width: columns[5]?.minWidth }} padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col data'>
                                                {
                                                    row?.nome?.map((data: any) => <Chip size='medium' key={data.id} className='chip' label={`${data.nome.toUpperCase()}`} />)
                                                }
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell style={{ width: columns[6]?.minWidth }} padding='none'>
                                        <div className={`col-table`}>
                                            <div className={`col actions`}>
                                                <div className={isHover === row.id ? '' : 'hidden'}>
                                                    <ButtonComponent
                                                        size={'medium'}
                                                        variant={'contained'}
                                                        label={'Ver detalhes'}
                                                        labelColor='white'
                                                        onClick={e => handleServico(row)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* <TableCell style={{ width: columns[6]?.minWidth }} padding='none'>
                                        <div className={`col-table`}>
                                            <div className='col actions'>
                                                <MenuTableApoio className={isHover === row.id ? '' : 'hidden'} id={row.processo_id} label={'Opções'} />
                                            </div>
                                        </div>
                                    </TableCell> */}

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