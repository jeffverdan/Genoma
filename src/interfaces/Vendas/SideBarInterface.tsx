import { Block } from "@/types/Block";
import Slider from "react-slick";
import ImovelData from "../Imovel/imovelData";

export default interface SideBarInterface {  
  blocks: any[]

  saveBlocks: () => void;
  sliderRef?: React.RefObject<Slider> | null;
  dataProcesso?: any

  selectItem: number,
  setSelectItem: (data: number) => void;

  idProcesso: number | string;
  setDataToSave?: (e: any) => void

  loading?: boolean
  listDocuments?: any[]
  type?: 'vendedores' | 'compradores'
  imovelData?: ImovelData

  statusProcesso?: number | string
  setStatusProcesso?: (newValue: any) => void
};