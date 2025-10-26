import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import styles from './index.module.scss';
import { UseFormSetValue } from 'react-hook-form';

type Props = {
  label: string;
  name: string;
  options: Options[];
  setOptions: (data: Options[]) => void;
  value?: string;
  setValue: UseFormSetValue<any>
  changeFunction?: (e: string) => void
  disabled?: boolean
};

type Options = {
  value: string;
  disabled: boolean;
  label: string;
  checked: boolean;
  width?: string;
  percent?: number;
};

export default function RowRadioButtonsGroup({ label, value, name, options, setOptions, changeFunction, setValue, disabled }: Props) {
  const handleChange = (value: boolean, index: number) => {
    setValue(name, options[index].value);
    options.map((option) => (
      option.checked = false
    ))
    options[index].checked = value;
    setOptions([...options])
    if(changeFunction) changeFunction(options[index].value);
  };

  return (
    <FormControl >
      <FormLabel>{label}</FormLabel>
      <RadioGroup row >
        {options?.map((option, index) => (
          <div key={index} className={`radio-item ${option.value === value ? styles.check : styles.unCheck} ${styles.container}`} style={{ width: option.width ? option.width : 'auto' }}>
            <FormControlLabel
              disabled={disabled || option.disabled}
              value={option.value}
              checked={value === option.value}
              control={<Radio />}
              label={option.label}
              onChange={(e) => handleChange((e.target as HTMLInputElement).checked, index)}
            />
          </div>
        ))}
      </RadioGroup>
    </FormControl>
  );
}