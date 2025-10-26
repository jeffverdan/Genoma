import  React, {useState} from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Avatar, Chip, DialogActions, Divider, IconButton, Slide } from '@mui/material';
import { Close } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { ItemListRecentsType, UrlsAnunciosType } from '@/interfaces/Corretores';
import { PhotoIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import converterParaReal from '@/functions/converterParaReal';
import { es } from 'date-fns/locale';

const TransitionVerticalTop = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface SimpleDialogProps {
  open: boolean;
  setOpen: (e: boolean) => void;
  // onClose: () => void;
  title?: string | React.ReactNode;
  // children?: React.ReactNode;
  // Footer?: React.ReactNode;  
  paperWidth?: string
  paperHeight?: string
  PaperProps?: any
  className?: string
  parcelasProcesso: ItemListRecentsType[]
}

export default function DialogDetalhes(props: SimpleDialogProps) {
    const { open, setOpen, title, paperWidth, paperHeight, parcelasProcesso, ...rest } = props;
    const [date] = useState<Date>(new Date());
    
    const handleClose = () => {
        setOpen(false)
    };

    // const handleListItemClick = (value: string) => {
    //     onClose();
    // };

    console.log('parcelasProcesso: ', parcelasProcesso);

    const labelChipAndDate = (item: any) => {
        console.log('item: ', item)
        const statusId = item?.finance_status_id;
        if(statusId === '9'){
            return { label: 'Em andamento', labelDate: "Previsão de pagamento", class: 'yellow600' }
        }
        else if(statusId === '10'){
            return { label: "Liberado", labelDate: "Data de liberação", class: 'green500' }
        }
        else if(statusId === '11'){
            return { label: "Solicitado", labelDate: "Data de solicitação", class: 'primary500' }
        }
        else if(statusId === '12'){
            return { label: "Em transferência", labelDate: "Última transferência", class: 'green500' }
        }
        else if(statusId === '13'){
            return { label: "Concluído", labelDate: "Data de conclusão", class: 'green500' }
        }
        else if(statusId === '16'){
            return { label: "Cancelado", labelDate: "Data de cancelamento", class: 'red500' }
        }
    };

    function convertReal(value: number): string {
        return converterParaReal(value ?? 0).replace('R$', '').toString().replace(/^R\$\s?/, '');
    }

    return (
        <div>
        <Dialog 
            onClose={handleClose} 
            open={open}
            TransitionComponent={TransitionVerticalTop}
            maxWidth={'lg'}       
            PaperProps={{
                style: {
                    width: paperWidth || 'auto',
                    height: paperHeight  || 'auto',
                }
            }}
            {...rest}
            className="dialog-detalhes-corretor"
        >
            {title && <DialogTitle className="header-dialog">{title}</DialogTitle>}
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

            <DialogContent className='dialog-content dialog-parcelas'>
                <div className="ultimas-comissoes">
                    <Divider />
                    {parcelasProcesso?.filter((e,i) => i < 5).map((item, index) => (
                        <>
                            <div className="item-row" /*onClick={() => setSelectProcess(item)}*/>
                                <div className="header-container">
                                    <Chip className={`chip ${labelChipAndDate(item)?.class}`} label={labelChipAndDate(item)?.label} />
                                    <div className="data-container data-container-m">
                                        <span className={`label ${labelChipAndDate(item)?.class}`}>{labelChipAndDate(item)?.labelDate}</span>
                                        <span className="data">{item?.data_ordenacao_exibicao || '--/--/--'}</span>
                                    </div>
                                </div>

                                <div className="valor-date">
                                    <div className="valor-container">
                                        <span className="sigla">R$</span>
                                        <span className="valor">{convertReal(item?.soma ?? 0)}</span>
                                    </div>
                                    <span className="tipo">{(item?.tipo_comissao === 'partes' ?  `Parcela ${item?.numero_parcela} ${item?.total_parcelas ? 'de ' + item?.total_parcelas : ''}` : 'Á Vista')}</span>
                                </div>
                                <div className="endereco-container">
                                    <Avatar>{item?.url_imagens ? <Image height={40} src={item?.url_imagens} alt={"Fotografio imóvel"} /> : <PhotoIcon width={20} />}</Avatar>
                                    <div className="row">
                                        <span className="logradouro">
                                            {item?.logradouro}
                                            {item?.numero && ', ' + item?.numero}
                                        </span>
                                        <span className="complemento">
                                            {item?.unidade}
                                            {(item?.complemento) && ' / '}
                                            {item?.complemento}
                                            {(item?.bairro) && ' - '}
                                            {item?.bairro}
                                        </span>
                                    </div>
                                </div>
                                <div className="data-container">
                                    <span className={`label ${labelChipAndDate(item)?.class}`}>{labelChipAndDate(item)?.labelDate}</span>
                                    <span className="data">{item?.data_ordenacao_exibicao || '--/--/--'}</span>
                                </div>
                            </div>
                            {(index < parcelasProcesso.length || parcelasProcesso.length > 5) && <Divider />}
                        </>
                    ))}
                </div>
            </DialogContent>

            {/* {Footer && <DialogActions>
                {Footer}
            </DialogActions>} */}
        </Dialog>
        </div>
    );
}
