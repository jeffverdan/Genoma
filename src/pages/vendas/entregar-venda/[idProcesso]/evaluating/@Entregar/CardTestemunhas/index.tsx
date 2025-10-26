import React, {useState} from 'react'
import { Chip, Paper } from '@mui/material';
import { FieldErrors, UseFormClearErrors, UseFormRegister, UseFormSetValue, UseFormWatch, UseFormSetError, UseFormSetFocus } from "react-hook-form";
import FormValuesType from '@/interfaces/Vendas/EntregarVenda';
import imovelDataInterface from '@/interfaces/Imovel/imovelData'
import InputText from '@/components/InputText/Index';
import saveEmailEntregarVenda from '@/apis/saveEmailEntregarVenda';
import GetProcesso from '@/apis/getProcesso';
import FormValues from '@/interfaces/Vendas/EntregarVenda';

interface PropsType {
    imovelData: imovelDataInterface
    setImovelData: (e: imovelDataInterface) => void
    register: UseFormRegister<FormValues>
    errors: FieldErrors<FormValues>
    watch: UseFormWatch<FormValues>
    setError: UseFormSetError<FormValues>
    autoSaveData: () => void
    setValue: UseFormSetValue<FormValues>
    setFocus: UseFormSetFocus<FormValues>
    clearErrors: UseFormClearErrors<FormValues>
    refreshScreen: Boolean
    setRefreshScreen: (e: Boolean) => void
};

export default function CardTestemunhas(props: PropsType) {
    const { imovelData, register, clearErrors, setValue, setImovelData, errors, setError, autoSaveData, setFocus, watch, refreshScreen, setRefreshScreen } = props;
    const [idTestemunhaUm, setIdTestemunhaUm] = useState<number | string>('');
    const [idTestemunhaDois, setIdTestemunhaDois] = useState<number | string>('');
    let testemunhas = [
        {id: imovelData?.testemunhas?.data?.[0]?.id || idTestemunhaUm, name: imovelData?.testemunhas?.data?.[0]?.nome || '', email: imovelData?.testemunhas?.data?.[0]?.email || '', tipo_pessoa: 3 },
        {id: imovelData?.testemunhas?.data?.[1]?.id || idTestemunhaDois, name: imovelData?.testemunhas?.data?.[1]?.nome || '', email: imovelData?.testemunhas?.data?.[1]?.email || '', tipo_pessoa: 3 },
    ]
    const [valorInput, setValorInput] = useState<any>([]);
    const processoId = imovelData?.id || '';
    console.log(imovelData?.testemunhas?.data);
    console.log('TESTEMUNHAS: ' , testemunhas)

    const refresh = async () => {
        const data = await GetProcesso(imovelData?.id || '') as any;
        setImovelData(data);
    }

    const handleEmail = async (e: any, usuario: any, index: number, type: string) => {
        const id: number = usuario.id;
        const email: any = e.target.value;

        const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if(email.length > 0){
            if(regex.test(email) === false){
            setError(`testemunhas.${index}.email`, {message: 'Formato de e-mail inválido'})
            }
            else{
                setValorInput((valorInput: any) => ({
                    ...valorInput,
                    id: id,
                    email: email,
                }));
                clearErrors(`testemunhas.${index}.email`)
            }
        }
        else{
            setError(`testemunhas.${index}.email`, {message: 'Campo obrigatório'})
            setFocus(`testemunhas.${index}.email`)
        }
    }
    
    const handleBlurEmail = async (index: number, type: string) => {
        if(valorInput.length !== 0){
            
            const id = valorInput.id
            const email = valorInput?.email;
            const nome = watch(`testemunhas.${index}.name`) || '';

            console.log('name: ', valorInput.name);
            console.log('email: ', email);

            if(!errors?.testemunhas?.[index]?.email === true){
                const data: any = await saveEmailEntregarVenda(id, email, nome, type, processoId);
                setValorInput([])

                if(index === 0) setIdTestemunhaUm(data?.id_salvo)
                    else setIdTestemunhaDois(data?.id_salvo)

                // refresh();
            }
        }
    }

    const handleNome = async(e: any, usuario: any, index: number, type: string) => {
        const id: number = usuario.id;
        const nome: any = e.target.value; 
    
        if(nome.length === 0){
          setError(`testemunhas.${index}.name`, { message: 'Campo obrigatório' });
          setFocus(`testemunhas.${index}.name`);
        }
        else{    
          setValorInput((valorInput: any) => ({
            ...valorInput,
            id: id,
            name: nome,
          }));
          clearErrors(`testemunhas.${index}.name`);
        }
    }
    
    const handleBlurNome = async (index: number, type: string) => {
        if(valorInput.length !== 0){
            const id = valorInput.id
            const nome = valorInput?.name;
            const email: any = watch(`testemunhas.${index}.email`); 

            console.log('name: ', nome);
            console.log('email: ', valorInput.email);
            
            if(!errors?.testemunhas?.[index]?.name === true){
                const data: any = await saveEmailEntregarVenda(id, email, nome, type, processoId);
                setValorInput([])

                console.log('RETORNO DATA: ' , data)
                
                if(index === 0) setIdTestemunhaUm(data?.id_salvo)
                    else setIdTestemunhaDois(data?.id_salvo)

                // refresh();
            }
        }
    }

    console.log('TESTEMUNHAS ATUALIZADAS: ' , testemunhas)
    console.log('ID TESTEMUNHA UM STATE: ', idTestemunhaUm)

    return (
        <Paper className='card-entregar card-testemunhas card3' elevation={1}>
            <h4>Informe o e-mail de todas as testemunhas:</h4>
            <div className='testemunhas'>
                {
                    !!watch && !!register &&
                    testemunhas?.map((pessoa: any, index: number) =>
                        <React.Fragment key={index}>
                            <div className='input-emails'>
                                {/* <p style={{marginBottom: '15px'}}>Testemunha {index + 1}</p> */}
                                <Chip className='chip neutral' label={`Testemunha ${index + 1}`} style={{marginBottom: '15px'}} />
                                <div className="nome-email">
                                    <InputText
                                        width='320px'
                                        defaultValue={pessoa?.name}
                                        label='Nome completo*'
                                        saveOnBlur={() => handleBlurNome(index, 'testemunha')}
                                        sucess={!!pessoa?.name}
                                        error={!!errors?.testemunhas?.[index]?.name}
                                        msgError={errors?.testemunhas?.[index]?.name}
                                        {...register(`testemunhas.${index}.name`, {
                                            required: imovelData?.informacao?.recibo_type === 'docusign' ? 'Campo obrigatório' : false,
                                            onChange: (e) => handleNome(e, pessoa, index, 'testemunha') 
                                        })}
                                    />
                                    <InputText
                                        width='320px'
                                        defaultValue={pessoa?.email}
                                        label='E-mail*'
                                        saveOnBlur={() => handleBlurEmail(index, 'testemunha')}
                                        sucess={!!pessoa?.email}
                                        error={!!errors?.testemunhas?.[index]?.email}
                                        msgError={errors?.testemunhas?.[index]?.email}
                                        {...register(`testemunhas.${index}.email`, {
                                            required: imovelData?.informacao?.recibo_type === 'docusign' ? 'Campo obrigatório' : false,
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                                message: 'Formato de e-mail inválido',
                                        },
                                        onChange: (e) => handleEmail(e, pessoa, index, 'testemunha') 
                                        })}
                                    />
                                </div>
                            </div>
                        </React.Fragment>
                    )
                }
            </div>
        </Paper>
    )
}
