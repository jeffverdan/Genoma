import InputText from "@/components/InputText/Index";
import { BlockProps, FormValues } from "@/interfaces/IA_Recibo/index";
import cpfMask from "@/functions/cpfMask";
import validarCPF from '@/functions/validarCPF';
import getCpfDadosUsuario from "@/apis/getCpfDadosUsuario";
import dateMask from "@/functions/dateMask";
import InputSelect from "@/components/InputSelect/Index";
import InputPhone from "@/components/InputPhone";
import CheckBox from "@/components/CheckBox";
import { useEffect, useState } from "react";
import { CountryData } from "react-phone-input-2";
import Pessoa from "@/interfaces/Users/userData";

const listGenero = [
    { name: 'Selecione o gênero', id: '0' },
    { "id": 'M', name: "Masculino", },
    { "id": 'F', name: "Feminino", },
];
const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const listEstadoCivil = [
    { name: 'Selecione o estado civil', id: '0' },
    { "id": '1', name: "Casado", },
    { "id": '2', name: "Solteiro", },
    { "id": '3', name: "Divorciado", },
    { "id": '4', name: "Viúvo", },
    { "id": '5', name: "Separado", }
];

const listRegimeCasamento = [
    { name: 'Selecione o regime de casamento', id: '0' },
    { "id": '1', name: "Separação total de bens", },
    { "id": '2', name: "Separação parcial de bens", },
    { "id": '3', name: "Separação legal de bens", },
    { "id": '4', name: "Comunhão de bens", },
    { "id": '5', name: "Comunhão parcial de bens", },
];

export default function DadosPessoa({ index, data, type, userData, setUserData, register, errors, watch, setValue, clearErrors }: BlockProps) {
    const errorMsg = 'Campo inválido';    

    const handleCPF = async (value: string) => {
        if (value.length === 14) {
            const dataCpf = await getCpfDadosUsuario(value) as any;
            if(dataCpf && setUserData) {
                
                Object.keys(dataCpf).forEach((key) => {
                    const typedKey = key as keyof FormValues;
                    const value = dataCpf[key];
                    setValue(typedKey, value);
                })
                setValue('uf', dataCpf.estado)
                setUserData({...dataCpf, uf: dataCpf.estado});
            }
            clearErrors('cpf_cnpj');
            //   save();    
        }
    };

    const onBlur = (e?: React.ChangeEvent<HTMLInputElement>) => {
        if (e) {
            const name = e.target.name as keyof FormValues;
            const value = e.target.value;
            userData = { ...userData, [name]: value }
            setUserData({ ...userData });
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof FormValues;
        const value = e.target.value;
        console.log(name, value);        
        clearErrors(name);
    };

    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        const check = e.target.checked;
        setValue(name as keyof FormValues, check ? value : '');
    };

    const handleCelular = (value: string, data: CountryData, event: React.ChangeEvent<HTMLInputElement>, formattedValue: string) => {
        const ddi = `+${data.dialCode}`;
        const telefone = formattedValue.replace(ddi, '').trimStart();
        setValue('telefone', telefone);
        setValue('ddi', ddi);
        clearErrors('telefone');
    };

    return (
        <div className="form-container">
            <div className="title">
                <h3>Cadastre a pessoa {type?.replace('es', 'a')} pendente.</h3>
                <p>Para evitar devolução da venda, insira os dados corretos. <span style={{ fontWeight: '500', fontSize: '20px' }}>Dados cadastrados de forma incorreta podem gerar problemas legais para a DNA Imóveis.</span></p>
            </div>

            {watch &&
                <div className="content">
                    <div className="row-f">
                        <InputText
                            label={'CPF'}
                            placeholder={'Ex: 000.000.000-00'}
                            sucess={!errors?.cpf_cnpj && watch('cpf_cnpj')?.length === 14}
                            error={!!errors?.cpf_cnpj}
                            msgError={errors?.cpf_cnpj}
                            value={watch('cpf_cnpj')}
                            required={true}
                            saveOnBlur={(e) => onBlur(e)}
                            inputProps={{
                                maxlength: 14
                            }}
                            {...register('cpf_cnpj', {
                                //required: true,
                                required: errorMsg,
                                setValueAs: e => cpfMask(e),
                                validate: (value) => validarCPF(value) || "CPF inválido",
                                onChange: (e) => handleCPF(e.target.value),
                            })}
                        />

                        <InputText
                            label={'Data de nascimento'}
                            placeholder={'Ex: dd/mm/aaaa'}
                            sucess={!errors?.data_nascimento && watch('data_nascimento')?.length === 10}
                            error={!!errors?.data_nascimento ? true : false}
                            required={true}
                            msgError={errors?.data_nascimento}
                            value={watch('data_nascimento')}
                            inputProps={{
                                maxlength: 10
                            }}
                            saveOnBlur={(e) => onBlur(e)}
                            {...register('data_nascimento', {
                                //required: true,
                                required: errorMsg,
                                setValueAs: e => dateMask(e),
                                validate: (value) => value.length === 10 || "Data inválida",
                                onChange: (e) => handleInput(e)
                            })}
                        />

                        <InputSelect
                            option={listGenero}
                            label={'Gênero *'}
                            placeholder={'Selecione seu gênero'}
                            error={!!errors?.genero ? true : false}
                            msgError={errors?.genero}
                            required={true}
                            sucess={!errors?.genero && !!watch('genero') && watch('genero') !== '0'}
                            value={watch('genero') || '0'}
                            defaultValue={''}
                            {...register('genero', {
                                validate: (value) => {
                                    if (value === '0') {
                                        return "Nenhum gênero foi selecionada";
                                    }
                                },
                                required: errorMsg,
                                onChange: (e) => handleInput(e)
                            })}
                            inputProps={{ 'aria-label': 'Without label' }}
                        />
                    </div>

                    <div className="row-f">
                        <InputText
                            label={`Nome da pessoa ${type?.replace('es', '')}a`}
                            placeholder={'Ex: José Maria da Silva'}
                            sucess={!errors?.name && !!watch('name')}
                            error={!!errors?.name ? true : false}
                            required={true}                            
                            msgError={errors?.name}
                            saveOnBlur={(e) => onBlur(e)}
                            {...register('name', {
                                //required: true,
                                required: errorMsg,
                                onChange: (e) => handleInput(e)
                            })}
                        />

                        <InputText
                            label={'Nome da mãe'}
                            placeholder={'Ex: Maria Silva Alves'}
                            sucess={!errors?.nome_mae && !!watch('nome_mae')}
                            error={!!errors?.nome_mae ? true : false}
                            required={true}
                            msgError={errors?.nome_mae}
                            saveOnBlur={(e) => onBlur(e)}
                            {...register('nome_mae', {
                                //equired: true,
                                required: errorMsg,
                                onChange: (e) => handleInput(e)
                            })}
                        />

                        <InputText
                            label={'Nome do pai'}
                            placeholder={'Ex: José Maria da Silva'}
                            sucess={!errors?.nome_pai && !!watch('nome_pai')}
                            //error={!!errors?.nome_pai ? true : false}
                            //required={true}
                            {...register('nome_pai', {
                                required: false,
                                // onChange: (e) => handleInput(e)
                            })}
                        />
                    </div>

                    <div className="row-f">
                        <InputText
                            label={'Nacionalidade'}
                            placeholder={'Ex: Brasileiro'}
                            sucess={!errors?.nacionalidade && !!watch('nacionalidade')}
                            error={!!errors?.nacionalidade}
                            required={true}
                            saveOnBlur={(e) => onBlur(e)}
                            msgError={errors?.nacionalidade}
                            {...register('nacionalidade', {
                                //required: true,
                                required: errorMsg,
                                onChange: (e) => handleInput(e)
                            })}
                        />

                        <InputPhone
                            value={watch('telefone') ? watch('ddi') + watch('telefone') : '55'}
                            label={'Celular'}
                            placeholder={'Ex: (21) 99754-4899'}
                            sucess={!errors?.telefone && !!watch('telefone')}
                            error={!!errors?.telefone}
                            required={true}
                            msgError={errors?.telefone}
                            country={"br"}
                            // {...register('celular', {
                            //   required: errorMsg,
                            // })}
                            onChange={handleCelular}
                            onBlur={(e) => setUserData({ ...userData, telefone: e.target.value })}
                            isValid={(inputNumber: any, country: any) => {
                                if (country.countryCode === '55') {
                                    return inputNumber.length >= 12;
                                } else {
                                    return inputNumber.length >= 6;
                                }
                            }}
                        />

                        {/*Validação formato do Celular BR*/}
                        <input
                            type="hidden"
                            {...register('telefone', {
                                required: errorMsg,
                                validate: (value) => {
                                    if (watch('ddi') === '55') {
                                        if (value.length < 15) {
                                            return "Formato de celular inválido";
                                        }
                                    }
                                },
                            })}
                        />
                    </div>

                    <div className="row-f">
                        <InputText
                            label={'Profissão'}
                            placeholder={'Ex: Corretor'}
                            sucess={!errors?.profissao && !!watch('profissao')}
                            error={!!errors?.profissao}
                            required={true}
                            msgError={errors?.profissao}
                            saveOnBlur={(e) => onBlur(e)}
                            {...register('profissao', {
                                //required: true,
                                required: errorMsg,
                                onChange: (e) => handleInput(e)
                            })}
                        />

                        <InputText
                            label={'E-mail'}
                            placeholder={'Ex: cliente@gmail.com'}
                            sucess={!errors?.email && !!watch('email')}
                            error={!!errors?.email}
                            msgError={errors?.email}
                            //required={true}
                            {...register('email', {
                                required: false,
                                validate: email => regexEmail.test(email) || 'error message',
                                // onChange: (e) => handleInput(e),
                            })}
                        />
                    </div>

                    <div className="row-f">
                        <InputText
                            label={'RG'}
                            placeholder={'Ex: 123456789'}
                            sucess={!errors?.rg && watch('rg')?.length > 4}
                            //error={!!errors?.rg ? true : false}
                            //required={true}
                            {...register('rg', {
                                required: false,
                                // onChange: (e) => handleInput(e)
                            })}
                        />

                        <InputText
                            label={'Expedido por'}
                            placeholder={'Ex: Detran'}
                            sucess={!errors?.rg_expedido && !!watch('rg_expedido')}
                            disabled={watch('rg')?.length < 4}
                            error={watch('rg')?.length >= 4 && !!errors?.rg_expedido}
                            required={watch('rg')?.length >= 4}
                            msgError={errors?.rg_expedido}
                            saveOnBlur={(e) => onBlur(e)}
                            {...register('rg_expedido', {
                                required: watch('rg')?.length >= 4 ? errorMsg : false,
                                // onChange: (e) => handleInput(e)
                            })}
                        />

                        <InputText
                            label={'Data expedição'}
                            placeholder={'Ex: dd/mm/aaaa'}
                            sucess={!errors?.rg_expedido && !!watch('data_rg_expedido')}
                            disabled={watch('rg')?.length < 4}
                            error={watch('rg')?.length >= 4 && !!errors?.data_rg_expedido}
                            required={watch('rg')?.length >= 4}
                            msgError={errors?.data_rg_expedido}
                            value={watch('data_rg_expedido')}
                            saveOnBlur={(e) => onBlur(e)}
                            {...register('data_rg_expedido', {
                                required: watch('rg')?.length >= 4 ? errorMsg : false,
                                setValueAs: (e) => dateMask(e)
                                //validate: (value) => value.length === 10 || "Data inválida",
                                // onChange: (e) => handleInput(e)
                            })}
                        />
                    </div>

                    <div className="row-f">
                        <InputSelect
                            option={listEstadoCivil}
                            label={'Estado Civil *'}
                            placeholder={'Selecione seu estado Civil'}
                            error={!!errors?.estado_civil}
                            //msgError={errors?.estado_civil}
                            required={true}
                            sucess={!errors?.estado_civil && Number(watch('estado_civil')) > 0}
                            value={watch('estado_civil') || '0'}
                            defaultValue={'0'}
                            onBlurFunction={(e) => onBlur(e)}
                            {...register('estado_civil', {
                                validate: (value) => {
                                    if (value === '0') {
                                        return "Nenhum estado civil foi selecionada";
                                    }
                                },
                                required: errorMsg,
                                onChange: (e) => handleInput(e)
                            })}
                            inputProps={{ 'aria-label': 'Without label' }}
                        />

                        <div style={{ width: '100%', maxWidth: '600px' }}>{/*Usado para limitar o tamanho do campo Estado Civil*/}</div>
                    </div>

                    {
                        watch('estado_civil') === '1'
                            ?
                            <div className="row-f">
                                <InputSelect
                                    option={listRegimeCasamento}
                                    label={'Regime de casamento *'}
                                    placeholder={'Selecione'}
                                    error={!!errors?.registro_casamento}
                                    msgError={watch('estado_civil') && errors?.registro_casamento}
                                    required={true}
                                    sucess={!errors?.registro_casamento && Number(watch('registro_casamento')) > 0}
                                    value={watch('registro_casamento') || '0'}
                                    defaultValue={'0'}
                                    onBlurFunction={(e) => onBlur(e)}
                                    {...register('registro_casamento', {
                                        validate: (value) => {
                                            if (value === '0') {
                                                return "Nenhum regime casamento foi selecionada";
                                            }
                                        },
                                        required: errorMsg,
                                        onChange: (e) => handleInput(e)
                                    })}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                />
                                <div style={{ width: '100%', maxWidth: '600px' }}>{/*Usado para limitar o tamanho do campo Regime de casamento*/}</div>
                            </div>

                            :
                            watch('estado_civil') > 1
                                ?
                                <div className="row-f">
                                    <CheckBox
                                        label={"União estável"}
                                        value={'S'}
                                        // checked={checkUniao}
                                        // path={path}
                                        key={index}
                                        {...register('uniao_estavel', {
                                            required: false,
                                            onChange: (e) => handleCheck(e),
                                        })}
                                    />
                                </div>

                                :
                                ''
                    }

                    {
                        watch('uniao_estavel') === 'S' || watch('estado_civil') === '1'
                            ?
                            <div className="row-f">
                                <InputText
                                    label={'Cônjuge: nome completo'}
                                    placeholder={'Ex: José Maria da Silva'}
                                    sucess={!errors?.conjuge && !!watch('conjuge')}
                                    error={!!errors?.conjuge ? true : false}
                                    msgError={errors?.conjuge}
                                    required={watch('uniao_estavel') === 'S' || !!watch('registro_casamento')}
                                    saveOnBlur={(e) => onBlur(e)}
                                    {...register('conjuge', {
                                        //required: watch('uniao_estavel') === true || watch('registro_casamento') !== '' ? true : false,
                                        required: errorMsg,
                                        onChange: (e) => handleInput(e)
                                    })}
                                />

                                <div style={{ width: '100%', maxWidth: '600px' }}>{/*Usado para limitar o tamanho do campo Estado Civil*/}</div>
                            </div>

                            :
                            ''
                    }
                </div>
            }

        </div>
    )


}