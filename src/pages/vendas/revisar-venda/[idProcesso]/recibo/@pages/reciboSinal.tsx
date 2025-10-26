import React, { useEffect, useState } from 'react';
import { RegisterOptions, UseFormRegisterReturn, useForm } from 'react-hook-form'
import styles from './BlockStyles.module.scss';
import UploadDocumentos from '@/components/UploadDocumentos';

interface FormValues {
    data_assinatura: string;
}

type BlockProps = {
    handleNextBlock: (index: number) => void
    handlePrevBlock: (index: number) => void
    index: number
    data: any
    Footer?: React.FC<{
        goToPrevSlide: (index: number) => void
        goToNextSlide: any
        index: number
        tipo: string
    }>
    handleShow?: any
    setBlockSave?: any
    saveBlocks?: any
    blocksLength: number
};

const ReciboSinal: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer, handleShow, setBlockSave, saveBlocks, blocksLength }) => {
    const errorMsg = 'Campo obrigatório';
    const {
        register,
        watch,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
            data_assinatura: '',
        }
    });

    const [multiDocs, setMultiDocs] = useState<any>([]);
    const [res, setRes] = useState<any>();
    const dataContext = {
        dataProcesso: data,
        selectItem: '',
        idProcesso: data?.id,
        multiDocs,
        setMultiDocs,
        setRes
    };
    const [addRecibo, setAddRecibo] = useState<boolean>(false);

    const handleClick = (direction: string) => {
        if (direction === 'NEXT') {
            handleNextBlock(index);
        } else {
            handlePrevBlock(index);
        }
    };

    useEffect(() => {
        if (res?.salvar_correcao) handleInput();
    }, [res])

    const handleInput = () => {
        let valor = {
            'bloco': 2,
            'processo_id': data?.processo_id,
            'usuario_id': localStorage.getItem('usuario_id'),
            'recibo_saved': (res.salvar_correcao.dados?.check_gerente === 1) || false,
        }
        // setDataSave(valor);
        setBlockSave(valor);
    };

    return (
        <>
            <div className={styles.containerBlock}>
                <div className={styles.headerBlock}>
                    <h3>Realize o Upload do Recibo de Sinal final assinado pelas partes:</h3>
                    <p className="p1">Realize Upload dos arquivos no formato .doc, .docx ou .pdf.</p>
                </div>

                <div className="content">
                    <div className='upload'>
                        <UploadDocumentos 
                            context={dataContext}
                            pessoa="imovel"
                            idDonoDocumento={data?.imovel_id}
                            option={[{
                                id: 8,
                                nome: "recibo",
                                tipo: 'imóvel',
                                validade_dias: null
                            }]} 
                            setAddRecibo={setAddRecibo}                            
                            />
                    </div>
                </div>

                {
                    Footer &&
                    <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(() => handleClick("NEXT"))} index={index} tipo={blocksLength === index + 1 ? 'last_block' : ''} />
                }
            </div>
        </>
    );
};

export default ReciboSinal;