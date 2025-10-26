import React from 'react';
import { IconButton, Select  } from '@mui/material';
import { useState, forwardRef, ForwardedRef } from 'react';
import { SelectProps } from "@mui/material/Select";
import { Visibility, VisibilityOff, Check } from "@mui/icons-material";
import InputAdornment from '@mui/material/InputAdornment';
import { FieldError } from "react-hook-form";
import { HiExclamation } from 'react-icons/hi';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Theme, useTheme } from '@mui/material/styles';
import { SelectChangeEvent } from '@mui/material/Select';

type MySelectProps = SelectProps & {
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    error?: boolean;
    sucess?: boolean;
    msgError?: FieldError;
    width?: string;
    option: {
        id: string | number, 
        name?: string,
        nome?: string
    }[];
    value?: any;    
    onChange?: any;
    onClose?: any;
    format: string;
};

const InputMultiSelect = forwardRef<HTMLInputElement, MySelectProps>(
        //
        function InputSelect(data: MySelectProps, ref) {
        const { label, msgError, placeholder, sucess, required, error, option, value, ...rest } = data;
        const [isFocused, setIsFocused] = useState(false);
        const [isValue, setIsValue] = useState(value && value !== '0' ? true : false);
        
        const handleInputFocus = () => {
            setIsFocused(true);
        };

        const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            if (e.target.value) {
                setIsValue(true);
            } else {
                setIsValue(false);
            }
        };

        return (
            <div className="inputMultiSelect">
                <div className={"inputContainer " +
                    (/*isValue || */sucess ? "sucess " : "") +
                    (isFocused ? "active " : "") +
                    (error ? "error " : "") +
                    (rest.disabled ? "disable " : "") +
                    (rest.format === 'multiSelectDocs' ? 'select-doc' : '')
                }
                style={{marginBottom: '0px'}}
            >

                <InputLabel className="select-label" id="demo-simple-select-label">{label}</InputLabel>                              
                <Select
                    className={rest.format === 'multiSelectDocs' ? 'input-default select-documentos' : " select-default input-default"}
                    labelId="demo-simple-select-standard-label"
                    required={required}                    
                    id={rest.name}
                    value={value}
                    label={label}
                    autoWidth={true}
                    displayEmpty
                    multiple
                    {...rest}
                    inputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {error
                                    ? <HiExclamation />
                                    : <Check width={14} height={12} />
                                }
                            </InputAdornment>
                        )
                    }}
                    renderValue={(value) => {
                        if (value.length === 0) {
                            return <span>{placeholder}</span>;
                        }
                        else{
                            if (value.length === 1){

                                const optionFind = option.find((valor) => valor.id === value[0])
                                const optionName = optionFind?.nome;
                                return optionName;
                            }
                            else{
                                return `${value.length} tipos selecionados`;
                            }
                        }
                    }}
                    error={!!error}
                    inputRef={ref}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                >

                    <MenuItem disabled value="0">
                        Tipos de documentos
                    </MenuItem>
                    {option.map((value: any, index: number) => (
                        <MenuItem key={index} value={value.id} disabled={value.id === '0' ? true : false}>
                            {value.name || value.nome}
                        </MenuItem>
                    ))}
                </Select>
                {msgError && <p className='errorMsg'>*{msgError.message}</p>}
            </div>
            </div>
        )
    })

InputMultiSelect.displayName = 'InputSelect';
export default InputMultiSelect;
