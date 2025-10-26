
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { ListaDocumentosType } from '@/interfaces/Documentos';
import userInterface from '@/interfaces/Users/userData'
import React, { BaseSyntheticEvent } from 'react'

type BlockType = {
    bloco: number,
    processo_id?: string,
    usuario_id?: string,
    recibo_saved?: boolean,
} | []

type BlockProps = {
    handleNextBlock: (index: number) => void;
    handlePrevBlock: (index: number) => void;
    index: number;
    data: imovelDataInterface;
    Footer?: React.FC<{
      goToPrevSlide: (index: number) => void;
      goToNextSlide: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
      index: number;
      tipo?: string
    }>
    handleShow: (posicao: number, type: string) => void;
    setBlockSave: (block: BlockType) => void;
    saveBlocks: () => Promise<void>;
    listaDocumentos: ListaDocumentosType[]
    blocksLength?: number
    type?: 'vendedores' | 'compradores'
    userData?: userInterface
};


export type { BlockProps, BlockType }