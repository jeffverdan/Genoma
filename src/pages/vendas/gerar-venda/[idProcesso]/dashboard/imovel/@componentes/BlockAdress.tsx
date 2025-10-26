import React, {useEffect, useContext} from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import InputText from "@/components/InputText/Index";
import { FieldErrors, useForm } from 'react-hook-form'
import styles from './BlocksStyles.module.scss'
import Image from "next/image";
import Single from "@/images/single.png";
import DataCep from "@/functions/DataCep";
import cepMask from "@/functions/cepMask";
import somenteNumero from "@/functions/somenteNumero";
import ImovelContext from '@/context/Vendas/ContextBlocks';

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
    selectItem, setDataSave,
  } = useContext(ImovelContext);
  
  const userName = "Sr. Genoma"
  const errorMsg = 'Campo obrigatório';

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
      cep: cepMask(data?.cep) || '',
      logradouro: data?.logradouro || '',
      numero: data?.numero || '',
      unidade: data?.unidade || '',
      complemento: data?.complemento || '',
      cidade: data?.cidade || '',
      estado: data?.uf || '',
      bairro: data?.bairro || ''
    }
  });

  if(index === selectItem) {
    console.log("Form: ", watch());
    console.log("Error: ", errors);
  };

  const handleClick = (direction: string) => {
    if (direction === 'NEXT') {
      handleNextBlock(index);
    } else {
      handlePrevBlock(index);
    }

  };

  const handleCep = async (value: string) => {
    if(value.length === 9){
      let dadosCep = await DataCep(value);

      if(!dadosCep.erro){
        setValue('logradouro', dadosCep.logradouro);
        setValue('cidade', dadosCep.localidade);
        setValue('bairro', dadosCep.bairro);
        setValue('estado', dadosCep.uf);

        clearErrors('cep');
        clearErrors('logradouro');
        clearErrors('cidade');
        clearErrors('bairro');
        clearErrors('estado');
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
  }

  const handleNumero = (value: string) => {
    setValue('numero', somenteNumero(value));
  }

  const handleInput = (type: any) => {
    let valor: any = {
      'bloco': index,
      'processo_id': data.processo_id,
      'usuario_id': localStorage.getItem('usuario_id'),
      'numero': watch("numero"),
      'unidade': watch("unidade"),
      'complemento': watch("complemento")
    }

    valor[type] = watch(type);
    console.log('Valor: ', valor);
    setDataSave(valor);
  }

  return (
    <>
      <div className={styles.containerBlock}>
        <div className={styles.headerBlock}>
          <h3>O endereço do imóvel está certo?</h3>
          <p className="p1">Fique atento com possíveis pendências no cadastro.</p>
        </div>

        <div className="content">

          <div className="row-f">
            {}
            <InputText
                label={'CEP'}
                placeholder={'Ex.: 22031-050'}
                error={!!errors.cep ? true : false}
                msgError={errors.cep}
                required={true}
                disabled={true}
                sucess={!errors.cep && watch('cep').length === 9}
                inputProps={{
                  maxLength: 9
                }}
                {...register('cep', {
                  required: errorMsg,
                  onChange: (e) => handleCep(watch('cep'))
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
        <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(() => handleClick("NEXT"))} index={index}  />}
      </div>
    </>
  );
};

export default BlockPage;