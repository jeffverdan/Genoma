import GetListBancos from '@/apis/getListBancos';
import InputSelect from '@/components/InputSelect/Index'
import InputText from '@/components/InputText/Index'
import dateMask from '@/functions/dateMask'
import horaMask from '@/functions/horaMask';
import React, { useEffect, useState, ReactNode } from 'react'
import { useForm } from 'react-hook-form';
import CheckBox from '@/components/CheckBox'
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { FormValues } from '@/interfaces/PosVenda/AlterarStatus';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import MultipleSelectCheckmarks from '@/components/SelectMultiInput';
import { ApiTopicosAnaliseType, SelectsType } from '@/interfaces/PosVenda/Analise';
import SelectInput, { SelectChangeEvent } from '@mui/material/Select/SelectInput';

interface IListaBancos {
    id: number,
    nome: string
}
interface IHistoricoStatus {
    dias_corridos: string;
    historico_status: {
        id: number | string,
        status_id: number,
        data: string;
        data_expiracao: string;
        nome: string;
        status: string;
    }[];
    verifica_data: string;
}
interface PropsType {
    processData?: ProcessType
    register: UseFormRegister<FormValues>
    watch: UseFormWatch<FormValues>
    errors: FieldErrors<FormValues>
    setValue: UseFormSetValue<FormValues>
    lists?: ApiTopicosAnaliseType
    topics?: SelectsType
    historicoStatus?: IHistoricoStatus
}

type TipoMultiType = {
    id_vinculo_tipo?: string
    id: number | string
}[]

type KeysType = 'topico' | 'quantAverbacao' | 'vendedoresAverbacao';

export default function Averbacao({ register, watch, errors, setValue, processData, lists, topics, historicoStatus }: PropsType) {
    const errorMsg = 'Campo obrigatório';
    console.log('lists: ', lists?.quantVendedores);
    console.log('topics: ', topics);

    const handleInput = (e: any) => {
        const value = e.target.value;
        const name = e.target.name as "quant_vendedores_averb" | "vendedores_averb.0.id";
        setValue(name, value);

        if (name === 'quant_vendedores_averb') {
            const arr = []
            for (let i = 0; i < value; i++) {
                arr.push(watch('vendedores_averb')?.[i] || { id: '', tipo: [{ id: '' }] });
            }
            setValue('vendedores_averb', arr);
        }
    };

    const handleChangeMulti = (e: TipoMultiType, index: number) => {
        setValue(`vendedores_averb.${index}.tipo`, e);
    };

    useEffect(() => {
        const filtrarAverbacao: any = historicoStatus?.historico_status?.filter((item: any) => item.status_id === 21);
        const ultimaAverbacao = filtrarAverbacao.pop();
        console.log('ultimaAverbacao: ' , ultimaAverbacao)

        // if(ultimaAverbacao){
        //     // setValue('pendencia_taxa', ultimaTaxas?.pendencias)
        //     setValue('quant_vendedores_averb', ultimaAverbacao?.averbacao?.length);
        //     setValue('vendedores_averb', ultimaAverbacao?.averbacao);
        // }
        // else{
        //     if (topics) {
        //         setValue('quant_vendedores_averb', Number(topics.vendedoresAverbacao?.length));
        //         setValue('vendedores_averb', topics.vendedoresAverbacao);
        //     }
        // }

        if (topics) {
            setValue('quant_vendedores_averb', Number(topics.vendedoresAverbacao?.length));
            setValue('vendedores_averb', topics.vendedoresAverbacao);
        }
        
    }, [topics]);

    // console.log('LISTS: ', lists)
    // console.log('TOPICS: ', topics)
    // console.log('WATCH TAXAS: ', watch());
    // console.log('CARD SELECT: ', cardSelect?.pendencias)
    // console.log('LISTAS: ', lists?.tipos.lista_imovel_pendencia_taxa);

    return (
        <>
            {!!watch && !!register &&
                <div className='cards'>
                    <h2>Confirme as averbações dos vendedores</h2>
                    <InputSelect
                        label={'Quantos vendedores?*'}
                        option={lists?.quantVendedores || []}
                        value={watch('quant_vendedores_averb') || ''}
                        {...register('quant_vendedores_averb', {
                            required: errorMsg,
                            onChange: (e) => handleInput(e)
                        })}
                    />

                    {watch('vendedores_averb')?.map((vendedor, index) => (
                        <div className='selects-line' key={index}>
                            <InputSelect
                                label={'Nome completo*'}
                                option={lists?.vendedores_envolvidos || []}
                                value={vendedor.id}
                                {...register(`vendedores_averb.${index}.id`, {
                                    required: errorMsg,
                                    onChange: (e) => handleInput(e)
                                })}
                            />

                            {(lists) && <MultipleSelectCheckmarks
                                label={`Tipos de averbações*`}
                                options={lists?.tipos.lista_averbacao?.filter((data) => data.id !==1 && data.id !==3 ) || []}
                                value={vendedor.tipo}
                                name={`vendedores_averb.${index}.tipo`}
                                labelMenu={`Tipos de averbações`}
                                placeholder='Selecione...'
                                onChange={(e) => handleChangeMulti(e, index)}
                            />}
                        </div>
                    ))}
                </div>
            }
        </>
    )
}
