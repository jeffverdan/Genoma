import React, { useState, useEffect, useContext, Key } from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import { useForm } from 'react-hook-form'
import styles from './BlockStyles.module.scss'
import TextArea from "@/components/TextArea";
import Alert from '@mui/material/Alert';
import { FaExclamationCircle } from 'react-icons/fa';
import { HiCheck } from 'react-icons/hi2';

interface FormValues {
  clausula_segunda: string;
  clausula_decima: string;
}

type FormItem = {
  label: string;
  placeholder: string;
  text: string;
  boldText?: string;
  register: keyof FormValues;
  require: boolean;
};

const arrayForm: FormItem[] = [
  {
    label: 'Cláusula segunda',
    placeholder: 'Exemplo: havendo dolo do adquirente',
    text: 'Informe as exceções que devem ser inclusas na Cláusula segunda do ato, conforme pode ser lida no recibo de sinal',
    boldText: "respondendo, ainda, pela evicção de direito, exceto:",
    register: 'clausula_segunda',
    require: true
  },
  {
    label: 'Cláusula décima',
    placeholder: 'Exemplo: O imóvel será entregue com uma televisão do tipo Smart TV de 50 polegadas da marca LG.',
    text: 'Se acordado entre as partes que o imóvel será entregue vazio, pule esta etapa. ',
    boldText: 'Caso o imóvel seja entregue com outros bens, faça a listagem dos bens móveis seguindo o exemplo abaixo:',
    register: 'clausula_decima',
    require: false
  },

];

type BlockProps = {
  handleNextBlock: (index: number) => void;
  handlePrevBlock: (index: number) => void;
  index: number;
  data: any;
  Footer: React.FC<{
    goToPrevSlide: (index: number) => void;
    goToNextSlide: any;
    index: number;
    tipo?: string
  }>
  handleShow?: any
  setBlockSave?: any
  saveBlocks?: any
  blocksLength?: number
};

const Clausula: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer, handleShow, setBlockSave, saveBlocks, blocksLength }) => {
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(true);
  const [openDecima, setOpenDecima] = useState(true);
  const perfil = localStorage.getItem('perfil_login');

  const {
    register,
    watch,
    setValue,
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      clausula_segunda: data?.informacao?.excecoes || '',
      clausula_decima: data?.informacao?.bens_moveis || '',
    }
  });

  const handleInput = (type: any) => {
    let valor: any = {
      'bloco': 6,
      'processo_id': data?.processo_id,
      'usuario_id': localStorage.getItem('usuario_id'),
      'clausula_segunda': watch("clausula_segunda"),
      'clausula_decima': watch("clausula_decima"),
    }

    valor[type] = watch(type);
    setBlockSave(valor);
  };

  useEffect(() => {
    if (watch("clausula_segunda") != '') {
      setOpen(false);
    } else {
      setOpen(true)
    }

    if (watch("clausula_decima") != '') {
      setOpenDecima(false);
    } else {
      setOpenDecima(true)
    }
  }, [watch('clausula_segunda'), watch("clausula_decima")]);


  const handleCloseTips = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={styles.containerBlock}>
        <div className={styles.headerBlock}>
          {
            perfil === 'Pós-venda' ?
              <h2>Cláusulas contratuais</h2>
              :
              <>
                <h3>Tem alguma exceção de cláusula ou detalhes de bens móveis no Recibo de Sinal?</h3>
                <p className="p1"></p>
              </>
          }
        </div>

        {!checked &&
          <div className=''>
            {arrayForm.map((item, index) => (
              <div key={index} className='mb61'>
                <p className='p1 mb44'>{item.text} <strong className='p1 fw700'>{item.boldText ?? ""}</strong></p>
                <TextArea
                  label={item.label}
                  minRows={2}
                  placeholder={item.placeholder}
                  value={watch(item.register)}
                  {...register(item.register, {
                    // required: errorMsg,
                    onChange: (e) => [setValue(item.register, e.target.value), handleInput(item.register)]
                  })}
                />
                <div style={{ marginTop: 10 }}>
                  {(open && perfil === 'Gerente') && index === 0 && (
                    <Alert
                      className='alert yellow'
                      icon={<FaExclamationCircle size={20} />}
                      onClose={handleCloseTips}
                      //severity={feedbackRestaurar.error ? "error" : "success"}
                      variant="filled"
                      sx={{ width: '100%' }}
                    >
                      Evite atrasos no processo da venda e preencha a <b>cláusula segunda.</b>
                    </Alert>
                  )}
                </div>

                <div style={{ marginTop: 10 }}>
                  {(openDecima && perfil === 'Gerente') && index === 1 && (
                    <Alert
                      className='alert yellow'
                      icon={<FaExclamationCircle size={20} />}
                      onClose={handleCloseTips}
                      //severity={feedbackRestaurar.error ? "error" : "success"}
                      variant="filled"
                      sx={{ width: '100%' }}
                    >
                      Tenha certeza que a <b>cláusula décima</b> consta no Recibo para evitar devolução de venda.
                    </Alert>
                  )}
                </div>
              </div>

            ))}

          </div>}

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

export default Clausula;