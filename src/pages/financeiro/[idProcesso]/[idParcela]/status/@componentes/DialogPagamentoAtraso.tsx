import React, { useState, useEffect } from 'react';
import ButtonComponent from '@/components/ButtonComponent';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { CheckIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import RadioGroup from '@/components/RadioGroup';
import { useForm } from 'react-hook-form';
import InputText from '@/components/InputText/Index';
import formatoMoeda from '@/functions/formatoMoeda';
import dateMask from '@/functions/dateMask';
import { ArrayResponsaveisPagamentoType } from '@/interfaces/Financeiro/Status';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

type Props = {
  open: boolean
  setOpen: (e: boolean) => void
  onConfirm: (valores: FormValues) => void;
  setOpenSnackbar: (e: boolean) => void;
  responsavelSelecionado: ArrayResponsaveisPagamentoType | null;
}

type FormValues = {
  motivo: string,
  valor_pago: string,
  valor_juros: string,
  valor_multa: string,
  data_pagamento: string,
  data_vencimento: string,
  valor_pago_atrasado?: string,
}

export default function DialogPagamentoAtraso({ open, setOpen, onConfirm, setOpenSnackbar, responsavelSelecionado }: Props) {
  const [options, setOptions] = useState([
    { value: '1', disabled: false, label: 'O boleto foi pago após a data de vencimento.', checked: false },
    { value: '2', disabled: false, label: 'O boleto não está atrasado, foi pago dentro do prazo de vencimento.', checked: false },
  ]);
  const errorMsg = 'Selecione um dos motivos acima para continuar.';
  console.log('responsavelSelecionado', responsavelSelecionado);

  // const calculoJuros = (valor?: string): number => {
  //   const raw = valor ?? responsavelSelecionado?.valor_pagamento ?? '';
  //   if (!raw) return 0;

  //   // Normaliza strings de moeda como "R$ 1.234,56" ou "1234.56" para número JS
  //   let s = String(raw).replace(/\s/g, '').replace(/R\$/g, '');
  //   if (s.includes(',') && s.includes('.')) {
  //     // Ex.: "1.234,56" -> "1234.56"
  //     s = s.replace(/\./g, '').replace(',', '.');
  //   } else if (s.includes(',')) {
  //     // Ex.: "1234,56" -> "1234.56"
  //     s = s.replace(',', '.');
  //   } // caso seja "1234.56" já está ok

  //   const num = parseFloat(s);
  //   if (isNaN(num)) return 0;

  //   // 10% sobre o valor
  //   const juros = +(num * 0.1);

  //   return juros;
  // }

  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      motivo: '',
      valor_pago: responsavelSelecionado?.valor_pagamento || '',
      valor_juros: /*calculoJuros().toFixed(2).replace('.', ',') ||*/ '',
      valor_multa: '',
      data_pagamento: '',
      data_vencimento: responsavelSelecionado?.data_validade || '',
      valor_pago_atrasado: '',
    }
  });

  useEffect(() => {
    // Quando o responsável selecionado mudar (de null para um objeto ou vice-versa),
    // resetamos o formulário com os novos valores.
    reset({
      motivo: '',
      valor_pago: responsavelSelecionado?.valor_pagamento || '',
      data_vencimento: responsavelSelecionado?.data_validade || '',
      // valor_juros: calculoJuros().toFixed(2).replace('.', ',') || '',
      // Manter os outros campos limpos na reinicialização
    });
  }, [responsavelSelecionado, reset]);

  const handleClose = () => {
    setOpen(false);
    setValue('motivo', '');
    setValue('valor_pago', '');
    setValue('valor_juros', '');
    setValue('valor_multa', '');
    setValue('data_pagamento', '');
    setValue('valor_pago_atrasado', '');
    clearErrors();
  };

  const handleConfirm = async () => {
    onConfirm(watch());
    setOpenSnackbar(true);
    handleClose();
  }

  console.log('Watch', watch());

  const validarBtn = () => {
    let validar = true;
    if(watch('motivo') === '1' 
      && watch('valor_pago') !== ''
      && watch('valor_juros') !== ''
      && watch('valor_multa') !== ''
      && watch('data_pagamento')?.length === 10
    ) {
        validar = false;
    }
    return validar; 
  }

  const calcularValorBoletoAtrasado = () => {
    const normalizeToCents = (v?: string): number => {
      if (!v) return 0;
      // Remove prefixos e espaços
      let s = String(v).trim().replace(/\s/g, '').replace(/R\$/g, '');
      // Remove separador de milhar e padroniza decimal para ponto
      s = s.replace(/\./g, '').replace(',', '.');
      // Mantém apenas dígitos, ponto e sinal
      s = s.replace(/[^0-9.-]/g, '');
      const n = parseFloat(s);
      if (isNaN(n)) return 0;
      // Retorna em centavos como inteiro (evita problemas de float)
      return Math.round(n * 100);
    };

    const valorPagoCents = normalizeToCents(watch('valor_pago'));
    const valorJurosCents = normalizeToCents(watch('valor_juros'));
    const valorMultaCents = normalizeToCents(watch('valor_multa'));

    const totalCents = valorPagoCents + valorJurosCents + valorMultaCents;
    const total = totalCents / 100;

    // Formata em BRL de forma segura
    setValue('valor_pago_atrasado', Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total))
    // return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
  }

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="sm"
        fullWidth={true}
        className='modal-feedback-pagamento-atraso'
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>

        {
          watch('motivo') === '2' || watch('motivo') === '' 
          ? 
            <DialogContent dividers className='content'>
              <h2>Qual foi o valor pago?</h2>
              <p>Precisamos entender o motivo do atraso do pagamento</p>
              <h3>Selecione o motivo</h3>

              <div className='mt44 mb44 check-list'>
                <RadioGroup
                    {...register('motivo', {
                        required: errorMsg,
                    })}
                    value={watch('motivo')}
                    name='motivo'
                    label=''
                    options={options}
                    setOptions={setOptions}
                    setValue={setValue}
                />
              </div>
            </DialogContent>
          :
            <DialogContent dividers className='content'>
              <h2>Qual foi o valor pago?</h2>
              <p>Precisamos saber qual foi o valor pago, a multa e juros aplicados.</p>   

              <div className="input-group">
                <div className="row row-text">
                  <div className="label">Valor do boleto</div>
                  <div className="valor">{watch('valor_pago') || 'R$ 0,00'}</div>
                </div>  

                <div className="row row-text">
                  <div className="label">Data de vencimento</div>
                  <div className="valor">{watch('data_vencimento')}</div>
                </div>  
              </div>

              <div className="input-group">
                <div className="row">
                  <InputText 
                    label="Juros"
                    placeholder="R$ 0,00"
                    msgError={errors.valor_juros}
                    error={!!errors.valor_juros?.message}
                    sucess={!!watch('valor_juros')}
                    value={watch('valor_juros')}
                    {...register('valor_juros', {
                        required: 'Valor é obrigatório',
                        setValueAs: (value) => formatoMoeda(value),
                        onChange: (e) => {calcularValorBoletoAtrasado()}
                    })}
                  />
                </div>  

                <div className="row">
                  <InputText 
                    label="Multa"
                    placeholder="R$ 0,00"
                    msgError={errors.valor_multa}
                    error={!!errors.valor_multa?.message}
                    sucess={!!watch('valor_multa')}
                    value={watch('valor_multa')}
                    {...register('valor_multa', {
                        required: 'Valor é obrigatório',
                        setValueAs: (value) => formatoMoeda(value),
                        onChange: (e) => {calcularValorBoletoAtrasado()}
                    })}
                  />
                </div> 
              </div>       

              <div className="input-group info">
                <div className="row">
                  <InputText 
                    label="Data de pagamento"
                    placeholder="dd/mm/aaaa"
                    type="text"
                    inputProps={{ maxLength: 10 }}
                    msgError={errors.data_pagamento}
                    error={!!errors.data_pagamento?.message}
                    sucess={!!watch('data_pagamento')}
                    value={watch('data_pagamento')}
                    {...register('data_pagamento', {
                        required: 'Data é obrigatória',
                        onChange: (e) => {
                            setValue('data_pagamento', dateMask(e.target.value));
                        },
                    })}
                  />
                </div> 

                <div className="row row-text">
                  <div className="label">Valor final pago</div>
                  <div className="valor">{watch('valor_pago_atrasado') || 'R$ 0,00'}</div>
                </div>  

                {/* <span>Valor total: {calcularValorBoletoAtrasado()}</span> */}
              </div>
            </DialogContent>
        }

        <DialogActions>
          <ButtonComponent
            labelColor='white'
            size='large'
            label="Dar feedback do pagamento"
            variant="contained"
            onClick={handleConfirm}
            endIcon={<ArrowRightIcon width={20} fill={'#fff'} />}
            disabled={ watch('motivo') === '2' ? false : validarBtn() }
          />
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}