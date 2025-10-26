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
import RowRadioButtonsGroup from '@/components/RadioGroup';

interface Props {
    lists?: ApiTopicosAnaliseType
    selects: SelectsType
    setSelects: (e: SelectsType) => void
    onChangeSelect: (e: SelectChangeEvent<unknown>, index?: number | ReactNode) => void
};

type InputsType = {
    observacao: string
    check: string
};

type Options = {
    value: string;
    disabled: boolean;
    label: string;
    checked: boolean;
    width?: string;
  };

const ReforcoSinal = ({ lists, selects, setSelects, onChangeSelect }: Props) => {
    const router = useRouter();
    const [radioOptions, setRadioOptions] = useState<Options[]>([
        {value: '15', label: 'Após as certidões', checked: false, disabled: false},
        {value: '16', label: 'Outro período', checked: false, disabled: false},
    ]);

    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useForm<InputsType>({
        defaultValues: {
            observacao: selects?.observacaoReforco,
            check: selects?.momentoReforco
        }
    });

    const handleSalvarObs = () => {
        setSelects({ ...selects, observacaoReforco: watch('observacao') });
    };

    useEffect(() => {
        if(radioOptions.some(e => e.checked)) {
            setSelects({ ...selects, momentoReforco: radioOptions.find(e => e.checked)?.value});
        }
    }, [radioOptions]);
    
    useEffect(() => {
        if(selects?.momentoReforco && radioOptions.every((e) => !e.checked)) {
            radioOptions.forEach(e => {
                e.checked = e.value === selects.momentoReforco;
            })
        }
    }, [selects]);

    console.log(selects);    

    return (
        <>
            <div className='cards'>
                <h2>Em que momento deve ocorrer o reforço?</h2>
                <RowRadioButtonsGroup 
                    label={''} 
                    name={'check'} 
                    options={radioOptions} 
                    setOptions={setRadioOptions} 
                    setValue={setValue} 
                    value={watch('check')}
                />
                <EmptyTextarea
                    minRows={2}
                    value={watch('observacao')}
                    placeholder={'Ex: Ocorrerá durante a entrega das chaves ao comprador...'}
                    label={'Descreva o período que está especificado no Recibo de Sinal:'}
                    {...register("observacao", {
                        onChange: (e) => setValue('observacao', e.target.value),
                        onBlur: () => handleSalvarObs()
                    })}

                />
            </div>
        </>
    )
}

export default ReforcoSinal;