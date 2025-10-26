import React, { useState } from 'react';
import {Button} from '@mui/material';
import { ButtonProps } from '@mui/material/Button';
//import ToggleButton from '@mui/material/ToggleButton';
//import ListIcon from '@mui/icons-material/List';

type MyButtonProps = ButtonProps & {
    name?: string;
    label: string;
    size: string;
    required?: boolean;
    error?: boolean;
    variant: 'contained' | 'text' | 'outlined';
    labelColor?: string,
    //startIcon: string;
};

export default function ButtonComponent({
        name,
        label,
        size,
        labelColor,
        //startIcon,
        disabled,
        error,
        variant,
        ...rest
    } : MyButtonProps)
{

    return(

        <>
            <div className={`btn-${name} ${label === '' ? `btn-icon` : ''}`}>
                <Button
                    name={name}
                    size={size}
                    variant={variant}
                    className={`button btn-style-${name} btn-${size} ${disabled === true && `btn-disabled`} ${error === true && `btn-error`} `}
                    disabled={disabled}
                    {...rest}
                    disableFocusRipple={true}                
                >
                    {/*<p style={{ color: labelColor}}>{label}</p>*/}
                    {label && <span style={{ color: labelColor}}>{label}</span>}
                </Button>
            </div>
        </>
    )
}