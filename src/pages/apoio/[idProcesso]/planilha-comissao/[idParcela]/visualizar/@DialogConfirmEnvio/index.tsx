import ButtonComponent from "@/components/ButtonComponent";
import SimpleDialog from "@/components/Dialog";
import { Check } from "@mui/icons-material";
import { Avatar, CircularProgress } from '@mui/material';
import Image from 'next/image';
import ConfirmEnvioImage from "@/images/confirm_envio.svg";
import { DadosProcessoType } from "@/interfaces/Apoio/planilhas_comissao";

interface PropsType {
    confirmModalOpen: boolean,
    setConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    onConfirm: () => void,
    loadingConfirm: boolean,
    processData: DadosProcessoType | undefined
};

export default function ConfirmModal(props: PropsType) {
    const {
        confirmModalOpen,
        setConfirmModalOpen,
        onConfirm,
        loadingConfirm,
        processData
    } = props;

    return (
        <SimpleDialog
            open={confirmModalOpen}
            onClose={() => setConfirmModalOpen(false)}
            PaperProps={{
                className: 'dialog confirm-envio apoio'
            }}
        >
            <div className='dialog container-confirm-envio'>
                <Image src={ConfirmEnvioImage} alt='confirm' />
                <div className="dialog-content">
                    <div className="info-container">
                        <h3>Tudo certo com a planilha de comissão?</h3>
                        <p>Confirme se todas as informações e valores da planilha estão corretos antes de enviar.</p>
                        <p className="bold">Este é o gerente que receberá a Planilha de Comissão:</p>

                        {processData?.gerente_name && <div className='gerente-container'>
                            <Avatar sx={{ width: 67, height: 67, bgcolor: '' }} alt="Angela Maria" />

                            <div className="gerente-info">
                                <p className="funcao">Gerente</p>
                                <p className="name">{`${processData?.gerente_name}`}</p>
                                <p className="local">{`${processData?.loja_name}`}</p>
                            </div>
                        </div>}
                    </div>
                    <div className="actions-container">
                        <ButtonComponent
                            name='cancelar'
                            onClick={() => setConfirmModalOpen(false)}
                            size={'large'}
                            variant={'text'}
                            label={'Voltar'}
                        />
                        <ButtonComponent
                            name='save_pagamento'
                            onClick={onConfirm}
                            disabled={loadingConfirm}
                            endIcon={loadingConfirm ? <CircularProgress size={20} /> : ''}
                            size={'large'}
                            variant={'contained'}
                            label={'Confirmar e enviar!'}
                            labelColor="white"
                        />

                    </div>

                </div>
            </div>

        </SimpleDialog>
    )
}