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

type IProps = {
    openFeedBack: boolean
    setOpenFeedBack: (e: boolean) => void
    setSelectedTab?: (e: number) => void
    setSelectProcess: (e: ItemListRecentsType | null) => void
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FeedBack({openFeedBack, setOpenFeedBack, setSelectedTab, setSelectProcess} : IProps) {
  const handleClose = () => {
    if(setSelectedTab){
      setSelectedTab(0);
    }
    setSelectProcess(null)
    setOpenFeedBack(false);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (    
    <Dialog
      open={openFeedBack}
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
              <h2>Nota enviada com sucesso!</h2>
            <p>O financeiro já recebeu sua nota assinada. Em breve, a solicitação de comissão estará disponível no seu painel.</p>
          </div>

          <ButtonComponent 
            name="confirm"
            variant="contained"
            onClick={handleClose}
            labelColor="white"
            size={"large"}
            label={"Voltar para o painel"}
            startIcon={<HomeIcon fill={'white'} width={20} height={20} />}
          />
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}
