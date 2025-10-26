import React from 'react';
import Footer from '@/components/Footer';

interface FormValues {
    imovel: number;
    vendedores?: number;
    compradores?: number;
    recibo?: number;
    comissao?: number;
    porcentagem_total_concluida?: number;
  }

export default function FooterDashboard({ options, idProcesso, foguetes }: { options: FormValues, idProcesso: any, foguetes: string }) {    
    const progressoTotal = options?.porcentagem_total_concluida;
    return (
        <Footer progress={Number(progressoTotal)} idProcesso={idProcesso} foguetes={foguetes} />
    )
}