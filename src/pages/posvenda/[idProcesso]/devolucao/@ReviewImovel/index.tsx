import React, { useState, ChangeEvent, useEffect } from 'react';
import { Collapse, Checkbox, FormControlLabel, Chip } from '@mui/material';
import { ChecksReviewType, DataToSaveType, ErrorDataType } from '@/interfaces/PosVenda/Devolucao';
import { ItemsCorrecoes } from '@/interfaces/PosVenda/Devolucao';
import MultipleSelectCheckmarks from '@/components/SelectMultiInput';
import EmptyTextarea from '@/components/TextArea';
import { useForm } from "react-hook-form";

type SaveDataType = {
    reviewChecks?: ItemsCorrecoes[]
    obs?: string
};

interface Props {
    checks: ChecksReviewType
    setChecks: (e: ChecksReviewType) => void
    list?: ItemsCorrecoes[]
    saveData: (e: { "imovel": SaveDataType }) => void
    error: ErrorDataType
    readyOnly: boolean
    returnData: DataToSaveType
}

const ReviewImovel = (props: Props) => {
    const [collapse, setCollapse] = useState(false);
    const { checks, setChecks, list, saveData, error, readyOnly, returnData } = props;
    const [reviewChecks, setReviewChecks] = useState<ItemsCorrecoes[]>([]);
    const { register, watch, setValue } = useForm();

    const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
        const check = event.target.checked;
        setChecks({ ...checks, imovel: check });
        setCollapse(check);
        if (!check) {
            setReviewChecks([]);
        }
    };

    useEffect(() => {
        if (readyOnly) {
            setValue('obs', returnData?.imovel?.obs);
            setReviewChecks(returnData?.imovel?.reviewChecks || []);            
        }
    }, [readyOnly]);    

    useEffect(() => {
        if (!readyOnly) {
            saveData({
                imovel: {
                    reviewChecks: reviewChecks,
                    obs: watch('obs')
                }
            });
            if (error?.imovel?.reviewChecks) {
                error.imovel.reviewChecks = !reviewChecks.some(e => e.id);
            }
        }
    }, [reviewChecks]);

    const handleTextArea = (e: any) => {
        setValue('obs', e.target.value);
        if(error?.imovel?.obs) error.imovel.obs = false;
    };

    return (
        <Collapse in={collapse} orientation="vertical" collapsedSize={116} className="card-collapse ">
            <div className='card-review'>
                <div className='header-card' onClick={() => setCollapse((prev) => !prev)}>
                    <FormControlLabel
                        control={<Checkbox checked={checks?.imovel} onChange={handleCheck} />}
                        label="Revisar cadastro do Imóvel"
                        className={`check bold ${checks?.imovel ? 'checked' : ''}`}
                        disabled={readyOnly}
                    />
                    {checks?.imovel ?
                        <Chip className='chip red' label={`${reviewChecks.length === 1 ? `1 Correção` : `${reviewChecks.length} Correções`}`} />
                        :
                        <span className='info-card'>
                            Erros como documentos do imóvel ou valores incorretos.
                        </span>
                    }
                    {/* <ButtonComponent
                    size={'large'}
                    variant={'text'}
                    name={'collapse'}
                    label={''}
                    onClick={() => setCollapse((prev) => !prev)}
                    endIcon={<HiChevronDoubleLeft className='colorP500 iconCollapse' />}
                /> */}

                </div>
                <div className='content-card'>
                    <p>O que precisa de revisão?*</p>

                    <MultipleSelectCheckmarks
                        label='Correções do imóvel'
                        name={''}
                        disable={readyOnly}
                        options={list || []}
                        value={reviewChecks}
                        onChange={setReviewChecks}
                        labelMenu={'Correções do imóvel'}
                        maxWidth={300}
                        placeholder='Ex: Documentos, valores, prazos...'
                        error={error?.imovel?.reviewChecks}
                    />

                    <div className='text-area'>
                        <EmptyTextarea
                            minRows={2}
                            value={watch('obs')}
                            label={'Observações de imóvel'}
                            placeholder={'Ex: Ônus reais pendentes na documentação.'}
                            error={error?.imovel?.obs}
                            disabled={readyOnly}
                            {...register("obs", {
                                onChange: (e) => handleTextArea(e),
                                onBlur: () => saveData({
                                    imovel: {
                                        reviewChecks: reviewChecks,
                                        obs: watch('obs')
                                    }
                                })
                            })}
                        />
                    </div>

                </div>
            </div>
        </Collapse>
    )
}

export default ReviewImovel;