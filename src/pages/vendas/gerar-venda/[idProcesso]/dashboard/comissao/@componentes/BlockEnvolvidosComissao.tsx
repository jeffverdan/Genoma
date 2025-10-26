import React, { useEffect, useState, useContext } from 'react';
import { FieldErrors, useForm } from 'react-hook-form'
import ComissaoContext from '@/context/Vendas/ContextBlocks';
import InputText from '@/components/InputText/Index';
import formatoMoeda from '@/functions/formatoMoeda';
import { Check, Percent } from '@mui/icons-material';
import InputSelect from '@/components/InputSelect/Index';
import { comissaoEnvolvidos } from '@/interfaces/Imovel/comissao';
import { Autocomplete, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, ListSubheader, TextField } from '@mui/material';
import ButtonComponent from '@/components/ButtonComponent';
import { PencilIcon } from '@heroicons/react/24/solid';
import SimpleDialog from '@/components/Dialog';
import RadioGroup from '@/components/RadioGroup';
import cnpjMask from '@/functions/cnpjMask';
import cpfMask from '@/functions/cpfMask';
import InputAutoComplete from '@/components/InputAutoComplete';
import getListGerentes from '@/apis/getListGerentes';
import getListOpcionistas from '@/apis/getListOpcionistas';
import validarCPF from '@/functions/validarCPF';
import validarCNPJ from '@/functions/validarCNPJ';
import { useRouter } from 'next/router';
import { useRadioLaudo } from '@/functions/tipoLaudoOpcionista';
import SwitchWithLabel from '@/components/SwitchButton';

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
  comissaoAgent: 'comissao_gerente_gerais' | 'comissao_gerentes' | 'corretores_opicionistas_comissao' | 'corretores_vendedores_comissao' | ''
};

type FormTypes = {
  bloco: number
  quantidade_agents?: string
  porcentagem_comissao_gerente_gerais?: string
  porcentagem_comissao_gerentes?: string
  porcentagem_corretores_opicionistas_comissao?: string
  porcentagem_corretores_vendedores_comissao?: string

  comissao_gerente_gerais?: comissaoEnvolvidos[]
  comissao_gerentes?: comissaoEnvolvidos[]
  corretores_opicionistas_comissao?: comissaoEnvolvidos[]
  corretores_vendedores_comissao?: comissaoEnvolvidos[]
  tipo_laudo_opcionista?: string
}

type Options = {
  value: string;
  disabled: boolean;
  label: string;
  checked: boolean;
  width?: string;
  percent?: number;
};

const BlockPage: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer, comissaoAgent }) => {
  const {
    setDataSave,
    saveBlocks,
    dataProcesso,
    listChavesPix,
    listBancos,
    listGerentes,
    listOpcionistas,
    selectItem
  } = useContext(ComissaoContext);

  const errorMsg = 'Campo obrigatório';

  const [editPagamento, setEditPagamento] = useState({
    index: -1,
    open: false
  });

  const limitQuantAgents = (limit: number) => {
    const array = [
      { id: '', name: 'Selecione' },
    ]
    for (let i = 1; i <= limit; i++) {
      array.push({ id: `${i}`, name: `${i}` });
    }
    return array
  }

  const [listQuantAgents, setListQuantAgents] = useState(() => {
    return limitQuantAgents(4);
  });

  const [check, setCheck] = useState({
    comissao_gerente_gerais: true,
  });

  const returnLabel = (patch: string) => {
    switch (patch) {
      case 'comissao_gerente_gerais':
        return { singular: 'Gerente Geral', plural: 'Gerentes Gerais' }
      case 'comissao_gerentes':
        return { singular: 'Gerente', plural: 'Gerentes' }
      case 'corretores_vendedores_comissao':
        return { singular: 'Corretor Vendedor', plural: 'Corretores Vendedores' }
      case 'corretores_opicionistas_comissao':
        return { singular: 'Corretor Opcionista', plural: 'Corretores Opcionistas' }
      default:
        return { singular: '', plural: '' }
    }
  }

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
    clearErrors,
    setError
  } = useForm<FormTypes>({
    defaultValues: {
      [comissaoAgent ? `porcentagem_${comissaoAgent}` : '']: comissaoAgent ? dataProcesso?.comissao?.[`porcentagem_${comissaoAgent}`] : '',
      quantidade_agents: comissaoAgent ? dataProcesso?.comissao?.[comissaoAgent]?.length || 1 : '',
      [comissaoAgent || '']: comissaoAgent ? dataProcesso?.comissao?.[comissaoAgent] : [{ id: '', name: '' }],
    }
  });

  useEffect(() => {
    if (selectItem === index) {
      console.log("Form: ", watch());
      console.log("Errors: ", errors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch(), errors])

  // const [radioLaudo, setRadioLaudo] = useState<Options[]>([
  //   { value: 'simples', disabled: false, label: 'Simples', checked: false, percent: 16 },
  //   { value: 'com_chave', disabled: false, label: 'Com chave', checked: false, percent: 18 },
  //   { value: 'exclusividade', disabled: false, label: 'Exclusividade', checked: false, percent: 20 },
  //   { value: 'lançamento', disabled: false, label: 'Lançamento', checked: false, percent: 8 },
  // ]);
  const [radioLaudo, setRadioLaudo] = useRadioLaudo();

  useEffect(() => {
    if (comissaoAgent === 'corretores_opicionistas_comissao') {
      radioLaudo.forEach((e) => {
        if (e.value === watch(`porcentagem_${comissaoAgent}`)) e.checked = true
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (comissaoAgent === 'corretores_opicionistas_comissao') {
      handlePorcentagem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comissaoAgent])

  useEffect(() => {
    if (radioLaudo.some(e => e.checked) && comissaoAgent) {
      setValue(`porcentagem_${comissaoAgent}`, radioLaudo.find(e => e.checked)?.percent?.toString());
      setValue(`tipo_laudo_opcionista`, radioLaudo.find(e => e.checked)?.value);
      clearErrors(`porcentagem_${comissaoAgent}`)
      setDataSave({ ...watch() });
      //watch();
      handlePorcentagem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radioLaudo]);

  const returnLists = async () => {
    if (comissaoAgent) {
      if (!dataProcesso?.comissao?.[comissaoAgent] || dataProcesso?.comissao?.[comissaoAgent]?.length === 0) {
        setValue(`${comissaoAgent}`, [{
          id: '',
          name: '',
          tipo_pagamento: 'pix',
          tipo_pessoa: 'PF'
        }])
      } else {
        setValue('quantidade_agents', dataProcesso?.comissao?.[comissaoAgent].length)
      }

      dataProcesso?.comissao?.[comissaoAgent]?.forEach((agent: comissaoEnvolvidos, index_value: number) => {
        const newValue = { usuario_id: Number(agent.usuario_id), label: agent.name || '' };
        if (!agent.tipo_pagamento) setValue(`${comissaoAgent}.${index_value}.tipo_pagamento`, 'pix');
        if (!agent.tipo_pessoa) setValue(`${comissaoAgent}.${index_value}.tipo_pessoa`, 'PF');
        setValue(`${comissaoAgent}.${index_value}`, agent);
        setValue(`${comissaoAgent}.${index_value}.value_autocomplete`, newValue);
      })
      handlePorcentagem();
    }
  };

  useEffect(() => {
    returnLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProcesso])

  const router = useRouter();
  const urlParam = router.query;

  const handleClick = (direction: string) => {
    if (direction === 'NEXT') {
      if (index === 5) {
        saveBlocks && saveBlocks()
        router.push('/vendas/gerar-venda/' + urlParam.idProcesso + '/dashboard');
      } else {
        handleNextBlock(index);
        handlePorcentagem();
      }
    } else {
      handlePrevBlock(index);
    }
  };

  const validatePercents = (e: number) => {
    if (e < 0) return 0
    else if (e > 100) return 100
    else return e
  };

  const handleMaisQuant = () => {
    setListQuantAgents(limitQuantAgents(listQuantAgents.length * 2))
    setValue('quantidade_agents', '');
  };

  const handleQuant = (e: any) => {
    const value = e?.target?.value;
    setValue('quantidade_agents', value || '');

    const arry = comissaoAgent ? watch(comissaoAgent) : [];

    if (Number(value) > Number(arry?.length)) {
      for (let i = Number(arry?.length); i < Number(value); i++) {
        arry?.push({ id: '', name: '', tipo_pagamento: 'pix', tipo_pessoa: 'PF' });
      }
    } else {
      for (let i = Number(value); i <= Number(arry?.length); i++) {
        arry?.pop();
      }
    }

    if (comissaoAgent) setValue(comissaoAgent, arry);
  };

  const handleAutoComplete = (e: any, value: any, index_gg: number) => {
    if (comissaoAgent) {
      clearErrors(`${comissaoAgent}.${index_gg}.value_autocomplete`);
      const data: any = listOpcionistas?.find((e: any) => e.usuario_id === value?.usuario_id);

      setValue(`${comissaoAgent}.${index_gg}`, {
        ...watch(`${comissaoAgent}.${index_gg}`),
        ...data,
        tipo_pagamento: data?.tipo_pagamento || 'pix',
        tipo_pessoa: data?.tipo_pessoa || 'PF',
      });

      if (value) {
        setValue(`${comissaoAgent}.${index_gg}.usuario_id`, value?.usuario_id || "");
        setValue(`${comissaoAgent}.${index_gg}.name`, typeof e === 'string' ? e : value?.label || "");
        setValue(`${comissaoAgent}.${index_gg}.value_autocomplete`, value || { usuario_id: '', label: typeof e === 'string' ? e : '' });
        setDataSave({ ...watch() });
      } else {
        setValue(`${comissaoAgent}.${index_gg}.value_autocomplete`, value || { usuario_id: '', label: '' });
      }
    }
  };

  const handlePorcentagem = () => {
    if (comissaoAgent) {
      watch(comissaoAgent)?.forEach((agent: comissaoEnvolvidos, index_value: number) => {
        const value = Number(watch(`${comissaoAgent}.${index_value}.porcentagem_comissao`));
        const valueTotal = Number(watch(`porcentagem_${comissaoAgent}`));
        const comissaoLiquida = dataProcesso?.comissao?.valor_comissao_liquida?.replace(/[R$.]+/g, '').replace(",", ".");
        if (value && comissaoLiquida && valueTotal) {
          const valorReal = (((comissaoLiquida * valueTotal) / 100) * value) / 100;
          setValue(`${comissaoAgent}.${index_value}.valor_real`, (valorReal.toFixed(2)).replace('.', ','));
        } else {
          setValue(`${comissaoAgent}.${index_value}.valor_real`, '0,00');
        }
      })
    }
  };

  const dividirPercent = () => {
    if (comissaoAgent) {
      watch(comissaoAgent)?.forEach((e, index_agent) => {
        const newValue = index_agent + 1 === watch(comissaoAgent)?.length
          ? Math.ceil(100 / Number(watch('quantidade_agents')))
          : Math.floor(100 / Number(watch('quantidade_agents')))
        setValue(`${comissaoAgent}.${index_agent}.porcentagem_comissao`, newValue.toString());
        clearErrors(`${comissaoAgent}.${index_agent}.porcentagem_comissao`)
      })
      handlePorcentagem();
    }
  };

  const funcOpenEditPagamento = (index_gg: number) => {
    setEditPagamento({ index: index_gg, open: true });
  };

  // DIALOG FUNCTIONS
  const handleCloseEditPagamento = () => {
    setEditPagamento({ index: -1, open: false });
  };

  const handleSaveEditPagamento = () => {
    saveBlocks && saveBlocks();
    setEditPagamento({ index: -1, open: false });
  };

  const [pessoaPagamento, setPessoaPagamento] = useState([
    { value: 'PF', disabled: false, label: 'Pessoa física', checked: false },
    { value: 'PJ', disabled: false, label: 'Pessoa jurídica', checked: false }
  ]);

  const [tipoPagamento, setTipoPagamento] = useState([
    { value: 'pix', disabled: false, label: 'Pix', checked: false },
    { value: 'banco', disabled: false, label: 'Banco', checked: false }
  ]);

  const handleSelectBanco = (e: string) => {
    if (comissaoAgent && editPagamento.index >= 0) {
      setValue(`${comissaoAgent}.${editPagamento.index}.banco_id`, e)
      setValue(`${comissaoAgent}.${editPagamento.index}.nome_banco`, listBancos?.find((banco: any) => banco.id === e)?.nome);
    }
  }

  const msgCPF = "Numero do CPF inválido";
  const msgCNPJ = "Numero do CNPJ inválido";
  const handleBlurCPF_CNPJ = (type: "cpf" | "cnpj") => {
    if (comissaoAgent && editPagamento.index >= 0) {
      if (type === 'cpf') {
        if (!watch(`${comissaoAgent}.${editPagamento.index}.cpf`)) clearErrors(`${comissaoAgent}.${editPagamento.index}.cpf`)
        else {
          validarCPF(watch(`${comissaoAgent}.${editPagamento.index}.cpf`))
            ? clearErrors(`${comissaoAgent}.${editPagamento.index}.cpf`)
            : setError(`${comissaoAgent}.${editPagamento.index}.cpf`, { type: "validate", message: msgCPF })
        }
      } else {
        if (!watch(`${comissaoAgent}.${editPagamento.index}.cnpj`)) clearErrors(`${comissaoAgent}.${editPagamento.index}.cnpj`)
        else {
          validarCNPJ(watch(`${comissaoAgent}.${editPagamento.index}.cnpj`))
            ? clearErrors(`${comissaoAgent}.${editPagamento.index}.cnpj`)
            : setError(`${comissaoAgent}.${editPagamento.index}.cnpj`, { type: "validate", message: msgCNPJ })
        }
      }
      setDataSave({ ...watch() })
    }
  };

  const handleBlurPixCPF_CNPJ = () => {

    if (comissaoAgent && editPagamento.index >= 0) {
      const value = watch(`${comissaoAgent}.${editPagamento.index}.pix`) || '';

      if (Number(watch(`${comissaoAgent}.${editPagamento.index}.tipo_chave_pix_id`)) === 1
        && watch(`${comissaoAgent}.${editPagamento.index}.pix`)) {

        const type = value?.length <= 14 ? 'cpf' : ' cnpj';
        let isValid: any = true
        if (type === 'cpf') {
          isValid = validarCPF(watch(`${comissaoAgent}.${editPagamento.index}.pix`));
        } else {
          isValid = validarCNPJ(watch(`${comissaoAgent}.${editPagamento.index}.pix`));
        }
        isValid
          ? clearErrors(`${comissaoAgent}.${editPagamento.index}.pix`)
          : setError(`${comissaoAgent}.${editPagamento.index}.pix`, { type: "validate", message: type === 'cpf' ? msgCPF : msgCNPJ })

      } else {
        clearErrors(`${comissaoAgent}.${editPagamento.index}.pix`);
      }
      setDataSave({ ...watch() })
    }
  };

  const handleBlurTipoChave = (e: string) => {
    if (comissaoAgent && editPagamento.index >= 0) {
      setValue(`${comissaoAgent}.${editPagamento.index}.tipo_chave_pix_id`, e);

      if (Number(e) === 1) {
        handleBlurPixCPF_CNPJ()
      } else {
        clearErrors(`${comissaoAgent}.${editPagamento.index}.pix`);
      }
      setDataSave({ ...watch() });
    }
  };

  const dialogFormError = (e: FieldErrors<FormTypes>) => {
    if (comissaoAgent && editPagamento.index >= 0) {
      const pix = e?.[comissaoAgent]?.[editPagamento.index]?.pix;
      const cpf = e?.[comissaoAgent]?.[editPagamento.index]?.cpf;
      const cnpj = e?.[comissaoAgent]?.[editPagamento.index]?.cnpj;
      if (cpf || pix || cnpj) return ''
      else handleSaveEditPagamento();
    }
  };

  const checkBlocoDisabled = () => {
    if (comissaoAgent && !check[comissaoAgent as keyof typeof check] && watch(comissaoAgent)?.length === 0) {
      return false
    }
    return true;
  };

  return (
    comissaoAgent ?
      <>
        <div>
          <div className="block_agent">
            {!!watch(comissaoAgent) && !!watch(`${comissaoAgent}.1`) ?
              <h1>Sobre a comissão dos {returnLabel(comissaoAgent).plural}:</h1>
              :
              <h1>Sobre a comissão do {returnLabel(comissaoAgent).singular}:</h1>
            }

            {(comissaoAgent === 'comissao_gerente_gerais') &&
              <SwitchWithLabel
                width={'max-content'}
                label={`Tem ${returnLabel(comissaoAgent).singular}?`}
                check={check[comissaoAgent]}
                setCheck={(value) => {
                  setCheck({ ...check, [comissaoAgent]: value });
                  if (value === false) {
                    setDataSave({ ...watch(), [comissaoAgent]: [], remover_grupo: 1 });
                    setValue('quantidade_agents', '');
                    setValue(comissaoAgent, []);
                  }
                }}
              />
            }

            {comissaoAgent === 'corretores_opicionistas_comissao' &&
              <>
                <p>Tipo de laudo</p>
                <div>
                  <RadioGroup
                    label={''}
                    name={`${comissaoAgent}.0.tipo_laudo_opcionista`}
                    value={watch(`${comissaoAgent}.0.tipo_laudo_opcionista`)}
                    options={radioLaudo}
                    setOptions={setRadioLaudo}
                    setValue={setValue}
                  />
                  {errors?.[`porcentagem_${comissaoAgent}`] && <p className='errorMsg'>*{errors?.[`porcentagem_${comissaoAgent}`]?.message}</p>}
                </div>
              </>}

            {checkBlocoDisabled() &&
              <>
                <div className='flex center gap16'>
                  <InputText
                    label={'Total de comissão*'}
                    placeholder={'Digite apenas numeros'}
                    width='280px'
                    disabled={comissaoAgent === 'corretores_opicionistas_comissao'}
                    type='number'
                    min="0"
                    max="100"
                    error={!!errors[`porcentagem_${comissaoAgent}`]}
                    msgError={errors?.[`porcentagem_${comissaoAgent}`] || undefined}
                    iconBefore={<Percent />}
                    value={watch(`porcentagem_${comissaoAgent}`)}
                    sucess={!errors[`porcentagem_${comissaoAgent}`] && !!watch(`porcentagem_${comissaoAgent}`)}
                    onBlurFunction={() => setDataSave({ ...watch() })}
                    {...register(`porcentagem_${comissaoAgent}`, {
                      required: errorMsg,
                      setValueAs: (e) => validatePercents(e),
                      onChange: () => handlePorcentagem()
                    })}
                  />
                  {watch(comissaoAgent)?.some((agent, index_agent) => errors?.[comissaoAgent]?.[index_agent]?.porcentagem_comissao)
                    && <ButtonComponent size={'medium'} variant={'text'} label={'Você gostaria que realizássemos o cálculo das porcentagens?'} onClick={dividirPercent} />
                  }
                </div>

                <div className='select_quantidade_agents'>
                  <InputSelect
                    label={`Quantos ${returnLabel(comissaoAgent).plural}?*`}
                    value={watch('quantidade_agents')}
                    sucess={!!watch('quantidade_agents')}
                    option={listQuantAgents}
                    onBlurFunction={() => setDataSave({ ...watch() })}
                    {...register('quantidade_agents', {
                      // required: errorMsg,
                      onChange: (e) => handleQuant(e)
                    })}
                    subHeader={<Button type='button' onClick={() => handleMaisQuant()}>Mais...</Button>}
                  />
                </div>

                {watch(comissaoAgent)?.map((gg: comissaoEnvolvidos, index_gg: number) => (
                  <>
                    {index_gg > 0 && <Divider />}
                    <div className='flex gap16' key={index_gg}>
                      <InputAutoComplete
                        options={(comissaoAgent.includes('corretores') ? [...listOpcionistas || [], ...listGerentes || []] : listGerentes) || []}
                        freeSolo={false}
                        label='Nome completo*'
                        placeholder={'Mariana Alves Da Silva'}
                        value={gg.value_autocomplete}
                        index={index_gg}
                        onChange={handleAutoComplete}
                        sucess={!errors[comissaoAgent]?.[index_gg]?.value_autocomplete && !!gg.value_autocomplete?.label}
                        error={!!errors[comissaoAgent]?.[index_gg]?.value_autocomplete}
                        errorMsg={errorMsg}
                        register={register}
                        pathReg={`${comissaoAgent}.${index_gg}.value_autocomplete`}
                      />

                      <InputText
                        label={'Porcentagem*'}
                        placeholder={'Digite apenas numeros'}
                        width='280px'
                        type='number'
                        min="0"
                        max="100"
                        error={!!errors[comissaoAgent]?.[index_gg]?.porcentagem_comissao}
                        msgError={errors[comissaoAgent]?.[index_gg]?.porcentagem_comissao}
                        iconBefore={<Percent />}
                        value={gg.porcentagem_comissao}
                        sucess={!errors[comissaoAgent]?.[index_gg]?.porcentagem_comissao && !!gg.porcentagem_comissao}
                        onBlurFunction={() => setDataSave({ ...watch() })}
                        {...register(`${comissaoAgent}.${index_gg}.porcentagem_comissao`, {
                          required: errorMsg,
                          setValueAs: (e) => validatePercents(e),
                          onChange: () => handlePorcentagem(),
                          validate: {
                            totalTo100: () => {
                              const totalPercent = watch(`${comissaoAgent}`)?.map(agent => Number(agent.porcentagem_comissao) || 0).reduce((acc, value) => acc + value);
                              return totalPercent === 100 || `A soma das porcentagens (${totalPercent}%), não é igual a 100%. `;
                            }
                          }
                        })}
                      />

                      <InputText
                        label={'Valor*'}
                        disabled
                        width='280px'
                        name='valor_real'
                        value={(formatoMoeda(gg.valor_real) || "R$ 0,00")}
                      />

                    </div>
                    <div className='payment_tools'>
                      <ButtonComponent onClick={() => funcOpenEditPagamento(index_gg)} size={'medium'} variant={'text'} label={'Editar pagamento'} startIcon={<PencilIcon width={20} />} />
                      {!!gg.tipo_pagamento && <Chip size='small' label={gg.tipo_pagamento?.toUpperCase()} />}
                      {gg.tipo_pagamento === "pix" ?
                        !!gg.pix && <Chip size='small' label={gg.pix} />
                        :
                        <>
                          {!!gg.nome_banco && <Chip size='small' label={gg.nome_banco?.toUpperCase()} />}
                          {!!gg.agencia && <Chip size='small' label={`AGÊNCIA: ${gg.agencia}`} />}
                          {!!gg.numero_conta && <Chip size='small' label={`CONTA: ${gg.numero_conta}`} />}
                        </>
                      }
                    </div>
                  </>
                ))}
              </>
            }

          </div>

          {Footer &&
            <Footer
              goToPrevSlide={() => handleClick("PREV")}
              goToNextSlide={handleSubmit(() => handleClick("NEXT"))}
              index={index}
              tipo={comissaoAgent === 'corretores_opicionistas_comissao' ? 'last_block' : ''}
            />
          }
        </div>

        {editPagamento.index >= 0 &&
          <SimpleDialog
            open={editPagamento.open}
            onClose={handleCloseEditPagamento}
            title={'Informações de pagamento:'}
            Footer={
              <ButtonComponent
                name='save_pagamento'
                onClick={handleSubmit(() => handleSaveEditPagamento(), (err) => dialogFormError(err))}
                endIcon={<Check />}
                size={'medium'}
                variant={'contained'}
                label={'Salvar'}
                labelColor="white"
              />
            }
            PaperProps={{
              className: 'dialog_save_pagamento'
            }}
          >
            <div className='dialog_content'>
              <h3>{watch(`${comissaoAgent}.${editPagamento.index}.name`)}</h3>
              <RadioGroup
                label={''}
                options={pessoaPagamento}
                setOptions={setPessoaPagamento}
                name={`${comissaoAgent}.${editPagamento.index}.tipo_pessoa`}
                value={watch(`${comissaoAgent}.${editPagamento.index}.tipo_pessoa`)}
                setValue={setValue}
              />

              <div className='flex gap16'>
                {watch(`${comissaoAgent}.${editPagamento.index}.tipo_pessoa`) === 'PJ' &&
                  <InputText
                    label={'CNPJ*'}
                    placeholder={'00.000.000/0001-00'}
                    width='280px'
                    error={!!errors?.[comissaoAgent]?.[editPagamento.index]?.cnpj}
                    msgError={errors?.[comissaoAgent]?.[editPagamento.index]?.cnpj}
                    value={watch(`${comissaoAgent}.${editPagamento.index}.cnpj`)}
                    sucess={!errors?.[comissaoAgent]?.[editPagamento.index]?.cnpj && !!watch(`${comissaoAgent}.${editPagamento.index}.cnpj`)}
                    onBlurFunction={() => handleBlurCPF_CNPJ('cnpj')}
                    {...register(`${comissaoAgent}.${editPagamento.index}.cnpj`, {
                      // required: errorMsg,
                      setValueAs: (e) => e?.length < 19 ? cnpjMask(e) : cnpjMask(e?.slice(0, -1)),
                      validate: (e) => validarCNPJ(e) || msgCNPJ
                    })}
                  />
                }
                {watch(`${comissaoAgent}.${editPagamento.index}.tipo_pessoa`) === 'PF' &&
                  <InputText
                    label={'CPF*'}
                    placeholder={'000.000.000-00'}
                    value={watch(`${comissaoAgent}.${editPagamento.index}.cpf`)}
                    width='280px'
                    error={!!errors?.[comissaoAgent]?.[editPagamento.index]?.cpf}
                    msgError={errors?.[comissaoAgent]?.[editPagamento.index]?.cpf}
                    sucess={!errors?.[comissaoAgent]?.[editPagamento.index]?.cpf && !!watch(`${comissaoAgent}.${editPagamento.index}.cpf`)}
                    onBlurFunction={() => handleBlurCPF_CNPJ('cpf')}
                    {...register(`${comissaoAgent}.${editPagamento.index}.cpf`, {
                      // required: errorMsg,
                      setValueAs: (e) => e?.length < 15 ? cpfMask(e) : cpfMask(e?.slice(0, -1)),
                      validate: (e) => validarCPF(e) || msgCPF
                    })}
                  />
                }

                <InputText
                  label={'CRECI'}
                  placeholder={'1000002016'}
                  width='280px'
                  sucess={!errors?.[comissaoAgent]?.[editPagamento.index]?.creci && !!watch(`${comissaoAgent}.${editPagamento.index}.creci`)}
                  onBlurFunction={() => setDataSave({ ...watch() })}
                  {...register(`${comissaoAgent}.${editPagamento.index}.creci`, {
                    // required: errorMsg,
                    // setValueAs: (e) => cnpjMask(e)
                  })}
                />
              </div>

              <p>Dados bancários</p>
              <RadioGroup
                label={''}
                options={tipoPagamento}
                setOptions={setTipoPagamento}
                name={`${comissaoAgent}.${editPagamento.index}.tipo_pagamento`}
                value={watch(`${comissaoAgent}.${editPagamento.index}.tipo_pagamento`)}
                setValue={setValue}
              />

              {watch(`${comissaoAgent}.${editPagamento.index}.tipo_pagamento`) === 'banco' &&
                <div className='flex gap16'>
                  <div className='select_banco'>
                    <InputSelect
                      label={'Banco'}
                      value={watch(`${comissaoAgent}.${editPagamento.index}.banco_id`)}
                      sucess={!!watch(`${comissaoAgent}.${editPagamento.index}.banco_id`)}
                      option={listBancos}
                      onBlurFunction={() => setDataSave({ ...watch() })}
                      {...register(`${comissaoAgent}.${editPagamento.index}.banco_id`, {
                        // required: errorMsg,
                        onChange: (e) => handleSelectBanco(e.target.value)
                      })}
                    />
                  </div>

                  <InputText
                    label={'Agência'}
                    placeholder={'0000'}
                    width='280px'
                    value={watch(`${comissaoAgent}.${editPagamento.index}.agencia`)}
                    sucess={!!watch(`${comissaoAgent}.${editPagamento.index}.agencia`)}
                    onBlurFunction={() => setDataSave({ ...watch() })}
                    {...register(`${comissaoAgent}.${editPagamento.index}.agencia`, {
                      // required: errorMsg,
                    })}
                  />

                  <InputText
                    label={'Conta'}
                    placeholder={'0000-1'}
                    width='280px'
                    sucess={!errors[comissaoAgent]?.[editPagamento.index]?.numero_conta && !!watch(`${comissaoAgent}.${editPagamento.index}.numero_conta`)}
                    onBlurFunction={() => setDataSave({ ...watch() })}
                    {...register(`${comissaoAgent}.${editPagamento.index}.numero_conta`, {
                      // required: errorMsg,
                    })}
                  />
                </div>
              }
              {watch(`${comissaoAgent}.${editPagamento.index}.tipo_pagamento`) === 'pix' &&
                <div className='flex gap16'>
                  <div className='select_pix'>
                    <InputSelect
                      label={'Tipo de Chave'}
                      value={watch(`${comissaoAgent}.${editPagamento.index}.tipo_chave_pix_id`)}
                      sucess={!!watch(`${comissaoAgent}.${editPagamento.index}.tipo_chave_pix_id`)}
                      option={listChavesPix}
                      {...register(`${comissaoAgent}.${editPagamento.index}.tipo_chave_pix_id`, {
                        // required: errorMsg,
                        onChange: (e) => handleBlurTipoChave(e.target.value)
                      })}
                    />
                  </div>

                  <InputText
                    label={'Chave Pix'}
                    placeholder={''}
                    hidden={watch(`${comissaoAgent}.${editPagamento.index}.tipo_pagamento`) === 'banco'}
                    width='280px'
                    error={!!errors?.[comissaoAgent]?.[editPagamento.index]?.pix}
                    msgError={errors?.[comissaoAgent]?.[editPagamento.index]?.pix}
                    value={watch(`${comissaoAgent}.${editPagamento.index}.pix`)}
                    sucess={!errors[comissaoAgent]?.[editPagamento.index]?.pix && !!watch(`${comissaoAgent}.${editPagamento.index}.pix`)}
                    onBlurFunction={() => handleBlurPixCPF_CNPJ()}
                    {...register(`${comissaoAgent}.${editPagamento.index}.pix`, {
                      // required: errorMsg,
                      setValueAs: (e) => Number(watch(`${comissaoAgent}.${editPagamento.index}.tipo_chave_pix_id`)) === 1 && e
                        ? e.length <= 14 ? cpfMask(e) : e.length < 19 ? cnpjMask(e) : cnpjMask(e.slice(0, -1))
                        : e,
                      validate: (e) => Number(watch(`${comissaoAgent}.${editPagamento.index}.tipo_chave_pix_id`)) === 1 && e
                        ? e.length <= 14 ? validarCPF(e) || msgCPF : validarCNPJ(e) || msgCNPJ
                        : true
                    })}
                  />
                </div>

              }
            </div>

          </SimpleDialog>
        }
      </>
      :
      <>
      </>

  );
};

export default BlockPage;