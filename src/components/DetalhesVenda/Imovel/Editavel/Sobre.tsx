import React, { useEffect, useContext, useState } from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import InputText from "@/components/InputText/Index";
import { FieldErrors, useForm } from 'react-hook-form'
import styles from './BlockStyles.module.scss';
import Image from "next/image";
import Single from "@/images/single.png";
import DataCep from "@/functions/DataCep";
import cepMask from "@/functions/cepMask";
import somenteNumero from "@/functions/somenteNumero";
import ImovelContext from '@/context/Vendas/ContextBlocks';
import DetalheImovelContext from '@/context/DetalheImovelContext';
import { HiArrowLeft, HiArrowRight, HiCheck } from 'react-icons/hi2';

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
  Footer?: React.FC<{
    goToPrevSlide: (index: number) => void;
    goToNextSlide: any;
    index: number;
    tipo?: string
  }>
  handleShow?: any
  setBlockSave?: any
  saveBlocks?: any
  listaDocumentos: any
  blocksLength?: number
};

const BlockPage: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer, handleShow, setBlockSave, saveBlocks, blocksLength }) => {
  const errorMsg = 'Campo obrigatório';
  const [perfil, setPerfil] = useState('');
  useEffect(() => {
    setPerfil(localStorage.getItem('perfil_login') || '')
  }, []);

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

  const handleCep = async (value: string) => {
    if (value.length === 9) {
      let dadosCep = await DataCep(value);

      if (!dadosCep.erro) {
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
      else {
        setValue('logradouro', '');
        setValue('cidade', '');
        setValue('bairro', '');
        setValue('estado', '');

        setError('cep', { message: 'CEP não encontrado' });
      }
    }
    else {
      setValue('logradouro', '');
      setValue('cidade', '');
      setValue('bairro', '');
      setValue('estado', '');
    }

    setValue('cep', cepMask(value))
  };

  const handleNumero = (value: string) => {
    setValue('numero', somenteNumero(value));
  };

  const handleInput = (type: any) => {
    let valor: any = {
      'bloco': 1,
      'processo_id': data.processo_id,
      'usuario_id': localStorage.getItem('usuario_id'),
      'numero': watch("numero"),
      'unidade': watch("unidade"),
      'complemento': watch("complemento")
    };

    valor[type] = watch(type);
    setBlockSave(valor);
  };

  return (
    <>
      <div className={styles.containerBlock}>
        <div className={styles.headerBlock}>
          {
            perfil === 'Pós-venda' ?
              <h2>Sobre o imóvel</h2>
              :
              <>
                <h3>O endereço do imóvel está certo?</h3>
                <p className="p1">Fique atento com possíveis pendências no cadastro.</p>
              </>

          }
        </div>

        <div className="content">

          <div className="row-f">
            <InputText
              label={'Código do Imóvel*'}
              placeholder={'Ex.: ABCDEFG'}
              name="cod_imovel"
              required={true}
              disabled={true}
              sucess={true}
              defaultValue={data?.codigo}
            />
            <InputText name="hidden" style={{ display: 'none' }} />
          </div>

          <div className="row-f">
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
          Footer &&
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

export default BlockPage;