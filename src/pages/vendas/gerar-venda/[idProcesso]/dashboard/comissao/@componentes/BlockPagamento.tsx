import React, { useEffect, useState, useContext } from 'react';
import { FieldError, useForm } from 'react-hook-form'
import ComissaoContext from '@/context/Vendas/ContextBlocks';
import InputText from '@/components/InputText/Index';
import InputSelect from '@/components/InputSelect/Index';
import RadioGroup from "@/components/RadioGroup";
import EmptyTextarea from '@/components/TextArea';
import formatoMoeda from '@/functions/formatoMoeda';
import ButtonComponent from '@/components/ButtonComponent';
import { Alert, Chip, Input } from '@mui/material';
import { FaExclamationCircle } from 'react-icons/fa';

type BlockProps = {
    handleNextBlock: (index: number) => void;
    handlePrevBlock: (index: number) => void;
    index: number;
    data: any;
    Footer: React.FC<{
        goToPrevSlide: (index: number) => void;
        goToNextSlide: any;
        index: number;
    }>
};

type Options = {
    value: string;
    disabled: boolean;
    label: string;
    checked: boolean;
    width?: string;
    percent?: number;
}[];

type ArrayResponsaveisType = { id: '', usuario_id: string; valor_pagamento: string; };

const BlockPage: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer }) => {
    const {
        setDataSave, dataProcesso, selectItem,
    } = useContext(ComissaoContext);

    const errorMsg = 'Campo obrigatório';
    const RADIOVALUE = [
        { value: '1', disabled: false, label: 'Recibo de Sinal', checked: false },
        { value: '2', disabled: false, label: 'Certidões', checked: false },
        { value: '3', disabled: false, label: 'Escritura', checked: false },
        { value: '4', disabled: false, label: 'Registro', checked: false },
    ];
    const [radioPeriodos, setRadioPeriodos] = useState<Options[]>([RADIOVALUE]);

    const [options, setOptions] = useState([
        { value: 'integral', disabled: false, label: 'Integral', checked: false },
        { value: 'partes', disabled: false, label: 'Parcelado', checked: false }
    ]);

    const [listQuantRespo, setListQuantRespo] = useState([
        { name: 'Selecione', id: 0 },
    ]);
    const [listResponsaveis, setListResponsaveis] = useState<any[]>([]);

    const [parcelasOptions] = useState(() => {
        const array = [
            { id: '0', name: 'Selecione' },
        ]
        for (let i = 1; index < 21; index++) {
            array.push({ id: `${index}`, name: `${index}` });
        }
        return array
    });

    const respoEmpty = { id: '', usuario_id: '', valor_pagamento: '' };
    const parcelaEmpty = { valor_parcela: '', periodo_pagamento: '', id: '', quantidade_responsaveis: 1, responsaveis_pagamento: [respoEmpty] };

    const {
        register,
        unregister,
        watch,
        setValue,
        setError,
        formState: { errors },
        handleSubmit,
        clearErrors
    } = useForm({
        defaultValues: {
            comissao: 'integral',
            quantidade_parcelas: '1',
            parcelas_empresa: [parcelaEmpty],
            observacoes: '',
            valor_comissao_liquida: '',
            valor_comissao_total: '',
            deducao: '',
            liquida: '', // FORMA DE PAGAMENTO            
        }
    });

    useEffect(() => {
        if (selectItem === index) {
            console.log("Form: ", watch());
            console.log("Errors: ", errors);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch(), errors]);

    if (watch) console.log(watch(`parcelas_empresa.0.responsaveis_pagamento`));
    console.log("Data Processo: ", dataProcesso);

    useEffect(() => {
        console.log(watch('comissao'));

        if (dataProcesso && dataProcesso.comissao.id) {
            setValue('comissao', !!dataProcesso.comissao.parcelas_empresa[1] ? 'partes' : 'integral');
            setValue('quantidade_parcelas', dataProcesso.comissao.parcelas_empresa?.length || 1);
            setValue('parcelas_empresa', dataProcesso.comissao?.parcelas_empresa?.length > 0 ? dataProcesso.comissao?.parcelas_empresa : [parcelaEmpty]);
            setValue('observacoes', dataProcesso.comissao.observacoes);
            setValue('valor_comissao_liquida', dataProcesso.comissao.valor_comissao_liquida);
            setValue('valor_comissao_total', dataProcesso.comissao.valor_comissao_total);
            setValue('deducao', dataProcesso.comissao.deducao);
            setValue('liquida', dataProcesso.comissao.liquida || '');
            setListResponsaveis([...dataProcesso.vendedores, ...dataProcesso.compradores]);

            if (dataProcesso.comissao?.parcelas_empresa) {
                dataProcesso.comissao.parcelas_empresa.forEach((parcela: { periodo_pagamento: string, responsaveis_pagamento: ArrayResponsaveisType[]; }, index_parcela: any) => {
                    if (!parcela.responsaveis_pagamento || parcela.responsaveis_pagamento.length === 0) {
                        setValue(`parcelas_empresa.${index_parcela}.responsaveis_pagamento`, [respoEmpty]);
                    } else {
                        setValue(`parcelas_empresa.${index_parcela}.quantidade_responsaveis`, parcela.responsaveis_pagamento.length || 1);
                        setValue(`parcelas_empresa.${index_parcela}.responsaveis_pagamento`, parcela.responsaveis_pagamento);
                    }
                    radioPeriodos.push(radioPeriodos[index_parcela] || RADIOVALUE);
                    radioPeriodos[index_parcela] = radioPeriodos[index_parcela].map(item => ({
                        ...item,
                        checked: item.value === parcela.periodo_pagamento,
                    }));

                    disablePeridoRepetido()
                });
            };

            const quantRespo = dataProcesso.compradores.length + dataProcesso.vendedores.length;
            console.log("Quantidade de Responsáveis: ", quantRespo);

            setListQuantRespo(Array.from({ length: quantRespo }, (_, i) => ({ name: `${i + 1}`, id: i + 1 })));

            if (!dataProcesso.comissao?.parcelas_empresa || dataProcesso.comissao?.parcelas_empresa?.length <= 1) {
                setValue('parcelas_empresa.0.valor_parcela', dataProcesso.comissao.valor_comissao_liquida || '')
            }
            checkComissaoTotal()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataProcesso]);

    const handleClick = (direction: string) => {
        if (direction === 'NEXT') {
            handleNextBlock(index);
        } else {
            handlePrevBlock(index);
        }
    };

    const handleQuantParcelas = (parcelas: number) => {
        let parcelasArray = [];
        const newRadios = [];
        for (let i = 0; i < parcelas; i++) {
            parcelasArray.push(watch(`parcelas_empresa.${i}`) || parcelaEmpty);
            newRadios.push(radioPeriodos[i] || RADIOVALUE);
        };
        setRadioPeriodos(newRadios);
        disablePeridoRepetido()

        if (parcelasArray.length < Number(watch('parcelas_empresa').length)) {
            // Remove as demais parcelas do registro do useForm
            for (let i = parcelas; i < watch('parcelas_empresa').length; i++) {
                unregister(`parcelas_empresa.${i}`);
            }
        }

        if (parcelasArray.length === 1) {
            setValue('parcelas_empresa.0.valor_parcela', watch('valor_comissao_liquida'))
        }

        setValue('parcelas_empresa', parcelasArray)
        dividirValorTotal();
    };

    const formatNumber = (value: string) => {
        if (!value) return 0;
        return Number((value.replace(/[R$.]+/g, '')).replace(",", "."));
    };

    const handleRadioParcela = (e: string) => {
        if (e === 'integral') setValue('parcelas_empresa', [watch('parcelas_empresa.0')])
        else setValue('quantidade_parcelas', `${watch('parcelas_empresa').length}`);

        handleQuantRespo(0, Number(watch('quantidade_parcelas')) || 1);
        setDataSave({ ...watch() });
    };

    // DIVIDI VALOR TOTAL ENTRE AS PARCELAS
    const dividirValorTotal = () => {
        const comissaoTotal = formatNumber(watch('valor_comissao_total'));
        const deducao = formatNumber(watch('deducao'));
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

        dividirValorResponsaveis();
    };

    const dividirValorResponsaveis = () => {
        watch('parcelas_empresa')?.forEach((parcela, index_parcela) => {
            const responsaveis = watch(`parcelas_empresa.${index_parcela}.responsaveis_pagamento`);
            if (responsaveis && responsaveis.length > 0) {
                const valorParcela = formatNumber(parcela.valor_parcela);
                const quantidadeRespo = responsaveis.length;
                const valorDividido = (valorParcela / quantidadeRespo).toFixed(2);
                let value = valorParcela;

                responsaveis.forEach((respo, index_respo) => {
                    console.log(value);

                    const valorParcela = responsaveis.length > index_respo + 1
                        ? formatoMoeda((valorDividido).toString())
                        : formatoMoeda((value.toFixed(2)).toString())
                    setValue(`parcelas_empresa.${index_parcela}.responsaveis_pagamento.${index_respo}.valor_pagamento`, valorParcela);
                    if (value > Number(valorDividido)) value = Number(value - Number(valorDividido));
                });
            }
        });
        checkComissaoTotal();
    };

    const handleQuantRespo = (index_parcela: number, quantidade: number) => {
        let responsaveisArray = [];
        setValue(`parcelas_empresa.${index_parcela}.quantidade_responsaveis`, quantidade || 1);

        for (let i = 0; i < quantidade; i++) {
            responsaveisArray.push(watch(`parcelas_empresa.${index_parcela}.responsaveis_pagamento.${i}`) || respoEmpty);
        };
        setValue(`parcelas_empresa.${index_parcela}.responsaveis_pagamento`, responsaveisArray);
        dividirValorResponsaveis();
    };

    const handleChangeRespo = (e: React.ChangeEvent<HTMLInputElement>, index_parcela: number, index_respo: number) => {
        setValue(`parcelas_empresa.${index_parcela}.responsaveis_pagamento.${index_respo}.usuario_id`, e.target.value);
    };

    const checkComissaoTotal = () => {
        const comissaoLiquida = formatNumber(watch("valor_comissao_liquida"));
        console.log("Comissão Líquida: ", comissaoLiquida);
        const parcelas = watch('parcelas_empresa') || [];

        const totalComissaoResponsaveis = parcelas.map(parcela =>
            parcela.responsaveis_pagamento.map(respo =>
                formatNumber(respo.valor_pagamento.replace(/[R$.]+/g, ''))
            ).reduce((acc, value) => acc + value, 0)
        ).reduce((acc, value) => acc + value, 0);
        console.log("Total Comissão Responsáveis: ", totalComissaoResponsaveis);

        const totalParcelas = parcelas.map(parcela =>
            formatNumber(parcela.valor_parcela.replace(/[R$.]+/g, ''))
        ).reduce((acc, value) => acc + value, 0);
        console.log("Total Parcelas: ", totalParcelas);

        if (totalParcelas > 0 && totalParcelas !== comissaoLiquida) {
            setError('parcelas_empresa', {
                type: 'manual',
                message: `A soma dos valores das parcelas (${formatoMoeda(totalParcelas.toString())}) não corresponde ao total da comissão líquida (${formatoMoeda(comissaoLiquida.toString())}).`
            });
        } else {
            clearErrors('parcelas_empresa');
        }

        parcelas?.forEach((parcela, index_parcela) => {
            const responsaveis = watch(`parcelas_empresa.${index_parcela}.responsaveis_pagamento`);
            if (responsaveis && responsaveis.length > 0) {
                const valorParcela = formatNumber(parcela.valor_parcela);
                const valorTotalResponsaveis = responsaveis.map(respo => formatNumber(respo.valor_pagamento)).reduce((acc, value) => acc + value, 0);
                console.log(`Valor Parcela ${index_parcela + 1}: `, valorParcela);
                console.log(`Total Responsáveis Parcela ${index_parcela + 1}: `, valorTotalResponsaveis);
                if (valorTotalResponsaveis > 0 && valorTotalResponsaveis !== valorParcela) {
                    watch(`parcelas_empresa.${index_parcela}.responsaveis_pagamento`)?.forEach((respo, index_respo) => {
                        setError(`parcelas_empresa.${index_parcela}.responsaveis_pagamento.${index_respo}.valor_pagamento`, {
                            type: 'manual',
                            message: `A soma dos valores dos responsáveis pela 
                            ${index_parcela + 1}º parcela 
                            (${formatoMoeda(valorTotalResponsaveis.toFixed(2))}) não corresponde ao valor total de (${formatoMoeda(valorParcela.toFixed(2))}).`
                        });
                    });
                } else {
                    clearErrors(`parcelas_empresa.${index_parcela}.responsaveis_pagamento`);
                }

            }
        })
    };

    const onBlurValores = () => {
        checkComissaoTotal();
        setDataSave({ ...watch() });
    };

    const disablePeridoRepetido = () => {
        const periodos = watch('parcelas_empresa').map(parcela => parcela.periodo_pagamento);
        const newValue = radioPeriodos.map(periodo => {
            return periodo.map(item => {
                return {
                    ...item,
                    disabled: periodos.includes(item.value) && !item.checked
                };
            });
        });
        setRadioPeriodos(newValue);
    };

    const onChangeRadioPeriodo = (value: string, index_parcela: number) => {
        setValue(`parcelas_empresa.${index_parcela}.periodo_pagamento`, value);
        clearErrors(`parcelas_empresa.${index_parcela}.periodo_pagamento`);
        disablePeridoRepetido();
        setDataSave({ ...watch() })
    };

    return (

        <>
            {!!watch &&
                <div className="block_empresa comissao gerente">
                    <h1>Pagamento e período de comissionamento</h1>

                    <RadioGroup
                        value={watch('comissao')}
                        name='comissao'
                        label=''
                        options={options}
                        setOptions={setOptions}
                        setValue={setValue}
                        changeFunction={handleRadioParcela}
                    />

                    {watch('comissao') === 'partes' &&
                        <div className='center flex gap16'>
                            <div className='select_parcelas'>
                                <InputSelect
                                    label={'Quantas parcelas?*'}
                                    value={watch('quantidade_parcelas')}
                                    option={parcelasOptions}
                                    onBlurFunction={() => setDataSave({ ...watch() })}
                                    {...register('quantidade_parcelas', {
                                        required: errorMsg,
                                        onChange: (e) => handleQuantParcelas(Number(e.target.value))
                                    })}
                                />
                            </div>
                        </div>
                    }

                    {watch('parcelas_empresa')?.map((parcela, index_parcela) => (
                        <div className='parcela-container' key={index_parcela}>
                            <div className='header-parcela'>
                                <div className='numero-parcela'>
                                    <Chip label={watch('parcelas_empresa').length > 1 ? `Parcela ${index_parcela + 1}` : "Integral"} className='green chip' />
                                    <span className='r-s2'>COMISSÃO</span>
                                </div>
                                <div className='valor-total'>
                                    <span className='r-s2'>COMISSÃO LIQUIDA</span>
                                    <Chip label={formatoMoeda(watch('valor_comissao_liquida'))} className='green chip' />
                                </div>
                            </div>

                            <div className='row'>
                                <InputText
                                    label={watch('parcelas_empresa').length > 1 ? index_parcela + 1 + 'ª Parcela*' : 'Parcela única*'}
                                    placeholder='R$'
                                    onBlurFunction={onBlurValores}
                                    value={parcela?.valor_parcela}
                                    error={!!errors.parcelas_empresa?.[index_parcela]?.valor_parcela}
                                    msgError={errors.parcelas_empresa?.[index_parcela]?.valor_parcela}
                                    sucess={!errors.parcelas_empresa?.[index_parcela]?.valor_parcela && !!watch(`parcelas_empresa.${index_parcela}.valor_parcela`)}
                                    {...register(`parcelas_empresa.${index_parcela}.valor_parcela`, {
                                        required: errorMsg,
                                        setValueAs: (e) => formatoMoeda(e),
                                    })}
                                />
                                <div className={`radio-group ${errors.parcelas_empresa?.[index_parcela]?.periodo_pagamento ? 'error' : ''}`}>
                                    <RadioGroup
                                        value={parcela?.periodo_pagamento}
                                        label='PERÍODO DE PAGAMENTO:'
                                        setOptions={(data) => setRadioPeriodos([...radioPeriodos.slice(0, index_parcela), data, ...radioPeriodos.slice(index_parcela + 1)])}
                                        options={radioPeriodos[index_parcela]}
                                        setValue={setValue}
                                        changeFunction={(value) => onChangeRadioPeriodo(value, index_parcela)}
                                        // changeFunction={() => { disablePeridoRepetido(); setDataSave({ ...watch() }) }}
                                        {...register(`parcelas_empresa.${index_parcela}.periodo_pagamento`, {
                                            required: errorMsg,
                                        })}
                                    />
                                    {
                                        errors?.parcelas_empresa?.[index_parcela]?.periodo_pagamento &&
                                        <span className='errorMsg'>*{errors?.parcelas_empresa?.[index_parcela]?.periodo_pagamento?.message}</span>
                                    }
                                </div>
                            </div>

                            <div className='responsaveis'>
                                <span className='r-s2'>RESPONSÁVEIS PELO PAGAMENTO:</span>
                                {/* {!listQuantRespo[0] && <span className='r-s2'>Cadastre pelo menos 1 Vendedor ou Comprador para selecionar o responsável.</span>} */}
                                {!listQuantRespo[0] && <Alert
                                    className='alert yellow'
                                    icon={<FaExclamationCircle size={20} />}
                                    // onClose={handleCloseTips}
                                    //severity={feedbackRestaurar.error ? "error" : "success"}
                                    variant="filled"
                                    sx={{ width: '100%' }}
                                >                                    
                                    Cadastre pelo menos 1 <b>Vendedor</b> ou <b>Comprador</b> para selecionar o responsável.
                                </Alert>}
                                <div className='quantidade'>
                                    <InputSelect
                                        label={'Quantidade'}
                                        value={!listQuantRespo[0] ? '' : watch(`parcelas_empresa.${index_parcela}.quantidade_responsaveis`) || 0}
                                        disabled={!listQuantRespo[0]}
                                        option={listQuantRespo}
                                        onBlurFunction={() => setDataSave({ ...watch() })}
                                        {...register(`parcelas_empresa.${index_parcela}.quantidade_responsaveis`, {
                                            // required: errorMsg,
                                            onChange: (e) => handleQuantRespo(index_parcela, Number(e.target.value)),
                                        })} />

                                    <div className='responsaveis-grid-container'>
                                        {Array.isArray(watch(`parcelas_empresa.${index_parcela}.responsaveis_pagamento`)) &&
                                            watch(`parcelas_empresa.${index_parcela}.responsaveis_pagamento`).map((respo, index_respo) => (
                                                <div className='responsavel-container' key={index_respo * 100}>
                                                    <InputSelect
                                                        label={'Vendedor/Comprador'}
                                                        value={respo.usuario_id}
                                                        disabled={!listQuantRespo[0]}
                                                        option={listResponsaveis}
                                                        onBlurFunction={() => setDataSave({ ...watch() })}
                                                        {...register(`parcelas_empresa.${index_parcela}.responsaveis_pagamento.${index_respo}.usuario_id`, {
                                                            // required: errorMsg,
                                                            onChange: (e) => handleChangeRespo(e, index_parcela, index_respo),
                                                        })}
                                                    />

                                                    <InputText
                                                        label={'Valor de pagamento'}
                                                        placeholder='R$'
                                                        value={respo.valor_pagamento}
                                                        disabled={!listQuantRespo[0]}
                                                        error={!!errors.parcelas_empresa?.[index_parcela]?.responsaveis_pagamento?.[index_respo]?.valor_pagamento}
                                                        msgError={errors.parcelas_empresa?.[index_parcela]?.responsaveis_pagamento?.[index_respo]?.valor_pagamento}
                                                        sucess={!errors.parcelas_empresa?.[index_parcela]?.responsaveis_pagamento?.[index_respo]?.valor_pagamento && !!respo.valor_pagamento}
                                                        onBlurFunction={onBlurValores}
                                                        {...register(`parcelas_empresa.${index_parcela}.responsaveis_pagamento.${index_respo}.valor_pagamento`, {
                                                            // required: errorMsg,
                                                            setValueAs: (e) => formatoMoeda(e)
                                                        })} />

                                                </div>
                                            ))}
                                    </div>


                                </div>

                            </div>

                        </div>
                    ))}

                    { }

                    <p>Observações gerais da comissão</p>
                    <EmptyTextarea
                        minRows={3}
                        value={watch('observacoes')}
                        label={'Caso necessário, insira observações para que o pós-venda fique atento.'}
                        placeholder='Exemplo: A primeira e segunda parcela do pagamento...'
                        {...register('observacoes', {
                            // required: errorMsg,
                            onChange: (e) => setValue('observacoes', e.target.value),
                            onBlur: () => setDataSave({ ...watch() })
                        })} />

                </div>
            }

            {Footer &&
                <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(() => handleClick("NEXT"))} index={index} />}
        </>

    );
};

export default BlockPage;