import { Alert, CircularProgress, ListItemIcon, Menu, MenuItem, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { HiInformationCircle, HiMiniInformationCircle, HiPencil, HiTrash } from 'react-icons/hi2';
import ButtonComponent from '@/components/ButtonComponent';
import ArquivarVenda from '@/apis/arquivarVenda';
import SimpleDialog from '@/components/Dialog';
import { FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { InformationCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import ChangeStatusIcon from '@/images/ChangeStatusIcon';
import DialogCancelarParcela from '../[idProcesso]/[idParcela]/status/@componentes/DialogCancelarParcela';
import CornerFinanceiro from '../@Corners';
import { CornerDateType, ParcelaProcessoResponse } from '@/interfaces/Financeiro/Status';
import ParcelaProcessoById from '@/apis/getParcela_Processo';

type Props = {
    parcela_id: number
    processo_id: number
    // returnList: (idArrayVendas?: number, notLoading?: boolean) => Promise<void>
    // tools?: boolean
    startIcon?: JSX.Element
    label: string
    className?: string
    cancelar?: boolean
    retunProcess?: () => void
    setCornerData?: (e: CornerDateType) => void
}

export default function MenuTable(props: Props) {
    const { processo_id, parcela_id, startIcon, label, className, cancelar, retunProcess, setCornerData } = props;
    const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
    const [dialogCancelarParcela, setDialogCancelarParcela] = useState(false);
    const [processData, setProcessData] = useState<ParcelaProcessoResponse>();
    const [loading, setLoading] = useState(false);
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
        if (e) router.push(`/financeiro/${processo_id}/${e}`);
    };

    const handleCloseFeedbackAlert = () => {
        setFeedbackAlert(inicialValueFeedback);
    };

    const handleCancelarParcela = async () => {
        setLoading(true);
        const req = { processo_id: processo_id, parcela_id: parcela_id };
        const res = await ParcelaProcessoById(req);
        if (res) {
            setProcessData(res);
        } else {
            setFeedbackAlert({ loading: false, error: true, msg: 'Não foi possível carregar os dados. Tente novamente.' });
        }
        setLoading(false);
        handleCloseMenu();
        setDialogCancelarParcela(true);
    };

    return (
        <div className={className}>
            <ButtonComponent
                size={'small'}
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
                <MenuItem className='green' onClick={() => router.push(`/financeiro/${processo_id}/${parcela_id}/status`)} disabled={loading} > <ListItemIcon> <ChangeStatusIcon /> </ListItemIcon>  Ver status </MenuItem>
                <MenuItem onClick={() => handleMenu(`detalhes-processo`)} disabled={loading} className='green' ><ListItemIcon> <HiMiniInformationCircle width={20} height={20} /> </ListItemIcon>  Ver detalhes </MenuItem>
                {cancelar && <MenuItem onClick={(e) => handleCancelarParcela()} disabled={loading} className='red' ><ListItemIcon> {loading ? <CircularProgress /> :<TrashIcon width={20} height={20} />} </ListItemIcon>  Cancelar </MenuItem>}
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

            <DialogCancelarParcela
                openDialog={dialogCancelarParcela}
                setOpenDialog={setDialogCancelarParcela}
                processData={processData}
                retunProcess={retunProcess}
            />
        </div>
    )
}