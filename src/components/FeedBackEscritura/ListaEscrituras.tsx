import RadioGroup from "@/components/RadioGroup";
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import ButtonComponent from "../ButtonComponent";
import { HiCheck, HiArrowRight } from "react-icons/hi2";
interface IProcessos {
    processos: IFeedBackEscrituras[]
    processoSelecionado?: IFeedBackEscrituras
    setProcessoSelecionado: (e: IFeedBackEscrituras) => void
    setShowListaEscritura: (e: boolean) => void
}

interface IFeedBackEscrituras{
    name?: string,
    ddi?: string,
    telefone?: string,
    data_escritura?: string,
    hora_escritura?: string,
    logradouro?: string,
    unidade?: string,
    processo_id?: number,
    pg_na_escritura?: number
}

type Options = {
    value: string;
    disabled: boolean;
    label: string;
    checked: boolean;
    width?: string;
    percent?: number;
};

interface FormValues {
    processo: string
  }

export default function ListaEscrituras({processos, processoSelecionado, setProcessoSelecionado, setShowListaEscritura}: IProcessos) {   

    const errorMsg = 'Selecione um dos processos acima para continuar.';
    const [options, setOptions] = useState<Options[]>([]);

    const returnOptions = async () => {
        const listaProcessos: any =  processos.map((processo) => ({value: processo.processo_id, disabled: false, label: processo.logradouro, checked: false}));
        console.log(listaProcessos);
        setOptions(listaProcessos);
    }
    useEffect(() => {   
        returnOptions();
    }, [])
    
    const {
        register,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
        handleSubmit,
      } = useForm<FormValues>({
        defaultValues: {
            processo: ''
        }
      })
      
    // console.log(processos)
    // console.log('WATCH: ' , watch())
    // console.log('ERRORs: ', errors);

    const handleProcesso = async (e: any) => {
        const processo: any = await processos.filter((processo) => processo.processo_id === e.processo);
        setProcessoSelecionado(processo[0]);
        setShowListaEscritura(false);        
    }

    return (
        <>
            <h2>Precisamos do seu feedback sobre a Escritura.</h2>
            
            <p>
                Precisamos saber como foi o processo de escritura e se houve alguma mudança significativa na venda. 
            </p>

            <p className='bold'>
                Selecione o agendamento de Escritura para dar feedback:
            </p>

            <div className='mt44 mb44 check-list'>
                <RadioGroup
                    {...register('processo', {
                        required: errorMsg,
                        // onChange: (e) => handleProcesso,
                    })}
                    value={watch('processo')}
                    name='processo'
                    label=''
                    options={options}
                    setOptions={setOptions}
                    setValue={setValue}
                />
                {/* {
                    (errors.processo && watch('processo') === '') &&
                    <p className="errorMsg">{'*' + errorMsg}</p>
                } */}
            </div>

            <footer className="f-b-r">
                <div>
                    <ButtonComponent
                        size={"large"}
                        variant={"contained"}
                        name={"feedback"}
                        labelColor='white'
                        label={"Dar feedback de Escritura"}
                        endIcon={<HiArrowRight fill='white' />}
                        disabled={watch('processo') === '' ? true : false}
                        onClick={handleSubmit((e) => handleProcesso(e))}
                    />
                </div>
            </footer>
        </>
    )
}