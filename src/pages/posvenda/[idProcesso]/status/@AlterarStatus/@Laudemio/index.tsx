import GetListBancos from '@/apis/getListBancos';
import InputSelect from '@/components/InputSelect/Index'
import InputText from '@/components/InputText/Index'
import dateMask from '@/functions/dateMask'
import horaMask from '@/functions/horaMask';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import CheckBox from '@/components/CheckBox'
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { FormValues } from '@/interfaces/PosVenda/AlterarStatus';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import MultipleSelectCheckmarks from '@/components/SelectMultiInput';
import { ApiTopicosAnaliseType, SelectsType } from '@/interfaces/PosVenda/Analise';
import GetLaudemiosList from '@/apis/getLaudemiosList';
import { LaudemiosListItem } from '@/interfaces/Imovel/laudemiosType';

interface PropsType {
    processData?: ProcessType
    register: UseFormRegister<FormValues>
    watch: UseFormWatch<FormValues>
    errors: FieldErrors<FormValues>
    setValue: UseFormSetValue<FormValues>    
}

type ListType = {
    igreja: LaudemiosListItem[],
    familia: LaudemiosListItem[]
};

const optionsQuantLaudemios = [
    { name: 'Selecione...', id: '' },
    { id: 1, name: 1 },
    { id: 2, name: 2 },
    { id: 3, name: 3 },
    { id: 4, name: 4 },
];

const tiposLaudemios = [
    { name: 'União, Prefeitura, Família ou Igreja', id: '' },
    { name: 'União', id: '1' },
    { name: 'Prefeitura', id: '2' },
    { name: 'Família', id: '3' },
    { name: 'Igreja', id: '4' },
];

export default function Laudemio({ processData }: PropsType) {
    const laudemios = processData?.imovel.laudemios;
    const [lists, setLists] = useState<ListType>();

    useEffect(() => {
        getList()
    }, []);

    const getList = async () => {        
        const listLaudemios = await GetLaudemiosList() as unknown as LaudemiosListItem[];
        setLists({
            igreja: [
                { id: '', nome: 'Selecione...', tipo_laudemio_id: '4' },
                ...listLaudemios.filter(e => Number(e.tipo_laudemio_id) === 4)
            ],
            familia: [
                { id: '', nome: 'Selecione...', tipo_laudemio_id: '3' },
                ...listLaudemios.filter(e => Number(e.tipo_laudemio_id) === 3)
            ]
        })
    };

    console.log(laudemios);

    return (
        <>
            <div className="cards">
                {!!laudemios?.[0] 
                    ? <h2>O imóvel possui Laudêmio no contrato</h2>
                    : <h2>O imóvel não possui Laudêmio cadastrado</h2>
                }

                {!!laudemios?.[0] &&
                    <InputSelect
                        label={'De quantos laudêmios estamos falando?*'}
                        name={'quantLaudemios'}
                        option={optionsQuantLaudemios}
                        value={laudemios?.length}
                        disabled
                    />}

                {laudemios?.map(e => (
                    <div className='selects-line' key={e.id}>
                        <InputSelect
                            label={'Selecione o tipo de laudêmio*'}
                            name={'tipoLaudemio'}
                            option={tiposLaudemios}
                            value={e.tipo_laudemio}
                            disabled
                        />
                        {e.tipo_laudemio === '1' && <InputText
                            name=''
                            label='Insira o RIP referente ao laudêmio*'
                            placeholder='9999.99999.999-9'
                            value={e.valor_laudemio}
                            disabled
                        />}
                        {e.tipo_laudemio === '3' &&
                            <InputSelect
                                label={'Selecione a família referente ao laudêmio*'}
                                name={'familiaLaudemio'}
                                option={lists?.familia || []}
                                value={e.valor_laudemio}
                                disabled />
                        }
                        {e.tipo_laudemio === '4' &&
                            <InputSelect
                                label={'Selecione a igreja referente ao laudêmio*'}
                                name={'igrejaLaudemio'}
                                option={lists?.igreja || []}
                                value={e.valor_laudemio}
                                disabled
                            />
                        }
                    </div>
                ))}
            </div>
        </>
    )
}
