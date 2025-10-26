import InputSelect from '@/components/InputSelect/Index'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors, UseFormClearErrors, UseFormSetError } from 'react-hook-form';
import { FormValues } from '@/interfaces/PosVenda/AlterarStatus';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import Pessoa from '@/interfaces/Users/userData';

interface IListaBancos {
    id: number,
    nome: string
}

interface ICard {
    handleInput?: (type: string, e: any) => void
    register: UseFormRegister<FormValues>
    watch: UseFormWatch<FormValues>
    errors: FieldErrors<FormValues>
    setValue: UseFormSetValue<FormValues>
    clearErrors: UseFormClearErrors<FormValues>
    setError: UseFormSetError<FormValues>
    processData?: ProcessType
}

export default function ITBI({ register, watch, errors, setValue, clearErrors, setError, processData }: ICard) {
    // console.log('WATCH: ' , watch())
    // console.log('processData: ' , processData)
    const errorMsg = 'Campo obrigatório';
    const [listaCompradores, setListaCompradores] = useState<Pessoa[]>([])


    const returnListaCompradores = async () => {
        const arrayCompradores: any = processData?.compradores_pf.concat(processData?.compradores_pj);
        console.log('arrayCompradores: ', arrayCompradores)
        setListaCompradores(arrayCompradores)
    }

    useEffect(() => {
        returnListaCompradores()
    }, [])

    return (
        <>
            {!!watch && !!register &&
                <div className="cards">
                    <h2>Confirme o comprador que pagará o ITBI.</h2>
                    <p>Essa informação é importante para realizar cobranças e fazer a transferência<br /> de propriedade do bem adquirido.</p>
                    <InputSelect
                        option={listaCompradores}
                        label={'Comprador responsável*'}
                        placeholder={'Selecione'}
                        error={!!errors.responsavel_comprador ? true : false}
                        msgError={errors.responsavel_comprador}
                        required={true}
                        sucess={!errors.local_escritura && !!watch('responsavel_comprador')}
                        value={watch('responsavel_comprador') || '0'}
                        defaultValue={''}
                        {...register('responsavel_comprador', {
                            validate: (value?: number | string) => {
                                if (value === '0') {
                                    return "Nenhum comprador foi selecionado";
                                }
                            },
                            required: errorMsg,
                            // onChange: (e) => handleLocalEscritura(e)
                        })}
                        inputProps={{ 'aria-label': 'Without label' }}
                    />
                </div>
            }
        </>

    )
}
