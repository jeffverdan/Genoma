import { FieldErrors, UseFormClearErrors, UseFormRegister, UseFormSetValue, UseFormWatch, UseFormSetError, UseFormSetFocus } from "react-hook-form";
import ButtonComponent from "@/components/ButtonComponent";
import { ArrConflitosType } from "@/interfaces/IA_Recibo";
import { ExclamationTriangleIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/solid";
import Check from "@mui/icons-material/Check";
import imovelDataInterface from '@/interfaces/Imovel/imovelData'
import { Chip, Paper } from '@mui/material';
import Pessoa from "@/interfaces/Users/userData";
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";
import { useEffect, useState } from "react";
// import FormValuesType from "@/interfaces/EntregarVenda";
import FormValuesType from '@/interfaces/Vendas/EntregarVenda'
import DialogConfirmEmail from "@/pages/vendas/entregar-venda/@DialogConfirmEmails";
import GetProcesso from "@/apis/getProcesso";

interface PropsType {
    imovelData: imovelDataInterface
    setImovelData: (e: imovelDataInterface) => void
    register: UseFormRegister<FormValuesType>
    errors: FieldErrors<FormValuesType>
    watch: UseFormWatch<FormValuesType>
    setError: UseFormSetError<FormValuesType>
    autoSaveData: () => void
    setValue: UseFormSetValue<FormValuesType>
    setFocus: UseFormSetFocus<FormValuesType>
    clearErrors: UseFormClearErrors<FormValuesType>
    refreshScreen: Boolean
    setRefreshScreen: (e: Boolean) => void
};

const returnLength = (arry: Pessoa[] | undefined) => {
    return {
        fisicas: arry?.filter((e) => !e.tipo_pessoa)?.length || 0,
        juridicas: arry?.filter((e) => e.tipo_pessoa)?.length || 0,
    }
};

export default function CardEmails(props: PropsType) {
    const { imovelData, register, clearErrors, setValue, setImovelData, errors, setError, autoSaveData, setFocus, watch, refreshScreen, setRefreshScreen } = props;
    const [checked, setChecked] = useState<Boolean>(false);
    const [openDialogEmails, setOpenDialogEmails] = useState<Boolean>(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (watch) setChecked(watch('emailCheck') === '1');
    }, [watch ? watch('emailCheck') : '']);


    const handleCheckEmails = () => {
        const value = !checked ? '1' : '0';
        setValue('emailCheck', value);
        console.log(value);

        if (value === '0') {
            setError('emailCheck', { message: '*Campo obrigatório.' });
            setFocus('emailCheck');
        } else {
            clearErrors('emailCheck')
        }
        autoSaveData();
    };

    const getImovelData = async () => {
        setRefreshScreen(false)
        setLoading(true);
        const data = await GetProcesso(imovelData.processo_id || '') as any;
        setImovelData(data);
        setLoading(false);
    };

    console.log('loading: ', loading)

    return (
        <Paper className='card-entregar card3 card-emails' elevation={1}>
            <h4>Confirme os e-mails das partes no contrato do Docusign. <br/>Para atualizar dados e inserir cópias, clique em Editar e-mails.</h4>
            <div className='vendedores-compradores'>
                {imovelData && (['vendedores', 'compradores'] as const).map((key, index) => (
                    <div key={index} className="pessoas-container">
                        <div className='title-container'>
                            <span className='s1'>{key.toUpperCase()}</span>
                            <Chip size='small' label={<span className='s1'>{returnLength(imovelData[key])?.fisicas} FÍSICO{returnLength(imovelData[key])?.fisicas > 1 ? 'S' : ''}</span>} />
                            <Chip size='small' label={<span className='s1'>{returnLength(imovelData[key])?.juridicas} JURÍDICO{returnLength(imovelData[key])?.juridicas > 1 ? 'S' : ''}</span>} />
                        </div>
                        {imovelData[key]?.map((pessoa, index) => (
                            pessoa.tipo_pessoa === 0
                                ?
                                <div className='user' key={index}>
                                    <p className='bold'>{pessoa.tipo_pessoa ? pessoa.nome_fantasia : pessoa.name}</p>
                                    <p className='s1'>{pessoa.tipo_pessoa ? 'CNPJ - ' : 'CPF - '}{pessoa.cpf_cnpj}</p>
                                    <p className='s1'>Email - {pessoa.tipo_pessoa ? pessoa.representante_socios?.data.find(e => e.pj_representante)?.email : pessoa.email}</p>
                                </div>
                                :
                                <>
                                    <div className="box-pj">
                                        <div className='user' key={index}>
                                            <p className='bold'>{pessoa.tipo_pessoa ? pessoa.nome_fantasia : pessoa.name}</p>
                                            <p className='s1'>{pessoa.tipo_pessoa ? 'CNPJ - ' : 'CPF - '}{pessoa.cpf_cnpj}</p>
                                            {/* <p className='s1'>Email - {vendedor.tipo_pessoa ? vendedor.representante_socios?.data.find(e => e.pj_representante)?.email : vendedor.email}</p> */}
                                        </div>
                                        <div>
                                            {
                                                pessoa?.representante_socios?.data.map((representante: any, index: number) =>
                                                    representante.pj_representante === 1 ?
                                                        <div className='user' key={index}>
                                                            <p className='bold'>{representante.name}</p>
                                                            <p className='s1'>{'CPF - '}{representante.cpf_cnpj}</p>
                                                            {/* <p className='s1'>Email - {representante.email}</p> */}
                                                        </div>
                                                        :
                                                        ''
                                                )
                                            }
                                        </div>
                                    </div>
                                </>
                        ))}
                    </div>
                ))}

                {
                    Array.isArray(imovelData?.copia?.data) && imovelData?.copia?.data?.length !== 0
                    ?
                    <div className="pessoas-container">
                        <div className='title-container'>
                            <span className='s1'>CÓPIA</span>
                        </div>

                        {
                            imovelData?.copia?.data?.map((data: any) => 
                                <>
                                    <div className='user'>
                                        <p className='bold'>{data.nome || 'Nome Testemunha'}</p>
                                        <p className='s1'>Email - {data.email || '---'}</p>
                                    </div>  
                                </>
                            )
                        }
                    </div>
                    :
                    ''
                }
                
                        
            </div>

            <div className='users-buttons'>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ButtonComponent
                        onClick={() => handleCheckEmails()}
                        // onBlurFunction={SaveEntregarVenda(watch())}
                        name={checked ? 'check' : 'uncheck'}
                        startIcon={checked ? <CheckBox width={24} /> : <CheckBoxOutlineBlank width={24} />}
                        size={'large'}
                        variant={'outlined'}
                        label={'Confirmar e-mail dos envolvidos'}
                    />
                    <div>
                        {/* <span className="errorMsg">{errors?.emailCheck && errors?.emailCheck.message}</span> */}
                    </div>
                </div>
                <ButtonComponent name=" btn-edit" startIcon={<PencilIcon width={24} />} size={'large'} variant={'text'} label={'Editar e-mails'} onClick={() => setOpenDialogEmails(true)} />
                {register &&
                    <div>
                        <input
                            type="text"
                            //disabled={true}
                            style={{ height: '0', width: '0', background: 'transparent', border: 'none' }}
                            {...register("emailCheck", {
                                required: '*Campo obrigatório.',
                                validate: (value) => {
                                    if (value === '0') {
                                        return "*Campo obrigatório.";
                                    }
                                },
                            })}
                        />
                        <span className="errorMsg">{errors?.emailCheck && errors?.emailCheck.message}</span>
                    </div>
                }
            </div>

            {openDialogEmails && 
                <DialogConfirmEmail open={openDialogEmails} setOpen={setOpenDialogEmails} context={{ dataProcesso: imovelData }} setImovelData={setImovelData} refresh={getImovelData} />
            }
        </Paper>
    )
}