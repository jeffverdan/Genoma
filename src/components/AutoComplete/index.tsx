import React, { useState } from 'react'
import { Autocomplete, TextField, Box, CircularProgress } from '@mui/material';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import styles from './index.module.scss';
import { OptionData } from './interface';

// AUTOCOMPLETO APENAS PARA FILTRO DE ENDEREÇO

type PropsData = {
  options: OptionData[]
  value: OptionData | string | null
  onChange: (event: any, newValue: string | OptionData | null) => void
  disabled?: boolean
  loading?: boolean
  onBlurFilter?: () => void
};

function capitalizeFirstWord(str: string | undefined): string {
  if(!str) return ""
  const words = str.toLowerCase().split(' ');
  const capitalizedWords = words.map(word => { 
    if(word.length > 2) return word.charAt(0).toUpperCase() + word.slice(1) 
    else if (words.length < 2 && word.length === 2) return word.toUpperCase();
    else return word.charAt(0) + word.slice(1) 
  });
  return capitalizedWords.join(' ');
}

export default function AutoComplete({ options, value, onChange, disabled, loading, onBlurFilter}: PropsData) {

  return (
    <div className={`${styles.container} ${value ? styles.sucess : ""} autocomplete endereco`}>
      {loading
        ? <CircularProgress className={styles.icon} size={20} />
        : <HiMagnifyingGlass className={styles.icon} />
      }
      <Autocomplete
        // disablePortal
        fullWidth
        freeSolo
        onBlur={onBlurFilter}
        disabled={loading || disabled}
        options={options}
        value={value}
        onChange={(event, newValue) => onChange(event, newValue as OptionData | null)}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          } else return `${option.logradouro}${option.numero ? ', ' + option.numero : ''}`
        }}
        className={styles.autocomplete}
        renderOption={(props, option) => {
          return (
          <Box {...props} className='MuiAutocomplete-option endereco' component="li" key={option.processo_id} >
            <div className={styles.box} >
              <div className={styles.logradouro}> {`${option.logradouro}, ${option.numero}${option.unidade ? " / " + option.unidade : ""}`} </div>
              <div className={styles.complemento}> {option.complemento  && option.bairro ? option.complemento + " - " : option.complemento} {capitalizeFirstWord(option.bairro)} </div>
            </div>
          </Box>
        )}}
        renderInput={
          (params) => <TextField autoComplete="off" type='search' className='InputText' placeholder='Pesquise o endereço...' {...params} />
        }
      />
    </div>
  )
}
