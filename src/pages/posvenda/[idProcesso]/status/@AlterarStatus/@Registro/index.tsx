import InputSelect from '@/components/InputSelect/Index'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import InputText from '@/components/InputText/Index'
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors, UseFormClearErrors, UseFormSetError } from 'react-hook-form';
import { FormValues, Visualizar } from '@/interfaces/PosVenda/AlterarStatus';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import CheckBox from '@/components/CheckBox';
import GetListTipoRgi from '@/apis/getListTipoRgi';
import ButtonComponent from '@/components/ButtonComponent';
import getStatusRGI from '@/apis/statusRGI';
import { Chip, Skeleton } from '@mui/material';
import Link from 'next/link';

interface ICard {
    handleInput?: (type: string, e: any) => void
    register: UseFormRegister<FormValues>
    watch: UseFormWatch<FormValues>
    errors: FieldErrors<FormValues>
    setValue: UseFormSetValue<FormValues>
    clearErrors: UseFormClearErrors<FormValues>
    setError: UseFormSetError<FormValues>
    processData?: ProcessType
    cardSelect: Visualizar
}

// const linkRGI3 = (e: string | undefined): string => {
//     return e ?
//         `http://3ri-rj.com.br/Consultas.asp?registro=registro&txtregistro=${e}&txtprotocolo=Localizar`
//         : '';
// }

// const arrRGIs = [
//     { id: 1, rgi: 2, site: 'https://www.2rgi-rj.com.br/' },
//     { id: 2, rgi: 3, site: '' },
//     { id: 3, rgi: 5, site: 'http://www.5rgi-rj.com.br/' },
//     { id: 4, rgi: 9, site: 'http://www.9rgirj.com.br/' },
//     { id: 6, rgi: 10, site: 'http://10ri-rj.com.br/talao.asp' },
//     { id: 5, rgi: 11, site: 'https://www.11rirj.com.br/' },
// ];

type ListRGI = { id: number, nome: string }[];

export default function Registro({ register, watch, errors, setValue, clearErrors, setError, processData, cardSelect }: ICard) {
    console.log('processData: ', processData)
    const errorMsg = 'Campo obrigatório';
    const [aVista, setAvista] = useState(false);
    const [listRgi, setListRgi] = useState<ListRGI>([]);

    const returnListaRgi = async () => {
        const res: any = await GetListTipoRgi();
        const resOrdemId = res?.data?.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
        setListRgi([{ id: '', nome: 'Selecione...' }, ...resOrdemId]);

        const formasPagamento: any = processData?.imovel?.informacao?.forma_pagamento_nome;
        const pagamento = 'À vista';

        if (formasPagamento.toLowerCase().includes(pagamento.toLowerCase())) {
            console.log("A string contém 'A vista'");
            setAvista(true)
            setValue('check_registro', cardSelect?.registro?.check_registro === 1 ? true : false || false);
        }
    };

    useEffect(() => {
        returnListaRgi()
    }, [])

    const [checkRegistro, setCheckRegistro] = useState([
        { index: 0, label: "O comprador fará o registro pela empresa (DNA Imóveis).", value: '1', path: "check_registro", checked: cardSelect?.registro?.check_registro === 1 ? true : false || false },
    ]);
    const handleCheck = async (e: any) => {
        console.log(e.target.name);
        const valueCheckbox = e.target.value;
        const checked = e.target.checked;

        checkRegistro.forEach((c) => {
            if (c.value === valueCheckbox) {
                c.checked = checked
            }
        });
        setCheckRegistro([...checkRegistro])
        setValue('check_registro', checked)
    };

    return (
        <>
            {!!watch && !!register &&
                <div className="cards">
                    <h2>Acompanhamento de registro</h2>
                    <p>Essa informação é importante para realizar cobranças e fazer a transferência<br /> de propriedade do bem adquirido.</p>

                    {
                        aVista &&
                        <div className="checkBox-fw-700">
                            {
                                checkRegistro.map(({ index, label, value, path, checked }) => (
                                    <CheckBox
                                        label={'O comprador fará o registro pela empresa (DNA Imóveis).'}
                                        value={value}
                                        checked={checked}
                                        path={path}
                                        key={index}
                                        {...register('check_registro', {
                                            required: false,
                                            onChange: (e: any) => handleCheck(e)
                                        })}
                                    />
                                ))
                            }
                        </div>

                    }

                    <div className="selects-line">
                        <InputSelect
                            option={listRgi}
                            label={'Tipo de RGI*'}
                            placeholder={'Selecione'}
                            error={!!errors.tipo_rgi ? true : false}
                            msgError={errors.tipo_rgi}
                            required={true}
                            sucess={!errors.local_escritura && !!watch('tipo_rgi')}
                            value={watch('tipo_rgi') || ''}
                            {...register('tipo_rgi', {
                                validate: (value?: number | string) => {
                                    if (value === '0') {
                                        return "Nenhum tipo foi selecionado";
                                    }
                                },
                                required: errorMsg,
                                // onChange: (e) => handleLocalEscritura(e)
                            })}
                            inputProps={{ 'aria-label': 'Without label' }}
                        />

                        <InputText
                            label={'Número de protocolo do RGI*'}
                            placeholder={'Ex: 131358'}
                            error={!!errors.protocolo_rgi ? true : false}
                            msgError={errors.protocolo_rgi}
                            required={true}
                            disabled={false}
                            sucess={!errors.protocolo_rgi && !!watch('protocolo_rgi')}
                            {...register('protocolo_rgi', {
                                required: errorMsg,
                            })}
                        />
                    </div>
                </div>
            }
        </>

    )
}
