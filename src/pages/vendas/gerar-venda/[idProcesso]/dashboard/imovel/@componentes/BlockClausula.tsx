import React, { useState, useEffect, useContext, Key } from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import { useForm } from 'react-hook-form'
import styles from './BlocksStyles.module.scss'
import TextArea from "@/components/TextArea";
import SwitchButton from "@/components/SwitchButton";
import ImovelContext from '@/context/Vendas/ContextBlocks';
import Alert from '@mui/material/Alert';
import { FaExclamationCircle } from 'react-icons/fa';

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
  }>
};

const BlockPage: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer }) => {
  const errorMsg = 'Campo obrigatório';
  const [checked, setChecked] = useState(false);
  const {
    setDataSave, selectItem
  } = useContext(ImovelContext);
  const [open, setOpen] = useState(true);
  const [openDecima, setOpenDecima] = useState(true);

  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      clausula_segunda: data?.informacao?.excecoes || '',
      clausula_decima: data?.informacao?.bens_moveis || '',
    }
  });

  const handleClick = (direction: string) => {
    if (direction === 'NEXT') {
      handleNextBlock(index);
    } else {
      handlePrevBlock(index);
    }
  };

  //  VAI PRECISAR DESSE CAMPO QUANDO ATIVAR O SWITCH DA PAGE
  // useEffect(() => {   
  //   setTimeout(() => {
  //     scrollingArea();
  //   }, 10)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [checked]);

  // function handleScrollTo(index: number) {
  //   //FORÇA A MANTER POSIÇÃO AO TROCAR O SWITCH
  //   const $section = document.querySelector(`[data-scroll="${index}"]`);
  //   if (!$section) return;
  //   $section.scrollIntoView({ behavior: 'auto', block: 'start' });
  // };

  // function scrollingArea(block?: Element | null) {
  //   //AJUSTA O TAMANHO DO BLOCK NO CAROUSEL
  //   const div = block ? block : document.getElementsByClassName('slick-active')[0] || '';
  //   const container = document.getElementById('carouselContainer') as HTMLElement;
  //   if (div) {
  //     if (div.getAttribute('data-index') !== '4') return ''
  //     else {
  //       const scrollArea = div.scrollHeight + 200;
  //       if (div.scrollHeight > container.clientHeight) container.style.height = scrollArea + 'px'
  //       else container.style.height = '80vh'
  //       handleScrollTo(index)
  //     }
  //   }
  // };

  if (index === selectItem) {
    console.log("Form: ", watch());
    console.log("Error: ", errors);
  };

  const handleInput = (type: any) => {
    let valor: any = {
      'bloco': index,
      'processo_id': data?.processo_id,
      'usuario_id': localStorage.getItem('usuario_id'),
      'clausula_segunda': watch("clausula_segunda"),
      'clausula_decima': watch("clausula_decima"),
    }

    valor[type] = watch(type);
    setDataSave(valor);

    // if (data?.clausula_segunda == 1) {
    //     setOpen(false);
    //   }
  

  };

 console.log(openDecima)
  //const segundaClausulavv = watch("clausula_segunda");

  useEffect(() => {
    // const segundaClausula = data?.clausula_segunda;
    // const decimaClausula = data?.bens_moveis
    // console.log(segundaClausula)
    // if (segundaClausula == 1) {
    //   setOpen(false);
    // }

    // if (decimaClausula != '') {
    //     setOpenDecima(false);
    // }

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
  }, [watch('clausula_segunda'),watch("clausula_decima")]);


  const handleCloseTips = () => {
    setOpen(false);
  };

  const handleCloseTipsDecima = () => {
    setOpenDecima(false);
  };

  return (
    <>
      <div className={styles.containerBlock}>
        <div className={styles.headerBlock}>
          <h3>Tem alguma exceção de cláusula ou detalhes de bens móveis no Recibo de Sinal?</h3>
        </div>

        {/* <div className="mt36 mb51">
          <SwitchButton check={checked} setCheck={setChecked} label='Sim.' />
        </div> */}

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
                  {open && index === 0 && (
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
                  {openDecima && index === 1 && (
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


        {Footer &&
          <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(() => handleClick("NEXT"))} index={index} />}
      </div>
    </>
  );
};

export default BlockPage;