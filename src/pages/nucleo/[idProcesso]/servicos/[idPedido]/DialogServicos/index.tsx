import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Image from 'next/image';
import DialogImage from '@/images/img_dialog_entrega_venda.png';
import DialogImg1 from '@/images/nucleo/img_dialog_servico_1.png';
import DialogImg2 from '@/images/nucleo/img_dialog_servico_2.png';
import DialogImg3 from '@/images/nucleo/img_dialog_servico_3.png';
import styles from './index.module.scss';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IconButton, useTheme } from '@mui/material';
import Button from '@/components/ButtonComponent';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/router';
import { Close } from '@mui/icons-material';

export interface SimpleDialogProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    type?: string;
    save: () => void;
    statusServico?: string;
  }

export default function DialogServicos({open, setOpen, type, save, statusServico}: SimpleDialogProps){
    const router = useRouter();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        save();
        setOpen(false);
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

                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        className='icon-close'
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                        >
                        <Close />
                    </IconButton>

                    <DialogContent className={styles.row}>
                        <DialogContentText id="alert-dialog-description" className={styles.coll}>
                            {/* <div className={styles.mobileClose}>
                                <Button
                                    variant="text"
                                    label=""
                                    name="minimal"
                                    size="small" 
                                    data-testid="dialog-close"
                                    startIcon={<XMarkIcon className="icon start-icon" />}
                                    onClick={handleClose}
                                ></Button>
                            </div> */}

                            <Image src={
                                type === 'servico' 
                                    ? statusServico === '1' 
                                        ? DialogImg1
                                        : DialogImg2 
                                    : DialogImg3
                                } 
                                alt="dialog" 
                                style={{width: 'auto', height: 'auto', maxHeight: '533px'}}
                            />
                        </DialogContentText>

                        <DialogContentText id="alert-dialog-description" className={styles.coll}>
                            <div className={styles.header}>
                                <h2 className="bold">
                                    {
                                        type === 'servico'
                                        ? statusServico === '1'
                                            ? 'A documentação está correta?'
                                            : 'Tem certeza que deseja concluir o serviço?'
                                        :''
                                    }

                                    {type === 'finalizar' ? 'Tem certeza que deseja concluir o pedido?' : ''} 
                                </h2>
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
                            </div>
                            
                            <div className={styles.content}>
                                
                                {
                                    type === 'servico'
                                    ? statusServico === '1'
                                        ? <p>Confirme se está tudo certo antes de enviar para a equipe de pós-venda. Com tudo revisado é só clicar no botão abaixo para atualizar o pós-venda.</p>
                                        : <p>Confira se está tudo certo antes de concluir o serviço. Se estiver tudo certo, clique no botão abaixo para concluir e o pós-venda ser notificado.</p>
                                    :''
                                }

                                {
                                    type === 'finalizar' 
                                    ? <>
                                        <p>Confira se está tudo certo antes de concluir o pedido. Se estiver tudo certo, clique no botão abaixo para concluir e o pós-venda ser notificado.</p>
                                        <p>Obs: O serviço irá para a sua aba de finalizados.</p>
                                    </>
                                    : ''
                                }  
                            </div>
                            <div className={`${styles.buttonArea} btn-actions`}>
                                <Button 
                                    label={type === 'servico' 
                                        ? statusServico === '1'
                                            ? 'Enviar' 
                                            : 'Concluir Serviço'
                                        : 'Concluir Pedido'
                                    }
                                    name="primary"
                                    size="medium"
                                    variant="text"
                                    onClick={handleSave}
                                />
                            </div>  
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            }
        </div>
    );
}

function setOpen(arg0: boolean) {
    throw new Error('Function not implemented.');
}
