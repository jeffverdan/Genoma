// import React, { useState, ChangeEvent, useEffect } from 'react';
// import { Collapse, Checkbox, FormControlLabel, Chip } from '@mui/material';
// import { ChecksReviewType, DataToSaveType, ErrorDataType } from '@/interfaces/PosVenda/Devolucao';
// import { ItemsCorrecoes } from '@/interfaces/PosVenda/Devolucao';
// import MultipleSelectCheckmarks from '@/components/SelectMultiInput';
// import EmptyTextarea from '@/components/TextArea';
// import { useForm } from "react-hook-form";

// type SaveDataType = {
//     vendedor?: boolean
//     comprador?: boolean
//     obs?: string
// }

// interface Props {
//     checks: ChecksReviewType
//     setChecks: (e: ChecksReviewType) => void
//     saveData: (e: { "incompleto": SaveDataType }) => void
//     error: ErrorDataType
//     readyOnly: boolean
//     returnData: DataToSaveType
// }
const ReviewIncompleto = () => {
// const ReviewIncompleto = (props: Props) => {
//     const [collapse, setCollapse] = useState(false);
//     const { checks, setChecks, saveData, error, readyOnly, returnData } = props;
//     const emptyValue = {
//         vendedor: false,
//         comprador: false,
//         obs: ''
//     };
//     const [reviewChecks, setReviewChecks] = useState<SaveDataType>(emptyValue);
//     const { register, watch, setValue } = useForm();

//     const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
//         const check = event.target.checked;
//         setChecks({ ...checks, incompleto: check });
//         setCollapse(check);
//         if (!check) {
//             setReviewChecks(emptyValue);
//         }
//     };

//     const handleCheckReview = (event: ChangeEvent<HTMLInputElement>, check: 'vendedor' | 'comprador') => {
//         reviewChecks[check] = event.target.checked;
//         if(error?.incompleto?.checkUsers) error.incompleto.checkUsers = false;
//         setReviewChecks({ ...reviewChecks });
//     };

//     useEffect(() => {
//         if (readyOnly) {
//             setReviewChecks({
//                 vendedor: returnData?.incompleto?.vendedor,
//                 comprador: returnData?.incompleto?.comprador
//             });
//             setValue('obs', returnData?.incompleto?.obs)          
//         }
//     }, [readyOnly]);

//     useEffect(() => {
//         if (!readyOnly) {
//             saveData({
//                 incompleto: reviewChecks
//             })
//         }
//     }, [reviewChecks]);

//     const handleTextArea = (e: any) => {
//         setValue('obs', e.target.value);
//         if(error?.incompleto?.obs) error.incompleto.obs = false;
//     };

    return (<></>
//         <Collapse in={collapse} orientation="vertical" collapsedSize={116} className="card-collapse ">
//             <div className='card-review'>
//                 <div className='header-card' onClick={() => setCollapse((prev) => !prev)}>
//                     <FormControlLabel
//                         control={<Checkbox checked={checks?.incompleto} onChange={handleCheck} />}
//                         label="Cadastro incompleto"
//                         className={`check bold ${checks?.incompleto ? 'checked' : ''}`}
//                         disabled={readyOnly}
//                     />
//                     {reviewChecks.vendedor || reviewChecks.comprador ?
//                         <Chip className='chip red' label={`${reviewChecks.vendedor && reviewChecks.comprador ? `2 Correções` : `1 Correção`}`} />
//                         :
//                         <span className='info-card'>
//                             Falta de cadastro de alguma das partes envolvidas.
//                         </span>
//                     }
//                     {/* <ButtonComponent
//                     size={'large'}
//                     variant={'text'}
//                     name={'collapse'}
//                     label={''}
//                     onClick={() => setCollapse((prev) => !prev)}
//                     endIcon={<HiChevronDoubleLeft className='colorP500 iconCollapse' />}
//                 /> */}

//                 </div>
//                 <div className='content-card'>
//                     <p>Qual parte falta cadastrar?*</p>
//                     <div className='flex'>
//                         <FormControlLabel
//                             control={<Checkbox checked={reviewChecks.vendedor} onChange={(e) => handleCheckReview(e, 'vendedor')} />}
//                             label="Vendedor"
//                             className={`check bold ${reviewChecks.vendedor ? 'checked' : error?.incompleto?.checkUsers ? 'error' : ''}`}
//                             disabled={readyOnly}
//                         />

//                         <FormControlLabel
//                             control={<Checkbox checked={reviewChecks.comprador} onChange={(e) => handleCheckReview(e, 'comprador')} />}
//                             label="Comprador"
//                             className={`check bold ${reviewChecks.comprador ? 'checked' : error?.incompleto?.checkUsers ? 'error' : ''}`}
//                             disabled={readyOnly}
//                         />
//                     </div>

//                     <div className='text-area'>
//                         <EmptyTextarea
//                             minRows={2}
//                             disabled={readyOnly}
//                             value={watch('obs')}
//                             error={error?.incompleto?.obs}
//                             label={'Observações de imóvel'}
//                             placeholder={'Ex: Está faltando o cadastro do vendedor.'}
//                             {...register("obs", {
//                                 onChange: (e) => handleTextArea(e),
//                                 onBlur: () => saveData({
//                                     incompleto: {
//                                         ...reviewChecks,
//                                         obs: watch('obs')
//                                     }
//                                 })
//                             })}
//                         />
//                     </div>

//                 </div>
//             </div>
//         </Collapse>
    )
}

export default ReviewIncompleto;