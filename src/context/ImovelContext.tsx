import React, {createContext} from 'react';
//import { MyImovel } from '@/interfaces/Imovel';
import Slider from "react-slick";
import { MyContextData } from '@/interfaces/UsersContext/MyContextData';

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
  
const ImovelContext = createContext<MyContextData>({
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

    progress: '',
    setProgress: () => {},

    multiDocs: '',
    setMultiDocs: () => {},

    listaDocumentos: [],
    setListaDocumentos: () => {},
});

export default ImovelContext;