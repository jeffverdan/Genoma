import { Chip, SelectChangeEvent } from '@mui/material';
import InputSelect from '@/components/InputSelect/Index';
import { ApiTopicosAnaliseType, SelectsType } from '@/interfaces/PosVenda/Analise';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';

interface Props {    
    processData?: ProcessType
    lists?: ApiTopicosAnaliseType
    selects: SelectsType
    setSelects: (e: SelectsType) => void
    onChangeSelect: (e: SelectChangeEvent<unknown>, index?: number | ReactNode) => void
}

const EntregaDasChaves = ({ processData, lists, selects, onChangeSelect, setSelects }: Props) => {

    useEffect(() => {
        if(processData) {
            const arrPagamento = processData.imovel.informacao?.forma_pagamento.split(',') as string[];
            let value: string = '';
            if(arrPagamento?.some((e) => e === '1')) {
                value = arrPagamento.find(e => e !== '1')?.[0] || '1';
            } else if (arrPagamento?.some((e) => e === '2')) {
                if(arrPagamento?.some((e) => e === '3')) value = '7'
                else value = '2';
            } else if (arrPagamento?.some((e) => e === '3') && arrPagamento?.some((e) => e === '4')) {
                value = '9'
            } else {
                value = arrPagamento[0];
            }
            setSelects({...selects, formPagamento: Number(value) || ''});
        }
    }, [processData]);
    
    return (
        <>
            <div className='cards'>
                <h2>Qual a forma de pagamento?</h2>
                <InputSelect
                    label={'Forma de pagamento do imóvel*'}
                    name={'formPagamento'}
                    disabled={true}
                    option={lists?.tipos.lista_entrega_das_chaves || []}
                    value={selects?.formPagamento || ''}
                    // onChange={onChangeSelect}
                />
            </div>
            {selects?.formPagamento === 1 && <div className='cards'>
                <h2>Selecione o responsável pela entrega das chaves:</h2>
                <InputSelect
                    label={'Vendedor responsável*'}
                    name={'vendedorResponsavel'}
                    option={lists?.vendedores_envolvidos || []}
                    value={selects?.vendedorResponsavel || ''}
                    onChange={onChangeSelect}
                />
            </div>}
            {(selects?.formPagamento === 2 || selects?.formPagamento === 7) && <div className='cards'>
                <h2>Selecione o banco responsável pelo financiamento:</h2>
                <InputSelect
                    label={'Banco/Instituição financeira*'}
                    name={'bancoResponsavel'}
                    option={lists?.bancos || []}
                    value={selects?.bancoResponsavel || ''}
                    onChange={onChangeSelect}
                />
            </div>}
            {(selects?.formPagamento === 1 || selects?.formPagamento === 2 || selects?.formPagamento === 7) &&
                <div className='cards'>
                    <p>Itens importantes que merecem sua atenção:</p>
                    {selects?.formPagamento === 1 && <>
                        <Chip className='chip primary' label="ENTREGA DAS CHAVES - à vista" />
                        <li className='bold'>Acompanhar - Prazo da entrega das chaves com o vendedor responsável.</li>
                    </>}
                    {(selects?.formPagamento === 2 || selects?.formPagamento === 7) && <>
                        <Chip className='chip primary' label="ENTREGA DAS CHAVES - financiamento" />
                        <li className='bold'>Acompanhar - Prazo da entrega das chaves com a instituição financeira.</li>
                    </>}
                </div>
            }
        </>
    )
}

export default EntregaDasChaves;