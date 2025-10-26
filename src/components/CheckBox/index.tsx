import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import styles from './index.module.scss';

type Props = {
  label: string;
  required?: boolean;
  checked?: boolean;
  value: string;
  path?: string;
  register?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  //setCheck: (newValue: boolean) => void;
};

//style={{width: '300px', padding: '43px', margin: 0}}

const otherForm = {
  width: '210px', 
  padding: '25px',
  marginBottom: '20px'
}

const defaultForm = {
  width: 'inherit', 
  padding: '', 
}

export default function CheckBox({register, value, className, label, checked, required, onChange, path, ...rest }: Props) {
  return (
    <div className={(checked ? styles.check + " " + styles.container : styles.unCheck )+ " " + styles.container + " " + className } style={label === 'União estável' ? otherForm : defaultForm}>      
        {/*<Switch checked={check} onClick={() => setCheck(!check)} /> <span>{label}</span>*/}
        <FormGroup>
          <FormControlLabel 
            control={
              <Checkbox 
                value={value} 
                checked={checked} 
                {...rest} 
                onChange={onChange} 
                sx={
                  { '& .MuiSvgIcon-root': { fontSize: 18, fill: '#01988C'} }
                }
              />
            } label={label} 
          />
        </FormGroup>
    </div>
  );
}