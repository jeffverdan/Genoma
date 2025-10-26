import { useEffect } from "react";
import { useRouter } from 'next/router';
import { GetServerSideProps } from "next";
import SimpleDialog from "@/components/Dialog";
import ConfirmImg from '@/images/concluir-processo-2.png';
import Image from "next/image";
import { DadosProcessType } from "@/interfaces/Financeiro/Status";
import ButtonComponent from "@/components/ButtonComponent";
import { Check } from "@mui/icons-material";

interface PendenciasProps {
    open: boolean;
    setOpen: (e: boolean) => void;
    dadosProcesso?: DadosProcessType;
}

const ModalConfirmacao = (props: PendenciasProps) => {
    const { open, setOpen, dadosProcesso } = props;
    const router = useRouter();

    const returnEndereco = (dadosProcesso: DadosProcessType | undefined): string => {
        if (dadosProcesso === undefined) return '';
        const { logradouro, numero, unidade, complemento, bairro, cidade, uf } = dadosProcesso;
        return `(${logradouro}, ${numero}${unidade ? ' ' + unidade + ',' : ''}${complemento ? ' ' + complemento + ',' : ''} ${bairro}, ${cidade} - ${uf})`;
    }

    return (
        <SimpleDialog
            open={open}
            onClose={() => router.push('/vendas')}
            // title="Confirmação"
            paperWidth="400px"
            paperHeight="200px"
            PaperProps={{ style: { padding: '0px', textAlign: 'center' } }}
        >
            <div className="modal-confirm-pendencias">
                <Image src={ConfirmImg} alt="Confirmação" />
                <div className="content">
                    <div className="title">
                        <h3 className="h3">Cobrança autorizada com sucesso! :)</h3>
                        <p className="p1">A cobrança do imóvel {returnEndereco(dadosProcesso)} foi autorizada e logo mais você poderá receber sua comissão! </p>
                    </div>

                    <ButtonComponent
                        variant="contained"
                        label="Entendi!"
                        color="primary"
                        labelColor="white"
                        onClick={() => router.push('/vendas')}
                        size={"medium"}
                        endIcon={<Check />}
                    />
                </div>
            </div>
        </SimpleDialog>
    );
}

export default ModalConfirmacao;