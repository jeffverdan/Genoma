import React, {createContext} from 'react';
//import { MyImovel } from '@/interfaces/Imovel';
import Slider from "react-slick";
import ContextInterface from "@/interfaces/Vendas/ContextBlocks";
import SideBarInterface from '@/interfaces/Vendas/SideBarInterface';
  
const ImovelContext = createContext<ContextInterface | any>({
    loading: false,
    setLoading: () => {},

    blocks: [],
    sliderRef: null,

    dataProcesso: {},
    setDataProcesso: () => {},
    saveBlocks: () => {},

    dataSave: [],
    setDataSave: () => {},

    selectItem: 0,
    setSelectItem: () => {},

    idProcesso: 0,

    progress: '',
    setProgress: () => {},

    listaDocumentos: [],
    setListaDocumentos: () => {},

    loadingDocumentos: false,
    setLoadingDocumentos: () => {},

    // CAMPOS VENDEDORES E COMPRADORES
    dataUsuario: "",
    setDataUsuario: () => {},

    concluirForm: true,
    setConcluirForm: () => {},

    statusProcesso: '',
    setStatusProcesso: () => {}
});

export default ImovelContext;