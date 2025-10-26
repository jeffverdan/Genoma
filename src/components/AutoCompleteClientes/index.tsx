import * as React from 'react';
import { useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { ClientesOptionData } from './interface';
import { Avatar, Box } from '@mui/material';
import styles from './index.module.scss';
interface Props {
  value?: ClientesOptionData | null
  options: ClientesOptionData[]
  onChange: (event: React.SyntheticEvent, value: ClientesOptionData | null) => void
}

export default function AutoCompleteClientes({ options, onChange, value } : Props) {
  return (
    <div className={styles.inputClientes}>
        <div className={`${styles.container} ${value ? styles.sucess : ""} autocomplete clientes`} /*id="autocomplete-gerentes"*/>
          {/* <HiMagnifyingGlass className='icon-search'/> */}
          <Autocomplete
            options={options}
            disableCloseOnSelect
            value={value}
            onChange={(event, value, reason, details) => onChange(event, value)}
            limitTags={1}
            getOptionLabel={(option) => option.label || ''}
            className={styles.autocomplete}
            renderOption={(props, option) => {
              return (
              <Box {...props} className='MuiAutocomplete-option endereco' component="li" key={option.id} >
                <div className={styles.box}>
                  <div className={styles.logradouro}> {`${option.label}`} </div>
                </div>
              </Box>
            )}}
            // style={{ width: 500 }}
            renderInput={(params) => (
              <TextField autoComplete="off" type='search' className='InputText' placeholder="🔍︎ Pesquise por clientes..." {...params} />
            )}
          />
      </div>
    </div>
    
  );
}
