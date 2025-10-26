import React, {useState, useEffect} from 'react';
import Card from '@/components/Card';
import { CurrencyDollarIcon, DocumentTextIcon, HomeModernIcon, UserGroupIcon, CheckIcon } from "@heroicons/react/24/solid";
import SvgIcon from '@mui/material/SvgIcon';
import VendedorIcon from '@/images/vendedor-icon.svg';
import CompradorIcon from '@/images/comprador-icon.svg';

interface FormValues {
    imovel: number;
    vendedores: number;
    compradores: number;
    recibo: number;
    comissao: number;
    validar_imovel: Boolean,
    validar_vendedor: Boolean,
};

export default function CardDashboard({ progress }: { progress: FormValues }) {
    console.log('progress', progress);

    const IconVendedor: any = <SvgIcon component={VendedorIcon} inheritViewBox />

    const returnStatus = (type: 'imovel' | 'vendedores' | 'compradores' | 'recibo' | 'comissao') => {
        if (progress?.[type] === 100) return 'CONCLUÍDO'
        if (progress?.[type] > 1) return 'FAZENDO'
        if (progress?.[type] === 0) return 'PENDENTE'
    };
    
    let liberarRecibo:boolean = true;

    async function controleRecibo (){

        if(progress?.validar_imovel && progress?.validar_vendedor /*&& progress?.compradores === 0*/
            || progress?.imovel === 100 && progress?.vendedores === 100 /*&& progress?.compradores === 100*/
        ){
            liberarRecibo = false;
        }
        else{
            liberarRecibo = true;
        }

        // if(/*progress?.imovel === 100 && progress?.vendedores === 100 && progress?.compradores === 0*/
        // || progress?.imovel === 100 && progress?.vendedores === 100 && progress?.compradores === 100 ){
        //     liberarRecibo = false;
        // }
        // else{
        //     liberarRecibo = true;
        // }

    }
    controleRecibo()

    const arrCards = [
        { label: "Imóvel", subTitle: "", icon: progress?.imovel === 100 ? CheckIcon : HomeModernIcon, badgeLabel: returnStatus('imovel'), progress: progress?.imovel ?? 0, disable: false, url: 'imovel' },
        { label: "Vendedores", subTitle: "", icon: progress?.vendedores === 100 ? CheckIcon : UserGroupIcon, badgeLabel: returnStatus('vendedores'), progress: progress?.vendedores ?? 0, disable: false, url: 'vendedor' },
        { label: "Compradores", subTitle: "", icon: progress?.compradores === 100 ? CheckIcon : UserGroupIcon, badgeLabel: returnStatus('compradores'), progress: progress?.compradores ?? 0, disable: false, url: 'comprador' },
        { label: "Comissão", icon: progress?.comissao === 100 ? CheckIcon : HomeModernIcon, badgeLabel: returnStatus('comissao'), progress: progress?.comissao ?? 0, disable: false, url: 'comissao' },
        { label: "Recibo de Sinal", subTitle: "revisão do rascunho".toUpperCase(), icon: progress?.recibo === 100 ? CheckIcon : DocumentTextIcon, badgeLabel: returnStatus('recibo'), progress: progress?.recibo ?? 0, disable: liberarRecibo, url: 'recibo' },
    ];

    return (
        <section className='card-container'>
            {arrCards.map((card, index) => (
                <div key={index} className='card-item'>
                    <Card options={card} />
                </div>
            ))}
        </section>
    )
}