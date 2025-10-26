import React, { useEffect, useState, useContext } from 'react';
import RadioGroup from "@/components/RadioGroup";
import DateInput from "@/components/DateInput";
import InputText from "@/components/InputText/Index";
import { useForm } from 'react-hook-form'
import styles from './BlocksStyles.module.scss'
import ImovelContext from '@/context/ImovelContext';
import dayjs, { Dayjs } from 'dayjs';
import { addBusinessDays, format } from 'date-fns';
import formatoMoeda from '@/functions/formatoMoeda';

interface FormValues {
  prazo?: string,
  valoMulta?: string,
  tipo_dias?: string
}

type BlockProps = {
  handleNextBlock: (index: number) => void;
  handlePrevBlock: (index: number) => void;
  index: number;
  data: any;
  Footer: React.FC<{
    goToPrevSlide: (index: number) => void;
    goToNextSlide: any;
    index: number;
  }>
};

const BlockPage: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer }) => {
  const {
    selectItem, setDataSave, saveImovel,
  } = useContext(ImovelContext);

  const [prazoData, setPrazoData] = React.useState<string>( dayjs().format('DD/MM/YYYY'));
  const [prazoDataError, setPrazoDataError] = React.useState<boolean>(false);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      prazo: data?.informacao?.prazo || '',
      valoMulta: data?.informacao?.valoMulta || '',
      tipo_dias: data?.informacao?.tipo_dias || '1',
    }
  });

  const handleClick = (direction: string) => {
    if (prazoDataError) return ''

    if (direction === 'NEXT') {
      handleNextBlock(index);
    } else {
      handlePrevBlock(index);
    }
  };

  if (index === selectItem) {
    console.log("Form: ", watch());
    console.log("Error: ", errors);
  };

  const saveData = () => {
    let valor: any = {
      'bloco': index,
      'processo_id': data.processo_id,
      'tipo_dias': watch('tipo_dias'),
      'prazo': watch('prazo'),
      'valoMulta': watch('valoMulta')
    };
    setDataSave(valor);
  };

  const [options, setOptions] = useState([
    { value: '1', disabled: false, label: 'Utilizar dias úteis', checked: false },
    { value: '2', disabled: false, label: 'Utilizar dias corridos', checked: false }
  ]);

  const handleChangeData = () => {    
    options.forEach((option) => {
      if(option.checked) {
        option.value === '1' 
        ? handleDiasUeis()
        : handleDiasInuteis()
      }
    })
    saveData();
  };

  const handleDiasUeis = () => {
    const dataPrazo = addBusinessDays(new Date(), Number(watch('prazo')))
    setPrazoData(format(dataPrazo, 'dd-MM-yyyy'))
  };

  const handleDiasInuteis = () => {
    const dataPrazo = dayjs().add(Number(watch('prazo')), 'day');
    setPrazoData(dataPrazo.format('DD-MM-YYYY'))
  };

  useEffect(() => {
    handleChangeData();    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[options])

  return (
    <>
      <div className={styles.containerBlock}>
        <div className="">
          <div className={styles.headerBlock}>
            <h3>Qual é o prazo da escritura?</h3>
          </div>
          <div className='mt44 mb44'>
            <RadioGroup 
              value={watch('tipo_dias')} 
              label='' 
              name='tipo_dias'
              options={options} 
              setOptions={setOptions} 
              setValue={setValue}
            />
          </div>

          <div className='flex'>
            <div className='mr20'>
              <InputText
                width='441px'
                label={'Número de dias*'}
                type='number'
                placeholder='Ex: 30'
                value={watch('prazo')}
                error={!!errors.prazo}
                {...register('prazo', {
                  required: true,
                  onChange: () => handleChangeData(),
                })}
              />
            </div>
          </div>

          <p className='mt20 mb44 p1'>E a multa diária?</p>

          <div className='mb44'>
            <InputText
              width='441px'
              label={'Valor da multa diária'}
              placeholder='Ex: R$ 500,00'
              value={watch('valoMulta')}
              // error={!!errors.valoMulta}
              {...register('valoMulta', {
                // required: errorMsg,
                onChange: (e) => [setValue('valoMulta', formatoMoeda(e.target.value)), saveData()],
              })}
            />
          </div>
        </div>

        {Footer &&
          <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(() => handleClick("NEXT"))} index={index} />}
      </div>
    </>
  );
};

export default BlockPage;