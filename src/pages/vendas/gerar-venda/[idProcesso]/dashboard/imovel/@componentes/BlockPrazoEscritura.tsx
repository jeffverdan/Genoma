import React, { useEffect, useState, useContext } from 'react';
import RadioGroup from "@/components/RadioGroup";
import DateInput from "@/components/DateInput";
import InputText from "@/components/InputText/Index";
import { useForm } from 'react-hook-form'
import styles from './BlocksStyles.module.scss'
import ImovelContext from '@/context/Vendas/ContextBlocks';
import dayjs, { Dayjs } from 'dayjs';
import { addBusinessDays, format } from 'date-fns';
import formatoMoeda from '@/functions/formatoMoeda';
import Alert from '@mui/material/Alert';
import { FaExclamationCircle } from 'react-icons/fa';
import Laudemio from '@/components/DetalhesVenda/Imovel/Leitura/Laudemio';
import BlockLaudemio from './BlockLaudemio';
import getImovel from '@/apis/getImovel';
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
  const errorMsg = 'Campo obrigatório';
  const {
    selectItem, setDataSave,
    dataProcesso, setDataProcesso,
  } = useContext(ImovelContext);

  const [prazoData, setPrazoData] = React.useState<string>(dayjs().format('DD/MM/YYYY'));
  const [prazoDataError, setPrazoDataError] = React.useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [openLaud, setOpenLaud] = useState(false);
  //const [datasCheck, setdatasCheck] = useState(45);
  const [tipoDias, settipoDias] = useState(true);
  const [tipoPagamento, settipoPagamento] = useState('');
  //const [loading, setLoading] = useState(true);

//   const [verificarPgt, setverificarPgt] = useState(false);
//   const [verificarLaud, setVerificarLaud] = useState(false);

  const infoPagamento = data?.imovel?.informacao?.forma_pagamento;
  const arrFormaPagamento = infoPagamento?.split(',');
  console.log(infoPagamento)
  console.log(arrFormaPagamento)
    
  const {
    register,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      prazo: data?.informacao?.prazo || '',
      valoMulta: data?.informacao?.valoMulta || '',
      tipo_dias: data?.informacao?.tipo_dias || '1',
    }
  });

  console.log('dataProcesso: ' , dataProcesso)

  useEffect(() => {
    console.log(arrFormaPagamento)
    clearErrors('prazo');

    if (!data?.informacao?.prazo) {
      if (arrFormaPagamento?.includes('3') || arrFormaPagamento?.includes('2')) {
          setValue('prazo', '45');
      } 
      else if (arrFormaPagamento?.includes('1') && !arrFormaPagamento?.includes('3')) {
          setValue('prazo', '30');
      }

      setTimeout(() => {
          saveData();
      }, 1000);
    }
    console.log('AQUI 4')
  },[infoPagamento])

  useEffect(() => {
      const valorLaudemioTips = (localStorage.getItem('laudemio_tips') === 'true' ? 'true' : 'false');
      const valorFormaPgtTips = (localStorage.getItem('formapgt_tips') === 'true' ? 'true' : 'false');
      console.log('teste')
      if (valorLaudemioTips === 'true') {
          setOpenLaud(true);

      } else {
          setOpenLaud(false);
      }

      if (valorFormaPgtTips === 'true') {
          setOpen(true);
          const tipo_Pagamento = localStorage.getItem('tipo_pgamento') || '';
          console.log(tipo_Pagamento);
          settipoPagamento(tipo_Pagamento);    
      } else {
          setOpen(false);
      }

      if (watch('tipo_dias') == '1') {
          //setdatasCheck(45);
          settipoDias(true)
      } else {
        // setdatasCheck(65);
          settipoDias(false)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch()])

  const returnProcesso = async () => {
    const value = await getImovel(data?.id, '');
    setDataProcesso(value);
  }

  const handleClick = (direction: string) => {
    clearErrors('prazo')

    if (prazoDataError) return ''

    if (direction === 'NEXT') {
      handleNextBlock(index);
    } else {
      handlePrevBlock(index);
    }

    returnProcesso()

  };

  if (index === selectItem) {
    console.log("Form: ", watch());
    console.log("Error: ", errors);
  };

  const saveData = () => {
    let valor: any = {
      'bloco': index,
      'processo_id': data.processo_id,
      'usuario_id': localStorage.getItem('usuario_id'),
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
   //let datas_check:number  = 45;
  const handleChangeData = () => {
    options.forEach((option) => {
      if (option.checked) {
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

  const handleCloseTips = () => {
    //setverificarPgt(true)
    setOpen(false);
  };


  const handleCloseTipsLaud = () => {
    //setVerificarLaud(true)
    setOpenLaud(false);
  };

//   useEffect(() => {
//     handleChangeData();
//           console.log('teste');  
//   }, [options])

  const changeFunction = () => {
    if(!data?.informacao?.prazo){
      if((arrFormaPagamento.includes('1') && arrFormaPagamento.includes('3')) 
        || arrFormaPagamento.includes('2')
        || arrFormaPagamento.includes('3')
      ){
        if (watch('tipo_dias') == '1') {
          setValue('prazo', '45');
          settipoDias(true)
        } else {
          settipoDias(false)
          setValue('prazo', '65');
        }
      }
    }
    
    saveData()
  }

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
              name='tipo_dias'
              label=''
              options={options}
              setOptions={setOptions}
              setValue={setValue}
              changeFunction={changeFunction}
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
                msgError={errors?.prazo}
                sucess={!errors?.prazo && watch('prazo') !== ''}
                {...register('prazo', {
                  required: errorMsg,
                  onChange: () => handleChangeData(),
                  // validate: (value: any) => {
                  //   const numValue = parseInt(value, 10);
                  //   if (isNaN(numValue)) return 'O valor deve ser um número válido.';
                  //   if (tipoDias && numValue < 45 && open) return 'O número de dias não pode ser menor que 45.';
                  //   if (!tipoDias && numValue < 65 && open) return 'O número de dias não pode ser menor que 65.';
                  //   if (numValue < 30 && !open) return 'O número de dias não pode ser menor que 30.';
                  //   clearErrors('prazo');
                  //   return true;
                  // },
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
          <div style={{ marginBottom: 5 }}>
            {open && (
              <Alert
                className='alert yellow'
                icon={<FaExclamationCircle size={20} />}
                onClose={handleCloseTips}
                //severity='warning'
                variant="filled"
                sx={{ width: '100%' }}
              >
                O prazo do processo precisa ter no <b>mínimo {tipoDias === true ? '45 dias úteis' : '65 dias corridos'}, de acordo com a forma de pagamento de {tipoPagamento}.</b>
              </Alert>
            )}
          </div>
          {openLaud && (
            <Alert
              className='alert yellow'
              icon={<FaExclamationCircle size={20} />}
              onClose={handleCloseTipsLaud}
              //severity='warning'
              variant="filled"
              sx={{ width: '100%' }}
            >
              O prazo para liberação de laudêmio pela prefeitura é de <b>{tipoDias === true ? '20 a 25 dias úteis.' : '30 a 35 dias corridos.'}</b>
            </Alert>
          )}
        </div>

        {Footer &&
          <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(() => handleClick("NEXT"))} index={index} />}
      </div>
    </>
  );
};

export default BlockPage;