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
    saveData: (e: {"recibo": SaveDataType}) => void
    error: ErrorDataType
    readyOnly: boolean
    returnData: DataToSaveType
};

const ReviewRecibo = (props: Props) => {
    const [collapse, setCollapse] = useState(false);
    const { checks, setChecks, list, saveData, error, readyOnly, returnData } = props;
    const [reviewChecks, setReviewChecks] = useState<ItemsCorrecoes[]>([]);
    const { register, watch, setValue } = useForm();

    const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
        const check = event.target.checked;
        setChecks({ ...checks, recibo: check });
        setCollapse(check);
        if (!check) {
            setReviewChecks([]);
        }
    };

    useEffect(() => {
        if (readyOnly) {
            setValue('obs', returnData?.recibo?.obs);
            setReviewChecks(returnData?.recibo?.reviewChecks || []);            
        }
    }, [readyOnly]);

    useEffect(() => {
        if (!readyOnly) {
        saveData({
            recibo: {
                reviewChecks: reviewChecks,
                obs: watch('obs')
            }
        });
        if (error?.recibo?.reviewChecks) {
            error.recibo.reviewChecks = !reviewChecks.some(e => e.id);
        }
    }
    },[reviewChecks]);

    const handleTextArea = (e: any) => {
        setValue('obs', e.target.value);
        if(error?.recibo?.obs) error.recibo.obs = false;
    };

    return (
        <Collapse in={collapse} orientation="vertical" collapsedSize={116} className="card-collapse ">
            <div className='card-review'>
                <div className='header-card' onClick={() => setCollapse((prev) => !prev)}>
                    <FormControlLabel
                        control={<Checkbox checked={checks?.recibo} onChange={handleCheck} />}
                        label="Revisar Recibo de Sinal"
                        className={`check bold ${checks?.recibo ? 'checked' : ''}`}
                        disabled={readyOnly}
                    />
                    {checks?.recibo ?
                        <Chip className='chip red' label={`${reviewChecks.length === 1 ? `1 Correção` : `${reviewChecks.length} Correções`}`} />
                        :
                        <span className='info-card'>
                            Problemas com informações contidas no recibo, ou data de assinatura incorreta.
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
                        label='Correções do recibo de sinal'
                        name={''}
                        disable={readyOnly}
                        options={list || []}
                        value={reviewChecks}
                        onChange={setReviewChecks}
                        error={error?.recibo?.reviewChecks}
                        labelMenu={'Correções do recibo de sinal'}
                        maxWidth={300}
                        placeholder="Ex: Data de assinatura ausente/incorreta"
                    />

                    <div className='text-area'>
                        <EmptyTextarea
                            minRows={2}
                            value={watch('obs')}
                            error={error?.recibo?.obs}
                            label={'Observações de Recibo de Sinal'}
                            placeholder={'Ex: O arquivo final do recibo de sinal não veio assinado.'}
                            disabled={readyOnly}
                            {...register("obs", {
                                onChange: (e) => handleTextArea(e),
                                onBlur: () => saveData({
                                    recibo: {
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

export default ReviewRecibo;