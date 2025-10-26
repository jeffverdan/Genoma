import  React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { DialogActions, IconButton, Slide, Radio, RadioGroup, FormControlLabel, FormControl, InputLabel, Select, MenuItem, Button as MuiButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { ItemListRecentsType } from '@/interfaces/Corretores';
import {useForm} from 'react-hook-form'
import InputText from "@/components/InputText/Index";
import InputSelect from '@/components/InputSelect/Index';
import ButtonComponent from "@/components/ButtonComponent";
import { CheckIcon } from '@heroicons/react/24/solid';
import postSalvarNovoMetodoPagamento from '@/apis/postSalvarNovoMetodoPagamento';
import validarCPF from '@/functions/validarCPF';
import validarCNPJ from '@/functions/validarCNPJ';
import postSaveMeuPerfil from '@/apis/postSaveMeuPerfil';
import cpfMask from '@/functions/cpfMask';
import cnpjMask from '@/functions/cnpjMask';
import phoneMask from '@/functions/phoneMask';
import validarTelefone from '@/functions/validarTelefone';
import validarEmail from '@/functions/validarEmail';

const TransitionVerticalTop = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface SimpleDialogProps {
  open: boolean;
  setOpen: (e: boolean) => void;
  // onClose: () => void;
  title?: string | React.ReactNode;
  // children?: React.ReactNode;
  // Footer?: React.ReactNode;  
  paperWidth?: string
  paperHeight?: string
  PaperProps?: any
  className?: string
  parcelasProcesso?: ItemListRecentsType[]
  returnValores: () => void
  setLoading: (e: boolean) => void;
  listBancos?: ListType[]
  listaChavesPix?: []
}

type FormValues = {
    tipo?: string,
    chave_pix?: number | string
    pix?: string
    banco?: number | string
    agencia?: string
    conta?: string
    apelido?: string 
}

type ListType = {
    id: number | string
    nome: string
}

export default function ModalMetodoPagamento(props: SimpleDialogProps) {
    const errorMsg = 'Campo obrigatório';
    const { open, setOpen, title, paperWidth, paperHeight, parcelasProcesso, setLoading, listBancos, listaChavesPix, returnValores, ...rest } = props;
    const metodosTransferencia = [
        {
            id: 1,
            title: 'PIX',
        },
        {
            id: 2,
            title: 'Banco',
        },
    ];

    const [confirmedMethodId, setConfirmedMethodId] = useState(metodosTransferencia[0].id);
    const [selectedMethodId, setSelectedMethodId] = useState(confirmedMethodId);

    const {
        register,
        setValue,
        clearErrors,
        setError,
        watch, // watch é necessário para os campos 'sucess' e 'error'
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
            tipo: 'pix',
            chave_pix: '',
            pix: '',
            banco: '',
            agencia: '',
            conta: '',
            apelido: '',
        }
    });

    console.log('WATCH: ', watch())
    console.log('ERROR: ', errors)

    // const returnBancos = async () => {
    //     const bancos = await GetListBancos() as unknown as ListType[];
    //     bancos.unshift({ id: '', nome: 'Selecione...' })
    //     setListBancos(bancos || []);
    // }

    // const returnListaChavesPix = async () => {
    //     const chavesPix: any = await GetListChavesPix(); 
    //     // chavesPix.unshift({id: '', nome: ''})
    //     setListaChavesPix(chavesPix);
    // }
    
    // useEffect(() => {
    //     returnBancos();
    //     returnListaChavesPix();
    // }, [open])

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedMethodId(Number(event.target.value));
        setValue('tipo', Number(event.target.value) === 1 ? 'pix' : 'banco')

        if(event.target.value === '1'){
            setValue('banco', '');
            setValue('agencia', '');
            setValue('conta', '');
            clearErrors('banco');
            clearErrors('agencia');
            clearErrors('conta');
        }
        else{
            setValue('chave_pix', '');
            clearErrors('chave_pix');
            setValue('pix', '');
            clearErrors('pix');
        }
    };
    
    const handleClose = () => {
        setOpen(false)
    };

    const onSubmit = async (data: FormValues) => {
        console.log('Dados do formulário:', data);
        // const response = await postSalvarNovoMetodoPagamento(data);

        const blockSave = {
            agencia: data?.agencia,
            banco_id: data?.banco,
            bloco: 2,
            chave_pix: data?.chave_pix,
            conta: data?.conta,
            pix: data?.pix,
            usuario_id: localStorage.getItem('usuario_id'),
            apelido: data?.apelido,
            tipo: data?.tipo,
        }

        const response = await postSaveMeuPerfil(blockSave)

        if(response){
            returnValores();    
        }
        else{
            console.error('Erro ao salvar novo metodo de pagamento');
        }
        handleClose();
    };

    const msgCPF = "Numero do CPF inválido";
    const msgCNPJ = "Numero do CNPJ inválido";
    const msgTelefone = "Número de telefone inválido";
    const msgEmail = "Email inválido";
    const handleBlurPixCPF_CNPJ_Telefone_Email = () => {
        const value = watch(`pix`) || '';
        const tipoChave = Number(watch(`chave_pix`)) || 0; // Convertendo para número
        console.log(watch(`pix`));
        console.log(typeof(watch('chave_pix')));
        
        if (tipoChave === 1) {
            // CPF/CNPJ
            const cleanValue = value.replace(/\D/g, ''); // Remove caracteres não numéricos
            const type = cleanValue.length <= 11 ? 'cpf' : 'cnpj'; // Baseado no número de dígitos
            let isValid = true;

            if (type === 'cpf') {
                setValue('pix', cpfMask(value));
                isValid = validarCPF(watch(`pix`));
            } else {
                setValue('pix', cnpjMask(value));
                isValid = validarCNPJ(watch(`pix`));
            }

            isValid
                ? clearErrors(`pix`)
                : setError(`pix`, { type: "validate", message: type === 'cpf' ? msgCPF : msgCNPJ });
        }
        else if (tipoChave === 2) {
            // Telefone/Celular
            setValue('pix', phoneMask(value));
            const isValid = validarTelefone(watch(`pix`) || '');
            
            isValid
                ? clearErrors(`pix`)
                : setError(`pix`, { type: "validate", message: msgTelefone });
        }
        else if (tipoChave === 3) {
            // Email
            const trimmedValue = value.trim().toLowerCase(); // Remove espaços e converte para minúscula
            setValue('pix', trimmedValue);
            const isValid = validarEmail(trimmedValue);
            
            isValid
                ? clearErrors(`pix`)
                : setError(`pix`, { type: "validate", message: msgEmail });
        }
        else {
            clearErrors(`pix`);
            setValue('pix', value);
        }
    };

    return (
        <div>
        <Dialog 
            onClose={handleClose} 
            open={open}
            TransitionComponent={TransitionVerticalTop}
            maxWidth={'lg'}       
            PaperProps={{
                style: {
                    width: paperWidth || 'auto',
                    height: paperHeight  || 'auto',
                }
            }}
            {...rest}
            className="dialog-detalhes-corretor"
        >
            {title && <DialogTitle className="header-dialog header-dialog-metodo-pagamento">{title}</DialogTitle>}
            <IconButton
                aria-label="close"
                onClick={handleClose}
                className='icon-close'
                sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
                }}
            >
                <Close />
            </IconButton>

            <DialogContent className='dialog-content dialog-parcelas dialog-metodo-pagamento'>
                <div className="ultimas-comissoes metodo-pagamento">
                    <div className="select-radio">
                        <RadioGroup
                            className="radio"
                            value={selectedMethodId}
                            onChange={handleRadioChange}
                        >
                            {metodosTransferencia.map((metodo) => (
                                <FormControlLabel
                                    key={metodo.id}
                                    value={metodo.id}
                                    className={selectedMethodId === metodo.id ? 'selected' : ''}
                                    control={<Radio />}
                                    label={
                                        <div className='row-label'>
                                            <div className='title'>{metodo.title}</div>
                                        </div>
                                    }
                                    sx={{
                                        border: selectedMethodId === metodo.id ? '1px solid #01988C' : '1px solid #eee',
                                        borderRadius: '8px', padding: '8px', marginBottom: '8px', marginLeft: 0, marginRight: 0,
                                        '& .MuiFormControlLabel-label': { width: '100%' },
                                    }}
                                />
                            ))}
                        </RadioGroup>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="form-metodo-pagamento" noValidate>
                        {selectedMethodId === 1 
                        ? 
                            <div className='flex-col gap16 pix-group'>
                                <div className="input-select">
                                    <InputSelect 
                                        option={listaChavesPix}
                                        label={'Tipo de chave *'}
                                        placeholder={'Selecione uma chave PIX'}
                                        error={!!errors.chave_pix ? true : false}
                                        msgError={errors.chave_pix}
                                        required={true}
                                        sucess={!!watch('chave_pix')}
                                        value={watch('chave_pix')}
                                        disabled={listaChavesPix ? false : true}
                                        {...register('chave_pix', {
                                            validate: (value) => {
                                                if (value === '0') {
                                                    return "Nenhuma chave PIX foi selecionada";
                                                }
                                            },
                                            required: errorMsg,
                                            onChange: (e) => {
                                                // Limpa o campo PIX quando muda o tipo de chave
                                                setValue('pix', '');
                                                clearErrors('pix');
                                            }
                                        })}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    />
                                </div>
                                
                                <InputText
                                    label={'Chave pix*'}
                                    placeholder={'Digite sua chave PIX'}
                                    width='100%'                    
                                    sucess={!!watch(`pix`) && !errors?.pix}
                                    error={!!errors?.pix}
                                    msgError={errors?.pix}
                                    maxLength={
                                        Number(watch('chave_pix')) === 1 ? 18 : 
                                        Number(watch('chave_pix')) === 2 ? 15 : // Ajustado para 15 (formato com máscara)
                                        Number(watch('chave_pix')) === 3 ? 254 : // Limite máximo para email
                                        undefined
                                    }
                                    onBlurFunction={() => handleBlurPixCPF_CNPJ_Telefone_Email()}
                                    {...register(`pix`, {
                                        required: errorMsg,
                                        validate: (value) => {
                                            const tipoChave = Number(watch('chave_pix'));
                                            
                                            if (!value || value.trim() === '') {
                                                return "Chave PIX é obrigatória";
                                            }
                                            
                                            // Validação baseada no tipo de chave
                                            if (tipoChave === 1) {
                                                // CPF/CNPJ - Validação será feita no onBlur, aqui só verifica se não está vazio
                                                const cleanValue = value.replace(/\D/g, '');
                                                if (cleanValue.length < 11) {
                                                    return "CPF deve ter 11 dígitos";
                                                }
                                                if (cleanValue.length > 14) {
                                                    return "CNPJ deve ter 14 dígitos";
                                                }
                                                
                                                // Valida CPF ou CNPJ
                                                const type = cleanValue.length <= 11 ? 'cpf' : 'cnpj';
                                                if (type === 'cpf') {
                                                    if (!validarCPF(value)) {
                                                        return "CPF inválido";
                                                    }
                                                } else {
                                                    if (!validarCNPJ(value)) {
                                                        return "CNPJ inválido";
                                                    }
                                                }
                                            }
                                            else if (tipoChave === 2) {
                                                // Telefone/Celular
                                                const cleanValue = value.replace(/\D/g, '');
                                                if (cleanValue.length < 10 || cleanValue.length > 11) {
                                                    return "Telefone deve ter 10 ou 11 dígitos";
                                                }
                                                
                                                if (!validarTelefone(value)) {
                                                    return "Número de telefone inválido";
                                                }
                                            }
                                            else if (tipoChave === 3) {
                                                // Email
                                                if (!validarEmail(value)) {
                                                    return "Email inválido";
                                                }
                                            }
                                            else if (tipoChave === 4) {
                                                // Chave aleatória (EVP) - deve ter exatamente 32 caracteres
                                                const cleanValue = value.replace(/\s/g, ''); // Remove espaços
                                                if (cleanValue.length !== 32) {
                                                    return "Chave aleatória deve ter 32 caracteres";
                                                }
                                                // Verifica se contém apenas caracteres alfanuméricos e hífens
                                                if (!/^[a-zA-Z0-9\-]+$/.test(cleanValue)) {
                                                    return "Chave aleatória deve conter apenas letras, números e hífens";
                                                }
                                            }
                                            
                                            return true;
                                        },
                                        onChange: (e) => {
                                            const tipoChave = Number(watch('chave_pix'));
                                            let value = e.target.value;
                                            
                                            // Aplica limitação no onChange para cortar caracteres excedentes
                                            if (tipoChave === 1 && value.length > 18) {
                                                value = value.slice(0, 18);
                                                e.target.value = value;
                                            } else if (tipoChave === 2 && value.length > 15) {
                                                value = value.slice(0, 15);
                                                e.target.value = value;
                                            } else if (tipoChave === 3 && value.length > 254) {
                                                value = value.slice(0, 254);
                                                e.target.value = value;
                                            }
                                            
                                            // Limpa erros quando o usuário começa a digitar
                                            if (errors?.pix) {
                                                clearErrors('pix');
                                            }
                                            
                                            return value;
                                        }
                                    })}
                                />
                            </div>
                        : 
                            <div className='flex-col gap16'>
                                <InputSelect
                                    label={'Instituição/banco*'}
                                    value={watch(`banco`) || ''}
                                    sucess={!!watch(`banco`)}
                                    option={listBancos}
                                    error={!!errors?.banco}
                                    msgError={errors?.banco}
                                    disabled={listBancos ? false : true}
                                    {...register(`banco`, {
                                        required: 'Selecione um banco',
                                        // onChange: (e) => handleSelectBanco(e.target.value)
                                    })}
                                />

                                <div className="row">
                                    <InputText
                                        label={'Agência*'}
                                        placeholder={'0000'}
                                        width='100%'                    
                                        sucess={!!watch(`agencia`) && !errors?.agencia}
                                        error={!!errors?.agencia}
                                        msgError={errors?.agencia}
                                        {...register(`agencia`, {
                                            required: 'A agência é obrigatória.',
                                        })}
                                    />

                                    <InputText
                                        label={'Conta*'}
                                        placeholder={'00000-0'}
                                        width='100%'                    
                                        sucess={!!watch(`conta`) && !errors?.conta}
                                        error={!!errors?.conta}
                                        msgError={errors?.conta}
                                        {...register(`conta`, {
                                            required: 'A conta é obrigatória.',
                                        })}
                                    />
                                </div>
                            </div>
                        }
                         <InputText
                            label={'Apelido (opcional)'}
                            placeholder={'Ex: Conta poupança'}
                            width='100%'                    
                            sucess={!!watch(`apelido`)}
                            {...register(`apelido`)}
                        />

                        <ButtonComponent
                            name="confirm"
                            variant="contained"
                            labelColor="white"
                            size={"large"}
                            label={"Salvar"}
                            endIcon={<CheckIcon width={20} height={20} fill={'white'} />}
                            type="submit"
                        />
                    </form>
                </div>
            </DialogContent>
        </Dialog>
        </div>
    );
}