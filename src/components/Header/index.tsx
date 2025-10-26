"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import logoGenoma from '../../../public/genoma_logo_2.png';
import MenuMobile from '../MenuMobile';
import { useRouter } from 'next/router';
import ButtonComponent from '../ButtonComponent';
import Dialog from '../Dialog'
import DropFileUpload from '../DropFileUpload'
import { HiBell, HiUser } from 'react-icons/hi';
import getStoreApi from '../../apis/getLojas'
import { Avatar, Badge, Divider, ListItemIcon, Menu, MenuItem, Tab, Tabs } from '@mui/material';
import { Logout, PersonAdd, Settings } from '@mui/icons-material';
import FeedBackEscritura from '../FeedBackEscritura';
import getGerenteConfirmarEscritura from '@/apis/getGerenteConfirmarEscritura';
import DialogFeedBackEscritura from '../FeedBackEscritura/DialogFeedBackEscritura';
import getGerentePerguntasEscritura from '@/apis/getGerentePerguntasEscritura';
import InputSelect from '../InputSelect/Index';
import { redirect } from '@/functions/login';
import NotificationsPage, { Notification } from './Notification';
import axiosInterceptorInstance from '@/http/axiosInterceptorInstance';
interface StoresData {
    id: number
    nome: string
}
interface IFeedBackEscrituras {
    name?: string,
    ddi?: string,
    telefone?: string,
    data_escritura?: string,
    hora_escritura?: string,
    logradouro?: string,
    unidade?: string,
    processo_id?: number,
    pg_na_escritura?: number
}

export default function Header() {
    //Controle de componentes globais
    const router = useRouter();
    const [storeId, setStoreId] = useState<number | null>();
    const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorMenu);
    const [anchorNotif, setAnchorNotif] = useState<null | HTMLElement>(null);
    const openNotif = Boolean(anchorNotif);
    const [indexTabs, setIndexTabs] = useState(0);

    const splitRouter = router.asPath.split('/');
    const painelRouter = splitRouter[1];
    const [dialogAvatarEdit, setDialogAvatarEdit] = useState(false);
    const [showListaEscritura, setShowListaEscritura] = useState(false);

    // FeedBackEscritura somente GG e Gerente
    const [openFeedBackEscritura, setOpenFeedBackEscritura] = useState<boolean>(false);
    const [escriturasFeedBack, setEscriturasFeedBack] = useState<IFeedBackEscrituras[]>([]);
    const [loadingFeedBackEscritura, setLoadingFeedBackEscrituras] = useState(false);
    const [processoSelecionado, setProcessoSelecionado] = useState<IFeedBackEscrituras>({});
    const [openDialogFeedBackEscritura, setOpenDialogFeedBackEscritura] = useState<boolean>(false);
    const [perguntasEscritura, setPerguntasEscritura] = useState<[]>([]);
    const [perfisUsuario, setPerfisUsuario] = useState([]);
    const [perfilPrincipal, setPerfilPrincipal] = useState('');
    const [listaLojas, setListaLojas] = useState<StoresData[]>([]);
    const [selectLoja, setSelectLoja] = useState('');

    const handleClickOpen = () => {
        setAnchorMenu(null);
        setDialogAvatarEdit(true);
    };
    const handleClose = () => {
        setDialogAvatarEdit(false);
    };

    let CompMenuMobile: any;

    if (router.asPath === '/vendas/' || router.asPath === '/vendas/cod-imovel/') {
        CompMenuMobile = null;
    }
    else {
        // CompMenuMobile = <MenuMobile />;
    };

    const returnFeedBackGerente = async () => {
        setOpenDialogFeedBackEscritura(false);
        const perfilLogin = localStorage.getItem('perfil_login') || '';
        if ((perfilLogin === 'Gerente' || perfilLogin === 'Gerente Geral') && router.asPath === '/vendas/') {
            const escrituras: any = await getGerenteConfirmarEscritura();
            console.log(escrituras)

            if (escrituras.length > 0 /*&& openDialogFeedBackEscritura === false*/) {
                setOpenFeedBackEscritura(true);
                setLoadingFeedBackEscrituras(true);
                setEscriturasFeedBack(escrituras);

                const perguntas: any = await getGerentePerguntasEscritura();
                setPerguntasEscritura(perguntas);
                setLoadingFeedBackEscrituras(false);

                if (escrituras.length === 1) {
                    setProcessoSelecionado(escrituras[0]);
                    setShowListaEscritura(false);
                }
                else {
                    setShowListaEscritura(true)
                }
            }
        }
    };

    useEffect(() => {
        returnFeedBackGerente();
        setStoreId(Number(localStorage.getItem('loja_id')));
    }, []);

    useEffect(() => {
        const perfis = localStorage.getItem('perfis_usuario');
        const perfil = localStorage.getItem('perfil_login');
        const loja = localStorage.getItem('loja_id');
        const lojasUsuario = localStorage.getItem('lojas_usuario');

        if (lojasUsuario !== null) {
            setListaLojas(JSON.parse(lojasUsuario));
        }

        if (loja !== null) {
            setSelectLoja(loja);
        }

        if (perfis !== null) {
            setPerfisUsuario(JSON.parse(perfis));
        }

        if (perfil !== null) {
            setPerfilPrincipal(perfil);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storeId]);

    const logout = () => {
        const startInfo: any = localStorage.getItem('startInfo') || false;
        localStorage.clear();
        localStorage.setItem('startInfo', startInfo);
        router.push('/');
    };

    const handleClickPerfil = (nome: string, id: number) => {
        localStorage.setItem('perfil_login', nome);
        localStorage.setItem('perfil_login_id', id.toString());

        let perfil_usuario = localStorage.getItem('perfis_usuario') || '';
        let perfil_usuario_selecionado = JSON.parse(perfil_usuario)?.filter((perfil: any) => perfil.id === id);
        let loja = perfil_usuario_selecionado[0]?.loja;
        setListaLojas(loja);

        let loja_id = !!loja[0]?.id ? loja[0].id : '';
        localStorage.setItem('loja_id', loja_id);
        localStorage.setItem('lojas_usuario', JSON.stringify(loja));

        console.log(perfil_usuario_selecionado);

        const res = redirect({ nome: nome })
        console.log("Res redirect: ", res);
        if (res?.path) {
            const url_atual = window.location.href;
            if (res.message === 'redirect') router.replace(res.path)
            else if (url_atual.includes(res.path)) router.reload();
            else router.push(res.path);

            const perfil: any = localStorage.getItem('perfil_login');
            setPerfilPrincipal(perfil);
            localStorage.getItem('perfil_login_id');
        }
    };

    const handleSelectLoja = (value: any) => {
        setSelectLoja(value);
        localStorage.setItem('loja_id', value);

        const alterarEmpresa = localStorage.getItem('lojas_usuario') || '';
        const arrEmpresasLojas = alterarEmpresa ? JSON.parse(alterarEmpresa).filter((data: any) => data.id === value) : '';
        const empresaLoja = arrEmpresasLojas.map((data: any) => data.empresa);
        localStorage.setItem('empresa_loja', JSON.stringify(empresaLoja));

        router.reload();
    };

    const handleMeuPerfil = () => {
        const usuarioId = localStorage.getItem('usuario_id');
        console.log(usuarioId)

        router.push('/meu-perfil');
    };

    // FUNÇÕES DE NOTIFICAÇÕES    
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;
    const [currentCount, setCurrentCount] = useState<NodeJS.Timeout>();
    
    const fetchNotifications = async (page: number) => {
        clearTimeout(currentCount);
        setLoading(true);
        setCurrentCount(setTimeout( async() => {
            try {
                const token = localStorage.getItem('token');
                const tipo = indexTabs === 0 ? undefined : 'nao_lidas';
                const result = await axiosInterceptorInstance.post(`notificacoes_sininho`, {
                    tipo,
                    page,
                    "usuario_id": localStorage.getItem('usuario_id'),
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                    onUploadProgress: (progressEvent) => {
                        const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0)) * 100);
                        // setProgressBar([{percent: percentage, status: 'active'}]);
                    },
                })

                const devMode = window.location.href.includes('localhost');
                console.log("DevMode: ", devMode);

                const newNotifications = result?.data?.data?.map((item: any) => ({
                    id: item.id,
                    imageUrl: devMode ? 'https://picsum.photos/seed/' + item.id + '/300/200' : (item.link_imagem_miniatura || item.link_imagem),
                    address: item.endereco,
                    title: item.template?.mensagem || 'Sem mensagem',
                    processo_id: item.processo_id,
                    date: item.data_criacao,
                    date_format: item.data_humana,
                    id_devolucao: item.template.id,
                    read: item.status_visualizacao === 1,
                }));

                if(newNotifications) {
                    setNotifications((prev) => [...prev, ...newNotifications]);
                    setHasMore(notifications.length + newNotifications?.length < result.data?.meta?.total);
                }

            } catch (err) {
                console.error("Erro ao carregar notificações", err);
            } finally {
                setLoading(false);
            }
        }, 200));
    };

    useEffect(() => {
        if(page) fetchNotifications(page);
        else setPage(1);
    }, [page, indexTabs]);

    useEffect(() => {
        const eventSource = new EventSource("/api/notify");

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const idClient = Number(localStorage.getItem('usuario_id'));
            console.log("Nova mensagem SSE recebida: ", data);

            if (data.type === "notification" && idClient === Number(data.usuario_id)) {
                console.log("📩 Nova notificação recebida via SSE");
                setNotifications([]); // limpa ou atualiza
                fetchNotifications(1); // busca na API notificacoes_sininho
            }
        };

        eventSource.onerror = () => {
            console.log("❌ Erro na conexão SSE");
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setPage(1);        
        setNotifications([]);        
        setIndexTabs(newValue);
    };

    return (
        <div className="header">
            <div className="row">
                <div className="coll coll-left">
                    <div className="logo-h">
                        <Image
                            src={logoGenoma}
                            alt="Genoma Imóveis"
                            title="Genoma Imóveis"
                            className='cursorClick'
                            onClick={() => painelRouter === 'meu-perfil' ? router.back() : router.push(`/${painelRouter}/`)}
                        />
                    </div>
                    <div className="line"></div>

                    {(perfilPrincipal === 'Gerente Geral' && listaLojas.length > 1) &&
                        <div className="select-loja">
                            <InputSelect
                                size="small"
                                name="lojas"
                                option={listaLojas}
                                label={''}
                                placeholder={''}
                                required={false}
                                value={selectLoja}
                                inputProps={{ 'aria-label': 'Without label' }}
                                onChange={e => handleSelectLoja(e.target.value)}
                            />
                        </div>
                    }
                </div>

                {!router.asPath.startsWith('/esqueci-senha/') &&
                    <div className="coll coll-right">
                        <div className="desk-nav">
                            <ButtonComponent
                                size="small"
                                variant="text"
                                startIcon={
                                    <Badge
                                        color="error"
                                        className='badge-notif'
                                        variant={unreadCount > 0 ? "dot" : undefined} // se houver notificações não lidas, mostra ponto
                                        badgeContent={unreadCount > 0 ? unreadCount : 0} // opcional: mostra o número
                                        classes={{ dot: unreadCount > 0 ? 'badge-pulse' : '' }}
                                    >
                                        <HiBell />
                                    </Badge>
                                }
                                name=""
                                label="Notificações"
                                onClick={(e) => setAnchorNotif(e.currentTarget)}
                            />
                            <ButtonComponent size={'small'} onClick={(e) => setAnchorMenu(e.currentTarget)} variant={'text'} startIcon={<HiUser size={20} />} name={''} label={'Meu perfil'} />
                        </div>

                        {CompMenuMobile}
                    </div>
                }

                <Menu
                    anchorEl={anchorNotif}
                    id="notif-menu"
                    open={openNotif}
                    onClose={() => setAnchorNotif(null)}
                    // onClick={() => setAnchorNotif(null)}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }
                    }}
                >
                    <NotificationsPage
                        notifications={notifications}
                        setNotifications={setNotifications}
                        loading={loading}
                        hasMore={hasMore}
                        setPage={setPage}
                        indexTabs={indexTabs}
                        setIndexTabs={setIndexTabs}
                        handleTabChange={handleTabChange}
                    />
                </Menu>

                <Menu
                    anchorEl={anchorMenu}
                    id="account-menu"
                    open={open}
                    onClose={() => setAnchorMenu(null)}
                    onClick={() => setAnchorMenu(null)}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                >
                    <MenuItem onClick={handleMeuPerfil}>
                        <Avatar /> Perfil
                    </MenuItem>

                    {perfisUsuario.length > 1 &&
                        <div>
                            <Divider textAlign="left"><span style={{ fontSize: '14px', opacity: '0.38' }}>Acessar como:</span></Divider>
                            {
                                perfisUsuario.map((data: any) =>
                                    <div className="select-paper" key={data.id}>
                                        <MenuItem onClick={e => handleClickPerfil(data.nome, data.id)}>
                                            <div className={data.nome === perfilPrincipal ? "dot" : "dot-n"}></div> <div className="paper-name">{data.nome}</div>
                                        </MenuItem>
                                    </div>
                                )
                            }
                            <Divider style={{ marginBottom: '10px', paddingBottom: '5px' }} />
                        </div>
                    }

                    {/* <MenuItem disabled onClick={handleClickOpen}>
                        <Avatar /> Mudar avatar
                    </MenuItem>
                    <Divider />
                    <MenuItem disabled onClick={() => setAnchorMenu(null)}>
                        <ListItemIcon>
                            <PersonAdd fontSize="small" />
                        </ListItemIcon>
                        Adicionar nova conta
                    </MenuItem>
                    <MenuItem disabled onClick={() => setAnchorMenu(null)}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Configurações
                    </MenuItem> */}
                    <MenuItem onClick={logout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Sair
                    </MenuItem>

                </Menu>

                <Dialog
                    open={dialogAvatarEdit}
                    onClose={handleClose}
                    title='Mudar avatar'
                    Footer={<ButtonComponent size={'small'} variant={'text'} onClick={handleClose} name={''} label={'Fechar'} />}
                >
                    <DropFileUpload uploadURL={'/'} />

                </Dialog>
            </div>

            {(openFeedBackEscritura) &&
                <FeedBackEscritura
                    perguntasEscritura={perguntasEscritura}
                    returnFeedBackGerente={returnFeedBackGerente}
                    openFeedBack={openFeedBackEscritura}
                    setOpenFeedBack={setOpenFeedBackEscritura}
                    escriturasFeedBack={escriturasFeedBack}
                    loading={loadingFeedBackEscritura}
                    setLoading={setLoadingFeedBackEscrituras}
                    processoSelecionado={processoSelecionado}
                    setProcessoSelecionado={setProcessoSelecionado}
                    showListaEscritura={showListaEscritura}
                    setShowListaEscritura={setShowListaEscritura}
                    setOpenDialogFeedBackEscritura={setOpenDialogFeedBackEscritura}
                    setEscriturasFeedBack={setEscriturasFeedBack}
                />
            }

            {openDialogFeedBackEscritura &&
                <DialogFeedBackEscritura
                    open={openDialogFeedBackEscritura}
                    setOpen={setOpenDialogFeedBackEscritura}
                    returnFeedBackGerente={returnFeedBackGerente}
                    escriturasFeedBack={escriturasFeedBack}
                    setOpenFeedBack={setOpenFeedBackEscritura}
                />
            }

        </div>
    )
}