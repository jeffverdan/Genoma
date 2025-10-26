import ImovelData from "../Imovel/imovelData";

type Block = {
  id: number;
  page: React.FC<{
    handleNextBlock: (index: number) => void;
    handlePrevBlock: (index: number) => void;
    index: number;
    data: ImovelData | undefined;
    Footer: React.FC<{
      goToPrevSlide: (index: number) => void;
      goToNextSlide: (index: number) => void;
      index: number;
    }>
  }>;
  name: string,
  status: string,
};