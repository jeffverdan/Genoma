import { Alert, ListItemIcon, Menu, MenuItem, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { HiInformationCircle, HiPencil, HiTrash } from 'react-icons/hi2';
import ButtonComponent from '../ButtonComponent';
import ArquivarVenda from '@/apis/arquivarVenda';
import SimpleDialog from '../Dialog';
import { FaExclamationCircle, FaSpinner } from 'react-icons/fa';

type Props = {
    id: number
    returnList: (idArrayVendas?: number, notLoading?: boolean) => Promise<void>
    tools?: boolean
    startIcon?: JSX.Element
    label: string
}

export default function MenuEditar(props: Props) {
    const { id, returnList, startIcon, label, tools } = props;
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

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorMenu(null);
    };

    const handleMenu = async (e?: string) => {
        if (e) router.push(`/vendas${e}`);
    };

    const onCloseRemover = () => {
        setOpenRemover(false);
    };

    const removerVenda = async () => {
        setFeedbackAlert({ ...feedbackAlert, loading: true });
        const res = await ArquivarVenda({ id: id });
        if (res) {            
            setFeedbackAlert({
                loading: false,
                msg: 'A venda foi movida para a lixeira. Acompanhe na aba “Lixeira”.',
                error: false
            });
            
            onCloseRemover();
            setTimeout(() => {
                returnList(3, true);
            }, 500);

        } else {
            setFeedbackAlert({
                loading: false,
                msg: 'ERROR - A venda não foi removida.',
                error: true
            })
        }
    };

    const handleCloseFeedbackAlert = () => {
        setFeedbackAlert(inicialValueFeedback);
    };

    return (
        <div className=''>
            <ButtonComponent
                size={'small'}
                variant={'text'}
                startIcon={startIcon}
                label={label}
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
            >
                <p className='menu-title'>EDITAR DADOS</p>
                <MenuItem onClick={() => handleMenu(`/gerar-venda/${id}/dashboard/imovel`)} className='green' ><ListItemIcon> <HiPencil /> </ListItemIcon>  Imóvel </MenuItem>
                <MenuItem onClick={() => handleMenu(`/gerar-venda/${id}/dashboard/vendedor`)} className='green' > <ListItemIcon> <HiPencil /> </ListItemIcon>  Vendedores </MenuItem>
                <MenuItem onClick={() => handleMenu(`/gerar-venda/${id}/dashboard/comprador`)} className='green' > <ListItemIcon> <HiPencil /> </ListItemIcon>  Compradores </MenuItem>
                <MenuItem onClick={() => handleMenu(`/gerar-venda/${id}/dashboard/comissao`)} className='green' > <ListItemIcon> <HiPencil />  </ListItemIcon> Comissão </MenuItem>
                {tools && <div>
                    <p className='menu-title second'>MAIS OPÇÕES</p>
                    <MenuItem onClick={() => handleMenu(`/entregar-venda/${id}/resumo`)} className='green' > <ListItemIcon> <HiInformationCircle />  </ListItemIcon> Ver resumo </MenuItem>
                    <MenuItem onClick={() => setOpenRemover(true)} className='red' > <ListItemIcon> <HiTrash />  </ListItemIcon> Excluir venda </MenuItem>
                </div>}
                <SimpleDialog
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

                </SimpleDialog>
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