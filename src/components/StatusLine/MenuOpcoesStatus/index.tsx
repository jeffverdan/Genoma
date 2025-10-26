import { Alert, ListItemIcon, Menu, MenuItem, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { HiInformationCircle, HiPencil, HiTrash } from 'react-icons/hi2';
import ButtonComponent from '@/components/ButtonComponent';
// mport SimpleDialog from '../Dialog';
// import { FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import GetProcesso from '@/apis/getProcesso';
// import Axios from 'axios';
import ModalCancelarProcesso from '@/components/PosVenda/ModalCancelarProcesso';
import AlterarStatusIcon from '@/images/alterar_status_icon.svg';
import PedirRevisaoIcon from '@/images/pedir_revisao_icon.svg';
import SolicitarServicoIcon from '@/images/solicitar_servico_icon.svg';
import TrocarResponsavelIcon from '@/images/trocar_responsavel_icon.svg';
import Image from 'next/image';
import TrocarResponsavel from '@/components/TrocarResponsavel';
import PostLocalizaProcesso from '@/apis/postLocalizaProcesso';
import getPosVendaResp from '@/apis/getPosVendaResp';

type Props = {
    id: number | string
    tools: boolean
    startIcon: JSX.Element
    label: string
    loading: boolean
    setLoading: (e: boolean) => void
    openDialog: boolean
    setOpenDialog: (newValue: boolean) => void
    setTypeDialog: (newValue: string) => void
    returnList?: any
    // statusProcesso?: any
}

interface IResponsaveis {
    id: number,
    label: string
}

export default function MenuOpcoesStatus(props: Props) {
    const { id, startIcon, label, tools, loading, setLoading, openDialog, setOpenDialog, setTypeDialog, returnList /*statusProcesso*/ } = props;
    const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
    const [openRemover, setOpenRemover] = useState(false);
    const router = useRouter();
    const open = Boolean(anchorMenu);
    const inicialValueFeedback = {
        loading: false,
        error: false,
        msg: '',
    };
    const [feedbackAlert, setFeedbackAlert] = useState(inicialValueFeedback);
    const [dataProcesso, setDataProcesso] = useState<any>([]);
    const [openTrocarResponsavel, setOpenTrocarResponsavel] = useState(false);
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
        if (e) router.push(`/posvenda${e}`);
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
        setOpenDialog(true);
        sessionStorage.setItem('type', 'cancelar-processo');
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
        <div className='menu-opcoes-status'>
            <ButtonComponent
                size={'small'}
                variant={'text'}
                startIcon={startIcon}
                label={label}
                onClick={handleOpenMenu}
                labelColor='#464F53'
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
                {/* <MenuItem onClick={() => handleMenu(`/${id}/${statusProcesso === 1 ? 'analise' : 'status'}`)} className='neutral' ><ListItemIcon> <HiPencil /> </ListItemIcon>  Alterar status </MenuItem>*/}
                {/* <MenuItem onClick={() => handleMenu(`/${id}/devolucao`) } className='green' > <ListItemIcon> <HiPencil /> </ListItemIcon>  Pedir revisão </MenuItem> */}
                <MenuItem onClick={() => handleMenu(`/${id}/pedidos-servico`)} className='green' > <ListItemIcon> <Image src={SolicitarServicoIcon} alt="solicitar_servico" /> </ListItemIcon>  Solicitar serviço </MenuItem>
                {
                    perfilLogin === 'Coordenadora de Pós-Negociação' &&
                    <MenuItem onClick={handleTrocarResponsavel} className='green' > <ListItemIcon> <Image src={TrocarResponsavelIcon} alt="" /> </ListItemIcon>  Trocar responsável </MenuItem>
                }
                <MenuItem onClick={() => handleMenu(`/${id}/detalhes-venda`)} className='green' > <ListItemIcon> <HiInformationCircle />  </ListItemIcon> Ver detalhes </MenuItem>
                <MenuItem onClick={handleDialogCancelar} className='red' > <ListItemIcon> <HiTrash />  </ListItemIcon> Cancelar venda </MenuItem>
            </Menu>

            {/*Modal Cancelamento*/}
            {
                // !!dataProcesso &&
                openDialog &&
                <ModalCancelarProcesso 
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
        </div>
    )
}