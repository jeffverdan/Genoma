import React, {ChangeEvent, useContext, useState, useEffect} from 'react';
import InputText from "@/components/InputText/Index";
import TextArea from "@/components/TextArea";
import Checkbox from '@mui/material/Checkbox';
import { FieldErrors, useForm } from 'react-hook-form'
import styles from './BlocksStyles.module.scss'
import ImovelContext from '@/context/ImovelContext';
import formatoMoeda from '@/functions/formatoMoeda';
import CheckBox from '@/components/CheckBox';
import { HiExclamation } from 'react-icons/hi';

interface FormValues {
  valorAnunciado: string;
  valorVenda: string;
  valorSinal: string;
  formasPagamento: string;
  observacaoPagamento: string;
}

const arrayForm = [
  // { name: 'Escritura', placeholder: 'Selecione o tipo de escritura', register: 'escritura', require: true },
  // { name: 'Vagas escrituradas', placeholder: 'Quantidade de vagas na garagem', register: 'vagas', require: false },
  // { name: 'Matrícula nº', placeholder: 'Ex.: 1234567', register: 'matricula', require: true },
  // { name: 'Inscrição Municipal', placeholder: 'Ex.: 1234567', register: 'inscricaoMunicipal', require: true },
  // { name: 'RGI', placeholder: 'Ex.: 25', register: 'rgi', require: false },
  // { name: 'Lavrada em', placeholder: 'Ex.: DD/MM/AA', register: 'lavrada', require: false },
  // { name: 'Livro', placeholder: 'Ex.: SC-345', register: 'livro', require: false },
  // { name: 'Folha', placeholder: 'Ex.: 25', register: 'folha', require: false },
  // { name: 'Ato', placeholder: 'Ex.: 3216516', register: 'ato', require: false },
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
  const {
    selectItem, setDataSave,
  } = useContext(ImovelContext);
  
  const [checkedAVista, setCheckedAVista] = useState(false);
  const [checkedFinanciamento, setCheckedFinanciamento] = useState(false);
  const [checkedFgts, setCheckedFgts] = useState(false);
  const [checkedConsorcio, setCheckedConsorcio] = useState(false);
  const [checkedParcelamento, setCheckedParcelamento] = useState(false);
  // const [checkedPix, setCheckedPix] = useState(false);

  useEffect(() => {
    const verificaFormVenda = async () => {
      // Retornar as Formas de Pagamento no Form de Vendas
      let arrayPagamento = null;
      arrayPagamento = data?.informacao?.forma_pagamento !== null ? data?.informacao?.forma_pagamento.split(',') : 0;

      for (let i = 0; i < arrayPagamento?.length; i++) {
          if (arrayPagamento[i] === '1') setCheckedAVista(true);
          if (arrayPagamento[i] === '2') setCheckedFinanciamento(true);
          if (arrayPagamento[i] === '3') setCheckedFgts(true);
          if (arrayPagamento[i] === '4') setCheckedConsorcio(true);
          if (arrayPagamento[i] === '5') setCheckedParcelamento(true);
          // if (arrayPagamento[i] === '6') setCheckedPix(true);
      }
    };
    verificaFormVenda();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formasDePagamentos = [
    { index: 0, label: "À vista", value: "1", path: "formaPagamento.avista",checked: checkedAVista, disabled: checkedConsorcio || checkedFinanciamento ? true : false },
    { index: 1, label: "Financiamento", value: "2", path: "formaPagamento.financiamento", checked: checkedFinanciamento, disabled: checkedConsorcio || checkedAVista ? true : false},
    { index: 2, label: "FGTS", value: "3", path: "formaPagamento.fgts", checked: checkedFgts },
    { index: 3, label: "Consórcio", value: "4", path: "formaPagamento.consorcio", checked: checkedConsorcio, disabled: checkedFinanciamento || checkedAVista ? true : false },
    { index: 4, label: "Parcelamento", value: "5", path: "formaPagamento.parcelamento", checked: checkedParcelamento },
    // { index: 5, label: "PIX", value: "6", path: "formaPagamento.pix", checked: checkedPix },
  ]

  const userName = "Sr. Genoma"
  const errorMsg = 'Campo obrigatório';

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
      valorAnunciado: formatoMoeda(data?.informacao?.valor_anunciado) || '',
      valorVenda: formatoMoeda(data?.informacao?.valor_venda) || '',
      valorSinal: formatoMoeda(data?.informacao?.valorSinal) || '',
      formasPagamento: data?.informacao?.forma_pagamento || '',
      observacaoPagamento: data?.informacao?.observacao_pagamento || ''
    }
  });

  if(index === selectItem) {
    console.log("Form: ", watch());
    console.log("Error: ", errors);
  };

  const handleClick = (direction: string) => {
    if (direction === 'NEXT') {
      handleNextBlock(index);
    } else {
      handlePrevBlock(index);
    }
  };

  const handleFormaPagamento = (e: any) => {
    const valueCheckbox = e.target.value;
    const checked = e.target.checked;

    if (valueCheckbox === '1') {
        setCheckedAVista(checked);
    }

    else if (valueCheckbox === '2') {
        setCheckedFinanciamento(checked);
    }

    else if (valueCheckbox === '3') {
        setCheckedFgts(checked);
    }

    else if (valueCheckbox === '4') {
        setCheckedConsorcio(checked);
    }

    else if (valueCheckbox === '5') {
        setCheckedParcelamento(checked);
    }

    let array = [];
    
    // Verifica quais checkboxes estão selecionados e adiciona ao array
    if (checkedAVista || valueCheckbox === '1' && checked) array.push('1');
    if (checkedFinanciamento || valueCheckbox === '2' && checked) array.push('2');
    if (checkedFgts || valueCheckbox === '3' && checked) array.push('3');
    if (checkedConsorcio || valueCheckbox === '4' && checked) array.push('4');
    if (checkedParcelamento || valueCheckbox === '5' && checked) array.push('5');

    if (!checked) {
      array = array.filter(item => item !== valueCheckbox);
    }

    setValue('formasPagamento', array.join(','));
  }

  const handleInput = (type: any, value: string) => {
    if(type !== 'formasPagamento' && type !== 'observacaoPagamento')
    {
      setValue(type, formatoMoeda(value));
    }
    else{
      clearErrors('formasPagamento');
    }

    let valor: any = {
      'bloco': index,
      'processo_id': data.processo_id,
      'valorEstimado': watch('valorAnunciado'),
      'valorVenda': watch('valorVenda'),
      'valorSinal': watch('valorSinal'),
      'forma_pagamento': watch('formasPagamento'),
      'observacaoPagamento': watch('observacaoPagamento'),
    }

    valor[type] = watch(type);
    setDataSave(valor);
  }

  return (
    <>
      <div className={styles.containerBlock}>
        <div className={styles.headerBlock}>
          <h3>Agora vamos falar sobre valores</h3>
          <p className="p1"></p>
        </div>

        <div className="content">
          <div className="row-f">
            <InputText
                label={'Valor anunciado*'}
                placeholder={'R$ 500.000,00'}
                error={!!errors.valorAnunciado ? true : false}
                msgError={errors.valorAnunciado}
                required={true}
                sucess={!errors.valorAnunciado && !!watch('valorAnunciado')}
                {...register('valorAnunciado', {
                  required: errorMsg,
                  onChange: (e) => handleInput('valorAnunciado', watch('valorAnunciado'))
                })}
            />

            <InputText
              label={'Valor de venda*'}
              placeholder={'R$ 500.000,00'}
              error={!!errors.valorVenda ? true : false}
              msgError={errors.valorVenda}
              required={true}
              sucess={!errors.valorVenda && !!watch('valorVenda')}
              {...register('valorVenda', {
                required: errorMsg,
                onChange: (e) => handleInput('valorVenda', watch('valorVenda'))
              })}
            />

            <InputText
              label={'Valor de sinal*'}
              placeholder={'R$ 500.000,00'}
              error={!!errors.valorSinal ? true : false}
              msgError={errors.valorSinal}
              required={true}
              sucess={!errors.valorSinal && !!watch('valorSinal')}
              {...register('valorSinal', {
                required: errorMsg,
                onChange: (e) => handleInput('valorSinal', watch('valorSinal'))
              })}
            />
          </div>

          <p className="p1" style={{margin: '15px 0 20px 0'}}>Qual é a forma de pagamento de quem está comprando?</p>
          <div className="row-f">
            <div className="row-checkbox">
              {formasDePagamentos.map(({ index, label, value, path, checked, disabled }) => (
                <CheckBox 
                    label={label}
                    value={value}
                    checked={checked}
                    path={path}
                    register={register}
                    key={index}
                    disabled={disabled}
                    {...register('formasPagamento', {
                      required: true,
                      onChange: (e) => [handleFormaPagamento(e), handleInput('formasPagamento', e.target.value)],
                    })}
                  />
                ))}
            </div>
          </div>
          <div className="block-error">
            {
              //Erro do CheckBox
              errors.formasPagamento && <p className="errorMsg"><HiExclamation /> *É preciso selecionar ao menos uma forma de pagamento.</p>
            }
          </div>

          <div style={{margin: '50px 0'}}>
            <TextArea  
              label="Caso necessário, insira observações sobre o pagamento." 
              minRows={2} 
              placeholder="Exemplo: A primeira parte do pagamento será à vista. O restante financiado."
              value={watch('observacaoPagamento')}
              {...register('observacaoPagamento', {
                required: false,
                onChange: (e) => [setValue('observacaoPagamento', e.target.value), handleInput('observacaoPagamento', watch('observacaoPagamento'))]
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