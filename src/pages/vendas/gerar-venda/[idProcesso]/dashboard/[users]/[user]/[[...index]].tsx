import React, { useContext, useEffect, useRef, useState } from 'react';
import HeadSeo from '@/components/HeadSeo';
import styles from './Imovel.module.scss'
import SideMenu from '@/components/SideMenu';
//import VendedorContext from '@/context/VendedorContext';
import ContextBlocks from '@/context/Vendas/ContextBlocks';
import Slider from 'react-slick';
import getImovel from '@/apis/getImovel';
import getReturnUserId from '@/apis/getReturnUserId';
import getProcesso from '@/apis/getProcesso';
import Blocks from '@/components/VerticalBlocks'
import BlockDadosPessoais from './@componentes/BlockDadosPessoais';
import BlockAdress from './@componentes/BlockAdress';
import Footer from '@/components/FooterCard';
import SaveUser from '@/apis/postSaveUser';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router'
import BlockProcurador from './@componentes/BlockProcurador';
import BlockFormaContato from './@componentes/BlockFormaContato';
import BlockDocumentos from './@componentes/BlockDocumentos';
import BlockAverbacao from './@componentes/BlockAverbacao';

import GlobalContext from '@/context/GlobalContext';
import BlockDadosEmpresa from './@componentes/BlockDadosEmpresa';
import getUsuariosProcesso from '@/apis/getUsuariosProcesso';
import FocusTrap from '@mui/material/Unstable_TrapFocus';
import GetListaDocumentos from '@/apis/getListaDocumentos';
import redirect403 from '@/functions/redirect403';
import GetReturnUserId from '@/apis/getReturnUserId';

export default function User(props: any) {

    const router = useRouter()
    const routerQuery: any = router.query;
    const { idProcesso, user } = props;
    const indexParam: any = routerQuery.index || ''; // Define idEmpresa ou representante ou idUsuario dependendo da posição que é passado na url
    const users = routerQuery.users; //comprador ou vendedor
    const tipoUser = routerQuery.user // pessoa-fisica ou pessoa-juridica
    const verificaRepresentante: boolean = routerQuery.index ? !!routerQuery.index[1] ? true : false : false;
    let posicaoIdParam = indexParam[1] === 'representante' ? indexParam[2] || '' : indexParam[0] || ''; // Saber o id do usuário pela URL de PF e PJ

    console.log('routerQuery: ', routerQuery)
    console.log('indexParam: ', indexParam);

    //Referencia para controlar estilo de bloco ativo
    const sliderRef = useRef<Slider>(null);
    const [loading, setLoading] = useState(true);
    const [dataProcesso, setDataProcesso] = useState([{}]);
    const [selectItem, setSelectItem] = useState(0);
    const [progress, setProgress] = useState(0) // 0 a 100
    const [lastBlock, setLastBlock] = useState(0) // 0 a 6
    const [concluirForm, setConcluirForm] = useState(true);

    const [blocks, setBlocks] = useState([])
    const [dataSave, setDataSave] = useState([]);
    const [dataUsuario, setDataUsuario] = useState<any>();
    const [statusProcesso, setStatusProcesso] = useState<any>('');

    // Upload Documentos
    const [listaDocumentos, setListaDocumentos] = useState<[]>([]);
    const [loadingDocumentos, setLoadingDocumentos] = useState<boolean>(false);

    const [suspense, setSuspense] = useState<boolean>(true)

    const returnProcesso = async () => {
        const data = await getProcesso(idProcesso, router) as any;
        //console.log('Retorna processo: ' , data);
        setDataProcesso(data);
    };

    const returnUser = async () => {

        // Regras para montar o Side Menu de acordo com os parâmetros e regras da url
        // Comprador somente o primeiro vai exibir o bloco de Origem
        // PJ Comprador e Vendedor não tem bloco de endereço
        let listaUsuarios: any = await getUsuariosProcesso(Number(idProcesso), routerQuery.users);
        console.log(listaUsuarios);

        // troquei o listaUsuarios pelo listaUsuarioIndex
        // const indexUsuario = (listaUsuarios !== '' || listaUsuarios !== undefined) ? '' : listaUsuarios?.length !== 0 ? listaUsuarios?.data[0]?.id : '';
        const indexUsuario = (listaUsuarios.length !== 0 || listaUsuarios !== undefined) ? listaUsuarios?.data[0]?.id : '';

        const quantidade = listaUsuarios?.data?.length; // Quantidade de usuários
        const origem = indexUsuario === parseInt(posicaoIdParam) ? 1 : 0; // Usado em comprador, se for 1 é o comprador com Origem

        // Monta o blocks
        let arrayMenu: any = user === 'pessoa-fisica' && indexParam[1] !== 'representante'
            ? users === 'vendedor' ?
                [
                    { id: 0, page: BlockDadosPessoais, name: 'Dados pessoais', status: '' },
                    { id: 1, page: BlockAdress, name: 'Endereço', status: '' },
                    { id: 2, page: BlockAverbacao, name: 'Averbação', status: '' },
                    { id: 3, page: BlockProcurador, name: 'Procurador', status: '' },
                    { id: 5, page: BlockDocumentos, name: 'Documentos', status: '' },
                ]

                :
                //comprador
                // origemComprador === false ?
                quantidade > 0 && origem === 0 ?
                    [
                        // Comprador sem o bloco de Origem
                        { id: 0, page: BlockDadosPessoais, name: 'Dados pessoais', status: '' },
                        { id: 1, page: BlockAdress, name: 'Endereço', status: '' },
                        // { id: 2, page: BlockProcurador, name: 'Procurador', status: '' },
                        { id: 5, page: BlockDocumentos, name: 'Documentos', status: '' },
                    ]
                    :
                    [
                        // Comprador com o bloco de Origem
                        { id: 0, page: BlockDadosPessoais, name: 'Dados pessoais', status: '' },
                        { id: 1, page: BlockAdress, name: 'Endereço', status: '' },
                        // { id: 2, page: BlockProcurador, name: 'Procurador', status: '' },
                        { id: 4, page: BlockFormaContato, name: 'Origem', status: '' },
                        { id: 5, page: BlockDocumentos, name: 'Documentos', status: '' },
                    ]

            :
            //pessoa-juridica
            indexParam[1] === 'representante'
                ? users === 'vendedor' || users === 'comprador' ?
                    [
                        { id: 0, page: BlockDadosPessoais, name: 'Dados pessoais', status: '' },
                        { id: 1, page: BlockDocumentos, name: 'Documentos', status: '' },
                    ]

                    : ''
                :
                //empresa
                users === 'vendedor' ?
                    [
                        { id: 0, page: BlockDadosEmpresa, name: 'Dados da empresa', status: '' },
                        { id: 1, page: BlockAdress, name: 'Endereço da empresa', status: '' },
                        { id: 5, page: BlockDocumentos, name: 'Documentos', status: '' },
                    ]

                    :
                    // origemComprador === false ?
                    quantidade > 0 && origem === 0 ?
                        [
                            { id: 0, page: BlockDadosEmpresa, name: 'Dados da empresa', status: '' },
                            { id: 1, page: BlockAdress, name: 'Endereço da empresa', status: '' },
                            { id: 5, page: BlockDocumentos, name: 'Documentos', status: '' },
                        ]
                        :
                        [
                            { id: 0, page: BlockDadosEmpresa, name: 'Dados da empresa', status: '' },
                            { id: 1, page: BlockAdress, name: 'Endereço da empresa', status: '' },
                            { id: 4, page: BlockFormaContato, name: 'Origem', status: '' },
                            { id: 5, page: BlockDocumentos, name: 'Documentos', status: '' },
                        ]

        console.log(arrayMenu);
        setBlocks(arrayMenu)
        //setBlocks(blocks)
        console.log(blocks)

        // Usado na API exibir_usuario, para saber se o menu tera Origem para retornar como preenchido
        if (quantidade > 0 && origem !== 0) {
            localStorage.setItem('usuario_origem', '1');
        }
        else {
            localStorage.setItem('usuario_origem', '0');
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        setLoading(false);
        //let processo: any = await getImovel(Number(idProcesso));
        //let processo: any = [];

        //const id: any = !indexParam ? localStorage.getItem('usuario_cadastro_id') : indexParam[0];

        let id: any = '';

        if (routerQuery.user === 'pessoa-juridica') {

            if (indexParam[1] === 'representante') {
                if (indexParam[2]) {
                    id = indexParam[2]
                }
                else {
                    id = localStorage.getItem('usuario_cadastro_id') || '';
                }
            }
            else {
                if (indexParam[0]) {
                    id = indexParam[0]
                }
            }
        }

        else {
            id = indexParam[0] || localStorage.getItem('usuario_cadastro_id');
        }

        //let usuario: any = await getReturnUserId(id, idProcesso, routerQuery);  
        let usuario: any = await getReturnUserId(id, idProcesso, router);
        const processo = await getProcesso(idProcesso, router) as any;

        // Processo enviado para o Pós nos sequintes status, vai exibir tela de 403
        // 1,2,3,4,5,6,7,21,26
        const statusProcesso = processo?.status[0]?.id;
        redirect403(statusProcesso, router, setSuspense)
        setStatusProcesso(statusProcesso);

        if (processo) setDataProcesso(processo);
        //setProgress(processo?.porcenagem_preenchida);
        await setProgress(usuario?.length !== 0 ? usuario?.porcentagem_cadastro_concluida : 0);

        // Retorna o Sidebar com status e navegação
        returnSideBar(usuario, indexUsuario, quantidade, origem);

        console.log(usuario);
        console.log(blocks);
        console.log(arrayMenu);
        console.log(processo);

        setLoading(true);

        // Rafael
        arrayMenu.map((block: any) => (
            block.id <= usuario?.lastBlock ? block.status = 'checked' : ''
        ))
        console.log(blocks)
        setBlocks(arrayMenu);

        // Jeff
        // blocks.map((block) => (
        //     block.id <= processo?.lastBlock ? block.status = 'checked' : ''
        // ))
        //setBlocks([...blocks])
        setDataUsuario(usuario);

        //Pegar a posição do último bloco salvo
        setLastBlock(usuario?.lastBlock)

        // ACIONA AS REGRAS DEFINIDAS DENTRO DA API
        // setSelectItem(processo?.lastBlock);

        // DESATIVA AS REGRAS DEFINIDAS DENTRO DA API
        setSelectItem(0);
    };
    console.log('Retornou o usuário: ', dataUsuario)

    const returnDocs = async () => {
        // RETORNA A LISTA DE DOCUMENTOS
        const documentos: any = await GetListaDocumentos();
        console.log(documentos);
        console.log(tipoUser);

        const tipo = tipoUser === 'pessoa-fisica'
            ? 'fisica'
            : tipoUser === 'pessoa-juridica' && verificaRepresentante === true
                ? 'fisica'
                : 'juridica';

        const documentosUsuario = documentos?.filter((documento: any) => documento?.tipo.includes(tipo));
        console.log(documentosUsuario);
        setListaDocumentos(documentosUsuario);
    }

    useEffect(() => {

        // Usado para exibir ou não o Corner na tela de Compradores e Vendedores
        const pathName = window.location.pathname;
        // const porcentagemConcluida: any = progress;
        sessionStorage.setItem('urlCadastro', pathName);
        // sessionStorage.setItem('porcentagemCadastro', porcentagemConcluida);

        setConcluirForm(true);
        returnProcesso();
        returnDocs();
        returnUser();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveBlocks = async () => {
        console.log('Data Save: ', dataSave);

        if (dataSave.length === 0) {
            console.log('não salva nada')
        }
        else {
            //setLoading(false);
            console.log('salvar com: ', dataSave);
            const res = await SaveUser(dataSave) as any;
            console.log(res);
            if(res?.usuario?.id) setDataUsuario({ 
                ...dataUsuario, 
                ...res.usuario,
                id: res.usuario.id,
                usuario_id_conjuge: res.usuario.usuario_id_conjuge || '',
            });
            if (res) setProgress(res?.usuario?.porcentagem_cadastro_concluida ?? progress);
            console.log("Res SaveUser: ", res);
            console.log('PROGRESS: ' + progress);

        }
        console.log('PROGRESS: ' + progress);

        // Usado para exibir ou não o Corner na tela de Compradores e Vendedores
        // const pathName = window.location.pathname;      
        // const porcentagemConcluida: any = progress;
        // sessionStorage.setItem('urlCadastro', pathName);
        // sessionStorage.setItem('porcentagemCadastro', porcentagemConcluida);

        setDataSave([]);
        setLoadingDocumentos(false);
    };

    // Exibição dos status e navegação dos blocos no Sidebar
    const returnSideBar = async (usuario: any, indexUsuario: any, quantidade: any, origem: any) => {
        //console.log('Usuario: ' , usuario);

        if (usuario) {
            if (user === 'pessoa-fisica' && indexParam[1] !== 'representante') {
                // Vendedor PF
                if (users === 'vendedor') {
                    if (usuario.porcentagem_cadastro_concluida < 60) usuario.lastBlock = 1
                    else if (usuario.porcentagem_cadastro_concluida <= 100) usuario.lastBlock = 3
                }

                // Comprador PF
                else {
                    if (quantidade > 0 && origem === 0) {
                        if (usuario.porcentagem_cadastro_concluida < 60) usuario.lastBlock = 1
                        else if (usuario.porcentagem_cadastro_concluida <= 100) usuario.lastBlock = 3
                    }
                    else {
                        // Primeiro comprador com Origem
                        if (usuario.porcentagem_cadastro_concluida < 50) usuario.lastBlock = 1
                        else if (usuario.porcentagem_cadastro_concluida < 90) usuario.lastBlock = 2
                        else if (usuario.porcentagem_cadastro_concluida <= 100) usuario.lastBlock = 4
                    }
                }
            }

            else {
                // Representantes
                if (indexParam[1] === 'representante') {
                    if (users === 'vendedor' || users === 'comprador') {
                        if (usuario.porcentagem_cadastro_concluida <= 100) usuario.lastBlock = 1
                    }
                }

                // Empresa
                else {
                    if (quantidade > 0 && origem === 0) {
                        if (usuario.porcentagem_cadastro_concluida < 40) usuario.lastBlock = 1
                        else if (usuario.porcentagem_cadastro_concluida <= 100) usuario.lastBlock = 3
                    }

                    // Primeiro comprador sendo Empresa com Origem
                    else {
                        if (usuario.porcentagem_cadastro_concluida < 50) usuario.lastBlock = 1
                        else if (usuario.porcentagem_cadastro_concluida < 80) usuario.lastBlock = 2
                        else if (usuario.porcentagem_cadastro_concluida <= 100) usuario.lastBlock = 4
                    }
                }
            }
        }
    }

    useEffect(() => {
        setTimeout(() => {
            handleScrollTo(selectItem);
        }, 100)
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

    //   async function scrollingArea(block?: Element | null) {
    //       const $div = block ? block : document.getElementsByClassName('slick-active')[selectItem] || '';
    //       console.log(block);
    //       console.log($div);
    //       const container = document.getElementById('carouselContainer') as HTMLElement;
    //       if ($div) {
    //            const scrollArea = $div.scrollHeight + 150;
    //            container.style.height = scrollArea + 'px'
    //       }
    //   };


    const context = {
        loading, setLoading,
        blocks,
        sliderRef,
        dataProcesso, setDataProcesso,
        saveBlocks,
        dataSave, setDataSave,
        selectItem, setSelectItem,
        idProcesso,
        dataUsuario, setDataUsuario,
        progress, setProgress,
        concluirForm, setConcluirForm,
        statusProcesso, setStatusProcesso,

        // Documentos
        listaDocumentos, setListaDocumentos,
        loadingDocumentos, setLoadingDocumentos,
    };

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
                        <FocusTrap open disableAutoFocus={true} disableEnforceFocus>
                            <>
                                <div className={styles.imovelContent}>
                                    {loading && <Blocks context={ContextBlocks} />}
                                </div>
                                <div className={styles.imovelFooter}>
                                    <Footer progress={progress} saveImovel={saveBlocks} idProcesso={idProcesso} />
                                </div>
                            </>
                        </FocusTrap>
                    </div>
                </div>
            </ContextBlocks.Provider>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso } = context.params as { idProcesso: string };
    const { user } = context.params as { user: string };
    return { props: { idProcesso, user } };
};