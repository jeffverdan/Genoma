import { useEffect, useState } from 'react';

export function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    // Função que atualiza a largura
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Chamada inicial e listener
    handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup ao desmontar o componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return width;
}
