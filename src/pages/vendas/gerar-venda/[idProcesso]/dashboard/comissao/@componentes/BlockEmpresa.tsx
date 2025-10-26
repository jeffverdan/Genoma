import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form'
import ComissaoContext from '@/context/Vendas/ContextBlocks';
import InputText from '@/components/InputText/Index';
import InputSelect from '@/components/InputSelect/Index';
import formatoMoeda from '@/functions/formatoMoeda';

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

const listQuantLaudemios = [
  { name: 'Selecione', id: '' },
  { name: 'Espécie', id: 'especie' },
  { name: 'Depósito', id: 'deposito' },
  { name: 'TED/DOC', id: 'ted_doc' },
  { name: 'PIX', id: 'pix' },
  { name: 'Cheque/Cheque adm.', id: 'cheque' },
];

const BlockPage: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer }) => {
  const {
    setDataSave, dataProcesso, selectItem,
  } = useContext(ComissaoContext);

  const errorMsg = 'Campo obrigatório';

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
      observacoes: '',
      valor_comissao_liquida: '',
      valor_comissao_total: '',
      deducao: '',
      liquida: '' // FORMA DE PAGAMENTO
    }
  });

  useEffect(() => {
    if (selectItem === index) {
      console.log("Form: ", watch());
      console.log("Errors: ", errors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch(), errors])

  useEffect(() => {

    if (dataProcesso && dataProcesso.comissao.id) {
      setValue('observacoes', dataProcesso.comissao.observacoes);
      setValue('valor_comissao_liquida', dataProcesso.comissao.valor_comissao_liquida);
      setValue('valor_comissao_total', dataProcesso.comissao.valor_comissao_total);
      setValue('deducao', dataProcesso.comissao.deducao);
      setValue('liquida', dataProcesso.comissao.liquida || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = (direction: string) => {
    if (direction === 'NEXT') {
      handleNextBlock(index);
    } else {
      handlePrevBlock(index);
    }
  };

  const formatNumber = (value: string) => {
    return Number((value.replace(/[R$.]+/g, '')).replace(",", "."));
  };

  const handleComissao = () => {
    const comissaoTotal = formatNumber(watch('valor_comissao_total'));
    const deducao = formatNumber(watch('deducao'));
    if (comissaoTotal > deducao) {
      clearErrors('deducao');
      const comissaoLiquida = formatoMoeda(((comissaoTotal - deducao) * 100).toString());      
      setValue('valor_comissao_liquida', comissaoLiquida);
      dataProcesso.comissao.valor_comissao_liquida = comissaoLiquida;
      setDataSave({ ...watch() });
    } else {
      setError('deducao', { type: "validate", message: "Deducação deve ser menor que comissão total" });      
      setValue('valor_comissao_liquida', '');
      dataProcesso.comissao.valor_comissao_liquida = '';
    }
  };

  return (
    <>
      <div>
        {!!watch &&
          <div className="block_empresa">
            <h1>Valor da comissão</h1>

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
          </div>
        }

        {Footer &&
          <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(() => handleClick("NEXT"))} index={index} />}
      </div>
    </>
  );
};

export default BlockPage;