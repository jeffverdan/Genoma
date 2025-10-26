import { createContext, useContext, useState, ReactNode } from 'react';

// Criação do contexto
interface ImovelContextProps {
  imovelData: any;
  setImovelData: React.Dispatch<React.SetStateAction<any>>;
}

const ImovelContext = createContext<ImovelContextProps>({
  imovelData: null,
  setImovelData: () => {},
});

// Componente provedor do contexto
interface ImovelProviderProps {
  children: ReactNode;
}

const GerarVendaContext = ({ children }: ImovelProviderProps) => {
  const [imovelData, setImovelData] = useState(null);

  return (
    <ImovelContext.Provider value={{ imovelData, setImovelData }}>
      {children}
    </ImovelContext.Provider>
  );
};

// Hook para consumir o contexto
const useGerarVendaContext = () => {
  return useContext(ImovelContext);
};

export { GerarVendaContext, useGerarVendaContext };
