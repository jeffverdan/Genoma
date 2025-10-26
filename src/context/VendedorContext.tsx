import React, {createContext} from 'react';
//import { MyImovel } from '@/interfaces/Imovel';
import Slider from "react-slick";

interface MyContextData {
    loading: boolean;
    setLoading: (newValue: boolean) => void;    
    blocks: Block[]
    sliderRef: React.RefObject<Slider> | null;

    dataProcesso: any;
    setDataProcesso: (newValue: any[] | []) => void;

    saveImovel: () => void;

    dataSave: any[];
    setDataSave: (newValue: any) => void;

    selectItem: number,
    setSelectItem: (data: number) => void;

    idProcesso: number;

    users?: string;
};

type Block = {
  id: number;
  page: React.FC<{
    handleNextBlock: (index: number) => void;
    handlePrevBlock: (index: number) => void;
    index: number;
    data: any[];
    Footer: React.FC<{
      goToPrevSlide: (index: number) => void;
      goToNextSlide: (index: number) => void;
      index: number;
    }>
  }>;
  name: string,
  status: string,
};
  
const VendedorContext = createContext<MyContextData>({
    loading: false,
    setLoading: () => {},

    blocks: [],
    sliderRef: null,

    dataProcesso: "",
    setDataProcesso: () => {},
    saveImovel: () => {},

    dataSave: [],
    setDataSave: () => {},

    selectItem: 0,
    setSelectItem: () => {},

    idProcesso: 0,

    users: '',
});

export default VendedorContext;