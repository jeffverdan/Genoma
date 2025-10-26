import React, { useEffect } from 'react';
import { IconButton, ListSubheader, Select } from '@mui/material';
import { useState, forwardRef, ForwardedRef } from 'react';
import { SelectProps } from "@mui/material/Select";
import { Visibility, VisibilityOff, Check } from "@mui/icons-material";
import InputAdornment from '@mui/material/InputAdornment';
import { FieldError } from "react-hook-form";
import { HiExclamation } from 'react-icons/hi';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

type MySelectProps = SelectProps & {
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    error?: boolean;
    sucess?: boolean;
    msgError?: FieldError | any;
    width?: string | number;
    option?: any[] | any;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlurFunction?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
    subHeader?: any;
    divClass?: string
};

const InputSelect = forwardRef<HTMLInputElement, MySelectProps>(
    function InputSelect(data: MySelectProps, ref) {
        const { label, msgError, placeholder, sucess, required, error, option, value, subHeader, width, onBlurFunction, divClass, className, ...rest } = data;
        const [isFocused, setIsFocused] = useState(false);
        const [isValue, setIsValue] = useState(value && value !== '0' ? true : false);

        useEffect(() => {
            setIsValue(value && value !== '0' ? true : false)
        },[value])

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
            if(onBlurFunction) onBlurFunction(e)
        };        

        return (
            <div className={"inputContainer " + className + ' ' +
                ((isValue || sucess) ? "sucess " : "") +
                (isFocused ? "active " : "") +
                (error ? "error " : "") +
                (rest.disabled ? "disable" : "") +
                (divClass ? divClass : '')
            }>

                <InputLabel className="select-label" id="demo-simple-select-label">{label}</InputLabel>                              
                <Select
                    className="input-default select-default"
                    labelId="demo-simple-select-standard-label"
                    required={required}                    
                    id={rest.name}
                    value={value}
                    label={label}
                    autoWidth={false}
                    displayEmpty
                    {...rest}
                    // renderValue={(selected: any) => {
                    //     if (!selected) {
                    //       return <em>{placeholder}</em>;
                    //     }            
                    //     return selected;
                    //   }}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                // maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                                // width: '300px'
                                // width: 250,
                            },
                            className: 'Menu-Select-Multi',
                        },
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'center',
                        },
                    }}
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
                    error={!!error}
                    inputRef={ref}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                >
                    {option?.map((value: any, index: number) => (
                        <MenuItem key={value.id} value={value.id} disabled={value.id === '0' || value.id === ''} className={value.id === '0' || value.id === '' ? 'placeholder' : ''}>                            
                            {value.name || value.nome || value.label}
                        </MenuItem>
                    ))}
                    {!!subHeader && subHeader}
                </Select>
                {msgError && <p className='errorMsg'>*{msgError.message}</p>}
            </div>
        )
    })

InputSelect.displayName = 'InputSelect';
export default InputSelect;
