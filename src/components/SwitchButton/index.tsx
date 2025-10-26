import * as React from 'react';
import Switch from '@mui/material/Switch';
import styles from './index.module.scss';

type Props = {
  label: string;
  check: boolean;
  setCheck: (newValue: boolean) => void;
  handleChange?: (type: any, value: any) => any;
  width?: string;
  disabled?: boolean;
};

export default function SwitchWithLabel({check, setCheck, handleChange, label, width, disabled, ...rest }: Props) {

  return (
    <div className={check ? styles.check + " " + styles.container : styles.unCheck + " switch-div " + styles.container } style={{ width: width ? width : 'auto'}}>      
        <Switch 
          checked={check} 
          onClick={() => setCheck(!check)} 
          onChange={handleChange}
          inputProps={{ role: 'switch' }}
          disabled={disabled}
        /> <span>{label}</span>      
    </div>
  );
}