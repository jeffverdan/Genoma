import React, {createContext} from 'react';
//import { MyImovel } from '@/interfaces/Imovel';
import Slider from "react-slick";
// import { MyContextData } from '@/interfaces/UsersContext/MyContextData';

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

export interface MyContextData {
    loading: boolean;
    setLoading: (newValue: boolean) => void;    

    blocks: Block[]
    sliderRef: React.RefObject<Slider> | null;

    dataProcesso: any;
    setDataProcesso: (newValue: any[] | []) => void;

    saveImovel?: () => void;

    dataSave: any[];
    setDataSave: (newValue: any) => void;

    idProcesso: string | number;

    // selectItem: number,
    // setSelectItem: (data: number) => void;

    // dataUsuario?: any;
    // setDataUsuario?: (newValue: any) => void;

    // dataUsuarios?: any
    // setDataUsuarios?: (newValue: any) => void;

    // progress?: any, 
    // setProgress?: (newValue: any) => void;

    // concluirForm?: boolean;
    // setConcluirForm?: (newValue: boolean) => void;

    // multiDocs?: any;
    // setMultiDocs: (newValue: any) => void;
    
    // listaDocumentos?: [];
    // setListaDocumentos: (newValue: []) => void;
};
  
const DetalheImovelContext = createContext<MyContextData>({
    loading: false,
    setLoading: () => {},

    blocks: [],
    sliderRef: null,

    dataProcesso: "",
    setDataProcesso: () => {},
    saveImovel: () => {},

    dataSave: [],
    setDataSave: () => {},

    idProcesso: 0,

    // selectItem: 0,
    // setSelectItem: () => {},

    // progress: '',
    // setProgress: () => {},

    // multiDocs: '',
    // setMultiDocs: () => {},

    // listaDocumentos: [],
    // setListaDocumentos: () => {},
});

export default DetalheImovelContext;