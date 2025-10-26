import React, { useState } from 'react'
import { Autocomplete, TextField, Box, CircularProgress } from '@mui/material';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { OptionsHora } from './Types';

// AUTOCOMPLETO APENAS PARA FILTRO DE ENDEREÇO

type PropsData = {

  value: OptionsHora | undefined
  onChange: (event: any, newValue: OptionsHora | null) => void
  disabled?: boolean
  loading?: boolean
  options: OptionsHora[]
};

// const options: OptionsHora[] = [
//   {hora: "06:00", permisao: 1},
// ];

export default function HoraSelect({ value, options, onChange, disabled, loading }: PropsData) {

  console.log(disabled);

  return (
    <div id='autocomplete-filters' 
      className={`hora ${value?.hora ? 'sucess' : ""} ${loading ? 'loading' : ''} ${disabled ? 'disabled' : ''}`}
    >
      <div className={'icon-search'}>
        {loading
          ? <CircularProgress className={' loading-filter'} size={20} />
          : ''
        }
      </div>
      <Autocomplete
        fullWidth
        disabled={loading || disabled}
        options={options}
        value={value}
        onChange={(event, newValue) => onChange(event, newValue)}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          } else return `${option.hora}`
        }}
        disableClearable={!value?.hora}
        className={`autocomplete-component`}
        renderOption={(props, option) => {
          return (
          <Box {...props} className={`MuiAutocomplete-option horarios ${option.permisao ? 'livre' : 'ocupado'}`} component="li" key={option.hora} >
            <div className={``} >
              {option.hora} <span className='status'>{option.permisao ? '' : 'Agendado'}</span>
            </div>
          </Box>
        )}}
        renderInput={
          (params) => <TextField autoComplete="off" type='search' className='InputText' placeholder='Selecione a hora' {...params} />
        }
      />
    </div>
  )
}
