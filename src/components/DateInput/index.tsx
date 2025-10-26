import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/pt-br';
import { FieldError } from 'react-hook-form';
import { TextFieldProps } from "@mui/material/TextField";
import styles from './index.module.scss';

type MyTextFieldProps = TextFieldProps & {
  label: string;
  value: string;
  setValue: (data: any) => void;
  name?: string;
  placeholde?: string;
  required?: boolean;
  error: boolean;
  setError: (data: any) => void;
  sucess?: boolean;
  msgError?: FieldError,
  width?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function DatePickerValue(data: MyTextFieldProps) {
  const { label, msgError, placeholder, sucess, setError, error, width, value, setValue } = data;
  const [isValue, setIsValue] = useState(value ? true : false);
  const dataFormat = dayjs(value, 'DD-MM-YYYY').locale('pt-br');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pt-br'>
      <div
        style={{ width: width }}
        className={
          styles.container + " " +
          (isValue ? "sucess " : "")
        }>
        <DatePicker
          label={label}
          disablePast
          value={dataFormat}
          onError={(e) => e ? setError(true) : setError(false)}
        // views={['day', 'month', 'year']} // ORDEM Q APARECE AO CLICAR NO CALENDARIO
        // onChange={(newValue) => setValue(newValue?.format('DD-MM-YYYY'))}
        />
      </div>
    </LocalizationProvider>
  );
}