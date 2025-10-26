import ButtonComponent from '@/components/ButtonComponent';
import UploadDocumentos from '@/components/UploadDocumentos'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { HiCheck } from 'react-icons/hi2';
import styles from './BlockStyles.module.scss'
import GetListaDocumentos from '@/apis/getListaDocumentos';
import ImovelData from '@/interfaces/Imovel/imovelData';
import { BlockProps } from '../../Interfaces';
import { MultiDocsType } from '@/components/UploadDocumentos/Interfaces';

interface FormValues {
    tipoDocumento?: string
}

export default function Documentos({ index, data, userData, handleShow, setBlockSave, saveBlocks, type }: BlockProps) {

    const [multiDocs, setMultiDocs] = useState<MultiDocsType[]>([]);
    const perfil = localStorage.getItem('perfil_login');    
    const tipoUsuario = userData?.tipo_pessoa === 0 ? 'pessoa-fisica' : 'pessoa-juridica';
    const [listaDocumentosPessoa, setListaDocumentosPessoa] = useState([]);
    console.log('Documentos data: ', data);

    const context = {
        dataProcesso: data,
        idProcesso: data?.processo_id || '',
        multiDocs,
        setMultiDocs
    };

    const {
        register,
        unregister,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
            tipoDocumento: '',
        }
    });

    const returnDocs = () => {
        const documentos = userData?.documentos?.data.map((doc: any) => ({
            'id': doc.id,
            'file': doc.nome_original,
            'item': doc.tipo_documento_ids.map((items: any) => ({
                'id': items.id || '',
                'values': items.tipo_documento_id,
            }))
        }))
        if (documentos) setMultiDocs(documentos);
    };

    const returnDocumentos = async () => {
        setBlockSave({ bloco: 4 })
        const documentos: any = await GetListaDocumentos();


        const tipo = tipoUsuario === 'pessoa-fisica'
            ? 'fisica'
            : tipoUsuario === 'pessoa-juridica' && userData?.vinculo_empresa?.id
                ? 'fisica'
                : 'juridica';

        const documentosUsuario = documentos?.filter((documento: any) => documento?.tipo.includes(tipo));

        setListaDocumentosPessoa(documentosUsuario);
    }
    useEffect(() => {
        returnDocumentos();
        // returnDocs();
    }, [])

    const handleSaveDoc = async () => {
        await saveBlocks()
        setBlockSave([])
        handleShow(index, 'salvar')
    }

    return (
        <>
            <h2>Documentos {userData?.tipo_pessoa === 0 ? 'pessoais' : ' da empresa'}</h2>

            <UploadDocumentos
                register={register}
                errors={errors}
                context={context}
                pessoa={type || 'imovel'}
                idDonoDocumento={userData?.id.toString() || ''}
                option={listaDocumentosPessoa}
                userData={userData}
            />

            {
                // Quando for Pós-venda
                (perfil === 'Pós-venda' || perfil === 'Coordenadora de Pós-Negociação' || perfil === 'Núcleo') &&
                <footer className={styles.footerControls} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <ButtonComponent
                            size={"large"}
                            variant={"text"}
                            name={"previous"}
                            label={"Voltar"}
                            // startIcon={<HiArrowLeft className='primary500' />}
                            onClick={e => [handleShow(index, 'voltar')]} /*goToPrevSlide(index)*/
                        />
                    </div>
                    <div>
                        <ButtonComponent
                            size={"large"}
                            variant={"contained"}
                            name={"previous"}
                            labelColor='white'
                            label={"Salvar"}
                            endIcon={<HiCheck fill='white' />}
                            onClick={handleSubmit((e) => handleSaveDoc())}
                        />
                    </div>
                </footer>
            }
        </>
    )
}
