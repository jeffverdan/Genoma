import { useEffect } from "react";
import { useRouter } from 'next/router';
import { GetServerSideProps } from "next";

interface TransferirProps {
    idProcesso: string;
    idParcela: string;
}

const Transferir = (props: TransferirProps) => {
    const { idProcesso, idParcela } = props;

    const router = useRouter();

    useEffect(() => {
        if (!idProcesso || !idParcela) {
            router.replace('/financeiro');
            return;
        } else {
            router.replace(`/financeiro/${idProcesso}/${idParcela}/status`);
        }
    }, []);

    return <div>Nenhum usuario selecionado, redirecionando...</div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso, idParcela } = context.params as { idProcesso: string, idParcela: string };
    return { props: { idProcesso, idParcela } };
};

export default Transferir;