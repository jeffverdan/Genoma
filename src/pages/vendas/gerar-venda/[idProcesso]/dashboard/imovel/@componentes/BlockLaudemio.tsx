import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form'
import styles from './BlocksStyles.module.scss'
import SwitchButton from "@/components/SwitchButton";
import InputSelect from '@/components/InputSelect/Index';
import InputText from '@/components/InputText/Index';
import ImovelContext from '@/context/Vendas/ContextBlocks';
import AlertCopyIA from '@/components/AlertIACopy';
//import { laudemiosFamilia, laudemiosIgreja, listQuantLaudemios, tiposLaudemios } from '@/components/Listas';
import useLaudemiosData  from '@/components/ListasNova';
import GetAllList from '@/apis/getAllList';

interface FormValues {
  select: string;
  laudemios: Laudemios[];
}

interface Laudemios {
  tipo_laudemio: string,
  valor_laudemio: string,
  id: number | string,
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


const BlockPage: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, Footer, data }) => {
  const errorMsg = 'Campo obrigatório';
  const [checked, setChecked] = useState(!!data?.laudemios?.[0]);
  const { laudemiosFamilia, laudemiosIgreja, listQuantLaudemios, tiposLaudemios } = useLaudemiosData();
  const {
    setDataSave, selectItem
  } = useContext(ImovelContext);

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
      select: data?.laudemios?.length.toString() ?? '1',
      laudemios: data?.laudemios?.length > 0 ? data?.laudemios : [{ tipo_laudemio: '', valor_laudemio: '', id: '' }],
    }
  });

  const handleClick = (direction: string) => {

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

  const handleQuantLaudemios = (quant: number) => {
    const newArray = []
    const oldArray = watch('laudemios');
    for (let i = 0; i < quant; i++) {
      if (oldArray[i]) newArray.push(oldArray[i])
      else newArray.push({ tipo_laudemio: '', valor_laudemio: '', id: '' })
    }
    setValue('laudemios', newArray);
    scrollingArea(newArray.length);
    saveData()
  };

  // CONTROLA O TAMANHO DA TELA PARA NÃO BUGAR O SCROLL
  useEffect(() => {
    if (!checked) {
      setValue('laudemios', [{ tipo_laudemio: '', valor_laudemio: '', id: '' }]);
      saveData();
    }

    setTimeout(() => {
      scrollingArea(watch('laudemios').length);
    }, 10)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  function handleScrollTo() {
    //FORÇA A MANTER POSIÇÃO AO TROCAR O SWITCH
    const $section = document.querySelector(`[data-scroll="${index}"]`);
    if (!$section) return;
    $section.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  function scrollingArea(length?: number) {
    //AJUSTA O TAMANHO DO BLOCK NO CAROUSEL
    const div = document.getElementsByClassName('slick-active')[0] || '';
    const container = document.getElementById('carouselContainer') as HTMLElement;
    if (div) {
      if (div.getAttribute('data-index') !== '3') return ''
      else {
        if (length === 1) container.style.height = '790px'
        else if (length === 2) container.style.height = '890px'
        else if (length === 3) container.style.height = '990px'
        else if (length === 4) container.style.height = '1090px'
        handleScrollTo()
      }
    }
  };

  const saveData = () => {
    let valor: any = {
      'bloco': index,
      'processo_id': data.processo_id,
      'usuario_id': localStorage.getItem('usuario_id'),
      'laudemios': watch("laudemios"),
    }
    setDataSave(valor);

    if (watch("laudemios").some((item: any) => item.tipo_laudemio === "2")) {
      localStorage.setItem('laudemio_tips', 'true');
      console.log("Salvando 'true' em 'laudemio_tips'");
    } else {
      localStorage.setItem('laudemio_tips', 'false');

    }
    //console.log('não salvo');
  };

  // logica para tips aparecer sem recarregar 
  //   useEffect(() => {

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [watch("laudemios")])

  return (
    <>
      <div className={styles.containerBlock} >
        <div className={styles.headerBlock}>
          <h3>O imóvel tem laudêmio?</h3>
          <p className="p1">Ative o botão abaixo se o imóvel possuir laudêmio.</p>
          <AlertCopyIA />
        </div>

        <div className="mt36 mb51">
          <SwitchButton width={'276px'} check={checked} setCheck={setChecked} label='Sim, o imóvel tem laudêmio.' />
        </div>

        {checked &&
          <div className=''>
            <InputSelect
              label={'De quantos laudêmios estamos falando?*'}
              value={watch('select')}
              option={listQuantLaudemios}
              error={errors.select ? true : false}
              msgError={errors.select}
              sucess={!errors.select && watch('select') !== '0'}
              {...register('select', {
                required: errorMsg,
                validate: (value) => {
                  if (value === '0') {
                    return errorMsg;
                  }
                },
                onChange: (e) => handleQuantLaudemios(Number(e.target.value))
              })} />

            {watch('select') !== "0" &&
              watch('laudemios').map((item, index) => (
                <div key={index}>
                  {/* TIPO LAUDEMIO */}
                  <div className={styles.containerLaudemios} >
                    <InputSelect
                      label='Selecione o tipo de laudêmio*'
                      value={item.tipo_laudemio || '0'}
                      option={tiposLaudemios}
                      error={!!errors?.laudemios?.[index]?.tipo_laudemio}
                      msgError={errors?.laudemios?.[index]?.tipo_laudemio}
                      sucess={!errors?.laudemios?.[index]?.tipo_laudemio && watch(`laudemios.${index}.tipo_laudemio`) !== ''}
                      {...register(`laudemios.${index}.tipo_laudemio`, {
                        required: errorMsg,
                        validate: (value) => {
                          if (value === '0') {
                            return errorMsg;
                          }
                        },
                        onChange: () => [saveData()],
                      })} />

                    <div className='ml16'>
                      {/* LAUDEMIO === UNIÃO */}
                      {item.tipo_laudemio === '1' &&
                        <InputText
                          label='Insira o RIP referente ao laudêmio*'
                          placeholder='9999.99999.999-9'
                          error={!!errors?.laudemios?.[index]?.valor_laudemio}
                          value={item.valor_laudemio || ''}
                          msgError={errors?.laudemios?.[index]?.valor_laudemio}
                          sucess={!errors?.laudemios?.[index]?.valor_laudemio && watch(`laudemios.${index}.valor_laudemio`) !== ''}
                          {...register(`laudemios.${index}.valor_laudemio`, {
                            required: errorMsg,
                            validate: (value) => {
                              if (value === '0') {
                                return errorMsg;
                              }
                            },
                            onChange: saveData,
                          })} />}

                      {/* LAUDEMIO === FAMÍLIA */}
                      {item.tipo_laudemio === '3' &&
                        <InputSelect
                          label='Selecione a família referente ao laudêmio*'
                          error={!!errors?.laudemios?.[index]?.valor_laudemio}
                          option={laudemiosFamilia}
                          value={item.valor_laudemio || '0'}
                          msgError={errors?.laudemios?.[index]?.valor_laudemio}
                          sucess={!errors?.laudemios?.[index]?.valor_laudemio && watch(`laudemios.${index}.valor_laudemio`) !== ''}
                          {...register(`laudemios.${index}.valor_laudemio`, {
                            required: errorMsg,
                            validate: (value) => {
                              if (value === '0') {
                                return errorMsg;
                              }
                            },
                            onChange: saveData,
                          })} />}

                      {/* LAUDEMIO === IGREJA */}
                      {item.tipo_laudemio === '4' &&
                        <InputSelect
                          label='Selecione a igreja referente ao laudêmio*'
                          error={!!errors?.laudemios?.[index]?.valor_laudemio}
                          option={laudemiosIgreja}
                          value={item.valor_laudemio || '0'}
                          msgError={errors?.laudemios?.[index]?.valor_laudemio}
                          sucess={!errors?.laudemios?.[index]?.valor_laudemio && watch(`laudemios.${index}.valor_laudemio`) !== ''}
                          {...register(`laudemios.${index}.valor_laudemio`, {
                            required: errorMsg,
                            validate: (value) => {
                              if (value === '0') {
                                return errorMsg;
                              }
                            },
                            onChange: saveData,
                          })} />}
                    </div>

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