import React, { useEffect, useState } from 'react'
import { Autocomplete, TextField, Box, CircularProgress, Modal, Button, Fade } from '@mui/material';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import styles from './index.module.scss';
import { OptionData } from './interface';
import ButtonComponent from '../ButtonComponent';
import { XMarkIcon } from '@heroicons/react/24/solid';

// AUTOCOMPLETO APENAS PARA FILTRO DE ENDEREÇO

type PropsData = {
  options: OptionData[]
  value: OptionData | string | null
  onChange: (event: any, newValue: string | OptionData | null) => void
  disabled?: boolean
  loading?: boolean
  modalOpen: boolean
  setModalOpen: (open: boolean) => void
  onBlurFilter?: (event: React.FocusEvent<HTMLInputElement>) => void
  validarFilter?: boolean
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

export default function AutoCompleteMobile({ modalOpen, setModalOpen, options, value, onChange, disabled, loading, onBlurFilter, validarFilter }: PropsData) {
  const handleFilter = () => {
    setModalOpen(false);
  };

  const [valueOnBlur, setValueOnBlur] = useState<string>('');


  useEffect(() => {
    // FOCO NO INPUT ASSIM Q ABRE O MODAL
    setTimeout(() => {
      const inputElement = document.querySelector('.MuiAutocomplete-input') as HTMLInputElement;
      if (inputElement && modalOpen) {
        inputElement.focus();
      }
    }, 100); // Atraso de 100ms para garantir que o modal esteja completamente aberto
  }, [modalOpen]);

  console.log('VALUE AutocompleteMobile: ', value)

  return (
    <React.Fragment>
      <Modal
        open={modalOpen}
      // onClose={handleClose}
      >
        <Fade in={modalOpen}>
          <Box className={styles.modalStyle}>
            <div className={styles.headerStyle}>
              <span>Busca</span>

              <ButtonComponent
                variant='text'
                onClick={() => setModalOpen(false)}
                endIcon={<XMarkIcon />}
                size={'small'}
                label={''}
              />
            </div>

            <div className={`${styles.container} ${value ? styles.sucess : ""}`}>
              {loading
                ? <CircularProgress className={styles.icon} size={20} />
                : <HiMagnifyingGlass className={styles.icon} />
              }
              <Autocomplete
                // disablePortal
                fullWidth
                freeSolo
                onBlur={onBlurFilter}
                openOnFocus
                disabled={loading || disabled}
                options={options}
                clearIcon={<ButtonComponent name='limpar' label='Limpar' variant='outlined' size='small' onClick={() => onChange(null, null)} />}
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
                        <div className={styles.complemento}> {option.complemento && option.bairro ? option.complemento + " - " : option.complemento} {capitalizeFirstWord(option.bairro)} </div>
                      </div>
                    </Box>
                  )
                }}
                renderInput={
                  (params) => <TextField autoComplete="off" type='search' className='InputText' placeholder='Pesquise o endereço...' {...params} />
                }
                slotProps={{
                  popper: {
                    className: styles.popper,
                  },
                }}
              />
            </div>

            <div className={styles.footer}>
              <ButtonComponent
                variant='contained'
                labelColor='white'
                fullWidth
                disabled={!value && !validarFilter || loading}
                onClick={handleFilter}
                label='Aplicar busca'
                size={'large'}
              />
            </div>
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  )
}
