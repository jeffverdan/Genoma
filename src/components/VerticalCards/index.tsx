import React, { useContext, Context, useEffect, useState } from 'react';
import Slider from "react-slick";
import ButtonComponent from '../ButtonComponent';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import SideBarInterface from "@/interfaces/Vendas/SideBarInterface";
// import SwipeableViews from 'react-swipeable-views';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import { Skeleton } from '@mui/material';
import { HiCheck } from 'react-icons/hi2';
import { useRouter } from 'next/router';

type Footer = React.FC<{
  goToPrevSlide: (index: number) => void;
  goToNextSlide: (index: number) => void;
  index: number;
  tipo?: string,
}>

const Footer: Footer = ({ goToNextSlide, goToPrevSlide, index, tipo }) => {
  return (
    <footer className='footer-cards'>
      {/* BOTÕES DE AVANÇAR E RETROCEDER */}
      <div>
        {index > 0 &&
          <ButtonComponent
            size={"large"}
            variant={"text"}
            name={"previous"}
            label={"Anterior"}
            startIcon={<HiArrowLeft className='primary500' />}
            onClick={() => goToPrevSlide(index)}
          />}
      </div>
      <div>
        <ButtonComponent
          size={"large"}
          variant={"contained"}
          name={"previous"}
          labelColor='white'
          label={tipo === 'last_block' ? "Concluír correção" : "Próximo"}
          endIcon={tipo === 'last_block' ? <HiCheck fill='white' /> : <HiArrowRight fill='white' />}
          onClick={() => goToNextSlide(index)}
        />
      </div>
    </footer>
  )
};

const VerticalCards = (props: SideBarInterface) => {
  const {
    blocks, dataProcesso, saveBlocks, setSelectItem, selectItem, setDataToSave, loading, listDocuments, idProcesso, type, imovelData
  } = props;
  const router = useRouter();

  const goToNextSlide = (index: number) => {
    saveBlocks && saveBlocks();
    blocks[selectItem].status = 'checked';
    if(blocks.length === selectItem + 1) {
      router.back();
    }
    
    setSelectItem(index + 1);
  };

  const goToPrevSlide = (index: number) => {
    saveBlocks && saveBlocks();    
    setSelectItem(index - 1);
  };

  return (
    <div className={'vertical-cards-container'} >
      <SwipeableViews
        axis={'y'}
        index={selectItem}
        onChangeIndex={setSelectItem}        
        className='swipe-container'        
        resistance
      >
        {blocks.map((block, index) => (
          <div 
            key={index} 
            className={`card ${index === selectItem - 1 ? 'card-active' : ''}`}
          >
            {!loading ?
              <block.page
                handlePrevBlock={goToPrevSlide}
                handleNextBlock={goToNextSlide}
                index={index}
                data={type === 'vendedores' || type ==='compradores' ? imovelData : dataProcesso}
                userData={dataProcesso}
                Footer={Footer}
                setBlockSave={setDataToSave}
                blocksLength={blocks.length}
                listaDocumentos={listDocuments}
                processoId={idProcesso}
                type={type}
                imovelData={imovelData}
              />
              : <Skeleton variant="rounded" height={600} />
            }

          </div>
        ))}
      </SwipeableViews>
    </div>

  );
}

export default VerticalCards;