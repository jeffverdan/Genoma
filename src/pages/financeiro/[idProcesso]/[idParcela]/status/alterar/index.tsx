import PostLocalizaProcesso from '@/apis/postLocalizaProcesso';
import Header from '@/components/DetalhesVenda/Header';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import ParcelaProcessoById from '@/apis/getParcela_Processo';
import { ArrayResponsaveisPagamentoType, ParcelaProcessoResponse } from '@/interfaces/Financeiro/Status';
import { Chip, Avatar, Link, Snackbar, Alert, Skeleton, Collapse, Checkbox, LinearProgress } from '@mui/material';
import InputSelect from '@/components/InputSelect/Index';
import CheckBox from '@/components/CheckBox';
import EmptyTextarea from '@/components/TextArea';
import ListaStatusFinanceiro from '@/apis/getListaStatusFinanceiro';
import { useForm } from 'react-hook-form';
import ConfirmarPagamentoFinanceiro from '@/apis/postConfirmarPagamento';
import HeadSeo from '@/components/HeadSeo';
import ButtonComponent from '@/components/ButtonComponent';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import AlterarStatusFinanceiro from '@/apis/postAlterarStatusFinanceiroRateio';
import AlterarStatusFinanceiroParcela from '@/apis/postAlterarStatusFinanceiroParcela';
import AccordionBoletosFinanceiro from '@/components/AccordionBoletosFinanceiro';
import DialogBoletosEnviados from '../@componentes/DialogBoletosEnviados';
import ShowDocument from '@/apis/getDocument';
import DialogPagamentoAtraso from '../@componentes/DialogPagamentoAtraso';
import DialogConfirmarPagamentos from '../@componentes/DialogConfirmarPagamentos';

// Estende o dayjs para suportar formatos de data customizados, como DD/MM/YYYY
dayjs.extend(customParseFormat);

interface StatusProps { idProcesso: string, idParcela: string };

interface UseFormType {
    status: string | number;
    observacao: string;
}

type FormValues = {
  motivo: string,
  valor_pago: string,
  valor_juros: string,
  valor_multa: string,
  data_pagamento: string,
}

const AlterarStatus = ({ idProcesso, idParcela }: StatusProps) => {
    const [processData, setProcessData] = useState<ParcelaProcessoResponse>();
    const [loading, setLoading] = useState<boolean>(true);
    const [listaStatus, setListaStatus] = useState<{ id: string; nome: string }[]>([{ id: '', nome: 'Selecione' }]);
    const router = useRouter();
    const [validarBtnStatus, setValidarBtnStatus] = useState<boolean>(true);
    const [isAccordionValid, setIsAccordionValid] = useState<boolean>(false);
    const [openBoletosEnviados, setOpenBoletosEnviados] = useState<boolean>(false);
    const [qtdBoletosEnviados, setQtdBoletosEnviados] = useState<number>(0);
    const [responsavelSelecionado, setResponsavelSelecionado] = useState<ArrayResponsaveisPagamentoType | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [openConfirmarPagamento, setOpenConfirmarPagamento] = useState<boolean>(false);
    const [idResponsavelBoletoEditado, setIdResponsavelBoletoEditado] = useState<number[] | null>(null);

    const {
        register,
        watch,
        setValue,
        setError,
        formState: { errors },
        handleSubmit,
    } = useForm<UseFormType>({
        defaultValues: {
            status: '',
            observacao: '',
        },
    });

    useEffect(() => {
        requestAnimationFrame(() => {
            const scroller = document.querySelector<HTMLDivElement>("#__next");
            scroller?.scrollTo({ top: 0, behavior: "smooth" });
        });
    }, []);

    useEffect(() => {
        retunProcess();
    }, [idProcesso]);

    // console.log('watch: ', watch())

    const salvarSair = async () => {
        router.push('/financeiro');
    };

    const onVoltar = () => {
        router.back();
    };

    const retunProcess = async () => {
        setLoading(true);
        const req = { processo_id: idProcesso, parcela_id: idParcela };
        const res = await ParcelaProcessoById(req);
        if (res) {
            setProcessData(res);
        }
        if (listaStatus.length === 1) {
            const list = await ListaStatusFinanceiro() || [];
            console.log(list);

            if (list) {
                setListaStatus([{ id: '', nome: 'Selecione' }, ...list]);
            }
        }
        setLoading(false);
    };

    const confirmPagamento = (responsavel: ArrayResponsaveisPagamentoType, valoresAtraso?: FormValues | null) => {
        if (!responsavel.id) return;
        const { motivo, valor_pago, valor_juros, valor_multa, data_pagamento } = valoresAtraso || {};
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
        }).then(() => {
            // setOpenSnackbar(true);
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

    // console.log('responsavelSelecionado: ', responsavelSelecionado);

    const returnVendedorCompradorQuant = (papel: "Vendedor" | "Comprador") => {
        const quantTotal = processData?.parcela.responsaveis_pagamento.filter(responsavel => responsavel.papel === papel).length || 0;
        const quant = processData?.parcela.responsaveis_pagamento.filter(responsavel => responsavel.papel === papel && responsavel.comfirmacao_pagamento === 1).length || 0;
        return `${quant}/${quantTotal} ${papel.toLowerCase() + (quantTotal > 1 ? 'es' : '')}`;
    };

    const validarBtn = async () => {
        const boletosPagos = processData?.parcela?.responsaveis_pagamento.some(responsavel => responsavel.comfirmacao_pagamento === 0);
        // console.log('boletosPagos: ', boletosPagos);

        if(watch('status') === 5 && processData?.parcela.responsaveis_pagamento.length === 0) {
            setValidarBtnStatus(true);
        }
        else if(watch('status') === 5) {
            // Verifica se PELO MENOS UM responsável tem as três datas preenchidas
            const pelomenosUmComDatas = processData?.parcela.responsaveis_pagamento.some(responsavel => 
                responsavel.data_emissao !== null && 
                responsavel.data_emissao !== '' &&
                responsavel.data_validade !== null && 
                responsavel.data_validade !== '' &&
                responsavel.data_envio !== null &&
                responsavel.data_envio !== ''
            );
            // console.log('pelomenosUmComDatas: ', pelomenosUmComDatas);
            setValidarBtnStatus(!pelomenosUmComDatas); // false se pelo menos um tiver datas (habilita botão), true se nenhum tiver (desabilita)

            const quantidadeBoletosEnviados = processData?.parcela.responsaveis_pagamento.filter(responsavel => 
                responsavel.data_emissao !== null && 
                responsavel.data_emissao !== '' &&
                responsavel.data_validade !== null && 
                responsavel.data_validade !== '' &&
                responsavel.data_envio !== null &&
                responsavel.data_envio !== ''
            ).length || 0;
            // console.log('quantidadeBoletosEnviados: ', quantidadeBoletosEnviados);
            setQtdBoletosEnviados(quantidadeBoletosEnviados);
        }   
        else if(watch('status') === 7 
            && processData?.parcela.responsaveis_pagamento.length === 0 
            && processData?.parcela.status.finance_status_id !== 5
        ) {
            setValidarBtnStatus(true);
        }
        else if(watch('status') === 7 && processData?.parcela?.responsaveis_pagamento.some(responsavel => responsavel.comfirmacao_pagamento === 0)) {
            setValidarBtnStatus(true);
        }
        else {
            setValidarBtnStatus(false);
        }
    }

    useEffect(() => {
        validarBtn();
    }, [watch('status'), validarBtnStatus, loading, processData])

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

    return (
        <div className='container-alterar-status'>
            <HeadSeo titlePage={"Alterar Status"} description="" />
            <Header
                urlVoltar={'/posvenda'}
                salvarSair={salvarSair}
                imovel={processData?.dados_processo}
                onVoltar={onVoltar}
            />
            <div className='content-alterar-status'>
                <div className='card-status'>
                    <h3 className='h3'>Atualizar status</h3>
                    <div className='status-venda'>
                        <span className='p2'>Status de comissão atual:</span>

                        {loading
                            ? <Skeleton variant="rounded" width={80} height={18} />
                            : <Chip label={processData?.parcela.status.status_parcela} className={`chip ${processData?.parcela.status.color || 'neutral'}`} />
                        }
                    </div>
                    <InputSelect
                        label={'Status'}
                        disabled={loading}
                        // loading={loading}
                        option={listaStatus}
                        value={watch('status') || ''}
                        {...register('status', {
                            required: 'Selecione o status',
                        })}
                    />

                    { (watch('status') === 5 && processData?.parcela.responsaveis_pagamento.length === 0) && 
                        <Alert className="alert yellow" severity="warning">”Não foi definido um responsável para realizar o pagamento dessa parcela. Trate com o gerente da venda para que ele possa indicar as pessoas responsáveis.</Alert> 
                    }
                    { ( watch('status') === 7 && (!processData?.parcela?.boleto_enviado)) && 
                        <Alert className="alert yellow" severity="warning">Não é possível atualizar para o status de pagamento. É necessário que ao menos um boleto seja enviado contra cada responsável pelo pagamento.</Alert>
                    }

                    
                </div>

                {( watch('status') === 7 && (processData?.parcela?.boleto_enviado) ) && <div className='card-responsaveis'>
                    <h3 className='h3'>Confirme se todos os boletos foram<br/> pagos pelos envolvidos:</h3>
                    {(['Vendedor', 'Comprador'] as const).filter((p) => processData?.parcela.responsaveis_pagamento.find(responsavel => responsavel.papel === p)).map((type, index) =>
                        <div className='responsaveis-div' key={type}>
                            <div className='responsaveis-header'>
                                <p className='p2'>{type}</p>
                                <Chip label={returnVendedorCompradorQuant(type)} className={`chip ${index < 1 ? 'green' : 'primary'}`} />
                            </div>
                            {processData?.parcela.responsaveis_pagamento?.filter(responsavel => responsavel.papel === type)?.map((perfil) => (
                                <div className={`${!hasDatasBoleto(perfil) ? 'responsavel-disabled' : 'responsavel-row'}`} key={perfil.id}>
                                    <CheckBox
                                        label={``}
                                        className={`checkbox ${!hasDatasBoleto(perfil) ? 'disabled' : ''}`}
                                        value={'comfirmacao_pagamento'}
                                        checked={perfil.comfirmacao_pagamento === 1}
                                        onChange={() => handleCheckboxChange(perfil)}
                                        disabled={!hasDatasBoleto(perfil)}
                                    />
                                    <p className='p2'>{perfil.usuario_nome}</p>
                                    <p className='p2'>{perfil.valor_pagamento}</p>
                                    {
                                        hasDatasBoleto(perfil) ?
                                            <Link key={perfil.boleto_id} className='link' onClick={() => ShowDocument(String(perfil.boleto_id), 'documento')} rel='noopener noreferrer'>
                                                {perfil.nome_boleto}
                                            </Link>
                                        :
                                        <Chip label="Boleto não enviado" className="chip neutral500" />
                                    }
                                    {
                                        isBoletoAtrasado(perfil.data_validade, perfil.comfirmacao_pagamento) &&
                                        <Chip label="Atrasado" className="chip secondary400" />
                                    }
                                </div>
                            ))}
                        </div>
                    )}

                </div>}

                {( watch('status') === 5 && processData?.parcela.responsaveis_pagamento.length !== 0) && <div className='card-responsaveis'>
                    <h3 className='h3'>Envie os boletos quando estiverem disponíveis</h3>
                    <p className="p2">Não é preciso enviar todos os boletos agora. Adicione apenas os que já estão pagos</p>
                    

                    <AccordionBoletosFinanceiro processData={processData} retunProcess={retunProcess} idResponsavelBoletoEditado={idResponsavelBoletoEditado} setIdResponsavelBoletoEditado={setIdResponsavelBoletoEditado} />
                </div>}

                <div className='card-observacoes'>
                    <div className='title'>
                        <h3 className='h3'>Observação para o gerente</h3>
                        <p className='p1'>As informações colocadas abaixo serão enviadas ao gerente juntamente com a notificação de mudança de status.</p>
                    </div>
                    <EmptyTextarea
                        minRows={3}
                        placeholder='Digite aqui...'
                        label='Escreva a observação livremente'
                        value={watch('observacao') || ''}
                        // maxChars={500}
                        {...register('observacao', {
                            onChange: (e) => setValue('observacao', e.target.value),
                        })}
                    />
                </div>

            </div>

            <footer>
                <ButtonComponent
                    variant='contained'
                    label='Atualizar status'
                    labelColor='white'
                    size='large'
                    disabled={watch('status') === 5 || watch('status') === 7 ? validarBtnStatus : loading }
                    endIcon={<ArrowRightIcon />}
                    onClick={handleSubmit(async (data) => {
                        if (!data.status || data.status === '') {
                            setError('status', { type: 'manual', message: 'Selecione o status' });
                            return;
                        }
                        setLoading(true);
                        const response = await AlterarStatusFinanceiroParcela({
                            parcela_id: idParcela,
                            finance_status_id: data.status,
                            observacao: data.observacao,
                            responsaveis_boletos_editados: idResponsavelBoletoEditado || null // Usando quando precisa passar os ids dos responsáveis com boletos editados
                        });
                        if (response) {
                            // Se o status for 5 (Boleto Enviado), abre o modal e redireciona por ele
                            watch('status') === 5 
                                ? setOpenBoletosEnviados(true) 
                                : router.back();
                            // router.back();
                        } else {
                            setLoading(false);
                        }
                    })}
                />
            </footer>

            <DialogBoletosEnviados 
                open={openBoletosEnviados} 
                setOpen={setOpenBoletosEnviados} 
                qtdBoletosEnviados={qtdBoletosEnviados}
            />

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
                responsavelSelecionado={responsavelSelecionado}
                setOpenSnackbar={setOpenSnackbar}
            />

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert className='alert info' onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Os dados do boleto foram atualizados com sucesso!
                </Alert>
            </Snackbar>

            {/*Para confirmar os boletos em atraso*/}
            {/* <DialogConfirmarPagamentos
                open={openConfirmarPagamento}
                setOpen={setOpenConfirmarPagamento}
                refresh={retunProcess}
            /> */}
        </div>
    );
};


// EXECUTA ANTES
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso, idParcela } = context.params as { idProcesso: string, idParcela: string };
    return { props: { idProcesso, idParcela } };
};

export default AlterarStatus;