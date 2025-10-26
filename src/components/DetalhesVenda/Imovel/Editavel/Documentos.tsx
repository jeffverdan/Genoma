import ButtonComponent from '@/components/ButtonComponent';
import UploadDocumentos from '@/components/UploadDocumentos'
import React, { BaseSyntheticEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { HiCheck } from 'react-icons/hi2';
import styles from './BlockStyles.module.scss'
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { ListaDocumentosType } from '@/interfaces/Documentos';
import { BlockProps } from '../../Interfaces';

interface FormValues {
    tipoDocumento?: string
}

export default function Documentos({ data, index, handleShow, setBlockSave, saveBlocks, listaDocumentos, Footer, handleNextBlock, handlePrevBlock, blocksLength }: BlockProps) {
    const [multiDocs, setMultiDocs] = useState<any>([]);
    const perfil = localStorage.getItem('perfil_login');
    const [res, setRes] = useState<any>();

    const context = {
        dataProcesso: data,      
        idProcesso: data?.id || '',
        multiDocs, setMultiDocs,
        setRes,
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

    useEffect(() => {
        if (res?.salvar_correcao) handleInput();
    }, [res])

    const handleInput = () => {
        let valor = {
            'bloco': 7,
            'processo_id': data.processo_id || '',
            'usuario_id': localStorage.getItem('usuario_id') || '',
            'recibo_saved': (res.salvar_correcao.dados?.check_gerente === 1) || false,
        }
        // setDataSave(valor);
        setBlockSave(valor);
    };

    return (
        <>
            <h2>Documentos do imóvel</h2>

            <UploadDocumentos                
                register={register}
                errors={errors}
                context={context}
                pessoa="imovel"
                idDonoDocumento={data?.imovel_id}
                option={listaDocumentos}
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
                            onClick={e => handleShow(index, 'voltar')} /*goToPrevSlide(index)*/
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
                            onClick={handleSubmit(() => [saveBlocks(), handleShow(index, 'salvar')])}
                        />
                    </div>
                </footer>
            }
            {
                Footer &&
                <Footer 
                    goToPrevSlide={() => handlePrevBlock(index)} 
                    goToNextSlide={handleSubmit(() => handleNextBlock(index))} 
                    index={index} 
                    tipo={blocksLength === index + 1 ? 'last_block' : ''} 
                />
            }

        </>
    )
}
