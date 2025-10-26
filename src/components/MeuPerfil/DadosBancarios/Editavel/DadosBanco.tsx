import React, {useEffect, useContext, useState} from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import InputText from "@/components/InputText/Index";
import InputSelect from '@/components/InputSelect/Index';
import InputPhone from '@/components/InputPhone';
import { FieldErrors, useForm } from 'react-hook-form'
import styles from './BlockStyles.module.scss'
import Image from "next/image";
import Single from "@/images/single.png";
import DataCep from "@/functions/DataCep";
import cepMask from "@/functions/cepMask";
import somenteNumero from "@/functions/somenteNumero";
import cpfMask from '@/functions/cpfMask';
import dateMask from '@/functions/dateMask';
import validarCPF from '@/functions/validarCPF';
//import ImovelContext from '@/context/ImovelContext';
import UsersContext from '@/context/Vendas/ContextBlocks';
import CheckBox from '@/components/CheckBox';
import { useRouter } from 'next/router';
import getCpfDadosUsuario from '@/apis/getCpfDadosUsuario';
import { HiCheck, HiExclamation } from 'react-icons/hi';
import { Troubleshoot } from '@mui/icons-material';
import getUsuariosProcesso from '@/apis/getUsuariosProcesso';
import GlobalContext from '@/context/GlobalContext';
import  Alert  from '@mui/material/Alert';
import { FaExclamationCircle } from 'react-icons/fa';
import Perfil from '@/interfaces/Perfil';
import cnpjMask from '@/functions/cnpjMask';
import validarCNPJ from '@/functions/validarCNPJ';

interface FormValues {
  agencia: string;
  conta: string;
  pix: string;
  banco: number | string;
  chave_pix: number | string;
}

type BlockProps = {
  index: number;
  dataPerfil?: Perfil;
  handleShow?: any
  setBlockSave?: any
  saveBlocks?: any
  listaBancos?: any[];
  listaChavesPix?: any[];
};

const DadosBanco: React.FC<BlockProps> = ({ dataPerfil, handleShow, setBlockSave, saveBlocks, index, listaBancos, listaChavesPix }) => {   
  const {
    dataProcesso,
    selectItem, 
    dataSave, setDataSave,
    idProcesso,
    dataUsuario,
    //progress, setProgress,
    // concluirForm, setConcluirForm
  } = useContext(UsersContext);

  const errorMsg = 'Campo obrigatório';
  const router = useRouter()
  const dataUrl: any = router.query;
  const usuario = dataUsuario;
  const [perfilGerente, setPerfilGerente] = useState(false);
  // const [open, setOpen] = useState(false);
  // const [openSecond, setopenSecond] = useState(false);

  console.log('usuario: ' , usuario);
  console.log('Data Processo: ' , dataProcesso)
  console.log('Data url: ' , dataUrl);

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
      'agencia': dataPerfil?.agencia || '',
      'conta': dataPerfil?.numero_conta || '',
      'pix': dataPerfil?.pix || '',
      'banco': dataPerfil?.banco_id || '0',
      'chave_pix': dataPerfil?.tipo_chave_pix_id || '0',
    }
  });

  console.log('WATCH: ', watch())

  const save =() => {
    let valor: any = {
      'bloco': 2, // Dados Bancários
      'usuario_id': localStorage.getItem('usuario_id') || '',
      'agencia': watch('agencia'),
      'conta': watch('conta'),
      'pix': watch('pix'),
      'banco_id': watch('banco'),
      'chave_pix': watch('chave_pix'),
    }
    // setDataSave(valor);
    console.log('VALROR: ', valor)
    setBlockSave(valor);
  }

  const handleInput = (type: any, value: string) => {
    if(type === 'cpf'){
      setValue(type, cpfMask(watch(type)))
    }
    else{
      setValue(type, (watch(type)))
    }

    save();
  }

  
  // const handleCloseTips = () => {
  //     setOpen(false);
  // };

  // const handleCloseTipsSecond = () => {
  //     setopenSecond(false);
  // };

  const msgCPF = "Numero do CPF inválido";
  const msgCNPJ = "Numero do CNPJ inválido";
  const handleBlurPixCPF_CNPJ = () => {
  
      // if (comissaoAgent && editPagamento.index >= 0) {
        const value = watch(`pix`) || '';
        console.log(watch(`pix`));
  
        if (Number(watch(`chave_pix`)) === 1
          && watch(`pix`)) {
  
          const type = value?.length <= 14 ? 'cpf' : ' cnpj';
          let isValid: any = true
          if (type === 'cpf') {
            isValid = validarCPF(watch(`pix`));
          } else {
            isValid = validarCNPJ(watch(`pix`));
          }
          isValid
            ? clearErrors(`pix`)
            : setError(`pix`, { type: "validate", message: type === 'cpf' ? msgCPF : msgCNPJ })
  
        } else {
          clearErrors(`pix`);
        }
        setDataSave({ ...watch() })
      // }
    };


  return (
    <>
      <div className={`${styles.containerBlock} card-content`}>
        <div className="detahes-content">
          <h2>Informações de pagamento</h2>

          <div className="subtitle">Banco</div>

          <div className="row-f">
            <InputSelect 
              option={listaBancos}
              label={'Banco *'}
              placeholder={'Selecione um banco'}
              error={!!errors.banco ? true : false}
              msgError={errors.banco}
              required={true}
              sucess={!errors.banco && watch('banco') !== '0'}
              value={watch('banco') || '0'}
              // defaultValue={''}
              {...register('banco', {
                validate: (value) => {
                  if (value === '0') {
                      return "Nenhum banco foi selecionada";
                  }
                },
                required: errorMsg,
                onChange: (e) => handleInput('banco', e.target.value)
              })}
              inputProps={{ 'aria-label': 'Without label' }}
            />

            <InputText
              label={`Agência`}
              placeholder={'Ex: 0000'}
              sucess={!errors.agencia && !!watch('agencia')}
              error={!!errors.agencia ? true : false}
              required={true}
              //disabled={true}
              msgError={errors.agencia}
              disabled={!!perfilGerente}
              {...register('agencia', {
                //required: true,
                required: errorMsg,
                onChange: (e) => handleInput('agencia',  e.target.value)
              })}
              />

              <InputText
                  label={'Conta'}
                  placeholder={'Ex: 0000-0'}
                  sucess={!errors.conta && !!watch('conta')}
                  error={!!errors.conta ? true : false}
                  disabled={!!perfilGerente}
                  required={true}
                  msgError={errors.conta}
                  {...register('conta', {
                    //equired: true,
                    required: errorMsg,
                    onChange: (e) => handleInput('conta',  e.target.value)
                  })}
              />
          </div>

          <div className="subtitle">PIX</div>

          <div className="row-f">
            <InputSelect 
                option={listaChavesPix}
                label={'Tipo de chave *'}
                placeholder={'Selecione uma chave PIX'}
                error={!!errors.chave_pix ? true : false}
                msgError={errors.chave_pix}
                required={true}
                sucess={!errors.chave_pix && watch('chave_pix') !== '0'}
                value={watch('chave_pix') || '0'}
                // defaultValue={''}
                {...register('chave_pix', {
                  validate: (value) => {
                    if (value === '0') {
                        return "Nenhuma chave PIX foi selecionada";
                    }
                  },
                  required: errorMsg,
                  onChange: (e) => handleInput('chave_pix', e.target.value)
                })}
                inputProps={{ 'aria-label': 'Without label' }}
              />

              <InputText
                label={'Chave Pix*'}
                placeholder={''}
                // hidden={watch(`${comissaoAgent}.${editPagamento.index}.tipo_pagamento`) === 'banco'}
                // width='280px'
                error={!!errors.pix ? true : false}
                msgError={errors.pix}
                value={watch(`pix`)}
                sucess={!errors.pix && !!watch('pix')}
                onBlurFunction={() => handleBlurPixCPF_CNPJ()}
                {...register(`pix`, {
                  required: errorMsg,
                  setValueAs: (e) => Number(watch(`chave_pix`)) === 1 && e
                    ? e.length <= 14 ? cpfMask(e) : e.length < 19 ? cnpjMask(e) : cnpjMask(e.slice(0, -1))
                    : e,
                  validate: (e) => Number(watch(`chave_pix`)) === 1 && e
                    ? e.length <= 14 ? validarCPF(e) || msgCPF : validarCNPJ(e) || msgCNPJ
                    : true,
                  onChange: (e) => handleInput('pix', e.target.value)
                })}
              />
          </div>

        </div>

        {   
            <footer className={styles.footerControls} style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>
                    <ButtonComponent
                    size={"large"}
                    variant={"text"}
                    name={"previous"}
                    label={"Voltar"}
                    // startIcon={<HiArrowLeft className='primary500' />}
                    onClick={e => handleShow(index, 'voltar')} /*goToPrevSlide(index)*/
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
        
        {/* {Footer && 
          <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(() => handleClick("NEXT"))} index={index}  />
        } */}
      </div>
    </>
  );
};

export default DadosBanco;