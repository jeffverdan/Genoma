import { CheckIcon, DocumentArrowDownIcon, PencilIcon } from '@heroicons/react/24/solid';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import dayjs from 'dayjs';
import addBusinessDays from 'date-fns/addBusinessDays';
import { useRouter } from 'next/router';
import { Alert, Chip, Collapse, Paper, Skeleton } from '@mui/material';

import getProcesso from '@/apis/getProcesso';
import ShowDocument from '@/apis/getDocument';
import EntregarVendaAPI from '@/apis/postEntregarVenda';

import HeadSeo from '@/components/HeadSeo';
import Header from '@/components/GG_Gerentes/Header';
import Foguetes from '@/components/Foguetes';
import ButtonComponent from '@/components/ButtonComponent';
import RadioGroup from '@/components/RadioGroup';
import InputText from '@/components/InputText/Index';
import UploadDocumentos from '@/components/UploadDocumentos';
import ReciboManual from '@/images/recibo-manual.svg';
import ReciboDocusign from '@/images/recibo-docusign.svg';
import dateMask from '@/functions/dateMask';
import DialogConfirmEmail from '../@DialogConfirmEmails';

import imovelDataInterface from '@/interfaces/Imovel/imovelData'
import FormValues from '@/interfaces/Vendas/EntregarVenda'
import SaveEntregarVenda from '@/apis/postSaveEntregarVenda';
import Loading from './@CheckoutComponents/@Loading';
import postEnvioDocuSign from '@/apis/postEnvioDocuSign';
import formatoMoeda from '@/functions/formatoMoeda';
import getEnvelopeDetails from '@/apis/getEnvelopeDetails';
import redirect403 from '@/functions/redirect403';
import { FaExclamationCircle } from 'react-icons/fa';
import TextArea from '@/components/TextArea';
import { red } from '@mui/material/colors';
import { MultiDocsType } from '@/components/UploadDocumentos/Interfaces';

// import DialogEntregaVenda from '@/components/DialogEntregaVenda';

type Pessoa = {
    tipo_pessoa: number
    name?: string
    nome_fantasia?: string
    cpf_cnpj?: string
}

const EntregarVenda = ({ idProcesso }: { idProcesso: any }) => {
    const [loading, setLoading] = useState(false);
    const [collapseMenu, setCollapseMenu] = useState(false);
    const [imovelData, setImovelData] = useState<imovelDataInterface>({});
    const router = useRouter();
    const [multiDocs, setMultiDocs] = useState<MultiDocsType[]>([]);
    const [openDialogEmails, setOpenDialogEmails] = useState<Boolean>(false);
    const [checkEmails, setCheckEmails] = useState<Boolean>(false);
    const [openLoading, setOpenLoading] = useState<Boolean>(false);
    const [stepLoading, setStepLoading] = useState<number>(0)
    // const [openDialogEntrega, setOpenDialogEntrega] = useState<boolean>(false);
    const [dataPrevista, setDataPrevista] = useState('');
    const [downloadDate, setDownloadDate] = useState({ date: '', hours: '' });

    const dataHoje = dayjs().format('YYYY-MM-DD');
    const [erroAssinatura, setErroAssinatura] = useState<string | number>('');
    const [msgErroAssinatura, setMsgErroAssinatura] = useState('');
    const [msgAssinatura, setMsgAssinatura] = useState('');
    const [suspense, setSuspense] = useState<boolean>(true);

    const [addRecibo, setAddRecibo] = useState<boolean>(false);

    const dataContext = {
        dataProcesso: imovelData,
        selectItem: '',
        idProcesso: imovelData.id || '',
        multiDocs,
        setMultiDocs
    };

    const errorMsg = "Campo obrigatório."
    console.log('dataContext: ', dataContext);
    console.log('MULTIDOCS: ' , dataContext.multiDocs)
    console.log('multiDocs[0]?.file', multiDocs[0]?.file)

    console.log('addRecibo: ', addRecibo)

    const {
        register,
        watch,
        setValue,
        formState: { errors },
        handleSubmit,
        clearErrors,
        setError,
        setFocus,
    } = useForm<FormValues>({
        defaultValues: {
            imovel_id: imovelData.imovel_id,
            processo_id: imovelData.id,
            informacao_imovel_id: imovelData.informacao?.id,
            prazo_type: imovelData.imovel?.informacao?.tipo_dias,
            reciboType: 'manual',
            data_assinatura: '',
            prazo_escritura: '',
            posvenda_franquia: '0',
            valor_comissao_liquida: imovelData.comissao?.valor_comissao_liquida,
            deducao: imovelData.comissao?.deducao,
            valor_comissao_total: imovelData.comissao?.valor_comissao_total,
            emailCheck: '0',
            data_previsao_escritura: '',
            observacao: '',
        }
    });

    console.log('WATCH: ', watch());
    console.log('ERRORS: ', errors);

    useEffect(() => {
        if (watch('reciboType') === 'docusign') {
            setValue('data_assinatura', '');
            setValue('data_previsao_escritura', '');
            SaveEntregarVenda(watch());
        }
        else if (watch('informacao_imovel_id') && watch('data_assinatura')) SaveEntregarVenda(watch());
        //redirectRules();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch('reciboType'), watch('prazo_type'), watch('posvenda_franquia')]);

    const [prazoEscritura, setPrazoEscritura] = useState([
        { value: '1', disabled: false, label: 'Dias úteis', checked: false },
        { value: '2', disabled: false, label: 'Dias corridos', checked: false }
    ]);

    const [franquia, setFranquia] = useState([
        { value: '0', disabled: false, label: 'DNA Imóveis', checked: false },
        { value: '1', disabled: false, label: 'Franqueado', checked: false }
    ]);

    const [reciboManual, setReciboManual] = useState([
        { value: 'manual', disabled: false, label: 'Enviar o recibo já assinado', checked: false },
    ]);

    const [reciboDocusign, setReciboDocusign] = useState([
        { value: 'docusign', disabled: false, label: 'Aguardar as assinaturas', checked: false },
    ]);

    const getImovelData = async () => {
        setLoading(true);
        const data = await getProcesso(idProcesso, router) as any;

        if (data?.informacao?.data_download_recibo !== '') {
            const dataHoraDownload = data?.informacao?.data_download_recibo.split(' ');
            const splitHorarioDownload = dataHoraDownload[1].split(':');
            const horaDownload = `${splitHorarioDownload[0]}h:${splitHorarioDownload[1]}`;

            setDownloadDate({
                date: dataHoraDownload[0],
                hours: horaDownload
            })
        }

        // Processo enviado para o Pós nos sequintes status, vai exibir tela de 403
        // 1,2,3,4,5,6,7,21,26
        const statusProcesso = data.status[0].id;
        if (data.envelope_id === null || data.envelope_id === '') {
            setSuspense(false)
            redirect403(statusProcesso, router, setSuspense)
        }
        else {
            // router.push('/403');
        }

        if (data) {
            setImovelData(data as imovelDataInterface);
            setValue('prazo_escritura', data.informacao?.prazo);
            setValue('processo_id', data.id);
            setValue('prazo_type', data.imovel?.informacao?.tipo_dias)
            setValue('imovel_id', data.imovel_id);
            setValue('reciboType', data.informacao?.recibo_type);
            setValue('informacao_imovel_id', data.informacao?.id);
            setValue('valor_comissao_liquida', data.comissao?.valor_comissao_liquida);
            setValue('deducao', data.comissao?.deducao);
            setValue('valor_comissao_total', data.comissao?.valor_comissao_total || '');
            setValue('posvenda_franquia', data.imovel?.posvenda_franquia);
            setValue('emailCheck', data.imovel?.email_check || '0');
            setValue('data_assinatura', data.informacao?.data_assinatura || '')
            returnDataPrevista(Number(data.informacao?.prazo));
            // handleDataAssinatura(data.informacao?.data_assinatura);

            console.log(data)

            if (data.franquia === 0) setFranquia([
                { value: '0', disabled: true, label: 'DNA Imóveis', checked: false },
                { value: '1', disabled: true, label: 'Franqueado', checked: false }
            ])

            if (watch('emailCheck') === '1') {
                setCheckEmails(true)
            } else {
                setCheckEmails(false)
            }
        }
        setCollapseMenu(true);
        setLoading(false);
    };

    useEffect(() => {
        setSuspense(true);
        getImovelData();        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log(dataPrevista)

    const returnLength = (arry: Pessoa[] | undefined) => {
        return {
            fisicas: arry?.filter((e) => !e.tipo_pessoa)?.length || 0,
            juridicas: arry?.filter((e) => e.tipo_pessoa)?.length || 0,
        }
    };

    useEffect(() => {
        if (watch('prazo_escritura')) returnDataPrevista(Number(watch('prazo_escritura')))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prazoEscritura])

    const now = dayjs();
    const returnDataPrevista = (days?: number) => {
        const dateMode = watch('data_assinatura')?.split('/');
        console.log(dateMode);
        if (days && dateMode) {
            const assDate = `${dateMode[1]}/${dateMode[0]}/${dateMode[2]}`;
            const newData = watch('prazo_type') === '1' ? addBusinessDays(new Date(assDate), days) : dayjs(assDate).add(days, 'day');
            setDataPrevista(dayjs(newData).format('DD/MM/YYYY'))
            console.log(newData);

            if (dateMode[0] === '') {
                setValue('data_previsao_escritura', '');
            }
            else {
                setValue('data_previsao_escritura', dayjs(newData).format('DD/MM/YYYY'));
            }
        }
    };

    const downloadRecibo = async () => {
        await ShowDocument(imovelData.imovel_id, 'recibo');
        const date = now.format('DD/MM/YYYY');
        const hours = `${now.get('hour')}h:${now.get('minute')}`
        setDownloadDate({
            date: date,
            hours: hours
        })
    }

    const returnVerificaData = (data: any) => {
        const dataAssinatura = data || watch('data_assinatura');
        // console.log('Verificando data ' + data)

        const splitData = dataAssinatura.split('/');
        const newData = splitData[2] + '-' + splitData[1] + '-' + splitData[0];
        const dataRecibo = dayjs(newData);

        const reciboDiferenca = dayjs(dataRecibo).diff(dataHoje, 'day');
        console.log('Diferença de ' + reciboDiferenca + ' dias');

        // Maior que o dia atual
        if (reciboDiferenca > 0) {
            setErroAssinatura(1);
            // Data incorreta. Preencha novamente.
            setError('data_assinatura', { message: 'Data incorreta.' })
            setMsgErroAssinatura('Não é possível inserir uma data que passe do dia atual. Revise o campo com atenção.');
            setMsgAssinatura('');
        }

        // Menor que 60 dias
        else if (reciboDiferenca < -60) {
            setErroAssinatura(2);
            // Data incorreta. Preencha novamente.
            setError('data_assinatura', { message: 'Data incorreta.' })
            setMsgErroAssinatura('Há uma diferença maior de 60 dias após as assinaturas do recibo de sinal. Revise o campo com atenção.')
            setMsgAssinatura('');
        }

        // Entre 5 e 60 dias
        else if (reciboDiferenca <= -5 && reciboDiferenca >= -60) {
            setMsgAssinatura('Você está entregando uma venda ' + Math.abs(reciboDiferenca) + ' dia' + (reciboDiferenca !== 1 ? 's' : '') + ' após as assinaturas do recibo de sinal.')
            setErroAssinatura('');
            clearErrors('data_assinatura');
            setMsgErroAssinatura('');
        }

        else {
            setErroAssinatura('');
            clearErrors('data_assinatura');
            clearErrors('observacao');
            setMsgAssinatura('');
            setMsgErroAssinatura('');
        }
    }

    const handleDataAssinatura = (e: any) => {
        const dataAssinatura: any = e;

        if (dataAssinatura.length === 10) {
            setValue('data_assinatura', dataAssinatura);
            returnDataPrevista(Number(watch('prazo_escritura')));
            returnVerificaData(watch('data_assinatura'));
        }
        else {
            // Limpa o valor da previsão quando não tiver a data de escritura
            setValue('data_previsao_escritura', '');

            if (dataAssinatura.length === 0) {
                setError('data_assinatura', { message: 'Campo obrigatório' })
            }
            else {
                setError('data_assinatura', { message: 'Formato de data inválido' })
            }
        }
    };

    const handleObservacao = (e: any) => {
        // const observacao: any = watch('observacao');
        const observacao = e.target.value;
        console.log(observacao)
        console.log(e)
        // setValue('observacao', observacao);
        if (observacao.length === 0) {
            setError('observacao', { message: 'Campo obrigatório' })
            // setFocus('observacao')
        }
        else {
            clearErrors('observacao')
            SaveEntregarVenda(watch())
        }
    }

    useEffect(() => {
        // handleDataAssinatura(watch('data_assinatura'))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleEnviarVenda = async (e: FormValues) => {
        console.log("FormValues: ", e);

        // Para ativar o modal de entrega da venda
        // setOpenDialogEntrega(true);

        const tipoRecibo = watch('reciboType');
        if (tipoRecibo === 'manual') {
            const res = await EntregarVendaAPI(e);

            if (res) {
                localStorage.setItem('venda_entregue', imovelData.processo_id || '');
                router.push('/vendas');
            }
            console.log("Result API entregarVenda: ", res);
        }
        else {

            // Abre o modal de Enviando Recibo
            await setOpenLoading(true);

            const res: any = await postEnvioDocuSign(idProcesso, e);
            console.log('ENVIO DOCUSIGN: ', res);

            // Se tudo der certo, muda o copy do modal
            if (res[0]?.status === true) {
                setTimeout(() => {
                    setLoading(true)
                    setStepLoading(1)
                }, 3000);
            }
            else {
                console.log('Erro ao enviar para o DocuSign')
                setTimeout(() => {
                    setLoading(true)
                    setStepLoading(2)
                }, 3000);
            }
        }
    };

    const handleComissao = () => {
        const comissaoTotal = Number((watch('valor_comissao_total')?.replace(/[R$.]+/g, '') || '0').replace(",", "."));
        const deducao = watch('deducao') === '' || watch('deducao') === null || watch('deducao') === undefined
            ? 0.00
            : Number((watch('deducao')?.replace(/[R$.]+/g, ''))?.replace(",", "."));
        const comissaoLiquida = (comissaoTotal - deducao) * 100;

        setValue('valor_comissao_liquida', formatoMoeda(comissaoLiquida.toString()));
        // imovelData?.comissao?.valor_comissao_liquida = formatoMoeda(comissaoLiquida.toString());
        // setDataSave({ ...watch() });
        SaveEntregarVenda(watch());
    };

    const handleCheckEmails = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCheckEmails(e => !e),
            setValue('emailCheck', checkEmails === false ? '1' : '0');

        if (watch('emailCheck') === '1') clearErrors('emailCheck');
        if (watch('emailCheck') === '0') {
            setError('emailCheck', { message: '*Campo obrigatório.' });
            setFocus('emailCheck');
        }
        //clearErrors('emailCheck')

        SaveEntregarVenda(watch())
    };

    return (
        <>
            <HeadSeo titlePage={"Entregar Venda"} description='Entrega da venda' />
            <Header
                imovel={imovelData}
                urlVoltar={`/vendas/gerar-venda/${idProcesso}/dashboard/`}
                urlSair={'/vendas'}
                title={'agora você pode entregar a sua venda!'}
            />
            <div className='entregar-venda'>

                <Paper elevation={1} sx={{ width: '344px' }} className='menu-entregar' >
                    <div className='flex'>
                        <p className='title'>Resumo do cadastro</p>
                        <ButtonComponent
                            size={'small'}
                            variant={'text'}
                            name={'collapse'}
                            label={''}
                            onClick={() => setCollapseMenu((prev) => !prev)}
                            endIcon={
                                collapseMenu
                                    ? <HiChevronUp className='colorP500 iconCollapse' />
                                    : <HiChevronDown className='colorP500 iconCollapse' />
                            }
                        // fullWidth 
                        />

                    </div>
                    <Collapse
                        in={collapseMenu}
                    // collapsedSize={106} 
                    // timeout={collapseMenu ? 0 : 700} 
                    // addEndListener={handleCollapse}
                    >
                        <div className='menu'>
                            <p className='subtitle'>ENDEREÇO DO IMOVEL</p>
                            <p>{`${imovelData.bairro}, ${imovelData.cidade} - ${imovelData.uf}`}</p>
                            <p className='bold'>{`${imovelData.logradouro} - ${imovelData.numero}`}</p>
                            <p className='subtitle'>{`${!!imovelData.unidade ? imovelData.unidade : ''} ${!!imovelData.complemento ? imovelData.complemento : ''}`}</p>
                        </div>

                        <div className='menu'>
                            <p className='subtitle'>REGISTRO E ESCRITURA</p>
                            <p className='bold'>{imovelData.informacao?.tipo_escritura}</p>
                            <p className='subtitle'>{`Matrícula nº - ${imovelData.informacao?.matricula || ''}`}</p>
                            <p className='subtitle'>{`Inscrição Municipal - ${imovelData.informacao?.inscricaoMunicipal || ''}`}</p>
                        </div>

                        <div className='menu pessoas'>
                            <div className='title-vendedores'>
                                <span className='subtitle'>VENDEDORES</span>
                                <Chip size='small' label={<span className='subtitle'>{returnLength(imovelData.vendedores)?.fisicas} FÍSICO{returnLength(imovelData.vendedores)?.fisicas > 1 ? 'S' : ''}</span>} />
                                <Chip size='small' label={<span className='subtitle'>{returnLength(imovelData.vendedores)?.juridicas} JURÍDICO{returnLength(imovelData.vendedores)?.juridicas > 1 ? 'S' : ''}</span>} />
                            </div>
                            {imovelData.vendedores?.map((vendedor) => (
                                <>
                                    <p className='bold'>{vendedor.tipo_pessoa ? vendedor.nome_fantasia : vendedor.name}</p>
                                    <p className='subtitle'>{vendedor.tipo_pessoa ? 'CNPJ - ' : 'CPF - '}{vendedor.cpf_cnpj}</p>
                                </>
                            ))}
                        </div>

                        <div className='menu pessoas'>
                            <div className='title-vendedores'>
                                <span className='subtitle'>COMPRADORES</span>
                                <Chip size='small' label={<span className='subtitle'>{returnLength(imovelData.compradores)?.fisicas} FÍSICO{returnLength(imovelData.compradores)?.fisicas > 1 ? 'S' : ''}</span>} />
                                <Chip size='small' label={<span className='subtitle'>{returnLength(imovelData.compradores)?.juridicas} JURÍDICO{returnLength(imovelData.compradores)?.juridicas > 1 ? 'S' : ''}</span>} />
                            </div>
                            {imovelData.compradores?.map((comprador) => (
                                <>
                                    <p className='bold'>{comprador.tipo_pessoa ? comprador.nome_fantasia : comprador.name}</p>
                                    <p className='subtitle'>{comprador.tipo_pessoa ? 'CNPJ - ' : 'CPF - '}{comprador.cpf_cnpj}</p>
                                </>
                            ))}
                        </div>
                    </Collapse>

                    <div className='menu-rank'>
                        <p className='subtitle'>RANK DA VENDA</p>
                        {imovelData.foguete ? <div className='rockets'><Foguetes quantidade={imovelData.foguete || 0} /></div> : <Skeleton animation='wave' width={180} />}
                        {imovelData.foguete ? imovelData.foguete === 5 ? "Copy venda foguetes maximo" : "Sua venda pode ficar ainda melhor!" : <Skeleton animation='wave' width={280} />}
                        <ButtonComponent onClick={() => router.push(router.asPath + '/resumo')} name='rank' size={'small'} variant={'outlined'} label={'Ver rank e resumo completo'} fullWidth />
                    </div>
                </Paper>

                <Paper elevation={0} className='content-entregar'>
                    <Paper className='card-entregar card1' elevation={1}>
                        <Chip size='small' label="ETAPA 1" className='chip sucess' />

                        {/* <h2>Como você gostaria de fazer a entrega do Recibo de Sinal?</h2> */}
                        <h2>Pronto para entregar o Recibo de Sinal?</h2>
                        <div className='recibo-options'>
                            <Paper className='card-recibo'>
                                <Chip size='small' label="MANUAL" className='chip-recibo' />
                                <Image src={ReciboManual} alt={'Recibo Manual'} />
                                <div>
                                    <h3>Coletar as assinaturas e enviar o Recibo de Sinal manualmente</h3>
                                    <p>Com o Recibo de Sinal assinado à mão pelas partes,<b> você terá que digitalizar e realizar o Upload desse documento</b> na plataforma.</p>
                                </div>
                                <RadioGroup label={''} options={reciboManual} setOptions={setReciboManual} name='reciboType' value={watch('reciboType')} setValue={setValue} />

                            </Paper>
                            
                            <Paper className='card-recibo'>
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

                    <Paper className='card-entregar card2' elevation={1}>
                        <Chip size='small' label="ETAPA 2" className='chip sucess' />
                        {watch('reciboType') === 'manual' &&
                            <>
                                <h2>Confirme a data em que o Recibo foi assinado:</h2>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <InputText
                                        width='280px'
                                        label='Data de assinatura do Recibo*'
                                        error={!!errors.data_assinatura}
                                        msgError={errors.data_assinatura}
                                        sucess={!!watch('data_assinatura')}
                                        placeholder='30/05/2023'
                                        saveOnBlur={() => SaveEntregarVenda(watch())}
                                        {...register("data_assinatura", {
                                            setValueAs: e => dateMask(e),
                                            required: errorMsg,
                                            onChange: (e) => handleDataAssinatura(dateMask(e.target.value)),
                                            validate: () => {
                                                if (errors.data_assinatura) {
                                                    return errors.data_assinatura.message;
                                                }
                                            },
                                        })}
                                    />

                                    {
                                        errors.data_assinatura && msgErroAssinatura
                                            ?
                                            <Alert
                                                className='alert info red'
                                                severity="error"
                                                style={{ maxWidth: '360px', width: '100%' }}
                                                icon={<FaExclamationCircle size={20} />}
                                            >
                                                {msgErroAssinatura}
                                            </Alert>
                                            :
                                            ''
                                    }
                                </div>

                                {
                                    // Observação quando diferença de 5 a 60 dias
                                    !!msgAssinatura && !errors.data_assinatura ?
                                        <div style={{ marginBottom: '35px' }}>
                                            <div>
                                                <span
                                                    className="p1"
                                                    style={{ marginBottom: '10px', display: 'block', fontWeight: '700' }}
                                                >
                                                    {msgAssinatura}
                                                </span>
                                                <TextArea
                                                    label={'Justifique o atraso da entrega:'}
                                                    minRows={2}
                                                    placeholder='Precisei me afastar do trabalho por motivos de saúde'
                                                    error={!!errors.observacao}
                                                    value={watch('observacao')}
                                                    {...register("observacao", {
                                                        required: errorMsg,
                                                        onChange: (e) => [setValue('observacao', e.target.value), handleObservacao(e)]
                                                    })}
                                                />

                                                {
                                                    errors.observacao &&
                                                    <span className="errorMsg">
                                                        {errorMsg}
                                                    </span>
                                                }
                                            </div>
                                        </div>
                                        :
                                        ''
                                }
                            </>
                        }

                        <h2>{watch('reciboType') === 'manual' ? "E o prazo da Escritura?" : "Precisamos confirmar a data de escritura:"}</h2>
                        <RadioGroup label={''} options={prazoEscritura} setOptions={setPrazoEscritura} name='prazo_type' value={watch('prazo_type')} setValue={setValue} />

                        <div className='prazo-escritura'>
                            <InputText
                                type='number'
                                width='280px'
                                placeholder='30'
                                error={!!errors.prazo_escritura}
                                label='Prazo para Escritura (em dias)*'
                                sucess={!!watch('prazo_escritura')}
                                saveOnBlur={() => SaveEntregarVenda(watch())}
                                {...register("prazo_escritura", {
                                    required: true,
                                    onChange: (e) => returnDataPrevista(e.target.value)
                                })}
                            />
                            {(!!watch('prazo_escritura') && watch('reciboType') === 'manual') && (watch('data_assinatura') !== '') && <div>
                                <p className='subtitle'>PREVISÃO DA CONCLUSÃO DE VENDA:</p>
                                <p className='data-prevista'>{dataPrevista}</p>
                            </div>}
                        </div>

                        {/* FRANQUIA DESABILITADA CONFORME CONBINADO NA REUNIÃO DO DIA 04/07 */}
                        {/* {!franquia[0].disabled &&
                            <div className='responsavel-pos'>
                                <h2> Quem será o responsável pelo pós-negociação?</h2>
                                <RadioGroup label={''} options={franquia} setOptions={setFranquia} name='posvenda_franquia' value={watch('posvenda_franquia')} setValue={setValue} />
                            </div>
                        } */}

                        <h2> Qual é o valor da comissão desta venda? </h2>
                        <div className='flex gap16'>
                            <InputText
                                label={'Comissão total*'}
                                placeholder={'R$'}
                                error={!!errors.valor_comissao_total}
                                msgError={errors.valor_comissao_total}
                                value={watch('valor_comissao_total')}
                                sucess={!errors.valor_comissao_total && !!watch('valor_comissao_total')}
                                onBlurFunction={handleComissao}
                                // saveOnBlur={() => SaveEntregarVenda(watch())}
                                {...register('valor_comissao_total', {
                                    required: errorMsg,
                                    setValueAs: (e) => formatoMoeda(e),
                                })}
                            />

                            <InputText
                                label={'Deduções'}
                                placeholder={'R$'}
                                error={!!errors.deducao}
                                // msgError={errors.deducao}
                                value={watch('deducao')}
                                sucess={!errors.deducao && !!watch('deducao')}
                                onBlurFunction={handleComissao}
                                // saveOnBlur={() => SaveEntregarVenda(watch())}
                                {...register('deducao', {
                                    // required: errorMsg,
                                    setValueAs: (e) => formatoMoeda(e),
                                })}
                            />

                            <InputText
                                label={'Comissão líquida*'}
                                placeholder={'R$'}
                                error={!!errors.valor_comissao_liquida}
                                disabled
                                value={watch('valor_comissao_liquida')}
                                sucess={!errors.valor_comissao_liquida && !!watch('valor_comissao_liquida')}
                                // onBlurFunction={() => setDataSave({ ...watch() })}
                                {...register('valor_comissao_liquida', {
                                    // required: errorMsg,
                                    setValueAs: (e) => formatoMoeda(e),
                                    // onChange: (e) => handleComissao()
                                })}
                            />
                        </div>

                    </Paper>

                    {/* CARD 3 SÓ EXISTE NA ENTREGA PELO DOCUSIGN */}
                    {watch('reciboType') === 'docusign' &&
                        <Paper className='card-entregar card3' elevation={1}>
                            <Chip size='small' label="ETAPA 3" className='chip sucess' />
                            <p className='title'>Agora, confirme o e-mail dos envolvidos que irão participar do processo de assinaturas online pelo DocuSign:</p>
                            <div className='vendedores-compradores'>
                                <div className='menu-vendedores'>
                                    <div className='title-vendedores'>
                                        <span className='subtitle'>VENDEDORES</span>
                                        <Chip size='small' label={<span className='subtitle'>{returnLength(imovelData.vendedores)?.fisicas} FÍSICO{returnLength(imovelData.vendedores)?.fisicas > 1 ? 'S' : ''}</span>} />
                                        <Chip size='small' label={<span className='subtitle'>{returnLength(imovelData.vendedores)?.juridicas} JURÍDICO{returnLength(imovelData.vendedores)?.juridicas > 1 ? 'S' : ''}</span>} />
                                    </div>
                                    {imovelData.vendedores?.map((vendedor, index) => (
                                        // <>
                                        //     <p className='bold'>{vendedor.tipo_pessoa ? vendedor.nome_fantasia : vendedor.name}</p>
                                        //     <p className='subtitle'>{vendedor.tipo_pessoa ? 'CNPJ - ' : 'CPF - '}{vendedor.cpf_cnpj}</p>
                                        //     <p className='subtitle'>Email - {vendedor.tipo_pessoa ? vendedor.representante_socios?.data.find(e => e.pj_representante)?.email : vendedor.email}</p>
                                        // </>
                                        vendedor.tipo_pessoa === 0
                                            ?
                                            <div className='user' key={index}>
                                                <p className='bold'>{vendedor.tipo_pessoa ? vendedor.nome_fantasia : vendedor.name}</p>
                                                <p className='subtitle'>{vendedor.tipo_pessoa ? 'CNPJ - ' : 'CPF - '}{vendedor.cpf_cnpj}</p>
                                                <p className='subtitle'>Email - {vendedor.tipo_pessoa ? vendedor.representante_socios?.data.find(e => e.pj_representante)?.email : vendedor.email}</p>
                                            </div>
                                            :
                                            <>
                                                <div className="box-pj">
                                                    <div className='user' key={index}>
                                                        <p className='bold'>{vendedor.tipo_pessoa ? vendedor.nome_fantasia : vendedor.name}</p>
                                                        <p className='subtitle'>{vendedor.tipo_pessoa ? 'CNPJ - ' : 'CPF - '}{vendedor.cpf_cnpj}</p>
                                                        {/* <p className='subtitle'>Email - {vendedor.tipo_pessoa ? vendedor.representante_socios?.data.find(e => e.pj_representante)?.email : vendedor.email}</p> */}
                                                    </div>
                                                    <div>
                                                        {
                                                            vendedor?.representante_socios?.data.map((representante: any, index: number) =>
                                                                representante.pj_representante === 1 ?
                                                                    <div className='user' key={index}>
                                                                        <p className='bold'>{representante.name}</p>
                                                                        <p className='subtitle'>{'CPF - '}{representante.cpf_cnpj}</p>
                                                                        <p className='subtitle'>Email - {representante.email}</p>
                                                                    </div>
                                                                    :
                                                                    ''
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </>
                                    ))}
                                </div>

                                <div className='menu-vendedores'>
                                    <div className='title-vendedores'>
                                        <span className='subtitle'>COMPRADORES</span>
                                        <Chip size='small' label={<span className='subtitle'>{returnLength(imovelData.compradores)?.fisicas} FÍSICO{returnLength(imovelData.compradores)?.fisicas > 1 ? 'S' : ''}</span>} />
                                        <Chip size='small' label={<span className='subtitle'>{returnLength(imovelData.compradores)?.juridicas} JURÍDICO{returnLength(imovelData.compradores)?.juridicas > 1 ? 'S' : ''}</span>} />
                                    </div>
                                    {imovelData.compradores?.map((comprador, index) => (
                                        // <>
                                        //     <p className='bold'>{comprador.tipo_pessoa ? comprador.nome_fantasia : comprador.name}</p>
                                        //     <p className='subtitle'>{comprador.tipo_pessoa ? 'CNPJ - ' : 'CPF - '}{comprador.cpf_cnpj}</p>
                                        //     <p className='subtitle'>Email - {comprador.tipo_pessoa ? comprador.representante_socios?.data.find(e => e.pj_representante)?.email : comprador.email}</p>
                                        // </>
                                        comprador.tipo_pessoa === 0
                                            ?
                                            <div className='user' key={index}>
                                                <p className='bold'>{comprador.tipo_pessoa ? comprador.nome_fantasia : comprador.name}</p>
                                                <p className='subtitle'>{comprador.tipo_pessoa ? 'CNPJ - ' : 'CPF - '}{comprador.cpf_cnpj}</p>
                                                <p className='subtitle'>Email - {comprador.tipo_pessoa ? comprador.representante_socios?.data.find(e => e.pj_representante)?.email : comprador.email}</p>
                                            </div>
                                            :
                                            <>
                                                <div className="box-pj">
                                                    <div className='user' key={index}>
                                                        <p className='bold'>{comprador.tipo_pessoa ? comprador.nome_fantasia : comprador.name}</p>
                                                        <p className='subtitle'>{comprador.tipo_pessoa ? 'CNPJ - ' : 'CPF - '}{comprador.cpf_cnpj}</p>
                                                        {/* <p className='subtitle'>Email - {vendedor.tipo_pessoa ? vendedor.representante_socios?.data.find(e => e.pj_representante)?.email : vendedor.email}</p> */}
                                                    </div>
                                                    <div>
                                                        {
                                                            comprador?.representante_socios?.data.map((representante: any, index: number) =>
                                                                representante.pj_representante === 1 ?
                                                                    <div className='user' key={index}>
                                                                        <p className='bold'>{representante.name}</p>
                                                                        <p className='subtitle'>{'CPF - '}{representante.cpf_cnpj}</p>
                                                                        <p className='subtitle'>Email - {representante.email}</p>
                                                                    </div>
                                                                    :
                                                                    ''
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </>
                                    ))}
                                </div>
                            </div>

                            <div className='users-buttons'>
                                <ButtonComponent startIcon={<PencilIcon width={24} />} size={'large'} variant={'text'} label={'Editar os dados'} onClick={() => setOpenDialogEmails(true)} />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <ButtonComponent
                                        onClick={(e) => handleCheckEmails(e)}
                                        // onBlurFunction={SaveEntregarVenda(watch())}
                                        name={checkEmails ? 'check' : 'uncheck'}
                                        startIcon={checkEmails ? <CheckBox width={24} /> : <CheckBoxOutlineBlank width={24} />}
                                        size={'large'}
                                        variant={'outlined'}
                                        label={'Confirmar e-mail dos envolvidos'}
                                    />
                                    <div>
                                        <input
                                            type="text"
                                            //disabled={true}
                                            style={{ height: '0', width: '0', background: 'transparent', border: 'none' }}
                                            {...register("emailCheck", {
                                                required: errorMsg,
                                                validate: (value) => {
                                                    if (value === '0') {
                                                        return "*Campo obrigatório.";
                                                    }
                                                },
                                            })}
                                        />
                                        <span className="errorMsg">{errors?.emailCheck && errors?.emailCheck.message}</span>
                                    </div>
                                </div>
                            </div>
                        </Paper>
                    }

                    <Paper className='card-entregar card4' elevation={1}>
                        <Chip size='small' label="ULTIMA ETAPA" className='chip sucess' />
                        <p className='title'>{
                            watch('reciboType') === 'manual'
                                ? "Realize o Upload do Recibo de Sinal final assinado pelas partes:"
                                : "Realize o Upload do Recibo de Sinal que será assinado pelo DocuSign:"
                        }</p>
                        <p className='subtitle'>Documentos apenas em .pdf.</p>
                        <div className='upload'>
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
                    </Paper>

                </Paper>
            </div>
            <footer className='footer-entregar-venda'>
                <div className='download'>
                    {!!imovelData.informacao?.recibo && <ButtonComponent onClick={() => downloadRecibo()} startIcon={<DocumentArrowDownIcon width={24} />} size={'large'} variant={'text'} label={'Fazer novamente o Download do rascunho'} />}
                    {!!downloadDate.date && <p>Download mais recente - {downloadDate.date} às {downloadDate.hours}</p>}
                </div>
                <ButtonComponent disabled={/*!multiDocs[0]?.file*/ addRecibo === true ? false : true} onClick={handleSubmit((e) => handleEnviarVenda(e))} labelColor='white' endIcon={<CheckIcon width={24} fill='white' />} size={'large'} variant={'contained'} label={watch('reciboType') === 'manual' ? 'Entregar venda' : 'Entregar pela DocuSign'} />
            </footer>
            {openDialogEmails && <DialogConfirmEmail open={openDialogEmails} setOpen={setOpenDialogEmails} context={dataContext} refresh={getImovelData} />}
            <Loading enviar={handleEnviarVenda} loading={loading} step={stepLoading} setStep={setStepLoading} setLoading={setLoading} open={openLoading} setOpen={setOpenLoading} idProcesso={idProcesso} />
            {/* <DialogEntregaVenda open={openDialogEntrega} setOpen={setOpenDialogEntrega} /> */}
        </>
    )
}

export default EntregarVenda;