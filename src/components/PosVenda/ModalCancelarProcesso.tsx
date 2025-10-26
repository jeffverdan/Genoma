import React, {useState, useEffect} from 'react'
import SimpleDialog from '../Dialog'
import ButtonComponent from '../ButtonComponent'
import InputText from '../InputText/Index'
import dateMask from '@/functions/dateMask'
import { useForm } from 'react-hook-form'
import TextArea from '@/components/TextArea';
import { Skeleton } from '@mui/material'
import { HiCheck } from 'react-icons/hi2'
import postCancelarProcesso from '@/apis/postCancelarProcesso'
import { useRouter } from 'next/router'

interface IModal{
    openRemover: boolean
    feedbackAlert: any
    dataProcesso: any
    setOpenRemover: (newValue: boolean) => void
    loading: boolean
    setLoading: (e: boolean) => void
    openDialog?: boolean
    setOpenDialog: (newValue: boolean) => void
    setTypeDialog: (newValue: string) => void
    returnList: (idArrayVendas?: number) => Promise<void>
}

interface FormValues {
    dataCancelamento: string;
    observacao: string
}

export default function ModalCancelarProcesso({openRemover, feedbackAlert, dataProcesso, setOpenRemover, loading, setLoading, openDialog, setOpenDialog, setTypeDialog, returnList}: IModal) {
    
    const {
        register,
        watch,
        setValue,
        setError,
        clearErrors,
        reset,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>({});

    const router = useRouter();
    const errorMsg = 'Campo obrigatório';
    const processoId: number = dataProcesso.id;
    const [usuarioId, setUsuarioId] = useState<any>('');
    // const usuarioId: any = localStorage.getItem('usuario_id') !== undefined || localStorage.getItem('usuario_id') !== null ? localStorage.getItem('usuario_id') : '';
    const endereco = `${dataProcesso?.logradouro}, ${dataProcesso?.numero}, ${dataProcesso?.unidade ? dataProcesso?.unidade + ', ' : ""} ${!!dataProcesso?.complemento ? dataProcesso?.complemento + ', ' : ""}${dataProcesso?.bairro + ' - ' + dataProcesso.cidade}`
    const nomeGerente = `${dataProcesso?.gerente?.[0]?.name}`

    useEffect(() => {
        if(localStorage.getItem('usuario_id') !== undefined || localStorage.getItem('usuario_id') !== null){
            setUsuarioId(localStorage.getItem('usuario_id'));
        }
    }, [usuarioId])

    const handleInput = (type: any, value: string) => {
        if (type === 'dataCancelamento') {
            setValue(type, dateMask(watch(type)))
        }
        else{
            // Observacao
            setValue(type, value);
        }
    }

    const handleSave = async () => {
        const dataCancelamento = watch('dataCancelamento');
        const observacao = watch('observacao');
        await postCancelarProcesso(processoId, usuarioId, dataCancelamento, observacao);
        console.log('TESTE')

        if(sessionStorage.getItem('type') !== undefined && sessionStorage.getItem('type') === 'cancelar-processo'){
            router.push('/posvenda/');
            console.log('TESTE 1')
        }
        else{
            await returnList();
            setTypeDialog('cancelar-processo')
            setOpenDialog(true)
            console.log('TESTE 2')
        }
    }

    const onCloseRemover = () => {
        sessionStorage.removeItem('type')
        setOpenRemover(false);
        clearErrors('observacao');
        clearErrors('dataCancelamento');
    };
    
    return (
        <div className="modal-form">
            <SimpleDialog
                max-width='800'
                open={openRemover}
                className='modal-cancelar'
                onClose={onCloseRemover}
                title={
                    dataProcesso.length === 0 
                    ? <Skeleton variant="rectangular" width={650} height={78} /> 
                    : <>Você realmente quer cancelar<br/> essa venda?</>}
                Footer={<div className='flex gap20 f-modal-cancelar'>
                    <ButtonComponent
                        size='medium'
                        variant={'text'}
                        label={'Voltar'}
                        onClick={onCloseRemover}
                    />
                    <div className="btn-cancelar">
                    <ButtonComponent
                        type='button'
                        disabled={feedbackAlert.loading}
                        size='medium'
                        name='danger'
                        endIcon={<HiCheck />}
                        variant={'contained'}
                        label={'Cancelar venda'}
                        onClick={handleSubmit(handleSave)}
                        labelColor='white'
                    />
                    </div>
                </div>}
            >
                <div className="content">
                    {
                        dataProcesso.length === 0
                        ?
                        <>
                            <Skeleton variant="rectangular" height={22} style={{marginBottom: '25px'}} />
                            <Skeleton variant="rectangular" width={300} height={82} style={{marginBottom: '25px'}} />
                            <Skeleton variant="rectangular" height={118} style={{marginBottom: '25px'}} />
                        </>
                        :
                        <>
                            <p>
                                Você está prestes a cancelar todo o processo relacionado ao imóvel: <span>{endereco}</span>. Gerente <span>{nomeGerente}</span>
                            </p>
                            
                            <div className="w-i-date">
                                <InputText
                                    label={'Data do cancelamento'}
                                    placeholder={'Ex: dd/mm/aaaa'}
                                    sucess={!errors.dataCancelamento && watch('dataCancelamento')?.length === 10}
                                    error={!!errors.dataCancelamento ? true : false}
                                    required={true}
                                    msgError={errors.dataCancelamento}
                                    value={watch('dataCancelamento')}
                                    inputProps={{
                                        maxlength: 10
                                    }}
                                    {...register('dataCancelamento', {
                                        required: errorMsg,
                                        setValueAs: e => dateMask(e),
                                        validate: (value) => value.length === 10 || "Data inválida",
                                        onChange: (e) => handleInput('dataCancelamento', e.target.value)
                                    })}
                                />
                            </div>

                            <>
                                <TextArea
                                    label={'Por que a venda foi cancelada?'}
                                    minRows={2}
                                    placeholder='A venda foi cancelada porque o comprador desistiu.'
                                    error={!!errors.observacao}
                                    value={watch('observacao')}
                                    {...register("observacao", {
                                        required: errorMsg,
                                        onChange: (e) => handleInput('observacao', e.target.value)
                                    })}
                                />
                                {
                                    errors.observacao &&
                                    <span className="errorMsg">
                                    * { errorMsg }
                                    </span> 
                                }
                            </>
                        </>
                    }

                </div>
            </SimpleDialog>
        </div>
    )
}
