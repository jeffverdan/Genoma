import * as React from 'react';
import { useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { ClientesOptionData } from './interface';
import { Avatar, CircularProgress } from '@mui/material';

//VIRTUALIZATION IMPORTS
import { useTheme, styled } from '@mui/material/styles';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface Props {
  options: ClientesOptionData[]
  onChange: (event: React.SyntheticEvent, value: (ClientesOptionData | string)[]) => void
  loading?: boolean
  clientesAndGerentes?: boolean
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

export default function FilterClientes({ options, onChange, loading, clientesAndGerentes }: Props) {
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

  const returnLabelCPF_CNPJ = (cpf_cnpj: string) => {
    return cpf_cnpj.length <= 14 ? "CPF" : "CNPJ";
  };

  const returnPlaceholder = (params: AutocompleteRenderInputParams) => {
    const placeholder = !!params.InputProps.startAdornment ? '' : clientesAndGerentes ? 'Pesquise por Gerentes ou Clientes...' : "Pesquise por clientes...";
    return placeholder;
  };

  //VIRTUALIZATION
  function renderRow(props: ListChildComponentProps) {
    const { data, index, style } = props;
    const dataSet = data[index];
    const inlineStyle = {
      ...style,
      top: (style.top as number) + LISTBOX_PADDING,
    };

    if (dataSet.hasOwnProperty('group')) {
      return (
        <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
          {dataSet.group}
        </ListSubheader>
      );
    };

    const { key, ...optionProps } = dataSet[0];
    const option = dataSet[1]
    return (
      <Typography key={key} component="li" {...optionProps} noWrap style={inlineStyle}>
        {/* <li key={key} {...optionProps}> */}
          <div className='filter-clientes'>
            <div className='item-container'>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                className='check-box'
                checked={option.check}
              />
              <Avatar className='avatar-autocomplete'  {...stringAvatar(option.label.toUpperCase())} />
              {(option.label)}
            </div>
            {option.cpf_cnpj && <span className='cpf-cnpj'>{returnLabelCPF_CNPJ(option.cpf_cnpj)} - {option.cpf_cnpj}</span>}
          </div>
        {/* </li> */}
      </Typography>
    );
  }

  function useResetCache(data: any) {
    const ref = React.useRef<VariableSizeList>(null);
    React.useEffect(() => {
      if (ref.current != null) {
        ref.current.resetAfterIndex(0, true);
      }
    }, [data]);
    return ref;
  };

  const OuterElementContext = React.createContext({});
  const LISTBOX_PADDING = 8; // px

  // eslint-disable-next-line react/display-name
  const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
  });

  const ListboxComponent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLElement>
  >(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData: React.ReactElement<unknown>[] = [];
    console.log(children);


    (children as React.ReactElement<unknown>[]).forEach(
      (
        item: React.ReactElement<unknown> & {
          children?: React.ReactElement<unknown>[];
        },
      ) => {
        itemData.push(item);
        itemData.push(...(item.children || []));
      },
    );

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
      noSsr: true,
    });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = (child: React.ReactElement<unknown>) => {
      if (child.hasOwnProperty('group')) {
        return 48;
      }

      return itemSize;
    };

    const getHeight = () => {
      if (itemCount > 8) {
        return 8 * itemSize;
      }
      return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };
    console.log(itemData);


    const gridRef = useResetCache(itemCount);

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            itemData={itemData}
            height={getHeight() + 2 * LISTBOX_PADDING}
            width="100%"
            ref={gridRef}
            outerElementType={OuterElementType}
            innerElementType="ul"
            itemSize={(index) => getChildSize(itemData[index])}
            overscanCount={5}
            itemCount={itemCount}
          >
            {renderRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  });

  return (
    <div id="autocomplete-filters" className='clientes'>
      {loading
        ? <CircularProgress className='icon-search loading-filter' size={20} />
        : <HiMagnifyingGlass className='icon-search' />
      }
      <Autocomplete
        multiple
        disabled={loading}
        options={options}
        disableCloseOnSelect
        onChange={(event, newValue) => onChange(event, newValue)}
        freeSolo
        limitTags={1}
        value={options.filter((option) => option.check)}
        // getOptionLabel={(option) => {
        //   if (typeof option === 'string') {
        //     return option;
        //   } else return `${option.label}`
        // }}
        // renderOption={(props, option, { selected }) => {
        //   const { key, ...optionProps } = props;
        //   props.key = option.id;
        //   optionProps['aria-selected'] = selected;
        //   console.log(option);


        //   if (option.id === '') {
        //     return (
        //       <span className='subtitle'>{option.label}</span>
        //     )
        //   } else return (
        //     <li key={option.id} {...optionProps}>
        //       <div className='filter-clientes'>
        //         <div className='item-container'>
        //           <Checkbox
        //             icon={icon}
        //             checkedIcon={checkedIcon}
        //             style={{ marginRight: 8 }}
        //             className='check-box'
        //             checked={option.check}
        //           />
        //           <Avatar className='avatar-autocomplete'  {...stringAvatar(option.label.toUpperCase())} />
        //           {(option.label)}
        //         </div>
        //         {option.cpf_cnpj && <span className='cpf-cnpj'>{returnLabelCPF_CNPJ(option.cpf_cnpj)} - {option.cpf_cnpj}</span>}
        //       </div>
        //     </li>
        //   );
        // }}

        renderInput={(params) => {
          params.InputProps.startAdornment = null;
          return (
            <TextField autoComplete="off" type='search' className='InputText' placeholder={returnPlaceholder(params)} {...params} value={''} />
          )
        }}
        groupBy={(option) => option.label[0].toUpperCase()}
        // renderInput={(params) => <TextField {...params} label="10,000 options" />}
        renderOption={(props, option, state) =>
          [props, option, state.index] as React.ReactNode
        }
        renderGroup={(params) => params as any}
        ListboxComponent={ListboxComponent}
      />
    </div>
  );
}
