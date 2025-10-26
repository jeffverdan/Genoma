import React, { Context, useContext, useEffect, useRef, useState } from 'react';
import HeadSeo from '@/components/HeadSeo';
import styles from './Imovel.module.scss'
import SideMenu from '@/components/SideMenu';
import ContextBlocks from '@/context/Vendas/ContextBlocks';
import Slider from 'react-slick';
import getImovel from '@/apis/getImovel';
import SaveImovel from '@/apis/postSaveImovel';
import Blocks from '@/components/VerticalBlocks'
import BlockCodImovel from './@componentes/BlockCodImovel';
import BlockAdress from './@componentes/BlockAdress';
import BlockEscritura from './@componentes/BlockEscritura';
import BlockClausula from './@componentes/BlockClausula';
import BlockLaudemio from './@componentes/BlockLaudemio';
import BlockFormaPagamento from './@componentes/BlockFormaPagamento';
import BlockPrazoEscritura from './@componentes/BlockPrazoEscritura';
import BlockDocumentos from './@componentes/BlockDocumentos';
import Footer from '@/components/FooterCard';
import GetListaDocumentos from '@/apis/getListaDocumentos';
import { useRouter } from 'next/router';
import redirect403 from '@/functions/redirect403';
import SideBarInterface from '@/interfaces/Vendas/SideBarInterface';

const Imovel = ({ idProcesso }: { idProcesso: any }) => {
    //Referencia para controlar estilo de bloco ativo
    const sliderRef = useRef<Slider>(null);
    const [loading, setLoading] = useState(true);
    const [dataProcesso, setDataProcesso] = useState([{}]);
    const [selectItem, setSelectItem] = useState(0);
    const [progress, setProgress] = useState(0) // 0 a 100
    const [lastBlock, setLastBlock] = useState(0) // 0 a 6
    const [statusProcesso, setStatusProcesso] = useState<any>('');
    const [blocks, setBlocks] = useState([
        { id: 0, page: BlockCodImovel, name: 'Código do imóvel', status: '' },
        { id: 1, page: BlockAdress, name: 'Endereço do imóvel', status: '' },
        { id: 2, page: BlockEscritura, name: 'Registro e Escritura', status: '' },
        { id: 3, page: BlockLaudemio, name: 'Laudêmio', status: '' },
        { id: 4, page: BlockFormaPagamento, name: 'Valores', status: '' },
        { id: 5, page: BlockPrazoEscritura, name: 'Prazo da escritura e multa', status: '' },
        { id: 6, page: BlockClausula, name: 'Cláusulas', status: '' },
        { id: 7, page: BlockDocumentos, name: 'Documentos do imóvel', status: '' },
    ]);

    const [dataSave, setDataSave] = useState([]);

    const router = useRouter();
    const [suspense, setSuspense] = useState<boolean>(true);

    // Upload Documentos
    // const [multiDocs, setMultiDocs] = useState<any>({
    //     'imovel': [{item: [], file: '', id: ''}],
    //     'vendedores': [
    //       [{item: [], file: '', id: ''}]
    //     ],
    //     'compradores': [      
    //       [{item: [], file: '', id: '' }]
    //     ]
    // });

    const [multiDocs, setMultiDocs] = useState<[]>([]);

    const [listaDocumentos, setListaDocumentos] = useState<[]>([]);

    const saveBlocks = async () => {
        console.log(dataSave);
        
        if (dataSave.length === 0) {
            console.log('não salva nada')
        }
        else {
            //setLoading(false);
            console.log('salvar com: ', dataSave);
            const res = await SaveImovel(dataSave) as any;
            if (res) setProgress(res?.porcenagem_preenchida_imovel ?? progress);
            console.log("Res SaveImovel: ", res);

        }
        setDataSave([]);
    };

    const returnImovel = async () => {
        setLoading(false);
        let processo: any = await getImovel(Number(idProcesso), router);

        // Processo enviado para o Pós nos sequintes status, vai exibir tela de 403
        // 1,2,3,4,5,6,7,21,26
        const statusProcesso = processo?.status[0]?.id;
        redirect403(statusProcesso, router, setSuspense)
        setStatusProcesso(statusProcesso);

        if (processo) setDataProcesso(processo);
        console.log(processo);
        setProgress(processo?.porcenagem_preenchida_imovel);
        setLoading(true);
        blocks.map((block) => (
            block.id <= processo?.lastBlock ? block.status = 'checked' : ''
        ))
        setBlocks([...blocks])

        //Pegar a posição do último bloco salvo
        setLastBlock(processo?.lastBlock)

        // ACIONA AS REGRAS DEFINIDAS DENTRO DA API
        // setSelectItem(processo?.lastBlock);

        // DESATIVA AS REGRAS DEFINIDAS DENTRO DA API
        setSelectItem(1);

        // RETORNA A LISTA DE DOCUMENTOS
        const documentos: any = await GetListaDocumentos();
        const documentosImovel = documentos.filter((documento: any) => documento.tipo === 'imovel' || documento.tipo === 'imóvel');
        //console.log(documentosImovel);
        setListaDocumentos(documentosImovel);

        //ajustes para dicas aparecer quando api e chamada, essas dicas aparecem na ABA de Prazo

        //dica de laudemio
        if (processo?.laudemios.some((item: any) => item.tipo_laudemio === "2")) {
            localStorage.setItem('laudemio_tips', 'true');
            console.log("Salvando 'true' em 'laudemio_tips'");
        } else {
            localStorage.setItem('laudemio_tips', 'false');

        }

         //dica de Forma de pagamento
        if (processo?.informacao?.forma_pagamento) {
            const formasPagamento = processo?.informacao?.forma_pagamento;
            if (formasPagamento.includes('2') || formasPagamento.includes('3')) {
                console.log('foi');
                localStorage.setItem('formapgt_tips', 'true');

                if (formasPagamento.includes('2') && formasPagamento.includes('3')) {
                    localStorage.setItem('tipo_pgamento', 'Financiamento com FGTS');
                    console.log('2 e 3');
                } else if (formasPagamento.includes('2')) {
                    localStorage.setItem('tipo_pgamento', 'Financiamento');
                    console.log('2');
                } else if (formasPagamento.includes('3')) {
                    localStorage.setItem('tipo_pgamento', 'FGTS');
                    console.log('3');
                }

            } else {
                localStorage.setItem('formapgt_tips', 'false');
            }
        }else{
            localStorage.setItem('formapgt_tips', 'false');
        }
        
    };

    useEffect(() => {
        setTimeout(() => {
            handleScrollTo(selectItem);
        },100)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectItem])

    async function handleScrollTo(index: number) {
        const $section = document.querySelector(`[data-scroll="${index}"]`);
        console.log('HANDLE SCROLL....', index, $section);

        if (!$section) return;
        $section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const $block = document.querySelector(`[data-index="${index}"]`);
        //scrollingArea($block);
        sliderRef?.current?.slickGoTo(index);
    };

    // async function scrollingArea(block?: Element | null) {
    //     const $div = block ? block : document.getElementsByClassName('slick-active')[selectItem] || '';
    //     const container = document.getElementById('carouselContainer') as HTMLElement;
    //     if ($div) {
    //         const scrollArea = $div.scrollHeight + 150;
    //         container.style.height = scrollArea + 'px'
    //     }
    // };

    const context = {
        loading, setLoading,
        blocks,
        sliderRef,
        dataProcesso, setDataProcesso,
        saveBlocks,
        dataSave, setDataSave,
        selectItem, setSelectItem,
        idProcesso,
        statusProcesso, setStatusProcesso,

        // Documentos
        multiDocs, setMultiDocs,
        listaDocumentos, setListaDocumentos,
        progress, setProgress,
    };
    console.log(loading);
    useEffect(() => {
        returnImovel();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log(listaDocumentos)

    return (
        suspense === false &&
        <>
            <HeadSeo titlePage='Dashboard' description="" />
            <ContextBlocks.Provider value={context}>
                <div className={styles.containerImovel}>
                    <div className="side-bar">
                        <div className={styles.menu}>
                            <SideMenu context={ContextBlocks} hasFooter={true} />
                        </div>
                    </div>

                    <div className='resp'>
                        <div className={styles.imovelContent}>
                            {loading && <Blocks context={ContextBlocks} />}
                        </div>
                        <div className={styles.imovelFooter}>
                            <Footer progress={progress} saveImovel={saveBlocks} idProcesso={idProcesso} />
                        </div>
                    </div>
                </div>
            </ContextBlocks.Provider>
        </>
    );
};

export async function getServerSideProps(context: any) {
    const { idProcesso } = context.params as { idProcesso: string };
    return { props: { idProcesso } };
}

export default Imovel;