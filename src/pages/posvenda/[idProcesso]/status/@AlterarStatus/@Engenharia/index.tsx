import GetListBancos from '@/apis/getListBancos';
import InputSelect from '@/components/InputSelect/Index'
import InputText from '@/components/InputText/Index'
import dateMask from '@/functions/dateMask'
import horaMask from '@/functions/horaMask';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import CheckBox from '@/components/CheckBox'
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { FormValues, Visualizar } from '@/interfaces/PosVenda/AlterarStatus';
import { SelectsType } from '@/interfaces/PosVenda/Analise';

interface IListaBancos {
    id: number,
    nome: string
}

interface ICard {
    handleInput: (type: string, e: any) => void
    register: UseFormRegister<FormValues>
    watch: UseFormWatch<FormValues>
    errors: FieldErrors<FormValues>
    setValue: UseFormSetValue<FormValues>
    topics?: SelectsType
    cardSelect?: Visualizar
}

export default function Engenharia({ handleInput, register, watch, errors, setValue, topics, cardSelect }: ICard) {
    const errorMsg = 'Campo obrigatório';
    const [listaBancos, setListaBancos] = useState<IListaBancos[]>([]);
    const [bancoSelecionado, setBancoSelecionado] = useState<number>();
    const listBanks = async () => {
        const res: any = await GetListBancos();
        console.log(res)
        setListaBancos(res);
    }
    const [checkedInforme, setCheckedInforme] = useState(false);

    // console.log('WATCH: ' , watch())

    useEffect(() => {
        listBanks();
    }, []);

    useEffect(() => {
        if(!cardSelect?.engenharia){
            if (topics) {
                setValue('banco', topics?.data?.[0]?.banks_id?.toString() || '');
            }   
        }
        setValue('check_engenharia', cardSelect?.engenharia?.[0]?.check_engenharia === 1 ? true : false || false);
        setCheckedInforme(cardSelect?.engenharia?.[0]?.check_engenharia === 1 ? true : false || false);
    }, [topics])

    
    const InformeCheck = [
        { index: 0, label: "Informe ao gerente que o Laudo de Engenharia foi aprovado.", value: checkedInforme ? '1' : '0', path: "check.importante", checked: checkedInforme },
    ];

    const handleCheck = (e: any) => {
        setCheckedInforme(e.target.checked);
        setValue('check_engenharia', e.target.checked);
    };

    return (
        <>
            {!!watch && !!register &&
                <div className="cards">
                    <h2>Qual banco/instituição financeira será<br /> responsável pela engenharia do imóvel?</h2>

                    <InputSelect
                        option={listaBancos}
                        label={'Banco/instituição financeira *'}
                        placeholder={'Selecione'}
                        error={!!errors.banco ? true : false}
                        msgError={errors.banco}
                        required={true}
                        sucess={!errors.banco && !!watch('banco')}
                        value={watch('banco') || '0'}
                        defaultValue={''}
                        {...register('banco', {
                            validate: (value?: string) => {
                                if (value === '0') {
                                    return "Nenhum banco foi selecionado";
                                }
                            },
                            required: errorMsg,
                            onChange: (e: any) => handleInput('banco', e.target.value)
                        })}
                        inputProps={{ 'aria-label': 'Without label' }}
                    />

                    <div className="selects-line">
                        <InputText
                            label={'Dia'}
                            placeholder={'Ex: dd/mm/aaaa'}
                            sucess={!errors.data_engenharia && watch('data_engenharia')?.length === 10}
                            error={!!errors.data_engenharia ? true : false}
                            required={true}
                            msgError={errors.data_engenharia}
                            value={watch('data_engenharia')}
                            inputProps={{
                                maxlength: 10,
                                marginRight: 15
                            }}
                            {...register('data_engenharia', {
                                //required: true,
                                required: errorMsg,
                                setValueAs: (e: string) => dateMask(e),
                                validate: (value?: string) => value?.length === 10 || "Data inválida",
                                onChange: (e: any) => handleInput('data_engenharia', e.target.value)
                            })}
                        />

                        <InputText
                            label={'Horário'}
                            placeholder={'Ex: 16:30'}
                            sucess={!errors.hora_engenharia && watch('hora_engenharia')?.length === 5}
                            error={!!errors.hora_engenharia ? true : false}
                            required={true}
                            msgError={errors.hora_engenharia}
                            value={watch('hora_engenharia')}
                            inputProps={{
                                maxlength: 5
                            }}
                            {...register('hora_engenharia', {
                                //required: true,
                                required: errorMsg,
                                setValueAs: (e: string) => horaMask(e),
                                validate: (value?: string) => value?.length === 5 || "Hora inválida",
                                onChange: (e: any) => handleInput('hora_engenharia', e.target.value)
                            })}
                        />
                    </div>

                    <div className="checkBox">
                        {
                            InformeCheck.map(({ index, label, value, path, checked }) => (
                                <CheckBox
                                    label={'Informe ao gerente que o Laudo de Engenharia foi aprovado.'}
                                    value={value}
                                    checked={checked}
                                    path={path}
                                    register={register}
                                    key={index}
                                    {...register('check_engenharia', {
                                        required: false,
                                        onChange: (e: any) => [handleCheck(e), handleInput('check_engenharia', e.target.value)],
                                    })}
                                />
                            ))
                        }
                    </div>
                </div>
            }
        </>
    )
}
