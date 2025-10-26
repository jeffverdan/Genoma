import React, { useEffect, useContext, useState } from 'react';
import InputText from "@/components/InputText/Index";
import InputPhone from '@/components/InputPhone';
import { FieldErrors, useForm } from 'react-hook-form'
import styles from './BlockStyles.module.scss'
import Image from "next/image";
import Single from "@/images/single.png";
import somenteNumero from "@/functions/somenteNumero";
import cnpjMask from '@/functions/cnpjMask';
import validarCNPJ from '@/functions/validarCNPJ';
//import ImovelContext from '@/context/ImovelContext';
import UsersContext from '@/context/Vendas/ContextBlocks';
import { useRouter } from 'next/router';
import getCpfDadosUsuario from '@/apis/getCpfDadosUsuario';
import ButtonComponent from '@/components/ButtonComponent';
import { HiCheck } from 'react-icons/hi2';
import Pessoa from '@/interfaces/Users/userData';

interface FormValues {
  cnpj: string;
  ddi: string;
  celular: string;
  razaoSocial: string;
  nomeFantasia: string;
  nacionalidade: string;
}

type BlockProps = {
  handleNextBlock?: (index: number) => void;
  handlePrevBlock?: (index: number) => void;
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
  processoId?: number
  type?: string
  blocksLength?: number
  userData?: Pessoa
};

const DadosEmpresa: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer, handleShow, setBlockSave, saveBlocks, processoId, type, blocksLength, userData }) => {

  const {
    dataProcesso,
    selectItem,
    dataSave, setDataSave,
    idProcesso,
    dataUsuario,
    setConcluirForm
  } = useContext(UsersContext);

  const perfil = localStorage.getItem('perfil_login');

  const tipo = type === 'vendedores' ? 'vendedor' : type === 'compradores' ? 'comprador' : 'gerente'  
  const errorMsg = 'Campo obrigatório';
  const router = useRouter()
  const dataUrl: any = router.query;

  // const usuario: Pessoa = !!dataUsuario ? dataUsuario : data;
  const usuario = userData;
  const defaultValues = {
    cnpj: cnpjMask(usuario?.cpf_cnpj) || '',
    ddi: usuario?.ddi || '',
    celular: usuario?.telefone || '',
    razaoSocial: usuario?.razao_social || '',
    nomeFantasia: usuario?.nome_fantasia || '',
  }
  
  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: defaultValues
  });

  const handleInput = (type: any, value: string) => {
    if (type === 'cnpj') {
      setValue(type, cnpjMask(watch(type)))
    }
    else {
      setValue(type, (watch(type)))
    }

    let valor: any = {
      'bloco': 0/*index*/,
      'processo_id': !!idProcesso ? idProcesso : processoId,
      'usuario_id': usuario?.id || localStorage.getItem('usuario_cadastro_id') || '',
      'tipo_usuario': dataUrl.users || tipo, //vendedor ou comprador
      'tipo_pessoa': 1, // PJ
      'cnpj': watch('cnpj'),
      'razao_social': watch('razaoSocial'),
      'nome_fantasia': watch('nomeFantasia'),
      'ddi': watch('ddi'),
      'telefone': watch('celular'),
    }

    validarBtnConcluir(type);

    //valor[type] = watch(type);
    // setDataSave(valor);


    setBlockSave(valor);
  }

  async function validarBtnConcluir(type: any) {
    if (
      watch('cnpj').length < 18
      || watch('razaoSocial').length === 0
      || watch('nomeFantasia').length === 0
      || watch('celular').length < 15
    ) {
      // Controlar o btn Concluir
      //setError(type, {message: 'Campo obrigatório'});
      if (setConcluirForm) setConcluirForm(false);
    }
    else {
      if (setConcluirForm) setConcluirForm(true);
      //clearErrors(type);
    }
  }

  const handleCelular = (data: any, e: any, value: any, formattedValue: any) => {
    const ddi = `+${e.dialCode}`;
    let numeros = formattedValue.split(" ");
    let novoNumero = formattedValue.replace(ddi, '');

    setValue('ddi', e.dialCode);
    setValue('celular', novoNumero.trimStart());
    handleInput('celular', novoNumero.trimStart());

    // Limpa o erro da validação para telefone BR
    if (e.dialCode === '55') {
      formattedValue.length === 19 && clearErrors('celular');
    }
    else {
      clearErrors('celular')
    }
  }

  return (
    <>
      <div className={styles.containerBlock}>
        <div className={styles.headerBlock}>
          {
            perfil === 'Pós-venda'
              ? <h2>Dados da empresa</h2>
              : <>
                <h3>Sobre os dados da empresa</h3>
                <p className="p1">Preencha com dados da empresa referentes ao CNPJ.</p>
              </>
          }
        </div>

        <div className="content">
          <div className="row-f">
            <InputText
              label={'CNPJ'}
              placeholder={'Ex: 00.000.000/0000-00'}
              sucess={!errors.cnpj && watch('cnpj').length === 18}
              error={!!errors.cnpj ? true : false}
              msgError={errors.cnpj}
              value={watch('cnpj')}
              required={true}
              inputProps={{
                maxlength: 18
              }}
              {...register('cnpj', {
                //required: true,
                required: errorMsg,
                setValueAs: e => cnpjMask(e),
                validate: (value) => validarCNPJ(value) || "CNPJ inválido",
                onChange: (e) => [handleInput('cnpj', e.target.value)/*, handleCnpj(e.target.value)*/],
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
                  if (watch('ddi') === '55') {
                    if (value.length < 15) {
                      return "Formato de celular inválido";
                    }
                  }
                },
              })}
            />
          </div>

          <div className="row-f">
            <InputText
              label={'Razão Social'}
              placeholder={'Ex: MAGIS-IM LOCAÇÃO DE IMÓVEIS LTDA'}
              sucess={!errors.razaoSocial && !!watch('razaoSocial')}
              error={!!errors.razaoSocial ? true : false}
              required={true}
              msgError={errors.razaoSocial}
              {...register('razaoSocial', {
                //equired: true,
                required: errorMsg,
                onChange: (e) => handleInput('razaoSocial', e.target.value)
              })}
            />

            <InputText
              label={'Nome Fantasia'}
              placeholder={'Ex: Magis Imobiliária'}
              sucess={!errors.nomeFantasia && !!watch('nomeFantasia')}
              error={!!errors.nomeFantasia ? true : false}
              required={true}
              msgError={errors.nomeFantasia}
              {...register('nomeFantasia', {
                required: errorMsg,
                onChange: (e) => handleInput('nomeFantasia', e.target.value)
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

        {
          (Footer && handlePrevBlock && handleNextBlock && blocksLength) &&
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

export default DadosEmpresa;