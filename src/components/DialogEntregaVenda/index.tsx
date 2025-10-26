import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Image from 'next/image';
import DialogImage from '@/images/img_dialog_entrega_venda.png';
import styles from './index.module.scss';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';
import Button from '@/components/ButtonComponent';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/router';

export interface SimpleDialogProps {
    open: boolean;
    setOpen: (e: boolean) => void,
    selectedValue?: string;
    onClose?: (value: string) => void;
  }

export default function DialogEntregaVenda(props: SimpleDialogProps){
    const router = useRouter();
    const [dialog, setDialog] = useState('');
    const {open, setOpen} = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const nomeGerente = localStorage.getItem('nome_usuario');

    // const [open, setOpen] = React.useState(true);

    useEffect(() => {
        //Controla se o Dialog do Gerar Vendas vai ser exibido ou não
        const dialogShow = () => {
            if(localStorage.getItem('startInfo') === null || localStorage.getItem('startInfo') === 'false'){
                localStorage.setItem('startInfo', 'false');
                setOpen(true);
           }
           else{
                if(localStorage.getItem('startInfo') === 'true'){
                    setOpen(false);
                }
           }
        }
        dialogShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        localStorage.setItem('startInfo', 'true');
    };

    const handleBack = () => {
        router.push('/vendas/gerar-venda');
    }

    const handleNext = () => {
        setOpen(false);
        localStorage.setItem('startInfo', 'true');
    }

    return(
        <div>
            {
                <Dialog
                    className="dialog-vendas"
                    fullScreen={fullScreen}
                    open={open}
                    onClose={handleClose}
                    disableEscapeKeyDown={true}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >

                    <DialogContent className={styles.row}>
                        <DialogContentText id="alert-dialog-description" className={styles.coll}>
                            <div className={styles.mobileClose}>
                                <Button
                                    variant="text"
                                    label=""
                                    name="minimal"
                                    size="small" 
                                    data-testid="dialog-close"
                                    startIcon={<XMarkIcon className="icon start-icon" />}
                                    onClick={handleClose}
                                ></Button>
                            </div>

                            <Image src={DialogImage} alt="dialog" />
                        </DialogContentText>

                        <DialogContentText id="alert-dialog-description" className={styles.coll}>
                            <div className={styles.header}>
                                <h2 className="bold">{nomeGerente}, você realizou a entrega da venda!</h2>
                                <div className={styles.close}>
                                    <Button
                                        variant="text"
                                        label=""
                                        name="minimal"
                                        size="small" 
                                        startIcon={<XMarkIcon className="icon start-icon" />}
                                        onClick={handleClose}
                                    ></Button>
                                </div>
                            </div>
                            
                            <div className={styles.content}>
                                <p>
                                    Com a venda entregue, você já pode compartilhar sua venda no Zap da Gerência, mostrando sua pontuação! 
                                </p>
                                
                                <p>
                                    Confira o texto a ser compartilhado:
                                </p>
                                
                                <p>
                                    “Segue a venda 🚀🚀🚀🚀🚀 Foguetes do imóvel localizado em [RUA+No] realizada por [corretor], no valor de [ValorVenda]. Opção de [opcionista] e gerência de [Gerente]. [Inserir grito de guerra da loja]. Rumo aos mil atos!”
                                </p> 

                                <div className={styles.buttonArea}>
                                    <Button 
                                        label="Cancelar envio"
                                        name="primary"
                                        size="medium"
                                        variant="text"
                                        onClick={handleNext}
                                    />

                                    <Button 
                                        label="Compartilhar no Zap"
                                        name="primary"
                                        size="medium"
                                        variant="contained"
                                        onClick={handleNext}
                                    />
                                </div>   
                            </div>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            }
        </div>
    );
}