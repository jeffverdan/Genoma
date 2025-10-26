import React, { useState, ChangeEvent, useEffect } from 'react';
import { Collapse, Checkbox, FormControlLabel, Chip } from '@mui/material';
import { ChecksReviewType, DataToSaveType, ErrorDataType } from '@/interfaces/PosVenda/Devolucao';
import { ItemsCorrecoes } from '@/interfaces/PosVenda/Devolucao';
import MultipleSelectCheckmarks from '@/components/SelectMultiInput';
import EmptyTextarea from '@/components/TextArea';
import { useForm } from "react-hook-form";
import { HiChevronDoubleLeft, HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import ButtonComponent from '@/components/ButtonComponent';
import { CheckIcon, HomeModernIcon } from '@heroicons/react/24/solid';

interface Props {
    review?: {
        reviewChecks?: ItemsCorrecoes[]
        obs?: string
    }
    modal?: boolean
};

const ReviewImovel = (props: Props) => {
    const [collapse, setCollapse] = useState(false);
    const { review, modal } = props;
    const check = review?.reviewChecks?.every(e => e.saved);

    return (
        <Collapse in={modal ? true : collapse} orientation="vertical" collapsedSize={174} className="card-revisar">
            <div className=''>

                <div className='header-card' onClick={() => !modal ? setCollapse(!collapse) : ''}>
                    <div className='label-card'>
                        {check ? <CheckIcon className='ico-primary' /> : <HomeModernIcon className='ico-red' />}
                        Imóvel
                        {check
                            ? <Chip className='chip green' label={'feito'} />
                            : <Chip className='chip red' label={!!review?.reviewChecks?.[1] ? review?.reviewChecks?.length + ` correções` : '1 correção'} />
                        }
                    </div>
                    {!modal &&
                        <ButtonComponent
                            size={'large'}
                            variant={'text'}
                            name={'collapse'}
                            label={''}
                            onClick={() => setCollapse(!collapse)}
                            endIcon={collapse ? <HiChevronUp className='colorP500' /> : <HiChevronDown className='colorP500' />}
                        />
                    }

                </div>

                <div className='content-card'>
                    <div className='error-list'>
                        {review?.reviewChecks?.map((e) => (
                            <p className='error-item' key={e.id}> - {e.nome}</p>
                        ))}
                    </div>
                    <div>
                        <p className='obs-title'>
                            Observações de imóvel
                        </p>
                        <span className='obs-content'>
                            {review?.obs || '---'}
                        </span>
                    </div>
                </div>
            </div>
        </Collapse>
    )
}

export default ReviewImovel;