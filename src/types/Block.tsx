import ImovelData from "@/interfaces/Imovel/imovelData";

export type Block = {
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
      comissaoAgent?: 'comissao_gerente_gerais' | 'comissao_gerentes' | 'corretores_opicionistas_comissao' | 'corretores_vendedores_comissao' | ''
    }>;
    name: string,
    status: string,
    saved?: boolean
  };

  