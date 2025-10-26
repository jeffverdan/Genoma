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
  tipoConcluir: string
  processData?: ProcessType
}

export default function DialogConcluirProcesso(props: SimpleDialogProps) {
  const { onClose, open, tipoConcluir, processData, children, title, Footer, paperWidth, paperHeight, ...rest } = props;

  const router = useRouter();

  const handleClose = () => {
    onClose();
  };

  const handleConcluir = async (e: any) => {
    sessionStorage.setItem('type', 'concluir-processo');

    if (processData) {
        const enderecoProcesso = `${processData?.imovel.logradouro}${processData?.imovel.numero ? ', ' + processData?.imovel.numero : ''}${processData?.imovel.bairro ? ' - ' + processData?.imovel.bairro : ''}`
        const save: DataToSave = {
          status_processo_id: 7,
          processo_id: processData.imovel.processo_id || '',
          processo_nome: enderecoProcesso,
        }

        console.log(e);
        const res = await ApiAlterarStatus(save);
        console.log(res);
        if (res) {
          router.push('/posvenda/');
          onClose();
        }
    } else {
      console.log('Erro ao tentar concluir o processo, processData não encontrado: ', processData);
    }
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
          <Image src={tipoConcluir === 'completo' ? ImgConcluir1 : ImgConcluir2} alt={'concluír status'} />
          <div className='container-text-actions'>
            <div className='text-container'>
              <h2>
                {
                  tipoConcluir === 'completo'
                  ? `Parabéns! Sua venda está prestes a ser concluída! 🎉`
                  : 'Deseja mesmo concluir uma venda tão recente?'
                }
              </h2>

              <div>
                {
                  tipoConcluir === 'completo'
                  ? 
                  <>
                    <p style={{fontWeight: '700'}}>Chegou um dos melhores momentos da venda:<br/> sua conclusão. :)</p>
                    <p>A venda concluída é a aquela que passa por todas as etapas<br/> do pós-venda, garantindo a transferência de propriedade e a<br/> troca de chaves entre quem vende e quem compra.)</p>
                    <p>Clique em &quot;Concluir&quot; apenas se a venda estiver finalizada e os<br/> clientes satisfeitos.</p>
                  </>
                  :
                  <>
                    <p>A venda está nos status iniciais do processo.</p>
                    <p style={{fontWeight: '700'}}>Tenha certeza de que concluir a venda é realmente<br/> o que você deseja.</p>
                    <p><span>Lembre-se:</span> A venda concluída é a aquela que passa por<br/> todas as etapas do pós-venda, garantindo a transferência de<br/> propriedade e a troca de chaves entre quem<br/> vende e quem compra.</p>
                  </>
                }
              </div>
            
            </div>
            <div className='btn-actions'>
              <ButtonComponent size={'large'} variant={'text'} label={'Voltar'} onClick={handleClose} />
              <ButtonComponent
                size={'large'}
                variant={'contained'}
                label={'Concluir!'}
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


// function ApiAlterarStatus(e: any) {
//   throw new Error('Function not implemented.');
// }
// EXEMPLO DE USO
// function app() {
//   const [open, setOpen] = React.useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <div>
//       <Button variant="outlined" onClick={handleClickOpen}>
//         Open simple dialog
//       </Button>

//       <SimpleDialog
//         open={open}
//         onClose={handleClose}
//         title='Titulo da header'
//         Footer={<Button autoFocus onClick={handleClose}>Save changes</Button>}
//       >
//         Conteudo do Dialog
//       </SimpleDialog>
//     </div>
//   );
// }
