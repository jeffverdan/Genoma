// import Link from 'next/link';
import { HiCheckCircle, HiDotsCircleHorizontal, HiX } from 'react-icons/hi';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Alert, Chip, CircularProgress, Paper, Skeleton } from '@mui/material';

import axiosInstance from '@/http/axiosInterceptorInstance';
import { AxiosResponse } from 'axios';

import getProcesso from '@/apis/getProcesso';
import HeadSeo from '@/components/HeadSeo';
import Header from '@/components/GG_Gerentes/Header';
import ButtonComponent from '@/components/ButtonComponent';

import imovelDataInterface from '@/interfaces/Imovel/imovelData'
import getEnvelopeDetails from '@/apis/getEnvelopeDetails';

import { HiArrowPath } from 'react-icons/hi2';
import Corner from '@/components/Corner';
import SimpleDialog from '@/components/Dialog';
import cancelarDocusign from '@/apis/cancelarDocusign';
import EmptyTextarea from '@/components/TextArea';
import { FaExclamationCircle } from 'react-icons/fa';
import { Step } from 'react-joyride';
import OnboardingJoyride from '@/components/Onboarding_Joyride';

const Checkout = ({ idProcesso }: { idProcesso: any }) => {
    const [loading, setLoading] = useState(false);
    const [imovelData, setImovelData] = useState<imovelDataInterface>({});
    const router = useRouter();
    const [envelopeAssinaturas, setEnvelopeAssinaturas] = useState<any>([]);
    const [suspense, setSuspense] = useState<boolean>(false);
    const [cornerType, setCornerType] = useState('')
    const [openDialogSolicitacao, setOpenDialogSolicitacao] = useState<boolean>(false);
    const [nomeEnvelope, setNomeEnvelope] = useState('');
    const [emailEnvelope, setEmailEnvelope] = useState('');
    const [idEnvelope, setIdEnvelope] = useState('');
    const [openCancelar, setOpenCancelar] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);
    const [error, setError] = useState('');

    const { register, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            motivoCancelamento: ''
        }
    });

    const getImovelData = async (type: string) => {
        setLoading(true);

        const data = await getProcesso(idProcesso, router) as any;

        const envelopeId: any = data.envelope_id || '';
        setIdEnvelope(envelopeId);
        const resDocuSign: any = await getEnvelopeDetails(envelopeId);
        if (data.status_rascunho_id === 3) {
            if (resDocuSign?.quantidade_nao_assinantes === 0 && type === '') {
                setSuspense(true);
                router.push('/403')
            }
            else if (resDocuSign?.quantidade_nao_assinantes === 0 && type === 'atualizar') {
                setCornerType('feedback-assinaturas-docusign');
                setOpenDialogSolicitacao(true);
                setSuspense(false);
            }
            else {
                setSuspense(false);
            }

            await getEnvelope(resDocuSign);


            setImovelData(data as imovelDataInterface);
        } else {
            router.push('/vendas')
        }


        setLoading(false);
    };

    const getEnvelope = async (resDocuSign: any) => {
        const naoAssinados = resDocuSign?.nao_assinados.map((usuario: any) => usuario);
        const assinados = resDocuSign?.assinados.map((usuario: any) => usuario);

        const usuariosCompleted = [
            {
                nao_assinado:
                    naoAssinados?.map((dados: any) => ({
                        nome: dados?.nome,
                        usuario_id: dados?.usuario_id,
                        email: dados?.email
                        // data_assinatura: dados.signedDateTime ? formatData(dados.signedDateTime) : '',
                        // hora_assinatura: dados.signedDateTime ? formatHora(dados.signedDateTime) : '',
                        // status: dados.status
                    }))
                ,
                assinados:
                    assinados?.map((dados: any) => ({
                        nome: dados?.nome,
                        email: dados?.email,
                        data_assinatura: dados.data_assinatura ? formatData(dados.data_assinatura) : '',
                        hora_assinatura: dados.data_assinatura ? formatHora(dados.data_assinatura) : '',
                        //status: dados.status
                    }))
            }
        ];

        const arrEnvelope: any = {
            data_envio_email: formatData(resDocuSign?.data_envio),
            hora_envio_email: formatHora(resDocuSign?.data_envio),
            usuarios: usuariosCompleted,
            assinaturas_pendentes: resDocuSign?.quantidade_nao_assinantes
        }
        console.log(arrEnvelope)
        setEnvelopeAssinaturas(arrEnvelope);
    };

    useEffect(() => {
        getImovelData('');
    }, []);

    function formatData(sentDateTime: string) {
        const dataHoraSent = new Date(sentDateTime);

        // Subtrair 3 horas no horário local
        dataHoraSent.setHours(dataHoraSent.getHours() - 3);

        const dia = String(dataHoraSent.getDate()).padStart(2, '0');
        const mes = String(dataHoraSent.getMonth() + 1).padStart(2, '0'); // Os meses são baseados em zero
        const ano = dataHoraSent.getFullYear();
        const dataSentFormat = `${dia}/${mes}/${ano}`;
        return dataSentFormat;
    };

    function formatHora(sentDateTime: string) {
        const dataHoraSent = new Date(sentDateTime);

        // Subtrair 3 horas no horário local
        dataHoraSent.setHours(dataHoraSent.getHours() - 3);

        const horas = String(dataHoraSent.getUTCHours()).padStart(2, '0');
        const minutos = String(dataHoraSent.getUTCMinutes()).padStart(2, '0');
        const horaSentFormat = `${horas}h${minutos}`;
        return horaSentFormat
    };

    const reenviar_email_docusign = async (usuario_id: number, nomeEnvelope: string, emailEnvelope: string) => {
        console.log(usuario_id, idEnvelope);
        setNomeEnvelope(nomeEnvelope);
        setEmailEnvelope(emailEnvelope);

        await axiosInstance.post('reenviar_email_docusign', {
            'usuario_id': usuario_id,
            'envelopeId': idEnvelope
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(async (res: AxiosResponse) => {
                setCornerType('reenviar-docsign')
                setOpenDialogSolicitacao(true)
                console.log("Retorna Processo ", res);
            })
            .catch(err => {
                console.log(err);
                // router.push('/403')
            })
        return;

    };

    const onCancelar = async () => {
        setLoadingCancel(true);
        setError('');
        const res = await cancelarDocusign({
            envelopeId: idEnvelope,
            justificativa_cancelamento: watch('motivoCancelamento')
        }) as unknown as { status: boolean, msg: string };
        if (res?.status) {
            router.push('/vendas');
        } else {
            const msgError = res?.msg ? res.msg :
                !idEnvelope ? 'Envelope não encontrado' :
                    !watch('motivoCancelamento') ? 'Deve ser informado o motivo do cancelamento' : 'Contate o suporte';
            setError(msgError);
        }
        setLoadingCancel(false);
    };


    const onTextAreaChange = (e: string) => {
        if (e.length < 200) setValue('motivoCancelamento', e);
    };

    const steps: Step[] = [
        {
            target: '.sign-step',
            content: 'Agora é só aguardar que todas as partes assinem o documento.',
            placement: 'top',
            title: 'Assinaturas',
        },
        {
            target: '.btn-reenviar',
            content: 'Se achar necessário, reenvie o e-mail com o link para a assinatura do recibo.',
            placement: 'top',
            title: 'Reenviar e-mail',
        },
        {
            target: '.btn-cancelar',
            content: 'Caso precise cancelar, basta clicar aqui.',
            placement: 'left',
            title: 'Cancelar Envelope',
        },
        {
            target: '.msg-motivo',
            content: 'Ao cancelar, é importante fornecer uma justificativa clara tanto para o cliente quanto para todos que receberam o e-mail com a assinatura anteriormente.',
            placement: 'left',
            title: 'Justifique',
        },
    ];

    const [stepIndex, setStepIndex] = useState(0);

    const onClickCancelarBtn = () => {
        setOpenCancelar(true);        
        setTimeout(() => {
            setStepIndex(3);
        }, 400);        
    };

    useEffect(() => {
        console.log(stepIndex);        
        if(stepIndex === 3) setOpenCancelar(true);
        // else setOpenCancelar(false);
    },[stepIndex]);

    return (
        suspense === false &&
        <>
            <HeadSeo titlePage={"Checkout DocuSign"} description='Checkout Docusign' />
            <Header imovel={imovelData} urlVoltar={`/vendas`} urlSair={''} title={'acompanhe o fluxo do DocuSign!'} />
            {(!!idEnvelope && !!imovelData) && <OnboardingJoyride steps={steps} indexProps={stepIndex} setIndexProps={setStepIndex} indexActionsBtn={[3]} />}
            <div className='entregar-venda checkout-venda'>
                <Paper elevation={0} className='content-entregar'>
                    <Paper className='card-entregar card1 sign-step' elevation={1}>
                        <div className='cancelar-container'>
                            <Chip size='small' label={envelopeAssinaturas?.assinaturas_pendentes === 0 ? 'PRONTO' : "FAZENDO"} className={`chip ${envelopeAssinaturas?.assinaturas_pendentes === 0 ? 'sucess' : 'fazendo'}`} />
                            <ButtonComponent
                                size={'medium'}
                                variant={'contained'}
                                name={'cancelar-envelope btn-cancelar'}
                                // disabled={envelopeAssinaturas?.assinaturas_pendentes > 0 ? false : true}
                                onClick={onClickCancelarBtn}
                                label={'Cancelar Envelope'}
                                startIcon={<HiX />}
                            />
                        </div>
                        <h2>Coleta das assinaturas por DocuSign</h2>
                        <div className='atualizar-lista' style={{ marginBottom: '25px' }}>
                            <ButtonComponent
                                size={'medium'}
                                variant={'text'}
                                name={'atualizar-painel'}
                                onClick={() => getImovelData('atualizar')}
                                label={'Atualizar'}
                                startIcon={<HiArrowPath className={`rotate-primary ${loading ? 'rotate' : ''}`} />}
                            />
                        </div>
                        {
                            envelopeAssinaturas?.data_envio_email ?
                                <div className='checkout'>
                                    <ul className="steps">
                                        <li className="step">
                                            <div className="icon">
                                                <HiCheckCircle className="check-icon" size={32} />
                                            </div>
                                            <div className="text"><span>{envelopeAssinaturas?.data_envio_email}, {envelopeAssinaturas?.hora_envio_email} -</span> E-mails com o recibo de sinal, foram disparados para os envolvidos.</div>
                                        </li>

                                        {
                                            envelopeAssinaturas?.usuarios[0]?.nao_assinado?.length > 0 &&
                                            <>
                                                <li className="step-line"></li>
                                                <li className="step">
                                                    <div className="icon">
                                                        <HiDotsCircleHorizontal className="dot-icon" size={32} />
                                                    </div>
                                                    <div className="text">As partes estão revisando o documento para assinar.</div>
                                                </li>
                                            </>
                                        }

                                        <ul className="steps internal-step">
                                            {
                                                envelopeAssinaturas?.usuarios[0]?.assinados?.length > 0 &&
                                                envelopeAssinaturas?.usuarios[0].assinados?.map((envelope: any, index: number) => (
                                                    <li key={index} className="step">
                                                        <div className="row">
                                                            <div className="icon">
                                                                <HiCheckCircle className="check-icon" size={32} />
                                                            </div>
                                                            <div className="text"><span>{envelope.data_assinatura}, {envelope.hora_assinatura} - {envelope.nome} ({envelope.email}) </span> assinou o recibo!</div>
                                                        </div>
                                                    </li>
                                                ))
                                            }

                                            {
                                                envelopeAssinaturas?.usuarios[0]?.nao_assinado?.length > 0 &&
                                                envelopeAssinaturas?.usuarios[0].nao_assinado?.map((envelope: any, index: number) => (
                                                    <li key={index} className="step">
                                                        <div className="row">
                                                            <div className="icon">
                                                                <HiDotsCircleHorizontal className="dot-icon" size={32} />
                                                            </div>
                                                            <div className="text"><span>{envelope.nome}</span> ({envelope.email}) ainda não assinou o recibo.</div>
                                                        </div>

                                                        {/*  <ButtonComponent size={'small'} variant={'outlined'} label={'Reenviar documento'} onClick={e => reenviar_email_docusign(envelope.usuario_id)} /> */}
                                                        <ButtonComponent
                                                            style={{ marginLeft: '15px' }}
                                                            size={'small'}
                                                            variant={'contained'}
                                                            name={index === 0 ? ' btn-reenviar' : ''}
                                                            labelColor={'white'}
                                                            /* startIcon={<HiCheck />} */
                                                            label={'Reenviar'}
                                                            onClick={e => reenviar_email_docusign(envelope.usuario_id, envelope.nome, envelope.email)} />
                                                    </li>
                                                ))
                                            }
                                        </ul>

                                        {/*Quando finalizar vai ficar verde com uma mensagem de conclusão*/}
                                        {
                                            envelopeAssinaturas?.assinaturas_pendentes === 0 &&
                                            <li className="step">
                                                <div className="icon">
                                                    <HiCheckCircle className="check-icon" size={32} />
                                                </div>
                                                <div className="text text-2">Assinaturas concluídas</div>
                                            </li>
                                        }
                                    </ul>
                                </div>
                                :
                                <>
                                    <Skeleton animation='wave' width={600} height={20} />
                                    <div style={{ height: '22px' }}></div>
                                    <Skeleton animation='wave' width={600} height={20} />
                                    <Skeleton animation='wave' width={600} height={100} />
                                </>
                        }

                        <SimpleDialog
                            open={openCancelar}
                            onClose={() => setOpenCancelar(false)}
                            className='modal-remover'
                            title="Cancelar envelope?"
                            Footer={<div className='flex gap20'>
                                <ButtonComponent
                                    size={'medium'}
                                    variant={'text'}
                                    name={'voltar'}
                                    disabled={loadingCancel}
                                    onClick={() => setOpenCancelar(false)}
                                    label={'Voltar'}
                                />
                                <ButtonComponent
                                    size={'medium'}
                                    variant={'contained'}
                                    name={'cancelar-envelope'}
                                    labelColor='white'
                                    disabled={loadingCancel || watch('motivoCancelamento').length < 10}
                                    onClick={() => onCancelar()}
                                    label={'Sim, cancelar'}
                                    endIcon={loadingCancel ? <CircularProgress size={20} /> : ''}
                                />
                            </div>}
                        >
                            <div className='dialog-content'>
                                <p className='s1'>Ao cancelar o envelope, as assinaturas não serão mais coletadas.</p>
                                <p className='s1'>Você pode criar um novo se necessário.</p>

                                <EmptyTextarea
                                    minRows={2}
                                    label='Justifique o cancelamento do envelope'
                                    placeholder='Ex.: Mudança de cláusula.'
                                    className='msg-motivo'
                                    error={!!errors.motivoCancelamento}
                                    {...register('motivoCancelamento', { required: 'Campo obrigatório' })}
                                    value={watch('motivoCancelamento')}
                                    onChange={(e) => onTextAreaChange(e.target.value)}
                                    maxChars={200}
                                />

                                <div className='alerts'>
                                    <Alert
                                        className='alert yellow'
                                        icon={<FaExclamationCircle size={20} />}
                                        // onClose={handleCloseTips}
                                        //severity={feedbackRestaurar.error ? "error" : "success"}s
                                        variant="filled"
                                        sx={{ width: '100%' }}
                                    >
                                        Fique atento, os clientes finais terão acesso ao que você escrever.
                                    </Alert>
                                    <Alert
                                        className='alert yellow'
                                        icon={<FaExclamationCircle size={20} />}
                                        // onClose={handleCloseTips}
                                        //severity={feedbackRestaurar.error ? "error" : "success"}
                                        variant="filled"
                                        sx={{ width: '100%' }}
                                    >
                                        Você deve justificar o cancelamento escrevendo de 10 a 200 caracteres.
                                    </Alert>
                                </div>

                                {error && <p className='error'>Parece que tivemos um problema: {error}</p>}
                            </div>
                        </SimpleDialog>
                    </Paper>
                </Paper>

                <Corner
                    open={openDialogSolicitacao}
                    setOpen={setOpenDialogSolicitacao}
                    vertical="bottom"
                    horizontal="right"
                    direction="up"
                    type={cornerType}
                    className='bottom-10'
                    idProcesso={Number(idProcesso)}
                    value={nomeEnvelope}
                    emailEnvelope={emailEnvelope}
                />
            </div>
        </>
    )
}

// EXECUTA ANTES DO DASHBOARD
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso } = context.params as { idProcesso: string };
    return { props: { idProcesso } };
};

export default Checkout;