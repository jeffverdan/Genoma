import ButtonComponent from '@/components/ButtonComponent'
import React from 'react'
import Image from 'next/image'
import ImageFeedBackMobile from '@/images/feedback-upload-nota.svg'
import ImageFeedBack from '@/images/image_upload_nota.svg'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { ItemListRecentsType } from '@/interfaces/Corretores'
import { HomeIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'

type IProps = {
    open: boolean
    setOpen: (e: boolean) => void
    url?: any
    refresh: () => void
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogConfirmarPagamentos({open, setOpen, refresh} : IProps) {
  const handleClose = () => {
    setOpen(false);
    refresh();
    // router.back();
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const handleRedirect = () => {
    // router.push(url);
    router.back();
  }

  return (    
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      fullScreen={fullScreen}
      className="modal-feed-back-nota"
    >
      <DialogContent className="row">
        <DialogContentText id="alert-dialog-slide-description" className="col"> 
          <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={(theme) => ({
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
            <CloseIcon />
          </IconButton>
          
          <>
            <Image src={ImageFeedBack} className="desktop" alt="ImageFeedBack" />
            <Image src={ImageFeedBackMobile} className="mobile" alt="ImageFeedBackMobile"></Image>
          </>
          
        </DialogContentText>

        <DialogContentText id="alert-dialog-slide-description" className="col">
          <div className="content">
            <h2>Você enviou o feedback do boleto!</h2>
            <p>Agora essa informação ficará disponível no histórico. Se quiser, ainda pode voltar e checar novamente.</p>
          </div>

          <div className="buttons">
              <ButtonComponent 
                name="voltar"
                variant="text"
                onClick={(e) => handleClose()}
                labelColor="#464F53"
                size={"large"}
                label={"Voltar e checar"}
              />

              <ButtonComponent 
                name="confirm"
                variant="contained"
                onClick={(e) => handleRedirect()}
                labelColor="white"
                size={"large"}
                label={"Ok!"}
              />
          </div>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}
