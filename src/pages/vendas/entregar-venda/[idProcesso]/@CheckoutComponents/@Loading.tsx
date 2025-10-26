import {useEffect, useState} from 'react';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { TransitionProps } from '@mui/material/transitions';
import styles from './styles.module.scss'
import { useRouter } from 'next/router';
import ImageError from '../../../../../images/undraw_alert_re_j2op 1.svg';
import Image from 'next/image';
import ButtonComponent from '@/components/ButtonComponent';
import { HiArrowPath } from 'react-icons/hi2';
import FormValues from '@/interfaces/Vendas/EntregarVenda'

interface ILoading{
    loading: boolean,
    setLoading: (e: boolean) => void,
    open: Boolean,
    setOpen: (e: Boolean) => void,
    idProcesso: number,
    step: number,
    setStep: (e: number) => void,
    enviar: (e: FormValues) => void,
}

export default function Loading({loading, setLoading, open, setOpen, idProcesso, step, setStep, enviar}: ILoading){
    const router = useRouter();

    const [refresh, setRefresh] = useState(false);

    const handleClose = (e: any) => {
        setOpen(false);
        setStep(0);
        //setLoading(false);
    };

    const handleReenvio = (e: any) => {
        setStep(0)
        enviar(e);
        console.log(e)
    }

    async function confirmacaoDocSign(){
        if(step === 1){
            if(loading === true){
                setTimeout(() => {
                    router.push('/vendas/entregar-venda/' + idProcesso + '/checkout');
                    setStep(0);
                    setLoading(false);
                    setOpen(false);
                }, 3000);
            }
        }
    }
    confirmacaoDocSign();

    return(
        <Dialog
            open={!!open}
            //TransitionComponent={Transition}
            keepMounted
            //onClose={handleClose}
            disableEscapeKeyDown={true}
            aria-describedby="alert-dialog-slide-description"
            maxWidth='lg'      
            >
                <div className={styles.loading}>
                    <div className={styles.cardCenter}>
                        <div className="circular-progress-checkout">
                            {
                                step === 2
                                ? <Image src={ImageError} alt="undraw-error" />
                                : <CircularProgress />
                            }
                        </div>

                        <div className={styles.text}>
                            {
                                step === 0
                                ? <>Enviando seu Recibo de Sinal {<br/>} para o DocuSign...</>
                                : open === true 
                                    ? step === 1 
                                        ? 'Tudo certo :)'
                                        : 'Ops! Parece que algo deu errado :('                                     
                                    : ''
                            }
                        </div>

                        {
                            step > 0 ?
                            //open === true ?
                            step === 1 ?
                            <div className={styles.subText}>
                                Vamos acompanhar o processo de assinaturas!
                            </div>

                            :
                            <div className={styles.subText}>
                                Você pode tentar reenviar sua venda, {<br/>} ou voltar para a tela de envio.

                                <div className={styles.btnReenvio}>
                                    <ButtonComponent 
                                        name={'reenviar'}
                                        startIcon={<HiArrowPath color={'#fff'} />}
                                        label={'Tentar novamente'}
                                        size={'large'}
                                        variant={'contained'}
                                        labelColor={'white'}
                                        onClick={handleReenvio}
                                    />
                                </div>

                                <ButtonComponent 
                                    name={'voltar'}
                                    label={'Voltar'}
                                    size={'large'}
                                    variant={'text'}
                                    labelColor={'#464F53'}
                                    onClick={handleClose}
                                />
                            </div>
                            :
                            ''
                        }
                    </div>
                </div>
        </Dialog>
    )
}