import React, { useState } from 'react'
import { Autocomplete, TextField, Box } from '@mui/material';

// AUTOCOMPLETO APENAS PARA FILTRO DE ENDEREÇO

type OptionData = {
  id?: number,
  usuario_id:  string | number,
  label: string,
}

type PropsData = {
  options: OptionData[]
  value?: OptionData
  onChange: (event: any, newValue: OptionData | null, index: number) => void
  label: string
  placeholder?: string
  isFocused?: boolean
  sucess?: boolean
  error?: boolean
  errorMsg?: string | undefined
  disabled?: boolean
  index: number
  register?: any
  pathReg?: string
  freeSolo: boolean
  onBlur?: () => void
};

function capitalizeFirstWord(str: string | undefined): string {
  if (!str) return ""
  const words = str.toLowerCase().split(' ');
  const capitalizedWords = words.map(word => {
    if (word.length > 2) return word.charAt(0).toUpperCase() + word.slice(1)
    else return word.charAt(0) + word.slice(1)
  });
  return capitalizedWords.join(' ');
}

export default function InputAutoComplete({ options, onChange, onBlur, freeSolo, value, label, placeholder, isFocused, sucess, error, errorMsg, index, register, pathReg, ...rest }: PropsData) {

  return (
    <Autocomplete
      disablePortal
      fullWidth
      freeSolo={freeSolo}
      value={value}
      options={options.sort((a, b) => -b.label?.localeCompare(a.label))}
      sx={{ width: '280px' }}
      placeholder={placeholder}
      onChange={(event, newValue) => onChange(event, newValue as OptionData, index)}
      className={"inputContainer " +
        (sucess ? "sucess " : "") +
        (isFocused ? "active " : "") +
        (error ? "error " : "") +
        (rest.disabled ? "disable" : "")
      }
      onBlur={onBlur}
      // getOptionLabel={(option) => {
      //   if (typeof option === 'string') {
      //     return option;
      //   } else return `${option.label}`

      // }}      
      renderOption={(props, option) => {
        if (option.label)
        return (
          <Box component="li" {...props}>
            <div> {capitalizeFirstWord(option.label)} </div>
          </Box>
        )
      }}
      renderInput={
        (params) => {
          if(value?.label) params.inputProps.value = value.label;
          // @ts-expect-error
          params.InputLabelProps = { shrink: true };          
          return (
            <>
              <div className='inputContainer'>
                <TextField
                  onChange={(event) => onChange(event.target.value, null, index)}
                  variant="standard"
                  className="input-default"
                  label={label}
                  {...params}
                  // inputProps={{ value: value?.label || '' }}
                  // value={value?.label}             
                />
                <input
                  hidden
                  {...register(pathReg, {
                    required: true
                  })}
                />
              </div>
              {error && errorMsg && <p className='errorMsg'>*{errorMsg} </p>}
            </>
          )
        }
      }
    />
  )
}
