import InputText from "@/components/InputText/Index";
import { BlockProps, FormValues } from "@/interfaces/IA_Recibo/index";
import InputSelect from "@/components/InputSelect/Index";
import { useEffect, useState } from "react";
import getListaOrigemComprador from "@/apis/getListaOrigemComprador";
import dateMask from "@/functions/dateMask";

type OrigemClienteTypes = {
    origem: string;
    forma_contato: string;
    data_entrada: string;
}

export default function Origem({ index, data, type, userData, setUserData, register, errors, watch, setValue, clearErrors }: BlockProps) {
    const errorMsg = 'Campo inválido';
    const [listaOrigem, setListaOrigem] = useState([]);
    const [listaContato, setListaContato] = useState([]);

    useEffect(() => {
        const returnOrigemComprador = async () => {
            const origem: any = await getListaOrigemComprador();
            origem?.lista_origem.unshift({ id: '0', name: 'Zap Imóveis, placa de rua..' });
            origem?.lista_contato.unshift({ id: '0', name: 'E-mail, WhatsApp...' });
            setListaOrigem(origem?.lista_origem);
            setListaContato(origem?.lista_contato);
        }
        returnOrigemComprador()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!userData.origin_cliente?.origem) setValue('origin_cliente.origem', '0');
        if (!userData.origin_cliente?.forma_contato) setValue('origin_cliente.forma_contato', '0');
        if (!userData.origin_cliente?.data_entrada) setValue('origin_cliente.data_entrada', '');
    }, [userData])

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof FormValues;
        const value = e.target.value;
        clearErrors(name);
        userData = { ...userData, [name]: value }
    };

    const onBlur = (key: keyof OrigemClienteTypes, e?: React.ChangeEvent<HTMLInputElement>) => {
        if (e) {
            const value = e.target.value;
            setUserData({
                ...userData, origin_cliente: {
                    ...userData.origin_cliente,
                    [key]: value
                }
            });
        }
    };

    return (
        <div className="form-container">
            <div className="title">
                <h3>Como a pessoa {type?.replace('es', 'a')} entrou em contato?</h3>
            </div>

            {!!watch &&
                <div className="content">
                    <div className="row-f">
                        <InputSelect
                            option={listaOrigem}
                            label={'Qual foi o meio?*'}
                            error={!!errors?.origin_cliente?.origem}
                            msgError={errors?.origin_cliente?.origem}
                            // className="input-default select-default select-averbacao"
                            // width={'50%'}
                            sucess={Number(watch('origin_cliente.origem')) >= 1}
                            value={watch('origin_cliente.origem') || '0'}
                            onBlurFunction={(e) => onBlur('origem', e)}
                            {...register('origin_cliente.origem', {
                                //required: true,
                                required: errorMsg,
                                onChange: (e) => handleInput(e)
                            })}
                        />

                        <InputSelect
                            label={'E a forma de contato*'}
                            placeholder={'E-mail, WhatsApp...'}
                            option={listaContato}
                            sucess={Number(watch('origin_cliente.forma_contato')) > 0}
                            error={!!errors?.origin_cliente?.forma_contato}
                            msgError={errors?.origin_cliente?.forma_contato}
                            value={watch('origin_cliente.forma_contato') || '0'}
                            onBlurFunction={(e) => onBlur('forma_contato', e)}
                            {...register('origin_cliente.forma_contato', {
                                //equired: true,
                                required: errorMsg,
                                onChange: (e) => handleInput(e)
                            })}
                        />

                        <InputText
                            label={'Quando?*'}
                            placeholder={'Ex: dd/mm/aaaa'}
                            sucess={!errors?.origin_cliente?.data_entrada && !!watch('origin_cliente.data_entrada')}
                            error={!!errors?.origin_cliente?.data_entrada}
                            msgError={errors?.origin_cliente?.data_entrada}
                            saveOnBlur={(e) => onBlur('data_entrada', e)}
                            value={watch('origin_cliente.data_entrada')}
                            {...register('origin_cliente.data_entrada', {
                                required: true,
                                setValueAs: (e) => dateMask(e),
                                onChange: (e) => handleInput(e)
                            })}
                        />
                    </div>
                </div>
            }

        </div>
    )
}