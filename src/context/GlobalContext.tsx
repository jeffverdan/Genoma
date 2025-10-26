import React, {createContext} from 'react';

interface FormValues {
    bairro: string;
    cep: string;
    cidade: string;
    codigo: string;
    complemento: string;
    id: number;
    logradouro: string;
    numero: string;
    uf: string;
    unidade: string;
  }

interface MyContextData {
    categoriaMenu: string;
    setCategoriaMenu: (newValue: string) => void;

    processoId: string;
    setProcessoId: (newValue: string) => void;

    token: string;
    setToken: (newValue: string) => void;
    
    imovelSave?: FormValues
}
  
const GlobalContext = createContext<MyContextData>({
    categoriaMenu: '',
    setCategoriaMenu: () => {},

    processoId: '',
    setProcessoId: () => {},

    token: '',
    setToken: () => {},

    imovelSave: {bairro: '', cep: '', cidade: '', codigo: '', complemento: '', id: 0, logradouro: '', numero: '', uf: '', unidade: '' },
});

export default GlobalContext;