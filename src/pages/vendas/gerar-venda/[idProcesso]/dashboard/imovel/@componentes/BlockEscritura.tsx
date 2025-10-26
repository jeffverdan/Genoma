import React, { ChangeEvent, useContext, useState, useEffect } from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import InputText from "@/components/InputText/Index";
import { FieldErrors, useForm } from 'react-hook-form'
import styles from './BlocksStyles.module.scss'
import Image from "next/image";
import Single from "@/images/single.png";
import dateMask from "@/functions/dateMask";
import InputSelect from "@/components/InputSelect/Index";
import ImovelContext from '@/context/Vendas/ContextBlocks';
import somenteNumero from "@/functions/somenteNumero";
import Alert from '@mui/material/Alert';
import { FaExclamationCircle } from 'react-icons/fa';
import AlertCopyIA from '@/components/AlertIACopy';
import CheckBox from '@/components/CheckBox';
import ImovelData from '@/interfaces/Imovel/imovelData';
import SaveDocument from '@/apis/saveDocument';
import getFunesbom from '@/apis/apiFunesbom';
import CircularLoading from '@/components/CircularLoading';
import { CircularProgress } from '@mui/material';
import getEfiteutica from '@/apis/apiEfiteutica';
import { CheckEfiteutica, CheckFunesbom } from '@/components/AutoSaveCertidoes';
import useLaudemiosData  from '@/components/ListasNova';
import FeedbackCertidoes from '@/components/FeedbackCertidoes';
import { ItemType } from '@/components/FeedbackCertidoes/interface';

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
  pendenciasImovel: {
    card_id: string | number,
    dividasIptu_id: string | number,
    nonoDistrito_id: string | number,
    taxaIncendioAtrasada_id: string | number,
    taxaIncendioAtrasada: boolean,
    dividasIptu: boolean,
    nonoDistrito: boolean,
  }
}

type BlockProps = {
  handleNextBlock: (index: number) => void;
  handlePrevBlock: (index: number) => void;
  index: number;
  data: ImovelData;
  Footer: React.FC<{
    goToPrevSlide: (index: number) => void;
    goToNextSlide: any;
    index: number;
  }>
};

const BlockPage: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer }) => {
  const {
    dataSave, setDataSave, selectItem
  } = useContext(ImovelContext);

  const errorMsg = 'Campo obrigatório';

  const [open, setOpen] = useState(false);
  const [errorInscricao, setErrorInscricao] = useState(false);

  const [checkedTaxaIncendio, setCheckedTaxaIncendio] = useState(false);
  const [checkedDividasIptu, setCheckedDividasIptu] = useState(false);
  const [checkedNonoDistribuidor, setCheckedNonoDistribuidor] = useState(false);

  const [openCertidoes, setOpenCertidoes] = useState(false);
  const [checkItems, setCheckItems] = useState([] as ItemType[]);
  const [debitos, setDebitos] = useState<number>();
  const [progressBar, setProgressBar] = useState([{
    percent: -1,
    status: 'Salvando certidão...',
  }])

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
      pendenciasImovel:
      {
        taxaIncendioAtrasada: data?.pendencias?.taxaIncendioAtrasada || false,
        dividasIptu: data?.pendencias?.dividasIptu || false,
        nonoDistrito: data?.pendencias?.nonoDistrito || false,
        card_id: data?.pendencias?.card_id || '',
        dividasIptu_id: data?.pendencias?.dividasIptu_id || '',
        nonoDistrito_id: data?.pendencias?.nonoDistrito_id || '',
        taxaIncendioAtrasada_id: data?.pendencias?.taxaIncendioAtrasada_id || '',
      }
    }
  });

  useEffect(() => {
    const returnPendencias = async () => {
      setCheckedTaxaIncendio(!!data?.pendencias?.taxaIncendioAtrasada);
      setCheckedDividasIptu(!!data?.pendencias?.dividasIptu);
      setCheckedNonoDistribuidor(!!data?.pendencias?.nonoDistrito);
    }
    returnPendencias()
  }, [])

  if (index === selectItem) {
    console.log("Form: ", watch());
    console.log("Error: ", errors);
  };

//   const arrayEscritura: any[] = [
//     { id: '0', name: 'Selecione o tipo de escritura' },
//     { id: '1', name: 'Escritura Pública de Compra e Venda' },
//     { id: '2', name: 'Escritura de Pública Promessa de Compra e Venda' },
//     { id: '3', name: 'Escritura Pública Promessa Cessão de Direitos Aquisitivos' },
//     { id: '4', name: 'Escritura Pública de Cessão de Direitos Aquisitivos' },
//     { id: '5', name: 'Escritura Pública de Promessa de Compra e Venda e Bem Futuro' },
//     { id: '6', name: 'Escritura Publica de Cessão de Direitos Aquisitivos' },
//     { id: '7', name: 'Escritura Pública de Doação e Escritura Pública de Inventário' }
//   ]

  const { arrayEscritura } = useLaudemiosData();

  const handleClick = (direction: string) => {
    if (direction === 'NEXT') {
      handleNextBlock(index);
    } else {
      handlePrevBlock(index);
    }
  };

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
  }

  const handlePendeciasImovel = (e: any, index: number) => {
    const checked = e.target.checked;
    const value = e.target.value;

    if (value === "1") {
      setCheckedTaxaIncendio(checked);
      setValue(`pendenciasImovel.taxaIncendioAtrasada`, checked);
    } else if (value === "2") {
      setCheckedDividasIptu(checked);
      setValue(`pendenciasImovel.dividasIptu`, checked);
    } else if (value === "3") {
      setCheckedNonoDistribuidor(checked);
      setValue(`pendenciasImovel.nonoDistrito`, checked);
    }
  };

  const handleInput = (type: any) => {
    if (type === 'inscricaoMunicipal') setErrorInscricao(false);

    let valor: any = {
      'bloco': index,
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
      'pendenciasImovel': watch('pendenciasImovel')
    }

    valor[type] = watch(type);
    setDataSave(valor);

    if (watch("cartorio") != '') {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  const handleCloseTips = () => {
    setOpen(false);
  };

  const onCheckFunesbom = async (inscricao: string) => {
    const funesbomDoc = data.imovel?.documentos.find((doc) => doc.tipo_documento_ids.find((tipo: any) => tipo.tipo_documento_id === 11));
    if(!funesbomDoc) { 
      checkItems.push({ loading: true, label: 'Consultando Funesbom...', doc: 'funesbom' });
    }
    const res = await CheckFunesbom({ inscricao, data, funesbom: true, efiteutica: true, progressBar, setProgressBar });
    console.log(res);
    if (res?.funesbom?.error === "Inscrição ou Município inválido") {
      setErrorInscricao(true);
      checkItems.forEach((item) => {
        if (item.doc === 'funesbom') {
          item.label = 'Funesbom: Inscrição ou Município inválido';
          item.error = true;          
          item.loading = false;
        }
      });
      setCheckItems([...checkItems]);
    } else if (!!res?.funesbom?.error) {
      checkItems.forEach((item) => {
        if (item.doc === 'funesbom') {
          item.label = 'Funesbom: ' + (res.funesbom?.error || 'Não encontrada');
          item.error = true;          
          item.loading = false;
        }
      });
      setCheckItems([...checkItems]);
    } else if (!!res?.funesbom?.certidao_pdf) {
      checkItems.forEach((item) => {
        if (item.doc === 'funesbom') {
          item.label = 'Certidão de Funesbom encontrada';
          item.loading = false;
        }
      });
      setCheckItems([...checkItems]);
    }
    if (!!res?.funesbom?.debitos) {
      setCheckedTaxaIncendio(true);
      setValue('pendenciasImovel.taxaIncendioAtrasada', true)
      setDebitos(res.funesbom.debitos);
    }
  };

  const onCheckEfiteutica = async (inscricao: string) => {
    const efiteuticaDoc = data.imovel?.documentos.find((doc) => doc.tipo_documento_ids.find((tipo: any) => tipo.tipo_documento_id === 6));
    if(!efiteuticaDoc) { 
      checkItems.push({ loading: true, label: 'Consultando Efiteutica...', doc: 'efiteutica' });  
    }
    const res = await CheckEfiteutica({ inscricao, data, funesbom: true, efiteutica: true, progressBar, setProgressBar });
    console.log(res);
    if (res?.efiteutica?.error === "Inscrição ou Município inválido") {
      setErrorInscricao(true);
      checkItems.forEach((item) => {
        if (item.doc === 'efiteutica') {
          item.label = 'Efiteutica: Inscrição inválida';
          item.error = true;          
          item.loading = false;
        }
      });
      setCheckItems([...checkItems]);
    } else if (!res?.efiteutica?.certidao_Base64) {
      checkItems.forEach((item) => {
        if (item.doc === 'efiteutica') {
          item.label = 'Efiteutica: ' + (res?.efiteutica?.response || 'Não encontrada');
          item.error = true;          
          item.loading = false;
        }
      });
      setCheckItems([...checkItems]);
    } else if (!!res?.efiteutica?.certidao_Base64) {
      checkItems.forEach((item) => {
        if (item.doc === 'efiteutica') {
          item.label = 'Certidão de Efiteutica encontrada';
          item.loading = false;
        }
      });
      setCheckItems([...checkItems]);
    }
  }

  const onCheckCertidoes = async () => {
    const inscricao = watch('inscricaoMunicipal') || '';
    if(!inscricao || inscricao.length < 5) return;
    setOpenCertidoes(true);
    onCheckFunesbom(inscricao);
    onCheckEfiteutica(inscricao);    
  };

  useEffect(() => {
    if (openCertidoes) {
      const checks = checkItems.every((item) => !item.loading );      
      
      if(checks) {
        setTimeout(() => {
          setOpenCertidoes(false);
          setCheckItems([]);
        }, 5000);
      }
    }
  }, [checkItems]);

  return (
    <>
      <FeedbackCertidoes open={openCertidoes} items={checkItems} />
      <div className={styles.containerBlock}>
        <div className={styles.headerBlock}>
          <h3>Escritura e Condições Necessárias do Imóvel</h3>
          <AlertCopyIA />
          <p className="p1"></p>
        </div>

        <div className="content mt36">

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
              disabled={openCertidoes}
              iconBefore={openCertidoes ? <CircularProgress size={20} /> : ''}
              required={true}
              onBlurFunction={onCheckCertidoes}
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

          <>
            <p className="p1" style={{ marginBottom: '20px' }}>Marque abaixo se o imóvel tiver <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>alguma pendência:</span></p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <CheckBox
                label={'Taxa de Incêndio em atraso'}
                value={'1'}
                disabled={!!debitos}
                checked={checkedTaxaIncendio}
                {...register('pendenciasImovel.taxaIncendioAtrasada', {
                  onChange: (e) => [handlePendeciasImovel(e, 0), handleInput('')],
                })}
              />

              <CheckBox
                label={'Dívidas de IPTU'}
                value={'2'}
                checked={checkedDividasIptu}
                {...register('pendenciasImovel.dividasIptu', {
                  onChange: (e) => [handlePendeciasImovel(e, 1), handleInput('')],
                })}
              />

              <CheckBox
                label={'9o Distribuidor de Execuções Fiscais'}
                value={'3'}
                checked={checkedNonoDistribuidor}
                {...register('pendenciasImovel.nonoDistrito', {
                  onChange: (e) => [handlePendeciasImovel(e, 2), handleInput('')],
                })}
              />
            </div>
          </>

          <div className='alerts-escritura'>
            {!!errorInscricao && (
              <Alert
                className='alert yellow'
                icon={<FaExclamationCircle size={20} />}
                onClose={handleCloseTips}
                //severity={feedbackRestaurar.error ? "error" : "success"}
                variant="filled"
                sx={{ width: '100%' }}
              >
                Numero de <b>inscrição</b> não encontrada. Por favor, verifique a <b>inscrição municipal</b>.
              </Alert>
            )}

            {!!debitos && (
              <Alert
                className='alert yellow'
                icon={<FaExclamationCircle size={20} />}
                onClose={handleCloseTips}
                //severity={feedbackRestaurar.error ? "error" : "success"}
                variant="filled"
                sx={{ width: '100%' }}
              >
                Foram encontrados débitos pendentes relacionados a Funesbom.
              </Alert>
            )}

            {open && (
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
        </div>

        {Footer &&
          <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(() => handleClick("NEXT"))} index={index} />}
      </div>
    </>
  );
};

export default BlockPage;