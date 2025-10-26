import ButtonComponent from "@/components/ButtonComponent";
import SimpleDialog from "@/components/Dialog";
import { Check } from "@mui/icons-material";
import RadioGroup from '@/components/RadioGroup';
import { FieldErrors, UseFormClearErrors, UseFormRegister, UseFormSetError, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ComissaoIndividuoType, ParcelaComissoesType, ParcelaFranquiasType } from "@/interfaces/Apoio/planilhas_comissao";
import { useEffect, useState } from "react";
import InputSelect from "@/components/InputSelect/Index";
import InputText from "@/components/InputText/Index";

interface PropsType {
    register: UseFormRegister<ParcelaComissoesType>
    watch: UseFormWatch<ParcelaComissoesType>
    setValue: UseFormSetValue<ParcelaComissoesType>
    clearErrors: UseFormClearErrors<ParcelaComissoesType>
    setError: UseFormSetError<ParcelaComissoesType>
    errors: FieldErrors<ParcelaComissoesType>
    handleBlurPixCPF_CNPJ: (e: string) => boolean
    msgCPF: string
    msgCNPJ: string
    listBancos: ListType[]
    listChavesPix: ListType[]
    editPagamento: DialogEditPagamentoType
    setEditPagamento: (e: DialogEditPagamentoType) => void
};

interface DialogEditPagamentoType {
    key: keyof ParcelaFranquiasType,
    open: boolean
}

type ListType = {
    id: number | string
    nome: string
}

export default function EditPagamentoFranquias(props: PropsType) {
    const {
        register,
        watch,
        setValue,
        clearErrors,
        setError,
        errors,
        msgCPF,
        msgCNPJ,
        handleBlurPixCPF_CNPJ,
        listBancos,
        listChavesPix,
        editPagamento,
        setEditPagamento
    } = props;

    const msgObrigatorio = 'Campo obrigatório'

    const [tipoPagamento, setTipoPagamento] = useState([
        { value: 'pix', disabled: false, label: 'Pix', checked: false },
        { value: 'banco', disabled: false, label: 'Banco', checked: false }
    ]);

    useEffect(() => {
        clearErrors()
    }, [tipoPagamento])

    const handleCloseEditPagamento = () => {
        setEditPagamento({ key: 'royalties', open: false });
    };

    const handleSelectBanco = (e: string) => {
        if (editPagamento.open) {
            clearErrors(`${editPagamento.key}.banco_id`);
            setValue(`${editPagamento.key}.banco_id`, e)
            setValue(`${editPagamento.key}.nome_banco`, listBancos?.find((banco: any) => banco.id === e)?.nome || '');
        }
    };

    const handleBlurPixChave = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
        type keysType = 'corretores_vendedores.0.tipo_chave_pix_id' | 'corretores_vendedores.0.pix';
        if (e && editPagamento.key && editPagamento.open) {
            const key = e.target.name as keysType;
            const value = e.target.value;
            clearErrors(key);
            setValue(key, value);
            validPix();
        }
    };


    const validPix = () => {
        const keyChave = `${editPagamento.key}.pix` as const
        const typeChave = watch(`${editPagamento.key}.tipo_chave_pix_id`)
        const chave = watch(keyChave) || '';
        const isValid = handleBlurPixCPF_CNPJ(chave);

        if (Number(typeChave) === 1 && !isValid) {
            setError(keyChave, { type: "validate", message: chave.length > 11 ? msgCNPJ : msgCPF })

        } else {
            clearErrors(keyChave);
        }
    };

    const saveBtn = () => {
        const watchKey = `${editPagamento.key}` as const;
        const formData = watch(watchKey);

        if (formData.tipo_pagamento === 'pix') {
            const arrKeys = ['tipo_chave_pix_id', 'pix'] as const;
            if (!formData.tipo_chave_pix_id || !formData.pix) {
                arrKeys.forEach((key) => {
                    !formData[key] && setError(`${watchKey}.${key}`, { type: 'required', message: msgObrigatorio })
                })
            } else {
                handleCloseEditPagamento();
            }
        } else if (formData.tipo_pagamento === 'banco') {
            const arrKeys = ['agencia', 'banco_id', 'numero_conta'] as const;
            if (!formData.agencia || !formData.banco_id || !formData.numero_conta) {
                arrKeys.forEach((key) => {
                    !formData[key] && setError(`${watchKey}.${key}`, { type: 'required', message: msgObrigatorio })
                })
            } else {
                handleCloseEditPagamento();
            }

        } else {
            setError(`${watchKey}.tipo_pagamento`, { type: 'required' });
        }
    };

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
        type keysType = 'corretores_vendedores.0.numero_conta' | 'corretores_vendedores.0.agencia';
        const key = e?.target.name as keysType;
        const value = e?.target.value || '';
        console.log(key);
        clearErrors(key);
        setValue(key, value)
    };

    return (
        <SimpleDialog
            open={editPagamento?.open}
            onClose={handleCloseEditPagamento}
            title={'Informações de pagamento:'}
            Footer={
                <ButtonComponent
                    name='save_pagamento'
                    onClick={saveBtn}
                    endIcon={<Check />}
                    size={'medium'}
                    variant={'contained'}
                    label={'Salvar'}
                    labelColor="white"
                />
            }
            PaperProps={{
                className: 'dialog_save_pagamento apoio'
            }}
        >
            {editPagamento && <div className='dialog_content'>
                <h3>{watch(`${editPagamento.key}.name`)}</h3>
                <p>Dados bancários</p>
                <RadioGroup
                    label={''}
                    options={tipoPagamento}
                    setOptions={setTipoPagamento}
                    name={`${editPagamento.key}.tipo_pagamento`}
                    value={watch(`${editPagamento.key}.tipo_pagamento`)}
                    setValue={setValue}
                />

                {watch(`${editPagamento.key}.tipo_pagamento`) === 'banco' &&
                    <div className='flex gap16'>
                        <div className='select_banco'>
                            <InputSelect
                                label={'Banco*'}
                                value={watch(`${editPagamento.key}.banco_id`) || ''}
                                sucess={!!watch(`${editPagamento.key}.banco_id`)}
                                option={listBancos}
                                error={!!errors?.[editPagamento.key]?.banco_id}
                                msgError={errors?.[editPagamento.key]?.banco_id}
                                {...register(`${editPagamento.key}.banco_id`, {
                                    // required: errorMsg,
                                    onChange: (e) => handleSelectBanco(e.target.value)
                                })}
                            />
                        </div>

                        <InputText
                            label={'Agência*'}
                            placeholder={'0000'}
                            width='280px'
                            value={watch(`${editPagamento.key}.agencia`)}
                            sucess={!!watch(`${editPagamento.key}.agencia`)}
                            error={!!errors?.[editPagamento.key]?.agencia}
                            msgError={errors?.[editPagamento.key]?.agencia}
                            {...register(`${editPagamento.key}.agencia`, {
                                // required: errorMsg,
                                onChange: (e) => onChangeInput(e)
                            })}
                        />

                        <InputText
                            label={'Conta*'}
                            placeholder={'0000-1'}
                            width='280px'
                            sucess={!errors[editPagamento.key]?.numero_conta && !!watch(`${editPagamento.key}.numero_conta`)}
                            error={!!errors?.[editPagamento.key]?.numero_conta}
                            msgError={errors?.[editPagamento.key]?.numero_conta}
                            {...register(`${editPagamento.key}.numero_conta`, {
                                // required: errorMsg,                                
                                onChange: (e) => onChangeInput(e)
                            })}
                        />
                    </div>
                }
                {watch(`${editPagamento.key}.tipo_pagamento`) === 'pix' &&
                    <div className='flex gap16'>
                        <div className='select_pix'>
                            <InputSelect
                                label={'Tipo de Chave*'}
                                value={watch(`${editPagamento.key}.tipo_chave_pix_id`) || ''}
                                sucess={!!watch(`${editPagamento.key}.tipo_chave_pix_id`)}
                                option={listChavesPix}
                                error={!!errors?.[editPagamento.key]?.tipo_chave_pix_id}
                                msgError={errors?.[editPagamento.key]?.tipo_chave_pix_id}
                                {...register(`${editPagamento.key}.tipo_chave_pix_id`, {
                                    // required: errorMsg,
                                    onChange: (e) => handleBlurPixChave(e)
                                })}
                            />
                        </div>

                        <InputText
                            label={'Chave Pix*'}
                            placeholder={''}
                            hidden={watch(`${editPagamento.key}.tipo_pagamento`) === 'banco'}
                            width='280px'
                            error={!!errors?.[editPagamento.key]?.pix}
                            msgError={errors?.[editPagamento.key]?.pix}
                            value={watch(`${editPagamento.key}.pix`)}
                            sucess={!errors[editPagamento.key]?.pix && !!watch(`${editPagamento.key}.pix`)}
                            saveOnBlur={(e) => handleBlurPixChave(e)}
                            {...register(`${editPagamento.key}.pix`, {
                                // required: errorMsg,
                                // setValueAs: (e) => Number(watch(`${editPagamento.key}.tipo_chave_pix_id`)) === 1 && e
                                //     ? e.length <= 14 ? cpfMask(e) : e.length < 19 ? cnpjMask(e) : cnpjMask(e.slice(0, -1))
                                //     : e,
                                // validate: (e) => Number(watch(`${editPagamento.key}.tipo_chave_pix_id`)) === 1 && e
                                //     ? e.length <= 14 ? validarCPF(e) || msgCPF : validarCNPJ(e) || msgCNPJ
                                //     : true
                            })}
                        />
                    </div>

                }
            </div>
            }

        </SimpleDialog>
    )
}