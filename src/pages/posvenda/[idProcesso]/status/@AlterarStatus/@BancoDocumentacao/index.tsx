import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import CheckBox from '@/components/CheckBox'
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { FormValues, Visualizar } from '@/interfaces/PosVenda/AlterarStatus';

interface ICard {
    handleInput: (type: string, e: any) => void
    register: UseFormRegister<FormValues>
    watch: UseFormWatch<FormValues>
    errors: FieldErrors<FormValues>
    setValue: UseFormSetValue<FormValues>
    cardSelect: Visualizar
}

export default function BancoDocumentacao({ handleInput, register, watch, errors, setValue, cardSelect }: ICard) {

    useEffect(() => {
        setValue('check_banco.doc_vendedor', cardSelect?.banco_documentos?.[0]?.doc_vendedor === 1 ? true : false || false)
        setValue('check_banco.doc_comprador', cardSelect?.banco_documentos?.[0]?.doc_comprador === 1 ? true : false || false)
        setValue('check_banco.doc_imovel', cardSelect?.banco_documentos?.[0]?.doc_imovel === 1 ? true : false || false)
    }, [])

    const [informeCheck, setInformeCheck] = useState([
        { index: 0, label: "Dos vendedores", value: '1', path: "doc_vendedor", checked: cardSelect?.banco_documentos?.[0]?.doc_vendedor === 1 ? true : false || false },
        { index: 1, label: "Dos compradores", value: '2', path: "doc_comprador", checked: cardSelect?.banco_documentos?.[0]?.doc_comprador === 1 ? true : false || false },
        { index: 2, label: "Do imóvel", value: '3', path: "doc_imovel", checked: cardSelect?.banco_documentos?.[0]?.doc_imovel === 1 ? true : false || false },
    ]);

    // console.log('WATCH: ', watch())

    const handleCheck = async (e: any) => {
        console.log(e.target.name);
        const valueCheckbox = e.target.value;
        const checked = e.target.checked;
        const name = e.target.name;

        informeCheck.forEach((c) => {
            if (c.value === valueCheckbox) {
                c.checked = checked
            }
        });
        setInformeCheck([...informeCheck])

        setValue(name, checked)
    };

    return (
        <>
            {!!watch && !!register &&
                <div className="cards">
                    <h2>Quais documentos estão corretos?</h2>

                    <div className="row-check">
                        {
                            informeCheck?.map(({ index, label, value, path, checked }) => (
                                <CheckBox
                                    label={label}
                                    value={value}
                                    checked={checked}
                                    // path={path}
                                    // register={register}
                                    key={index}
                                    {...register(`check_banco.${path as 'doc_vendedor'}`, {
                                        required: false,
                                        onChange: (e: any) => [handleCheck(e)],
                                    })}
                                />
                            ))
                        }
                    </div>

                </div>
            }
        </>
    )
}
