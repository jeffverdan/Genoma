import React, {useEffect, useContext, useState} from 'react';
import InputText from "@/components/InputText/Index";
import InputSelect from '@/components/InputSelect/Index';
import { FieldErrors, useForm } from 'react-hook-form'
import styles from './BlocksStyles.module.scss'
import dateMask from '@/functions/dateMask';
//import ImovelContext from '@/context/ImovelContext';
import UsersContext from '@/context/Vendas/ContextBlocks';
import { useRouter } from 'next/router';
import getListaOrigemComprador from '@/apis/getListaOrigemComprador';

interface FormValues {
  meio: string;
  forma: string;
  dataContato: string;
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
    selectItem, 
    dataSave, setDataSave,
    idProcesso,
    dataUsuario,
    concluirForm, setConcluirForm
  } = useContext(UsersContext);
  
  const userName = "Sr. Genoma"
  const errorMsg = 'Campo obrigatório';
  const router = useRouter()
  const dataUrl: any = router.query;
  const usuario = dataUsuario;

  const [checkedUniaoEstavel, setCheckedUniaoEstavel] = useState(false);
  const [listaOrigem, setListaOrigem] = useState([]);
  const [listaContato, setListaContato] = useState([]);

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
      meio: usuario?.origin_cliente?.origem || '',
      forma: usuario?.origin_cliente?.forma_contato || '',
      dataContato: dateMask(usuario?.origin_cliente?.data_entrada) || '',
    }
  });

  useEffect(() => {
    const returnOrigemComprador = async () =>{
      const origem: any = await getListaOrigemComprador();
      setListaOrigem(origem?.lista_origem);
      setListaContato(origem?.lista_contato);
    }
    returnOrigemComprador()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  let tiposMeio = [
   {id: '0', name: 'Selecione'},
  ];
  const listaTipoOrigem = tiposMeio?.concat(listaOrigem);

  
  const tiposForma = [
    { name: 'Selecione', id: '0' }
  ];
  const listaFormaContato = tiposForma?.concat(listaContato);
  

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


  const handleInput = (type: any, value: string) => {
    if(type === 'dataContato'){
      setValue(type, dateMask(watch(type)))
    }

    let valor: any = {
      'bloco': 4,
      'processo_id': usuario?.processo_id || idProcesso,
      'usuario_id': usuario?.id || localStorage.getItem('usuario_cadastro_id') || '',
      'pj_representante_id': dataUrl?.user === 'pessoa-juridica' && !!dataUrl?.index ? dataUrl?.index[0] : '',
      'tipo_usuario': dataUrl?.users, //vendedor ou comprador
      'tipo_pessoa': dataUrl?.user === 'pessoa-fisica' ? 0 : 1,
      'meio': watch('meio'),
      'forma': watch('forma'),
      'dataContato': watch('dataContato'),
      'id_origem_processo': usuario?.origin_cliente?.id
    }

    validarBtnConcluir(type);

    //valor[type] = watch(type);
    setDataSave(valor);
    console.log('Data save' , dataSave);
    console.log('Valores Form: ' , valor)
  }

  async function validarBtnConcluir(type: any){
    if(
      watch('dataContato').length < 10 
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
          <h3>Como a pessoa compradora entrou em contato?</h3>
          <p className="p1"></p>
        </div>

        <div className="content">
          <div className="row-f">
            <InputSelect
              option={listaOrigem ? listaTipoOrigem : tiposMeio}
              label={'Qual foi o meio? *'}
              placeholder={'Zap Imóveis, placa de rua..'}
              error={!!errors.meio ? true : false}
              msgError={errors.meio}
              required={true}
              sucess={!errors.meio && !!watch('meio')}
              value={watch('meio') || '0'}
              defaultValue={'0'}
              {...register('meio', {
                validate: (value) => {
                  if (value === '0') {
                      return "Nenhum estado civil foi selecionada";
                  }
                },
                required: errorMsg,
                onChange: (e) => handleInput('meio', e.target.value)
              })}
              inputProps={{ 'aria-label': 'Without label' }}
            >
            </InputSelect>

            <InputSelect 
              option={listaContato ? listaFormaContato : tiposForma}
              label={'E a forma de contato*'}
              placeholder={'E-mail, WhatsApp...'}
              error={!!errors.forma ? true : false}
              msgError={errors.forma}
              required={true}
              sucess={!errors.forma && !!watch('forma')}
              value={watch('forma') || '0'}
              defaultValue={'0'}
              {...register('forma', {
                validate: (value) => {
                  if (value === '0') {
                      return "Nenhum regime casamento foi selecionada";
                  }
                },
                required: errorMsg,
                onChange: (e) => handleInput('regimeCasamento', e.target.value)
              })}
              inputProps={{ 'aria-label': 'Without label' }}
            />

            <InputText
                label={'Quando?*'}
                placeholder={'Ex: dd/mm/aaaa'}
                sucess={!errors.dataContato && watch('dataContato').length === 10}
                error={!!errors.dataContato ? true : false}
                required={true}
                msgError={errors.dataContato}
                value={watch('dataContato')}
                inputProps={{
                  maxLength: 10
                }}
                {...register('dataContato', {
                  //required: true,
                  required: errorMsg,
                  setValueAs: e => dateMask(e),
                  validate: (value) => value.length === 10 || "Data inválida",
                  onChange: (e) => handleInput('dataContato',  e.target.value)
                })}
            />
          </div>
        </div>
        {Footer && 
        <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(() => handleClick("NEXT"))} index={index}  />}
      </div>
    </>
  );
};

export default BlockPage;