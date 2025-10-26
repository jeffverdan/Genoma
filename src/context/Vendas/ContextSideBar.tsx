import React, {createContext} from 'react';
//import { MyImovel } from '@/interfaces/Imovel';
import Slider from "react-slick";
import SideBarInterface from '@/interfaces/Vendas/SideBarInterface';
import ContextInterface from "@/interfaces/Vendas/ContextBlocks";
  
const SideBarContext = createContext<SideBarInterface | ContextInterface>({
    blocks: [],
    
    saveBlocks: () => {},

    selectItem: 0,
    setSelectItem: () => {},

    idProcesso: 0,
});

export default SideBarContext;