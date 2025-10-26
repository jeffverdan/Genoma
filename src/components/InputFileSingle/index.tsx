import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Check } from '@mui/icons-material';

type FileType = File | undefined;

interface PropsType {
  handleFile: (e: FileType) => void
  variant: 'outlined' | 'contained' | 'text'
  width?: number
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// FUNÇÃO PARA EXIBIR UM INPUT FILE DE UNICO ARQUIVO, 
// AO INSERIR ARQUIVO CHAMA FUNÇÃO 'handleFile' PASSANDO PARAMETRO FILE, 
// PARA DELETAR CHAMA A MESMA FUNÇÃO PASSANDO PARAMETRO 'undefined'

export default function InputFileSingle({ handleFile, width, ...rest }: PropsType) {
  const [file, setFile] = React.useState<FileType>();
  const handle = (e: any) => {
    const value = e.target.files?.[0] as FileType;    
    if (value) {
      setFile(value);
      handleFile(value);
    }
  };

  const delFile = () => {
    setFile(undefined);
    handleFile(undefined);
  };

  return (
    <div className='single-input-container'>
      {!file ? <Button
        sx={{ width: width || 'auto' }}
        component="label"
        role={undefined}
        className='single-input-file'
        tabIndex={-1}
        startIcon={<ArrowUpTrayIcon width={24} />}
        onChange={handle}
        {...rest}
      >
        Selecione o arquivo
        <VisuallyHiddenInput type="file" />
      </Button>
        :
        <div className='file-container'>
          <div className='file-name'>
            <p>{file.name}</p>
            <Check />
          </div>
          <Button variant="contained" color="error" onClick={delFile}>
            <XMarkIcon width={24} fill='white' />
          </Button>
        </div>
      }
    </div>
  );
}
