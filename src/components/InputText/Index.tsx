import { IconButton, TextField } from '@mui/material';
import { useState, forwardRef, ForwardedRef } from 'react';
import { TextFieldProps } from "@mui/material/TextField";
import { Visibility, VisibilityOff, Check } from "@mui/icons-material";
import InputAdornment from '@mui/material/InputAdornment';
import { FieldError } from "react-hook-form";
import { HiExclamation } from 'react-icons/hi';

type MyTextFieldProps = TextFieldProps & {
    name: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    error?: boolean;
    sucess?: boolean;
    msgError?: FieldError,
    width?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    saveOnBlur?: (e?: React.ChangeEvent<HTMLInputElement>) => void
    onBlurFunction?: () => void
    iconBefore?: any
};

const InputText = forwardRef<HTMLInputElement, MyTextFieldProps>(
    function InputText(data: MyTextFieldProps, ref) {
        const { label, msgError, placeholder, sucess, required, error, width, value, onBlurFunction, iconBefore, type, saveOnBlur, ...rest } = data;
        const [isFocused, setIsFocused] = useState(false);
        const [isValue, setIsValue] = useState(value ? true : false);
        const [showPassword, setShowPassword] = useState<Boolean>(false);
        console.log(error);
        

        const handleInputFocus = () => {
            setIsFocused(true);
        };

        const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            
            if (saveOnBlur) saveOnBlur(e);
            if (e.target.value) {
                setIsValue(true);
            } else {
                setIsValue(false);
            }
            if (onBlurFunction) onBlurFunction();
        };

        const handleClickShowPassword = () => {
            setShowPassword(!showPassword);
        };

        const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
        };

        return (
            <div style={{ width: width }} className={"inputContainer " +
                (isValue || sucess ? "sucess " : "") +
                (isFocused ? "active " : "") +
                (error ? "error " : "") +
                (rest.disabled ? "disable" : "")
            }>
                <TextField
                    label={label}
                    className="input-default"
                    variant="standard"
                    id={rest.name}
                    required={required}                    
                    {...rest}
                    value={value}
                    placeholder={placeholder}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end" className='icons-container'>
                                {!!iconBefore && iconBefore}
                                
                                {rest.name.includes("password")
                                        ? <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>

                                        :
                                        sucess && !rest.name.includes("email")
                                            ? <Check width={14} height={12} />
                                            : ''
                                }
                                {error && <HiExclamation />}
                            </InputAdornment>
                        )
                    }}
                    error={!!error}
                    inputRef={ref}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    type={rest.name.includes("password") ? (showPassword ? "text" : "password") : type ? type : "text"}
                />
                {msgError && <p className='errorMsg'>*{msgError.message}</p>}
            </div>
        )
    })

InputText.displayName = 'InputText';
export default InputText;
