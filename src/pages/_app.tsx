//import '@/styles/globals.css'

import React, { useEffect, useState } from 'react';
import '@/styles/index.scss'
import type { AppProps } from 'next/app'
import useDarkMode from "../hooks/DarkMode";
import { ThemeProvider, createTheme } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Header from '@/components/Header'
import GlobalContext from '@/context/GlobalContext';
//import { hotjar } from 'react-hotjar';
//import Script from 'next/script';
// import Hotjar from '@/components/Hotjar';
import { ptBR } from '@mui/x-date-pickers/locales';

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ToasterProvider } from '@/components/ToasterGlobal/ToasterProvider';

const cache = createCache({
  key: 'custom',
  prepend: true, // Faz seus estilos aparecerem depois dos do MUI
});

export default function App({ Component, pageProps }: AppProps) {
  const [theme, toggleTheme] = useDarkMode();

  //Global
  const [categoriaMenu, setCategoriaMenu] = useState('');
  const [processoId, setProcessoId] = useState('');
  const [users, setUsers] = useState('');
  const [token, setToken] = useState('');

  const context = {
    categoriaMenu, setCategoriaMenu,
    processoId, setProcessoId,
    users, setUsers,
    token, setToken,
  }
  //Global

  const newtheme = createTheme({
    palette: {
      mode: theme,
      primary: {
        main: "#14B8AA"
      }
    },
  },
    ptBR, // x-date-pickers translations
  );

  useEffect(() => {
    const variavel: string[] = []
    const handleKeyDown = (event: KeyboardEvent) => {
      variavel.push(event.key);
      if (variavel.join("").includes("darkmode")) {
        toggleTheme();
        variavel.length = 0;
      }
    };
    document.body.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleTheme]);

  //Controle de componentes globais
  const router = useRouter();
  let GlobalHeader: any;

  if (router.asPath === '/' || router.asPath === '/login') {
    GlobalHeader = null;
  }
  else {
    GlobalHeader = <Header />;
  };

  // SALVA HISTORICO DE URL NO SESSION
  useEffect(() => storePathValues, [router.asPath]);
  function storePathValues() {
    const storage = globalThis?.sessionStorage;
    if (!storage) return;
    // Set the previous path as the value of the current path.
    const prevPath = storage.getItem("currentPath");
    storage.setItem("prevPath", prevPath || '');
    // Set the current path value by looking at the browser's location object.
    storage.setItem("currentPath", globalThis.location.pathname);
  };

  return (
    // <CacheProvider value={cache}>
    <ThemeProvider theme={newtheme}>
      <StyledEngineProvider injectFirst>
        <ToasterProvider>
          <GlobalContext.Provider value={context}>
            {GlobalHeader}
            <Component {...pageProps} />
          </GlobalContext.Provider>
        </ToasterProvider>
      </StyledEngineProvider>
    </ThemeProvider>
    // </CacheProvider>
  )
}
