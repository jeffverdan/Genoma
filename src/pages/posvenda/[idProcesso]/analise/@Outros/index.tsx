import { Chip, SelectChangeEvent } from '@mui/material';
import InputSelect from '@/components/InputSelect/Index';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import InputText from '@/components/InputText/Index';
import GetLaudemiosList from '@/apis/getLaudemiosList';
import { LaudemiosListItem } from '@/interfaces/Imovel/laudemiosType';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import SwitchWithLabel from '@/components/SwitchButton';
import SimpleDialog from '@/components/Dialog';
import LaudemioImage from '@/images/laudemio_nao_cadastrado.svg';
import Image from 'next/image';
import ButtonComponent from '@/components/ButtonComponent';
import EmptyTextarea from '@/components/TextArea';
import { useForm } from 'react-hook-form';
import { ApiTopicosAnaliseType, SelectsType } from '@/interfaces/PosVenda/Analise';

interface Props {
    lists?: ApiTopicosAnaliseType
    selects: SelectsType
    setSelects: (e: SelectsType) => void
    onChangeSelect: (e: SelectChangeEvent<unknown>, index?: number | ReactNode) => void
};

type InputsType = {
    observacao: string
}

const Outros = ({ lists, selects, setSelects, onChangeSelect }: Props) => {
    const router = useRouter();
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useForm<InputsType>({
        defaultValues: {
            observacao: selects?.observacaoOutros
        }
    });

    const handleSalvarObs = () => {
        setSelects({ ...selects, observacaoOutros: watch('observacao') });
    };

    console.log(selects);    

    return (
        <>
            <div className='cards'>
                <h2>Esse tópico é sobre o que?</h2>
                <InputSelect
                    name={'assuntoOutros'}
                    label={'Assunto*'}
                    option={lists?.tipos.lista_outros || []}
                    onChange={onChangeSelect}
                    value={selects?.assuntoOutros || ''}
                />
            </div>

            <div className='cards'>
                <h2>Insira sua observação ao processo:</h2>
                <EmptyTextarea
                    minRows={2}
                    value={watch('observacao')}
                    placeholder={'Digite aqui...'}
                    label={'Escreva livremente'}
                    {...register("observacao", {
                        onChange: (e) => setValue('observacao', e.target.value),
                        onBlur: () => handleSalvarObs()
                    })}

                />
            </div>
        </>
    )
}

export default Outros;