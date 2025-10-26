import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router';
import Axios from 'axios';
import InputText from '@/components/InputText/Index';
import Button from '@/components/ButtonComponent';
import Image from 'next/image';
import logoDNA from '../../../public/logoDNA.svg';
import boasVindasImg from '../../images/undraw_business_deal.svg'
import { HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import GlobalContext from '@/context/GlobalContext';
import { useContext } from 'react';
import clearFiltersLocal from '@/components/Filters/clearFilters';
import Corner from '@/components/Corner';
import { CircularProgress } from '@mui/material';
import postEsqueciSenha from '@/apis/postEsqueciSenha'
import { FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';
import { Password } from '@mui/icons-material';
import { HiCheckCircle } from 'react-icons/hi';
import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
import Frame404 from '../../../images/recuperar-senha/frame_404.png';

interface LoginFormValues {
  nome: string
  sobrenome: string
  email: string
  password: string
  passwordConfirmation: string
  remember: boolean
}

interface Security {
  number: any
  uppercase: any
  amount: any
}

const links = {
  safebox: process.env.NEXT_PUBLIC_SAFEBOX_URL,
  laravel: process.env.NEXT_PUBLIC_SAFEBOX_API
}


export default function IndexPage() {
  const history = useRouter();


  const {
    register,
    watch,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFormValues>({
    // defaultValues: { "email": "genoma@dnaimoveis.com" }
  })

  const [openCorner, setOpenCorner] = useState(false);
  const [msgLogin, setMsgLogin] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [tokenValido, setTokenValido] = useState(false);
  const [email, setEmail] = useState(false);
  const token = history.query.tokenAcesso;
  const router = useRouter();

  useEffect(() => {
    // console.log(token)
    setLoading(true)
    if (token) {
      Axios.post(links.laravel + 'verificar_link', {
        token,
      }).then(res => {
        console.log(res);
        if (res.data.mensagem === "Token Invalido") {
          setTokenValido(false)
        } else {
          setTokenValido(true)
          setEmail(res.data.mensagem[0].email)
        }
      }).catch((err) => {
        console.log(err);
      }).then(() => {
        setLoading(false);
      })
    }
  }, [links.laravel, token])

  const [security, setSecurity] = useState<Security>({
    number: 'inicial',
    uppercase: 'inicial',
    amount: 'inicial',
  });

  const [countSecurity, setCountSecurity] = useState(0);

  const inputGreen = {
    borderColor: '#429777',
    background: '#F5FBF8'
  };

  const inputError = {
    borderColor: '#FF0000',
    background: '#fff'
  };


  //   useEffect(() => {
  //       console.log("Versão: ", '2.4.2');
  //   },)

  //   const {
  //       token, setToken
  //   } = useContext(GlobalContext);

  //console.log(token);


  const handleEnviarEmail = async (e: any) => {
    setLoading(true)
    await Axios.post(links.laravel + 'redefinirsenha', {
      token,
      email,
      "password": e.password,
    }).then(res => {
      if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
        setLoading(false);
        console.log(res);
      } else {
        console.log(res);
        //setLoadingAnimation(true)
        setTimeout(() => {
          handleLogin(e)
        }, 4000)
      }
    }).catch(err => {
      console.log(err);
      setLoading(false);
    })/*.then(() => {
          setLoading(false);
        })*/
  };



  const handleLogin = async (data: LoginFormValues) => {
    const password = data.password;

    // if (data.email === login.user) {
    //   return history.push('/vendas');
    // }
    try {
      const response = await Axios.post(links.laravel + 'login', { email, password });
      setMsgLogin(undefined)
      const [perfil_logins] = response.data.perfil_logins.data;
      const [loja] = perfil_logins.loja;
      const perfisUsuario = response.data.perfil_logins.data.map((data: any) => data);
      const lojasUsuario = perfil_logins.loja.map((data: any) => data);

      localStorage.setItem('token', response.data.token);
      //setToken(response.data.token);

      localStorage.setItem('usuario_id', response.data.user.id);
      localStorage.setItem('nome_usuario', response.data.user.name);
      localStorage.setItem('usuario_email', response.data.user.email);
      localStorage.setItem('perfil_login', perfil_logins.nome);
      localStorage.setItem('perfil_login_id', perfil_logins.id);
      localStorage.setItem('loja_id', loja ? loja.id : "");
      localStorage.setItem('perfis_usuario', JSON.stringify(perfisUsuario));
      localStorage.setItem('lojas_usuario', JSON.stringify(lojasUsuario));
      
      if (loja) {
        localStorage.setItem('empresa_loja', JSON.stringify([loja.empresa]) || '');
      }
      clearFiltersLocal();
      const serializedObject = encodeURIComponent(JSON.stringify(response.data));

      if (perfil_logins.nome === "Gerente" || perfil_logins.nome === "Gerente Geral" || perfil_logins.nome === "Diretor Comercial") {
        history.push('/vendas');
      } else if (perfil_logins.nome === "Pós-venda" || perfil_logins.nome === "Coordenadora de Pós-Negociação") {
        history.push('/posvenda');
      } else if (perfil_logins.nome === "Apoio") {
        history.push('/apoio');
      } else if (perfil_logins.nome === "Núcleo") {
        history.push('/nucleo');
      } else if (perfil_logins.nome === "Corretor") {
        history.push('/corretor');
      } else if (perfil_logins.nome === "Financeiro") {
        history.push("/financeiro");
      } else {
        console.log("ERROR, PERFIL: " + perfil_logins.nome + " NÃO CADASTRADO");
      }
    } catch (error: any) {
      console.log(error);
      //setOpenCorner(true)
      setMsgLogin(`* ${error?.response?.data.error || error?.response?.data.message || "Ops, servidor não está respondendo, tente novamente mais tarde."}`)
    }
    setLoading(false);
  };

  const handlePass = (e: any) => {
    const value = e.target.value;
    const name = e.target.name;
    if (name === 'password') {
      security.amount = value.length >= 8;
      security.number = value.match(/[0-9]/)?.length > 0;
      security.uppercase = value.match(/(?=.*[A-Z])/)?.length > 0;
      setCountSecurity(security.amount + security.number + security.uppercase);
      setSecurity({ ...security });
    }

    console.log(security)
  };

  const handleBackToHome = () => {
    history.push('/'); // Navega para a página inicial
  };

  const handleBackToReset = (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    setTimeout(() => {
      router.push('/esqueci-senha/enviarcodigo/');
    }, 1000);
  };

  const styleSecurity = (type: any) => {
    if (type === 'container') {
      if (countSecurity === 3) return '#F5FBF8';
      else if (countSecurity === 2) return '#FFFAF1';
      else return '#FDF4F4'
    } else {
      if (countSecurity === 3) return '#6B9539';
      else if (countSecurity === 2) return '#FFC43E';
      else if (countSecurity === 1) return '#E33838'
      else return '#8F95B2'
    }
  };

  function color(element: any) {
    if (element === 'inicial') return { color: '#8F95B2' }
    if (!element) return { color: '#E33838' }
    if (element) return { color: 'green' }
  };

  function icon(element: any) {
    if (element === 'inicial') return <CheckIcon className='mr16 dot-icon' width={20} height={20} />
    if (!element) return <FaExclamationTriangle className='mr16' size={20} fill='red' />
    if (element) return <CheckIcon className='mr16 check-icon' width={20} height={20} />
  };

  return (
    <div className="center center-m">
      {
        !tokenValido && loading
          ? <div className="form-alterarsenha center"><CircularProgress size={100} /></div>
          : tokenValido
            ?
            <div className='form-alterarsenha center'>
              <form onSubmit={handleSubmit((e) => handleEnviarEmail(e))} className='form' autoComplete='off'>
                <div className='head-form'>
                  {/* <Image alt='logo dna imoveis' data-testid="logo-img" className='mb36' src={logoDNA} width={171} height={76} /> */}
                  {/* <Button variant="outlined" onClick={toggleTheme} size={'small'} name={''} label={theme === "light" ? "Dark Mode" : "Light Mode"} labelColor='#14B8AA' /> */}
                  <h3 className='mb36 colorS500 fw700'>Vamos redefinir sua senha?</h3>
                </div>

                <InputText
                  label="Nova senha"
                  placeholder='Ex: MinhaNovasenha987'
                  error={!!errors.password || !!msgLogin}
                  msgError={errors.password}
                  sucess={!errors.password && !!watch("password")}
                  {...register("password", {
                    required: "Senha obrigatória",
                    pattern: {
                      value: /(?=.*[0-9])(?=.*[A-Z])(?=.{8,})/,
                      message: 'Sua nova senha está fraca. Siga as recomendações.'
                    },
                    onChange: (e) => handlePass(e),
                  })}
                />

                <InputText
                  label="Confirme nova senha"
                  placeholder='Ex: MinhaNovasenha987'
                  error={!!errors.passwordConfirmation || !!msgLogin}
                  msgError={errors.passwordConfirmation}
                  sucess={!errors.passwordConfirmation && !!watch("passwordConfirmation")}
                  {...register("passwordConfirmation", {
                    required: "Senha obrigatória",
                  })}
                  {...register("passwordConfirmation", {
                    required: "Confirmação de nova senha obrigatória.",
                    validate: {
                      valoresIguais: value => value === watch('password') || 'As senhas precisam ser iguais.',
                    }
                  })}

                />
                <div className='securityFields alignRight' style={{ marginBottom: '18px' }}>
                  <div className='securityFields'>
                    <div className='linePassword' style={{ backgroundColor: countSecurity >= 1 ? styleSecurity('') : '#D8DAE5' }}></div>
                    <div className='linePassword' style={{ backgroundColor: countSecurity >= 2 ? styleSecurity('') : '#D8DAE5' }}></div>
                    <div className='linePassword' style={{ backgroundColor: countSecurity === 3 ? styleSecurity('') : '#D8DAE5' }}></div>
                  </div>

                </div>

                <div className='alignShield'>
                  <span className='aligntextPass' style={{ fontSize: '12px', color: styleSecurity('') }}>{countSecurity === 3 ? 'FORTE' : countSecurity === 2 ? 'MÉDIO' : countSecurity === 1 ? 'FRACO' : 'DIGITE SENHA'}</span>
                  <div className={`box-icon ${countSecurity === 3 ? 'green-icon-50' : countSecurity === 2 ? 'yellow-icon-50' : 'red-icon-50'}`}>
                    <FaShieldAlt className={countSecurity === 3 ? 'green-icon' : countSecurity === 2 ? 'yellow-icon' : 'red-icon'} color={styleSecurity('')} />
                  </div>
                </div>

                <div className='resetText'>
                  <p style={{ marginBottom: '15px', textAlign: 'left', fontWeight: '700' }}>Uma senha forte deve conter:</p>

                  <div className='securityFields ' style={color(security.number)}>
                    {icon(security.number)}
                    Ao menos 1 número
                  </div>

                  <div className='securityFields ' style={color(security.uppercase)}>
                    {icon(security.uppercase)}
                    Ao menos 1 letra maíuscula
                  </div>

                  <div className='securityFields' style={color(security.amount)}>
                    {icon(security.amount)}
                    A senha deve ter no mínimo 8 letras
                  </div>
                </div>

                <div className='mb49' style={{ marginBottom: '25px' }}>
                  <Button
                    variant="contained"
                    type="submit"
                    size={'large'}
                    name={'primary'}
                    label={'Redefinir senha e entrar'}
                    disabled={loading}
                    endIcon={loading ? <CircularProgress size={20} /> : <HiArrowRight fill='white' />}
                    data-testid="btn-login"
                    fullWidth
                  />
                </div>


              </form>
            </div>
            :

            <div className='form-esquecisenha center'>
              <form className='form' autoComplete='off'>
                <div className='head-form'>
                  {/* <Image alt='logo dna imoveis' data-testid="logo-img" className='mb36' src={logoDNA} width={171} height={76} /> */}
                  {/* <Button variant="outlined" onClick={toggleTheme} size={'small'} name={''} label={theme === "light" ? "Dark Mode" : "Light Mode"} labelColor='#14B8AA' /> */}
                  <Image src={Frame404} alt="frame404" className="img" />
                  <h3 className='mb36 colorS500 fw700'>Cadê o link que estava aqui?</h3>
                  <p className='p1 mb42 '>Parece que você usou um link inválido para redefinir sua senha. Vamos tentar de novo?</p>
                </div>

                {
                  msgLogin &&
                  <div className="errorMsg" style={{ position: 'relative', top: '-25px' }}>
                    {`${msgLogin}`}
                  </div>
                }


                <div className='mb49' style={{ marginBottom: '25px' }}>
                  <Button
                    variant="contained"
                    type="submit"
                    size={'large'}
                    name={'primary'}
                    label={'Obter novo link'}
                    disabled={loading}
                    endIcon={loading ? <CircularProgress size={20} /> : ''}
                    data-testid="btn-login"
                    fullWidth
                    onClick={handleBackToReset}
                  />
                </div>

                <div className='center'>
                  <Button
                    variant="text"
                    type="reset"
                    size={'large'}
                    name={'minimal'}
                    label={'Voltar para Entrar'}
                    disabled={loading}
                    startIcon={<HiArrowLeft fill='#01988C' />}
                    data-testid="reset-login"
                    onClick={handleBackToHome}
                  />
                </div>

              </form>
            </div>
      }
    </div>
  )
}