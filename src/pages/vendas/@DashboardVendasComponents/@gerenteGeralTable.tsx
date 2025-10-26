import React, { useEffect, useRef, useState } from 'react';
import Button from '@/components/ButtonComponent';
import LoadingBar from '@/components/LoadingBar';
import { useRouter } from 'next/router';
import { HiEllipsisHorizontal, HiCheck, HiPencil } from 'react-icons/hi2';
import { Chip, Table, TableBody, TableHead, TableRow, TableCell, Avatar, Link, Snackbar, Alert } from '@mui/material';
import Foguetes from '@/components/Foguetes';
import SkeletonTableGerente from '@/components/Skeleton/GerentesGG/skeletonTableGerenteGeral';
import { HiInformationCircle } from 'react-icons/hi';
import { format, parse } from 'date-fns';
import ShowDocument from '@/apis/getDocument';
import { CurrencyDollarIcon, DocumentTextIcon, HomeModernIcon } from '@heroicons/react/24/solid';
import SellerIco from '@/images/Seller_ico';
import BuyerIco from '@/images/Buyer_ico';
import { MdRestore } from "react-icons/md";
import dayjs from 'dayjs';
import MenuEditar from '@/components/Vendas/MenuEditar';
import RestaurarVenda from '@/apis/postRestaurarVenda';
import { FaExclamationCircle } from 'react-icons/fa';

interface Column {
  id: 'hover' | 'gerente' | 'endereco' | 'progresso' | 'status' | 'tools' | 'data_assinatura' | 'forma_pagamento' | 'prazo_escritura' | 'res_pos_venda' | 'recibo' | 'ico_correcoes' | 'dias_corridos' | 'data_pedido';
  label: string;
  minWidth?: string;
  align?: 'right' | 'center';
  padding?: string | number;
}

interface DataRows {
  id: number
  gerente: string;
  gerenteName2?: string;
  gerenteId: number;
  endereco: string;
  complemento?: string;
  progresso: number;
  data: string;
  statusGerente?: string;
  statusPosVenda?: string;
  dataAssinatura?: string;
  prazoEscritura?: string;
  formaPagamento?: [];
  responsavelPosVendaId?: string;
  posvendaName?: string;
  recibo?: string;
  reciboId?: string;
  imovelId?: string;
  origemRecibo?: string;
  dataPrazoPos?: string;
  dataStatusAlterado?: string;
  comprador: boolean;
  vendedor: boolean;
  comissaoId?: string;
  foguetes: number;
  recibo_type?: string;
  envelope_id?: number;
  devolucaoVendedor?: number;
  devolucaoComprador?: number;
  devolucaoImovel?: number;
  devolucaoId?: number;
  devolucaoComissao?: number;
  devolucaoRecibo?: number;
}

interface PropsData {
  loadingMenu: boolean
  rows: DataRows[]
  loading: boolean
  userId: number | undefined
  tabIndex: number
  collapseMenuPrincipal: boolean
  returnList: (idArrayVendas?: number) => Promise<void>
}

interface DataPosVendaList {
  id: string
  name: string
}

export default function Vendas(props: PropsData,) {
  const { rows, loading, userId, tabIndex, collapseMenuPrincipal, loadingMenu, returnList } = props;
  const router = useRouter();
  const inicialValueRestaurar = {
    loading: false,
    error: false,
    msg: '',
  };
  const [feedbackRestaurar, setFeedbackRestaurar] = useState(inicialValueRestaurar);
  const gerenteDivRef = useRef<HTMLDivElement>(null);
  const [divWidth, setDivWidth] = useState<number>(0);

  const getDivWidth = () => {
    if (gerenteDivRef.current) {
      setDivWidth(gerenteDivRef.current.offsetWidth || 0);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      getDivWidth();
    }, 600)
  }, [collapseMenuPrincipal])

  useEffect(() => {
    // Chamada inicial para obter a largura da div
    getDivWidth();

    // Event listener para atualizar a largura quando o tamanho da janela muda
    const handleResize = () => getDivWidth();
    window.addEventListener('resize', handleResize);

    // Removendo o event listener ao desmontar o componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // LISTA DE PROCESSOS
  const [isHover, setIsHover] = useState(0);
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    setIsHover(rows[0]?.id || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows])

  useEffect(() => {
    if (tabIndex === 3 || tabIndex === 6) setColumns(columnsRascunho);
    else if (tabIndex === 4) setColumns(columnsRevisoes);
    else setColumns(columnsEntregues);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabIndex]);

  const columnsRascunho: Column[] = [
    { id: 'gerente', label: 'Gerente', minWidth: '9%', },
    { id: 'endereco', label: 'Endereço', minWidth: '27%' },
    { id: 'progresso', label: 'Progresso', minWidth: '30%' },
    { id: 'status', label: 'Status', minWidth: '7%' },
    { id: 'tools', label: '', minWidth: '30%', align: 'right' },
  ];

  const columnsRevisoes: Column[] = [
    { id: 'gerente', label: 'Gerente', minWidth: '7%', },
    { id: 'endereco', label: 'Endereço', minWidth: '25%' },
    { id: 'data_assinatura', label: 'Data de Assinatura', minWidth: '10%' },
    { id: 'data_pedido', label: 'Data do Pedido', minWidth: '10%' },
    { id: 'dias_corridos', label: 'Dias corridos da venda', minWidth: '10%', padding: 0 },
    { id: 'ico_correcoes', label: 'Correções', minWidth: '15%' },
    { id: 'tools', label: '', minWidth: '22%', align: 'right' }
  ];

  const columnsEntregues: Column[] = [
    { id: 'gerente', label: 'Gerente', minWidth: '9%', },
    { id: 'endereco', label: 'Endereço', minWidth: '27%' },
    { id: 'data_assinatura', label: 'Data de Assinatura', minWidth: '10%' },
    { id: 'prazo_escritura', label: 'Prazo de escritura', minWidth: '10%' },
    { id: 'forma_pagamento', label: 'Forma de pagamento', minWidth: '10%' },
    { id: 'res_pos_venda', label: 'Pós-venda', minWidth: '9%' },
    { id: 'status', label: 'Status', minWidth: '10%' },
    { id: 'recibo', label: 'Recibo de Sinal', minWidth: '7%' },
    { id: 'tools', label: '', minWidth: '8%', align: 'right' },
  ];

  const [today] = useState(format(new Date(), 'dd-MM-yyyy'));
  function comparaDate(prazo: string | undefined, status: string | undefined) {
    if (!prazo) return ''
    const todayFormat = parse(today, 'dd-MM-yyyy', new Date());
    const dateCompare = parse(prazo.replace(/\//g, '-'), 'dd-MM-yyyy', new Date());
    if (!dateCompare) return ''
    if (dateCompare < todayFormat) {
      if (status === 'FINALIZADO' || status === 'REGISTRO') return ''
      else return 'Vencida';
    }
    else {
      return 'Em dia';
    }
  };

  const calcDiasCorridos = (value?: string) => {
    let result = 0 as number
    if (value) {
      const data = value.split("/");
      const oldDataFormat = data[2] + '-' + data[1] + '-' + data[0];
      const newData = dayjs(oldDataFormat);
      const today = dayjs();
      result = (today.diff(newData, 'day'));
    }
    return result;
  };

  const ReturnIconsTable = (props: { row?: DataRows }) => {
    const { row } = props;    
    return (
      <>
        <div className='tooltip fixed' >
          <HomeModernIcon className={row?.devolucaoImovel === 1 ? 'sucess' : ''} height={18} />
          <span className='tooltip-text fixed'>Imóvel</span>
        </div>

        <div className='tooltip fixed' >
          <SellerIco className={row?.devolucaoVendedor === 1 ? 'sucess' : ''} height={20} />
          <span className='tooltip-text fixed'>Vendedores</span>
        </div>

        <div className='tooltip fixed' >
          <BuyerIco className={row?.devolucaoComprador === 1 ? 'sucess' : ''} height={20} />
          <span className='tooltip-text fixed'>Compradores</span>
        </div>

        <div className='tooltip fixed' >
          <DocumentTextIcon className={row?.devolucaoRecibo === 1 ? 'sucess' : ''} height={18} />
          <span className='tooltip-text fixed'>Recibo de sinal</span>
        </div>

        {
          tabIndex !== 4 &&
          <div className='tooltip fixed' >
            <CurrencyDollarIcon className={row?.devolucaoComissao === 1 ? 'sucess' : ''} height={18} />
            <span className='tooltip-text fixed'>Comissão</span>
          </div>
        }
      </>
    )
  };

  const restaurarVenda = async (id: number) => {
    setFeedbackRestaurar({ ...feedbackRestaurar, loading: true });
    const res = await RestaurarVenda({ id: id });
    if (res) {
      setFeedbackRestaurar({
        loading: false,
        msg: 'A venda foi restaurada. Acompanhe na aba â€œEm Rascunhoâ€.',
        error: false
      })
      returnList()
    } else {
      setFeedbackRestaurar({
        loading: false,
        msg: 'ERROR - A venda não foi restaurada.',
        error: true
      })
    }
  };

  const handleCloseFeedRestaurar = () => {
    setFeedbackRestaurar(inicialValueRestaurar);
  };

  return (
    <>
      <Table stickyHeader>
        <TableHead className='head-table'>
          <TableRow sx={{ height: '82px' }}>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ width: column.minWidth, padding: column.padding }}
              >
                {loading || loadingMenu ? '' : column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        {(!loading && !loadingMenu) ?
          <TableBody>
            {/* {(!!rows && rows.length === 0) &&
              <TableRow
                tabIndex={-1}
                className='row-table'
              >
                <TableCell>Nenhum processo encontrado</TableCell>
              </TableRow>
            } */}

            {rows?.map((row) => {
              return (
                <>
                  <TableRow
                    hover
                    key={row.id}
                    tabIndex={-1}
                    // ${tabIndex === 3 ? 'cursorClick' : ''}
                    className={`row-table`}
                    onMouseEnter={() => setIsHover(row.id)}
                  // onClick={() => tabIndex === 3 && router.push(`vendas/gerar-venda/${row.id}/dashboard`)}
                  >
                    <TableCell style={{ width: columns[0]?.minWidth }} padding='none'>
                      <div className={`container-col-gerente ${isHover === row.id && 'rowHover'}`}>
                        <div className='col-gerente'>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: '' }} alt={row.gerente?.toUpperCase()} />
                          <Chip size='small' label={`${row?.gerente?.toUpperCase()}${divWidth > 191 ? " " + row?.gerenteName2?.toUpperCase() : ""}`} />
                        </div>
                      </div>
                    </TableCell>


                    <TableCell 
                      style={{ width: columns[1]?.minWidth, cursor: 'pointer' }}
                      onClick={() => router.push(`vendas/detalhes-venda/${row.id}`)}  
                    >
                      <div className='col-endereco' ref={gerenteDivRef}>
                        {/* <div className='tooltip fixed' > */}
                        <div className=''>
                          <p>{row.endereco}</p>
                          <span className='complemento'>{row.complemento}</span>
                          {/* <span className='tooltip-text fixed'>{row.endereco + ', ' + row.complemento}</span> */}
                        </div>
                      </div>
                    </TableCell>

                    {(tabIndex === 3 || tabIndex === 6) &&
                      // ABA RASCUNHO E LIXEIRA
                      <>
                        <TableCell style={{ width: columns[2]?.minWidth }}>
                          <div className='col-progresso'>
                            <div className='porcentagem'>
                              <span>{row.progresso?.toFixed()}%</span>
                              <span>Dados do imóvel</span>
                            </div>
                            <div className='loadingBar'>
                              <LoadingBar progress={row.progresso} />
                            </div>
                            <div className='rocketsAndIcos'>
                              <Foguetes quantidade={row.foguetes} />
                              <div className='h20'>
                                <ReturnIconsTable row={row} />
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell style={{ width: columns[3]?.minWidth }}>
                          <div className='col-status'>
                            {tabIndex === 6 ?
                              // ABA DIVIDIDA ENTRE LIXEIRA E RASCUNHO
                              <Chip size='small' label={'PARADO'} className={'stop'} />
                              :
                              // <Chip size='small' label={row.statusGerente?.toUpperCase() === 'VENDA COMPLETA' ? 'FAZENDO' : 'PRONTO'} className={row.progresso === 100 ? 'sucess' : 'working'} />
                              // <Chip size='small' label={row.statusGerente} className={row.progresso === 100 ? 'sucess' : 'working'} />
                              row?.statusGerente === 'COLETANDO ASSINATURAS'
                                ? <Chip size='small' label={row?.statusGerente} className={'working'} />
                                : <Chip size='small' label={row.statusGerente} className={row.progresso === 100 ? 'sucess' : 'working'} />
                            }
                            <p>{row.data}</p>
                          </div>
                        </TableCell>

                        {/* ABA DIVIDIDA ENTRE RASCUNHO E LIXEIRA */}
                        <TableCell style={{ width: columns[4]?.minWidth }}>
                          {tabIndex === 3 ?
                            // ABA RASCUNHO
                            <>
                              {
                                row?.statusGerente === 'COLETANDO ASSINATURAS'
                                  ?
                                  <div className={`col-tools ${isHover === row.id ? 'visible' : 'hidden'}`}>
                                    <Button
                                      style={{ zIndex: '999' }}
                                      size={'small'}
                                      variant={'contained'}
                                      name={'entregar'}
                                      labelColor={'white'}
                                      startIcon={<HiCheck />}
                                      label={'Acompanhar Assinaturas'}
                                      disabled={row.progresso < 100}
                                      onClick={() => router.push(`vendas/entregar-venda/${row.id}/checkout/`)}
                                    />
                                  </div>
                                  :
                                  <div className={`col-tools ${(isHover === row.id && userId === row.gerenteId) ? 'visible' : 'hidden'}`}>
                                    <Button size={'small'} variant={'text'} name={'detalhes'} disabled={false} startIcon={<HiInformationCircle />} label={'Ver detalhes'} onClick={() => router.push(`vendas/detalhes-venda/${row.id}`)} />    
                                  </div>
                              }
                              <div className={`col-tools ${(isHover === row.id && userId !== row.gerenteId) ? 'visible' : 'hidden'}`}>
                                <Button size={'small'} variant={'text'} name={'detalhes'} disabled={false} startIcon={<HiInformationCircle />} label={'Ver detalhes'} onClick={() => router.push(`vendas/detalhes-venda/${row.id}`)} />
                              </div>
                            </>
                            :
                            // ABA DA LIXEIRA
                            <>
                              {/* <div className={`col-tools ${(isHover === row.id && userId === row.gerenteId) ? 'visible' : 'hidden'}`}>
                                <Button
                                  size={'small'}
                                  variant={'contained'}
                                  name={'restaurar'}
                                  onClick={() => restaurarVenda(row.id)}
                                  labelColor={'white'}
                                  startIcon={<MdRestore fill='white' />}
                                  label={'Restaurar'}
                                  disabled={feedbackRestaurar.loading}
                                  endIcon={<span className={feedbackRestaurar.loading ? 'loader' : ''}></span>}
                                />
                              </div> */}
                              <div className={`col-tools ${(isHover === row.id && (userId !== row.gerenteId || userId === row.gerenteId)) ? 'visible' : 'hidden'}`}>
                                <Button size={'small'} variant={'text'} disabled={false} name={'detalhes'} startIcon={<HiInformationCircle />} label={'Ver detalhes'} onClick={() => router.push(`vendas/detalhes-venda/${row.id}`)} />
                              </div>
                            </>
                          }
                        </TableCell>
                      </>
                    }

                    {tabIndex === 4 &&
                      // ABA REVISÃO
                      <>
                        <TableCell style={{ maxWidth: columns[1]?.minWidth }}>
                          <div className='col-data-assinatura'>
                            {row.dataAssinatura}
                          </div>
                        </TableCell>

                        <TableCell className={`col-pedido-revisao`} style={{ maxWidth: columns[4]?.minWidth }}>
                          <p>{row.dataStatusAlterado || "---"}</p>
                          <span>{row.posvendaName ? "Por " + row.posvendaName : "---"}</span>
                        </TableCell>

                        <TableCell
                          style={{ maxWidth: columns[2]?.minWidth }}
                          className={`col-dias-corridos ${calcDiasCorridos(row.dataAssinatura) > 15 ? 'red' : calcDiasCorridos(row.dataAssinatura) > 5 ? 'yellow' : 'green'}`}
                        >
                          {calcDiasCorridos(row.dataAssinatura)}
                        </TableCell>

                        <TableCell style={{ maxWidth: columns[3]?.minWidth }} className='col-icons-revisoes'>
                          <ReturnIconsTable row={row} />
                        </TableCell>

                        <TableCell style={{ maxWidth: columns[4]?.minWidth }}>
                          <div className={`col-tools ${(isHover === row.id && (userId !== row.gerenteId || userId === row.gerenteId)) ? 'visible' : 'hidden'}`}>
                            <Button size={'small'} variant={'text'} disabled={false} name={'detalhes'} startIcon={<HiInformationCircle />} label={'Ver detalhes'} onClick={() => router.push(`vendas/detalhes-venda/${row.id}`)} />
                          </div>
                          {/* <div className={`col-tools ${(isHover === row.id && userId === row.gerenteId) ? 'visible' : 'hidden'}`}>
                            <Button
                              size={'small'}
                              variant={'contained'}
                              name={'entregar'}
                              labelColor={'white'}
                              startIcon={<HiPencil />}
                              label={'Fazer correção'}
                              onClick={() => router.push(`/vendas/revisar-venda/${row.id}`)}
                            />
                          </div> */}
                        </TableCell>
                      </>
                    }

                    {(tabIndex === 5 || tabIndex === 7) &&
                      <>
                        <TableCell style={{ width: columns[2]?.minWidth }}>
                          <div className='col-data-assinatura'>
                            {row.dataAssinatura}
                          </div>
                        </TableCell>
                        <TableCell className={`col-prazo-escritura ${isHover === row.id && 'hover'} ${tabIndex === 5 ? comparaDate(row.prazoEscritura, row.statusPosVenda?.toUpperCase()) : ''} `} style={{ width: columns[4]?.minWidth }}>
                          <div>
                            <p>{row.prazoEscritura}</p>
                            <span>{comparaDate(row.prazoEscritura, row.statusPosVenda?.toUpperCase())}</span>
                          </div>
                        </TableCell>
                        <TableCell style={{ width: columns[4]?.minWidth }}>
                          <div className='col-forma-pagamento'>
                            {row.formaPagamento?.map((payment: string, index) => (
                              <div key={index}>
                                <Chip className='chip neutral' label={payment.toUpperCase()} />
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell style={{ width: columns[5]?.minWidth }}>
                          <div className='resp-pos-venda'>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: '' }} alt={row.posvendaName} />
                            <Chip className='chip neutral' label={row.posvendaName?.toUpperCase()} />
                          </div>
                        </TableCell>
                        <TableCell style={{ width: columns[6]?.minWidth }}>
                          <div className='col-status'>
                            <Chip size='small' label={row.statusPosVenda ? row.statusPosVenda.toUpperCase() : ''} className={'sucess'} />
                            <p>{row.dataPrazoPos || '---'}</p>
                          </div>
                        </TableCell>
                        <TableCell style={{ width: columns[7]?.minWidth }}>
                          <div className='col-recibo'>
                            <Link onClick={() => ShowDocument(row.imovelId, "recibo")}>{row.recibo}</Link>
                            <p>{row.origemRecibo}</p>
                          </div>
                        </TableCell>
                        <TableCell style={{ width: columns[8]?.minWidth }}>
                          {isHover === row.id &&
                            <div className='col-tools'>
                              <Button
                                size={'small'}
                                variant={'text'}
                                name={'venda-entregue'}
                                startIcon={<HiInformationCircle />}
                                label={''}
                                onClick={() => router.push(`vendas/detalhes-venda/${row.id}`)}
                              />
                            </div>
                          }
                        </TableCell>
                      </>
                    }


                  </TableRow>
                </>
              );
            })}
          </TableBody>
          : <SkeletonTableGerente tabIndex={tabIndex} />
        }
      </Table>
      {(!!rows && rows.length === 0) &&
        <TableRow
          tabIndex={-1}
          className='row-table'
        >
          <TableCell style={{border: 'none'}}>Nenhum processo encontrado</TableCell>
        </TableRow>
      }
      
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={6000}
        open={!!feedbackRestaurar.msg}
        onClose={handleCloseFeedRestaurar}
      >
        <Alert
          className='alert green'
          icon={<FaExclamationCircle size={20} />}
          onClose={handleCloseFeedRestaurar}
          severity={feedbackRestaurar.error ? "error" : "success"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {feedbackRestaurar.msg}
        </Alert>
      </Snackbar>
    </>
  )
}