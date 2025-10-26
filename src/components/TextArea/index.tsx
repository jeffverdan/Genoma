import * as React from 'react';
// import TextareaAutosize from '@mui/base/TextareaAutosize';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import styles from './index.module.scss';
import { forwardRef } from 'react';
// import { FieldError } from "react-hook-form";

type Props = {
  minRows: number;
  placeholder: string;
  label: string;
  value?: string;
  error?: boolean;
  onChange?: (e: any) => void
  inputRef?: any
  maxChars?: number
  className?: string
  msgError?: string
};

const EmptyTextarea = forwardRef(({ minRows, placeholder, label, value, error, maxChars, className, msgError, ...rest }: Props, ref) => {
  const count = (maxChars || 0) - (value?.length || 0);

  const styleInput = () => {
    if (value) return 'sucess'
    else if (error) return 'error'
    else return ''
  };

  return (
    <div className='text-area-container'>
      <div className='textArea'>
        <label className={styleInput()}>{label}</label>
        <TextareaAutosize
          value={value}
          minRows={minRows}
          placeholder={placeholder}
          {...rest}
          className={`${styleInput()} ${className}`}
        />
      </div>
      {maxChars && <p className='textArea-count'>Caracteres restantes: {count}</p>}
      {msgError && <p className='errorMsg'>*{msgError}</p>}
    </div>
  );
});
EmptyTextarea.displayName = "TextArea"
export default EmptyTextarea