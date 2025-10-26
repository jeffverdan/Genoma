import React, { useEffect, useState, useContext } from 'react';
import RadioGroup from "@/components/RadioGroup";
import DateInput from "@/components/DateInput";
import InputText from "@/components/InputText/Index";
import { useForm } from 'react-hook-form'
import styles from './BlockStyles.module.scss'
import ImovelContext from '@/context/Vendas/ContextBlocks';
import dayjs, { Dayjs } from 'dayjs';
import { addBusinessDays, format } from 'date-fns';
import formatoMoeda from '@/functions/formatoMoeda';
import Alert from '@mui/material/Alert';
import { FaExclamationCircle } from 'react-icons/fa';
import Laudemio from '@/components/DetalhesVenda/Imovel/Leitura/Laudemio';
// import BlockLaudemio from './BlockLaudemio';
import ButtonComponent from '@/components/ButtonComponent';
import { HiCheck } from 'react-icons/hi2';
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
  Footer?: React.FC<{
    goToPrevSlide: (index: number) => void;
    goToNextSlide: any;
    index: number;
    tipo?: string
  }>
  handleShow?: any
  setBlockSave?: any
  saveBlocks?: any
  listaDocumentos: any
  blocksLength?: number
};

const Prazo: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer, handleShow, setBlockSave, saveBlocks, blocksLength }) => {
  const {
    selectItem,
  } = useContext(ImovelContext);

  const perfil = localStorage.getItem('perfil_login');

  const [prazoData, setPrazoData] = React.useState<string>(dayjs().format('DD/MM/YYYY'));
  const [open, setOpen] = useState(false);
  const [openLaud, setOpenLaud] = useState(false);
  const [tipoDias, settipoDias] = useState(true);
  const [tipoPagamento, settipoPagamento] = useState('');

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

  if (index === selectItem) {
    console.log("Form: ", watch());
    console.log("Error: ", errors);

  };

  const saveData = () => {
    let valor: any = {
      'bloco': 5,
      'processo_id': data.processo_id,
      'usuario_id': localStorage.getItem('usuario_id'),
      'tipo_dias': watch('tipo_dias'),
      'prazo': watch('prazo'),
      'valoMulta': watch('valoMulta')
    };
    // setDataSave(valor);
    setBlockSave(valor)
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

  useEffect(() => {
    const valorLaudemioTips = (localStorage.getItem('laudemio_tips') === 'true' ? 'true' : 'false');
    const valorFormaPgtTips = (localStorage.getItem('formapgt_tips') === 'true' ? 'true' : 'false');
    console.log('teste')
    if (valorLaudemioTips === 'true') {
      setOpenLaud(true);
      const tipo_Pagamento = localStorage.getItem('tipo_pgamento') || '';
      settipoPagamento(tipo_Pagamento);
    } else {
      setOpenLaud(false);
    }

    if (valorFormaPgtTips === 'true') {
      setOpen(true);
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

  return (
    <>
      <div className={styles.containerBlock}>
        <div className="">
          <div className={styles.headerBlock}>
            {
              perfil === 'Pós-venda' ?
                <h2>Prazo de Escritura e multa</h2>
                :
                <>
                  <h3>Qual é o prazo da escritura?</h3>
                  <p className="p1"></p>
                </>
            }
          </div>
          <div className='mt44 mb44'>
            <RadioGroup
              value={watch('tipo_dias')}
              name='tipo_dias'
              label=''
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
          <div style={{ marginBottom: 5 }}>
            {(open && perfil === 'Gerente') && (
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
          {(openLaud && perfil === 'Gerente') && (
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

        {
          // Quando for Pós-venda
          (perfil === 'Pós-venda' || perfil === 'Coordenadora de Pós-Negociação') &&
          <footer className={styles.footerControls} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <ButtonComponent
                size={"large"}
                variant={"text"}
                name={"previous"}
                label={"Voltar"}
                // startIcon={<HiArrowLeft className='primary500' />}
                onClick={e => handleShow(index, 'voltar')} /*goToPrevSlide(index)*/
              />
            </div>
            <div>
              <ButtonComponent
                size={"large"}
                variant={"contained"}
                name={"previous"}
                labelColor='white'
                label={"Salvar"}
                endIcon={<HiCheck fill='white' />}
                onClick={handleSubmit(() => [saveBlocks(), handleShow(index, 'salvar')])}
              />
            </div>
          </footer>
        }

        {
          Footer &&
          <Footer
            goToPrevSlide={() => handlePrevBlock(index)}
            goToNextSlide={handleSubmit(() => handleNextBlock(index))}
            index={index}
            tipo={blocksLength === index + 1 ? 'last_block' : ''}
          />
        }
      </div>
    </>
  );
};

export default Prazo;