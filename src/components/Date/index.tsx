import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/pt-br';
import { DateValidationError, PickerChangeHandlerContext } from '@mui/x-date-pickers';

type PropsType = {
  label?: string
  width?: string
  value?: Dayjs | null | undefined // dayjs(value, 'DD-MM-YYYY').locale('pt-br');
  className?: string
  disablePast?: boolean
  disableFuture?: boolean
  onChange?: (value: Dayjs | null, context: PickerChangeHandlerContext<DateValidationError>) => void
  minDate?: Dayjs
  maxDate?: Dayjs
  name?: string
};

export default function DateInputComponent(props: PropsType) {
  const { label, width, value, disablePast, disableFuture, onChange, className, minDate, maxDate, name } = props;
  const dateValue: Dayjs | undefined | null = value?.format('DD-MM-YYYY').toString() === 'Invalid Date' ? '' as unknown as Dayjs : value ;
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pt-br'>
      <div
        style={{ width: width }}
        className={
          ((value && value?.format('DD-MM-YYYY') !== 'Invalid Date') ? "sucess " : "") + className
        }>
        <DatePicker
          className='input-date select-default'
          label={label}
          name={name}
          disablePast={disablePast}       
          value={dateValue}
          disableFuture={disableFuture}
          onError={(e) => false}
          minDate={minDate}
          maxDate={maxDate}          
          reduceAnimations          
          slotProps={{
            desktopPaper: () => ({className: 'popper-date'})
          }}
          onChange={onChange}
        />
      </div>
    </LocalizationProvider>
  );
}