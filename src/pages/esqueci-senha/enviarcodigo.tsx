import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router';
import Axios from 'axios';
import InputText from '@/components/InputText/Index';
import Button from '@/components/ButtonComponent';
import Image from 'next/image';
import logoDNA from '../../../public/logoDNA.svg';
import boasVindasImg from '../../images/undraw_business_deal.svg'
import { HiArrowRight,HiArrowLeft } from 'react-icons/hi';
import GlobalContext from '@/context/GlobalContext';
import { useContext } from 'react';
import clearFiltersLocal from '@/components/Filters/clearFilters';
import Corner from '@/components/Corner';
import { CircularProgress } from '@mui/material';
import postEsqueciSenha from '@/apis/postEsqueciSenha'
import Frame410 from '../../images/recuperar-senha/frame_410.png';

interface LoginFormValues {
    nome: string
    sobrenome: string
    email: string
    password: string
    remember: boolean
  }
  
  const links = {
    safebox: process.env.NEXT_PUBLIC_SAFEBOX_URL,
    laravel: process.env.NEXT_PUBLIC_SAFEBOX_API  
  }
  
  const login = {
    user: 'genoma@dnaimoveis.com',
    password: '321456'
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
    const [verificarEnvio, setVerificarEnvio] = useState(false);
    
    useEffect(() => {
      console.log("Versão: ", '2.4.2');  
    },[])
  
    const {
      token, setToken
    } = useContext(GlobalContext);

    const handleBackToHome = () => {
        history.push('/'); // Navega para a página inicial
    };
  
    const onSubmit = async (data: LoginFormValues) => {
    //   setLoading(true);
    //   if (data.email === login.user) {
    //     return history.push('/vendas');
    //   }
    //   try {
    //     const response = await Axios.post(links.laravel + 'login', data);
    //     setMsgLogin(undefined)
    //     const [perfil_logins] = response.data.perfil_logins.data;
    //     const [loja] = response.data.loja;
  
    //     localStorage.setItem('token', response.data.token);
    //     setToken(response.data.token);
  
    //     localStorage.setItem('usuario_id', response.data.user.id);
    //     localStorage.setItem('nome_usuario', response.data.user.name);
    //     localStorage.setItem('usuario_email', response.data.user.email);
    //     localStorage.setItem('perfil_login', perfil_logins.nome);
    //     localStorage.setItem('loja_id', loja ? loja.id : "");
    //     clearFiltersLocal();
    //     const serializedObject = encodeURIComponent(JSON.stringify(response.data));
  
    //     if (perfil_logins.nome === "Gerente" || perfil_logins.nome === "Gerente Geral" || perfil_logins.nome === "Diretor Comercial") {
    //       history.push('/vendas');
    //     } else if (perfil_logins.nome === "Backoffice" || perfil_logins.nome === "Coordenadora de Pós-Negociação") {
    //       history.push('/posvenda');
    //     } else if (perfil_logins.nome) {
    //       history.push(links.safebox + serializedObject);
    //     } else {
    //       console.log("ERROR, PERFIL: " + perfil_logins.nome + " NÃO CADASTRADO");
    //     }
    //   } catch (error: any) {
    //     console.log(error);
    //     setOpenCorner(true)
    //     setMsgLogin(`* ${error?.response?.data.error || error?.response?.data.message || "Ops, servidor não está respondendo, tente novamente mais tarde."}`)
    //   }
    //   setLoading(false);
    setLoading(true); 
    const esqueciSenha = await postEsqueciSenha(watch("email")) as any;

    
 

        esqueciSenha.status === 'true'?  setVerificarEnvio(true) : setVerificarEnvio(false);
    setLoading(false);    
        // console.log(verificarEnvio)
        // console.log(esqueciSenha.status)
    };
  
      return (

          <div className="center center-m">

              {!verificarEnvio
                  ?

                  <div className='form-esquecisenha center'>
                      <form onSubmit={handleSubmit(onSubmit)} className='form' autoComplete='off'>
                          <div className='head-form'>
                              {/* <Image alt='logo dna imoveis' data-testid="logo-img" className='mb36' src={logoDNA} width={171} height={76} /> */}
                              {/* <Button variant="outlined" onClick={toggleTheme} size={'small'} name={''} label={theme === "light" ? "Dark Mode" : "Light Mode"} labelColor='#14B8AA' /> */}
                              <h3 className='mb36 colorS500 fw700 '>Vamos redefinir sua senha?</h3>
                              <p className='p1 mb42 '>Digite abaixo seu e-mail de acesso à plataforma. <span>Nele, você vai receber um link para redefinir sua senha</span>.

                              </p>
                          </div>
                          <InputText
                              label="E-mail"
                              placeholder='Ex: seuemail@gmail.com'
                              error={!!errors.email || !!msgLogin}
                              msgError={errors.email}
                              sucess={!errors.email && !!watch("email")}
                              {...register("email", {
                                  required: "E-mail obrigatório",
                                  pattern: {
                                      value: /^\S+@\S+$/i,
                                      message: "E-mail inválido",
                                  },
                              })}
                          />

                          {/* <InputText
                            label="Password"
                            placeholder='Ex: Minhasenha987'
                            error={!!errors.password || !!msgLogin}
                            msgError={errors.password}
                            sucess={!errors.password && !!watch("password")}
                            {...register("password", {
                                required: "Senha obrigatória",
                            })}
                            /> */}

                          {
                              msgLogin &&
                              <div className="errorMsg" style={{ position: 'relative', top: '-25px' }}>
                                  {`${msgLogin}`}
                              </div>
                          }


                          <div className='mb49' style={{marginBottom: '35px'}}>
                              <Button
                                variant="contained"
                                type="submit"
                                size={'large'}
                                name={'primary'}
                                label={'Enviar e-mail'}
                                disabled={loading}
                                endIcon={loading ? <CircularProgress size={20} /> : <HiArrowRight fill='white' />}
                                data-testid="btn-login"
                                fullWidth
                              />
                              
                          </div>
                          <div className=' center'>
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
                          {/* <Button
                                variant="text"
                                type="reset"
                                size={'large'}
                                name={'minimal'}
                                label={'Esqueci minha senha'}
                                data-testid="reset-login"
                                onClick={() => window.location.href = links.safebox + "login-help"}
                            /> */}
                      </form>
                  </div>
                  :

                  <div className='form-esquecisenha center'>
                      <form onSubmit={handleSubmit(onSubmit)} className='form' autoComplete='off'>
                          <div className='head-form'>
                              {/* <Image alt='logo dna imoveis' data-testid="logo-img" className='mb36' src={logoDNA} width={171} height={76} /> */}
                              {/* <Button variant="outlined" onClick={toggleTheme} size={'small'} name={''} label={theme === "light" ? "Dark Mode" : "Light Mode"} labelColor='#14B8AA' /> */}
                              <Image src={Frame410} alt="frame410" className="img" />
                              <h3 className='mb36 colorS500 fw700 center'>E-mail enviado!</h3>
                              <p className='p1 mb42'>Basta conferir sua caixa de entrada. <span>Não esqueça de clicar no link para redefinir sua senha!</span></p>
                          </div>
                 
                          {
                              msgLogin &&
                              <div className="errorMsg" style={{ position: 'relative', top: '-25px' }}>
                                  {`${msgLogin}`}
                              </div>
                          }


                          <div className='mb49 btn-reenvio'>
                              <Button
                                  variant="outlined"
                                  type="submit"
                                  size={'large'}
                                  name={'minimal'}
                                  label={'Reenviar e-mail'}
                                  disabled={loading}
                                  endIcon={loading ? <CircularProgress size={20} /> : ''}
                                  data-testid="btn-login"
                                  fullWidth
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