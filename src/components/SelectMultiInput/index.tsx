import * as React from 'react';
import { OutlinedInput, InputLabel, Select, MenuItem, ListItemText, Checkbox, InputAdornment } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import InputSelect from '../InputSelect/Index';
import { FieldError } from 'react-hook-form/dist/types/errors';
import { HiExclamation } from 'react-icons/hi';
import { Check } from '@mui/icons-material';
import { ItemsCorrecoes } from '@/interfaces/PosVenda/Devolucao';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            // width: 250,
        },
        className: 'Menu-Select-Multi',
    },
};

interface Props {
    label: string
    name: string;
    placeholder?: string;
    required?: boolean;
    error?: boolean;
    sucess?: boolean;
    msgError?: FieldError;
    maxWidth?: string | number;
    options?: any[] | [];
    value: any[];
    // setValue?: (e: ItemsCorrecoes[]) => void;
    onChange?: (e: any[]) => void;
    onBlurFunction?: () => void;
    subHeader?: any
    labelMenu?: string
    disable?: boolean
    className?: string
}

export default function MultipleSelectCheckmarks(props: Props) {
    const [personName, setPersonName] = React.useState<string[]>([]);
    const { label, msgError, placeholder, sucess, required, error, options, value, subHeader, maxWidth, onBlurFunction, labelMenu, onChange, disable, className, ...rest } = props;

    React.useEffect(() => {
        if(disable) {
            console.log(value); 
            labelInput(value.map(e => e.id));
        }
    },[value]);
    console.log(value);  
    
    React.useEffect(() => {        
        labelInput(value.map(e => e.id));
    }, [])
    
    const labelInput = (valueArr: number[]) => {
        const items: any = [];
        const names: any = [];
        
        valueArr.forEach((id: number) => {
            options?.forEach(item => {
                if (item.id === id) {
                    items.push(item);
                    names.push(item.nome ? item.nome : item.name);
                }
            })
        });        
        setPersonName(names);
        if(onChange && !disable) onChange(items);
    };

    const handleChange = (event: SelectChangeEvent<any>) => {
        const {
            target: { value },
        } = event;

        labelInput(value);       
    };


    const [isFocused, setIsFocused] = React.useState(false);
    // const [isValue, setIsValue] = React.useState(value && value !== '0' ? true : false);

    const handleInputFocus = () => {
        setIsFocused(true);
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        if (onBlurFunction) onBlurFunction()
    };

    return (
        <div className={"inputContainer " +
            (value?.[0] ? "sucess " : "") +
            (isFocused ? "active " : "") +
            (error ? "error " : "") +
            // (rest.disabled ? "disable" : "")
            (className ? className : '')
        }>

            <InputLabel className="select-label" id="demo-simple-select-label">{label}</InputLabel>
            <Select
                className="input-default select-default select-mult"
                required={required}                
                id={rest.name}
                value={value?.map(e => e.id)}
                label={label}
                disabled={!!disable}
                autoWidth={false}
                displayEmpty
                multiple
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => personName?.join(', ') || placeholder}
                inputProps={{
                    // style: {
                    //     width: '300px'
                    // }
                }}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                            // width: '300px'
                            // width: 250,
                        },
                        className: 'Menu-Select-Multi',
                    },
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center',
                    },
                }}
                name={''}
                // inputProps={{
                //     endAdornment: (
                //         <InputAdornment position="end">
                //             {error
                //                 ? <HiExclamation />
                //                 : <Check width={14} height={12} />
                //             }
                //         </InputAdornment>
                //     )
                // }}
                error={!!error}
                // inputRef={ref}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
            >
                
                    {labelMenu && <p className='label-menu'>{labelMenu}</p>}
                

                {options?.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        <Checkbox checked={personName.indexOf(option.nome ? option.nome : option.name) > -1} />
                        <ListItemText primary={option.nome ? option.nome : option.name} />
                    </MenuItem>
                ))}

                {msgError && <p className='errorMsg'>*{msgError.message}</p>}
            </Select>
        </div>
    );
}