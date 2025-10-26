import React, { useEffect, useContext, useState } from 'react';
import Button from '@/components/ButtonComponent';
import CheckIcon from '@mui/icons-material/Check';
import InputText from '../InputText/Index';
import { useForm } from 'react-hook-form';
import getMidas from '@/apis/getMidas';
import CircularLoading from '../CircularLoading';
import VendasContext from '@/context/VendasContext';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { useRouter } from 'next/router';

interface CodImovel {
    codImovel: string
    disable: string
    error: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputCodImovel({ handleClick, handleFileChange }: { handleClick: Function, handleFileChange?: any }) {

    const {
        loading, setLoading,
        codMidas, setCodMidas,
        imovelMidas, setImovelMidas,
    } = useContext(VendasContext);
    const [retornoMidas, setRetornoMidas] = useState(true);

    const {
        register,
        watch,
        setError,
        clearErrors,
        formState: { errors },
        handleSubmit,
    } = useForm<CodImovel>({
        defaultValues: { "codImovel": "" }
    })

    const handleCodImovel = async (value: string) => {
        if (value.length === 0 || value.length === null) {
            clearErrors('codImovel');
            setRetornoMidas(true);
            setLoading(false);
            setCodMidas('');
            setImovelMidas([]);
        }

        else if (value.length > 5) {
            let data = await getMidas(value);

            if (data) {
                let arrMidas: any[] = [data];
                setRetornoMidas(true);
                clearErrors('codImovel');
                setLoading(true);
                setCodMidas(value);
                setImovelMidas(arrMidas);
                setLoading(false);
            }
            else {
                setRetornoMidas(false);
                setLoading(false);
                setCodMidas('');
                setImovelMidas([]);
                setError('codImovel', { type: 'custom', message: "Código inválido" });
            }
        }
    }

    return (
        <div className="comp-cod-imovel">
            <InputText
                label="Insira o código do MIDAS"
                placeholder='Ex: NIAP1234'
                autoComplete="off"
                error={retornoMidas === false ? true : false}
                msgError={errors.codImovel}
                sucess={imovelMidas.length > 0 ? true : false}

                {...register("codImovel", {
                    required: "Campo obrigatório",
                    onChange: (e) => handleCodImovel(e.target.value)
                })}
            />

            {handleFileChange &&
                <div className='input-container'>
                    <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e.target.files?.[0])} />
                </div>
            }

            {
                loading === true
                    ? <CircularLoading />

                    :
                    <>
                        {
                            imovelMidas.map(imovel => <>
                                <div className="info-imovel">
                                    <div className="row">
                                        <div className="info">
                                            {imovel.bairro_comercial + ' - ' + imovel.municipio}
                                        </div>

                                        <div className="info">
                                            <FmdGoodIcon className="icon" /> {imovel.tipo_logradouro + ' ' + imovel.nome_logradouro + ', ' + imovel.numero}
                                        </div>

                                        <div className="info">
                                            {imovel.unidade}
                                        </div>
                                    </div>
                                </div>
                            </>)
                        }
                    </>
            }

            <Button
                name="primary"
                size="large"
                label="Sim, é este imóvel"
                variant="contained"
                id='btn-submit'
                endIcon={<CheckIcon className='icon icon-left' />}
                disabled={loading || imovelMidas.length === 0 ? true : false}
                onClick={() => handleClick()}
            />
        </div>
    )
}