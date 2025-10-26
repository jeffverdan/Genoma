import { FieldErrors, UseFormClearErrors, UseFormRegister, UseFormSetValue, UseFormWatch, UseFormSetError } from "react-hook-form";
import dayjs from "dayjs";
import { addBusinessDays } from "date-fns";
import { useEffect, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { ExclamationTriangleIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Alert, Paper } from '@mui/material';
import Check from "@mui/icons-material/Check";
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";

import ButtonComponent from "@/components/ButtonComponent";
import InputText from "@/components/InputText/Index";
import TextArea from '@/components/TextArea';
import RadioGroup from '@/components/RadioGroup';
import dateMask from "@/functions/dateMask";
// import CheckBox from "@/components/CheckBox";

// import FormValuesType from "../../../../../../../interfaces/EntregarVenda";
import FormValuesType from '@/interfaces/Vendas/EntregarVenda'
import imovelDataInterface from '@/interfaces/Imovel/imovelData'
import { ArrConflitosType } from "@/interfaces/IA_Recibo";
import Pessoa from "@/interfaces/Users/userData";
import formatoMoeda from "@/functions/formatoMoeda";

interface PropsType {
    register: UseFormRegister<FormValuesType>
    errors: FieldErrors<FormValuesType>
    watch: UseFormWatch<FormValuesType>
    clearErrors: UseFormClearErrors<FormValuesType>
    setError: UseFormSetError<FormValuesType>
    autoSaveData: () => void
    setValue: UseFormSetValue<FormValuesType>
};


export default function CardDataEscritura(props: PropsType) {
    const { register, errors, watch, autoSaveData, clearErrors, setError, setValue } = props;
    const [prazoEscritura, setPrazoEscritura] = useState([
        { value: '1', disabled: false, label: 'Dias úteis', checked: false },
        { value: '2', disabled: false, label: 'Dias corridos', checked: false }
    ]);

    const [dataPrevista, setDataPrevista] = useState('');
    const [msgAssinatura, setMsgAssinatura] = useState('');
    const errorMsg = 'Campo obrigatório!';
    const [openObs, setOpenObs] = useState(false);

    const returnVerificaData = (data: string | undefined) => {
        console.log('data: ' , data)
        const dataAssinatura = data || watch('data_assinatura');

        console.log('LENGTH: ' , dataAssinatura?.length)
        if(dataAssinatura?.length === 10){
            const [dia, mes, ano] = dataAssinatura.split('/');
            const dataRecibo = dayjs(`${ano}-${mes}-${dia}`);
            // const diferencaDias = dataRecibo.diff(dayjs(), 'day');
            const diferencaDias = dayjs(dataRecibo).startOf('day').diff(dayjs().startOf('day'), 'day');
            console.log('DIFERENÇA DIAS: ' , diferencaDias)

            if (diferencaDias > 0) {
                setError('data_assinatura', { message: 'Data incorreta' });
                setMsgAssinatura('Não é possível inserir uma data que passe do dia atual. Revise o campo com atenção.');
                setOpenObs(false);
                clearErrors('observacao')
            } else if (diferencaDias < -60) {
                setError('data_assinatura', { message: 'Data incorreta' });
                setMsgAssinatura('Há uma diferença maior de 60 dias após as assinaturas do recibo de sinal. Revise o campo com atenção.');
                setOpenObs(false);
            } else if (diferencaDias <= -5 && diferencaDias >= -60) {
                setMsgAssinatura(`Você está entregando a venda ${Math.abs(diferencaDias)} dia(s) após as assinaturas.`);
                watch('prazo_escritura') && returnDataPrevista(Number(watch('prazo_escritura')));
                clearErrors('data_assinatura');
                setOpenObs(true);
            } else {
                clearErrors('data_assinatura');
                clearErrors('observacao');
                watch('prazo_escritura') && returnDataPrevista(Number(watch('prazo_escritura')));
                setMsgAssinatura('');
                autoSaveData();
                setOpenObs(false);
            }
        }
        else{
            setMsgAssinatura(''); 
            // setValue('data_assinatura', '');
            
            if(dataAssinatura?.length === 0){
                setError('data_assinatura', {message: 'Campo obrigatório'});
            }
            else{
                setError('data_assinatura', {message: 'Data incorreta'})
            }
            
            watch('prazo_escritura') && returnDataPrevista(Number(watch('prazo_escritura')));
            clearErrors('observacao');
            setOpenObs(false);
        }
    };

    useEffect(() => {
        if (watch('prazo_escritura') /*&& watch('data_assinatura')*/) returnDataPrevista(Number(watch('prazo_escritura')))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prazoEscritura]);
    
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

    const handleComissao = () => {
        const comissaoTotal = Number((watch('valor_comissao_total')?.replace(/[R$.]+/g, '') || '0').replace(",", "."));
        const deducao = watch('deducao') === '' || watch('deducao') === null || watch('deducao') === undefined
            ? 0.00
            : Number((watch('deducao')?.replace(/[R$.]+/g, ''))?.replace(",", "."));

        const comissaoLiquida = Math.round((comissaoTotal - deducao) * 100);

        setValue('valor_comissao_liquida', formatoMoeda(comissaoLiquida.toString()));
        autoSaveData();
    };

    const handleObservacao = (e: any) => {
        const observacao = e.target.value
        setValue('observacao', e.target.value)

        if(observacao?.length > 0){
            clearErrors('observacao');
        }
    };

    console.log(dataPrevista);
    

    return (
        <>
            {watch && <Paper className='card-entregar card2' elevation={1}>
                {watch('reciboType') === 'manual' &&
                    <>
                        <h4>Confirme a data em que o Recibo foi assinado:</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <InputText
                                width='280px'
                                label='Data de assinatura do Recibo*'
                                error={!!errors.data_assinatura}
                                msgError={errors.data_assinatura}
                                sucess={!!watch('data_assinatura') && !errors.data_assinatura}
                                placeholder='30/05/2023'
                                value={watch('data_assinatura')}
                                saveOnBlur={() => returnVerificaData(watch('data_assinatura'))}
                                {...register("data_assinatura", {
                                    setValueAs: e => dateMask(e),
                                    required: errorMsg,
                                    validate: value => {
                                        if(msgAssinatura && !openObs){
                                            return 'Data incorreta';
                                        }
                                    }
                                })}
                            />

                            {
                                errors.data_assinatura && msgAssinatura
                                    ?
                                    <Alert
                                        className='alert info red'
                                        severity="error"
                                        style={{ maxWidth: '360px', width: '100%' }}
                                        icon={<FaExclamationCircle size={20} />}
                                    >
                                        {msgAssinatura}
                                    </Alert>
                                    :
                                    ''
                            }
                        </div>

                        {
                            // Observação quando diferença de 5 a 60 dias
                            ((!!msgAssinatura && !errors.data_assinatura) && openObs || watch('observacao')) ?
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
                                                onChange: (e) => handleObservacao(e),
                                                onBlur: () => autoSaveData()
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

                <h4>{watch('reciboType') === 'manual' ? "E o prazo da Escritura?" : "Precisamos confirmar a data de escritura:"}</h4>
                <RadioGroup label={''} options={prazoEscritura} setOptions={setPrazoEscritura} name='prazo_type' value={watch('prazo_type')} setValue={setValue} />

                <div className='prazo-escritura'>
                    <InputText
                        type='number'
                        width='280px'
                        placeholder='30'
                        error={!!errors.prazo_escritura}
                        label='Prazo para Escritura (em dias)*'
                        sucess={!!watch('prazo_escritura')}
                        saveOnBlur={() => autoSaveData()}
                        {...register("prazo_escritura", {
                            required: true,
                            onChange: (e) => returnDataPrevista(e.target.value)
                        })}
                    />
                    {(!!dataPrevista && dataPrevista !== 'Invalid Date') && <div>
                        <p className='subtitle'>PREVISÃO DA CONCLUSÃO DE VENDA:</p>
                        <p className='data-prevista'>{dataPrevista}</p>
                    </div>}
                </div>

                {/* <h4> Qual é o valor da comissão desta venda? </h4> */}
                <div className='flex gap16'>
                    <InputText
                        label={'Comissão total*'}
                        placeholder={'R$'}
                        error={!!errors.valor_comissao_total}
                        msgError={errors.valor_comissao_total}
                        value={watch('valor_comissao_total')}
                        sucess={!errors.valor_comissao_total && !!watch('valor_comissao_total')}
                        onBlurFunction={handleComissao}
                        {...register('valor_comissao_total', {
                            required: errorMsg,
                            setValueAs: (e) => formatoMoeda(e),
                        })}
                    />

                    <InputText
                        label={'Deduções'}
                        placeholder={'R$'}
                        value={watch('deducao')}
                        sucess={!!watch('deducao')}
                        onBlurFunction={handleComissao}
                        {...register('deducao', {
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
                        {...register('valor_comissao_liquida', {
                            setValueAs: (e) => formatoMoeda(e),
                        })}
                    />
                </div>
            </Paper>}
        </>
    )

}