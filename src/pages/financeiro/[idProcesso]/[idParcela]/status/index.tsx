import { Chip, Avatar, Link, Snackbar, Alert, Skeleton, Collapse, LinearProgress, Divider, CircularProgress } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Header from '@/components/DetalhesVenda/Header';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ChangeStatusIcon from '@/images/ChangeStatusIcon';
import ButtonComponent from '@/components/ButtonComponent';
import { CurrencyDollarIcon, ExclamationTriangleIcon, InformationCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import { HiChevronDown, HiChevronUp, HiInformationCircle, HiMiniInformationCircle } from 'react-icons/hi2';
import GroupUsers from '@/images/GroupUsers';
import BuyerIco from '@/images/Buyer_ico';
import ParcelaProcessoById from '@/apis/getParcela_Processo';
import { UserToPayType, ComissionType, ParcelaProcessoResponse, DadosProcessType, ArrayResponsaveisPagamentoType, CornerDateType } from '@/interfaces/Financeiro/Status';
import formatoMoeda from '@/functions/formatoMoedaViewApenas';
import baixarPlanilhaApoio from '@/apis/baixarPlanilhaApoio';
import CornerFinanceiro from '@/pages/financeiro/@Corners';
import DialogLiberarComissao from './@componentes/DialogLiberarComissao';
import ConfirmarPagamentoFinanceiro from '@/apis/postConfirmarPagamento';
import CheckBox from '@/components/CheckBox';
import HeadSeo from '@/components/HeadSeo';
import ShowDocument from '@/apis/getDocument';
import AlterarStatusFinanceiroParcela from '@/apis/postAlterarStatusFinanceiroParcela';
import { Check } from '@mui/icons-material';
import DialogCancelarParcela from './@componentes/DialogCancelarParcela';
import dayjs from 'dayjs';
import DialogPagamentoAtraso from './@componentes/DialogPagamentoAtraso';

interface StatusProps { idProcesso: string, idParcela: string };

type FormValues = {
  motivo: string,
  valor_pago: string,
  valor_juros: string,
  valor_multa: string,
  data_pagamento: string,
  valor_pago_atrasado?: string,
}

const Status = ({ idProcesso, idParcela }: StatusProps) => {
    const [processData, setProcessData] = useState<ParcelaProcessoResponse>();
    const [comissao, setComissao] = useState<ComissionType>();
    const router = useRouter();
    const [collapseRespo, setCollapseRespo] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openSnackbarBoleto, setOpenSnackbarBoleto] = useState(false);
    const [dialogLiberarComissao, setDialogLiberarComissao] = useState(false);
    const [dialogCancelarParcela, setDialogCancelarParcela] = useState(false);
    const [selectRateio, setSelectRateio] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [cornerData, setCornerData] = useState<CornerDateType>({
        open: false,
        title: '',
        subtitle: '',
        actionPrimary: undefined,
        labelPrimary: undefined,
        contador: undefined,
        secondaryAction: undefined,
        labelSecondary: undefined,
    });
    const [responsavelSelecionado, setResponsavelSelecionado] = useState<ArrayResponsaveisPagamentoType | null>(null);

    const retunProcess = async () => {
        setLoading(true);
        const req = { processo_id: idProcesso, parcela_id: idParcela };
        const res = await ParcelaProcessoById(req);
        if (res) {
            setProcessData(res);
            setComissao(res.comissao_geral);
            
            const pagamentoConcluido = res.parcela.responsaveis_pagamento[0] && res.parcela.responsaveis_pagamento.every(r => r.comfirmacao_pagamento === 1) && [1,2,3,4,5,6].includes(res.parcela.status.finance_status_id || 0);
            const rateioConcluido = res.usuarios_agrupado[0] && res.usuarios_agrupado.every(u => u.finance_status_id === 13) && ![8, 15].includes(res.parcela.status.finance_status_id || 0);

            if(pagamentoConcluido) {
                setCornerData({
                    open: true,
                    title: 'Pagamento concluído! :)',
                    subtitle: 'Parece que todos os pagamentos foram confirmados. Deseja mudar o status para pago?',
                    // contador: 5,
                    labelPrimary: 'Sim',
                    actionPrimary: () => alterarStatus(7),
                    labelSecondary: 'Ficar neste tela',
                    secondaryAction: () => setCornerData(prev => ({ ...prev, open: false })),
                });
            } else if (rateioConcluido) {
                setCornerData({
                    open: true,
                    title: 'Rateio concluído! :)',
                    subtitle: 'Parece que todos os rateios foram finalizados. Deseja mudar o status para concluído?',
                    // contador: 5,
                    labelPrimary: 'Sim',
                    actionPrimary: () => alterarStatus(15),
                    labelSecondary: 'Ficar neste tela',
                    secondaryAction: () => setCornerData(prev => ({ ...prev, open: false })),
                });
            }
        } else {
            <Alert severity="error">Erro ao carregar os dados do processo. Por favor, tente novamente mais tarde.</Alert>
        }
        setLoading(false);
    };

    const alterarStatus = async (id: number) => {
        setLoading(true);
        setCornerData(prev => ({ ...prev, open: false }));
        const response = await AlterarStatusFinanceiroParcela({
            parcela_id: idParcela,
            finance_status_id: id,
            observacao: '',
        });
        if (response) {
            retunProcess();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setLoading(false);
        }
    };

    const salvarSair = async () => {
        router.push('/financeiro');
    };

    const onVoltar = () => {
        router.back();
    };

    useEffect(() => {
        retunProcess();
    }, [idProcesso, idParcela]);

    const formatNumber = (value: string) => {
        if (!value) return 0;
        return Number((value.replace(/[R$.]+/g, '')).replace(",", "."));
    };

    const calcPercentTransf = (usuario: UserToPayType) => {
        const valorTransferido = usuario.valor_transferido || 0;
        const valorTotal = usuario.valor_total;
        console.log((valorTransferido / valorTotal) * 100);

        return (valorTransferido / valorTotal) * 100;
    };

    const formatarEndereco = (imovel: DadosProcessType | undefined): string => {
        if (imovel === undefined) return '';
        const { logradouro, numero, unidade, complemento, bairro, cidade, uf } = imovel;
        return `${logradouro}, ${numero},${unidade ? ' ' + unidade + ',' : ''}${complemento ? ' ' + complemento + ',' : ''} ${bairro}, ${cidade} - ${uf}`;
    };

    const returnVendedorCompradorQuant = (papel: "Vendedor" | "Comprador") => {
        const quantTotal = processData?.parcela.responsaveis_pagamento.filter(responsavel => responsavel.papel === papel).length || 0;
        const quant = processData?.parcela.responsaveis_pagamento.filter(responsavel => responsavel.papel === papel && responsavel.comfirmacao_pagamento === 1).length || 0;
        return `${quant}/${quantTotal} ${papel.toLowerCase() + (quantTotal > 1 ? 'es' : '')}`;
    };

    const isBoletoAtrasado = (dataValidade: string | null | undefined, comfirmacaoPagamento: number): boolean => {
        // O boleto não é considerado atrasado se não tiver data de validade ou se já foi pago.
        if (!dataValidade || dataValidade === '' || comfirmacaoPagamento !== 0) {
            return false;
        }
        const hoje = dayjs().startOf('day');
        const dataVencimento = dayjs(dataValidade, 'DD/MM/YYYY').startOf('day');
        return hoje.isAfter(dataVencimento);
    };

    const hasDatasBoleto = (perfil: ArrayResponsaveisPagamentoType): boolean => {
        return !!(perfil.data_emissao &&
            perfil.data_validade &&
            perfil.data_envio);
    };

    const confirmPagamento = (responsavel: ArrayResponsaveisPagamentoType, valoresAtraso?: FormValues | null) => {
        const { motivo, valor_pago, valor_juros, valor_multa, data_pagamento, valor_pago_atrasado } = valoresAtraso || {};
        // responsavel.comfirmacao_pagamento = responsavel.comfirmacao_pagamento === 1 ? 0 : 1;
        console.log(responsavel);
        if (!responsavel.id) {
            return;
        }
        setLoading(true);

        ConfirmarPagamentoFinanceiro({
            pagamento_id: responsavel.id || 0,
            parcela_id: idParcela,
            check_pagamento: responsavel.comfirmacao_pagamento,
            responsavel_id: responsavel.usuario_id || 0,
            motivo: motivo || '',
            valor_pago: valor_pago || '',
            valor_juros: valor_juros || '',
            valor_multa: valor_multa || '',
            data_pagamento: data_pagamento || '',
            valor_pago_atrasado: valor_pago_atrasado || '',
        }).then(() => {
            setOpenSnackbar(true);
            retunProcess();
        }).catch((error) => {
            console.error("Erro ao confirmar pagamento:", error);
            setLoading(false);
        });
    };

    const handleCheckboxChange = (responsavel: ArrayResponsaveisPagamentoType) => {
        // Se o boleto está atrasado e o usuário está tentando marcar como pago
        if (isBoletoAtrasado(responsavel.data_validade, responsavel.comfirmacao_pagamento) && responsavel.comfirmacao_pagamento === 0) {
            setResponsavelSelecionado(responsavel);
        } else {
            // Inverte o status e confirma o pagamento diretamente
            const responsavelAtualizado = {
                ...responsavel,
                comfirmacao_pagamento: (Number(responsavel.comfirmacao_pagamento) === 1 ? 0 : 1) as 0 | 1
            };
            confirmPagamento(responsavelAtualizado);
        }
    };

    const handleClosePagamentoAtraso = () => {
        setResponsavelSelecionado(null);
    };

    return (
        <div className='status-financeiro'>
            <HeadSeo titlePage={"Status Parcela"} description="" />
            <Header
                imovel={processData?.dados_processo || {}}
                urlVoltar={'/financeiro'}
                salvarSair={salvarSair}
                onVoltar={onVoltar}
            />
            <div className='content-container'>
                <div className='cards pagamento'>
                    <div className='header-card'>
                        <div className='ico-label'>
                            <ChangeStatusIcon className='ico-status' />
                            <h3 className='p1'>Status de pagamento</h3>
                        </div>
                        <span className='s1'>ÚLTIMA ATUALIZAÇÃO: {processData?.parcela.ultima_data_envio}</span>
                    </div>
                    <div className='content-card'>
                        <div className='status-venda'>
                            <span className='p2'>Status de venda:</span>
                            {loading
                                ? <Skeleton variant="rounded" width={80} height={18} />
                                : <Chip label={processData?.parcela.status.status_parcela} className={`chip ${processData?.parcela.status.color}`} />
                            }
                        </div>
                        <div className='actions-btns'>
                            <ButtonComponent
                                variant='outlined'
                                size='large'
                                label='Cancelar'
                                onClick={() => setDialogCancelarParcela(true)}
                                name='outlined-red'
                                startIcon={<TrashIcon width={20} height={20} />}
                            />
                            {(!!idProcesso && !!idParcela) && <ButtonComponent
                                variant='contained'
                                size='large'
                                label='Alterar status'
                                onClick={() => router.push(`/financeiro/${idProcesso}/${idParcela}/status/alterar`)}
                                disabled={loading}
                                labelColor='white'
                                name='status'
                                startIcon={<ChangeStatusIcon className='icon-status' />}
                            />}
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className='cards resumo-venda'>
                        <div className='header-card ico-label'>
                            <HiMiniInformationCircle />
                            <h3 className='p1'>Resumo da venda</h3>
                        </div>
                        <div className='content-card'>
                            <div className='row-grid'>
                                <p className='p2'>Valor DNA Imóveis</p>
                                <p className='p2'>Loja</p>

                                {loading ?
                                    <>
                                        <Skeleton variant="rounded" width={100} height={12} />
                                        <Skeleton variant="rounded" width={100} height={12} />
                                    </>

                                    :
                                    <>
                                        <span className='p2'>{formatoMoeda(processData?.resumo_venda.valor_dna) || '---'}</span>
                                        <span className='p2'>{processData?.dados_processo.loja_name || '---'}</span>
                                    </>
                                }
                            </div>

                            <div className='row-grid'>
                                <p className='p2'>Valor Benesh</p>
                                <p className='p2'>Data de assinatura</p>
                                {loading ?
                                    <>
                                        <Skeleton variant="rounded" width={100} height={12} />
                                        <Skeleton variant="rounded" width={100} height={12} />
                                    </>

                                    :
                                    <>
                                        <span className='p2'>{formatoMoeda(processData?.resumo_venda.valor_benesh)}</span>
                                        <span className='p2'>{processData?.dados_processo.data_assinatura || '---'}</span>
                                    </>
                                }
                            </div>

                            <div className='row-grid'>
                                <p className='p2'>Valor total a receber</p>
                                <div></div>
                                {/* <p className='p2'>Data prevista</p> */}
                                {loading
                                    ? <Skeleton variant="rounded" width={100} height={12} />
                                    : <span className='p2'>{formatoMoeda(processData?.resumo_venda.valor_total_dna) || '---'}</span>
                                }
                                {/* <span className='p2'>{'---'}</span> */}
                            </div>
                        </div>
                        <div className='footer-card'>
                            <ButtonComponent
                                variant='text'
                                size='small'
                                label='Ver detalhes da venda'
                                name='detalhes'
                                onClick={() => router.push(`/financeiro/${idProcesso}/detalhes-processo`)}
                            />
                        </div>
                    </div>

                    <div className='cards resumo-venda comissao'>
                        <div className='header-card ico-label'>
                            <CurrencyDollarIcon />
                            <h3 className='p1'>Comissão</h3>
                        </div>
                        <div className='content-card'>
                            <div className='row-grid'>
                                <p className='p2'>Comissão total</p>
                                <p className='p2'>Forma de pagamento</p>

                                {loading
                                    ? <>
                                        <Skeleton variant="rounded" width={100} height={12} />
                                        <Skeleton variant="rounded" width={100} height={12} />
                                    </>
                                    : <>
                                        <span className='p2'>{comissao?.valor_comissao_liquida}</span>
                                        <span className='p2'>{comissao?.liquida}</span>
                                    </>
                                }
                            </div>

                            <div className='row-grid'>
                                <p className='p2'>Deduções</p>
                                <p className='p2'>Tipo</p>

                                {loading
                                    ? <>
                                        <Skeleton variant="rounded" width={100} height={12} />
                                        <Skeleton variant="rounded" width={100} height={12} />
                                    </>
                                    : <>
                                        <span className='p2'>{comissao?.deducao || 'R$ 0,00'}</span>
                                        <div className='parcela'>
                                            <Chip label={comissao?.tipo_pagamento || 'Não informado'} className={`chip ${comissao?.tipo_pagamento ? 'green' : 'red'}`} />
                                            {!!comissao?.parcelas_empresa?.[1] && <Chip label={comissao?.parcelas_empresa.length + 'x'} className='chip green' />}
                                        </div>
                                    </>
                                }

                            </div>

                            <div className='row-grid'>
                                <p className='p2'>Comissão líquida</p>
                                <p className='p2'></p>
                                {loading
                                    ? <Skeleton variant="rounded" width={100} height={12} />
                                    : <span className='p2'>{comissao?.valor_comissao_liquida}</span>
                                }
                                <span className='p2'></span>
                            </div>
                        </div>
                        <div className='footer-card'>
                            <ButtonComponent
                                variant='text'
                                size='small'
                                label='Ver detalhes de Comissão'
                                name='detalhes'
                                onClick={() => {
                                    localStorage.setItem('detalhes-menu', '0');
                                    localStorage.setItem('detalhes-submenu', '2');
                                    router.push(`/financeiro/${idProcesso}/detalhes-processo`)}
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className='cards parcelamento'>
                    <div className='header-card p1'>
                        Parcelamento
                    </div>
                    <div className='content-card'>
                        {comissao?.parcelas_empresa?.map((parcela, index) => (
                            <div key={index} className={`card-parcela ${parcela.id.toString() === idParcela ? 'active' : 'neutral'}`}>

                                {/* CHIP É OCULTADO PELO CSS QUANDO N É A PARCELA 'active' */}
                                <Chip label={processData?.parcela.status.status_parcela || "Aguardando Pagamento"} className={`chip ${processData?.parcela.status.color || "yellow"}`} />

                                <p className='p2'>{comissao?.parcelas_empresa.length > 1 ? `Parcela ${index + 1}` : "Integral"}</p>
                                <div className='row'>
                                    <span className='s1'>R$</span>
                                    <p className='p1'>{parcela.valor_parcela?.replace("R$ ", '')}</p>
                                </div>
                                <div>
                                    <p className='p2'>Período de pagamento</p>
                                    <span className='s1'>{parcela.nome_periodo}</span>
                                </div>
                                <div>
                                    <p className='p2'>Previsão</p>
                                    <span className='s1'>{parcela.data_comissao}</span>
                                </div>

                                {/* ver planilha É OCULTADO PELO CSS QUANDO N É A PARCELA 'active' */}
                                {processData?.parcela.planilha_id
                                    ? <ButtonComponent
                                        variant='outlined'
                                        size='small'
                                        label='Ver planilha de comissão'
                                        name='planilha'
                                        onClick={() => baixarPlanilhaApoio(processData?.parcela.planilha_id || '', formatarEndereco(processData?.dados_processo))}
                                        disabled={loading || !processData?.parcela.planilha_id}
                                    />
                                    : <Alert className='alert yellow' icon={<ExclamationTriangleIcon />} >
                                        Aguardando revisão do apoio
                                    </Alert>
                                }


                                {/* ver parcela É OCULTADO PELO CSS QUANDO N É A PARCELA 'neutral' */}
                                <ButtonComponent
                                    variant='text'
                                    size='small'
                                    label='Ver status da parcela'
                                    name='status-parcela'
                                    onClick={() => router.push(`/financeiro/${idProcesso}/${parcela.id}/status`)}
                                    disabled={loading}
                                />
                            </div>
                        ))}
                    </div>

                </div>

                {!!processData?.transferencias[0] &&
                    <div className='cards comprovantes-transferencias'>
                        <h3 className='p1'>Comprovantes de transferência de rateio</h3>
                        {processData?.arrayDatasTransf.map((date, index) => (
                            <>
                                <div className='comprovantes-container'>
                                    <p className='p2 title'>Nome Completo</p>
                                    <p className='p2 title'>Envio</p>
                                    <p className='p2 title'>Valor</p>
                                    <p className='p2 title'>Nome do arquivo</p>
                                    {processData.transferencias.filter((f) => f.data_transferencia === date).map((transf) => (
                                        <>
                                            <span className='p2'>{transf.nome_destinatario}</span>
                                            <span className='p2'>{transf.data_transferencia}</span>
                                            <span className='p2'>{formatoMoeda(transf.valor_transferido || '')}</span>
                                            {/* <span className='p2'>{transf.nome_original || "---"}</span> */}
                                            {transf.comprovante_id
                                                ? <Link
                                                    className='link'
                                                    style={{ textDecoration: 'underline' }}
                                                    onClick={() => ShowDocument(transf.comprovante_id || '', 'comprovante_transferencia_comissao')}
                                                >
                                                    {transf.nome_original}
                                                </Link>
                                                : <span className='p2'>{'---'}</span>
                                            }
                                        </>
                                    ))}
                                </div>
                                {(index + 1) < processData?.arrayDatasTransf.length &&
                                    <Divider />
                                }
                            </>
                        ))}
                    </div>
                }

                <div className='cards responsaveis-pagamento'>
                    <div className='header-card'>
                        <div className='ico-label'>
                            <GroupUsers />
                            <h3 className='p1'>Responsáveis pelo pagamento</h3>
                        </div>

                        <ButtonComponent
                            variant='text'
                            size='large'
                            label=''
                            name='collapse'
                            onClick={() => setCollapseRespo((prev) => !prev)}
                            endIcon={!collapseRespo ? <HiChevronDown size={22} /> : <HiChevronUp size={22} />}
                        />
                    </div>

                    <div className='cards-container'>
                        <div className='card-pagos'>
                            <div className='header-card'>
                                <div>
                                    {
                                        processData?.parcela?.total_multa || processData?.parcela?.total_juros ?
                                        <div style={{marginBottom: '8px'}}>
                                            <Chip style={{marginLeft: '0px'}} label={`Multa - ${formatoMoeda(processData?.parcela?.total_multa)}`} className='chip yellow600' />
                                            <Chip label={`Juros - ${formatoMoeda(processData?.parcela?.total_juros)}`} className='chip yellow600' />
                                        </div>
                                        : ''
                                    }
                                    <span className='s2'>JÁ FOI PAGO: </span>
                                </div>
                                
                                <div>
                                    <Chip label={returnVendedorCompradorQuant('Vendedor')} className='chip green' />
                                    <Chip label={returnVendedorCompradorQuant("Comprador")} className='chip primary' />
                                </div>
                            </div>
                            <div className='content-card-pagos'>
                                <span className='s1'>R$</span>
                                <h3>{
                                    processData?.parcela.valor_transferido?.replace("R$", "").trim()
                                    // processData?.parcela.status.status_parcela === 'PAGO'
                                    //     ? processData?.parcela.valor_parcela?.replace("R$", "").trim()
                                    //     : processData?.parcela.valor_transferido?.replace("R$", "").trim()
                                }</h3>
                            </div>
                        </div>                        
                    </div>

                    <Collapse in={collapseRespo} className='content-card'>
                        {['Vendedor', 'Comprador'].filter((p) => processData?.parcela.responsaveis_pagamento.find(responsavel => responsavel.papel === p)).map((perfil, index) => (
                            <div className='card-responsavel' key={index}>
                                <p className='p2 perfil-nome border'>{perfil}</p>
                                <p className='s2 border'>Status</p>
                                <p className='s2 border'>Envio</p>
                                <p className='s2 border'>Vencimento</p>
                                <p className='s2 border'>Valor do boleto</p>
                                <p className='s2 border'>Arquivo</p>
                                <p className='s2 border'>Pago?</p>

                                {processData?.parcela.responsaveis_pagamento.filter(responsavel => responsavel.papel === perfil).map((responsavel, index) => (
                                    <>
                                        <span className='p2'>{responsavel.usuario_nome}</span>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                                            <Chip label={!!responsavel.comfirmacao_pagamento ? "Pago" : "Aguardando pagamento"} className={`chip ${responsavel.comfirmacao_pagamento === 1 ? 'green' : 'orange'}`} />
                                            {isBoletoAtrasado(responsavel.data_validade, responsavel.comfirmacao_pagamento) && <Chip label="Atrasado" className="chip secondary400" />}
                                        </div>
                                        
                                        <span className='p2'>{responsavel.data_envio || "Boleto não enviado"}</span>
                                        {/* <span className='p2'>{'---'}</span> */}
                                        {
                                            responsavel.data_validade ?
                                            <div>
                                                <span className='p2'>{responsavel.data_validade}</span>
                                            </div>
                                            :
                                            <span className='p2'>{'---'}</span>        
                                        }
                                        <span className='p2'>{responsavel.valor_pagamento}</span>
                                        {(responsavel.nome_boleto && responsavel.data_envio) ?
                                            <Link href={``} target='_blank' rel='noopener noreferrer'>
                                                {responsavel.nome_boleto}
                                            </Link>
                                            : <span className='p2'>---</span>
                                        }
                                        <div className='loading-check'>
                                            <CheckBox
                                                checked={responsavel.comfirmacao_pagamento === 1}
                                                // onChange={() => confirmPagamento(responsavel)}
                                                onChange={() => handleCheckboxChange(responsavel)}
                                                label=''
                                                value='confirmar-pagamento'
                                                className={`checkbox ${!hasDatasBoleto(responsavel) ? 'disabled' : ''}`}
                                                disabled={/*loading*/ !hasDatasBoleto(responsavel)}
                                            />
                                            {loading && <CircularProgress size={20} />}
                                        </div>
                                    </>
                                ))}

                            </div>
                        ))}

                    </Collapse>
                </div>

                <div className='cards rateio'>

                    <div className='header-card'>
                        <div className='ico-label'>
                            <BuyerIco />
                            <h3 className='p1'>Rateio de comissão</h3>
                        </div>

                        {processData?.parcela.planilha_id
                            ? <ButtonComponent
                                variant='contained'
                                size='small'
                                label='Ver planilha de comissão'
                                name='planilha'
                                labelColor='white'
                                onClick={() => baixarPlanilhaApoio(processData?.parcela.planilha_id || '', formatarEndereco(processData?.dados_processo))}
                            />
                            : <Alert className='alert yellow' icon={<ExclamationTriangleIcon />} >
                                Aguardando revisão do apoio
                            </Alert>
                        }


                    </div>

                    <div className='cards-container'>
                        <div className='card-rateio'>
                            <div className='header-p'>
                                <p className='s2'>Valor total de rateio</p>
                                <Chip
                                    label={
                                        !!processData?.comissao_geral?.parcelas_empresa?.[1]
                                            ? `PARCELA ${processData?.parcela.numero_parcela} DE ${processData?.comissao_geral.parcelas_empresa.length}`
                                            : 'INTEGRAL'
                                    }
                                    className='chip neutral'
                                />
                            </div>
                            <div className='valor-progress'>
                                <div className='valor'>
                                    <p className='s1'>R$</p>
                                    <h3 className='h3'>{formatoMoeda(processData?.rateio.valor_total).replace("R$", '').trim()}</h3>
                                </div>
                                <LinearProgress className='progress-bar' variant='determinate' value={Math.round(((processData?.rateio.valor_transferido || 0) / (processData?.rateio.valor_total || 0)) * 100)} />
                            </div>
                            <div className='footer-p'>
                                <p className='s2 valor'>{formatoMoeda(processData?.rateio.valor_transferido) || '0,00'}</p>
                                <p className='s2'>de</p>
                                <p className='s2 valor'>{formatoMoeda(processData?.rateio.valor_total) || '0,00'}</p>
                            </div>
                        </div>

                        <div className='card-falta-ratear'>
                            <p className='s2'>Falta ratear</p>
                            <div className='valor'>
                                <p className='s1'>R$</p>
                                <h2 className='h2'>{formatoMoeda(processData?.rateio.valor_restante).replace("R$", '').trim()}</h2>
                            </div>
                        </div>
                    </div>

                    {processData?.usuarios_agrupado?.map((usuario, index) => (
                        <div className={`pessoa-rateio ${index >= 0 ? 'hidden-recibo' : ''}`} key={index}>
                            <p className='p2'>{usuario.nome}</p>
                            <div className='valor-progress'>
                                <p className='s2 valor'>{`${formatoMoeda(usuario.valor_transferido)} de ${formatoMoeda(usuario.valor_total)}`}</p>
                                <LinearProgress className={`progress-bar ${calcPercentTransf(usuario) === 100 ? 'complete' : ''}`} variant='determinate' value={calcPercentTransf(usuario)} />
                            </div>
                            <Chip label={usuario.nome_status} className={`chip ${usuario.status_color}`} />
                            <ButtonComponent
                                variant='outlined'
                                size='small'
                                label='Ver recibo'
                                name={`recibo ${index >= 0 ? 'hidden' : ''}`}
                                // MUDAR LOGICA PARA OCULTAR QUANDO NÃO TIVER RECIBO, MUDAR TMB NA DIV PAI 'pessoa-rateio'
                                // FALTA LOGICA PARA PUXAR NOTAFISCAL OU MEI
                                // onClick={() => router.push(`/financeiro/${idProcesso}/detalhes-parcela/${idParcela}`)}
                            />

                            {/* STATUS AGUARDANDO PAGAMENTO */}
                            {(!usuario.empresa_id && (usuario.finance_status_id === 9)) &&
                                <ButtonComponent
                                    variant='contained'
                                    size='small'
                                    label='Liberar'
                                    name='liberar'
                                    onClick={() => (setSelectRateio(usuario.usuario_id), setDialogLiberarComissao(true))}
                                    disabled={loading}
                                />
                            }

                            {/* STATUS LIBERADO, SOLICITADO E EM TRANSFERENCIA */}
                            {(
                                (usuario.empresa_id
                                    ? [9, 10, 11, 12]
                                    : [10, 11, 12]
                                ).includes(usuario.finance_status_id || 0)) && (
                                    <ButtonComponent
                                        variant="contained"
                                        size="small"
                                        label="Transferir"
                                        name="transferir"
                                        onClick={() => router.push(`/financeiro/${idProcesso}/${idParcela}/status/transferir/${usuario.empresa_id ? 'empresa' : 'usuario'}/${usuario.usuario_id}`)}
                                        disabled={loading}
                                    />
                                )
                            }
                            {/* <ButtonComponent
                                variant='text'
                                size='large'
                                label=''
                                name='collapse'
                                onClick={() => setCollapseIndividual((prev) => prev === usuario.usuario_id.toString() ? '' : usuario.usuario_id.toString())}
                                endIcon={collapseIndividual === usuario.usuario_id.toString() ? <HiChevronDown size={22} /> : <HiChevronUp size={22} />}
                            /> */}
                        </div>
                    ))}
                </div>

            </div>

            {cornerData.title === 'Rateio concluído! :)' &&
                <footer className='footer-financeiro'>
                    <ButtonComponent
                        variant='contained'
                        size='large'
                        label={'Mover para concluídos'}
                        labelColor='white'
                        name='concluir-rateio'
                        onClick={cornerData.actionPrimary}
                        endIcon={loading ? <CircularProgress size={20} /> : <Check />}
                        disabled={loading}
                    />
                </footer>
            }

            <DialogLiberarComissao
                openDialog={dialogLiberarComissao}
                setOpenDialog={setDialogLiberarComissao}
                usuarioId={selectRateio}
                processData={processData}
            />

            <DialogCancelarParcela
                openDialog={dialogCancelarParcela}
                setOpenDialog={setDialogCancelarParcela}
                processData={processData}
                setCornerData={setCornerData}
                retunProcess={retunProcess}
            />

            <CornerFinanceiro
                open={cornerData.open}
                setOpen={() => setCornerData(prev => ({ ...prev, open: false }))}
                title={cornerData.title}
                subtitle={cornerData.subtitle}
                actionPrimary={cornerData.actionPrimary}
                labelPrimary={cornerData.labelPrimary}
                contador={cornerData.contador}
                secondaryAction={cornerData.secondaryAction}
                labelSecondary={cornerData.labelSecondary}
            />

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert className='alert info' onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Pagamento atualizado com sucesso!
                </Alert>
            </Snackbar>


            {/*Referente aos boletos em atraso*/}
            <DialogPagamentoAtraso
                open={!!responsavelSelecionado}
                setOpen={(isOpen) => !isOpen && handleClosePagamentoAtraso()}
                onConfirm={(valores) => {
                    if (responsavelSelecionado) {
                        const responsavelAtualizado = {
                            ...responsavelSelecionado,
                            comfirmacao_pagamento: 1 as 0 | 1 // Marcar como pago
                        };
                        confirmPagamento(responsavelAtualizado, valores);
                    }
                }}
                setOpenSnackbar={setOpenSnackbarBoleto}
                responsavelSelecionado={responsavelSelecionado}
            />

            <Snackbar
                open={openSnackbarBoleto}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbarBoleto(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert className='alert info' onClose={() => setOpenSnackbarBoleto(false)} severity="success" sx={{ width: '100%' }}>
                    Os dados do boleto foram atualizados com sucesso!
                </Alert>
            </Snackbar>
        </div>
    )
}

// EXECUTA ANTES
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso, idParcela } = context.params as { idProcesso: string, idParcela: string };
    return { props: { idProcesso, idParcela } };
};

export default Status;