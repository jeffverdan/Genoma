import React, { useState, useEffect, ChangeEvent } from 'react';
import { Collapse, Checkbox, FormControlLabel, Chip } from '@mui/material';
import { ChecksReviewType, DataToSaveType, ErrorDataType } from '@/interfaces/PosVenda/Devolucao';
import { ItemsCorrecoes } from '@/interfaces/PosVenda/Devolucao';
import InputSelect from '@/components/InputSelect/Index';
import MultipleSelectCheckmarks from '@/components/SelectMultiInput';
import EmptyTextarea from '@/components/TextArea';
import Pessoa from '@/interfaces/Users/userData';
import { useForm } from "react-hook-form";

interface Props {
    checks: ChecksReviewType
    setChecks: (e: ChecksReviewType) => void
    list?: ItemsCorrecoes[] // PARA EMPRESAS
    list_rep?: ItemsCorrecoes[] // PARA REPRESENTANTES
    type: 'vendedor' | 'comprador'
    pessoas: Pessoa[]
    saveData: (e: { [x: string]: SaveData }) => void
    error: ErrorDataType
    readyOnly: boolean
    returnData: DataToSaveType
}

type SaveData = {
    reviews?: SelectType[],
    obs?: string
}

type ListType = {
    id: number | string,
    name: string | undefined
    empresa: boolean
}

type ListQuantType = { id: number; name: number; }
type QuantType = { selected: number, list: ListQuantType[] }

type SelectType = {
    id: number | string
    reviewChecks: ItemsCorrecoes[] | []
};

const ReviewPJ = (props: Props) => {
    const [collapse, setCollapse] = useState(false);
    const { register, watch, setValue } = useForm();
    const { checks, setChecks, list, list_rep, type, pessoas, saveData, error, readyOnly, returnData } = props;
    const checkType: 'vendedor_pj' | 'comprador_pj' = type ? `${type}_pj` : 'vendedor_pj';
    // const [reviewChecks, setReviewChecks] = useState<any>([]);
    const [selectedPessoas, setSelectedPessoas] = useState<SelectType[]>([{
        id: '',
        reviewChecks: [] as ItemsCorrecoes[],
    }]); // LISTA DE PESSOAS SELECIONADAS + OS CHEKS/ LISTA DE PESSOAS SELECIONADAS + OS CHEKS

    const [countReviews, setCountReviews] = useState(0); // QUANTIDADE DE CHECKS
    const [quantPessoas, setQuantPessoas] = useState<QuantType>({ // QUANTIDADE SELECIONADA DE PESSOAS
        selected: 1,
        list: [{ id: 1, name: 1 }],
    });
    const emptyList = { // CRIA O PLACEHOLDER DA LISTA
        id: '',
        name: 'Selecione a pessoa jurídica',
        empresa: false
    };
    const [listPessoas, setListPessoas] = useState<ListType[]>([emptyList]); // LISTA DE PESSOAS PJ PUXANDO DO BANCO PELO USEFFECT

    useEffect(() => {
        setListPessoas([
            emptyList,
            ...pessoas.map((pessoa) => ({
                id: pessoa.id,
                name: pessoa.name || pessoa.razao_social,
                empresa: !pessoa.name
            }))
        ]);
        const newQuant: ListQuantType[] = []
        pessoas.forEach((e, index) => {
            newQuant.push({ id: index + 1, name: index + 1 })
        });
        setQuantPessoas({ ...quantPessoas, list: newQuant })
    }, [pessoas]);

    const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
        const check = event.target.checked;
        const tipo = type === 'vendedor' ? { vendedor_pj: check } : { comprador_pj: check };
        setChecks({ ...checks, ...tipo });
        setCollapse(check);
        if (!check) {
            setSelectedPessoas([{
                id: '',
                reviewChecks: [] as ItemsCorrecoes[],
            }]);
            setQuantPessoas({ ...quantPessoas, selected: 1 });
        }
    };

    const handleQuant = (quant: number) => {
        const newArray: any = [];
        for (let i = 0; i < quant; i++) {
            if (!selectedPessoas[i]) newArray.push({
                id: '',
                reviewChecks: [] as ItemsCorrecoes[],
            });
            else newArray.push(selectedPessoas[i]);
        }
        setQuantPessoas({ ...quantPessoas, selected: quant });
        setSelectedPessoas([...newArray]);
    };

    useEffect(() => {
        if(readyOnly) {
            setValue('obs', returnData?.[checkType]?.obs);            
            setSelectedPessoas(returnData?.[checkType]?.reviews || []);
        }
    },[readyOnly]);

    useEffect(() => {
        setCountReviews(selectedPessoas.map(e => e.reviewChecks.length).reduce((acc: number, cur: number) => acc + cur, 0));
        if (!readyOnly) {
            saveData({
                [checkType]: {
                    reviews: [...selectedPessoas],
                    obs: watch('obs')
                }
            });

            if (error?.[checkType]?.reviews?.some(e => e.errorCheck || e.errorUser)) {
                error[checkType] = {
                    ...error[checkType],
                    reviews: selectedPessoas.map((pessoas) => ({
                        errorUser: !pessoas.id,
                        errorCheck: !pessoas.reviewChecks.some(e => e.id)
                    }))
                }
            }
        }
    }, [selectedPessoas]);

    const handleChecks = (value: ItemsCorrecoes[], index: number) => {
        selectedPessoas[index].reviewChecks = value;
        setSelectedPessoas([...selectedPessoas]);
    };

    const handlePessoa = (value: number, index: number) => {
        selectedPessoas[index].id = value;
        setSelectedPessoas([...selectedPessoas]);
    };

    const handleTextArea = (e: any) => {
        setValue('obs', e.target.value);
        if(error?.[checkType]?.obs) error[checkType].obs = false;
    };

    return (
        <Collapse in={collapse} orientation="vertical" collapsedSize={116} className="card-collapse ">
            <div className='card-review'>
                <div className='header-card' onClick={() => setCollapse((prev) => !prev)}>
                    <FormControlLabel
                        control={<Checkbox checked={checks?.[checkType]} onChange={handleCheck} />}
                        label={`Revisar cadastro de ${type}es (pessoa jurídica)`}
                        className={`check bold ${checks?.[checkType] ? 'checked' : ''}`}
                        disabled={readyOnly}
                    />
                    {checks?.[checkType] ?
                        <Chip className='chip red' label={`${countReviews === 1 ? `1 Correção` : `${countReviews} Correções`}`} />
                        :
                        <span className='info-card'>
                            Correções como CNH, ou outro documento ilegível.
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

                    <InputSelect
                        label={`Quantos ${type}es?`}
                        name={''}
                        option={quantPessoas.list}
                        onChange={(e) => handleQuant(e.target.value as number)}
                        value={quantPessoas.selected}
                        divClass='input-select'
                        disabled={readyOnly}
                    />
                    {selectedPessoas.map((pessoa, index) => (
                        <div className='content-pessoa' key={index}>
                            <InputSelect
                                label={`Qual ${type}?`}
                                name='input-name-pj'
                                disabled={readyOnly}
                                option={listPessoas}
                                width={'390px'}
                                divClass='input-select'
                                error={error?.[checkType]?.reviews?.[index]?.errorUser}
                                value={pessoa.id}
                                onChange={e => handlePessoa(e.target.value as number, index as number)}
                            />

                            <MultipleSelectCheckmarks
                                label={`Correção do ${type}${listPessoas.find(e => e.id === pessoa.id)?.empresa ? ' (empresa)' : ''} - PJ`}
                                name={''}
                                disable={readyOnly}
                                options={listPessoas.find(e => e.id === pessoa.id)?.empresa ? list : list_rep}
                                value={pessoa.reviewChecks}
                                error={error?.[checkType]?.reviews?.[index]?.errorCheck}
                                onChange={(e: ItemsCorrecoes[]) => handleChecks(e, index)}
                                labelMenu={
                                    `Correções do ${type}${listPessoas.find(e => e.id === pessoa.id)?.empresa ? ' (EMPRESA)' : ''} - PJ`}
                                maxWidth={300}
                                placeholder='Ex: Documentos, endereço...'
                            />
                        </div>
                    ))}

                    <div className='text-area'>
                        <EmptyTextarea
                            minRows={2}
                            disabled={readyOnly}
                            value={watch('obs')}
                            error={error?.[checkType]?.obs}
                            label={`Observações de ${type}es - pessoa jurídica`}
                            placeholder={`Ex: As informações das pessoas jurídicas não condizem com os documentos.`}
                            {...register("obs", {
                                onChange: (e) => handleTextArea(e),
                                onBlur: () => saveData({
                                    [checkType]: {
                                        reviews: selectedPessoas,
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

export default ReviewPJ;