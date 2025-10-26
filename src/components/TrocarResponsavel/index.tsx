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
import getPosVendaResp from '@/apis/getPosVendaResp'
import InputSelect from '../InputSelect/Index'
import postAlterarResponsavel from '@/apis/postAlterarResponsavel'

interface IModal{
    openTrocarResponsavel: boolean
    feedbackAlert: any
    dataProcesso: any
    setOpenTrocarResponsavel: (newValue: boolean) => void
    loading: boolean
    setLoading: (e: boolean) => void
    openDialog?: boolean
    setOpenDialog: (newValue: boolean) => void
    setTypeDialog: (newValue: string) => void
    returnList: (idArrayVendas?: number) => Promise<void>
    listaResponsaveis: IResponsaveis[]
}

interface FormValues {
    responsavel: string;
}

interface IResponsaveis {
    id: number,
    label: string
}

export default function TrocarResponsavel({openTrocarResponsavel, feedbackAlert, dataProcesso, setOpenTrocarResponsavel, loading, setLoading, openDialog, setOpenDialog, setTypeDialog, returnList, listaResponsaveis}: IModal) {
    const router = useRouter();
    const errorMsg = 'Campo obrigatório';
    const processoId: number = dataProcesso.imovel?.processo_id;
    const endereco = `${dataProcesso?.imovel?.logradouro}, ${dataProcesso?.imovel?.numero}, ${dataProcesso?.imovel?.unidade ? dataProcesso?.imovel?.unidade + ', ' : ""} ${!!dataProcesso?.imovel?.complemento ? dataProcesso?.imovel?.complemento + ', ' : ""}${dataProcesso?.imovel?.bairro + ' - ' + dataProcesso.imovel?.cidade}`

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
            responsavel: dataProcesso?.responsaveis?.data?.[0]?.id.toString() || ''
        }
    });

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
        await postAlterarResponsavel(processoId, watch('responsavel'));
        returnList();
        setTypeDialog('trocar-responsavel')
        setOpenDialog(true)
        setOpenTrocarResponsavel(false)
    }

    const onCloseRemover = () => {
        sessionStorage.removeItem('type')
        setOpenTrocarResponsavel(false);
        clearErrors('responsavel');
    };
    
    return (
        <div className="modal-form">
            <SimpleDialog
                max-width='800'
                open={openTrocarResponsavel}
                className='modal-cancelar'
                onClose={onCloseRemover}
                title={
                    (dataProcesso.length === 0 && listaResponsaveis.length === 0)
                    ? <Skeleton variant="rectangular" width={550} height={78} /> 
                    : <>Selecione abaixo o novo responsável<br/> do pós-venda pelo processo:</>}
                Footer={<div className='flex gap20 f-modal-cancelar'>
                    <ButtonComponent
                        size='medium'
                        variant={'text'}
                        label={'Voltar'}
                        onClick={onCloseRemover}
                    />
                    <ButtonComponent
                        type='button'
                        disabled={dataProcesso.length === 0 ? true : false}
                        size='medium'
                        name='trocar-responsavel'
                        endIcon={<HiCheck />}
                        variant={'contained'}
                        label={'Confirmar troca'}
                        onClick={handleSubmit(handleSave)}
                        labelColor='white'
                    />
                </div>}
            >
                <div className="content">
                    {
                        (dataProcesso.length === 0 && listaResponsaveis.length === 0)
                        ?
                        <>
                            <Skeleton variant="rectangular" width={400} height={22} style={{marginBottom: '25px'}} />
                            <Skeleton variant="rectangular" width={365} height={90} style={{marginBottom: '25px'}} />
                        </>
                        :
                        <>
                            <p style={{fontSize: '20px', fontWeight: '700'}}>
                                {endereco}
                            </p>
                            
                            <div style={{width: '365px'}}>
                                <InputSelect 
                                    option={listaResponsaveis}
                                    label={'Novo responsável: *'}
                                    placeholder={'Selecione'}
                                    error={!!errors.responsavel ? true : false}
                                    msgError={errors.responsavel}
                                    required={true}
                                    sucess={!errors.responsavel && watch('responsavel') !== ''}
                                    // value={watch('responsavel') || '0'}
                                    defaultValue={'0'}
                                    {...register('responsavel', {
                                    validate: (value) => {
                                        if (value === '0') {
                                            return "Nenhum responsável foi selecionado";
                                        }
                                    },
                                    required: errorMsg,
                                    onChange: (e) => handleInput('responsavel', e.target.value)
                                    })}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                />
                            </div>
                        </>
                    }

                </div>
            </SimpleDialog>
        </div>
    )
}
