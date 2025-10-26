import React, { useContext, useEffect, useRef, useState } from 'react';
import HeadSeo from '@/components/HeadSeo';
import styles from './Imovel.module.scss'
import SideMenu from '@/components/SideMenu';
import ComissaoContext from '@/context/Vendas/ContextBlocks';
import Slider from 'react-slick';
import Blocks from '@/components/VerticalBlocks'
import BlockEmpresa from './@componentes/BlockEmpresa';
import BlockEnvolvidos from './@componentes/BlockEnvolvidosComissao';
import BlockPagamento from './@componentes/BlockPagamento';
import Footer from '@/components/FooterCard';
import GetListaDocumentos from '@/apis/getListaDocumentos';
import GetProcesso from '@/apis/getProcesso';
import SaveComissao from '@/apis/postSaveComissao';
import ImovelData from '@/interfaces/Imovel/imovelData';
import GetListChavesPix from '@/apis/GetListChavesPix';
import getListGerentes from '@/apis/getListGerentes';
import getListOpcionistas from '@/apis/getListOpcionistas';
import GetListBancos from '@/apis/getListBancos';
import { useRouter } from 'next/router';
import redirect403 from '@/functions/redirect403';
import getMidas from '@/apis/getMidas';
import { ReturnApiMidas } from '@/interfaces/Midas';

const Comissao = ({ idProcesso }: { idProcesso: any }) => {
    //Referencia para controlar estilo de bloco ativo
    const sliderRef = useRef<Slider>(null);
    const [loading, setLoading] = useState(true);
    const [dataProcesso, setDataProcesso] = useState<ImovelData>();
    const [selectItem, setSelectItem] = useState(0);
    const [progress, setProgress] = useState(0) // 0 a 100
    const [comissaoId, setComissaoId] = useState<string | undefined>('') // 0 a 100
    const [listBancos, setListBancos] = useState<{ id: string, nome: string }[]>([]);
    const [listGerentes, setListGerentes] = useState<any>([]);
    const [listOpcionistas, setListOpcionistas] = useState<any>([]);
    const [statusProcesso, setStatusProcesso] = useState<any>('');
    // const [lastBlock, setLastBlock] = useState(0) // 0 a 4
    const [blocks, setBlocks] = useState([
        { id: 0, page: BlockEmpresa, name: 'Empresa', status: '' },
        { id: 0, page: BlockPagamento, name: 'Pagamento e Período', status: '' },
        { id: 1, page: BlockEnvolvidos, name: 'Gerentes Gerais', status: '' },
        { id: 2, page: BlockEnvolvidos, name: 'Gerentes', status: '' },
        { id: 3, page: BlockEnvolvidos, name: 'Corretores Vendedores', status: '' },
        { id: 4, page: BlockEnvolvidos, name: 'Corretores Opcionistas', status: '' },
    ]);

    const [dataSave, setDataSave] = useState([]);
    const [listChavesPix, setListChavesPix] = useState<[]>([]);

    const router = useRouter();
    const [suspense, setSuspense] = useState<boolean>(true);

    useEffect(() => {
        returnBancos()
    }, []);

    const returnBancos = async () => {
        const bancos = await GetListBancos();
        setListBancos(bancos || []);
    };

    const saveBlocks = async () => {
        if (dataSave.length === 0) {
            console.log('não salva nada')
        }
        else {
            //setLoading(false);
            console.log('salvar com: ', dataSave);
            const dataPadrao = {
                bloco: blocks[selectItem].id,
                processo_id: dataProcesso?.processo_id,
                comissao_id: dataProcesso?.comissao?.id || comissaoId,
                usuario_id_logado: localStorage.getItem('usuario_id')
            }
            const res = await SaveComissao({ ...dataSave, ...dataPadrao }) as any;
            // if (res) setProgress(res?.porcenagem_preenchida_imovel ?? progress);
            console.log("Res SaveComissao: ", res);
            if (res) {
                setProgress(res.porcenagem_preenchida_comissao);
                setComissaoId(res.comissao_id);
                if (!dataProcesso?.comissao?.id) {
                    const processo = await GetProcesso(idProcesso, router) as unknown as ImovelData;
                    setDataProcesso(processo);
                }
            }

        }
        setDataSave([]);
    };

    const returnProcess = async () => {
        setLoading(false);
        let processo: ImovelData | undefined = await GetProcesso(idProcesso, router) as unknown as ImovelData;
        console.log(processo)

        // Processo enviado para o Pós nos sequintes status, vai exibir tela de 403
        // 1,2,3,4,5,6,7,21,26
        const statusProcesso = processo?.status?.[0]?.id;
        redirect403(statusProcesso, router, setSuspense)

        if (processo) {
            setDataProcesso(processo);
        }

        setProgress(processo?.porcentagem_preenchida_comissao || 0);

        
        blocks.map((block) => (
            block.id <= Number(processo?.comissao?.bloco) ? block.status = 'checked' : ''
        ))

        setBlocks([...blocks])

        //Pegar a posição do último bloco salvo
        // setLastBlock(processo?.lastBlock)

        // ACIONA AS REGRAS DEFINIDAS DENTRO DA API
        // setSelectItem(processo?.lastBlock);

        // DESATIVA AS REGRAS DEFINIDAS DENTRO DA API
        if(!processo?.comissao?.valor_comissao_total) {

        }
        const selectBloco = !processo?.comissao?.valor_comissao_total ? 0 : Number(processo?.comissao?.bloco) || 0;
        setSelectItem(selectBloco);
        setStatusProcesso(statusProcesso);
        setLoading(true);

        // RETORNA A LISTA DE CHAVES PIX
        const chavesPix: any = await GetListChavesPix();
        setListChavesPix(chavesPix);

        setListGerentes(await getListGerentes({}));
        setListOpcionistas(await getListOpcionistas());
    };

    useEffect(() => {
        setTimeout(() => {
            handleScrollTo(selectItem);
        }, 1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectItem])

    async function handleScrollTo(index: number) {
        const $section = document.querySelector(`[data-scroll="${index}"]`);
        if (!$section) return;
        $section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // const $block = document.querySelector(`[data-index="${index}"]`);
        //scrollingArea($block);
        // sliderRef?.current?.slickGoTo(index);
    };

    const context = {
        loading, setLoading,
        blocks,
        sliderRef,
        dataProcesso, setDataProcesso,
        saveBlocks,
        dataSave, setDataSave,
        selectItem, setSelectItem,
        idProcesso,
        listChavesPix,
        progress, setProgress,
        listBancos,
        listGerentes,
        listOpcionistas,
        statusProcesso, setStatusProcesso
    };

    useEffect(() => {
        returnProcess();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        suspense === false &&
        <>
            <HeadSeo titlePage='Dashboard' description="" />
            <ComissaoContext.Provider value={context}>
                <div className={styles.containerImovel}>
                    <div className="side-bar">
                        <div className={styles.menu}>
                            <SideMenu context={ComissaoContext} hasFooter={true} />
                        </div>
                    </div>

                    <div className='resp comissao'>
                        <div className={styles.imovelContent}>
                            {loading && <Blocks context={ComissaoContext} />}
                        </div>
                        <div className={styles.imovelFooter}>
                            <Footer progress={progress} saveImovel={saveBlocks} idProcesso={idProcesso} />
                        </div>
                    </div>
                </div>
            </ComissaoContext.Provider>
        </>
    );
};

export async function getServerSideProps(context: any) {
    const { idProcesso } = context.params as { idProcesso: string };
    return { props: { idProcesso } };
};

export default Comissao;