import React from 'react';
import styles from './index.module.scss';
import ButtonBack from '../ButtonBack';
import Button from '@/components/ButtonComponent';
import CheckIcon from '@mui/icons-material/Check';
import ArrowForward from '@mui/icons-material/ArrowForward';

interface ButtonProps{
    label: string;
    startIcon?: any;
    icon?: string;
    endIcon?: any;
    disabled?: boolean;
    error?: boolean;
    onClick?: any;
}

export default function index({label, icon, startIcon, endIcon,  disabled, error, onClick}: ButtonProps) {
    return (
        <div className={styles.navFooter}>
            <ButtonBack />
            <Button 
                name="primary"
                size="large"
                label={label}
                disabled={disabled}
                error={error}
                variant="contained"
                endIcon={
                    icon === 'next'
                    ?
                    <ArrowForward className="icon icon-left" />
                    :
                    <CheckIcon className="icon icon-left" />
                }
                onClick={onClick}
            />
        </div>
    )
}
