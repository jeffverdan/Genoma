import GetListBancos from '@/apis/getListBancos';
import getListaCartorio from '@/apis/getListaCartorio';
import InputSelect from '@/components/InputSelect/Index'
import InputText from '@/components/InputText/Index'
import dateMask from '@/functions/dateMask'
import horaMask from '@/functions/horaMask';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import CheckBox from '@/components/CheckBox'
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors, UseFormClearErrors, UseFormSetError } from 'react-hook-form';
// import { FormValues } from '@/interfaces/PosVenda/AlterarStatus';
import somenteNumero from '@/functions/somenteNumero';
import DataCep from '@/functions/DataCep';
import cepMask from '@/functions/cepMask';

interface IListaBancos {
    id: number,
    nome: string
}

interface FormValues{
    // FEEDBACK ESCRITURA
    aconteceu?: string
    pagamento_aconteceu?: string
    dataNascimento?: string
    motivo?: string
    escritura_caiu?: string

    // ESCRITURA
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
}

interface ICard {
    handleInput?: (type: string, e: any) => void
    register: UseFormRegister<FormValues>
    watch: UseFormWatch<FormValues>
    errors: FieldErrors<FormValues>
    setValue: UseFormSetValue<FormValues>
    clearErrors: UseFormClearErrors<FormValues>
    setError: UseFormSetError<FormValues>
    origem?: string
}

export default function Escritura({ register, watch, errors, setValue, clearErrors, setError, origem }: ICard) {    
    const errorMsg = 'Campo obrigatório';    
    const [listaCartorios, setListaCartorios] = useState([])

    const listCartorio = async () => {
        const res: any = await getListaCartorio();
        const newRes: any = [...res];
        newRes.unshift({ id: '0', nome: 'Selecione...' }); 
        setListaCartorios(newRes);
    };

    useEffect(() => {
        listCartorio();
    }, [])
    console.log(listaCartorios)

    const handleLocalEscritura = (e: any) => {
        const local = e.target.value;
        const cepLocal = listaCartorios.filter((value: any) => value.id === local).map((value: any) => value);
        const cartorio = cepLocal[0];

        setValue('cep_escritura', cartorio.cep);
        setValue('endereco_escritura', cartorio.logradouro);
        setValue('cidade_escritura', cartorio.cidade);
        setValue('bairro_escritura', cartorio.bairro);
        setValue('estado_escritura', cartorio.uf);
        setValue('numero_escritura', cartorio.numero);
        setValue('complemento_escritura', cartorio.complemento);

        clearErrors('cep_escritura');
        clearErrors('endereco_escritura');
        clearErrors('cidade_escritura');
        clearErrors('bairro_escritura');
        clearErrors('estado_escritura');
        clearErrors('numero_escritura');

        if (local === '-1') {
            setValue('nome_cartorio', '')
        }
    };

    const handleCep = async (value: string) => {

        if (value.length === 9) {
            let dadosCep = await DataCep(value);

            if (!dadosCep.erro) {
                setValue('local_escritura', '-1')
                setValue('endereco_escritura', dadosCep.logradouro);
                setValue('cidade_escritura', dadosCep.localidade);
                setValue('bairro_escritura', dadosCep.bairro);
                setValue('estado_escritura', dadosCep.uf);

                clearErrors('cep_escritura');
                clearErrors('endereco_escritura');
                clearErrors('cidade_escritura');
                clearErrors('bairro_escritura');
                clearErrors('estado_escritura');
            }
            else {
                setValue('endereco_escritura', '');
                setValue('cidade_escritura', '');
                setValue('bairro_escritura', '');
                setValue('estado_escritura', '');

                setError('cep_escritura', { message: 'CEP não encontrado' });
            }
        }
        else {
            setValue('endereco_escritura', '');
            setValue('cidade_escritura', '');
            setValue('bairro_escritura', '');
            setValue('estado_escritura', '');

            setError('cep_escritura', { message: 'CEP não encontrado' });
        }

        setValue('cep_escritura', cepMask(value))
    };

    const handleNumero = (value: string) => {
        setValue('numero_escritura', somenteNumero(value));
    };

    return (
        <>
            {!!watch && !!register &&
                <>
                    <div className="cards">
                        {
                            origem === 'modal-feedback'
                            ? <div>
                                    <h3>Insira as informações de reagendamento</h3>
                                    <p className="sub-p">Qual a nova data e hora da assinatura?*</p>
                                </div>
                            : <h2>Informe a data e hora da escritura:</h2>
                        }

                        <div className="selects-line">
                            <InputText
                                label={'Dia'}
                                placeholder={'Ex: dd/mm/aaaa'}
                                sucess={!errors.data_escritura && watch('data_escritura')?.length === 10}
                                error={!!errors.data_escritura ? true : false}
                                required={true}
                                msgError={errors.data_escritura}
                                value={watch('data_escritura')}
                                inputProps={{
                                    maxlength: 10,
                                    marginRight: 15
                                }}
                                {...register('data_escritura', {
                                    //required: true,
                                    required: errorMsg,
                                    setValueAs: (e: string) => dateMask(e),
                                    validate: (value?: string) => value?.length === 10 || "Data inválida",
                                })}
                            />

                            <InputText
                                label={'Horário'}
                                placeholder={'Ex: 16:30'}
                                sucess={!errors.hora_escritura && watch('hora_escritura')?.length === 5}
                                error={!!errors.hora_escritura ? true : false}
                                required={true}
                                msgError={errors.hora_escritura}
                                value={watch('hora_escritura')}
                                inputProps={{
                                    maxlength: 5
                                }}
                                {...register('hora_escritura', {
                                    //required: true,
                                    required: errorMsg,
                                    setValueAs: (e: string) => horaMask(e),
                                    validate: (value?: string) => value?.length === 5 || "Hora inválida",
                                })}
                            />
                        </div>
                    </div>

                    <div className="">
                        {
                            origem === 'modal-feedback'
                            ? <p className="sub-p">E o local?*</p>
                            : <h2>Onde será realizada a escritura?</h2>
                        }
                        <InputSelect
                            option={listaCartorios}
                            label={'Local de assinatura*'}
                            placeholder={'Selecione'}
                            error={!!errors.local_escritura ? true : false}
                            msgError={errors.local_escritura}
                            required={true}
                            sucess={!errors.local_escritura && watch('local_escritura') !== '0'}
                            value={watch('local_escritura') || '0'}
                            defaultValue={''}
                            {...register('local_escritura', {
                                validate: (value?: number | string) => {
                                    if (value === '0') {
                                        return "Nenhum local para escritura foi selecionado";
                                    }
                                },
                                required: errorMsg,
                                onChange: (e) => handleLocalEscritura(e)
                            })}
                            inputProps={{ 'aria-label': 'Without label' }}
                        />

                        {
                            watch('local_escritura') === '-1' &&
                            <div className="selects-line f-w-input">
                                <InputText
                                    label={'Nome do cartório'}
                                    placeholder={'Ex: Teste'}
                                    sucess={!errors.nome_cartorio && watch('nome_cartorio')?.length === 5}
                                    error={!!errors.nome_cartorio ? true : false}
                                    required={true}
                                    msgError={errors.nome_cartorio}
                                    value={watch('nome_cartorio')}
                                    {...register('nome_cartorio', {
                                        //required: true,
                                        required: errorMsg,
                                    })}
                                />
                            </div>
                        }

                        {
                            watch('local_escritura') !== '' &&
                            <>
                                <InputText
                                    label={'CEP'}
                                    placeholder={'Ex.: 22031-050'}
                                    error={!!errors.cep_escritura ? true : false}
                                    msgError={errors.cep_escritura}
                                    required={true}
                                    disabled={false}
                                    sucess={!errors.cep_escritura && watch('cep_escritura')?.length === 9}
                                    inputProps={{
                                        maxLength: 9
                                    }}
                                    {...register('cep_escritura', {
                                        required: errorMsg,
                                        onChange: (e) => handleCep(/*watch('cep_escritura')*/ e.target.value)
                                    })}

                                />
                                <div className="selects-line">
                                    <InputText
                                        label={'Logradouro'}
                                        placeholder={'Rua do Teste'}
                                        error={!!errors.endereco_escritura ? true : false}
                                        msgError={errors.endereco_escritura}
                                        required={true}
                                        disabled={true}
                                        sucess={!errors.endereco_escritura && !!watch('endereco_escritura')}
                                        {...register('endereco_escritura', {
                                            required: errorMsg,
                                        })}
                                    />

                                    <InputText
                                        label={'Número'}
                                        placeholder={'Ex: 77'}
                                        error={!!errors.numero_escritura ? true : false}
                                        msgError={errors.numero_escritura}
                                        required={true}
                                        sucess={!errors.numero_escritura && !!watch('numero_escritura')}
                                        {...register('numero_escritura', {
                                            required: errorMsg,
                                            onChange: (e) => [handleNumero(e.target.value)/*handleNumero(watch('numero_escritura'))/*, handleInput('numero_escritura')*/]
                                        })}
                                    />
                                </div>

                                <div className="selects-line">
                                    <InputText
                                        label={'Unidade'}
                                        placeholder={'Ex: Apto 707'}
                                        sucess={!errors.unidade_escritura && !!watch('unidade_escritura')}
                                        {...register('unidade_escritura', {
                                            required: false,
                                        })}
                                    />

                                    <InputText
                                        label={'Complemento'}
                                        placeholder={'EX: Bloco, lote ou condomínio'}
                                        sucess={!errors.complemento_escritura && !!watch('complemento_escritura')}
                                        {...register('complemento_escritura', {
                                            required: false,
                                        })}
                                    />
                                </div>

                                {/* <div className="selects-line">
                                    <InputText
                                        label={'Cidade'}
                                        placeholder={'Ex: Rio de Janeiro'}
                                        error={!!errors.cidade_escritura ? true : false}
                                        msgError={errors.cidade_escritura}
                                        required={true}
                                        disabled={true}
                                        sucess={!errors.cidade_escritura && !!watch('cidade_escritura')}
                                        {...register('cidade_escritura', {
                                            required: errorMsg,
                                        })}
                                    />

                                    <InputText
                                        label={'Estado'}
                                        placeholder={'Ex: RJ'}
                                        error={!!errors.estado_escritura ? true : false}
                                        msgError={errors.estado_escritura}
                                        required={true}
                                        disabled={true}
                                        sucess={!errors.estado_escritura && !!watch('estado_escritura')}
                                        {...register('estado_escritura', {
                                            required: errorMsg,
                                        })}
                                    />

                                    <InputText
                                        label={'Bairro'}
                                        placeholder={'Ex: Copacabana'}
                                        error={!!errors.bairro_escritura ? true : false}
                                        msgError={errors.bairro_escritura}
                                        required={true}
                                        disabled={true}
                                        sucess={!errors.bairro_escritura && !!watch('bairro_escritura')}
                                        {...register('bairro_escritura', {
                                            required: errorMsg,
                                        })}
                                    />
                                </div> */}
                            </>
                        }
                    </div>
                </>
            }
        </>
    )
}
