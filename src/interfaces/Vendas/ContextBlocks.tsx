import Slider from "react-slick";
import ImovelData from "../Imovel/imovelData";
import { Block } from "@/types/Block";

export default interface MyContextData {
  loading: boolean;
  setLoading: (newValue: boolean) => void;    
  blocks: Block[]
  sliderRef: React.RefObject<Slider> | null;

  dataProcesso?: any;
  setDataProcesso: (value: any) => void;

  saveBlocks?: () => void;

  dataSave: any[];
  setDataSave: (newValue: any) => void;

  selectItem: number,
  setSelectItem: (data: number) => void;

  idProcesso: number | string;

  progress?: any,
  setProgress?: (newValue: any) => void;
  
  listaDocumentos?: [];
  setListaDocumentos?: (newValue: []) => void;

  loadingDocumentos?: boolean;
  setLoadingDocumentos?: (newValue: boolean) => void;

  listChavesPix?: [];
  listBancos?: {id:string, nome: string}[];
  listGerentes?: [];
  listOpcionistas?: [];

  // CAMPOS VENDEDORES E COMPRADORES
  dataUsuario?: any
  setDataUsuario?: (newValue: any) => void;
  
  concluirForm?: boolean;
  setConcluirForm?: (newValue: boolean) => void; 
  
  statusProcesso?: any,
  setStatusProcesso?: (newValue: any) => void;
};