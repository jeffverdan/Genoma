import React, { useState, useEffect, useContext } from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import { useForm } from 'react-hook-form'
import styles from './BlockStyles.module.scss'
import TextArea from "@/components/TextArea";
import InputText from "@/components/InputText/Index";
import SwitchButton from "@/components/SwitchButton";
//import ImovelContext from '@/context/ImovelContext';
import UsersContext from '@/context/Vendas/ContextBlocks';
import { useRouter } from 'next/router';
import InputPhone from '@/components/InputPhone';
import FocusTrap from '@mui/material/Unstable_TrapFocus';
import Alert from '@mui/material/Alert';
import { FaExclamationCircle } from 'react-icons/fa';
import { HiCheck } from 'react-icons/hi2';
import Pessoa from '@/interfaces/Users/userData';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';

interface FormValues {
  nomeProcurador: string;
  ddiProcurador: string,
  telefoneProcurador: string;
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

const Procurador: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer, handleShow, setBlockSave, saveBlocks, type, processoId, blocksLength, userData }) => {
  const perfil = localStorage.getItem('perfil_login');
  const tipo = type === 'vendedores' ? 'vendedor' : type === 'compradores' ? 'comprador' : 'gerente'

  const {
    dataSave, setDataSave,
    idProcesso, selectItem,
    dataUsuario,
    concluirForm, setConcluirForm,
  } = useContext(UsersContext);

  // const usuario: Pessoa = !!dataUsuario ? dataUsuario : data;
  const usuario = userData;
  const defaultValues = {
    nomeProcurador: usuario?.procurador?.nome,
    ddiProcurador: usuario?.procurador?.ddi || '+55',
    telefoneProcurador: usuario?.procurador?.telefone
  };
  const errorMsg = 'Campo obrigatório';
  const router = useRouter()
  const dataUrl: any = router.query;
  const [checked, setChecked] = useState(usuario?.procurador?.nome ? true : false);
  const [open, setOpen] = useState(false);

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
    'bloco': 2/*index///*/,
    //'processo_id': usuario?.processo_id || idProcesso,
    'processo_id': !!idProcesso ? idProcesso : data.processo_id,
    'usuario_id': usuario?.id || '',
    // 'usuario_id': (dataUrl.user === 'pessoa-juridica' ? dataUrl?.index[2] : usuario?.id ) || localStorage.getItem('usuario_cadastro_id') || '',
    //'pj_representante_id': dataUrl.user === 'pessoa-juridica' ? dataUrl?.index[0] : '',
    // 'pj_representante_id': dataUrl.user === 'pessoa-juridica' ? dataUrl?.index[0] : !data?.vinculo_empresa_id ? '' : data?.vinculo_empresa_id,
    'tipo_usuario': dataUrl.users || tipo, //vendedor ou comprador
    'tipo_pessoa': 0,
    //'nomeProcurador': watch("nomeProcurador"),
    //'ddiProcurador': watch("ddiProcurador"),
    //'telefoneProcurador': watch("telefoneProcurador"),
  }

  const handleCelular = (data: any, e: any, value: any, formattedValue: any) => {
    const ddi = `+${e.dialCode}`;
    let numeros = formattedValue.split(" ");
    let novoNumero = formattedValue.replace(ddi, '');

    setValue('ddiProcurador', e.dialCode);
    setValue('telefoneProcurador', novoNumero.trimStart());
    handleInput('telefoneProcurador', novoNumero.trimStart());
  }

  const handleChecked = async () => {


    if (checked === true) {
      valor.usuario_id = usuario?.id || localStorage.getItem('usuario_cadastro_id') || '';
      valor.nomeProcurador = '';
      valor.ddiProcurador = '';
      valor.telefoneProcurador = '';
      // setDataSave(valor);
      setBlockSave(valor);

      setOpen(true)

      if (setConcluirForm) setConcluirForm(true)

    }
    else {

      setValue('nomeProcurador', usuario?.procurador?.nome || '');
      setValue('ddiProcurador', usuario?.procurador?.ddi || '');
      setValue('telefoneProcurador', usuario?.procurador?.telefone || '');

      valor.usuario_id = usuario?.id || localStorage.getItem('usuario_cadastro_id') || '';
      valor.nomeProcurador = usuario?.procurador?.nome || '';
      valor.ddiProcurador = usuario?.procurador?.ddi || '+55';
      valor.telefoneProcurador = usuario?.procurador?.telefone || '';

      // if(watch('nomeProcurador') === '' && watch('telefoneProcurador') === ''){
      //   if(setConcluirForm) setConcluirForm(false)
      // }
      // else{
      //   if(setConcluirForm) setConcluirForm(true)
      // }

      // setDataSave(valor);
      setBlockSave(valor);
    }


    if (checked == false) {
      setOpen(true)
    }
  }


  //   if(checked){
  //     setOpen(true)
  //   }

  const handleInput = (type: any, value: any) => {
    valor.usuario_id = usuario?.id || localStorage.getItem('usuario_cadastro_id') || '';
    valor.nomeProcurador = watch('nomeProcurador');
    valor.ddiProcurador = watch('ddiProcurador');
    valor.telefoneProcurador = watch('telefoneProcurador');

    setValue(type, (watch(type)))

    // if(watch(type) === ''){
    //   setError(type, {message: 'Campo obrigatório'});

    //   if(setConcluirForm) setConcluirForm(false)
    // }
    // else{
    //   clearErrors(type);
    //   if(setConcluirForm) setConcluirForm(true)
    // }

    validarBtnConcluir(type);

    // setDataSave(valor);

    setBlockSave(valor);

  }

  async function validarBtnConcluir(type: any) {

    if (
      watch('nomeProcurador').length === 0
      // || watch('telefoneProcurador').length < 15      
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

  const handleCloseTips = () => {
    setOpen(false);
  };

  return (
    <FocusTrap disableEnforceFocus open>
      <>
        <div className={styles.containerBlock}>
          <div className={styles.headerBlock}>
            {
              perfil === 'Pós-venda' ?
                <h2>Procurador</h2>
                :
                <>
                  <h3>{`Quem ${type === 'vendedores' ? 'vende' : 'compra'} possui procurador?`}</h3>
                </>

            }
          </div>

          <div className="mt36 mb51" style={{ width: '400px' }}>
            <SwitchButton
              check={checked}
              setCheck={setChecked}
              handleChange={handleChecked}
              label={`Sim, quem ${type === 'vendedores' ? 'vende' : 'compra'} possui procurador(a).`}
            />
          </div>
          {(open && perfil === 'Gerente') && (
            <Alert
              className='alert yellow'
              icon={<FaExclamationCircle size={20} />}
              onClose={handleCloseTips}
              //severity='warning'
              variant="filled"
              sx={{ width: '100%' }}
            >
              Confirme se a <b>procuração está em dia</b> para evitar atrasos no processo.
            </Alert>
          )}

          {checked ?
            <div className=''>
              <div className="row-f">
                <InputText
                  label={'Nome do procurador(a)'}
                  placeholder={'Ex: José Maria da Silva'}
                  sucess={!errors.nomeProcurador && !!watch('nomeProcurador')}
                  error={!!errors.nomeProcurador ? true : false}
                  required={checked}
                  msgError={errors.nomeProcurador}
                  {...register('nomeProcurador', {
                    //required: true,
                    required: errorMsg,
                    onChange: (e) => handleInput('nomeProcurador', e.target.value)
                  })}
                />

                <InputPhone
                  value={watch('telefoneProcurador') ? watch('ddiProcurador') + watch('telefoneProcurador') : '55'}
                  label={'Celular do procurador(a)*'}
                  placeholder={'Ex: (21) 99754-4899'}
                  sucess={!errors.telefoneProcurador && !!watch('telefoneProcurador')}
                  error={!!errors.telefoneProcurador ? true : false}
                  required={checked}
                  msgError={errors.telefoneProcurador}
                  country={"br"}
                  {...register('telefoneProcurador', {
                    required: checked === true ? errorMsg : false,
                  })}
                  onChange={handleCelular}
                  isValid={(inputNumber: any, country: any) => {
                    if (country.countryCode === '55') {
                      return inputNumber.length < 12 ? false : true;
                    } else {
                      return inputNumber.length < 6 ? false : true;
                    }
                  }}
                />
              </div>
              {open && (
                <Alert
                  className='alert yellow'
                  icon={<FaExclamationCircle size={20} />}
                  onClose={handleCloseTips}
                  //severity='warning'
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                  Confirme se a <b>procuração está em dia</b> para evitar atrasos no processo.
                </Alert>
              )}
            </div>
            :
            ''}

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
    </FocusTrap>
  );
};

export default Procurador;