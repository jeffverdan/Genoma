import React, { useState, ChangeEvent, useEffect } from 'react';
import { Collapse, Checkbox, FormControlLabel, Chip, Divider } from '@mui/material';
import { ChecksReviewType, DataToSaveType, ErrorDataType, SelectType } from '@/interfaces/PosVenda/Devolucao';
import { ItemsCorrecoes } from '@/interfaces/PosVenda/Devolucao';
import MultipleSelectCheckmarks from '@/components/SelectMultiInput';
import EmptyTextarea from '@/components/TextArea';
import { useForm } from "react-hook-form";
import { HiChevronDoubleLeft, HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import ButtonComponent from '@/components/ButtonComponent';
import { CheckIcon } from '@heroicons/react/24/solid';
import SellerIco from '@/images/Seller_ico';
import BuyerIco from '@/images/Buyer_ico';

interface Props {
    type: 'vendedor' | 'comprador'
    reviewPF?: {
        reviews?: SelectType[],
        obs?: string
    }
    reviewPJ?: {
        reviews?: SelectType[],
        obs?: string
    }
    incompleto?: boolean
    incompletoObs: string | undefined | null
    modal?: boolean
}

const ReviewPF_PJ = (props: Props) => {
    const [collapse, setCollapse] = useState(false);
    const { type, reviewPF, reviewPJ, incompletoObs, incompleto, modal } = props;
    // const check = review?.reviewChecks?.every(e => e.saved);
    const label = type?.[0].toUpperCase() + type?.substring(1);
    const check = {
        pf: reviewPF?.reviews?.every(pf => pf.reviewChecks?.every(e => e.saved)),
        pj: reviewPJ?.reviews?.every(pj => pj.reviewChecks?.every(e => e.saved))
    }
    const [count, setCount] = useState({
        reviewsPF: 0,
        reviewsPJ: 0,
    });

    useEffect(() => {
        count.reviewsPF = 0;
        reviewPF?.reviews?.forEach((pf) => {
            count.reviewsPF = pf.reviewChecks.length + count.reviewsPF;
        });
        count.reviewsPJ = 0;
        reviewPJ?.reviews?.forEach((pj) => {
            count.reviewsPJ = pj.reviewChecks.length + count.reviewsPJ;
        });
        setCount({...count});
    }, [reviewPF, reviewPJ]);
    
    console.log(incompleto);
    

    return (
        <Collapse in={modal ? true : collapse} orientation="vertical" collapsedSize={174} className="card-revisar">
            <div className=''>
                <div className='header-card' onClick={() => setCollapse(!collapse)}>
                    <div className='label-card'>
                        {check.pf && check.pj && !incompleto
                            ? <CheckIcon className='ico-primary' />
                            : type === 'vendedor'
                                ? <SellerIco height={24} className='ico-red' />
                                : <BuyerIco height={24} className='ico-red' />
                        }
                        {label}
                        {check.pf && check.pj && !incompleto
                            ? <Chip className='chip green' label={'feito'} />
                            : <Chip className='chip red' label={count.reviewsPF + count.reviewsPJ > 1 ? count.reviewsPF + count.reviewsPJ + ' correções' : '1 correção'} />
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
                    {!!reviewPF?.reviews?.[0] &&
                        <>
                            <Chip className='chip green' label='Fisica' />
                            {reviewPF?.reviews?.map((pf) => (
                                <div key={pf.id}>
                                    <p>{pf.nome}</p>
                                    <div className='error-list'>
                                        {pf.reviewChecks.map((rev) => (
                                            <p className='error-item' key={rev.id}>- {rev.nome}</p>

                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div>
                                <p className='obs-title'>
                                    Observações de Vendedor Pessoa Física
                                </p>
                                <span className='obs-content'>
                                    {reviewPF?.obs || '---'}
                                </span>
                            </div>
                        </>
                    }

                    {!!reviewPJ?.reviews?.[0] &&
                        <>
                            {!!reviewPF?.reviews?.[0] && <Divider />}

                            <Chip className='chip green' label='Empresa' />

                            {reviewPJ?.reviews?.map((pj) => (
                                <div key={pj.id}>
                                    <div className='tags-representante'>
                                        <p>{pj.nome}</p>
                                        {pj.nome_empresa && <Chip className='chip neutral' label={pj.nome_empresa} />}
                                        {pj.representante && <Chip className='chip neutral' label='Representante legal' />}
                                        {pj.socio && <Chip className='chip neutral' label='sócio' />}
                                    </div>
                                    <div className='error-list'>
                                        {pj.reviewChecks.map((rev) => (
                                            <p className='error-item' key={rev.id}>- {rev.nome}</p>
                                        ))}
                                    </div>
                                </div>

                            ))}

                            <div>
                                <p className='obs-title'>
                                    Observações de Vendedor Pessoa Juridica
                                </p>
                                <span className='obs-content'>
                                    {reviewPJ?.obs || '---'}
                                </span>
                            </div>
                        </>
                    }

                    {incompleto &&
                        <>
                            {incompleto && <Chip className='chip green' label={`Cadastro incompleto (${type})`} />}
                            <div>
                                <p className='obs-title'>
                                    Observações {incompleto && 'de cadastro incompleto'}
                                </p>
                                <span className='obs-content'>
                                    {incompletoObs || '---'}
                                </span>
                            </div>
                        </>
                    }

                </div>
            </div>
        </Collapse>
    )
}

export default ReviewPF_PJ;