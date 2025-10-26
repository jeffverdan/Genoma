import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import SvgConfirmDevolucao from '@/images/square.svg';
import Image from 'next/image';
import ButtonComponent from '@/components/ButtonComponent';
import { HiCheck } from 'react-icons/hi';
import { useRouter } from 'next/router';

const styleModal = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '72vw',
    bgcolor: '#FFF',
    boxShadow: 24,
    p: '12px',
    borderRadius: '10px',
    display: 'flex',
    gap: '91px'
};

const styleContainer = {
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'space-around',
    alignItems: 'end',
    marginRight: '47px'
}

const styleTitle = {
    color: '$neutral600',
    fontFamily: 'Lato',
    fontSize: '40px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '42px',
    marginBottom: '24px',
};

const styleSubtitle = {
    color: '$neutral600',
    fontFamily: 'Roboto',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '22px',
};

interface Props {
    openConfirm: boolean,
    setOpenConfirm: (e: boolean) => void
};

export default function ModalConfirm(props: Props) {
    const { openConfirm, setOpenConfirm } = props;
    const router = useRouter();
    const handleOpen = () => setOpenConfirm(true);
    const handleClose = () => setOpenConfirm(false);

    const handleConfirm = () => {
        router.push('/posvenda');
        handleClose();
    };

    return (
        <div>
            <Modal
                open={openConfirm}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleModal}>
                    <Image alt='Pedido de revisão' src={SvgConfirmDevolucao} />
                    <div style={styleContainer}>
                        <div>
                            <Typography sx={styleTitle} variant="h6" component="h2">
                                Você solicitou a revisão da venda.
                            </Typography>
                            <Typography sx={styleSubtitle}>
                                {`O gerente vai realizar os ajustes e quando a venda voltar, ficará `}
                                <p style={{ fontWeight: 700 }}>na aba de Em Andamento.</p>

                                <p style={{ fontWeight: 700, marginTop: '24px' }}>
                                    Agradecemos seu empenho em garantir que as vendas DNA Imóveis sejam de qualidade!
                                </p>
                            </Typography>
                        </div>
                        <ButtonComponent 
                        size={'large'} 
                        variant={'contained'} 
                        label={'Obrigada!'} 
                        endIcon={<HiCheck fill='white' />} 
                        labelColor='white' 
                        onClick={handleConfirm}
                        />
                    </div>
                </Box>
            </Modal>
        </div>
    );
}