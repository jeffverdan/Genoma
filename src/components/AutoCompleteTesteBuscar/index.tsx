import React, { useState } from 'react'
import { Autocomplete, TextField, Box } from '@mui/material';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import styles from './index.module.scss';
import { OptionData } from './interface';

// AUTOCOMPLETO APENAS PARA FILTRO DE ENDEREÇO

type PropsData = {
  options: OptionData[]
  value: OptionData | string | null
  onInputChange: (event: any, newValue: string | OptionData | null) => void
  onChange: (event: any, newValue: OptionData | null) => void;  // Adicionando onChange para capturar o item selecionado
  disabled?: boolean
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

function capitalizeFirstWord(str: string | undefined): string {
  if (!str) return ""
  const words = str.toLowerCase().split(' ');
  const capitalizedWords = words.map(word => { 
    if (word.length > 2) return word.charAt(0).toUpperCase() + word.slice(1) 
    else if (words.length < 2 && word.length === 2) return word.toUpperCase();
    else return word.charAt(0) + word.slice(1) 
  });
  return capitalizedWords.join(' ');
}

export default function AutoComplete({ options, value, onInputChange, onChange, disabled, onKeyDown }: PropsData) {

  return (
    <div className={`${styles.container} ${value ? styles.sucess : ""} autocomplete endereco`}>
      <HiMagnifyingGlass className={styles.icon} />
      <Autocomplete
        fullWidth
        freeSolo
        disabled={disabled}
        options={options}
        value={value}
        onInputChange={(event, newValue) => onInputChange(event, newValue)} // Atualizando para o valor digitado
        onChange={(event, newValue) => {
            // Verificando se newValue é do tipo OptionData antes de passar para onChange
            if (newValue && typeof newValue !== 'string') {
              onChange(event, newValue); // Passa para onChange apenas se for OptionData
            }
          }} // Captura o item selecionado
          filterOptions={(x) => x} //
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          } else return `${option.logradouro}${option.numero ? ', ' + option.numero : ''}`
        }}
        className={styles.autocomplete}
        renderOption={(props, option) => {
          return (
            <Box {...props} className='MuiAutocomplete-option endereco' component="li" key={option.processo_id}>
              <div className={styles.box} >
                <div className={styles.logradouro}> {`${option.logradouro}, ${option.numero}${option.unidade ? " / " + option.unidade : ""}`} </div>
                <div className={styles.complemento}> {option.complemento && option.bairro ? option.complemento + " - " : option.complemento} {capitalizeFirstWord(option.bairro)} </div>
              </div>
            </Box>
          );
        }}
        renderInput={(params) => <TextField {...params} autoComplete="off" type='search' className='InputText' placeholder='Pesquise o endereço...'   onKeyDown={onKeyDown} />}
      />
    </div>
  )
}