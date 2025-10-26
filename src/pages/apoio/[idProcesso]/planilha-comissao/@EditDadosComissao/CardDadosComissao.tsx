import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form'
import InputText from '@/components/InputText/Index';
import InputSelect from '@/components/InputSelect/Index';
import RadioGroup from "@/components/RadioGroup";
import EmptyTextarea from '@/components/TextArea';
import formatoMoeda from '@/functions/formatoMoeda';
import ButtonComponent from '@/components/ButtonComponent';

type BlockProps = {
  handleNextBlock: (index: number) => void;
  handlePrevBlock: (index: number) => void;  
  data: any;
  Footer: React.FC<{
    goToPrevSlide: (index: number) => void;
    goToNextSlide: any;
    index: number;
  }>
  setDataSave: any
  dataProcesso: any
  selectItem: any
};

const listQuantLaudemios = [
  { name: 'Selecione', id: '' },
  { name: 'Espécie', id: 'especie' },
  { name: 'Depósito', id: 'deposito' },
  { name: 'TED/DOC', id: 'ted_doc' },
  { name: 'PIX', id: 'pix' },
  { name: 'Cheque/Cheque adm.', id: 'cheque' },
];

const listEscrituras = [
  { name: 'Selecione', id: '' },
  { name: 'Na assinatura do Recibo de Sinal', id: '1' },
  { name: 'Na retirada das certidões', id: '2' },
  { name: 'No ato da escritura do imóvel', id: '3' },
  { name: 'Na transferência de registros', id: '4' },
  //{ name: 'Na transferência de registros', id: '5' },
];

const BlockPage: React.FC<BlockProps> = ({ setDataSave, dataProcesso, }) => {
  const errorMsg = 'Campo obrigatório';

  const [options, setOptions] = useState([
    { value: 'integral', disabled: false, label: 'Integral', checked: false },
    { value: 'partes', disabled: false, label: 'Parcelado', checked: false }
  ]);

  const [parcelasOptions] = useState(() => {
    const array = [
      { id: '0', name: 'Selecione' },
    ]
    return array
  });

  const parcelaEmpty = { valor_parcela: '', periodo_pagamento: '', id: '' };

  const {
    register,
    watch,
    setValue,
    setError,
    formState: { errors },
    handleSubmit,
    clearErrors
  } = useForm({
    defaultValues: {
      comissao: 'integral',
      quantidade_parcelas: '1',
      parcelas_empresa: [parcelaEmpty],
      observacoes: '',
      valor_comissao_liquida: '',
      valor_comissao_total: '',
      deducao: '',
      liquida: '' // FORMA DE PAGAMENTO
    }
  });

  useEffect(() => {    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch(), errors])

  useEffect(() => {    
    if (dataProcesso && dataProcesso.comissao.id) {
      setValue('comissao', dataProcesso.comissao.comissao || 'integral');
      setValue('quantidade_parcelas', dataProcesso.comissao.parcelas_empresa?.length || 1);
      setValue('parcelas_empresa', dataProcesso.comissao?.parcelas_empresa?.length > 0 ? dataProcesso.comissao?.parcelas_empresa : [parcelaEmpty]);
      setValue('observacoes', dataProcesso.comissao.observacoes);
      setValue('valor_comissao_liquida', dataProcesso.comissao.valor_comissao_liquida);
      setValue('valor_comissao_total', dataProcesso.comissao.valor_comissao_total);
      setValue('deducao', dataProcesso.comissao.deducao);
      setValue('liquida', dataProcesso.comissao.liquida || '');
      
      if (!dataProcesso.comissao?.parcelas_empresa || dataProcesso.comissao?.parcelas_empresa?.length <= 1) {
        setValue('parcelas_empresa.0.valor_parcela', dataProcesso.comissao.valor_comissao_liquida || '')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQuantParcelas = (parcelas: number) => {
    let parcelasArray = [parcelaEmpty];

    for (let i = 1; i < parcelas; i++) {
      parcelasArray.push(parcelaEmpty);
    };

    if (parcelasArray.length === 1) {
      setValue('parcelas_empresa.0.valor_parcela', watch('valor_comissao_liquida'))
    }

    setValue('parcelas_empresa', parcelasArray.map((parcela, i) => {
      parcela = watch(`parcelas_empresa.${i}`)
      return parcela
    }))
  };

  const formatNumber = (value: string) => {
    return Number((value.replace(/[R$.]+/g, '')).replace(",", "."));
  };

  const handleComissao = () => {
    const comissaoTotal = formatNumber(watch('valor_comissao_total'));
    const deducao = formatNumber(watch('deducao'));
    if(comissaoTotal > deducao) {
      clearErrors('deducao');
      const comissaoLiquida = formatoMoeda(((comissaoTotal - deducao) * 100).toString());
      if(watch('comissao') === 'integral') setValue('parcelas_empresa.0.valor_parcela', comissaoLiquida);
      setValue('valor_comissao_liquida', comissaoLiquida);
      dataProcesso.comissao.valor_comissao_liquida = comissaoLiquida;
      setDataSave({ ...watch() });
    } else {
      setError('deducao', { type: "validate", message: "Deducação deve ser menor que comissão total" });
      if(watch('comissao') === 'integral') setValue('parcelas_empresa.0.valor_parcela', '');
      setValue('valor_comissao_liquida', '');
      dataProcesso.comissao.valor_comissao_liquida = '';
    }
  };

  const handleRadioParcela = (e: string) => {
    if (e === 'integral') setValue('parcelas_empresa', [watch('parcelas_empresa.0')])
    else setValue('quantidade_parcelas', `${watch('parcelas_empresa').length}`)
    setDataSave({ ...watch() });
  };

  const validateParcelasToLiquida = () => {
    const comissaoTotal = Number((watch('valor_comissao_total').replace(/[R$.]+/g, '')).replace(",", "."));
    const deducao = Number((watch('deducao').replace(/[R$.]+/g, '')).replace(",", "."));
    const comissaoLiquida = (comissaoTotal - deducao);
    const totalParcelas = watch('parcelas_empresa').map(parcela =>
      Number((parcela.valor_parcela.replace(/[R$.]+/g, '')).replace(",", "."))
    ).reduce((acc, value) => acc + value);    

    const result = totalParcelas - comissaoLiquida === 0;
    if (result) {
      clearErrors()
      // watch('parcelas_empresa')?.forEach((parcela, index_parcela) => {
      //   clearErrors(`parcelas_empresa.${index_parcela}.valor_parcela`);
      // });
    };

    return result;
  };

  const onBlurFunctionParcelas = () => {
    setDataSave({ ...watch() });
  };

  const dividirValorTotal = () => {
    const comissaoTotal = formatNumber(watch('valor_comissao_total'));
    const deducao = formatNumber(watch('deducao'));
    const comissaoLiquida = (comissaoTotal - deducao);
    let parcelaIdeal = (comissaoLiquida / Number(watch('quantidade_parcelas') || 1)).toFixed(2);
    let value = comissaoLiquida;
    
    watch('parcelas_empresa')?.forEach((parcela, index_parcela) => {
      
      const valorParcela = watch('parcelas_empresa').length > index_parcela + 1
      ? formatoMoeda((parcelaIdeal).toString()) 
      : formatoMoeda((value.toFixed(2)).toString())
      
      valorParcela && setValue(`parcelas_empresa.${index_parcela}.valor_parcela`, valorParcela);
      if(value > Number(parcelaIdeal)) value = Number(value - Number(parcelaIdeal));
      
    });

    validateParcelasToLiquida();
  };

  return (
    <>
      <div>
        <div className="block_empresa">
          <h1>Qual é a previsão de comissionamento
            da empresa?</h1>

          <div className='flex gap16'>
            <InputText
              label={'Comissão total*'}
              placeholder={'R$'}
              error={!!errors.valor_comissao_total}
              msgError={errors.valor_comissao_total}
              value={watch('valor_comissao_total')}
              sucess={!errors.valor_comissao_total && !!watch('valor_comissao_total')}
              onBlurFunction={handleComissao}
              {...register('valor_comissao_total', {
                required: errorMsg,
                setValueAs: (e) => formatoMoeda(e),
              })}
            />

            <InputText
              label={'Deduções'}
              placeholder={'R$'}
              error={!!errors.deducao}
              msgError={errors.deducao}
              value={watch('deducao')}
              sucess={!errors.deducao && !!watch('deducao')}
              onBlurFunction={handleComissao}
              {...register('deducao', {
                // required: errorMsg,
                setValueAs: (e) => formatoMoeda(e),
                validate: (e) => formatNumber(e) < formatNumber(watch('valor_comissao_total')) || "Deducação deve ser menor que comissão total"
              })}
            />

            <InputText
              label={'Comissão líquida*'}
              placeholder={'R$'}
              error={!!errors.valor_comissao_liquida}
              disabled
              value={watch('valor_comissao_liquida')}
              sucess={!errors.valor_comissao_liquida && !!watch('valor_comissao_liquida')}
              onBlurFunction={() => setDataSave({ ...watch() })}
              {...register('valor_comissao_liquida', {
                // required: errorMsg,
                setValueAs: (e) => formatoMoeda(e),
                // onChange: (e) => handleComissao()
              })}
            />
          </div>

          <div className='select_pagamento'>
            <InputSelect
              label={'Forma de pagamento*'}
              value={watch('liquida')}
              sucess={!!watch('liquida')}
              msgError={errors.liquida}
              error={!!errors.liquida}
              option={listQuantLaudemios}
              onBlurFunction={() => setDataSave({ ...watch() })}
              {...register('liquida', {
                required: errorMsg,
                onChange: (e) => setValue('liquida', e.target.value)
              })}
            />
          </div>

          <RadioGroup
            value={watch('comissao')}
            name='comissao'
            label=''
            options={options}
            setOptions={setOptions}
            setValue={setValue}
            changeFunction={handleRadioParcela}
          />
          {watch('comissao') === 'partes' &&
            <div className='center flex gap16'>
              <div className='select_parcelas'>
                <InputSelect
                  label={'Quantas parcelas?*'}
                  value={watch('quantidade_parcelas')}
                  option={parcelasOptions}
                  onBlurFunction={() => setDataSave({ ...watch() })}
                  {...register('quantidade_parcelas', {
                    required: errorMsg,
                    onChange: (e) => handleQuantParcelas(Number(e.target.value))
                  })}
                />
              </div>

              {watch('parcelas_empresa')?.some((parcela, index_parcela) => errors?.parcelas_empresa?.[index_parcela]?.valor_parcela) 
                && <ButtonComponent size={'medium'} variant={'text'} label={'Você gostaria que realizássemos o cálculo das parcelas?'} onClick={dividirValorTotal} />
              }
            </div>
          }

          {watch('parcelas_empresa')?.map((parcela, index_parcela) => (
            <div className='flex gap16' key={index_parcela}>
              <div>
                <InputText
                  label={watch('parcelas_empresa').length > 1 ? index_parcela + 1 + 'ª Parcela*' : 'Parcela única*'}
                  placeholder='R$'
                  onBlurFunction={onBlurFunctionParcelas}
                  value={parcela?.valor_parcela}
                  error={!!errors.parcelas_empresa?.[index_parcela]?.valor_parcela}
                  msgError={errors.parcelas_empresa?.[index_parcela]?.valor_parcela}
                  sucess={!errors.parcelas_empresa?.[index_parcela]?.valor_parcela && !!watch(`parcelas_empresa.${index_parcela}.valor_parcela`)}
                  {...register(`parcelas_empresa.${index_parcela}.valor_parcela`, {
                    required: errorMsg,
                    setValueAs: (e) => formatoMoeda(e),
                    validate: () => validateParcelasToLiquida() 
                    || `Soma das parcelas (${formatoMoeda((watch('parcelas_empresa').map(e => Number((e.valor_parcela.replace(/[R$.]+/g, '')).replace(",", ".")) * 100).reduce((acc, value) => acc + value)).toString())}) não correspondem 
                    ao total da comissão liquida. (${watch('valor_comissao_liquida')})`
                  })}
                />
              </div>

              <div className='select_periodo'>
                <InputSelect
                  label={'Periodo de pagamento*'}
                  msgError={errors.parcelas_empresa?.[index_parcela]?.periodo_pagamento}
                  error={!!errors.parcelas_empresa?.[index_parcela]?.periodo_pagamento}
                  option={listEscrituras}
                  sucess={!!parcela?.periodo_pagamento}
                  value={parcela?.periodo_pagamento}
                  onBlurFunction={() => setDataSave({ ...watch() })}
                  {...register(`parcelas_empresa.${index_parcela}.periodo_pagamento`, {
                    required: errorMsg,
                    //   onChange: (e) => handleQuantLaudemios(Number(e.target.value))
                  })}
                />
              </div>
            </div>
          ))}

          { }

          <p>Observações gerais da comissão</p>
          <EmptyTextarea
            minRows={3}
            value={watch('observacoes')}
            label={'Caso necessário, insira observações para que o pós-venda fique atento.'}
            placeholder='Exemplo: A primeira e segunda parcela do pagamento...'
            {...register('observacoes', {
              // required: errorMsg,
              onChange: (e) => setValue('observacoes', e.target.value),
              onBlur: () => setDataSave({ ...watch() })
            })} />

        </div>
      </div>
    </>
  );
};

export default BlockPage;