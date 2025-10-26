import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form'
import styles from './BlocksStyles.module.scss'
import SwitchButton from "@/components/SwitchButton";
import InputSelect from '@/components/InputSelect/Index';
import InputText from '@/components/InputText/Index';
import ImovelContext from '@/context/ImovelContext';

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
  const [checked, setChecked] = useState(data?.laudemios?.length > 0 ?? false);

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

  const listQuantLaudemios = [
    { name: 'Selecione...', id: '0' },
    { name: '1', id: '1' },
    { name: '2', id: '2' },
    { name: '3', id: '3' },
    { name: '4', id: '4' },
  ];

  const laudemiosFamilia = [
    { name: 'Selecione...', id: '0' },
    { "id": 1, name: "Burle de Figueredo", },
    { "id": 4, name: "Ely Jose Machado", },
    { "id": 5, name: "Koening", },
    { "id": 3, name: "Mo\u00e7apyr", },
    { "id": 6, name: "Orleans e Bragan\u00e7a", },
    { "id": 7, name: "Regis de Oliveira", },
    { "id": 2, name: "Silva Porto", },
  ];

  const laudemiosIgreja = [
    { name: 'Selecione...', id: '0' },
    { "id": 8, name: "Mosteiro de S\u00e3o Bento" },
    { "id": 9, name: "Irmandade do Sant\u00edssimo Sacramento da Candel\u00e1ria", },
    { "id": 10, name: "Hospital dos Laz\u00e1ros", },
  ];

  const tiposLaudemios = [
    { name: 'União, Prefeitura, Família ou Igreja', id: '0' },
    { name: 'União', id: '1' },
    { name: 'Prefeitura', id: '2' },
    { name: 'Família', id: '3' },
    { name: 'Igreja', id: '4' },
  ];

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
      'laudemios': watch("laudemios"),
    }
    setDataSave(valor);
  };

  return (
    <>
      <div className={styles.containerBlock} >
        <div className={styles.headerBlock}>
          <h3>O imóvel tem laudêmio?</h3>
          <p className="p1">Ative o botão abaixo se o imóvel possuir laudêmio.</p>
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
              {...register('select', {
                required: errorMsg,
                onChange: (e) => handleQuantLaudemios(Number(e.target.value))
              })} />

            {watch('laudemios').map((item, index) => (
              <div key={index}>
                {/* TIPO LAUDEMIO */}
                <div className={styles.containerLaudemios} >
                  <InputSelect
                    label='Selecione o tipo de laudêmio*'
                    value={item.tipo_laudemio}
                    option={tiposLaudemios}
                    error={!!errors?.laudemios?.[index]?.tipo_laudemio}
                    {...register(`laudemios.${index}.tipo_laudemio`, {
                      required: errorMsg,
                      onChange: () => [saveData(), setValue(`laudemios.${index}.valor_laudemio`, '')],
                    })} />

                  <div className='ml16'>
                    {/* LAUDEMIO === UNIÃO */}
                    {item.tipo_laudemio === '1' &&
                      <InputText
                        label='Insira o RIP referente ao laudêmio*'
                        placeholder='9999.99999.999-9'
                        error={!!errors?.laudemios?.[index]?.valor_laudemio}
                        value={item.valor_laudemio}
                        {...register(`laudemios.${index}.valor_laudemio`, {
                          required: errorMsg,
                          onChange: saveData,
                        })} />}

                    {/* LAUDEMIO === FAMÍLIA */}
                    {item.tipo_laudemio === '3' &&
                      <InputSelect
                        label='Selecione a família referente ao laudêmio*'
                        error={!!errors?.laudemios?.[index]?.valor_laudemio}
                        option={laudemiosFamilia}
                        value={item.valor_laudemio}
                        {...register(`laudemios.${index}.valor_laudemio`, {
                          required: errorMsg,
                          onChange: saveData,
                        })} />}

                    {/* LAUDEMIO === IGREJA */}
                    {item.tipo_laudemio === '4' &&
                      <InputSelect
                        label='Selecione a igreja referente ao laudêmio*'
                        error={!!errors?.laudemios?.[index]?.valor_laudemio}
                        option={laudemiosIgreja}
                        value={item.valor_laudemio}
                        {...register(`laudemios.${index}.valor_laudemio`, {
                          required: errorMsg,
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