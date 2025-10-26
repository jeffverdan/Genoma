import React, {createContext} from 'react';
import { MyImovel } from '@/interfaces/Imovel';

interface MyContextData {
    loading: boolean;
    setLoading: (newValue: boolean) => void;

    codMidas: string;
    setCodMidas: (newValue: string) => void;

    imovelMidas: MyImovel[];
    setImovelMidas: (newValue: MyImovel[] | []) => void;
}
  
const VendasContext = createContext<MyContextData>({
    loading: false,
    setLoading: () => {},

    codMidas: '',
    setCodMidas: () => {},

    imovelMidas: [],
    setImovelMidas: () => {},
});

export default VendasContext;