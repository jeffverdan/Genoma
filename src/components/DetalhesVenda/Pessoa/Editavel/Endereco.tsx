import React, {useEffect, useContext} from 'react';
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
import Pessoa from '@/interfaces/Users/userData';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';

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

type BlockProps = {
  handleNextBlock?: (index: number) => void;
  handlePrevBlock?: (index: number) => void;
  index: number;
  data: imovelDataInterface;
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

export default function Endereco ({ handleNextBlock, handlePrevBlock, index, data, Footer, handleShow, setBlockSave, saveBlocks, processoId, type, blocksLength, userData }: BlockProps) {  
  
  const perfil = localStorage.getItem('perfil_login');
  
  const {
    selectItem, 
    dataSave, setDataSave,
    idProcesso, 
    dataProcesso,
    dataUsuario,
    concluirForm, setConcluirForm
  } = useContext(UsersContext);
  
  const tipo = type === 'vendedores' ? 'vendedor' : type === 'compradores' ? 'comprador' : 'gerente'
  const userName = "Sr. Genoma"
  const errorMsg = 'Campo obrigatório';
  const router = useRouter()
  const dataUrl: any = router.query;

  // const usuario: Pessoa = !!dataUsuario ? dataUsuario : data;
  const usuario = userData;
  console.log(userData);
  
  useEffect(() => { 
    if(userData) {
      setValue('cep', cepMask(usuario?.cep || ''));
      setValue('logradouro', usuario?.logradouro || '');
      setValue('numero', usuario?.numero || '');
      setValue('complemento', usuario?.complemento || '');
      setValue('cidade', usuario?.cidade || '');
      setValue('estado', usuario?.estado || '');
      setValue('bairro', usuario?.bairro || '');
    }
  }, [userData])
  
  const defaultValues = {
    cep: cepMask(usuario?.cep || ''),
    logradouro: usuario?.logradouro || '',
    numero: usuario?.numero || '',
    unidade: usuario?.unidade || '',
    complemento: usuario?.complemento || '',
    cidade: usuario?.cidade || '',
    estado: usuario?.estado || '',
    bairro: usuario?.bairro || ''
  };
  

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

  let valor: any = {
    'bloco': 1/*index*/,
    'usuario_id': usuario?.id || '',
    'processo_id': !!idProcesso ? idProcesso : data.processo_id,
    'tipo_usuario': dataUrl.users || tipo, //vendedor ou comprador,
    //'tipo_pessoa': dataUrl.user === 'pessoa-fisica' || dataUrl.index[1] === 'representante' ? 0 : 1,
    // 'pj_representante_id': dataUrl.user === 'pessoa-juridica' ? dataUrl?.index ? dataUrl.index[0] : '' : '',
    'pj_representante_id': userData?.pj_representante,
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
    if(value.length === 9){
      
      let dadosCep = await DataCep(value);

      if(!dadosCep?.erro){
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
        
      }
      else{
        setValue('logradouro', '');
        setValue('cidade', '');
        setValue('bairro', '');
        setValue('estado', '');

        setError('cep', {message:'CEP não encontrado'});
      }
    } 
    else{
      setValue('logradouro', '');
      setValue('cidade', '');
      setValue('bairro', '');
      setValue('estado', '');

      //setError('cep', {message:'CEP não encontrado'});
    }

    setValue('cep', cepMask(value))
    setDataSave(valor);
    
  }

  const handleNumero = (value: string) => {
    setValue('numero', somenteNumero(value));
  }

  const handleEnderecoImovel = () => {
    valor = {}
    
    handleCep(cepMask(dataProcesso?.imovel.cep));

    setValue('cep', dataProcesso.imovel.cep);
    setValue('numero', dataProcesso?.imovel.numero);
    setValue('unidade', dataProcesso?.imovel.unidade);
    setValue('complemento', dataProcesso?.imovel.complemento);

    valor.bloco = index;
    valor.usuario_id = usuario?.id || localStorage.getItem('usuario_cadastro_id') || '';
    // valor.processo_id = usuario?.processo_id || idProcesso;
    valor.processo_id = !!idProcesso ? idProcesso : data.processo_id,
    // valor.pj_representante_id = dataUrl.user === 'pessoa-juridica' ? dataUrl?.index ? dataUrl.index[0] : '' : '',
    // valor.pj_representante_id = dataUrl.user === 'pessoa-juridica' ? dataUrl?.index[0] : !data.vinculo_empresa_id ? '' : data.vinculo_empresa_id,
    valor.tipo_usuario = dataUrl.users || tipo;
    //valor.tipo_pessoa = dataUrl.user === 'pessoa-fisica' ? 'fisica' : 'empresa';
    valor.tipo_pessoa = userData?.tipo_pessoa;
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
    
    setBlockSave(valor);
  }

  const handleInput = (type: any) => {
    // let valor: any = {
    //   'bloco': index,
    //   'usuario_id': usuario?.id || localStorage.getItem('usuario_cadastro_id') || '',
    //   'processo_id': usuario?.processo_id || idProcesso,
    //   'tipo_usuario': 'vendedor',
    //   'tipo_pessoa': dataUrl.user === 'pessoa-fisica' ? 'fisica' : 'empresa',
    //   'cep': watch("cep"),
    //   'logradouro': watch("logradouro"),
    //   'numero': watch("numero"),
    //   'unidade': watch("unidade"),
    //   'complemento': watch("complemento"),
    //   'cidade': watch("cidade"),
    //   'estado': watch("estado"),
    //   'bairro': watch("bairro"),
    // }

    let valorPessoa = 0;

    

    if(dataUrl?.user === 'pessoa-fisica'){
      valorPessoa = 0;
    }
    else{
      valorPessoa = 1;
    }

    valor.usuario_id = usuario?.id || localStorage.getItem('usuario_cadastro_id') || '';
    valor.tipo_pessoa = userData?.tipo_pessoa;
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
      <div className={styles.containerBlock}>
        <div className={styles.headerBlock}>
          {
              perfil === 'Pós-venda' 
              ? <h2>Endereço</h2>
              :<>
                  <h3>{userData?.tipo_pessoa === 0 ? `Onde mora a pessoa ${tipo}a ?` : 'Onde fica a empresa?' }</h3>
              </>
          }
        </div>

        {/*Se for vendedor*/}
        <div className="pd20">
          {
            tipo === 'vendedor' &&
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

          {/*<div className="form-container">
            {arrayForm.map((campo, index) => { 
              const name = campo.name as keyof FormValues;
              
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

        {   
            // Quando for Pós-venda
            (perfil === 'Pós-venda' || perfil === 'Coordenadora de Pós-Negociação') &&
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
        
        {
          (Footer && handlePrevBlock && handleNextBlock && blocksLength ) &&
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
