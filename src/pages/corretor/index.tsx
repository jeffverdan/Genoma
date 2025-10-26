import { useEffect, useState } from "react";
import { detectDevice } from "@/functions/detectDevice";
import MobilePage from "./mobile";
import CorretoresDesktop from "./desktop";
import HeadSeo from '@/components/HeadSeo';

export default function Corretor() {
  const [device, setDevice] = useState('');  
  const title: string = "Painel - Corretor";

  useEffect(() => {    
    const device = detectDevice();
    setDevice(device);    
  }, []);

  return (
    <main className="corretor">
      
      <HeadSeo titlePage={title} description="Pós Venda" />
      {device === 'Smartphone'
       ? <MobilePage />
       : <CorretoresDesktop />
      }
    </main>
  );
}