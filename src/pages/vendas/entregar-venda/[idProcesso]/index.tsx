import { CheckIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Joyride, { Placement, Step, TooltipRenderProps } from 'react-joyride';
import { useRouter } from 'next/router';
import { Chip, Paper } from '@mui/material';
import getProcesso from '@/apis/getProcesso';

import HeadSeo from '@/components/HeadSeo';
import Header from '@/components/GG_Gerentes/Header';
import ButtonComponent from '@/components/ButtonComponent';
import RadioGroup from '@/components/RadioGroup';
import UploadDocumentos from '@/components/UploadDocumentos';
import ReciboManual from '@/images/recibo-manual.svg';
import ReciboDocusign from '@/images/recibo-docusign.svg';

import imovelDataInterface from '@/interfaces/Imovel/imovelData'
import { MultiDocsType } from '@/components/UploadDocumentos/Interfaces';
import saveCheckReciboType from '@/apis/saveCheckReciboType';
import { ArrowBack, ArrowForward, Check } from '@mui/icons-material';
import OnboardingJoyride from '@/components/Onboarding_Joyride';
interface FormValues {
    imovel_id: string | undefined,
    processo_id: string | number
    informacao_imovel_id: string | number
    reciboType: 'manual' | 'docusign',
    posvenda_franquia: '0',
}

const EntregarVendaLeituraIA = ({ idProcesso }: { idProcesso: string }) => {
    const [loading, setLoading] = useState(false);
    const [loadingView, setLoadingView] = useState(true);
    const [imovelData, setImovelData] = useState<imovelDataInterface>({});
    const router = useRouter();
    const [multiDocs, setMultiDocs] = useState<MultiDocsType[]>([]);
    const [addRecibo, setAddRecibo] = useState<boolean>(false);

    const dataContext = {
        dataProcesso: imovelData,
        selectItem: '',
        idProcesso: imovelData.id || '',
        multiDocs,
        setMultiDocs
    };

    const MsgRecibo = () => (
        <>
            <span className='bold'>Importante: </span>
            <span>sempre revise os dados cadastrais da venda com as informações do Recibo de Sinal assinado e enviado na plataforma. Dessa forma </span>
            <span className='bold'>você evita atrasos </span>
            <span>na sua venda, por </span>
            <span className='bold'>devoluções </span>
            <span>do time de Pós-venda.</span>
        </>
    )

    console.log('IMOVEL DATA: ', imovelData);
    console.log('RECIBO TYPE: ', imovelData?.informacao?.recibo_type)

    const {
        register,
        watch,
        setValue,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
            informacao_imovel_id: imovelData.informacao?.id,
            reciboType: imovelData?.informacao?.recibo_type || 'manual',
        }
    });

    console.log('WATCH: ', watch());

    const getImovelData = async () => {
        setLoading(true);
        const data = await getProcesso(idProcesso, router) as any;
        console.log(data);


        setValue('reciboType', data?.informacao?.recibo_type || 'manual');
        if (data) {
            // const perfil_login = localStorage.getItem('perfil_login_id');
            // const statusID = data.status[0].id // 12 - Venda incompleta
            // console.log(statusID);
            // const perfilGerente = perfil_login === '3' || perfil_login === '4';
            // if ((!data.status_rascunho_id || (statusID !== 12 && statusID !== 15)) && perfilGerente) router.push('/vendas')
            // else if (data.status_rascunho_id === 1 && perfil_login === '3') router.push(`/vendas/gerar-venda/${idProcesso}/dashboard/`)

            setImovelData(data as imovelDataInterface);
        }

        setLoading(false);
        setLoadingView(false);
    };

    useEffect(() => {
        getImovelData();
    }, []);

    const [reciboManual, setReciboManual] = useState([
        { value: 'manual', disabled: false, label: 'Enviar o recibo já assinado', checked: false },
    ]);

    const [reciboDocusign, setReciboDocusign] = useState([
        { value: 'docusign', disabled: false, label: 'Aguardar as assinaturas', checked: false },
    ]);

    const downloadRecibo = async () => {
        router.push('/vendas/gerar-venda/' + idProcesso + '/dashboard/recibo/')
    };

    const handleEnviarVenda = async () => {
        setLoading(true);
        router.push(`${imovelData.id}/evaluating`);
    };

    const saveCheck = async () => {
        if (imovelData.informacao?.id) {
            setValue('informacao_imovel_id', imovelData.informacao.id);
            const res = await saveCheckReciboType(watch());
            console.log(res);
        }
    };

    useEffect(() => {
        if (imovelData) saveCheck();
    }, [watch('reciboType')]);


    const steps: Step[] = [
        {
            target: '.manual-step',
            content: 'Selecione essa opção se a coleta de assinaturas foi manual.',
            placement: 'top',
            title: 'Assinatura Manual',
        },
        {
            target: '.docusign-step',
            content: 'Você pode utilizar o docusign para facilitar a coleta de assinatura e agilizar seu trabalho.',
            placement: 'top',
            title: 'Assinatura Docusign',
        },
        {
            target: '.upload-step',
            content: 'Faça o upload do recibo de sinal para a IA checar se os dados estão corretos.',
            placement: 'top',
            title: 'Recibo de Sinal',
        },
    ];

    return (

        <>
            <HeadSeo titlePage={"Entregar Venda"} description='Entrega da venda' />
            <Header
                imovel={imovelData}
                urlVoltar={`/vendas/gerar-venda/${idProcesso}/dashboard/`}
                urlSair={'/vendas'}
                title={'agora você pode entregar a sua venda!'}
            />
            {!loadingView &&
                <OnboardingJoyride
                    steps={steps}
                />}
            <div className='entregar-venda'>
                {
                    !loadingView &&
                    <Paper elevation={0} className='content-entregar'>
                        <Paper className='card-entregar card1' elevation={1}>
                            {/* <Chip size='small' label="ETAPA 1" className='chip sucess' /> */}
                            <h2>Como você gostaria de fazer a entrega do Recibo de Sinal?</h2>
                            <div className='recibo-options'>
                                <Paper className='card-recibo manual-step' id=''>
                                    <Chip size='small' label="MANUAL" className='chip-recibo' />
                                    <Image src={ReciboManual} alt={'Recibo Manual'} />
                                    <div>
                                        <h3>Coletar as assinaturas e enviar o Recibo de Sinal manualmente</h3>
                                        <p>Com o Recibo de Sinal assinado à mão pelas partes,<b> você terá que digitalizar e realizar o Upload desse documento</b> na plataforma.</p>
                                    </div>
                                    <RadioGroup label={''} options={reciboManual} setOptions={setReciboManual} name='reciboType' value={watch('reciboType')} setValue={setValue} />

                                </Paper>

                                <Paper className='card-recibo docusign-step'>
                                    <Chip size='small' label="DOCUSIGN" className='chip-recibo' />
                                    <Image src={ReciboDocusign} alt={'Recibo Docusign'} />
                                    <div>
                                        <h3>Enviar o recibo pelo DocuSign e aguardar assinaturas digitalmente</h3>
                                        <p>
                                            <b>Encaminharemos o Recibo de Sinal para o seu painel no DocuSign </b>
                                            e avisaremos as partes por e-mail. Todo o
                                            <b> processo de assinatura será feito digitalmente.</b>
                                        </p>
                                    </div>
                                    <RadioGroup label={''} options={reciboDocusign} setOptions={setReciboDocusign} name='reciboType' value={watch('reciboType')} setValue={setValue} />

                                </Paper>
                            </div>
                        </Paper>

                        <Paper className='card-entregar card4' elevation={1}>
                            {/* <Chip size='small' label="ETAPA 2" className='chip sucess' /> */}
                            <p className='title'>{
                                watch('reciboType') === 'manual'
                                    ? "Realize o Upload do Recibo de Sinal final assinado pelas partes:"
                                    : "Realize o Upload do Recibo de Sinal que será assinado pelo DocuSign:"
                            }</p>
                            <p className='subtitle'>Documentos apenas em pdf.</p>
                            <div className='upload upload-step'>
                                <UploadDocumentos
                                    context={dataContext}
                                    pessoa="imovel"
                                    idDonoDocumento={imovelData.imovel_id}
                                    register={register}
                                    errors={errors}
                                    option={[{
                                        id: 8,
                                        nome: "recibo",
                                        tipo: 'imóvel',
                                        validade_dias: null
                                    }]}
                                    setAddRecibo={setAddRecibo}
                                />
                            </div>
                            <div>
                                <MsgRecibo />
                            </div>
                        </Paper>
                    </Paper>
                }

            </div>

            <footer className='footer-entregar-venda'>
                <div className='download'>
                    {!!imovelData.imovel_id && <ButtonComponent style={{ alignItems: 'center' }} onClick={() => downloadRecibo()} startIcon={<DocumentTextIcon width={24} />} size={'large'} variant={'text'} label={'Voltar para ver Rascunho'} />}
                    {/* {!!imovelData.imovel_id && <ButtonComponent onClick={() => downloadRecibo()} startIcon={<DocumentArrowDownIcon width={24} />} size={'large'} variant={'text'} label={'Fazer novamente o Download do rascunho'} />} */}
                    {/* {!!downloadDate.date && <p>Download mais recente - {downloadDate.date} às {downloadDate.hours}</p>} */}
                </div>
                <ButtonComponent
                    disabled={!addRecibo || loading}
                    onClick={handleSubmit((e) => handleEnviarVenda())}
                    labelColor='white'
                    endIcon={<CheckIcon width={24} fill='white' />}
                    size={'large'}
                    variant={'contained'}
                    label={watch('reciboType') === 'manual' ? 'Entregar venda' : 'Entregar pela DocuSign'}
                />
            </footer>


        </>
    )
}

// EXECUTA ANTES DO DASHBOARD
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso } = context.params as { idProcesso: string };
    return { props: { idProcesso } };
};

export default EntregarVendaLeituraIA;