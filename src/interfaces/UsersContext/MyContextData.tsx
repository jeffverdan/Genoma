import Slider from "react-slick";
import { Block } from '@/types/Block'; 

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

    selectItem: number,
    setSelectItem: (data: number) => void;

    idProcesso: string | number;

    dataUsuario?: any;
    setDataUsuario?: (newValue: any) => void;

    dataUsuarios?: any
    setDataUsuarios?: (newValue: any) => void;

    progress?: any, 
    setProgress?: (newValue: any) => void;

    concluirForm?: boolean;
    setConcluirForm?: (newValue: boolean) => void;

    multiDocs: any;
    setMultiDocs: (newValue: any) => void;
    
    listaDocumentos: [];
    setListaDocumentos: (newValue: []) => void;
};