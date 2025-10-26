import { Alert, ListItemIcon, Menu, MenuItem, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { HiInformationCircle, HiPencil, HiTrash } from 'react-icons/hi2';
import ButtonComponent from '../ButtonComponent';
import SimpleDialog from '../Dialog';
import { FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import GetProcesso from '@/apis/getProcesso';
import Axios from 'axios';
import ModalCancelarProcesso from './ModalCancelarProcesso';
import AlterarVisualizacao from '@/apis/postAlterarVisualizacaoProcesso';
import TrocarResponsavel from '../TrocarResponsavel';
import Image from 'next/image';
import AlterarStatusIcon from '@/images/alterar_status_icon.svg';
import PedirRevisaoIcon from '@/images/pedir_revisao_icon.svg';
import SolicitarServicoIcon from '@/images/solicitar_servico_icon.svg';
import TrocarResponsavelIcon from '@/images/trocar_responsavel_icon.svg';
import PostLocalizaProcesso from '@/apis/postLocalizaProcesso';
import getPosVendaResp from '@/apis/getPosVendaResp';

type Props = {    
    responsavelId: number | string
    id: number | string
    tools?: boolean
    startIcon?: JSX.Element
    label: string
    loading: boolean
    setLoading: (e: boolean) => void
    openDialog?: boolean
    setOpenDialog: (newValue: boolean) => void
    setTypeDialog: (newValue: string) => void
    // returnList: (idArrayVendas?: number) => Promise<void>
    returnList?: any
    statusProcesso?: any
    progress_status_progresses_id?: number
    origem?: 'detalhes'
}

interface IResponsaveis {
    id: number,
    label: string
}

export default function MenuOpcoesVenda(props: Props) {
    const { id, responsavelId, startIcon, label, tools, loading, setLoading, openDialog, setOpenDialog, setTypeDialog, returnList, statusProcesso, progress_status_progresses_id, origem } = props;
    const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
    const [openRemover, setOpenRemover] = useState(false);
    const [openTrocarResponsavel, setOpenTrocarResponsavel] = useState(false);
    const router = useRouter();
    const open = Boolean(anchorMenu);
    const inicialValueFeedback = {
        loading: false,
        error: false,
        msg: '',
    };
    const [feedbackAlert, setFeedbackAlert] = useState(inicialValueFeedback);
    const [dataProcesso, setDataProcesso] = useState<any>([]);
    const [listaResponsaveis, setListaResponsaveis] = useState<IResponsaveis[]>([]);
    // console.log(statusProcesso)
    const [perfilLogin, setPerfilLogin] = useState<any>('');

    useEffect(() => {
        if(localStorage.getItem('perfil_login') !== null || localStorage.getItem('perfil_login') !== undefined){
            setPerfilLogin(localStorage.getItem('perfil_login'));
        }
    },[])

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorMenu(null);
    };

    const handleMenu = async (e?: string) => {
        if (e) {
            const userId = Number(localStorage.getItem('usuario_id'));
            (responsavelId === userId && progress_status_progresses_id) && await AlterarVisualizacao(progress_status_progresses_id);
            router.push(`/posvenda${e}`);
        }
    };

    const onCloseRemover = () => {
        setOpenRemover(false);
    };

    const handleCloseFeedbackAlert = () => {
        setFeedbackAlert(inicialValueFeedback);
    };

    const handleDialogCancelar = async () => {
        setOpenRemover(true);
        setAnchorMenu(null);
        const processoId = id.toString();
        const res = await GetProcesso(processoId, router);
        setDataProcesso(res);
    }

    const handleTrocarResponsavel = async () => {        
        setOpenTrocarResponsavel(true);
        setAnchorMenu(null);

        const processoId = id.toString();
        const res: any = await PostLocalizaProcesso(processoId);

        const responsaveis: any = await getPosVendaResp();
        responsaveis.push({id: '0', label: 'Selecione...'})
        const novaListaResponsaveis: any = responsaveis.filter((responsavel: any) => responsavel.id !== res?.responsaveis?.data?.[0]?.id);
        
        setListaResponsaveis(novaListaResponsaveis);
        setDataProcesso(res);
    }

    return (
        <div className=''>
            <ButtonComponent
                size={'small'}
                variant={'contained'}
                startIcon={startIcon}
                label={label}
                onClick={handleOpenMenu}
                labelColor='white'
            />
            <Menu
                id="basic-menu"
                anchorEl={anchorMenu}
                className='dashboard-button-editar'
                open={open}
                onClose={handleCloseMenu}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <p className='menu-title'>OPÇÕES</p>

                {
                    router.route.split('/')[3] !== 'status' &&
                    <MenuItem onClick={() => handleMenu(`/${id}/${statusProcesso === 1 ? 'analise' : 'status'}`)} className='neutral' ><ListItemIcon> <Image src={AlterarStatusIcon} alt="alterar_status" /> </ListItemIcon>  Alterar status </MenuItem>
                }
                
                <MenuItem onClick={() => handleMenu(`/${id}/devolucao`) } className='green' > <ListItemIcon> <Image src={PedirRevisaoIcon} alt="pedir_revisao" /> </ListItemIcon>  Pedir revisão </MenuItem>
                <MenuItem onClick={() => handleMenu(`/${id}/pedidos-servico`)} className='green' > <ListItemIcon> <Image src={SolicitarServicoIcon} alt="solicitar_servico" /> </ListItemIcon>  Solicitar serviço </MenuItem>
                
                {
                    perfilLogin === 'Coordenadora de Pós-Negociação' &&
                    <MenuItem onClick={handleTrocarResponsavel} className='green' > <ListItemIcon> <Image src={TrocarResponsavelIcon} alt="" /> </ListItemIcon>  Trocar responsável </MenuItem>
                }
                
                {origem != 'detalhes' && <MenuItem onClick={() => handleMenu(`/${id}/detalhes-venda`)} className='green' > <ListItemIcon> <HiInformationCircle />  </ListItemIcon> Ver detalhes </MenuItem>}
                <MenuItem onClick={handleDialogCancelar} className='red' > <ListItemIcon> <HiTrash />  </ListItemIcon> Cancelar venda </MenuItem>

                {/* <SimpleDialog
                    open={openRemover}
                    className='modal-remover'
                    onClose={onCloseRemover}
                    title={'Tem certeza que deseja excluir esta venda?'}
                    Footer={<div className='flex gap20'>
                        <ButtonComponent
                            disabled={feedbackAlert.loading}
                            size='medium'
                            variant={'text'}
                            label={'Cancelar'}
                            onClick={onCloseRemover}
                        />
                        <ButtonComponent
                            type='button'
                            disabled={feedbackAlert.loading}
                            size='medium'
                            startIcon={<span className={`${feedbackAlert.loading ? 'loader' : ''}`}></span>}
                            variant={'contained'}
                            label={'Sim, excluir'}
                            onClick={removerVenda}
                            labelColor='white'
                        />
                    </div>}
                >
                    <p>{'Você ainda pode restaurar a venda na aba "Lixeira" em seu painel.'}</p>

                </SimpleDialog> */}
            </Menu>

            {/*Modal Cancelamento*/}
            {
                !!dataProcesso &&
                <ModalCancelarProcesso 
                    // handleDialogCancelar={handleDialogCancelar}
                    setOpenRemover={setOpenRemover}
                    openRemover={openRemover}
                    feedbackAlert={feedbackAlert}
                    dataProcesso={dataProcesso}
                    loading={loading}
                    setLoading={setLoading}
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    setTypeDialog={setTypeDialog}
                    returnList={returnList}
                />
            }

            {
                (!!dataProcesso && !!listaResponsaveis) &&
                <TrocarResponsavel 
                    setOpenTrocarResponsavel={setOpenTrocarResponsavel}
                    openTrocarResponsavel={openTrocarResponsavel}
                    feedbackAlert={feedbackAlert}
                    dataProcesso={dataProcesso}
                    loading={loading}
                    setLoading={setLoading}
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    setTypeDialog={setTypeDialog}
                    returnList={returnList}
                    listaResponsaveis={listaResponsaveis}
                />
            }

            {/* <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={6000}
                open={!!feedbackAlert.msg}
                onClose={handleCloseFeedbackAlert}
            >
                <Alert
                    className='alert green'
                    icon={<FaExclamationCircle size={20} />}
                    onClose={handleCloseFeedbackAlert}
                    severity={feedbackAlert.error ? "error" : "success"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {feedbackAlert.msg}
                </Alert>
            </Snackbar> */}
        </div>
    )
}