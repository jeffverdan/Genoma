import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Image from 'next/image';
import DialogImage from '@/images/img_dialog_venda.png';
import styles from './index.module.scss';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';
import Button from '@/components/ButtonComponent';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/router';

export interface SimpleDialogProps {
    open: boolean
    setOpen: (e: boolean) => void
    returnFeedBackGerente: () => void
    escriturasFeedBack: IFeedBackEscrituras[]
    setOpenFeedBack: (e: boolean) => void 
}

interface IFeedBackEscrituras{
    name?: string,
    ddi?: string,
    telefone?: string,
    data_escritura?: string,
    hora_escritura?: string,
    logradouro?: string,
    unidade?: string,
    processo_id?: number,
    pg_na_escritura?: number
}
  
export default function DialogFeedBackEscritura({open, setOpen, returnFeedBackGerente, escriturasFeedBack, setOpenFeedBack}: SimpleDialogProps){
    const router = useRouter();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClose = () => {
        console.log(escriturasFeedBack);
        returnFeedBackGerente()
    };

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
                    <DialogTitle>
                        <div className={styles.close}  style={{    position: 'absolute', display: 'flex', justifyContent: 'flex-end', width: '95%'}}>
                            <Button
                                variant="text"
                                label=""
                                name="minimal"
                                size="small" 
                                startIcon={<XMarkIcon className="icon start-icon" />}
                                onClick={handleClose}
                            ></Button>
                        </div>
                    </DialogTitle>

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
                            <div className={styles.header} style={{width: '100%'}}>
                                {/* <div className={styles.close}>
                                    <Button
                                        variant="text"
                                        label=""
                                        name="minimal"
                                        size="small" 
                                        startIcon={<XMarkIcon className="icon start-icon" />}
                                        onClick={handleClose}
                                    ></Button>
                                </div> */}
                                <h2 className="bold" style={{width: '100%'}}>Você enviou o feedback de escritura!</h2>
                            </div>
                            
                            <div className={styles.content}>
                                <p>
                                    O pós-venda responsável será notificado, e você poderá acompanhar em Detalhes da venda &gt; Venda &gt; Resumo.
                                </p>

                                <div className={styles.buttonArea}>
                                    <Button 
                                        label="Ok!"
                                        name="primary"
                                        size="medium"
                                        variant="contained"
                                        onClick={handleClose}
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