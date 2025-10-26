import React, {createContext} from 'react';
//import { MyImovel } from '@/interfaces/Imovel';
//import Slider from "react-slick";
import { MyContextData } from '@/interfaces/UsersContext/MyContextData';
  
const UsersContext = createContext<MyContextData>({
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

    idProcesso: '0',

    dataUsuario: "",
    setDataUsuario: () => {},

    dataUsuarios: '',
    setDataUsuarios: () => {},

    progress: 0, 
    setProgress: () => {},

    concluirForm: true,
    setConcluirForm: () => {},

    // concluirForm: '',
    // setConcluirForm: () => {},

    multiDocs: '',
    setMultiDocs: () => {},

    listaDocumentos: [],
    setListaDocumentos: () => {},
});

export default UsersContext;