import React, {useEffect, useContext, useState} from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import InputText from "@/components/InputText/Index";
import { FieldErrors, useForm } from 'react-hook-form'
import styles from './BlockStyles.module.scss'
import Image from "next/image";
import Single from "@/images/single.png";
import DataCep from "@/functions/DataCep";
import cepMask from "@/functions/cepMask";
import somenteNumero from "@/functions/somenteNumero";
//import ImovelContext from '@/context/ImovelContext';
import UsersContext from '@/context/Vendas/ContextBlocks';
import { useRouter } from 'next/router';
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { HiCheck } from 'react-icons/hi2';
import Perfil from '@/interfaces/Perfil';

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
  index: number;
  dataPerfil?: Perfil;
  handleShow?: any
  setBlockSave?: any
  saveBlocks?: any
};

const Endereco: React.FC<BlockProps> = ({ dataPerfil, handleShow, setBlockSave, saveBlocks, index }) => {  
  
  // const perfil = localStorage.getItem('perfil_login');
  
  const {
    selectItem, 
    dataSave, // setDataSave,
    idProcesso, 
    dataProcesso,
    dataUsuario,
    concluirForm, setConcluirForm
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
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      cep: cepMask(dataPerfil?.cep || '') || '',
      logradouro: dataPerfil?.logradouro || '',
      numero: dataPerfil?.numero || '',
      unidade: dataPerfil?.unidade || '',
      complemento: dataPerfil?.complemento || '',
      cidade: dataPerfil?.cidade || '',
      estado: dataPerfil?.estado || '',
      bairro: dataPerfil?.bairro || ''
    }
  });

  let valor: any = {
    'bloco': 1, // Endereço
    'usuario_id': localStorage.getItem('usuario_id') || '',
    'cep': '',
    'logradouro': '',
    'numero': '',
    'unidade': '',
    'complemento': '',
    'cidade': '',
    'estado': '',
    'bairro': '',
  }

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
    // setLoadingDocumentos(false);
    setValue('cep', cepMask(value))

    // setDataSave(valor);
    // console.log('DataSave Endereço:  ', dataSave);
    setBlockSave(valor);
  };

  const handleNumero = (value: string) => {
    setValue('numero', somenteNumero(value));
  }

  const handleEnderecoImovel = () => {
    valor = {}
    
    handleCep(cepMask(dataPerfil?.cep || ''));

    setValue('cep', dataPerfil?.cep || '');
    setValue('numero', dataPerfil?.numero || '');
    setValue('unidade', dataPerfil?.unidade || '');
    setValue('complemento', dataPerfil?.complemento || '');

    valor.bloco = index;
    valor.usuario_id = localStorage.getItem('usuario_id') || '';
    valor.processo_id = usuario?.processo_id || idProcesso;
    // valor.pj_representante_id = dataUrl.user === 'pessoa-juridica' ? dataUrl?.index ? dataUrl.index[0] : '' : '',
    // valor.tipo_usuario = dataUrl.users;
    //valor.tipo_pessoa = dataUrl.user === 'pessoa-fisica' ? 'fisica' : 'empresa';
    // valor.tipo_pessoa = dataUrl?.user === 'pessoa-fisica' ? 0 : 1;
    valor.cep = dataPerfil?.cep || watch('cep');
    valor.logradouro = dataPerfil?.logradouro;
    valor.numero = dataPerfil?.numero;
    valor.unidade = dataPerfil?.unidade;
    valor.complemento = dataPerfil?.complemento;
    valor.cidade = dataPerfil?.cidade;
    valor.estado = dataPerfil?.estado;
    valor.bairro = dataPerfil?.bairro;

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
    
    console.log('valor: ' , valor);
    // setDataSave(valor);
    setBlockSave(valor);
    console.log('DataSave: ' , dataSave);
  }

  const handleInput = (type: any) => {
    let valor: any = {
      'bloco': index,
      'usuario_id': localStorage.getItem('usuario_id') || '',
      // 'processo_id': usuario?.processo_id || idProcesso,
      // 'tipo_usuario': 'vendedor',
      // 'tipo_pessoa': dataUrl.user === 'pessoa-fisica' ? 'fisica' : 'empresa',
      'cep': watch("cep"),
      'logradouro': watch("logradouro"),
      'numero': watch("numero"),
      'unidade': watch("unidade"),
      'complemento': watch("complemento"),
      'cidade': watch("cidade"),
      'estado': watch("estado"),
      'bairro': watch("bairro"),
    }

    let valorPessoa = 0;

    console.log(dataUrl);

    if(dataUrl?.user === 'pessoa-fisica'){
      valorPessoa = 0;
    }
    else{
      valorPessoa = 1;
    }

    valor.usuario_id = localStorage.getItem('usuario_id') || '';
    // valor.tipo_pessoa = dataUrl?.user === 'pessoa-fisica' ? 0 : 1;
    valor.cep = watch('cep');
    valor.logradouro = watch('logradouro');
    valor.numero = watch('numero');
    valor.unidade = watch('unidade');
    valor.complemento = watch('complemento');
    valor.cidade = watch('cidade');
    valor.estado = watch('estado');
    valor.bairro = watch('bairro');

    // if(watch(type) === ''){
    //   setError(type, {message: 'Campo obrigatório'});
      
    //   if(setConcluirForm){
    //     setConcluirForm(false);
    //   }
    // }
    // else{
    //   clearErrors(type);
    //   if(setConcluirForm){
    //     setConcluirForm(true);
    //   }
    // }

    validarBtnConcluir(type)

    valor[type] = watch(type);
    // setDataSave(valor);
    setBlockSave(valor);
    console.log('DataSave: ' , dataSave);
  }

  async function validarBtnConcluir(type: any){
    if(
      watch('cep').length < 9 
      || watch('numero').length === 0      
      ){
        // Controlar o btn Concluir
        //setError(type, {message: 'Campo obrigatório'});
        if(setConcluirForm) setConcluirForm(false);
      }
      else{
        if(setConcluirForm) setConcluirForm(true);
        //clearErrors(type);
      }
  }

  return (
    <>
      <div className={`${styles.containerBlock} card-content`}>
        <div className="detahes-content">
          
          <h2>Endereço</h2>
          
          <div className="row-f">
            <InputText
                label={'CEP'}
                placeholder={'Ex.: 22031-050'}
                error={!!errors.cep ? true : false}
                msgError={errors.cep}
                required={true}
                disabled={false}
                sucess={!errors.cep && watch('cep').length === 9}
                maxLength={9}
                inputProps={{
                  maxlength: 9
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
                  disabled={true}
                  sucess={!errors.logradouro && !!watch('logradouro')}
                  {...register('logradouro', {
                    required: errorMsg,
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
                  disabled={true}
                  sucess={!errors.cidade && !!watch('cidade')}
                  {...register('cidade', {
                    required: errorMsg,
                  })}
              />

            <InputText
                  label={'Estado'}
                  placeholder={'Ex: RJ'}
                  error={!!errors.estado ? true : false}
                  msgError={errors.estado}
                  required={true}
                  disabled={true}
                  sucess={!errors.estado && !!watch('estado')}
                  {...register('estado', {
                    required: errorMsg,
                  })}
              />

            <InputText
                  label={'Bairro'}
                  placeholder={'Ex: Copacabana'}
                  error={!!errors.bairro ? true : false}
                  msgError={errors.bairro}
                  required={true}
                  disabled={true}
                  sucess={!errors.bairro && !!watch('bairro')}
                  {...register('bairro', {
                    required: errorMsg,
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
        <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(() => handleClick("NEXT"))} index={index}  />} */}
      </div>
    </>
  );
};

export default Endereco;