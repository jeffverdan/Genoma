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
import ButtonComponent from "@/components/ButtonComponent";
import { ClipboardIcon } from "@heroicons/react/24/solid";
import { ImovelData } from "@/types/ImovelData";
import DataCep from "@/functions/DataCep";
import cepMask from "@/functions/cepMask";

const arrCampos = ['cep', 'numero', 'unidade', 'complemento', 'logradouro', 'cidade', 'uf', 'bairro'] as const;

export default function Endereco({ index, data, type, userData, setUserData, register, errors, watch, setValue, clearErrors }: BlockProps) {
    const errorMsg = 'Campo inválido'

    const handleEnderecoImovel = () => {
        arrCampos.forEach((key) => {
            setValue(key, data[key] as keyof ImovelData);
            setUserData({ ...userData, [key]: data[key] });
            if (data[key]) clearErrors(key);
        })
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof FormValues;
        const value = e.target.value;
        userData = { ...userData, [name]: value }
        clearErrors(name);
    };

    const onBlur = (e?: React.ChangeEvent<HTMLInputElement>) => {
        if (e) {
            const name = e.target.name as keyof FormValues;
            const value = e.target.value;
            userData = { ...userData, [name]: value }
        }
        console.log(userData);
        
        setUserData({ ...userData });
    };

    const handleCEP = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;

        if (value.length === 9) {
            const dadosCep = await DataCep(value);
            let form = {};
            arrCampos.forEach((key) => {
                if (!!dadosCep[key]) {
                    setValue(key, dadosCep[key]);
                    form = {...form, [key]: dadosCep[key]}
                    console.log({[key]: dadosCep[key]});
                    clearErrors(key);
                }
            })
            if (dadosCep?.localidade) {
                setValue('cidade', dadosCep.localidade);
                form = {...form, cidade: dadosCep.localidade}
                clearErrors('cidade');
            }
            
            setUserData({ ...userData, ...form });
        }
    };
    console.log(userData);
    

    return (
        <div className="form-container">
            <div className="title">
                <h3>Onde mora a pessoa {type?.replace('es', 'a')}?</h3>
            </div>

            <div className="row-f">
                {
                    type === 'vendedores' &&
                    <ButtonComponent
                        name="secondary"
                        size="medium"
                        label="Copiar endereço do imóvel vendido"
                        startIcon={<ClipboardIcon className="icon icon-right" />}
                        variant="text"
                        onClick={(e) => handleEnderecoImovel()}
                    />
                }
            </div>
            {watch &&
                <div className="content">
                    <div className="row-f">
                        <InputText
                            label={'CEP'}
                            placeholder={'Ex.: 22031-050'}
                            error={!!errors?.cep}
                            msgError={errors?.cep}
                            required={true}                          
                            saveOnBlur={(e) => onBlur(e)}
                            sucess={!errors?.cep && watch('cep')?.length === 9}
                            maxLength={9}
                            inputProps={{
                                maxlength: 9
                            }}                            
                            value={watch('cep')}
                            {...register('cep', {
                                required: errorMsg,
                                setValueAs: (e) => cepMask(e),
                                onChange: (e) => handleCEP(e)
                            })}

                        />
                        <InputText
                            label={'Logradouro'}
                            placeholder={'Rua do Teste'}
                            error={!!errors?.logradouro}
                            msgError={errors?.logradouro}
                            required={true}
                            disabled={true}
                            sucess={!errors?.logradouro && !!watch('logradouro')}
                            {...register('logradouro', {
                                required: errorMsg,
                            })}
                        />
                    </div>

                    <div className="row-f">
                        <InputText
                            label={'Número'}
                            placeholder={'Ex: 77'}
                            error={!!errors?.numero}
                            msgError={errors?.numero}
                            required={true}
                            saveOnBlur={(e) => onBlur(e)}
                            sucess={!errors?.numero && !!watch('numero')}
                            {...register('numero', {
                                required: errorMsg,
                                onChange: (e => handleInput(e))
                            })}
                        />

                        <InputText
                            label={'Unidade'}
                            placeholder={'Ex: Apto 707'}
                            sucess={!errors?.unidade && !!watch('unidade')}
                            saveOnBlur={(e) => onBlur(e)}
                            {...register('unidade', {
                                required: false,
                                // onChange: (e) => handleInput('unidade')
                            })}
                        />

                        <InputText
                            label={'Complemento'}
                            placeholder={'EX: Bloco, lote ou condomínio'}
                            saveOnBlur={(e) => onBlur(e)}
                            sucess={!errors?.complemento && !!watch('complemento')}
                            {...register('complemento', {
                                required: false,
                                // onChange: (e) => handleInput('complemento')
                            })}
                        />
                    </div>

                    <div className="row-f">
                        <InputText
                            label={'Cidade'}
                            placeholder={'Ex: Rio de Janeiro'}
                            error={!!errors?.cidade}
                            msgError={errors?.cidade}
                            required={true}
                            disabled={true}
                            sucess={!errors?.cidade && !!watch('cidade')}
                            {...register('cidade', {
                                required: errorMsg,
                            })}
                        />

                        <InputText
                            label={'Estado'}
                            placeholder={'Ex: RJ'}
                            error={!!errors?.uf}
                            msgError={errors?.uf}
                            required={true}
                            disabled={true}
                            sucess={!errors?.uf && !!watch('uf')}
                            {...register('uf', {
                                required: errorMsg,
                            })}
                        />

                        <InputText
                            label={'Bairro'}
                            placeholder={'Ex: Copacabana'}
                            error={!!errors?.bairro}
                            msgError={errors?.bairro}
                            required={true}
                            disabled={true}
                            sucess={!errors?.bairro && !!watch('bairro')}
                            {...register('bairro', {
                                required: errorMsg,
                            })}
                        />
                    </div>
                </div>
            }

        </div>
    )
}