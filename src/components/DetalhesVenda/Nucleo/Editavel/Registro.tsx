import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import InputText from "@/components/InputText/Index";
import { FieldErrors, useForm } from 'react-hook-form'
import styles from './BlockStyles.module.scss'
import Image from "next/image";
import Single from "@/images/single.png";
import dateMask from "@/functions/dateMask";
import InputSelect from "@/components/InputSelect/Index";
import ImovelContext from '@/context/Vendas/ContextBlocks';
import somenteNumero from "@/functions/somenteNumero";
import Alert from '@mui/material/Alert';
import { FaExclamationCircle } from 'react-icons/fa';
import { HiCheck } from 'react-icons/hi2';

interface FormValues {
  escritura: string;
  vagas: string;
  matricula: string;
  inscricaoMunicipal: string;
  rgi: string;
  lavrada: string;
  livro: string;
  folha: string;
  ato: string;
  cartorio: string
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

const Registro: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer, handleShow, setBlockSave, saveBlocks, blocksLength }) => {
  const errorMsg = 'Campo obrigatório';
  const [open, setOpen] = useState(false);
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
      //
      escritura: data?.informacao?.escritura || '',
      vagas: data?.informacao?.vaga || '',
      matricula: data?.informacao?.matricula || '',
      inscricaoMunicipal: data?.informacao?.inscricaoMunicipal || '',
      rgi: data?.informacao?.rgi || '',
      lavrada: data?.informacao?.lavrada || '',
      livro: data?.informacao?.livro || '',
      folha: data?.informacao?.folha || '',
      ato: data?.informacao?.ato || '',
      cartorio: data?.informacao?.cartorio || '',
    }
  });

  const arrayEscritura: any[] = [
    { id: '0', name: 'Selecione o tipo de escritura' },
    { id: '1', name: 'Escritura Pública de Compra e Venda' },
    { id: '2', name: 'Escritura de Pública Promessa de Compra e Venda' },
    { id: '3', name: 'Escritura Pública Promessa Cessão de Direitos Aquisitivos' },
    { id: '4', name: 'Escritura Pública de Cessão de Direitos Aquisitivos' },
    { id: '5', name: 'Escritura Pública de Promessa de Compra e Venda e Bem Futuro' },
    { id: '6', name: 'Escritura Publica de Cessão de Direitos Aquisitivos' },
    { id: '7', name: 'Escritura Pública de Doação e Escritura Pública de Inventário' }
  ];

  const handleLavrada = (value: string) => {
    setValue('lavrada', dateMask(value));
    if (value.length < 10) {
      setError('lavrada', { message: 'Formato de data errado' });
    }
    else {
      clearErrors('lavrada');
    }
  };

  const handleVagas = (value: string) => {
    setValue('vagas', somenteNumero(value));
  };

  const handleInput = (type: any) => {
    let valor: any = {
      'bloco': 2,
      'processo_id': data.processo_id,
      'usuario_id': localStorage.getItem('usuario_id'),
      'escritura': watch("escritura"),
      'vagas': watch("vagas"),
      'matricula': watch("matricula"),
      'inscricaoMunicipal': watch("inscricaoMunicipal"),
      'rgi': watch("rgi"),
      'lavrada': watch("lavrada"),
      'livro': watch("livro"),
      'folha': watch("folha"),
      'ato': watch("ato"),
      'cartorio': watch("cartorio"),
    }

    valor[type] = watch(type);
    // setDataSave(valor);
    setBlockSave(valor);

    if (watch("cartorio") != '') {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleCloseTips = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={styles.containerBlock}>
        <div className={styles.headerBlock}>
          {
            perfil === 'Pós-venda' ?
              <h2>Registro e Escritura</h2>
              :
              <>
                <h3>Também precisamos da Escritura</h3>
                <p className="p1">Fique atento com possíveis pendências no cadastro.</p>
              </>
          }
        </div>

        <div className="content">

          <div className="row-f row-f-2">
            <InputSelect
              option={arrayEscritura}
              label={'Escritura *'}
              placeholder={'Selecione o tipo de escritura'}
              error={!!errors.escritura ? true : false}
              msgError={errors.escritura}
              required={true}
              sucess={!errors.escritura && !!watch('escritura')}
              value={watch('escritura') || '0'}
              defaultValue={'0'}
              {...register('escritura', {
                validate: (value) => {
                  if (value === '0') {
                    return "Nenhuma escritura foi selecionada";
                  }
                },
                required: errorMsg,
                onChange: (e) => handleInput('escritura')
              })}
              inputProps={{ 'aria-label': 'Without label' }}
            />

            <InputText
              label={'Vagas na escritura'}
              placeholder={'Quantidade de vagas na garagem'}
              sucess={!errors.vagas && !!watch('vagas')}
              {...register('vagas', {
                required: false,
                onChange: (e) => [handleInput('vagas'), handleVagas(watch('vagas'))]
              })}
            />
          </div>

          <div className="row-f">
            <InputText
              label={'Matrícula nº'}
              placeholder={'Ex: 176584755'}
              error={!!errors.matricula ? true : false}
              msgError={errors.matricula}
              required={true}
              sucess={!errors.matricula && !!watch('matricula')}
              {...register('matricula', {
                required: errorMsg,
                onChange: (e) => handleInput('matricula')
              })}
            />

            <InputText
              label={'Inscrição Municipal'}
              placeholder={'Ex: 345367788'}
              error={!!errors.inscricaoMunicipal ? true : false}
              msgError={errors.inscricaoMunicipal}
              required={true}
              sucess={!errors.inscricaoMunicipal && !!watch('inscricaoMunicipal')}
              {...register('inscricaoMunicipal', {
                required: errorMsg,
                onChange: (e) => handleInput('inscricaoMunicipal')
              })}
            />

            <InputText
              label={'RGI'}
              placeholder={'Ex: 25'}
              error={!!errors.rgi ? true : false}
              msgError={errors.rgi}
              required={true}
              sucess={!errors.rgi && !!watch('rgi')}
              {...register('rgi', {
                required: errorMsg,
                onChange: (e) => handleInput('rgi')
              })}
            />

            <InputText
              label={'Cartório'}
              placeholder={'Ex: 17º'}
              required={false}
              sucess={!errors.cartorio && !!watch('cartorio')}
              {...register('cartorio', {
                required: false,
                onChange: (e) => handleInput('cartorio')
              })}
            />
          </div>

          <div className="row-f">
            <InputText
              label={'Lavrada em'}
              placeholder={'Ex: DD/MM/AAAA'}
              required={false}
              sucess={!errors.lavrada && watch('lavrada').length === 10}
              inputProps={{
                maxWidth: 10
              }}
              {...register('lavrada', {
                required: false,
                minLength: 10,
                onChange: (e) => [handleLavrada(watch('lavrada')), handleInput('lavrada')]
              })}
            />

            <InputText
              label={'Livro'}
              placeholder={'Ex: SC-345'}
              required={false}
              sucess={!errors.livro && !!watch('livro')}
              {...register('livro', {
                required: false,
                onChange: (e) => handleInput('livro')
              })}
            />

            <InputText
              label={'Folha'}
              placeholder={'Ex: 25'}
              required={false}
              sucess={!errors.folha && !!watch('folha')}
              {...register('folha', {
                required: false,
                onChange: (e) => handleInput('folha')
              })}
            />

            <InputText
              label={'Ato'}
              placeholder={'Ex: 3425345'}
              required={false}
              sucess={!errors.ato && !!watch('ato')}
              {...register('ato', {
                required: false,
                onChange: (e) => handleInput('ato')
              })}
            />
          </div>
                  {(open && perfil === 'Gerente') && (
                      <Alert
                          className='alert yellow'
                          icon={<FaExclamationCircle size={20} />}
                          onClose={handleCloseTips}
                          //severity={feedbackRestaurar.error ? "error" : "success"}
                          variant="filled"
                          sx={{ width: '100%' }}
                      >
                          Para evitar erros, preencha com o <b>cartório que consta na Ônus Reais</b> do imóvel.
                      </Alert>
                  )}
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

export default Registro;