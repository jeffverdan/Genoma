import React, { useState, useEffect, useContext } from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import { useForm } from 'react-hook-form'
import styles from './BlocksStyles.module.scss'
import TextArea from "@/components/TextArea";
import InputText from "@/components/InputText/Index";
import SwitchButton from "@/components/SwitchButton";
//import ImovelContext from '@/context/ImovelContext';
import UsersContext from '@/context/Vendas/ContextBlocks';
import { useRouter } from 'next/router';
import InputPhone from '@/components/InputPhone';
import FocusTrap from '@mui/material/Unstable_TrapFocus';
import  Alert  from '@mui/material/Alert';
import { FaExclamationCircle } from 'react-icons/fa';

interface FormValues {
  nomeProcurador: string;
  ddiProcurador: string,
  telefoneProcurador: string;
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

const BlockPage: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer }) => {
  const {
    dataSave, setDataSave,
    idProcesso, selectItem,
    dataUsuario,
    concluirForm, setConcluirForm,
  } = useContext(UsersContext);

  const usuario = dataUsuario;
  const errorMsg = 'Campo obrigatório';
  const router = useRouter()
  const dataUrl: any = router.query;
  const [checked, setChecked] = useState(usuario?.procurador?.nome ? true : false);
  const [open, setOpen] = useState(false);

  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    unregister,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      nomeProcurador: usuario?.procurador?.nome || '',
      ddiProcurador: usuario?.procurador?.ddi || '+55',
      telefoneProcurador: usuario?.procurador?.telefone || ''
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

  let valor: any = {
    'bloco': 3,
    'processo_id': usuario?.processo_id || idProcesso,
    'usuario_id': usuario?.id || '',
    'pj_representante_id': dataUrl.user === 'pessoa-juridica' ? dataUrl?.index[0] : '',
    'tipo_usuario': dataUrl.users, //vendedor ou comprador
    'tipo_pessoa': 0,
    //'nomeProcurador': watch("nomeProcurador"),
    //'ddiProcurador': watch("ddiProcurador"),
    //'telefoneProcurador': watch("telefoneProcurador"),
  }

  const handleCelular = (data: any, e: any, value: any, formattedValue: any) => {
    const ddi = `+${e.dialCode}`; 
    let numeros = formattedValue.split(" ");
    let novoNumero = formattedValue.replace(ddi, '');

    setValue('ddiProcurador', e.dialCode);
    setValue('telefoneProcurador', novoNumero.trimStart());
    handleInput('telefoneProcurador', novoNumero.trimStart());
  }

  const handleChecked = async () => {
    if(checked === true) {

      unregister('telefoneProcurador');
      unregister('nomeProcurador');
      unregister('ddiProcurador');
      clearErrors('telefoneProcurador');

      valor.usuario_id = usuario?.id || localStorage.getItem('usuario_cadastro_id') || '';
      valor.nomeProcurador = '';
      valor.ddiProcurador = '';
      valor.telefoneProcurador = '';

      setValue('nomeProcurador', '');
      setValue('ddiProcurador', '');
      setValue('telefoneProcurador', '');

      setDataSave(valor);
      setOpen(true)
      if(setConcluirForm) setConcluirForm(true)
      
    }
    else{
      setValue('nomeProcurador', usuario?.procurador?.nome || '');
      setValue('ddiProcurador', usuario?.procurador?.ddi || '');
      setValue('telefoneProcurador', usuario?.procurador?.telefone || '');

      valor.usuario_id = usuario?.id || localStorage.getItem('usuario_cadastro_id') || '';
      valor.nomeProcurador = usuario?.procurador?.nome || '';
      valor.ddiProcurador = usuario?.procurador?.ddi || '+55';
      valor.telefoneProcurador = usuario?.procurador?.telefone || '';

      // if(watch('nomeProcurador') === '' && watch('telefoneProcurador') === ''){
      //   if(setConcluirForm) setConcluirForm(false)
      // }
      // else{
      //   if(setConcluirForm) setConcluirForm(true)
      // }

      setDataSave(valor);
    }

    if (checked == false) {
        setOpen(true)
    }
  }
  // const handleChecked = async () => {
  //   const newChecked = !checked;
  //   setChecked(newChecked);

  //   if (!newChecked) {
  //       unregister('telefoneProcurador');
  //       unregister('nomeProcurador');
  //       unregister('ddiProcurador');
  //   } else {
  //       clearErrors('telefoneProcurador');
  //   }

  //   if (newChecked) {
  //       setValue('nomeProcurador', '');
  //       setValue('ddiProcurador', '');
  //       setValue('telefoneProcurador', '');
  //       valor.nomeProcurador = '';
  //       valor.ddiProcurador = '';
  //       valor.telefoneProcurador = '';
  //   } else {
  //       setValue('nomeProcurador', usuario?.procurador?.nome || '');
  //       setValue('ddiProcurador', usuario?.procurador?.ddi || '+55');
  //       setValue('telefoneProcurador', usuario?.procurador?.telefone || '');
  //       valor.nomeProcurador = usuario?.procurador?.nome || '';
  //       valor.ddiProcurador = usuario?.procurador?.ddi || '+55';
  //       valor.telefoneProcurador = usuario?.procurador?.telefone || '';
  //   }

  //   setDataSave(valor);
  //   setOpen(true);
  // };

  const handleInput = (type: any, value: any) => {
    valor.usuario_id = usuario?.id || localStorage.getItem('usuario_cadastro_id') || '';
    valor.nomeProcurador = watch('nomeProcurador');
    valor.ddiProcurador = watch('ddiProcurador');
    valor.telefoneProcurador = watch('telefoneProcurador');

    setValue(type, (watch(type)))
    setDataSave(valor);
    //console.log('dataSave: ' , dataSave)
  }

  const handleCloseTips = () => {
      setOpen(false);
  };

  return (
    <FocusTrap disableEnforceFocus open>
    <>
      <div className={styles.containerBlock}>
        <div className={styles.headerBlock}>
          <h3>Quem {dataUrl.users === 'vendedor' ? 'vende' : 'compra'} possui procurador?</h3>
        </div>

        <div className="mt36 mb51" style={{width: '400px'}}>
          <SwitchButton 
            check={checked} 
            setCheck={setChecked} 
            // setCheck={() => {}}
            handleChange={handleChecked} 
            label={`Sim, quem ${dataUrl.users === 'vendedor' ? 'vende' : 'compra'}  possui procurador(a).`}
          />
        </div>

        {checked ?
        <div className=''>
          <div className="row-f">
            <InputText
                label={'Nome do procurador(a)'}
                placeholder={'Ex: José Maria da Silva'}
                sucess={!errors.nomeProcurador && !!watch('nomeProcurador')}
                error={!!errors.nomeProcurador ? true : false}
                required={checked}
                msgError={errors.nomeProcurador}
                {...register('nomeProcurador', {
                  //required: true,
                  required: errorMsg,
                  onChange: (e) => handleInput('nomeProcurador',  e.target.value)
                })}
            />

            <InputPhone
              value={watch('telefoneProcurador') ? watch('ddiProcurador') + watch('telefoneProcurador') : '55'}
              label={'Celular do procurador(a)*'}
              placeholder={'Ex: (21) 99754-4899'}
              sucess={!errors.telefoneProcurador && !!watch('telefoneProcurador')}
              error={!!errors.telefoneProcurador ? true : false}
              required={checked}
              msgError={errors.telefoneProcurador}
              country={"br"}
              {...register('telefoneProcurador', {
                required: checked ? "Campo obrigatório" : false, // Condicional baseado no estado de `checked`
                validate: (value) => {
                    if (checked && !value) {
                        return "Campo obrigatório";
                    }
                    return true;
                },
              })}
              onChange={handleCelular}
              isValid={(inputNumber: any, country: any) => {
                if (country.countryCode === '55') {
                  return inputNumber.length < 12 ? false : true;
                } else {
                  return inputNumber.length < 6 ? false : true;
                }
              }}
            />
          </div>
            {open && (
                <Alert
                    className='alert yellow'
                    icon={<FaExclamationCircle size={20} />}
                    onClose={handleCloseTips}
                    //severity='warning'
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Confirme se a <b>procuração está em dia</b> para evitar atrasos no processo.
                </Alert>
            )}
        </div>
        :
        ''}
       
        {Footer &&
          <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(() => handleClick("NEXT"))} index={index} />}
      </div>
    </>
    </FocusTrap>
  );
};

export default BlockPage;