import React, {useState, useEffect} from 'react'
import ButtonComponent from '../ButtonComponent';
import RadioGroup from "@/components/RadioGroup";
import { HiCheck, HiArrowRight } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import InputText from '../InputText/Index';
import dateMask from '@/functions/dateMask';
import TextArea from '../TextArea';
import Escritura from '../FormEscritura';
import postSaveFeedBackEscritura from '@/apis/postSaveFeedBackEscritura';
import getGerenteConfirmarEscritura from '@/apis/getGerenteConfirmarEscritura';
import UploadDocumentos from '../UploadDocumentos/indexAntigo';
import imovelDataInterface from '@/interfaces/Imovel/imovelData'
import getProcesso from '@/apis/getProcesso';
import { useRouter } from 'next/router';
interface IProcesso{
    processos: IFeedBackEscrituras[]
    processo?: IFeedBackEscrituras
    showListaEscritura: boolean
    setOpenFeedBack: (e: boolean) => void
    setShowListaEscritura: (e: boolean) => void
    perguntasEscritura?: any
    returnFeedBackGerente: () => void
    setOpenDialogFeedBackEscritura: (e: boolean) => void
    // setEscriturasFeedBack: (e: IFeedBackEscrituras[]) => void
}

interface IFeedBackEscrituras{
    name?: string,
    ddi?: string,
    telefone?: string,
    data_escritura?: string,
    hora_escritura?: string,
    logradouro?: string,
    unidade?: string,
    processo_id?: number | string,
    pg_na_escritura?: number
}

interface FormValues{
    aconteceu?: string
    escritura_aconteceu?: string
    escritura_caiu?: string
    novaData?: string
    motivo_aconteceu?: string
    motivo_caiu?: string

    nome_cartorio?: string,
    local_escritura?: string | number,
    data_escritura?: string,
    hora_escritura?: string,
    cep_escritura?: string,
    endereco_escritura?: string,
    numero_escritura?: string | number,
    unidade_escritura?: string,
    complemento_escritura?: string,
    cidade_escritura?: string,
    estado_escritura?: string,
    bairro_escritura?: string,

    tipoDocumento?: string
}

type Options = {
    value: string;
    disabled: boolean;
    label: string;
    checked: boolean;
    width?: string;
    percent?: number;
};

export default function PerguntasEscritura({processos, processo, showListaEscritura, setOpenFeedBack, setShowListaEscritura, perguntasEscritura, returnFeedBackGerente, setOpenDialogFeedBackEscritura, /*setEscriturasFeedBack*/}: IProcesso) {
    // console.log(processos)
    // console.log(processo);
    // console.log('PERGUNTAS: ' , perguntasEscritura)

    const errorMsg = 'Campo obrigatório';
    const usuario_id = localStorage.getItem('usuario_id');
    const router = useRouter();
    
    const [imovelData, setImovelData] = useState<imovelDataInterface>({});
    const [multiDocs, setMultiDocs] = useState<any>([]);
    const [addRecibo, setAddRecibo] = useState<boolean>(false);

    const dataContext = {
        dataProcesso: processo,
        selectItem: '',
        idProcesso: processo?.processo_id,
        multiDocs,
        setMultiDocs
    };

    const {
        register,
        watch,
        setValue,
        setError,
        clearErrors,
        unregister,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
            aconteceu: '',
            escritura_aconteceu: '',
            escritura_caiu: '',
            novaData: '',
            motivo_aconteceu: '',
            motivo_caiu: '',

            // Escritura
            data_escritura: '',
            hora_escritura: '',
            local_escritura: '',
            nome_cartorio: '',
            cep_escritura: '',
            endereco_escritura: '',
            numero_escritura: '',
            unidade_escritura: '',
            complemento_escritura: '',
            cidade_escritura: '',
            estado_escritura: '',
            bairro_escritura: '',

            tipoDocumento: addRecibo ? 'true' : ''
        }
    })

    console.log('WATCH: ' , watch())
    console.log('ERRORs: ', errors);

    const idPerguntaInicio = 1;
    const idPerguntaEscrituraPagamento = 2;
    const idPerguntaMotivoCaiu = 3;

    const [aconteceu, setAconteceu] = useState<Options[]>([]);
    const [escrituraAconteceu, setEscrituraAconteceu] = useState<Options[]>([]);
    const [escrituraCaiu, setEscrituraCaiu] = useState<Options[]>([]);

    const returnOptions = async () => {
        const checkAconteceu: any =  perguntasEscritura?.[0]?.respostas?.data?.map((aconteceu: any) => ({value: aconteceu?.id?.toString(), disabled: false, label: aconteceu?.resposta, checked: false}));
        setAconteceu(checkAconteceu);

        const checkAconteceuEscritura: any =  perguntasEscritura?.[0]?.respostas?.data?.[0]?.proxima_pergunta?.respostas?.data?.map((aconteceu: any) => ({value: aconteceu?.id?.toString(), disabled: false, label: aconteceu?.resposta, checked: false}));
        setEscrituraAconteceu(checkAconteceuEscritura);

        const checkEscrituraCaiu: any =  perguntasEscritura?.[0]?.respostas?.data?.[1]?.proxima_pergunta?.respostas?.data?.map((aconteceu: any) => ({value: aconteceu?.id?.toString(), disabled: false, label: aconteceu?.resposta, checked: false}));
        setEscrituraCaiu(checkEscrituraCaiu);
    }

    const getImovelData = async () => {
        const processoId: any = processo?.processo_id;
        const data = await getProcesso(processoId, router) as any;
        setImovelData(data)
    }

    useEffect(() => {   
        returnOptions();
        getImovelData()
    }, [])
    // console.log(imovelData);

    // Registrar e desregistrar campos com base no valor de 'aconteceu'
    useEffect(() => {
        if (watch('aconteceu') === '1') {
            unregister('escritura_caiu');

            if(processo?.pg_na_escritura === 1){
                register('escritura_aconteceu', { required: errorMsg });
                clearErrors('escritura_aconteceu')
            }
            else{
                unregister('escritura_aconteceu');
            }
        } else if (watch('aconteceu') === '2') {
            unregister('escritura_aconteceu');
            register('escritura_caiu', { required: errorMsg });
        } else {
            unregister('escritura_aconteceu');
            unregister('escritura_caiu');
        }
    }, [watch('aconteceu'), clearErrors]);

    // Registrar e desregistrar campos com base no valor de 'escritura_aconteceu'
    useEffect(() => {
        if (watch('escritura_aconteceu') === '3') {
            register('novaData', { required: errorMsg });
            register('motivo_aconteceu', { required: errorMsg });
            clearErrors('escritura_aconteceu');
        } else {
            unregister('novaData');
            unregister('motivo_aconteceu');
        }

        if (watch('escritura_aconteceu') === '4' && addRecibo === false) {
            register('tipoDocumento', { required: errorMsg });
            clearErrors('escritura_aconteceu');
        } else {
            unregister('tipoDocumento')
            clearErrors('tipoDocumento');
        }
    }, [watch('escritura_aconteceu'), clearErrors]);

    useEffect(() => {
        if (addRecibo) {
            setValue('tipoDocumento', addRecibo ? 'true' : '')
            clearErrors("tipoDocumento");
        }
    }, [addRecibo, clearErrors]);

    // Registrar e desregistrar campos com base no valor de 'escritura_caiu'
    useEffect(() => {
        if (watch('escritura_caiu') === '5') {
            register('motivo_caiu', { required: errorMsg });
            clearErrors('escritura_caiu');
        } else {
            unregister('motivo_caiu');
        }

        if (watch('escritura_caiu') === '6') {
            // Registrar todos os campos de escritura
            register('data_escritura', { required: errorMsg });
            register('hora_escritura', { required: errorMsg });
            register('local_escritura', { required: errorMsg });
            register('cep_escritura', { required: errorMsg });
            register('endereco_escritura', { required: errorMsg });
            register('numero_escritura', { required: errorMsg });
            register('unidade_escritura', { required: errorMsg });
            register('complemento_escritura', { required: errorMsg });
            register('cidade_escritura', { required: errorMsg });
            register('estado_escritura', { required: errorMsg });
            register('bairro_escritura', { required: errorMsg });

            if (watch('local_escritura')) {
                unregister('nome_cartorio');  // Desregistra 'nome_cartorio' se 'local_escritura' não estiver vazio
            } else {
                register('nome_cartorio', { required: errorMsg });  // Registra novamente se 'local_escritura' estiver vazio
            }

            clearErrors('escritura_caiu');
        } else {
            // Desregistrar todos os campos de escritura
            unregister('data_escritura');
            unregister('hora_escritura');
            unregister('local_escritura');
            unregister('nome_cartorio');
            unregister('cep_escritura');
            unregister('endereco_escritura');
            unregister('numero_escritura');
            unregister('unidade_escritura');
            unregister('complemento_escritura');
            unregister('cidade_escritura');
            unregister('estado_escritura');
            unregister('bairro_escritura');
        }
    }, [watch('escritura_caiu'), watch('local_escritura')]);

    const handleInput = (type: any, value: string) => {   
        if(type === 'novaData'){
          setValue(type, dateMask(watch(type)))
        }

        else if(type === "motivo_aconteceu" || type === "motivo_caiu"){
            setValue(type, value)
        }
    }

    let validCaiu = false;
    let validAconteceu = false;
    let valid0 = false;
    let valid1 = false;
    let btnDisabled = false;
    function validQuest() {
        console.log(processo)

        if(processo?.pg_na_escritura === 0){
            if(watch('aconteceu') === '') {valid0 = false;}
            else{valid0 = true;}
        }    

        if(processo?.pg_na_escritura === 1){
            if(watch('aconteceu') === ''){valid1 = false;}
            else{valid1 = true;}
        }

        if(watch('escritura_caiu') === undefined || watch('escritura_caiu') === ''){validCaiu = false;}
        else{validCaiu = true;}
        
        if(watch('escritura_aconteceu') === undefined || watch('escritura_aconteceu') === ''){validAconteceu = false;}
        else{validAconteceu = true}

        if(((valid0 === true && watch('aconteceu') === '1') && valid1 === false) && (validCaiu === false && validAconteceu === false)){btnDisabled = true;}
        if(((valid0 === true && watch('aconteceu') === '2') && valid1 === false) && (validCaiu !== false || validAconteceu !== false)){btnDisabled = true;}
        if((valid0 === false && valid1 === true) && (validCaiu === true || validAconteceu === true)){btnDisabled = true;}
        
    }
    validQuest()

    const handleSave = async () => {
        const feedBack = [];
        feedBack.push(
            {
                motivo: '',
                processo_id: processo?.processo_id,
                usuario_id: usuario_id,
                resposta_id: Number(watch('aconteceu')),
                pergunta_id: idPerguntaInicio
            }
        )

        if(watch('escritura_aconteceu') === '3' || watch('escritura_aconteceu') === '4'){
            feedBack.push(
                {
                    resposta_id: Number(watch('escritura_aconteceu')),
                    pergunta_id: idPerguntaEscrituraPagamento,
                    motivo: watch('motivo_aconteceu') || '',
                    nova_data: watch('novaData') || '',
                    file: ""
                }
            )
        }

        if(watch('escritura_caiu') === '5' || watch('escritura_caiu') === '6'){
            feedBack.push(
                {
                    resposta_id: Number(watch('escritura_caiu')) || '',
                    pergunta_id: idPerguntaMotivoCaiu,
                    motivo: watch('motivo_caiu') || '',
                    nova_data: watch('data_escritura') || '',
                    cep_escritura: watch('cep_escritura') || '',
                    nome_cartorio: watch('nome_cartorio') === undefined ? '' : watch('nome_cartorio') || '',
                    local_escritura: watch('local_escritura') || '',
                    horario: watch('hora_escritura') || '',
                    endereco_escritura: watch('endereco_escritura') || '',
                    numero_escritura: watch('numero_escritura') || '',
                    unidade_escritura: watch('unidade_escritura') || '',
                    complemento_escritura: watch('complemento_escritura') || '',
                }
            )
        }

        // console.log('feedBack: ', feedBack)

        const res = await postSaveFeedBackEscritura(feedBack);
        if(res){
            setOpenDialogFeedBackEscritura(true)
            setOpenFeedBack(false)
        }
    }

    return (
        <>

            <>
                <h3>{processo?.data_escritura} - {processo?.logradouro}</h3>
            </>
            
            <div className='mt44 mb44'>
                <p>{processo?.name}, {perguntasEscritura[0]?.pergunta}*</p>
                <RadioGroup
                    {...register('aconteceu', {
                        required: errorMsg,
                    })}
                    value={watch('aconteceu')}
                    name='aconteceu'
                    label=''
                    options={aconteceu}
                    setOptions={setAconteceu}
                    setValue={setValue}
                />
                {/* {
                    (errors.aconteceu && watch('aconteceu') === '') &&
                    <p className="errorMsg">{'*' + errorMsg}</p>
                } */}
            </div>

            {
                (watch('aconteceu') === '1')
                ?
                /////////////////////////////////////////////////////////
                //Escritura Aconteceu
                /////////////////////////////////////////////////////////
                <div>
                    {
                        /////////////////////////////////////////////////////////
                        //Pagamento vai ser feito na Escritura
                        /////////////////////////////////////////////////////////
                        processo?.pg_na_escritura === 1 
                        ?
                        <div className='mt44 mb44'>
                            <p className="sub-p">{perguntasEscritura?.[0]?.respostas?.data?.[0]?.proxima_pergunta?.pergunta}*</p>
                            <div style={{marginBottom: '25px'}}>
                                <RadioGroup
                                    {...register('escritura_aconteceu', {
                                        required: errorMsg,
                                    })}
                                    value={watch('escritura_aconteceu')}
                                    name='escritura_aconteceu'
                                    label=''
                                    options={escrituraAconteceu}
                                    setOptions={setEscrituraAconteceu}
                                    setValue={setValue}
                                />
                                {/* {
                                    (errors.escritura_aconteceu) &&
                                    <p className="errorMsg">{'*' + errorMsg}</p>
                                } */}
                            </div>

                            {
                                /////////////////////////////////////////////////////////
                                // Não foi realizado o pagamento. Reagendei.
                                /////////////////////////////////////////////////////////
                                watch('escritura_aconteceu') === '3'
                                ?
                                <>
                                    <div className="row-f-2">
                                        <p className="sub-p">Insira a nova data e justificativa do ocorrido:*</p>
                                        <InputText
                                            width={'150'}
                                            label={'Nova data'}
                                            placeholder={'Ex: dd/mm/aaaa'}
                                            sucess={!errors.novaData && watch('novaData')?.length === 10}
                                            error={!!errors.novaData ? true : false}
                                            required={true}
                                            msgError={errors.novaData}
                                            value={watch('novaData')}
                                            inputProps={{
                                                maxlength: 10
                                            }}
                                            {...register('novaData', {
                                                //required: true,
                                                required: errorMsg,
                                                setValueAs: e => dateMask(e),
                                                validate: (value) => value?.length === 10 || "Data inválida",
                                                onChange: (e) => handleInput('novaData',  e.target.value)
                                            })}
                                        />
                                    </div>

                                    <TextArea
                                        label={'Por que o pagamento não foi realizado?*'}
                                        minRows={2}
                                        placeholder={'Exemplo: Houve desistência entre uma das partes.'}
                                        value={watch('motivo_aconteceu')}
                                        error={!!errors.motivo_aconteceu}
                                        {...register('motivo_aconteceu', {
                                            required: errorMsg,
                                            onChange: (e) => handleInput('motivo_aconteceu', e.target.value)
                                        })}
                                    />
                                    {
                                        errors.motivo_aconteceu &&
                                        <span className="errorMsg">
                                        * { errorMsg }
                                        </span> 
                                    }
                                </>
                                :
                                /////////////////////////////////////////////////////////
                                // Sim, foi realizado.
                                /////////////////////////////////////////////////////////
                                watch('escritura_aconteceu') === '4' &&
                                <>
                                    <div className='upload'>
                                        <p className='sub-p'>Insira o comprovante de pagamento. <span className="grey">Documento apenas em .pdf, .jpeg, .jpg, .png.</span>*</p>
                                        <p className='sub-p'></p>
                                        <UploadDocumentos 
                                            uploadURL="" 
                                            context={dataContext} 
                                            type="imovel" 
                                            pessoa="imovel" 
                                            idDonoDocumento={imovelData?.imovel_id} 
                                            register={register}
                                            unregister={unregister}
                                            setValue={setValue}
                                            watch={watch}
                                            clearErrors={clearErrors}
                                            errors={errors}
                                            option={["comissao"]} 
                                            setAddRecibo={setAddRecibo}
                                        />
                                    </div>
                                    
                                    <>
                                        {/*Verifica validação para o upload na view*/}
                                        <input
                                            type='hidden'
                                            value={addRecibo ? 'true' : ''}
                                            {...register('tipoDocumento', {required: errorMsg})}
                                        />
                                        {errors.tipoDocumento && <p className="errorMsg" style={{position: 'relative', top: '-50px'}}>*{errorMsg}</p>}
                                    </>
                                </>
                            }
                        </div>
                        :
                        /////////////////////////////////////////////////////////
                        //Pagamento foi feito fora da Escritura
                        /////////////////////////////////////////////////////////
                        // <p className="sub-p">Podemos prosseguir para a fase de Registro.</p>
                        ''
                    }
                    
                </div>

                :
                /////////////////////////////////////////////////////////
                // Pagamento não aconteceu
                /////////////////////////////////////////////////////////
                watch('aconteceu') === '2' 
                ? <div>
                <div className='mt44 mb44'>
                    <p className="sub-p">{perguntasEscritura?.[0]?.respostas?.data?.[1]?.proxima_pergunta?.pergunta}*</p>
                    <div style={{marginBottom: '25px'}}>
                        <RadioGroup
                            {...register('escritura_caiu', {
                                required: errorMsg,
                            })}
                            value={watch('escritura_caiu')}
                            name='escritura_caiu'
                            label=''
                            options={escrituraCaiu}
                            setOptions={setEscrituraCaiu}
                            setValue={setValue}
                        />
                        {/* {
                            (errors.escritura_caiu) &&
                            <p className="errorMsg">{'*' + errorMsg}</p>
                        } */}
                    </div>

                    {
                        /////////////////////////////////////////////////////////
                        // Não foi realizado o pagamento. Reagendei.
                        /////////////////////////////////////////////////////////
                        watch('escritura_caiu') === '5' && watch('aconteceu') === '2'
                        ?
                            <>
                                <p className="sub-p">Insira o motivo da queda da venda:*</p>
                                <TextArea
                                    label={'Por que a venda caiu?*'}
                                    minRows={2}
                                    placeholder={'Exemplo: Houve desistência entre uma das partes.'}
                                    value={watch('motivo_caiu')}
                                    error={!!errors.motivo_caiu}
                                    {...register('motivo_caiu', {
                                        required: errorMsg,
                                        onChange: (e) => handleInput('motivo_caiu', e.target.value)
                                    })}
                                />
                                {
                                    errors.motivo_caiu &&
                                    <span className="errorMsg">
                                    * { errorMsg }
                                    </span> 
                                }
                            </>
                            :
                            /////////////////////////////////////////////////////////
                            // ESCRITURA
                            /////////////////////////////////////////////////////////
                            (watch('escritura_caiu') === '6' && watch('aconteceu') === '2') &&
                            <div className="escritura">
                                <Escritura 
                                    handleInput={handleInput}
                                    register={register}
                                    watch={watch}
                                    errors={errors}
                                    setValue={setValue}
                                    clearErrors={clearErrors}
                                    setError={setError}
                                    origem={'modal-feedback'}
                                />
                            </div>
                        }
                    </div>
                </div>
                :
                ''
            }
            

            <footer className={`f-${processos?.length > 1 ? 'two-buttons' : 'one-button'}`}>
                {
                    processos?.length > 1 &&
                    <div>
                        <ButtonComponent
                            size={"large"}
                            variant={"text"}
                            name={"previous"}
                            label={"Voltar"}
                            // startIcon={<HiArrowLeft className='primary500' />}
                            onClick={e => setShowListaEscritura(true)} /*goToPrevSlide(index)*/
                        />
                    </div>
                }

                <div>
                    <ButtonComponent
                        size={"large"}
                        variant={"contained"}
                        name={"feedback"}
                        labelColor='white'
                        label={"Enviar"}
                        endIcon={<HiCheck fill='white' />}
                        disabled={!btnDisabled}
                        onClick={handleSubmit((e) => handleSave())}
                    />
                </div>
            </footer>
        </>
        
    )
}
