import GetListBancos from '@/apis/getListBancos';
import InputSelect from '@/components/InputSelect/Index'
import InputText from '@/components/InputText/Index'
import dateMask from '@/functions/dateMask'
import horaMask from '@/functions/horaMask';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import CheckBox from '@/components/CheckBox'
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { FormValues, Visualizar, DataToSave } from '@/interfaces/PosVenda/AlterarStatus';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import MultipleSelectCheckmarks from '@/components/SelectMultiInput';
import { ApiTopicosAnaliseType, SelectsType } from '@/interfaces/PosVenda/Analise';

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
    cardSelect: Visualizar
    historicoStatus?: IHistoricoStatus
}

export default function Taxas({ register, watch, errors, setValue, processData, lists, topics, cardSelect, historicoStatus }: PropsType) {
    const errorMsg = 'Campo obrigatório';
    console.log('PROCESSDATA: ', processData)
    console.log('LISTS: ', lists)
    console.log('TOPICS: ', topics)

    const handleInput = (e: any) => {
        const value = e.target.value;
        const name = e.target.name as "responsavel_vendedor" | "responsavel_comprador";
        setValue(name, value);
    };

    const handleChangeMulti = (e: any[]) => {
        setValue('pendencia_taxa', e)
    };

    useEffect(() => {
        const filtrarTaxas: any = historicoStatus?.historico_status?.filter((item: any) => item.status_id === 4);
        const ultimaTaxas = filtrarTaxas.pop();
        // console.log(historicoStatus)
        console.log(ultimaTaxas);

        if(ultimaTaxas){
            setValue('pendencia_taxa', ultimaTaxas?.pendencias)
        }
        else{
            if(topics) setValue('pendencia_taxa', topics.pendencia);
            else{setValue('pendencia_taxa', [])}
        }

        // if(!!cardSelect?.pendencias){
        //     console.log('1')
        //     setValue('pendencia_taxa', cardSelect?.pendencias)
        // }
        // else{
        //     console.log('2')
        //     if(topics) setValue('pendencia_taxa', topics.pendencia);
        //     else{setValue('pendencia_taxa', [])}
        // }
    }, [topics]);

    //// console.log('LISTS: ', lists)
    // console.log('TOPICS: ', topics)
    // console.log('WATCH TAXAS: ', watch());
    // console.log('CARD SELECT: ', cardSelect?.pendencias)
    // console.log('LISTAS: ', lists?.tipos.lista_imovel_pendencia_taxa);
    
    return (
        <>
            {!!watch && !!register &&
                <>
                    <div className="cards">
                        <h2>Informe as partes responsáveis pela compra e venda.</h2>
                        <p>Selecione os responsáveis pela comissão e valores de pagamento. Essa informação é importante para manter contato e realizar cobranças.</p>

                        <div className="selects-line">
                            <InputSelect
                                option={lists?.vendedores_envolvidos || []}
                                label={'Vendedor responsável*'}
                                placeholder={'Selecione'}
                                error={!!errors.responsavel_vendedor}
                                msgError={errors.responsavel_vendedor}
                                sucess={!errors.responsavel_vendedor && !!watch('responsavel_vendedor')}
                                value={watch('responsavel_vendedor') || ''}
                                {...register('responsavel_vendedor', {
                                    required: errorMsg,
                                    onChange: (e) => handleInput(e)
                                })}
                            />

                            <InputSelect
                                option={lists?.compradores_envolvidos || []}
                                label={'Comprador responsável*'}
                                placeholder={'Selecione'}
                                error={!!errors.responsavel_comprador}
                                msgError={errors.responsavel_comprador}
                                sucess={!errors.responsavel_comprador && !!watch('responsavel_comprador')}
                                value={watch('responsavel_comprador') || ''}
                                {...register('responsavel_comprador', {
                                    required: errorMsg,
                                    onChange: (e) => handleInput(e)
                                })}
                            />
                        </div>
                    </div>

                    <div className="cards">
                        <h2>Inscrição municipal do imóvel</h2>
                        <InputText name='inscricao_municipal' label={'Inscrição municipal*'} value={processData?.imovel.informacao?.inscricaoMunicipal || ''} disabled />
                        {
                            (lists && !!watch('pendencia_taxa')) && <MultipleSelectCheckmarks
                                label={`Pendências*`}
                                name='pendencia_taxa'
                                options={lists?.tipos.lista_imovel_pendencia_taxa || []}
                                value={watch('pendencia_taxa') || []}
                                // error={error?.[checkType]?.reviews?.[index]?.errorCheck}                    
                                labelMenu={`Tipos de averbações`}
                                // maxWidth={300}
                                placeholder='Selecione...'
                                onChange={handleChangeMulti}
                            />
                        }
                    </div>
                </>
            }
        </>
    )
}
