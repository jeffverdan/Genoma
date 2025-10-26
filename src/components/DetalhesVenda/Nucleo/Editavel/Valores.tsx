import React, { ChangeEvent, useContext, useState, useEffect } from 'react';
import InputText from "@/components/InputText/Index";
import TextArea from "@/components/TextArea";
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import { FieldErrors, useForm } from 'react-hook-form'
import styles from './BlockStyles.module.scss'
import ImovelContext from '@/context/Vendas/ContextBlocks';
import formatoMoeda from '@/functions/formatoMoeda';
import CheckBox from '@/components/CheckBox';
import { HiCheck, HiExclamation } from 'react-icons/hi';
import { FaExclamationCircle } from 'react-icons/fa';
import ButtonComponent from '@/components/ButtonComponent';

interface FormValues {
  valorAnunciado: string;
  valorVenda: string;
  valorSinal: string;
  formasPagamento: string;
  observacaoPagamento: string;
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

const Valores: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer, handleShow, setBlockSave, saveBlocks, blocksLength }) => {
  const perfil = localStorage.getItem('perfil_login');
  const [checkedAVista, setCheckedAVista] = useState(false);
  const [checkedFinanciamento, setCheckedFinanciamento] = useState(false);
  const [checkedFgts, setCheckedFgts] = useState(false);
  const [checkedConsorcio, setCheckedConsorcio] = useState(false);
  const [checkedParcelamento, setCheckedParcelamento] = useState(false);
  const [checkedPix, setCheckedPix] = useState(false);
  const [open, setOpen] = useState(false);

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
        if (arrayPagamento[i] === '6') setCheckedPix(true);
      }
    };
    verificaFormVenda();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formasDePagamentos = [
    { index: 0, label: "À vista", value: "1", path: "formaPagamento.avista", checked: checkedAVista },
    { index: 1, label: "Financiamento", value: "2", path: "formaPagamento.financiamento", checked: checkedFinanciamento },
    { index: 2, label: "FGTS", value: "3", path: "formaPagamento.fgts", checked: checkedFgts },
    { index: 3, label: "Consórcio", value: "4", path: "formaPagamento.consorcio", checked: checkedConsorcio },
    { index: 4, label: "Parcelamento", value: "5", path: "formaPagamento.parcelamento", checked: checkedParcelamento },
    { index: 5, label: "PIX", value: "6", path: "formaPagamento.pix", checked: checkedPix },
  ];
  const errorMsg = 'Campo obrigatório';

  const {
    register,
    watch,
    setValue,
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

  const handleFormaPagamento = (e: any) => {
    const valueCheckbox = e.target.value;

    if (valueCheckbox === '1') {
      setCheckedAVista(e.target.checked);
    }

    else if (valueCheckbox === '2') {
      setCheckedFinanciamento(e.target.checked);
    }

    else if (valueCheckbox === '3') {
      setCheckedFgts(e.target.checked);
    }

    else if (valueCheckbox === '4') {
      setCheckedConsorcio(e.target.checked);
    }

    else if (valueCheckbox === '5') {
      setCheckedParcelamento(e.target.checked);
    }

    else if (valueCheckbox === '6') {
      setCheckedPix(e.target.checked);
    }

    else {
      //console.log('Nada pode ser selecionado!!!');
    }

    //Validando e passando valor para o campo hidden
    let array = []
    let checkboxes = document.querySelectorAll('input[type=checkbox]:checked')

    for (let i = 0; i < checkboxes.length; i++) {
      array.push((checkboxes[i] as HTMLInputElement).value)
    }

    setValue('formasPagamento', array.join(','));

    const formasPagamento = watch('formasPagamento');

    if (formasPagamento.includes('2') || formasPagamento.includes('3')) {
      console.log('foi');
      localStorage.setItem('formapgt_tips', 'true');

      if (formasPagamento.includes('2') && formasPagamento.includes('3')) {
        localStorage.setItem('tipo_pgamento', 'Financiamento com FGTS');
      } else if (formasPagamento.includes('2')) {
        localStorage.setItem('tipo_pgamento', 'Financiamento');
      } else if (formasPagamento.includes('3')) {
        localStorage.setItem('tipo_pgamento', 'FGTS');
      }

    } else {
      localStorage.setItem('formapgt_tips', 'false');
    }

    if (formasPagamento.includes('3')) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleInput = (type: any, value: string) => {
    if (type !== 'formasPagamento' && type !== 'observacaoPagamento') {
      setValue(type, formatoMoeda(value));
    }
    else {
      clearErrors('formasPagamento');
    }

    let valor: any = {
      'bloco': 4,
      'processo_id': data.processo_id,
      'usuario_id': localStorage.getItem('usuario_id'),
      'valorEstimado': watch('valorAnunciado'),
      'valorVenda': watch('valorVenda'),
      'valorSinal': watch('valorSinal'),
      'forma_pagamento': watch('formasPagamento'),
      'observacaoPagamento': watch('observacaoPagamento'),
    }

    valor[type] = watch(type);
    setBlockSave(valor)
  };


  const handleCloseTips = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={styles.containerBlock}>
        <div className={styles.headerBlock}>
          {
            perfil === 'Pós-venda' ?
              <h2>Valores</h2>
              :
              <>
                <h3>Agora vamos falar sobre valores</h3>
                <p className="p1"></p>
              </>
          }
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
                onChange: () => handleInput('valorAnunciado', watch('valorAnunciado'))
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
                onChange: () => handleInput('valorVenda', watch('valorVenda'))
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
                onChange: () => handleInput('valorSinal', watch('valorSinal'))
              })}
            />
          </div>

          <p className="p1" style={{ margin: '15px 0 20px 0' }}>Qual é a forma de pagamento de quem está comprando?</p>
          <div className="row-f">
            <div className="row-checkbox">
              {formasDePagamentos.map(({ index, label, value, path, checked }) => (
                <CheckBox
                  label={label}
                  value={value}
                  checked={checked}
                  path={path}
                  register={register}
                  key={index}
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
          {(open && perfil === 'Gerente') && (
            <Alert
              className='alert yellow'
              icon={<FaExclamationCircle size={20} />}
              onClose={handleCloseTips}
              variant="filled"
              sx={{ width: '100%' }}
            >
              O comprador não pode ter nenhum imóvel em seu nome caso sua forma de pagamento seja o FGTS.
            </Alert>
          )}
          <div style={{ margin: '50px 0' }}>
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
                onClick={() => handleShow(index, 'voltar')} 
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

export default Valores;