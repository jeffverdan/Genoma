import React, {useEffect, useState, useContext} from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import InputText from "@/components/InputText/Index";
import { useForm } from 'react-hook-form'
import styles from './BlocksStyles.module.scss'
import Image from "next/image";
import Single from "@/images/single.png"; 
import ImovelContext from '@/context/Vendas/ContextBlocks';
import { Watch } from '@mui/icons-material';

interface FormValues {
  codImovel: string
}

type BlockProps = {
  handleNextBlock: (index: number) => void;
  handlePrevBlock: (index: number) => void;
  index: number;
  data: any;
  Footer: React.FC<{
    goToPrevSlide: (index: number) => void;
    goToNextSlide: any;
    index: number;
  }>
};

const BlockPage: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer}) => {

  const {
    selectItem, setDataSave,
  } = useContext(ImovelContext);

  const userName = "Sr. Genoma"

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<FormValues>({
    defaultValues: {
      codImovel: data?.codigo || '',
    }
  });

  const handleClick = (direction: string) => {
    if (direction === 'NEXT') {
      handleNextBlock(index);
    } else {
      handlePrevBlock(index);
    }
  };

  if(index === selectItem) {
    console.log("Form: ", watch());
    console.log("Error: ", errors);
  };

  const handleInput = (type: any) => {
    let valor: any = {
      'bloco': index,
      'processo_id': data.processo_id,
      'usuario_id': localStorage.getItem('usuario_id'),
      'codigo': watch("codImovel")
    };
    
    let newType = type;
    newType === 'codImovel' ? newType = 'codigo' : newType = type;

    valor[newType] = watch(type);
    setDataSave(valor);
  };

  return (
    <>
      <div className={styles.containerBlock}>
        <div className="flex">
          <div>
            <div className={styles.headerBlock}>
              <h3>{userName}, respeitamos o seu tempo.</h3>
              <p className="p1">O código do imóvel nos permite usar informações do Midas no cadastro da venda.</p>
            </div>

            <div className={styles.inputBlock}>
              <InputText
                label="Código do imóvel"
                placeholder='NCAP1234'
                error={!!errors.codImovel}
                msgError={errors.codImovel}
                disabled={true}
                sucess={!errors.codImovel && !!watch("codImovel")}
                {...register("codImovel", {
                  // required: "Código obrigatório",
                  // pattern: {
                  //   value: /^\S+@\S+$/i,
                  //   message: "Código inválido",
                  // },
                  onChange: () => handleInput('codImovel')
                })}
              />
            </div>
          </div>
          <Image className={styles.img} src={Single} alt={""} />
        </div>

        {Footer &&
          <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(() => handleClick("NEXT"))} index={index} />}
      </div>
    </>
  );
};

export default BlockPage;