import React, { useEffect, useContext, useState } from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import InputText from "@/components/InputText/Index";
import InputSelect from '@/components/InputSelect/Index';
import InputPhone from '@/components/InputPhone';
import { FieldErrors, useForm } from 'react-hook-form'
import styles from './BlocksStyles.module.scss'
import Image from "next/image";
import Single from "@/images/single.png";
import DataCep from "@/functions/DataCep";
import cepMask from "@/functions/cepMask";
import somenteNumero from "@/functions/somenteNumero";
import cpfMask from '@/functions/cpfMask';
import dateMask from '@/functions/dateMask';
import validarCPF from '@/functions/validarCPF';
//import ImovelContext from '@/context/ImovelContext';
import UsersContext from '@/context/Vendas/ContextBlocks';
import CheckBox from '@/components/CheckBox';
import { useRouter } from 'next/router';
import getCpfDadosUsuario from '@/apis/getCpfDadosUsuario';
import { HiExclamation } from 'react-icons/hi';
import { Troubleshoot } from '@mui/icons-material';
import getUsuariosProcesso from '@/apis/getUsuariosProcesso';
import GlobalContext from '@/context/GlobalContext';
import Alert from '@mui/material/Alert';
import { FaExclamationCircle } from 'react-icons/fa';
import AlertCopyIA from '@/components/AlertIACopy';
import getCPF from '@/apis/apiCPF';
import CircularLoading from '@/components/CircularLoading';
import { CircularProgress } from '@mui/material';
import { CheckDebitoTrabalista } from '@/components/AutoSaveCertidoes';
import { ItemType } from '@/components/FeedbackCertidoes/interface';
import FeedbackCertidoes from '@/components/FeedbackCertidoes';

interface FormValues {
  api_id?: number | string;
  usuario_id: number | string;
  cpf: string;
  dataNascimento: string;
  genero: string;
  nome: string;
  nomeMae: string;
  nomePai: string;
  nacionalidade: string;
  ddi: string;
  celular: string;
  profissao: string;
  email: string;
  rg: string;
  rgExpedido?: string;
  rgDataExpedicao: string;
  estadoCivil: any | number;
  regimeCasamento: any | number;
  uniaoEstavel: any | boolean;
  
  //conjuge
  conjuge: string;
  cpf_conjuge: string;
  usuario_id_conjuge:  number | string;
  mae_conjuge: string;
  data_nascimento_conjuge: string;
  genero_conjuge:  string;

  socio: boolean,
  representante: boolean,
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

type Progress = {
  percent: number;
  status: string;
}[]

const BlockPage: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer }) => {

  //const [concluirForm, setConcluirForm] = useState(true)

  const {
    dataProcesso,
    setDataProcesso,
    selectItem,
    dataSave, setDataSave,
    idProcesso,
    dataUsuario, setDataUsuario,
    progress, setProgress,
    concluirForm, setConcluirForm,
    setLoading,
    loadingDocumentos, setLoadingDocumentos
  } = useContext(UsersContext);

  // const {concluirForm, setConcluirForm} = useContext(GlobalContext)

  console.log(progress);

  const userName = "Sr. Genoma"
  const errorMsg = 'Campo obrigatório';
  const router = useRouter()
  const dataUrl: any = router.query;
  const usuario = dataUsuario;
  const [checkedUniaoEstavel, setCheckedUniaoEstavel] = useState(usuario?.uniao_estavel === 'S' ? true : false || false);
  const [phoneValue, setPhoneValue] = useState('+55 (21) 99999-9999');
  const [checkedSocio, setCheckedSocio] = useState(false);
  const [checkedRepresentante, setCheckedRepresentante] = useState(true);
  const [primeiroRepresentante, setPrimeiroRepresentante] = useState(false);
  const [qtdRep, setQtdRep] = useState<any>(0);
  const [perfilGerente, setPerfilGerente] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSecond, setopenSecond] = useState(false);
  const [loadingCPF, setLoadingCPF] = useState(false);
  const [openCertidoes, setOpenCertidoes] = useState(false);
  const [checkItems, setCheckItems] = useState([] as ItemType[]);
  const [progressBar, setProgressBar] = useState<Progress>([{ percent: 0, status: 'success' }]);
  const [loadingCPFConjugue, setLoadingCPFConjugue] = useState(false);
  

  console.log('usuario: ', usuario);
  console.log('Data Processo: ', dataProcesso)
  console.log('Data url: ', dataUrl);

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
      usuario_id: usuario?.id || '',
      cpf: cpfMask(usuario?.cpf_cnpj) || '',
      dataNascimento: dateMask(usuario?.data_nascimento) || '',
      genero: usuario?.genero || '',
      nome: usuario?.name || '',
      nomeMae: usuario?.nome_mae || '',
      nomePai: usuario?.nome_pai || '',
      nacionalidade: usuario?.nacionalidade || 'Brasileira',
      ddi: usuario?.ddi || '55',
      celular: usuario?.telefone || '',
      profissao: usuario?.profissao || '',
      email: usuario?.email || '',
      rg: usuario?.rg || '',
      rgExpedido: usuario?.rg_expedido || '',
      rgDataExpedicao: dateMask(usuario?.data_rg_expedido) || '',
      estadoCivil: usuario?.estado_civil || '',
      regimeCasamento: usuario?.registro_casamento || '',
      uniaoEstavel: usuario?.uniao_estavel || '',
      conjuge: usuario?.conjuge || '',
      cpf_conjuge: cpfMask(usuario?.cpf_conjuge) || '',
      usuario_id_conjuge: usuario?.usuario_id_conjuge || '',
      socio: usuario?.socio === 1 ? true : false || false,
      representante: usuario?.representante === 1 ? true : false || false
    }
  });

  console.log("Usuario: ", usuario);
  

  let quantidadeRep: any;
  useEffect(() => {
    const returnDataPJ = async () => {
      if (dataUrl.user === 'pessoa-juridica' && dataUrl.index[1] === "representante") {
        const idEmpresa: any = dataUrl.index[0];
        let listaUsuarios: any = await getUsuariosProcesso(Number(idProcesso), dataUrl.users);
        let listaUsuariosPj = listaUsuarios?.data?.filter((usuario: { tipo_pessoa: number; id: number }) => usuario.tipo_pessoa === 1 && usuario.id === parseInt(idEmpresa));
        console.log(listaUsuariosPj)

        const representanteSocio: any = listaUsuariosPj[0]?.representante_socios?.data?.length !== 0 ? listaUsuariosPj[0]?.representante_socios?.data[0]?.id : '';
        console.log(representanteSocio)
        const idRepresentante: any = dataUrl?.index[2];
        const verificaSocioRep = parseInt(idRepresentante) === representanteSocio;
        console.log(verificaSocioRep)
        setPrimeiroRepresentante(verificaSocioRep);
        const quantidadeRep = listaUsuariosPj[0]?.representante_socios?.data?.length === '' ? 0 : listaUsuariosPj[0]?.representante_socios?.data?.length;

        console.log(quantidadeRep)
        console.log(qtdRep)

        if (quantidadeRep === 0 || verificaSocioRep === true) {
          setValue('socio', true);
          setValue('representante', true);

          setCheckedSocio(true);
          setCheckedRepresentante(true);

          console.log(1)
        }
        else {
          setCheckedSocio(usuario?.socio === 1 ? true : false);
          setCheckedRepresentante(usuario?.representante === 1 ? true : false);
          console.log(2);
        }

        setQtdRep(quantidadeRep);
      }
    }
    returnDataPJ();    
  }, []);

  useEffect(() => {
    if(usuario) {      
      setPerfilGerente(usuario.perfil);
    }
  }, [usuario]);

  const tiposGenero = [
    { name: 'Selecione o gênero', id: '0' },
    { "id": 'M', name: "Masculino", },
    { "id": 'F', name: "Feminino", },
  ];

  const tipoEstadoCivil = [
    { name: 'Selecione o estado civil', id: '0' },
    { "id": '1', name: "Casado", },
    { "id": '2', name: "Solteiro", },
    { "id": '3', name: "Divorciado", },
    { "id": '4', name: "Viúvo", },
    { "id": '5', name: "Separado", }
  ];

  const tipoRegimeCasamento = [
    { name: 'Selecione o regime de casamento', id: '0' },
    { "id": '1', name: "Separação total de bens", },
    { "id": '2', name: "Separação parcial de bens", },
    { "id": '3', name: "Separação legal de bens", },
    { "id": '4', name: "Comunhão de bens", },
    { "id": '5', name: "Comunhão parcial de bens", },
  ];

  const uniaoEstavelCheck = [
    { index: 0, label: "União estável", value: '', path: "formaPagamento.uniaoEstavel", checked: checkedUniaoEstavel },
  ]

  const socioRepresentanteCheck = [
    { index: 0, label: "É representante legal da empresa.", value: '', path: "formaPagamento.uniaoEstavel", checked: checkedRepresentante },
    { index: 1, label: "Sócio", value: '', path: "formaPagamento.uniaoEstavel", checked: checkedSocio },
  ]

  if (index === selectItem) {
    console.log("Watch: ", watch());
    console.log("Error: ", errors);
  };


  const save = () => {
    let valor: any = {
      'bloco': 0/*index*/,
      'processo_id': usuario?.processo_id || idProcesso,
      // 'usuario_id': (dataUrl.user === 'pessoa-juridica' ? dataUrl?.index[2] : usuario?.id ) || localStorage.getItem('usuario_cadastro_id') || '',
      // 'usuario_id': dataUrl.user === 'pessoa-juridica' ? dataUrl?.index[2] : watch('usuario_id') || localStorage.getItem('usuario_cadastro_id') || '',
      'usuario_id': dataUrl?.user === 'pessoa-juridica'
        ? dataUrl?.index[2] !== undefined
          ? dataUrl?.index[2]
          : watch('usuario_id')
        : watch('usuario_id') || localStorage.getItem('usuario_cadastro_id') || '',
      'pj_representante_id': dataUrl.user === 'pessoa-juridica' ? dataUrl?.index[0] : '',
      'tipo_usuario': dataUrl.users, //vendedor ou comprador
      //'tipo_pessoa': dataUrl.user === 'pessoa-fisica' || dataUrl.index[1] === 'representante' ? 0 : 1,
      'tipo_pessoa': 0, // PF
      'cpf': watch('cpf'),
      'dataNascimento': watch('dataNascimento'),
      'genero': watch('genero'),
      'nome': watch('nome'),
      'nome_mae': watch('nomeMae'),
      'nome_pai': watch('nomePai'),
      'nacionalidade': watch('nacionalidade'),
      'ddi': watch('ddi'),
      'telefone': watch('celular'),
      'profissao': watch('profissao'),
      'email': watch('email'),
      'rg': watch('rg'),
      'rg_expedido': watch('rgExpedido'),
      'rg_data_expedicao': watch('rgDataExpedicao'),
      'estado_civil': watch('estadoCivil'),
      'regime_casamento': watch('regimeCasamento'),
      'uniao_estavel': watch('uniaoEstavel'),
      'conjuge': watch('uniaoEstavel') === 'S' || watch('regimeCasamento') !== '' ? watch('conjuge') : '',
      'cpf_conjuge': watch('cpf_conjuge'),
      'usuario_id_conjuge': usuario?.usuario_id_conjuge || '',
      'data_nascimento_conjuge': watch('data_nascimento_conjuge'),
      'genero_conjuge': watch('genero_conjuge'),
      'mae_conjuge': watch('mae_conjuge'),
      'socio': watch('socio') || false,
      'representante': watch('representante') || false,
      
    }
    console.log(dataUrl);
    console.log(valor)
    // console.log(dataUrl?.index);
    setDataSave(valor);
  };

  const checkDebitoTrabalista = async () => {
    const certidao = dataUsuario?.documentos?.data.find((doc: any) => doc.tipo_documento_ids.find((tipo: any) => tipo.tipo_documento_id === 50));
    if(!certidao) {
      setOpenCertidoes(true);
      await CheckDebitoTrabalista({ userData: dataUsuario, processData: dataProcesso, type: dataUrl.users, setCheckItems, checkItems, progressBar, setProgressBar });
      setCheckItems([...checkItems]);
      // setDataUsuario({...dataUsuario});
    }
  };  

  useEffect(() => {
    if (openCertidoes) {
      const checks = checkItems.every((item) => item.loading === false);
      if (checks) {
        setTimeout(() => {
          setOpenCertidoes(false);
          setCheckItems([]);
        }, 5000);
      }
    }
  }, [checkItems]);

  const handleClick = (direction: string) => {
    if (direction === 'NEXT') {
      checkDebitoTrabalista();
      handleNextBlock(index);
    } else {
      handlePrevBlock(index);
    }
  };

  const handleCpf = async (value: any) => {
    setLoadingCPF(true);

    if (!value) {
      clearErrors('cpf');
      return setLoadingCPF(false);
    }
    if (value.length === 14 && !validarCPF(value)) {
      setError('cpf', { message: 'CPF inválido' });
      setLoadingCPF(false);
      return;
    } else if (value.length === 14 && validarCPF(value)) {
      setValue('cpf', cpfMask(value));

      const cpfBanco: any = await getCpfDadosUsuario(value);
      console.log(cpfBanco);

      const pacote = Number(watch('api_id')) > 0 ? Number(watch('api_id')) : 2;
      const cpfAPI = !cpfBanco ? await getCPF({ pacote: pacote, cpfcnpj: value, }) : undefined;
      console.log(cpfAPI);

      if (!cpfBanco && !usuario?.cpf_cnpj && !cpfAPI) {

      } else if (cpfAPI?.erro) {
        setError('cpf', { message: cpfAPI.erro });
      } else {
        clearErrors('cpf');
        setPerfilGerente(cpfBanco?.perfil);
        console.log(cpfBanco?.perfil);
        setDataUsuario(cpfBanco);

        setValue('dataNascimento', cpfBanco?.data_nascimento || cpfAPI?.nascimento || '');
        setValue('genero', cpfBanco?.genero || cpfAPI?.genero || '');
        setValue('nome', cpfBanco?.name || cpfAPI?.nome || '');
        setValue('nomeMae', cpfBanco?.nome_mae || cpfAPI?.mae || '');
        setValue('nomePai', cpfBanco?.nome_pai || '');
        //setValue('nacionalidade', cpfBanco?.nacionalidade || '');
        setValue('ddi', cpfBanco?.ddi || '55');
        setValue('celular', cpfBanco?.telefone || '');
        setValue('profissao', cpfBanco?.profissao || '');
        setValue('email', cpfBanco?.email || '');
        setValue('rg', cpfBanco?.rg || '');
        setValue('rgExpedido', cpfBanco?.rg_expedido || '');
        setValue('rgDataExpedicao', cpfBanco?.data_rg_expedido || '');
        setValue('estadoCivil', cpfBanco?.estado_civil || '');
        setValue('regimeCasamento', cpfBanco?.registro_casamento || '');
        setValue('uniaoEstavel', cpfBanco?.uniao_estavel || false);
        setValue('conjuge', cpfBanco?.conjuge || '');
        setPhoneValue(watch('ddi') + ' ' + watch('celular'));
        setValue('usuario_id', cpfBanco?.id || usuario?.id || '');
      }


      // Limpar os erros
      clearErrors('dataNascimento');
      clearErrors('genero');
      clearErrors('nome');
      clearErrors('nomeMae');
      clearErrors('profissao');
      clearErrors('rg');
      clearErrors('rgExpedido');
      clearErrors('rgDataExpedicao');
      clearErrors('estadoCivil');
      clearErrors('regimeCasamento');
      clearErrors('uniaoEstavel');
      clearErrors('conjuge');
      clearErrors('celular');
      clearErrors('ddi');

      save();

      if (cpfBanco?.perfil && value.length === 14) {
        setopenSecond(true)
      } else {
        setopenSecond(false)
      }

    }
    setLoadingCPF(false);
  };

  const handleCpfConjuge = async (value: any) => {
    setLoadingCPFConjugue(true);

    if (!value) {
      clearErrors('cpf_conjuge');
      return setLoadingCPFConjugue(false);
    }
    if (value.length === 14 && !validarCPF(value)) {
      setError('cpf_conjuge', { message: 'CPF inválido' });
      setLoadingCPFConjugue(false);
      return;
    } else if (value.length === 14 && validarCPF(value)) {
      setValue('cpf_conjuge', cpfMask(value));

      const cpfBanco_conjuge: any = await getCpfDadosUsuario(value);
      console.log(cpfBanco_conjuge);

      const pacote_conjuge = Number(watch('api_id')) > 0 ? Number(watch('api_id')) : 2;
      const cpfAPI_conjuge = !cpfBanco_conjuge ? await getCPF({ pacote: pacote_conjuge, cpfcnpj: value, }) : undefined;
      console.log(cpfAPI_conjuge);

      if (!cpfBanco_conjuge && !usuario?.cpf_cnpj && !cpfAPI_conjuge) {

      } else if (cpfAPI_conjuge?.erro) {
        setError('cpf_conjuge', { message: cpfAPI_conjuge.erro });
      } else {
        clearErrors('cpf_conjuge');
        setValue('conjuge', cpfBanco_conjuge?.name || cpfAPI_conjuge?.nome || '');
        setValue('data_nascimento_conjuge', cpfBanco_conjuge?.data_nascimento || cpfAPI_conjuge?.nascimento || '');
        setValue('genero_conjuge', cpfBanco_conjuge?.genero || cpfAPI_conjuge?.genero || '');
        setValue('mae_conjuge', cpfBanco_conjuge?.nome_mae || cpfAPI_conjuge?.mae || '');
        
        //setValue('nomePai', cpfBanco_conjuge?.nome_pai || '');
        //setValue('nacionalidade', cpfBanco_conjuge?.nacionalidade || '');
        // setValue('ddi', cpfBanco_conjuge?.ddi || '55');
        // setValue('celular', cpfBanco_conjuge?.telefone || '');
        // setValue('profissao', cpfBanco_conjuge?.profissao || '');
        // setValue('email', cpfBanco_conjuge?.email || '');
        //setPhoneValue(watch('ddi') + ' ' + watch('celular'));
        setValue('usuario_id_conjuge', cpfBanco_conjuge?.id || '');
      }


      // Limpar os erros
      clearErrors('data_nascimento_conjuge');
      clearErrors('genero_conjuge');
      clearErrors('mae_conjuge');
      clearErrors('conjuge');

      save();

      if (cpfBanco_conjuge?.perfil && value.length === 14) {
        setopenSecond(true)
      } else {
        setopenSecond(false)
      }

    }
    setLoadingCPFConjugue(false);
  };

  const handleRepresentanteSocio = (e: any, type: any) => {
    // Valor do check
    if (type === 'socio') {
      setCheckedSocio(e.target.checked);
    }
    else if (type === 'representante') {
      setCheckedRepresentante(e.target.checked);
    }
    setValue(type, e.target.checked)

    // Ajuste de validação
    if (watch('socio') === true && watch('representante') === false) {
      clearErrors('representante');
    }
    else if (watch('socio') === false && watch('representante') === true) {
      clearErrors('socio');
    }
  };

  const handleUniaoEstavel = (e: any) => {
    const valueCheckbox = e.target.value;
    setCheckedUniaoEstavel(e.target.checked);
    setValue('uniaoEstavel', e.target.checked === true ? 'S' : '');
  };

  const handleInput = (type: any, value: string) => {

    if (type === 'cpf') {
      handleCpf(value)
    }

    if (type === 'cpf_conjuge') {
        handleCpfConjuge(value)
      }

    else if (type === 'dataNascimento' || type === 'rgDataExpedicao') {
      setValue(type, dateMask(watch(type)))
    }

    else if (type === 'rg') {
      if (watch(type) === '') {
        setValue('rgExpedido', '');
        setValue('rgDataExpedicao', '');
      }
    }

    else if (type === 'estadoCivil') {
      if (watch(type) !== 1) {
        setValue('regimeCasamento', '');
      }
      else {
        setCheckedUniaoEstavel(false);
        setValue('uniaoEstavel', '');
        setValue('regimeCasamento', '');
        setValue('conjuge', '');
      }

      // Controlar o btn Concluir
      if (watch(type) === '1' && watch('regimeCasamento') === '') {
        if (setConcluirForm) setConcluirForm(false);
      }
      else {
        if (watch(type) !== '1') {
          if (setConcluirForm) setConcluirForm(true);
        }
      }
    }

    else if (type === 'regimeCasamento') {
      setValue('uniaoEstavel', '');

      // Controlar o btn Concluir
      if (watch(type) !== '' && watch('conjuge').length === 0) {
        if (setConcluirForm) setConcluirForm(false);
      }
      else {
        if (watch(type) === '') {
          if (setConcluirForm) setConcluirForm(true);
        }
      }
    }

    else if (type === 'uniaoEstavel') {
      setValue('regimeCasamento', '');

      // Controlar o btn Concluir
      if (watch(type) === 'S' && watch('conjuge').length === 0) {
        if (setConcluirForm) setConcluirForm(false);
      }
      else {
        if (watch(type) === '') {
          if (setConcluirForm) setConcluirForm(true);
        }
      }
    }

    else {
      setValue(type, (watch(type)))
    }

    //calcularPorcentagemView();
    validarBtnConcluir(type);
    save();

    // Se for Representante salva em localStorage o id da empresa para recuperar esse cadastro
    dataUrl.user === 'pessoa-juridica' ? localStorage.setItem('pj_cadastro_id', dataUrl?.index[0]) : ''

    //valor[type] = watch(type);
    //setDataSave(valor);
    console.log('Data save', dataSave);
    //console.log(watch('estadoCivil'))

    if (watch('regimeCasamento') == 1 || watch('regimeCasamento') == 2 || watch('regimeCasamento') == 3) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  };

  async function validarBtnConcluir(type: any) {
    if (
      watch('cpf').length < 14
      || watch('dataNascimento').length < 10
      || (watch('rgDataExpedicao').length > 0 && watch('rgDataExpedicao').length < 10)
      || watch('nome').length === 0
      || watch('nomeMae').length === 0
      || watch('nacionalidade').length === 0
      || watch('profissao').length === 0
      || watch('celular').length < 15
      || watch('cpf_conjuge').length < 14
      //|| dataUrl.index[1] === 'representante' ? (watch('socio') === false && watch('representante') === false) : ''
    ) {
      // Controlar o btn Concluir
      //setError(type, {message: 'Campo obrigatório'});
      if (setConcluirForm) setConcluirForm(false);
    }
    else {
      if (setConcluirForm) setConcluirForm(true);
      //clearErrors(type);
    }
  };

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
  };

  const validarEmail = (email: string) => {
    // Expressão regular para validar o formato do e-mail
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (email.length > 0) {
      if (regex.test(email) === false) {
        setError('email', { message: 'Formato de e-mail inválido' })
      }
      else {
        clearErrors('email');
      }
    }
    else {
      clearErrors('email');
    }
  };

  const handleCloseTips = () => {
    setOpen(false);
  };

  const handleCloseTipsSecond = () => {
    setopenSecond(false);
  };


  return (
    <>
      <FeedbackCertidoes open={openCertidoes} items={checkItems} />
      <div className={styles.containerBlock}>
        <div className={styles.headerBlock}>
          <h3>E quem está {dataUrl.users === 'vendedor' ? 'vendendo' : 'comprando'} o imóvel?</h3>
          <p className="p1">Para evitar devolução da venda, insira os dados corretos. <span style={{ fontWeight: '500', fontSize: '20px' }}>Dados cadastrados de forma incorreta podem gerar problemas legais para a DNA Imóveis.</span></p>
        </div>
        <AlertCopyIA />

        <div className="content">

          {
            dataUrl.user === 'pessoa-juridica' &&
            // Caso seja representante PJ
            <div className='row-f'>
              <div className="row-checkbox" style={{ width: 'auto' }}>
                {socioRepresentanteCheck.map(({ index, label, value, path, checked }) => (
                  <CheckBox
                    label={label}
                    value={value}
                    checked={checked}
                    path={path}
                    register={register}
                    key={index}
                    disabled={quantidadeRep === 0 || primeiroRepresentante}
                    {...register(index === 0 ? 'representante' : 'socio', {
                      required: dataUrl.user === 'pessoa-juridica'
                        ? watch('socio') === true
                          ? false
                          : watch('representante') === true
                            ? false
                            : true
                        : true,
                      onChange: (e) => [handleRepresentanteSocio(e, index === 0 ? 'representante' : 'socio'), handleInput(index === 0 ? 'rerpesentante' : 'socio', e.target.value)],
                    })}
                  />
                ))}
              </div>
            </div>
          }

          <div className="block-error" style={{ marginTop: '0', marginBottom: '30px' }}>
            {
              //Erro do CheckBox
              errors.socio && errors.representante
                ? <p className="errorMsg"><HiExclamation /> *Selecione pelo menos uma das opções acima.</p> : ''
            }
          </div>

          <div className="row-f">
            <InputText
              label={'CPF'}
              placeholder={'Ex: 000.000.000-00'}
              sucess={!errors.cpf && watch('cpf').length === 14}
              error={!!errors.cpf ? true : false}
              msgError={errors.cpf}
              value={watch('cpf')}
              required={true}
              iconBefore={loadingCPF ? <CircularProgress size={20} /> : ''}
              disabled={loadingCPF}
              inputProps={{
                maxLength: 14
              }}
              {...register('cpf', {
                //required: true,
                required: errorMsg,
                setValueAs: e => cpfMask(e),
                validate: (value) => validarCPF(value) || "CPF inválido",
                onChange: (e) => handleInput('cpf', e.target.value),
              })}
            />

            <InputText
              label={'Data de nascimento'}
              placeholder={'Ex: dd/mm/aaaa'}
              sucess={!errors.dataNascimento && watch('dataNascimento').length === 10}
              error={!!errors.dataNascimento ? true : false}
              required={true}
              msgError={errors.dataNascimento}
              value={watch('dataNascimento')}
              iconBefore={loadingCPF ? <CircularProgress size={20} /> : ''}
              disabled={loadingCPF}
              inputProps={{
                maxLength: 10
              }}
              {...register('dataNascimento', {
                //required: true,
                required: errorMsg,
                setValueAs: e => dateMask(e),
                validate: (value) => value.length === 10 || "Data inválida",
                onChange: (e) => handleInput('dataNascimento', e.target.value)
              })}
            />

            <InputSelect
              option={tiposGenero}
              label={'Gênero *'}
              placeholder={'Selecione seu gênero'}
              error={!!errors.genero ? true : false}
              msgError={errors.genero}
              required={true}
              sucess={!errors.genero && !!watch('genero')}
              value={watch('genero') || '0'}
              disabled={loadingCPF}
              defaultValue={''}
              {...register('genero', {
                validate: (value) => {
                  if (value === '0') {
                    return "Nenhum gênero foi selecionada";
                  }
                },
                required: errorMsg,
                onChange: (e) => handleInput('genero', e.target.value)
              })}
              inputProps={{ 'aria-label': 'Without label' }}
            />
          </div>

          <div className="row-f">
            <InputText
              label={`Nome da pessoa ${dataUrl.users}a`}
              placeholder={'Ex: José Maria da Silva'}
              sucess={!errors.nome && !!watch('nome')}
              error={!!errors.nome ? true : false}
              required={true}
              //disabled={true}
              msgError={errors.nome}
              iconBefore={loadingCPF ? <CircularProgress size={20} /> : ''}
              disabled={!!perfilGerente || loadingCPF}
              {...register('nome', {
                //required: true,
                required: errorMsg,
                onChange: (e) => handleInput('nome', e.target.value)
              })}
            />

            <InputText
              label={'Nome da mãe'}
              placeholder={'Ex: Maria Silva Alves'}
              sucess={!errors.nomeMae && !!watch('nomeMae')}
              error={!!errors.nomeMae ? true : false}
              iconBefore={loadingCPF ? <CircularProgress size={20} /> : ''}
              disabled={!!perfilGerente || loadingCPF}
              required={true}
              msgError={errors.nomeMae}
              {...register('nomeMae', {
                //equired: true,
                required: errorMsg,
                onChange: (e) => handleInput('nomeMae', e.target.value)
              })}
            />

            <InputText
              label={'Nome do pai'}
              placeholder={'Ex: José Maria da Silva'}
              sucess={!errors.nomePai && !!watch('nomePai')}
              //error={!!errors.nomePai ? true : false}
              //required={true}
              {...register('nomePai', {
                required: false,
                onChange: (e) => handleInput('nomePai', e.target.value)
              })}
            />
          </div>

          <div className="row-f">
            <InputText
              label={'Nacionalidade'}
              placeholder={'Ex: Brasileiro'}
              sucess={!errors.nacionalidade && !!watch('nacionalidade')}
              error={!!errors.nacionalidade ? true : false}
              required={true}
              msgError={errors.nacionalidade}
              {...register('nacionalidade', {
                //required: true,
                required: errorMsg,
                onChange: (e) => handleInput('nacionalidade', e.target.value)
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
              disabled={!!perfilGerente}
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
              label={'Profissão'}
              placeholder={'Ex: Corretor'}
              sucess={!errors.profissao && !!watch('profissao')}
              error={!!errors.profissao ? true : false}
              required={true}
              msgError={errors.profissao}
              {...register('profissao', {
                //required: true,
                required: errorMsg,
                onChange: (e) => handleInput('profissao', e.target.value)
              })}
            />

            <InputText
              label={'E-mail'}
              placeholder={'Ex: cliente@gmail.com'}
              sucess={!errors.email && !!watch('email')}
              error={!!errors.email ? true : false}
              msgError={errors.email}
              disabled={!!perfilGerente}
              //required={true}
              {...register('email', {
                required: false,
                onChange: (e) => handleInput('email', e.target.value),
              })}
              onMouseLeave={(e) => validarEmail(watch('email'))}
            />
          </div>

          <div className="row-f">
            <InputText
              label={'RG'}
              placeholder={'Ex: 123456789'}
              sucess={!errors.rg && watch('rg').length > 4}
              //error={!!errors.rg ? true : false}
              //required={true}
              {...register('rg', {
                required: false,
                //validate: (value) => value.length > 10 || "RG inválido",
                onChange: (e) => handleInput('rg', e.target.value)
              })}
            />

            <InputText
              label={'Expedido por'}
              placeholder={'Ex: Detran'}
              sucess={!errors.rgExpedido && !!watch('rgExpedido')}
              disabled={watch('rg').length >= 4 ? false : true}
              error={watch('rg').length >= 4 && !!errors.rgExpedido ? true : false}
              required={watch('rg').length >= 4 ? true : false}
              msgError={errors.rgExpedido}
              {...register('rgExpedido', {
                required: watch('rg').length >= 4 ? errorMsg : false,
                onChange: (e) => handleInput('rgExpedido', e.target.value)
              })}
            />

            <InputText
              label={'Data expedição'}
              placeholder={'Ex: dd/mm/aaaa'}
              sucess={!errors.rgExpedido && !!watch('rgDataExpedicao')}
              disabled={watch('rg').length >= 4 ? false : true}
              error={watch('rg').length >= 4 && !!errors.rgDataExpedicao ? true : false}
              required={watch('rg').length >= 4 ? true : false}
              msgError={errors.rgDataExpedicao}
              {...register('rgDataExpedicao', {
                required: watch('rg').length >= 4 ? errorMsg : false,
                //validate: (value) => value.length === 10 || "Data inválida",
                onChange: (e) => handleInput('rgDataExpedicao', e.target.value)
              })}
            />
          </div>

          <div className="row-f">
            <InputSelect
              option={tipoEstadoCivil}
              label={'Estado Civil *'}
              placeholder={'Selecione seu estado Civil'}
              error={!!errors.estadoCivil ? true : false}
              msgError={errors.estadoCivil}
              required={true}
              sucess={!errors.estadoCivil && !!watch('estadoCivil')}
              value={watch('estadoCivil') || '0'}
              defaultValue={'0'}
              {...register('estadoCivil', {
                validate: (value) => {
                  if (value === '0') {
                    return "Nenhum estado civil foi selecionada";
                  }
                },
                required: errorMsg,
                onChange: (e) => handleInput('estadoCivil', e.target.value)
              })}
              inputProps={{ 'aria-label': 'Without label' }}
            />
            <div style={{ width: '100%', maxWidth: '600px' }}>{/*Usado para limitar o tamanho do campo Estado Civil*/}</div>
          </div>


          {
            watch('estadoCivil') === '1'
              ?
              <div className="row-f">
                <InputSelect
                  option={tipoRegimeCasamento}
                  label={'Regime de casamento *'}
                  placeholder={'Selecione'}
                  error={!!errors.regimeCasamento ? true : false}
                  msgError={watch('estadoCivil') && errors.regimeCasamento}
                  required={true}
                  sucess={!errors.regimeCasamento && !!watch('regimeCasamento')}
                  value={watch('regimeCasamento') || '0'}
                  defaultValue={'0'}
                  {...register('regimeCasamento', {
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
                <div style={{ width: '100%', maxWidth: '600px' }}>{/*Usado para limitar o tamanho do campo Regime de casamento*/}</div>
              </div>

              :
              watch('estadoCivil') > 1
                ?
                <div className="row-f">
                  {
                    uniaoEstavelCheck.map(({ index, label, value, path, checked }) => (
                      <CheckBox
                        label={label}
                        value={value}
                        checked={checked}
                        path={path}
                        register={register}
                        key={index}
                        {...register('uniaoEstavel', {
                          required: false,
                          onChange: (e) => [handleUniaoEstavel(e), handleInput('uniaoEstavel', e.target.value)],
                        })}
                      />
                    ))
                  }
                </div>

                :
                ''
          }

          {
            (watch('uniaoEstavel') === 'S' || watch('regimeCasamento') !== '')
              ?

              
              <div className="row-f">
                { 
                
                 dataUrl.user === 'pessoa-fisica'  ?
                   <InputText
                    label={'Cônjuge: CPF'}
                    placeholder={'Ex: 000.000.000-00'}
                    sucess={!errors.cpf_conjuge && watch('cpf_conjuge').length === 14}
                    error={!!errors.cpf_conjuge ? true : false}
                    msgError={errors.cpf_conjuge}
                    value={watch('cpf_conjuge')}
                    //required={true}
                    iconBefore={loadingCPFConjugue ? <CircularProgress size={20} /> : ''}
                    disabled={loadingCPFConjugue}
                    inputProps={{
                        maxLength: 14
                    }}
                    {...register('cpf_conjuge', {
                        //required: true,
                        //required: errorMsg,
                        setValueAs: e => cpfMask(e),
                        validate: (value) =>  !value || validarCPF(value) || "CPF inválido",
                        onChange: (e) => handleInput('cpf_conjuge', e.target.value),
                    })}
                />
                 : ''
                }
                <InputText
                  label={'Cônjuge: nome completo'}
                  placeholder={'Ex: José Maria da Silva'}
                  sucess={!errors.conjuge && !!watch('conjuge')}
                  error={!!errors.conjuge ? true : false}
                  disabled={loadingCPFConjugue}
                  msgError={errors.conjuge}
                  required={watch('uniaoEstavel') === 'S' || watch('regimeCasamento') !== '' ? true : false}
                  {...register('conjuge', {
                    //required: watch('uniaoEstavel') === true || watch('regimeCasamento') !== '' ? true : false,
                    required: errorMsg,
                    onChange: (e) => handleInput('conjuge', e.target.value)
                  })}
                />

                <div style={{ width: '100%', maxWidth: '600px' }}>{/*Usado para limitar o tamanho do campo Estado Civil*/}</div>
              </div>

                :
                ''
          }
          <div style={{ marginBottom: 5 }}>
            {openSecond && (
              <Alert
                className='alert yellow'
                icon={<FaExclamationCircle size={20} />}
                onClose={handleCloseTipsSecond}
                //severity='warning'
                variant="filled"
                sx={{ width: '100%' }}
              >

                Utilize seu CPF apenas se você for <b>{dataUrl.users === 'vendedor' ? 'vender' : 'comprar'}</b> esse imóvel.
              </Alert>
            )}
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
              Casamentos com qualquer <b>regime de separação de bens devem ter pacto</b>. Evite atrasos e confirme com seu cliente antecipadamente.
            </Alert>
          )}

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