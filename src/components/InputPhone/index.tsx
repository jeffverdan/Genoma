import { IconButton, TextField } from '@mui/material';
import { useState, forwardRef, ForwardedRef } from 'react';
import { TextFieldProps } from "@mui/material/TextField";
import { Visibility, VisibilityOff, Check } from "@mui/icons-material";
import InputAdornment from '@mui/material/InputAdornment';
import { FieldError } from "react-hook-form";
import { HiExclamation } from 'react-icons/hi';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'

type MyTextFieldProps = TextFieldProps & {
    country?: string;
    name?: string;
    label?: string;
    placeholder: string;
    required?: boolean;
    error?: boolean;
    sucess?: boolean;
    msgError?: FieldError,
    width?: string,
    isValid?: any,
    //onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChange?: any,
    onMouseLeave?: any,
    value: string,
};

const InputPhone = forwardRef<HTMLInputElement, MyTextFieldProps>(
    function InputText(data: MyTextFieldProps, ref) {
        let { label, msgError, placeholder, sucess, required, error, width, value, type, ...rest } = data;
        const [isFocused, setIsFocused] = useState(false);
        const [isValue, setIsValue] = useState(value ? true : false);
        const [showPassword, setShowPassword] = useState<Boolean>(false);

        const handleInputFocus = () => {
            setIsFocused(true);
        };

        // const handleOnChange = (data: any, event: any) => {
        //     console.log('qualquer coisa aqui')
        //     // console.log(value);
        //     console.log(event);
        //     console.log(data);
        //     // console.log(formattedValue)
        //     // this.setState({ rawPhone: value.slice(data.dialCode.length) })
        //   }

        const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            if (e.target.value.length > 9) {
                setIsValue(true);
            } else {
                setIsValue(false);
            }
        };

        // const handleClickShowPassword = () => {
        //     setShowPassword(!showPassword);
        // };

        // const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        //     event.preventDefault();
        // };        

        return (
            <div style={{width: width}} className={"inputContainer " +
                (sucess ? "sucess " : "") +
                (isFocused ? "active " : "") +
                (error ? "error " : "") +
                (rest.disabled ? "disable" : "")
            }>
                <PhoneInput
                    //label={label}
                    specialLabel="Celular *"
                    className="input-default input-phone"
                    variant="standard"
                    id={rest.name}
                    inputProps={{
                        //name: {name},
                        required: required,
                        autoFocus: false,
                        endAdornment: (
                            <InputAdornment position="end">
                                {error
                                    ? <HiExclamation />    
                                    : sucess 
                                        ? <Check width={14} height={12} />
                                        : ''
                                }
                            </InputAdornment>
                        )
                    }}
                    {...rest}
                    placeholder={placeholder}
                    country={'br'}
                    masks={{br: '(..) .....-....'}}
                    value={value}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />
                {msgError && <p className='errorMsg'>*{msgError.message}</p>}
            </div>

            /////////////////////////////////////////////////////////////////////////////
            // OBS: Adicionar no form logo após o InputPhone
            // <input
            //     type="hidden"
            //     {...register('celular', {
            //     required: 'Campo obrigatório',
            //     validate: (value) => {
            //         if(watch('ddi') === '55'){
            //         if (value.length < 15) {
            //             return "Formato de celular inválido";
            //         }
            //         }
            //     },
            //     })}
            // />


            // Função handleCelular para usar no Form
            // const handleCelular = (data: any, e: any, value: any, formattedValue: any) => {
            //     const ddi = `+${e.dialCode}`; 
            //     let numeros = formattedValue.split(" ");
            //     let novoNumero = formattedValue.replace(ddi, '');
            
            //     console.log('Value celular: ' , e);
            
            //     setValue('ddi', e.dialCode);
            //     setValue('celular', novoNumero.trimStart());
            //     handleInput('celular', novoNumero.trimStart());
            
            //     // Limpa o erro da validação para telefone BR
            //     if(e.dialCode === '55'){
            //       formattedValue.length === 19 && clearErrors('celular');
            //     }
            //     else{
            //       clearErrors('celular')
            //     }
            // }
            /////////////////////////////////////////////////////////////////////////////
        )
    })

InputPhone.displayName = 'InputPhone';
export default InputPhone;
