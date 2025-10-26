import React, { useContext, Context } from 'react';
import styles from './verticalBlocksCarousel.module.scss';
import Slider from "react-slick";
import ButtonComponent from '../ButtonComponent';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import ContextBlocks from "@/interfaces/Vendas/ContextBlocks";
import SideBarInterface from "@/interfaces/Vendas/SideBarInterface";

type Footer = React.FC<{
  goToPrevSlide: (index: number) => void;
  goToNextSlide: (index: number) => void;
  index: number;
  tipo?: string,
}>

type BlockProps = {
  context: Context<ContextBlocks | SideBarInterface>,
};

const Footer: Footer = ({ goToNextSlide, goToPrevSlide, index, tipo }) => {
  return (
    <footer className={styles.footerControls}>
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
          label={tipo === 'last_block' ? "Concluír cadastro" : "Próximo"}
          endIcon={<HiArrowRight fill='white' />}
          onClick={() => goToNextSlide(index)}
        />
      </div>
    </footer>
  )
};

const Blocks: React.FC<BlockProps> = ({ context }) => {
  const {
    blocks, sliderRef, dataProcesso, saveBlocks, setSelectItem, selectItem
  } = useContext(context);
  

  const goToNextSlide = (index: number) => {
    saveBlocks && saveBlocks();
    //Atualiza o status do item de menu para checked
    blocks[selectItem].status = 'checked';

    if (sliderRef?.current) {
      sliderRef.current.slickNext();
    }
    setSelectItem(index + 1);
  };

  const goToPrevSlide = (index: number) => {
    saveBlocks && saveBlocks();

    if (sliderRef?.current) {
      sliderRef.current.slickPrev();
    }
    setSelectItem(index - 1);
  };

  const returnComissao = (index: number) => {
    switch (blocks[index].name) {
      case 'Gerentes Gerais':
        return 'comissao_gerente_gerais';
      case 'Gerentes':
        return 'comissao_gerentes';
      case 'Corretores Vendedores':
        return 'corretores_vendedores_comissao';
      case 'Corretores Opcionistas':
        return 'corretores_opicionistas_comissao';
      default:
        return ''
    }
  }

  return (
    <div className={styles.carouselContainer} id='carouselContainer'>
      {blocks.map((block, index) => (
        <div
          key={index}
          className={`${'blocoScroll'} ${selectItem === index ? styles.active : styles.disabled}`}
          style={{
            display: blocks[index].name === 'Procurador' && selectItem === 0
              ? 'none'
              : selectItem === 2 && blocks[index].name === 'Procurador'
                ? 'block' : ''
          }}
        >
          {/* // DIV VAZIA PRA SERVIR DE MARGIN AO DAR AUTO SCROLL */}
          <div data-scroll={index} style={{ height: '50px' }}></div>
          <div className={`${styles.block}`}>
            <block.page
              handlePrevBlock={goToPrevSlide}
              handleNextBlock={goToNextSlide}
              index={index}
              data={dataProcesso}
              Footer={Footer}
              comissaoAgent={returnComissao(index)}
            />
          </div>

          {index === blocks.length - 1 &&
            <div style={{ height: '50px' }}></div>
          }
        </div>
      ))}
    </div>

  );
}

export default Blocks;