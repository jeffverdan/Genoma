import ButtonComponent from "@/components/ButtonComponent";
import InputSelect from "@/components/InputSelect/Index";
import InputText from "@/components/InputText/Index";
import RowRadioButtonsGroup from "@/components/RadioGroup";
import EmptyTextarea from "@/components/TextArea";
import formatoMoeda from "@/functions/formatoMoeda";
import { ComissaoDataType, FormEditComissaoType } from "@/interfaces/Apoio/planilhas_comissao";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Chip } from "@mui/material";
import saveComissaoApoio from "@/apis/saveComissaoApoio";

const formasPagamento = [
    { name: 'Selecione', id: '' },
    { name: 'Espécie', id: 'especie' },
    { name: 'Depósito', id: 'deposito' },
    { name: 'TED/DOC', id: 'ted_doc' },
    { name: 'PIX', id: 'pix' },
    { name: 'Cheque/Cheque adm.', id: 'cheque' },
];

const periodosPagamento = [
    { name: 'Selecione', id: '' },
    { name: 'Na assinatura do Recibo de Sinal', id: '1' },
    { name: 'Na retirada das certidões', id: '2' },
    { name: 'No ato da escritura do imóvel', id: '3' },
    { name: 'Na transferência de registros', id: '4' },
    //{ name: 'Na transferência de registros', id: '5' },
];

const formatNumber = (value: string) => {
    return Number((value.replace(/[R$.]+/g, '')).replace(",", "."));
};

interface PropsType {
    comissionData: ComissaoDataType | undefined
    setComissionData: (e: ComissaoDataType) => void
}

export default function EditDadosComissao(props: PropsType) {
    const { comissionData, setComissionData } = props;
    const errorMsg = 'Campo obrigatório';

    const {
        register, watch, setValue, setError, formState: { errors }, handleSubmit, clearErrors
    } = useForm<FormEditComissaoType>({
        defaultValues: {
            processo_id: '',
            valor_comissao_total: '',
            deducao: '',
            valor_comissao_liquida: '',
            liquida: null, // FORMA DE PAGAMENTO
            comissao: 'integral',
            quantidade_parcelas: '1',
            parcelas_empresa: comissionData?.parcelas_empresa || [],
            observacoes: '',
        }
    });
    const [errorParcelas, setErrorParcelas] = useState<string>()


    useEffect(() => {
        if (comissionData?.id && watch('processo_id') === '') {
            setValue('id', comissionData.id);
            setValue('processo_id', comissionData.processo_id);
            setValue('comissao', comissionData.comissao || 'integral');
            setValue('quantidade_parcelas', (comissionData.parcelas_empresa?.length || 1).toString());
            setValue('parcelas_empresa', comissionData?.parcelas_empresa?.length > 0 ? comissionData?.parcelas_empresa : []);
            setValue('observacoes', comissionData.observacoes || '');
            setValue('valor_comissao_liquida', comissionData.valor_comissao_liquida);
            setValue('valor_comissao_total', comissionData.valor_comissao_total);
            setValue('deducao', comissionData.deducao || '');
            setValue('liquida', comissionData.liquida || '');

            if (!comissionData?.parcelas_empresa || comissionData?.parcelas_empresa?.length <= 1) {
                setValue('parcelas_empresa.0.valor_parcela', comissionData.valor_comissao_liquida || '')
            }
            validateParcelasToLiquida();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comissionData]);

    const handleComissao = () => {
        if (!comissionData) return ''
        const comissaoTotal = formatNumber(watch('valor_comissao_total'));
        const deducao = formatNumber(watch('deducao') || '0');
        if (comissaoTotal > deducao) {
            clearErrors('deducao');
            const comissaoLiquida = formatoMoeda(((comissaoTotal - deducao) * 100).toString());
            if (watch('comissao') === 'integral') setValue('parcelas_empresa.0.valor_parcela', comissaoLiquida);
            else validateParcelasToLiquida()
            setValue('valor_comissao_liquida', comissaoLiquida);
            comissionData.valor_comissao_liquida = comissaoLiquida;
            onBlurFunction();
        } else {
            setError('deducao', { type: "validate", message: "Deducação deve ser menor que comissão total" });
            if (watch('comissao') === 'integral') setValue('parcelas_empresa.0.valor_parcela', '');
            setValue('valor_comissao_liquida', '');
            comissionData.valor_comissao_liquida = '';
        }
    };

    const handleRadioParcela = (e: string) => {
        if (e === 'integral') setValue('parcelas_empresa', [watch('parcelas_empresa.0')])
        else setValue('quantidade_parcelas', `${watch('parcelas_empresa').length}`)
        if(comissionData) {
            const valor = e === 'integral' ? 'Integral' : e === 'partes' ? 'Parcelada' : '';
            comissionData.tipo_pagamento = valor;
        }
        handleQuantParcelas(e === 'integral' ? 0 : Number(watch('quantidade_parcelas')));
        console.log('parcelas_empresa', watch('parcelas_empresa'));
    };

    const validateParcelasToLiquida = () => {
        if (!!watch('parcelas_empresa')[0]) {
            const comissaoTotal = formatNumber(watch('valor_comissao_total'));
            const deducao = formatNumber(watch('deducao') || '0');
            const comissaoLiquida = (comissaoTotal - deducao);
            const parcelasMap = watch('parcelas_empresa').map(parcela =>
                formatNumber(parcela.valor_parcela || '0')
            )
            const totalParcelas = parcelasMap.reduce((acc, value) => acc + value);

            const result = totalParcelas - comissaoLiquida === 0;
            const msgErrorSomaParcelas = `Soma das parcelas (${formatoMoeda((watch('parcelas_empresa').map(e => formatNumber(e.valor_parcela) * 100).reduce((acc, value) => acc + value)).toString())}) não correspondem ao total da comissão liquida. (${watch('valor_comissao_liquida') || comissionData?.valor_comissao_liquida})`
            if (result) setErrorParcelas(undefined)
            else setErrorParcelas(msgErrorSomaParcelas);
            return result;
        } else return true;
    };

    const dividirValorTotal = () => {
        const comissaoTotal = formatNumber(watch('valor_comissao_total'));
        const deducao = formatNumber(watch('deducao') || '0');
        const comissaoLiquida = (comissaoTotal - deducao);
        let parcelaIdeal = (comissaoLiquida / Number(watch('quantidade_parcelas') || 1)).toFixed(2);
        let value = comissaoLiquida;

        watch('parcelas_empresa')?.forEach((parcela, index_parcela) => {

            const valorParcela = watch('parcelas_empresa').length > index_parcela + 1
                ? formatoMoeda((parcelaIdeal).toString())
                : formatoMoeda((value.toFixed(2)).toString())

            valorParcela && setValue(`parcelas_empresa.${index_parcela}.valor_parcela`, valorParcela);
            if (value > Number(parcelaIdeal)) value = Number(value - Number(parcelaIdeal));

        });

        validateParcelasToLiquida();
    };
    
    const onBlurFunction = async () => {
        const valid = validateParcelasToLiquida()
        if (!valid) return '';

        const res = await saveComissaoApoio(watch());
        if (res?.comissao.status_comissao === 'true' && comissionData) {
            let arrComission = {};
            (Object.keys(watch())).forEach((key) => {
                const keyType = key as keyof FormEditComissaoType;
                if (watch(keyType)) {
                    arrComission = {
                        ...arrComission,
                        [keyType]: watch(keyType)
                    }
                }
            });
            setComissionData({
                ...comissionData,
                ...arrComission
            })
        }
    };

    const [options, setOptions] = useState([
        { label: 'Integral', value: 'integral', disabled: false, checked: false },
        { label: 'Parcelada', value: 'partes', disabled: false, checked: false },
    ]);

    const parcelasOptions = [
        {id: '0', name: 'Selecione' },
        {id: '1', name: '1x' },
        {id: '2', name: '2x' },
        {id: '3', name: '3x' },
        {id: '4', name: '4x' },
    ];

    const handleQuantParcelas = (quant: number) => {
        if (quant > 1) {
            let parcelas = [];
            for (let i = 0; i < quant; i++) {
                const valor = watch('parcelas_empresa')[i] || { valor_parcela: '', periodo_pagamento: '' };
                parcelas.push(valor);
            }
            setValue('parcelas_empresa', parcelas);
            dividirValorTotal();
        } else {
            const valor = [
                watch('parcelas_empresa')[0] || { valor_parcela: '', periodo_pagamento: '' },
            ];
            setValue('parcelas_empresa', valor);
            setValue('quantidade_parcelas', '1');
            setValue('parcelas_empresa.0.valor_parcela', watch('valor_comissao_liquida'));
        }
        onBlurFunction();
    };    
    
    const returnToEdit = () => {
        if(comissionData?.parcelas_empresa) {
            return comissionData.parcelas_empresa.every((parcela) => !!parcela.ultima_data_envio);
        } else return false;
    };

    return (
        <div className="container-edit">
            <div className="card-edit-comissao">
                <h4>Edite os dados da venda, se necessário</h4>

                <div className="block_empresa">
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
                            error={!!errors.deducao}
                            msgError={errors.deducao}
                            value={watch('deducao')}
                            sucess={!errors.deducao && !!watch('deducao')}
                            onBlurFunction={handleComissao}
                            {...register('deducao', {
                                // required: errorMsg,
                                setValueAs: (e) => formatoMoeda(e),
                                validate: (e) => formatNumber(e || '0') < formatNumber(watch('valor_comissao_total')) || "Deducação deve ser menor que comissão total"
                            })}
                        />

                        <InputText
                            label={'Comissão líquida*'}
                            placeholder={'R$'}
                            error={!!errors.valor_comissao_liquida}
                            disabled
                            value={watch('valor_comissao_liquida')}
                            sucess={!errors.valor_comissao_liquida && !!watch('valor_comissao_liquida')}
                            onBlurFunction={() => onBlurFunction()}
                            {...register('valor_comissao_liquida', {
                                // required: errorMsg,
                                setValueAs: (e) => formatoMoeda(e),
                                // onChange: (e) => handleComissao()
                            })}
                        />
                    </div>

                    <div className='select_pagamento'>
                        <InputSelect
                            label={'Forma de pagamento*'}
                            value={watch('liquida') || ''}
                            sucess={!!watch('liquida')}
                            msgError={errors.liquida}
                            error={!!errors.liquida}
                            option={formasPagamento}
                            onBlurFunction={() => onBlurFunction()}
                            {...register('liquida', {
                                required: errorMsg,
                                onChange: (e) => setValue('liquida', e.target.value)
                            })}
                        />
                    </div>

                    {/* {watch('comissao') === 'partes' &&
                        <>
                            <p>Venda parcelada</p>
                            <Chip className='chip green' label={`Parcelas de ${watch('parcelas_empresa').length}x`} />
                        </>
                    } */}

                    <p>Observações gerais da comissão</p>
                    <EmptyTextarea
                        minRows={3}
                        value={watch('observacoes') || ''}
                        label={'Caso necessário, insira observações para que o pós-venda fique atento.'}
                        placeholder='Exemplo: A primeira e segunda parcela do pagamento...'
                        {...register('observacoes', {
                            // required: errorMsg,
                            onChange: (e) => setValue('observacoes', e.target.value),
                            onBlur: () => onBlurFunction()
                        })} />

                </div>

            </div>

            <div className="card-edit-comissao">
                <h4>Tipo de venda</h4>
                <RowRadioButtonsGroup
                    name='comissao'
                    options={options}
                    setOptions={setOptions}
                    // disabled={returnToEdit()}
                    setValue={setValue}
                    label=''
                    value={watch('comissao') || ''}
                    changeFunction={(e) => handleRadioParcela(e)}
                />

                {watch('comissao') === 'partes' &&
                    <div className='select-input'>
                        <InputSelect
                            label={'Quantas parcelas?*'}
                            value={watch('quantidade_parcelas')}
                            option={parcelasOptions}
                            // disabled={returnToEdit()}
                            {...register('quantidade_parcelas', {
                                required: errorMsg,
                                onChange: (e) => handleQuantParcelas(Number(e.target.value))
                            })}
                        />
                    </div>
                }

                <div className="parcelas-container">
                    {watch('parcelas_empresa')?.map((parcela, index_parcela) => (
                        <div className='flex gap16' key={index_parcela}>
                            <div>
                                <InputText
                                    label={watch('parcelas_empresa').length > 1 ? index_parcela + 1 + 'ª Parcela*' : 'Parcela única*'}
                                    placeholder='R$'
                                    onBlurFunction={onBlurFunction}
                                    value={parcela?.valor_parcela}
                                    error={!!errors.parcelas_empresa?.[index_parcela]?.valor_parcela || !!errorParcelas}
                                    msgError={errors.parcelas_empresa?.[index_parcela]?.valor_parcela}
                                    sucess={!errors.parcelas_empresa?.[index_parcela]?.valor_parcela && !!watch(`parcelas_empresa.${index_parcela}.valor_parcela`)}
                                    {...register(`parcelas_empresa.${index_parcela}.valor_parcela`, {
                                        required: errorMsg,
                                        setValueAs: (e) => formatoMoeda(e),
                                    })}
                                />
                            </div>

                            <div className='select-input'>
                                <InputSelect
                                    label={'Periodo de pagamento*'}
                                    msgError={errors.parcelas_empresa?.[index_parcela]?.periodo_pagamento}
                                    error={!!errors.parcelas_empresa?.[index_parcela]?.periodo_pagamento}
                                    option={periodosPagamento}
                                    sucess={!!parcela?.periodo_pagamento}
                                    value={parcela?.periodo_pagamento}
                                    onBlurFunction={() => onBlurFunction()}
                                    {...register(`parcelas_empresa.${index_parcela}.periodo_pagamento`, {
                                        required: errorMsg,
                                        //   onChange: (e) => handleQuantLaudemios(Number(e.target.value))
                                    })}
                                />
                            </div>
                        </div>
                    ))}
                    {errorParcelas && <span className='errorMsg'>*{errorParcelas}</span>}
                </div>
            </div>

            <div className="card-edit-comissao">
                <h4>Observações gerais do gerente</h4>
                <p>{comissionData?.ultima_observacao_gerente || '---'}</p>
            </div>
        </div>
    )
}