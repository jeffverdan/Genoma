import React, {useState, useEffect} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import { useForm } from 'react-hook-form';
import InputText from '../InputText/Index';
import TextArea from '@/components/TextArea';
import ButtonComponent from '../ButtonComponent';
import CheckBox from '../CheckBox';
import Skeleton from '@mui/material/Skeleton';
import postSaveNota from '@/apis/postSaveNota';
import postEditarNota from '@/apis/postEditarNota';

interface IModal{
    openModal: boolean
    setOpenModal: (e: boolean) => void
    idProcesso: string
    selectNota: any
    returnNotas: () => void
    loadingModalNota: boolean
}

interface FormValues {
    titulo: string
    descricao: string
    importante: boolean
}

export default function ModalFormNotas({openModal, setOpenModal, idProcesso, loadingModalNota, returnNotas, selectNota}: IModal) {
    const {
        register,
        watch,
        setValue,
        setError,
        clearErrors,
        reset,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
            titulo: selectNota?.titulo || '',
            descricao: selectNota?.descricao || '',
            importante: selectNota.length === 0 ? false : selectNota?.importante === 1 ? true : false
        }
    });

    // console.log(selectNota);
    // console.log('WATCH: ', watch())

    const errorMsg = 'Campo obrigatório';
    const [checkedImportante, setCheckedImportante] = useState(selectNota.length === 0 ? false : selectNota?.importante === 1 ? true : false);
    const ImportanteCheck = [
        { index: 0, label: "Marcar como importante", value: checkedImportante ? '0' : '1', path: "formaPagamento.importante", checked: checkedImportante },
    ]

    const handleInput = async (type: any | boolean, value: string) => {
        setValue(type, value);
    }

    const handleCheck = (e: any) => {
        setCheckedImportante(e.target.checked);
        setValue('importante', e.target.checked);
      }
    
    const handleClose = async () => {
        clearErrors('titulo');
        // await setValue('titulo', '');
        clearErrors('descricao');
        // await setValue('descricao', '');
        setCheckedImportante(false);
        setOpenModal(false);
    };

    const handleSave = async () => {
        // console.log('titulo: ', watch('titulo'))
        // console.log('Descricao: ', watch('descricao'))
        // console.log('Importante: ', watch('importante'))
        const res = await postSaveNota(Number(idProcesso), watch('titulo'), watch('descricao'), watch('importante'))
        returnNotas()
        handleClose();
    }

    const handleEdit = async(id: number) => {
        // console.log('ID: ', id)
        const res = await postEditarNota(id, Number(idProcesso), watch('titulo'), watch('descricao'), watch('importante'));
        returnNotas()
        handleClose();
    }

    return (
        <div>
            {
                <>
                <Dialog
                    // onClose={(e) => closeModal}
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={openModal}
                    TransitionComponent={Transition}
                    fullWidth
                    className="modal-form-notas"
                >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title" className="title">
                    Escrever nota
                </DialogTitle>
                <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
                >
                    <CloseIcon />
                </IconButton>

                <DialogContent>
                    {
                        loadingModalNota
                        ?
                        <>
                            <Skeleton variant="rectangular" width={'100%'} height={80} style={{marginBottom: '20px'}} />
                            <Skeleton variant="rectangular" width={'100%'} height={290} />
                        </>
                        :
                        <>
                            <InputText
                                label={'Título ou assunto'}
                                placeholder={'Ex: Vejam isso!'}
                                sucess={!errors.titulo && watch('titulo')?.length !== 0}
                                error={!!errors.titulo ? true : false}
                                required={true}
                                msgError={errors.titulo}
                                value={watch('titulo')}
                                {...register('titulo', {
                                    required: errorMsg,
                                    onChange: (e) => handleInput('titulo', e.target.value)
                                })}
                            />

                            <>
                                <TextArea
                                    label={'Digite sua nota*'}
                                    minRows={8}
                                    placeholder='Ex: É importante prestar atenção nos documentos...'
                                    error={!!errors.descricao}
                                    value={watch('descricao')}
                                    {...register("descricao", {
                                        required: errorMsg,
                                        onChange: (e) => handleInput('descricao', e.target.value)
                                    })}
                                />
                                {
                                    errors.descricao &&
                                    <span className="errorMsg">
                                    * { errorMsg }
                                    </span> 
                                }
                            </>
                        </>
                    }
                </DialogContent>

                <DialogActions style={{width: '100%'}}>
                    <div className='flex gap20 f-modal-cancelar f-modal-notas' style={{justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{width: 'auto'}}>
                            {
                                ImportanteCheck.map(({ index, label, value, path, checked }) => (
                                <CheckBox 
                                    label={'Marcar como importante'}
                                    value={value}
                                    checked={checked}
                                    path={path}
                                    register={register}
                                    key={index}
                                    {...register('importante', {
                                        required: false,
                                        onChange: (e) => [handleCheck(e), handleInput('importante', e.target.value)],
                                    })}
                                    />
                                ))
                            }
                        </div>
                        <div className="btn-cancelar">
                            <ButtonComponent
                                type='button'
                                size='medium'
                                variant={'contained'}
                                label={selectNota.length === 0 ? 'Adicionar' : 'Salvar edição'}
                                // onClick={handleSubmit(() => selectNota.length === 0 ? handleSave : handleEdit(selectNota.id))}
                                onClick={handleSubmit(() => selectNota.length === 0 ? handleSave() : handleEdit(selectNota.id))}
                                labelColor='white'
                            />
                        </div>
                    </div>
                </DialogActions>
            </Dialog>
            </>
            }
        </div>
  )
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
});