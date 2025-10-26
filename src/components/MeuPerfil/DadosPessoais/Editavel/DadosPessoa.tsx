import React, {useEffect, useContext, useState} from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import InputText from "@/components/InputText/Index";
// import InputSelect from '@/components/InputSelect/Index';
import InputPhone from '@/components/InputPhone';
import { FieldErrors, useForm } from 'react-hook-form'
import styles from './BlockStyles.module.scss'
// import Image from "next/image";
// import Single from "@/images/single.png";
// import DataCep from "@/functions/DataCep";
// import cepMask from "@/functions/cepMask";
// import somenteNumero from "@/functions/somenteNumero";
import cpfMask from '@/functions/cpfMask';
// import dateMask from '@/functions/dateMask';
import validarCPF from '@/functions/validarCPF';
import validarCNPJ from '@/functions/validarCNPJ';
// import ImovelContext from '@/context/ImovelContext';
import UsersContext from '@/context/Vendas/ContextBlocks';
// import CheckBox from '@/components/CheckBox';
import { useRouter } from 'next/router';
// import getCpfDadosUsuario from '@/apis/getCpfDadosUsuario';
import { HiCheck, HiExclamation } from 'react-icons/hi';
// import { Troubleshoot } from '@mui/icons-material';
// import getUsuariosProcesso from '@/apis/getUsuariosProcesso';
// import GlobalContext from '@/context/GlobalContext';
// import  Alert  from '@mui/material/Alert';
// import { FaExclamationCircle } from 'react-icons/fa';
import Perfil from '@/interfaces/Perfil';
import cnpjMask from '@/functions/cnpjMask';

interface FormValues {
  cpf: string;
  nome: string;
  ddi: string;
  celular: string;
  creci: string;
  razao_social: string;
  cnpj: string
}

type BlockProps = {
  index: number;
  dataPerfil?: Perfil;
  handleShow?: any
  setBlockSave?: any
  saveBlocks?: any
};

const DadosPessoa: React.FC<BlockProps> = ({dataPerfil, handleShow, setBlockSave, saveBlocks, index}) => {  
  
  // const perfil = localStorage.getItem('perfil_login');
  
  const {
    dataProcesso,
    selectItem, 
    dataSave, // setDataSave,
    idProcesso,
    dataUsuario,
    //progress, setProgress,
    concluirForm, setConcluirForm
  } = useContext(UsersContext);

  const errorMsg = 'Campo obrigatório';
  const router = useRouter()
  const dataUrl: any = router.query;
  const usuario = dataUsuario;
  const [phoneValue, setPhoneValue] = useState('+55 (21) 99999-9999');
  const [perfilGerente, setPerfilGerente] = useState(false);
  // const [open, setOpen] = useState(false);
  // const [openSecond, setopenSecond] = useState(false);

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
      cpf: cpfMask(dataPerfil?.cpf ?? '') || '',
      nome: dataPerfil?.nome || '',
      ddi: dataPerfil?.ddi || '',
      celular: dataPerfil?.telefone  || '',
      creci: dataPerfil?.creci || '',
      razao_social: dataPerfil?.nome_empresa || '',
      cnpj: dataPerfil?.cnpj || '',
    }
  });

  console.log('watch: ', watch())
  console.log('errors: ', errors)

  const save =() => {
    let valor: any = {
      'bloco': 0, // Dados Pessoais
      'usuario_id': localStorage.getItem('usuario_id') || '',
      'cpf': watch('cpf'),
      'nome': watch('nome'),
      'ddi': watch('ddi'),
      'telefone': watch('celular'),
      'creci': watch('creci'),
      'razao_social': watch('razao_social'),
      'cnpj': watch('cnpj'),
    }
    // setDataSave(valor);
    setBlockSave(valor);
  }

  const handleInput = (type: any, value: string) => {
    if(type === 'cpf'){
      setValue(type, cpfMask(watch(type)))
    }

    if(type === 'cnpj'){
      setValue(type, cnpjMask(watch(type)))
    }
    else{
      setValue(type, (watch(type)))
    }
    
    save();
  }

  const handleCelular = (data: any, e: any, value: any, formattedValue: any) => {
    const ddi = `+${e.dialCode}`; 
    let numeros = formattedValue.split(" ");
    let novoNumero = formattedValue.replace(ddi, '');

    setValue('ddi', e.dialCode);
    setValue('celular', novoNumero.trimStart());
    handleInput('celular', novoNumero.trimStart());

    // Limpa o erro da validação para telefone BR
    if(e.dialCode === '55'){
      formattedValue.length === 19 && clearErrors('celular');
    }
    else{
      clearErrors('celular')
    }
  }

  return (
    <>
      <div className={`${styles.containerBlock} card-content`}>
        <div className="detahes-content">
          <h2>Dados pessoais</h2>

          <div className="row-f">
            <InputText
              label={`Nome completo`}
              placeholder={'Ex: José Maria da Silva'}
              sucess={!errors.nome && !!watch('nome')}
              error={!!errors.nome ? true : false}
              required={true}
              //disabled={true}
              msgError={errors.nome}
              {...register('nome', {
                //required: true,
                required: errorMsg,
                onChange: (e) => handleInput('nome',  e.target.value)
              })}
              />
          </div>

          <div className="row-f">
              <InputText
                  label={'CPF'}
                  placeholder={'Ex: 000.000.000-00'}
                  sucess={!errors.cpf && watch('cpf').length === 14}
                  error={!!errors.cpf ? true : false}
                  msgError={errors.cpf}
                  value={watch('cpf')}
                  required={true}
                  inputProps={{
                    maxlength: 14
                  }}
                  {...register('cpf', {
                    //required: true,
                    required: errorMsg,
                    setValueAs: e => cpfMask(e),
                    validate: (value) => validarCPF(value) || "CPF inválido",
                    onChange: (e) => handleInput('cpf',  e.target.value),
                  })}
              />

              <InputText
                  label={'CRECI'}
                  placeholder={'Ex: 000.000.000-00'}
                  sucess={!errors.creci && watch('creci').length != 0}
                  error={!!errors.creci ? true : false}
                  msgError={errors.creci}
                  value={watch('creci')}
                  required={true}
                  /*inputProps={{
                    maxlength: 14
                  }}*/
                  {...register('creci', {
                    //required: true,
                    required: errorMsg,
                    onChange: (e) => handleInput('creci',  e.target.value),
                  })}
              />

              <InputPhone
                  value={watch('celular') ? watch('ddi') + watch('celular') : '55'}
                  label={'Celular'}
                  placeholder={'Ex: (21) 99754-4899'}
                  sucess={!errors.celular && !!watch('celular')}
                  error={!!errors.celular ? true : false}
                  required={true}
                  msgError={errors.celular}
                  country={"br"}
                  disabled={!!perfilGerente}
                  // {...register('celular', {
                  //   required: errorMsg,
                  // })}
                  onChange={handleCelular}
                  isValid={(inputNumber: any, country: any) => {
                    if (country.countryCode === '55') {
                      return inputNumber.length < 12 ? false : true;
                    } else {
                      return inputNumber.length < 6 ? false : true;
                    }
                  }}
                />

                {/*Validação formato do Celular BR*/}
                <input
                  type="hidden"
                  {...register('celular', {
                    required: 'Campo obrigatório',
                    validate: (value) => {
                      if(watch('ddi') === '55'){
                        if (value.length < 15) {
                          return "Formato de celular inválido";
                        }
                      }
                    },
                  })}
                />
            </div>

            <div className="subtitle">Dados de pessoa jurídica</div>
          </div>

          <div className="row-f">
            <InputText
              width={'470px'}
              label={`Razão Social`}
              placeholder={'Ex: Teste Razão Social'}
              sucess={!errors.razao_social && !!watch('razao_social')}
              error={!!errors.razao_social ? true : false}
              // required={true}
              msgError={errors.razao_social}
              {...register('razao_social', {
                //required: true,
                // required: errorMsg,
                onChange: (e) => handleInput('razao_social',  e.target.value)
              })}
              />
          </div>

          <div className="row-f">
            <InputText
              width={'470px'}
              label={'CNPJ'}
              placeholder={'Ex: 000.000.000-00'}
              sucess={!errors.cnpj && (watch('cnpj').length === 18)}
              error={!!errors.cnpj ? true : false}
              msgError={errors.cnpj}
              value={watch('cnpj')}
              // required={true}
              inputProps={{
                maxlength: 18
              }}
              {...register('cnpj', {
                setValueAs: e => cnpjMask(e),
                validate: (value) => {
                  if (!value) return true; // Permite valor vazio
                  return validarCNPJ(value) || "CNPJ inválido"; // Valida se preenchido
                },
                onChange: (e) => handleInput('cnpj', e.target.value),
              })}
          />
          </div>

        {   
            // Quando for Pós-venda
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

export default DadosPessoa;