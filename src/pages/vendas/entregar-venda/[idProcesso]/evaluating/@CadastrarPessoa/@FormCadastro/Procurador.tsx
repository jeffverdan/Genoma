import InputText from "@/components/InputText/Index";
import { BlockProps, FormValues } from "@/interfaces/IA_Recibo/index";
import { useEffect, useState } from "react";
import { CountryData } from "react-phone-input-2";

import SwitchButtom from "@/components/SwitchButton";
import InputPhone from "@/components/InputPhone";


export default function Procurador({ index, data, type, userData, setUserData, register, errors, watch, setValue, clearErrors }: BlockProps) {
    const errorMsg = 'Campo inválido'

    const [check, setCheck] = useState(false);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof FormValues;
        const value = e.target.value;
        clearErrors(name);
    };

    const handleCelular = (value: string, data: CountryData, event: React.ChangeEvent<HTMLInputElement>, formattedValue: string) => {
        const ddi = `+${data.dialCode}`;
        const telefone = formattedValue.replace(ddi, '').trimStart();
        setValue('procurador.telefone', telefone);
        setValue('procurador.ddi', ddi);
        clearErrors('procurador.telefone');
    };

    const onBlur = (key: 'nome' | 'telefone', e?: React.ChangeEvent<HTMLInputElement>) => {
        if (e && userData.procurador) {
            const value = e.target.value;
            userData.procurador[key] = value;
        }
        setUserData({ ...userData });
    };

    useEffect(() => {
        if (check) {
            setUserData({
                ...userData, procurador: {
                    ...userData.procurador,
                    processo_id: data.processo_id,
                }
            });
        } else {
            console.log('userData: ', userData);
            userData.procurador = undefined;
            setValue('procurador', {
                nome: "",
                telefone: "",
                ddi: ""
            })
            setUserData({...userData});
        };
    }, [check])

    return (
        <div className="form-container">
            <div className="title">
                <h3>Quem {type?.replace('dores', '')} possui procurador?</h3>
            </div>

            <SwitchButtom width="max-content" check={check} setCheck={setCheck} label='Sim, quem compra possui procurador(a).' />

            {!!check &&
                <div className="row-f">
                    <InputText
                        label={'Nome do procurador(a)*'}
                        placeholder={'Ex: José Maria da Silva'}
                        error={!!errors?.procurador?.nome ? true : false}
                        msgError={errors?.procurador?.nome}
                        sucess={!errors?.procurador?.nome && !!watch('procurador.nome')}
                        saveOnBlur={(e) => onBlur('nome', e)}
                        {...register('procurador.nome', {
                            required: errorMsg,
                            onChange: (e) => handleInput(e)
                        })}

                    />
                    <InputPhone
                        value={watch('procurador.telefone') ? watch('procurador.ddi') + watch('procurador.telefone') : '55'}
                        label={'Celular'}
                        placeholder={'Ex: (21) 99754-4899'}
                        sucess={!errors?.procurador?.telefone && !!watch('procurador.telefone')}
                        error={!!errors?.procurador?.telefone ? true : false}
                        required={true}
                        msgError={errors?.procurador?.telefone}
                        country={"br"}
                        // {...register('celular', {
                        //   required: errorMsg,
                        // })}
                        onChange={handleCelular}
                        onBlur={(e) => onBlur('nome', e as any)}
                        isValid={(inputNumber: any, country: any) => {
                            if (country.countryCode === '55') {
                                return inputNumber.length < 12 ? false : true;
                            } else {
                                return inputNumber.length < 6 ? false : true;
                            }
                        }}
                    />

                </div>
            }

        </div>
    )
}