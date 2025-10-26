import InputSelect from '@/components/InputSelect/Index';
import formatoMoeda from '@/functions/formatoMoeda';
import { useEffect, useState } from 'react';
import { FieldError, useForm } from 'react-hook-form'
import RadioGroup from "@/components/RadioGroup";
import InputText from '@/components/InputText/Index';
import { ArrayResponsaveisPagamentoType, ComissionType, ParcelaType } from '@/interfaces/Financeiro/Status';
import { ExibirPendenciasType } from '@/interfaces/Vendas/Pendencias';
import ButtonComponent from '@/components/ButtonComponent';
import { Check } from '@mui/icons-material';
import editarPagadoresResponsaveis from '@/apis/postEditarPagadoresRespo';
import { Chip, Tooltip } from '@mui/material';
import formatoMoedaView from "@/functions/formatoMoedaViewApenas";

interface PropsType {
    // changeEditar: boolean;
    setChangeEditar: (value: boolean) => void;
    processData?: ExibirPendenciasType
    retunProcess: () => void;
}

type FormType = {
    parcelas_empresa: { valor_parcela: string, periodo_pagamento: string, id: string, quantidade_responsaveis: number, responsaveis_pagamento: { id: number | null, usuario_id: number | null, valor_pagamento: string }[] };
    valor_comissao_liquida: string;
};

export default function EditarDadosResponsaveis(props: PropsType) {
    const { processData, setChangeEditar, retunProcess } = props;
    const [loading, setLoading] = useState(false);
    const errorMsg = 'Campo obrigatório';

    const parcelaEmpty = { valor_parcela: '', periodo_pagamento: '', id: '', quantidade_responsaveis: 1, responsaveis_pagamento: [] };
    const emptyResponsaveis = { id: null, usuario_id: null, valor_pagamento: '' };

    const [listQuantRespo, setListQuantRespo] = useState([
        { name: 'Selecione', id: 0 },
    ]);
    const [listResponsaveis, setListResponsaveis] = useState<any[]>([]);

    useEffect(() => {
        if (processData) {
            setListResponsaveis([...processData.compradores_vendedores]);

            if (processData) {
                if (!processData.dados_parcela.responsaveis_pagamento || processData.dados_parcela.responsaveis_pagamento.length === 0) {
                    setValue(`parcelas_empresa.responsaveis_pagamento`, [emptyResponsaveis]);
                } else {
                    setValue(`parcelas_empresa.quantidade_responsaveis`, processData.dados_parcela.responsaveis_pagamento.length || 1);
                    setValue(`parcelas_empresa.responsaveis_pagamento`, processData.dados_parcela.responsaveis_pagamento);
                }
            };

            const quantRespo = processData.compradores_vendedores.length || 0;
            console.log("Quantidade de Responsáveis: ", quantRespo);
            setListQuantRespo(Array.from({ length: quantRespo }, (_, i) => ({ name: `${i + 1}`, id: i + 1 })));
            setValue('parcelas_empresa.valor_parcela', processData.dados_parcela.valor_parcela || '')
            checkComissaoTotal()
        }
    }, [processData]);

    const {
        register,
        watch,
        setValue,
        setError,
        formState: { errors },
        handleSubmit,
        clearErrors
    } = useForm<FormType>({
        defaultValues: {
            parcelas_empresa: parcelaEmpty,
            valor_comissao_liquida: '0,00',
        }
    });

    const formatNumber = (value: string) => {
        if (!value) return 0;
        return Number((value.replace(/[R$.]+/g, '')).replace(",", "."));
    };

    const dividirValorResponsaveis = () => {
        const responsaveis = watch(`parcelas_empresa.responsaveis_pagamento`);
        if (responsaveis && responsaveis.length > 0 && processData) {
            const valorParcela = formatNumber(processData.dados_parcela.valor_parcela);
            const quantidadeRespo = responsaveis.length;
            const valorDividido = (valorParcela / quantidadeRespo).toFixed(2);
            let value = valorParcela;

            responsaveis.forEach((respo, index_respo) => {
                console.log(value);

                const valorParcela = responsaveis.length > index_respo + 1
                    ? formatoMoeda((valorDividido).toString())
                    : formatoMoeda((value.toFixed(2)).toString())
                setValue(`parcelas_empresa.responsaveis_pagamento.${index_respo}.valor_pagamento`, valorParcela);
                if (value > Number(valorDividido)) value = Number(value - Number(valorDividido));
            });
        }
        checkComissaoTotal();
    };

    const handleQuantRespo = (quantidade: number) => {
        let responsaveisArray = [];
        setValue(`parcelas_empresa.quantidade_responsaveis`, quantidade || 1);

        for (let i = 0; i < quantidade; i++) {
            responsaveisArray.push(watch(`parcelas_empresa.responsaveis_pagamento.${i}`) || { id: '', usuario_id: '', valor_pagamento: '' });
        };
        setValue(`parcelas_empresa.responsaveis_pagamento`, responsaveisArray);
        dividirValorResponsaveis();
    };

    const handleChangeRespo = (e: React.ChangeEvent<HTMLInputElement>, index_respo: number) => {
        setValue(`parcelas_empresa.responsaveis_pagamento.${index_respo}.usuario_id`, Number(e.target.value));
    };

    const checkComissaoTotal = () => {
        const parcela = watch('parcelas_empresa') || [];
        const responsaveis = watch(`parcelas_empresa.responsaveis_pagamento`);
        if (responsaveis && responsaveis.length > 0) {
            const valorParcela = formatNumber(parcela.valor_parcela);
            const valorTotalResponsaveis = responsaveis.map(respo => formatNumber(respo.valor_pagamento)).reduce((acc, value) => acc + value, 0);
            console.log(`Valor Parcela: `, valorParcela);
            console.log(`Total Responsáveis Parcela: `, valorTotalResponsaveis);
            if (valorTotalResponsaveis > 0 && valorTotalResponsaveis !== valorParcela) {
                watch(`parcelas_empresa.responsaveis_pagamento`)?.forEach((respo, index_respo) => {
                    setError(`parcelas_empresa.responsaveis_pagamento.${index_respo}.valor_pagamento`, {
                        type: 'manual',
                        message: `A soma dos valores dos responsáveis pela parcela
                            (${formatoMoeda(valorTotalResponsaveis.toFixed(2))}) não corresponde ao valor total de (${formatoMoeda(valorParcela.toFixed(2))}).`
                    });
                });
            } else {
                clearErrors(`parcelas_empresa.responsaveis_pagamento`);
            }
        }
    };

    const onChangePagadores = async () => {
        setLoading(true);
        const parcela = watch('parcelas_empresa') || parcelaEmpty;
        if (processData && parcela) {
            const dataToSend = {
                responsaveis_pagamento: parcela.responsaveis_pagamento as ArrayResponsaveisPagamentoType[],
                parcela_id: processData.dados_parcela.parcela_id
            };
            console.log(dataToSend);
            const response = await editarPagadoresResponsaveis(dataToSend);
            console.log("Response Editar Pagadores: ", response);
            if (!!response && !!response.status) {
                retunProcess();
                setChangeEditar(false);
            } else {
                alert(`Erro: ${response?.message || 'Tente novamente mais tarde.'}`);
            }
        }
        setLoading(false);
    };

    const TooltipRateioContainer = (processData: ExibirPendenciasType) => {
        const parcelado = processData.dados_comissao_geral.tipo === 'PARCELADO';
        return (
            <div className="tooltip-rateio-container">
                {parcelado
                    ? <>
                        <p className="p1">Valor da parcela atual: </p>
                        <Chip className="chip orange" label={formatoMoedaView(processData.dados_parcela.valor_parcela)} />
                        <p className="p1">Valor comissão total: </p>
                        <Chip className="chip primary" label={formatoMoedaView(processData.dados_comissao_geral.valor_comissao_liquida)} />
                    </>
                    : <>
                        <p className="p1">Valor comissão total: </p>
                        <Chip className="chip orange" label={formatoMoedaView(processData.dados_comissao_geral.valor_comissao_liquida)} />
                    </>
                }
            </div>
        )
    };

    return (
        <>
            <div className='responsaveis-pagamento-pendencias'>
                <div className='title-chip'>
                    <h3>Editar pagadores:</h3>
                    {processData?.dados_parcela.valor_parcela && <Tooltip
                        title={TooltipRateioContainer(processData)}
                        placement="bottom"
                        arrow
                        slotProps={{
                            tooltip: { className: 'tooltip-rateio' }
                        }}
                    >
                        <Chip className="chip orange" label={formatoMoedaView(processData.dados_parcela.valor_parcela)} />
                    </Tooltip>}
                </div>
                {!!watch &&
                    <div className='responsaveis-pagamento'>
                        <InputSelect
                            label={'Quantidade'}
                            value={!listQuantRespo[0] ? '' : watch(`parcelas_empresa.quantidade_responsaveis`) || 0}
                            disabled={!listQuantRespo[0]}
                            option={listQuantRespo}
                            onBlurFunction={() => checkComissaoTotal()}
                            {...register(`parcelas_empresa.quantidade_responsaveis`, {
                                // required: errorMsg,
                                onChange: (e) => handleQuantRespo(Number(e.target.value)),
                            })} />

                        <div className='responsaveis-grid-container'>
                            {Array.isArray(watch(`parcelas_empresa.responsaveis_pagamento`)) &&
                                watch(`parcelas_empresa.responsaveis_pagamento`).map((respo, index_respo) => (
                                    <div className='responsavel-container' key={index_respo * 100}>
                                        <InputSelect
                                            label={'Vendedor/Comprador'}
                                            value={respo.usuario_id || ''}
                                            disabled={!listQuantRespo[0]}
                                            option={listResponsaveis}
                                            onBlurFunction={() => checkComissaoTotal()}
                                            {...register(`parcelas_empresa.responsaveis_pagamento.${index_respo}.usuario_id`, {
                                                // required: errorMsg,
                                                onChange: (e) => handleChangeRespo(e, index_respo),
                                            })}
                                        />

                                        <InputText
                                            label={'Valor de pagamento'}
                                            placeholder='R$'
                                            value={respo.valor_pagamento}
                                            disabled={!listQuantRespo[0]}
                                            error={!!errors.parcelas_empresa?.responsaveis_pagamento?.[index_respo]?.valor_pagamento}
                                            msgError={errors.parcelas_empresa?.responsaveis_pagamento?.[index_respo]?.valor_pagamento}
                                            sucess={!errors.parcelas_empresa?.responsaveis_pagamento?.[index_respo]?.valor_pagamento && !!respo.valor_pagamento}
                                            onBlurFunction={checkComissaoTotal}
                                            {...register(`parcelas_empresa.responsaveis_pagamento.${index_respo}.valor_pagamento`, {
                                                // required: errorMsg,
                                                setValueAs: (e) => formatoMoeda(e)
                                            })} />

                                    </div>
                                ))}
                        </div>
                    </div>
                }

            </div>
            <footer className="footer">

                <ButtonComponent
                    label="Salvar"
                    labelColor="white"
                    size="medium"
                    variant="contained"
                    name='prosseguir'
                    disabled={!!errors.parcelas_empresa || loading}
                    onClick={handleSubmit(onChangePagadores)}
                    endIcon={<Check />}
                />

            </footer>
        </>
    )
}