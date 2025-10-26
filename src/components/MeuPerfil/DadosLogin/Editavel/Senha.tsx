import React, { useState } from 'react';
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router';
import Axios from 'axios';
import InputText from '@/components/InputText/Index';
// import { CircularProgress } from '@mui/material';
// import postEsqueciSenha from '@/apis/postEsqueciSenha'
import { FaExclamationTriangle, FaShieldAlt  } from 'react-icons/fa';
// import { Password } from '@mui/icons-material';
import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
// import Frame404 from '../../../../images/recuperar-senha/frame_404.png';
import styles from './BlockStyles.module.scss'
import ButtonComponent from '@/components/ButtonComponent';
import { HiCheck, HiExclamation } from 'react-icons/hi';
import Perfil from '@/interfaces/Perfil';

interface LoginFormValues {
  nome: string
  sobrenome: string
  email: string
  password: string
  passwordConfirmation :string
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

type BlockProps = {
  index: number;
  dataPerfil?: Perfil;
  handleShow?: any
  setBlockSave?: any
  saveBlocks?: any
  setOpenCorner: (e: Boolean) => void
};  

const Senha: React.FC<BlockProps> = ({dataPerfil, handleShow, setBlockSave, saveBlocks, index, setOpenCorner}) => {  
  const history = useRouter();
  
  const {
      register,
      watch,
      setError,
      formState: { errors },
      handleSubmit,
  } = useForm<LoginFormValues>({})

  // const [openCorner, setOpenCorner] = useState(false);
  const [msgLogin, setMsgLogin] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  // const [tokenValido, setTokenValido] = useState(false);
  // const [email, setEmail] = useState(false);
  const token = history.query.tokenAcesso;  
  const router = useRouter();      

  const [security, setSecurity] = useState<Security>({
      number: 'inicial',
      uppercase:'inicial',
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
    
  const handleEnviarEmail = async() => {
      setLoading(true)
      await Axios.post(links.laravel + 'redefinirsenha', {
        token,
        'email': dataPerfil?.email,
        "password": watch('password'),
      }).then(res => {
        if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
          setLoading(false);
          console.log(res);
        } else {
          console.log(res);
          //setLoadingAnimation(true)
          setOpenCorner(true);
          setTimeout(() => {
            // handleLogin(e)
          }, 4000)
        }
      }).catch(err => {
        console.log(err);
        setLoading(false);
      })/*.then(() => {
        setLoading(false);
      })*/
    };

  const handlePass = (e:any) => {
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

  const styleSecurity = (type:any) => {
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

  function color (element:any) {
    if(element === 'inicial') return {color: '#8F95B2'}
    if(!element) return {color: '#E33838'}
    if(element) return {color: 'green'}
  };

  function icon (element:any) {
    if(element === 'inicial') return  <CheckIcon  className='mr16 dot-icon' width={20} height={20} />
    if(!element) return <FaExclamationTriangle className='mr16' size={20} fill='red' />
    if(element) return <CheckIcon  className='mr16 check-icon' width={20} height={20} />
  };

  return (
    <div className={`${styles.containerBlock} card-content`}>
      <div className="detahes-content">
        <h2>Alterar senha</h2>
        <div className="row-f">
          <InputText
            width={'450px'}
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
        </div>

        <div className="row-f">
          <InputText
            width={'450px'}
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
        </div>

          <div className='securityFields alignRight' style={{marginBottom: '18px'}}>
            <div className='securityFields'>
              <div className='linePassword' style={{ backgroundColor: countSecurity >= 1 ? styleSecurity('') : '#D8DAE5' }}></div>
              <div className='linePassword' style={{ backgroundColor: countSecurity >= 2 ? styleSecurity('') : '#D8DAE5' }}></div>
              <div className='linePassword' style={{ backgroundColor: countSecurity === 3 ? styleSecurity('') : '#D8DAE5' }}></div>
            </div>
          </div>

          <div className='alignShield' style={{maxWidth: '445px'}}>
            <span className='aligntextPass' style={{fontSize: '12px', color: styleSecurity('') }}>{countSecurity === 3 ? 'FORTE' : countSecurity === 2 ? 'MÉDIO' : countSecurity === 1 ? 'FRACO' : 'DIGITE SENHA'}</span>
            <div className={`box-icon ${countSecurity === 3 ? 'green-icon-50' : countSecurity === 2 ? 'yellow-icon-50' : 'red-icon-50'}`}>
              <FaShieldAlt className={ countSecurity === 3 ? 'green-icon' : countSecurity === 2 ? 'yellow-icon' : 'red-icon'} color={styleSecurity('')}   />
            </div>
          </div>

          <div className='resetText'>
            <p style={{ marginBottom: '15px', textAlign: 'left', fontWeight: '700'}}>Uma senha forte deve conter:</p>

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
      </div>

      <footer className={styles.footerControls} style={{display: 'flex', justifyContent: 'space-between'}}>
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
            onClick={handleSubmit(() => [saveBlocks(), handleShow(index, 'salvar'), handleEnviarEmail()])}
          />
        </div>
    </footer>
    </div>
  )
}

  export default Senha