import * as React from 'react';
import { useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { GerentesOptionData } from './interface';
import { Avatar } from '@mui/material';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface Props {
  options: GerentesOptionData[]
  onChange: (event: React.SyntheticEvent, value: GerentesOptionData[]) => void
  loading?: boolean
}

const returnNameGerente = (label: string) => {
  let labelAbv = label.split(' ')[0];
  // const name1 = label.split(' ')[0];
  const name2 = (label.split(' ')[1]?.length > 2 ? label.split(' ')[1] : label.split(' ')[2]) || '';

  if (name2) {
    labelAbv = labelAbv + " " + (name2.split('')[0]?.toUpperCase() + '.');
  };

  return labelAbv;
};

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */
  return color;
};

export default function AutoCompleteGerentes({ options, onChange, loading }: Props) {

  useEffect(() => {
    if (options[0]?.id !== '') options.unshift({ id: '', label: 'Pesquise gerentes' });
  }, [options]);

  function stringAvatar(label: string) {
    label = returnNameGerente(label);
    return {
      sx: {
        bgcolor: stringToColor(label),
        width: 24,
        height: 24,
        padding: 1,
        fontSize: 12
      },
      children: `${label.split(' ')[0]?.[0]}${label.split(' ')[1]?.[0] || ''}`,
    };
  };

  const returnPlaceholder = (params: AutocompleteRenderInputParams) => {
    const placeholder = !!params.InputProps.startAdornment ? '' : "Pesquise por gerentes...";
    return placeholder;
  };

  return (
    <div id="autocomplete-filters">
      <HiMagnifyingGlass className='icon-search' />
      <Autocomplete
        multiple
        options={options}
        disabled={loading}
        disableCloseOnSelect
        onChange={onChange}
        limitTags={1}
        getOptionLabel={(option) => option.label}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          if (option.id === '') {
            return (
              <span className='subtitle'>{option.label}</span>
            )
          } else return (
            <li key={key} {...optionProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                className='check-box'
                checked={selected}
              />
              <Avatar className='avatar-autocomplete'  {...stringAvatar(option.label.toUpperCase())} />
              {option.label}
            </li>
          );
        }}
        // style={{ width: 500 }}
        renderInput={(params) => (
          <TextField autoComplete="off" type='search' className='InputText' placeholder={returnPlaceholder(params)} {...params} />
        )}
      />
    </div>
  );
}
