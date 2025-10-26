import React, { useEffect, useState } from 'react';
import InputText from "@/components/InputText/Index";
import { useForm } from 'react-hook-form'
import styles from './BlockStyles.module.scss';
import SalvarCorrecaoDataAss from '@/apis/SalvarCorrecaoDataAss';
import dateMask from '@/functions/dateMask';

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
        tipo?: string
    }>
    handleShow?: any
    setBlockSave?: any
    saveBlocks?: any
    blocksLength: number
};

const DataAssinatura: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer, handleShow, setBlockSave, saveBlocks, blocksLength }) => {
    const errorMsg = 'Campo obrigatório';
    const {
        register,
        watch,
        setValue,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
            data_assinatura: data?.informacao?.data_assinatura || '',
        }
    });

    const handleClick = (direction: string) => {
        if (direction === 'NEXT') {
            handleNextBlock(index);
        } else {
            handlePrevBlock(index);
        }
    };

    const handleSave = async () => {
        let valor = {
            'bloco': 1,
            'processo_id': data.processo_id,
            'usuario_id': localStorage.getItem('usuario_id'),
            'data_assinatura': watch('data_assinatura'),
        };
        setBlockSave(valor)                
    };

    const handleChange = (e: string) => {
        const dataAssinatura: any = e;        
        if(dataAssinatura.length === 10){
            setValue('data_assinatura', dataAssinatura);
        }
    };

    return (
        <>
            <div className={styles.containerBlock}>
                <div className={styles.headerBlock}>
                    <h3>Confirme a data em que o Recibo foi assinado:</h3>
                    {/* <p className="p1">Fique atento com possíveis pendências no cadastro.</p> */}
                </div>

                <div className={styles.inputBlock}>
                    <InputText
                        label={'Data de assinatura do Recibo*'}
                        placeholder={'Ex.: DD/MM/AAAA'}
                        error={!!errors.data_assinatura}
                        msgError={errors.data_assinatura}
                        value={watch('data_assinatura')}
                        sucess={!errors.data_assinatura && !!watch('data_assinatura')}
                        // inputProps={{
                        //     maxLength: 9
                        // }}
                        saveOnBlur={() => handleSave()}
                        {...register('data_assinatura', {
                            required: errorMsg,
                            onChange: (e) => handleChange(e),
                            setValueAs: e => dateMask(e),
                        })}
                    />
                </div>


                {
                    Footer &&
                    <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(() => handleClick("NEXT"))} index={index} tipo={blocksLength === index + 1 ? 'last_block' : ''} />
                }
            </div>
        </>
    );
};

export default DataAssinatura;