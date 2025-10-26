// @ts-nocheck
import * as React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { useState, useEffect } from 'react';
import imovelDataInterface from '@/interfaces/Imovel/imovelData'
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Tabs, Tab, Divider
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InputText from '@/components/InputText/Index';
import ButtonComponent from '@/components/ButtonComponent';
import { CheckIcon } from '@heroicons/react/24/solid';
import saveEmailEntregarVenda from '@/apis/saveEmailEntregarVenda';
import GetProcesso from '@/apis/getProcesso';

import { useForm } from 'react-hook-form';
import Pessoa from '@/interfaces/Users/userData';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type propsType = {
  open: Boolean,
  setOpen: (e: Boolean) => void
  context: {
    dataProcesso: imovelDataInterface,
  },
  refresh: () => void;
  setImovelData?: (e: imovelDataInterface) => void
}

interface FormValues {
  emails: { email: string }[];
  emailsRepresentante: { email: string }[];
}

export default function DialogConfirmEmail(props: propsType) {
  const { open, setOpen, context, refresh, setImovelData } = props
  const [tab, setTab] = useState<number>(0)
  const copia = [
    { id: context?.dataProcesso?.copia?.data?.[0]?.id || '', name: context?.dataProcesso?.copia?.data?.[0]?.nome || '', email: context?.dataProcesso?.copia?.data?.[0]?.email || '' },
    { id: context?.dataProcesso?.copia?.data?.[1]?.id || '', name: context?.dataProcesso?.copia?.data?.[1]?.nome || '', email: context?.dataProcesso?.copia?.data?.[1]?.email || '' },
    { id: context?.dataProcesso?.copia?.data?.[2]?.id || '', name: context?.dataProcesso?.copia?.data?.[2]?.nome || '', email: context?.dataProcesso?.copia?.data?.[2]?.email || '' },
    { id: context?.dataProcesso?.copia?.data?.[3]?.id || '', name: context?.dataProcesso?.copia?.data?.[3]?.nome || '', email: context?.dataProcesso?.copia?.data?.[3]?.email || '' },
  ];
  const pessoas = [context?.dataProcesso?.vendedores, context?.dataProcesso?.compradores, context?.dataProcesso?.copia?.data];
  const [valorInput, setValorInput] = useState<any>([]);

  const {
    reset,
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    setFocus,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // console.log('ERRORS: ' , errors)
  // console.log('WATCH: ' , watch());
  // console.log('context: ' , context)
  // console.log('TABS: ' , tab)
  // console.log('TESTEMUNHAS: ' , testemunhas);
  // console.log('PESSOAS: ' , pessoas)

  const vendedores = watch(`${'0'}`)?.filter((pessoa: any) => pessoa.tipo_pessoa === 0 && (pessoa.email === '' || pessoa.email === null));
  const vendedoresEmpresa = watch(`${'0'}`)?.filter((pessoa: any) => pessoa.tipo_pessoa === 1).map((pessoa: any) => pessoa.representante_socios).map((rep: any) => rep.data).flat();
  const vendedoresRepresentantes = vendedoresEmpresa?.filter((representantes: any) => representantes.pj_representante === 1 && (representantes.email === '' || representantes.email === null));

  const compradores = watch(`${'1'}`)?.filter((pessoa: any) => pessoa.tipo_pessoa === 0 && (pessoa.email === '' || pessoa.email === null));
  const compradoresEmpresa = watch(`${'1'}`)?.filter((pessoa: any) => pessoa.tipo_pessoa === 1).map((pessoa: any) => pessoa.representante_socios).map((rep: any) => rep.data).flat();;
  const compradoresRepresentantes = compradoresEmpresa?.filter((representantes: any) => representantes.pj_representante === 1 && (representantes.email === '' || representantes.email === null));

  const processoId = context?.dataProcesso?.id;
  
  const verificaEmailVazio = async (tab) => {
    let newTab = tab /*=== 0 ? '1' : '0'*/;

    watch(`${newTab}`)?.map((pessoa, index) => {
      // Verifica e seta os erros nos campos
      if (pessoa.tipo_pessoa === 0 && (pessoa.email === '' || pessoa.email === null)) {
        setError(`${newTab}.${index}.email`, { message: 'Campo obrigatório' });
        setFocus(`${newTab}.${index}.email`);
      } 

      // if (pessoa.tipo_pessoa === 3 && (pessoa.name === '' || pessoa.name === null)) {
      //   setError(`${newTab}.${index}.name`, { message: 'Campo obrigatório' });
      //   setFocus(`${newTab}.${index}.name`);
      // }
      
      pessoa?.representante_socios?.data.map((representante: any, index_rp: number) => {
        if (representante.pj_representante === 1 && (representante.email === '' || representante.email === null)) {
          setError(`${newTab}.${index}.representante_socios.data.${index_rp}.email`, { message: 'Campo obrigatório' });
          setFocus(`${newTab}.${index}.representante_socios.data.${index_rp}.email`);
        }
      });

      // Verifica se a tab atual está ok e a próxima
      if(vendedores.length === 0 && vendedoresRepresentantes.length === 0){  
        if(compradores.length > 0 || compradoresRepresentantes > 0) setTab(1)
      }

      if(compradores.length === 0 && compradoresRepresentantes.length === 0){
        if(vendedores.length > 0 || vendedoresRepresentantes.length > 0) setTab(0)
      }

      if((vendedores.length > 0 && vendedoresRepresentantes.length > 0) && (compradores.length > 0 && compradoresRepresentantes.length > 0)){
        if(testemunhas.find((data) => data.email === '' || data.name === '')) setTab(2)
      }

      if((vendedores.length === 0 && vendedoresRepresentantes.length === 0) && (compradores.length === 0 && compradoresRepresentantes.length === 0 )){
        if(Object.keys(errors).length === 0){
          refresh();
          setOpen(false);
        }
      }      
    });
  }

  useEffect(() => {
    if(context?.dataProcesso){
      setValue('0', context?.dataProcesso?.vendedores)
      setValue('1', context?.dataProcesso?.compradores)
      setValue('2', copia)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSave = async (e: any) => {
    // refresh();
    verificaEmailVazio(tab);
    console.log('teste')
  }

  const handleClose = async (e: any) => {
    refresh();
    setOpen(false);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    // console.log('Tab atual: ' + tab)
    // console.log(errors)
  };

  const handleEmail = async (e: any, usuario: any, index: number, index_rp: number, type: string) => {
    const id: number = usuario.id;
    const email: any = e.target.value;

    console.log('EMAIL: ' , email)

    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if(email.length > 0){
      if(regex.test(email) === false){
        console.log('TESTE')
        setError(((type === 'vendedor' || type === 'receber_copia') ? `${tab}.${index}.email` : `${tab}.${index}.representante_socios.data.${index_rp}.email`), {message: 'Formato de e-mail inválido'})
      }
      else{
        // const valor: any = {
        //   id: id,
        //   email: email,
        // }
        // setValorInput(valor)
        setValorInput((prev) => ({
          ...prev,
          id: id,
          email: email,
        }));
        clearErrors((type === 'vendedor' || type === 'receber_copia') ? `${tab}.${index}.email` : `${tab}.${index}.representante_socios.data.${index_rp}.email`)
      }
    }
    else{
      if(email.length === 0 && type === 'receber_copia'){
        clearErrors(`${tab}.${index}.email`);
        clearErrors(`${tab}.${index}.representante_socios.data.${index_rp}.email`)
      }
      else{
        setError((type === 'vendedor' ? `${tab}.${index}.email` : `${tab}.${index}.representante_socios.data.${index_rp}.email`), {message: 'Campo obrigatório'})
        setFocus(type === 'vendedor' ? `${tab}.${index}.email` : `${tab}.${index}.representante_socios.data.${index_rp}.email`)
      }
    }
  }

  const handleBlurEmail = async (index: number, index_rp: number, type: string) => {
    if(valorInput.length !== 0){
      
      // const id = valorInput.id
      const id = type === 'receber_copia' ? context?.dataProcesso?.copia?.data[index]?.id || '' : valorInput?.id;
      const email = valorInput?.email;
      const nome = watch(`${tab}.${index}.name`);

      console.log('name: ', valorInput.name);
      console.log('email: ', email);

      if(!errors?.[tab]?.[index]?.email === true || !errors?.[tab]?.[index]?.representante_socios?.data?.[index_rp]?.email === true){
        await saveEmailEntregarVenda(id, email, nome, type, processoId);
        setValorInput([])
        refresh();
      }
    }
  }

  const handleNome = async(e: any, usuario: any, index: number, index_rp: number, type: string) => {
    const id: number = usuario.id;
    const nome: any = e.target.value; 

    if(nome.length === 0 && type !== 'receber_copia'){
      setError(`${tab}.${index}.name`, { message: 'Campo obrigatório' });
      setFocus(`${tab}.${index}.name`);
    }
    else{
      // const valor: any = {
      //   id: id,
      //   name: nome
      // }
      // setValorInput(valor)

      setValorInput((valorInput) => ({
        ...valorInput,
        id: id,
        name: nome,
      }));
      clearErrors(`${tab}.${index}.name`);
    }
  }

  const handleBlurNome = async (index: number, index_rp: number, type: string) => {
    if(valorInput.length !== 0){
      
      const id = type === 'receber_copia' ? context?.dataProcesso?.copia?.data[index]?.id || '' : valorInput?.id;
      // const id = valorInput.id
      const nome = valorInput?.name;
      const email = watch(`${tab}.${index}.email`); 

      console.log('name: ', nome);
      console.log('email: ', valorInput.email);
      
      if(!errors?.[tab]?.[index]?.name === true){
        await saveEmailEntregarVenda(id, email, nome, type, processoId);
        setValorInput([])
        refresh();
      }
    }
  }

  console.log('PESSOAS: ' , pessoas)

  return (
    <Dialog
      open={!!open}
      TransitionComponent={Transition}
      keepMounted
      disableBackdropClick={true}
      // onClose={(e) => handleClose(e)}
      aria-describedby="alert-dialog-slide-description"
      maxWidth='lg'      
    >
      <div className='dialog-confirm-emails'>
        <DialogTitle className='title'>
          <Tabs value={tab} onChange={handleChange} >
            <Tab label={`Vendedores (${pessoas[0]?.filter(pessoa => pessoa?.name != null).length || 0})`} {...a11yProps(0)} />
            <Tab label={`Compradores (${pessoas[1]?.filter(pessoa => pessoa?.name != null).length || 0})`} {...a11yProps(1)} />
            <Tab label={`Cópia`} />
          </Tabs>
          <p>{tab === 2 ? `Adicione quem pode receber a cópia do e-mail` : `Confirme o e-mail de quem ${tab === 0 ? 'vende' : 'compra'}`}:</p>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className=''>
          <DialogContentText className={tab === 0 || tab === 1 ? 'content-emails' : ''}>
            {
              watch(`${tab}`)?.map((pessoa, index) => (
                tab === 0 || tab === 1 ?
                pessoa.tipo_pessoa === 0 ?
                  // QUANDO FOR PESSOA FISICA
                  <div key={pessoa.id} className='input-emails'>
                    <p>{pessoa.name} </p>
                    <InputText
                      // name='email'
                      width='320px'
                      defaultValue={pessoa.email}
                      label='Email*'
                      saveOnBlur={() => handleBlurEmail(index, '', 'vendedor')}
                      sucess={!!pessoa.email}
                      error={!!errors?.[tab]?.[index]?.email}
                      msgError={errors?.[tab]?.[index]?.email}
                      {...register(`${tab}.${index}.email`, {
                        required: 'Campo obrigatório',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: 'Formato de e-mail inválido',
                        },
                        onChange: (e) => handleEmail(e, pessoa, index, '', 'vendedor') 
                      })}
                    />
                  </div>
                  :
                  // QUANDO FOR PESSOA JURIDICA MAIS EXIBE SOMENTE REPRESENTANTES
                  ''
                  // <>
                  // {
                  //   pessoa?.representante_socios?.data.map((representante: any, index_rp: number) => 
                  //     representante.pj_representante === 1 ?   
                  //       <div key={representante.id} className='input-emails'>
                  //         <p>{representante.name} </p>
                  //         <InputText
                  //           //name='email'
                  //           width='320px'
                  //           defaultValue={representante.email}
                  //           label='Email*'
                  //           saveOnBlur={() => handleBlurEmail(index, index_rp, 'representante')}
                  //           sucess={!!representante.email}
                  //           error={!!errors?.[tab]?.[index]?.representante_socios?.data?.[index_rp]?.email}
                  //           msgError={errors?.[tab]?.[index]?.representante_socios?.data?.[index_rp]?.email}
                  //           {...register(`${tab}.${index}.representante_socios.data.${index_rp}.email`, {
                  //             required: 'Campo obrigatório',
                  //             pattern: {
                  //               value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  //               message: 'Formato de e-mail inválido',
                  //             },
                  //             onChange: (e) => handleEmail(e, representante, index, index_rp, 'representante') 
                  //           })}
                  //         />
                  //       </div>
                  //     :
                  //     ''
                  //   )
                  // }
                  // </>  
                  :
                  
                  <>
                    <div className='docsign-receber-copia'>
                      <div className='email-copia'>
                          <div className="email">
                              <InputText
                                  width='320px'
                                  defaultValue={pessoa?.name}
                                  label='Nome completo'
                                  saveOnBlur={() => handleBlurNome(index, '', 'receber_copia')}
                                  sucess={!!pessoa?.name}
                                  error={!!errors?.[tab]?.[index]?.name}
                                  msgError={errors?.[tab]?.[index]?.name}
                                  {...register(`${tab}.${index}.name`, {
                                      // required: 'Campo obrigatório',
                                      required: false,
                                      onChange: (e) => handleNome(e, pessoa, index, '', 'receber_copia') 
                                  })}
                              />
                              <InputText
                                // name='email'
                                width='320px'
                                defaultValue={pessoa.email}
                                label='Email*'
                                saveOnBlur={() => handleBlurEmail(index, '', 'receber_copia')}
                                sucess={!!pessoa.email}
                                error={!!errors?.[tab]?.[index]?.email}
                                msgError={errors?.[tab]?.[index]?.email}
                                {...register(`${tab}.${index}.email`, {
                                  required: 'Campo obrigatório',
                                  pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: 'Formato de e-mail inválido',
                                  },
                                  onChange: (e) => handleEmail(e, pessoa, index, '', 'receber_copia') 
                                })}
                              />
                          </div>
                      </div>
                    </div>
                  </>              
              ))
            }
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions className='footer-actions'>
          <ButtonComponent onClick={(e) => handleClose(e)} size={'medium'} variant={'text'} label={'Voltar'} />
          <ButtonComponent size={'medium'} variant={'contained'} label={'Salvar e confirmar'} labelColor='white' endIcon={<CheckIcon  width={24} fill='white' />} onClick={/*handleSubmit((e) => */handleSave/*(e))*/} />
        </DialogActions>

      </div>
    </Dialog>
  );
}