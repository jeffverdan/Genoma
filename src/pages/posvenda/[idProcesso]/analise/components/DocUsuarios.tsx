import ButtonComponent from '@/components/ButtonComponent'
import InputSelect from '@/components/InputSelect/Index'
import SkeletonDocumentos from '@/components/Skeleton/PosVenda/Analise/documentos'
import { CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/solid'
import {DocumentTextIcon as OutlinedDocumentTextIcon} from '@heroicons/react/24/outline'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import React from 'react'
import { useForm } from 'react-hook-form';
import { ApiTopicosAnaliseType } from '@/interfaces/PosVenda/Analise'
import ShowDocument from '@/apis/getDocument'
import { Document } from '@/interfaces/Users/document';


interface FormValues {
    comprador?: string
    vendedor?: string
}
interface IDocUsuario {
    pessoa: string
    handleInput: (type: "comprador" | "vendedor", e: any) => void
    lists?: ApiTopicosAnaliseType
    docLists?: Document
    loading: boolean
    quantidade?: number
}

export default function DocUsuarios({pessoa, handleInput, lists, docLists, loading, quantidade} : IDocUsuario) {   
    const errorMsg = 'Campo obrigatório'
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
            comprador: '',
            vendedor: '',
        }
    });

    const optionsUser = pessoa === 'vendedor' ? lists?.listaVendedores : lists?.listaCompradores;
    const pessoasTitle = (pessoa === 'vendedor' ? 'Vendedor' : 'Comprador') + (Number(quantidade) > 1 ? 'es' : '')

    return (
        <div>
            <section className='cards docs'>
                <div className='title' style={{justifyContent: 'space-between'}}>
                    <div className='info' style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                        {/* <OutlinedDocumentTextIcon className="iconOutlined" /> */}
                        <h2>{Number(quantidade) > 1 && <Chip className='chip neutral' label={`${quantidade}`} />} {pessoasTitle}</h2>
                        {/* {Number(quantidade) > 0 && <Chip className='chip neutral' label={`${quantidade} ${pessoasTitle}`} />} */}
                    </div>

                    <div className="doc-select">
                        {
                            !loading ?   
                                <InputSelect 
                                    option={optionsUser} 
                                    label={''} 
                                    sucess={optionsUser?.[0]?.id.toString() !== ''}
                                    defaultValue={optionsUser?.[0]?.id.toString()}
                                    {...register(pessoa === 'vendedor' ? 'vendedor' : 'comprador', {
                                        required: errorMsg,
                                        onChange: (e) => handleInput(pessoa === 'vendedor' ? 'vendedor' : 'comprador', e.target.value)
                                    })}
                                    autoWidth={false}
                                    disabled={Number(quantidade) > 1 ? false : true}
                                    sx={{
                                        width: 150, // Defina a largura desejada
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                    }}
                                />
                            
                            :
                            <Skeleton animation="wave" width={194} height={36} />
                        }
                    </div>
                </div>

                <div className='list-items list-doc-analise'>
                    {loading
                        ? <SkeletonDocumentos />
                        : docLists?.data?.map((doc =>
                            <div className='item' key={doc.id}>
                                <div className='icon-label'>
                                    <CheckCircleIcon />
                                    {doc.tipo_documento_ids?.length > 0 ? (
                                        <>
                                            <p className="doc-p" key={doc.id}>{doc.tipo_documento_ids.map(doc => ' ' + doc.nome_tipo).toString()} {doc.tipo_documento_ids.length > 1 && <Chip className='chip neutral' label={doc.tipo_documento_ids.length + ' tipos'}/>}</p>
                                        </>
                                        
                                    ) : (
                                        <>
                                            <p className="doc-p" key={doc.id}>{doc.tipo_documento?.nome} {doc.tipo_documento_ids.length > 1 && <Chip className='chip neutral' label={doc.tipo_documento_ids.length + ' tipos'}/>}</p>
                                        </>
                                    )}
                                </div>

                                <div className='icon-label actions actions-doc'>
                                        <ButtonComponent startIcon={<DocumentTextIcon/>} size={'large'} variant={'contained'} label={'Ver documento'} onClick={() => ShowDocument(doc.id, 'documento')} />
                                    </div>
                            </div>
                        ))
                    }
                </div>
            </section>
        </div>
    )
}
