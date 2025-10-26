import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router';
import InputText from '../components/InputText/Index'
import Button from '../components/ButtonComponent'
import Image from 'next/image';
import logoGenoma from '../../public/genoma_logo_1.png';
import boasVindasImg from '../images/undraw_business_deal.svg'
import { HiArrowRight } from 'react-icons/hi';
import GlobalContext from '@/context/GlobalContext';
import { useContext } from 'react';
import { CircularProgress } from '@mui/material';
import onLogin from '@/functions/login';

interface LoginFormValues {
  nome: string
  sobrenome: string
  email: string
  password: string
  remember: boolean
}

export default function IndexPage() {
  const history = useRouter();
  const {
    register,
    watch,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFormValues>();

  const [msgLogin, setMsgLogin] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  
  const clearAcess = async () => {
    const startInfo: any = localStorage.getItem('startInfo') || false;
    localStorage.clear();
    localStorage.setItem('startInfo', startInfo);
  }

  useEffect(() => {
    console.log("Versão: ", '3.0.2');  
    clearAcess();
  },[]);

  const handleGoResetPassword = () => {
    history.push('/esqueci-senha/enviarcodigo'); // Navega para a página inicial
};

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    const res = await onLogin(data);
    console.log("Res Login: ",res);
    
    if(res?.path) {
      if(res.message === 'redirect') return history.replace(res.path)
        else return history.push(res.path);
    } else {
      setMsgLogin(res?.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className='img-login center'>
        <Image alt='Boas Vindas' src={boasVindasImg} />
      </div>
      <div className='form-login center'>
        <form onSubmit={handleSubmit(onSubmit)} className='form' autoComplete='off'>
          <div className='head-form'>
            <Image alt='Genoma Imóveis' data-testid="logo-img" className='mb36' src={logoGenoma} style={{width: '100%', maxWidth: '360px', height: 'auto'}} />
            
            <h2 className='mb16 colorS400 fw700'>Boas-vindas!</h2>
            <p className='p1 mb42'>Faça seu login para continuar.</p>
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

          <InputText
            label="Password"
            placeholder='Ex: Minhasenha987'
            error={!!errors.password || !!msgLogin}
            msgError={errors.password}
            sucess={!errors.password && !!watch("password")}
            {...register("password", {
              required: "Senha obrigatória",
            })}
          />

          {
            msgLogin &&
            <div className="errorMsg" style={{ position: 'relative', top: '-25px' }}>
              {`${msgLogin}`}
            </div>
          }


          <div className='mb49'>
            <Button
              variant="contained"
              type="submit"
              size={'large'}
              name={'primary'}
              label={'Entrar'}
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} /> : <HiArrowRight fill='white' />}
              data-testid="btn-login"
              fullWidth
            />
          </div>

          <Button
            variant="text"
            type="reset"
            size={'large'}
            name={'minimal'}
            label={'Esqueci minha senha'}
            data-testid="reset-login"
            onClick={handleGoResetPassword}
          />
        </form>
      </div>

      {/* {
        openCorner === true &&
          <Corner 
              open={openCorner}
              setOpen={setOpenCorner}
              vertical="bottom"
              horizontal="right"
              direction="up"
              type={'login-invalido'}
              className='bottom-10'
          />
      } */}
    </div>
  )
}