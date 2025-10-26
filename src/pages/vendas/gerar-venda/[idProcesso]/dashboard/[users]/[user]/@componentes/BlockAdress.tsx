import React, { useEffect, useContext, useState } from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import InputText from "@/components/InputText/Index";
import { FieldErrors, useForm } from 'react-hook-form'
import styles from './BlocksStyles.module.scss'
import Image from "next/image";
import Single from "@/images/single.png";
import DataCep from "@/functions/DataCep";
import cepMask from "@/functions/cepMask";
import somenteNumero from "@/functions/somenteNumero";
//import ImovelContext from '@/context/ImovelContext';
import UsersContext from '@/context/Vendas/ContextBlocks';
import { useRouter } from 'next/router';
import { ClipboardIcon } from "@heroicons/react/24/outline";

interface FormValues {
  cep: string;
  logradouro: string;
  numero: string;
  unidade: string;
  complemento: string;
  cidade: string;
  estado: string;
  bairro: string;
}

const arrayForm = [
  { name: 'CEP', placeholder: 'Ex.: 22031-050', register: 'cep', require: true, width: '33%' },
  { name: 'Logradouro', placeholder: 'Ex.: Rua Ministro Alfredo Valadão', register: 'logradouro', require: true, width: '33%' },
  { name: 'Numero', placeholder: 'Ex.: 77', register: 'numero', require: true, width: '33%' },
  { name: 'Unidade', placeholder: 'Ex.: Apto. 707', register: 'unidade', width: '33%' },
  { name: 'Complemento', placeholder: 'Ex: Bloco, lote ou condomínio', register: 'complemento', width: '33%' },
  { name: 'Cidade', placeholder: 'Ex.: Rio de Janeiro', register: 'cidade', require: true, width: '33%' },
  { name: 'Estado', placeholder: 'Ex.: RJ', register: 'estado', require: true, width: '33%' },
  { name: 'Bairro', placeholder: 'Ex.: Copacabana', register: 'bairro', require: true, width: '33%' },
];

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
    selectItem,
    dataSave, setDataSave,
    idProcesso,
    dataProcesso,
    dataUsuario, setDataUsuario,
    concluirForm, setConcluirForm,
    loadingDocumentos, setLoadingDocumentos,
  } = useContext(UsersContext);

  const userName = "Sr. Genoma"
  const errorMsg = 'Campo obrigatório';
  const router = useRouter()
  const dataUrl: any = router.query;
  const usuario = dataUsuario;


  console.log(dataUrl)
  console.log(dataProcesso);

  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      cep: cepMask(dataUsuario?.cep) || '',
      logradouro: dataUsuario?.logradouro || '',
      numero: dataUsuario?.numero || '',
      unidade: dataUsuario?.unidade || '',
      complemento: dataUsuario?.complemento || '',
      cidade: dataUsuario?.cidade || '',
      estado: dataUsuario?.estado || '',
      bairro: dataUsuario?.bairro || ''
    }
  });

  const [disable, setDisable] = useState({
    logradouro: true,
    cidade: true,
    estado: true,
    bairro: true
  });

  const refreshDisable = () => {
    if (!errors.cep) {
      setDisable({
        logradouro: !!watch('logradouro'),
        cidade: !!watch('cidade'),
        estado: !!watch('estado'),
        bairro: !!watch('bairro'),
      })
    }
  };

  useEffect(() => {
    if (dataUsuario?.cep) {
      setValue('cep', dataUsuario.cep || '');
      setValue('logradouro', dataUsuario.logradouro || '');
      setValue('numero', dataUsuario.numero || '');
      setValue('unidade', dataUsuario.unidade || '');
      setValue('complemento', dataUsuario.complemento || '');
      setValue('cidade', dataUsuario.cidade || '');
      setValue('estado', dataUsuario.estado || '');
      setValue('bairro', dataUsuario.bairro || '');
      // if (dataUsuario.cep) {
      //   handleCep(dataUsuario.cep);
      // };
    }
  }, [dataUsuario, selectItem]);

  console.log(dataUsuario);
  if (index === selectItem) {    
    console.log("Form: ", watch());
    console.log("Error: ", errors);
  };

  const handleClick = (direction: string) => {
    // setLoadingDocumentos(false);
    if (direction === 'NEXT') {
      handleNextBlock(index);
    } else {
      handlePrevBlock(index);
    }

  };

  let valor: any = {
    'bloco': 1/*index*/,
    'usuario_id': dataUsuario?.id || '',
    'processo_id': dataUsuario?.processo_id || idProcesso,
    'tipo_usuario': dataUrl.users, //vendedor ou comprador,
    //'tipo_pessoa': dataUrl.user === 'pessoa-fisica' || dataUrl.index[1] === 'representante' ? 0 : 1,
    'pj_representante_id': dataUrl.user === 'pessoa-juridica' ? dataUrl?.index ? dataUrl.index[0] : '' : '',
    'cep': '',
    'logradouro': '',
    'numero': '',
    'unidade': '',
    'complemento': '',
    'cidade': '',
    'estado': '',
    'bairro': '',
  }

  const handleCep = async (value: string) => {
    if (value.length === 9) {

      // setLoadingDocumentos(true);
      let dadosCep = await DataCep(value);

      if (!dadosCep?.erro) {
        setValue('logradouro', dadosCep?.logradouro);
        setValue('cidade', dadosCep?.localidade);
        setValue('bairro', dadosCep?.bairro);
        setValue('estado', dadosCep?.uf);

        clearErrors('cep');
        clearErrors('logradouro');
        clearErrors('cidade');
        clearErrors('bairro');
        clearErrors('estado');

        valor.cep = watch('cep') || dataProcesso.imovel.cep;
        valor.logradouro = dadosCep?.logradouro;
        valor.cidade = dadosCep?.localidade;
        valor.estado = dadosCep?.uf;
        valor.bairro = dadosCep?.bairro;

        //setValue('cep', cepMask(value))
        console.log('valor: ', valor);
      }
      else {
        setValue('logradouro', '');
        setValue('cidade', '');
        setValue('bairro', '');
        setValue('estado', '');

        setError('cep', { message: 'CEP não encontrado' });
      }
      refreshDisable();
    }
    else {
      setValue('logradouro', '');
      setValue('cidade', '');
      setValue('bairro', '');
      setValue('estado', '');

      //setError('cep', {message:'CEP não encontrado'});
    }
    setLoadingDocumentos(false);
    setValue('cep', cepMask(value))

    setDataSave(valor);
    console.log('DataSave Endereço:  ', dataSave);
  };

  console.log('LOADINGDOCUMENTOS: ', loadingDocumentos)

  const handleNumero = (value: string) => {
    setValue('numero', somenteNumero(value));
  };

  const handleEnderecoImovel = () => {
    valor = {}

    handleCep(cepMask(dataProcesso?.imovel.cep));

    setValue('cep', dataProcesso.imovel.cep);
    setValue('numero', dataProcesso?.imovel.numero);
    setValue('unidade', dataProcesso?.imovel.unidade);
    setValue('complemento', dataProcesso?.imovel.complemento);

    valor.bloco = index;
    valor.usuario_id = dataUsuario?.id || localStorage.getItem('usuario_cadastro_id') || '';
    valor.processo_id = dataUsuario?.processo_id || idProcesso;
    valor.pj_representante_id = dataUrl.user === 'pessoa-juridica' ? dataUrl?.index ? dataUrl.index[0] : '' : '',
      valor.tipo_usuario = dataUrl.users;
    //valor.tipo_pessoa = dataUrl.user === 'pessoa-fisica' ? 'fisica' : 'empresa';
    valor.tipo_pessoa = dataUrl?.user === 'pessoa-fisica' ? 0 : 1;
    valor.cep = dataProcesso?.imovel.cep || watch('cep');
    valor.logradouro = dataProcesso?.imovel.logradouro;
    valor.numero = dataProcesso?.imovel.numero;
    valor.unidade = dataProcesso?.imovel.unidade;
    valor.complemento = dataProcesso?.imovel.complemento;
    valor.cidade = dataProcesso?.imovel.cidade;
    valor.estado = dataProcesso?.imovel.uf;
    valor.bairro = dataProcesso?.imovel.bairro;

    // if(watch('cep') === ''){
    //   setError('cep', {message: 'Campo obrigatório'});

    //   if(setConcluirForm){
    //     setConcluirForm(false);
    //   }
    // }
    // else{
    //   clearErrors('cep');
    //   if(setConcluirForm){
    //     setConcluirForm(true);
    //   }
    // }


    // setDataSave(valor);
    console.log('DataSave Endereço:  ', dataSave);
  }

  const handleInput = (type: keyof FormValues) => {
    let valorPessoa = 0;

    console.log(dataUrl);

    if (dataUrl?.user === 'pessoa-fisica') {
      valorPessoa = 0;
    }
    else {
      valorPessoa = 1;
    }

    valor.usuario_id = dataUsuario?.id || localStorage.getItem('usuario_cadastro_id') || '';
    valor.tipo_pessoa = dataUrl?.user === 'pessoa-fisica' ? 0 : 1;
    valor.cep = watch('cep');
    valor.logradouro = watch('logradouro');
    valor.numero = watch('numero');
    valor.unidade = watch('unidade');
    valor.complemento = watch('complemento');
    valor.cidade = watch('cidade');
    valor.estado = watch('estado');
    valor.bairro = watch('bairro');

    validarBtnConcluir(type)

    clearErrors(type);

    valor[type] = watch(type);
    setDataSave(valor);
    console.log('DataSave Endereço:  ', dataSave);
  }

  async function validarBtnConcluir(type: any) {
    if (
      watch('cep').length < 9
      || watch('numero').length === 0
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

  return (
    <>
      <div className={styles.containerBlock}>
        <div className={styles.headerBlock}>
          <h3>{dataUrl.user === 'pessoa-fisica' ? `Onde mora a pessoa ${dataUrl.users}a ?` : 'Onde fica a empresa?'}</h3>
          {/* <p className="p1">Fique atento com possíveis pendências no cadastro.</p> */}
        </div>

        {/*Se for vendedor*/}
        <div className="pd20">
          {
            dataUrl.users === 'vendedor' &&
            <ButtonComponent
              name="secondary"
              size="medium"
              label="Copiar endereço do imóvel vendido"
              startIcon={<ClipboardIcon className="icon icon-right" />}
              variant="text"
              onClick={(e) => handleEnderecoImovel()}
            />
          }
        </div>

        <div className="content">
          <div className="row-f">
            <InputText
              label={'CEP'}
              placeholder={'Ex.: 22031-050'}
              error={!!errors.cep ? true : false}
              msgError={errors.cep}
              required={true}
              disabled={false}
              sucess={!errors.cep && watch('cep')?.length === 9}
              maxLength={9}
              inputProps={{
                maxLength: 9
              }}
              {...register('cep', {
                required: errorMsg,
                onChange: (e) => [handleCep(watch('cep')), handleInput('cep')]
              })}

            />
            <InputText
              label={'Logradouro'}
              placeholder={'Rua do Teste'}
              error={!!errors.logradouro ? true : false}
              msgError={errors.logradouro}
              required={true}
              disabled={disable.logradouro}
              sucess={!errors.logradouro && !!watch('logradouro')}
              {...register('logradouro', {
                required: errorMsg,
                onChange: (e) => handleInput('logradouro')
              })}
            />
          </div>

          <div className="row-f">
            <InputText
              label={'Número'}
              placeholder={'Ex: 77'}
              error={!!errors.numero ? true : false}
              msgError={errors.numero}
              required={true}
              sucess={!errors.numero && !!watch('numero')}
              {...register('numero', {
                required: errorMsg,
                onChange: (e) => [handleNumero(watch('numero')), handleInput('numero')]
              })}
            />

            <InputText
              label={'Unidade'}
              placeholder={'Ex: Apto 707'}
              sucess={!errors.unidade && !!watch('unidade')}
              {...register('unidade', {
                required: false,
                onChange: (e) => handleInput('unidade')
              })}
            />

            <InputText
              label={'Complemento'}
              placeholder={'EX: Bloco, lote ou condomínio'}
              sucess={!errors.complemento && !!watch('complemento')}
              {...register('complemento', {
                required: false,
                onChange: (e) => handleInput('complemento')
              })}
            />
          </div>

          <div className="row-f">
            <InputText
              label={'Cidade'}
              placeholder={'Ex: Rio de Janeiro'}
              error={!!errors.cidade ? true : false}
              msgError={errors.cidade}
              required={true}
              disabled={disable.cidade}
              sucess={!errors.cidade && !!watch('cidade')}
              {...register('cidade', {
                required: errorMsg,
                onChange: (e) => handleInput('cidade')
              })}
            />

            <InputText
              label={'Estado'}
              placeholder={'Ex: RJ'}
              error={!!errors.estado ? true : false}
              msgError={errors.estado}
              required={true}
              disabled={disable.estado}
              sucess={!errors.estado && !!watch('estado')}
              {...register('estado', {
                required: errorMsg,
                onChange: (e) => handleInput('estado')
              })}
            />

            <InputText
              label={'Bairro'}
              placeholder={'Ex: Copacabana'}
              error={!!errors.bairro ? true : false}
              msgError={errors.bairro}
              required={true}
              disabled={disable.bairro}
              sucess={!errors.bairro && !!watch('bairro')}
              {...register('bairro', {
                required: errorMsg,
                onChange: (e) => handleInput('bairro')
              })}
            />
          </div>

          {/*<div className="form-container">
            {arrayForm.map((campo, index) => { 
              const name = campo.name as keyof FormValues;
              console.log(name);
              const error = errors ? errors[name as keyof FormValues] : undefined;
              return (
              <InputText
                width={campo.width}
                key={index}
                label={campo.name}
                placeholder={campo.placeholder}
                error={!!error}
                msgError={error}
                required={campo.require}
                sucess={!error && !!watch(name)}
                {...register(name, {
                  required: "CEP obrigatório",
                })}
              />
            )})}
          </div>*/}
        </div>
        {Footer &&
          <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(() => handleClick("NEXT"))} index={index} />}
      </div>
    </>
  );
};

export default BlockPage;