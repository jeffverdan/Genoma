import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { DialogActions, IconButton, Slide } from '@mui/material';
import { Close } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import Image from 'next/image';
import ButtonComponent from '../ButtonComponent';
import { CheckIcon } from '@heroicons/react/24/solid';
import AlterarStatusImagem from '@/images/alterar_status.png';
import { useRouter } from 'next/router';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import ApiAlterarStatus from '@/apis/AlterarStatus';
import { DataToSave } from '@/interfaces/PosVenda/AlterarStatus';
import ImgConcluir1 from '../../images/concluir-processo-1.png';
import ImgConcluir2 from '../../images/concluir-processo-2.png';
import postSolicitacaoNucleo from '@/apis/postSolicitacaoNucleo';

interface FormValues {
  quantidade_servicos: number | string;
  servico?: Servico[];
  onus_solicitada: string;
  vendedor_comarca: string;
}

interface Servico {
  tipo?: number | string;
  servico_detalhado?: number | string;
  observacao?: string;
}

const TransitionVerticalTop = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  children?: React.ReactNode;
  Footer?: React.ReactNode;
  paperWidth?: string
  paperHeight?: string
  PaperProps?: any
  className?: string
  tipoConcluir?: string
  processData?: ProcessType
  dataToSave: FormValues | undefined
  idProcesso: string
}

export default function DialogConcluirPedido(props: SimpleDialogProps) {
  const { onClose, open, tipoConcluir, processData, dataToSave, idProcesso, children, title, Footer, paperWidth, paperHeight, ...rest } = props;

  const router = useRouter();

  const handleClose = () => {
    onClose();
  };

  console.log(dataToSave);

  const handleConcluir = async (e: any) => {
    sessionStorage.setItem('type', 'concluir-pedido');
    sessionStorage.setItem('idPedido', idProcesso);

    if(dataToSave){
      const res: any = await postSolicitacaoNucleo(idProcesso, dataToSave);
      console.log(res);

      if (res) {
        router.push('/posvenda/');
        onClose();
      }
    }
  }

  const handleListItemClick = (value: string) => {
    onClose();
  };

  console.log(open);  

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      TransitionComponent={TransitionVerticalTop}
      maxWidth={'lg'}
      PaperProps={{
        style: {
          width: paperWidth || 'auto',
          height: paperHeight || 'auto',
        }
      }}
      {...rest}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
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

      <DialogContent className='dialog-content dialog-concluir-processo'>
        <div className='dialog-image-content'>
          <Image src={ImgConcluir2} alt={'concluír pedido'} />
          <div className='container-text-actions'>
            <div className='text-container'>
              <h2>As informações do serviço estão corretas?</h2>

              <div>
                <p>Confirme se está tudo certo antes de enviar para a equipe do<br/> núcleo. Com tudo revisado é só clicar no botão abaixo para<br/> solicitar o serviço.</p>
              </div>
            
            </div>
            <div className='btn-actions'>
              <ButtonComponent size={'large'} variant={'text'} label={'Voltar'} onClick={handleClose} />
              <ButtonComponent
                size={'large'}
                variant={'contained'}
                label={'Solicitar serviço!'}
                endIcon={<CheckIcon />}
                labelColor='white'
                onClick={(e) => handleConcluir(e)}
              />
            </div>
          </div>
        </div>

      </DialogContent>

      {Footer && <DialogActions>
        {Footer}
      </DialogActions>}


    </Dialog>
  );
}