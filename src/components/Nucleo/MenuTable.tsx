import { Alert, ListItemIcon, Menu, MenuItem, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { HiInformationCircle, HiPencil, HiTrash } from 'react-icons/hi2';
import ButtonComponent from '../ButtonComponent';
import ArquivarVenda from '@/apis/arquivarVenda';
import SimpleDialog from '../Dialog';
import { FaExclamationCircle, FaSpinner, FaPaperPlane } from 'react-icons/fa';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import postAlterarVisualizacaoNucleo from '@/apis/postAlterarVisualizacaoNucleo';
import Image from 'next/image';
import SolicitarServicoIcon from '@/images/solicitar_servico_icon.svg';

type Props = {
    id: number
    // returnList: (idArrayVendas?: number, notLoading?: boolean) => Promise<void>
    // tools?: boolean
    startIcon?: JSX.Element
    label: string
    className?: string
    statusAtual?: number
    relacaoStatus?: number
    servicos?: number
}

export default function MenuTableNucleo(props: Props) {
    const { id, startIcon, label, className, statusAtual, relacaoStatus, servicos } = props;
    const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);    
    const router = useRouter();
    const open = Boolean(anchorMenu);
    const inicialValueFeedback = {
        loading: false,
        error: false,
        msg: '',
    };
    const [feedbackAlert, setFeedbackAlert] = useState(inicialValueFeedback);

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorMenu(null);
    };

    const handleMenu = async (e?: string) => {
        if(statusAtual === 0 && e === 'servicos') {
            if (typeof relacaoStatus === 'number') {
                await postAlterarVisualizacaoNucleo(relacaoStatus);
            }
        }
        if (e === 'servicos') router.push(`/nucleo/${id}/${e}/${servicos}`);
        else router.push(`/nucleo/${id}/${e}`);
    };

    const handleCloseFeedbackAlert = () => {
        setFeedbackAlert(inicialValueFeedback);
    };

    return (
        <div className={className}>
            <ButtonComponent
                size={'medium'}
                variant={'contained'}
                startIcon={startIcon}
                label={label}
                labelColor='white'
                onClick={handleOpenMenu}
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
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
            >
                <p className='menu-title'>OPÇÕES</p>
                <MenuItem onClick={() => handleMenu(`servicos`)} className='' > <ListItemIcon> <Image src={SolicitarServicoIcon} alt="solicitar_servico" /> </ListItemIcon>  Ver serviço </MenuItem>
                <MenuItem onClick={() => handleMenu(`detalhes-venda`)} className='green' ><ListItemIcon> <InformationCircleIcon width={20} height={20} /> </ListItemIcon>  Ver detalhes </MenuItem>
            </Menu>

            <Snackbar
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
            </Snackbar>
        </div>
    )
}