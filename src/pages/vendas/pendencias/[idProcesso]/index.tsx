import { useEffect } from "react";
import { useRouter } from 'next/router';
import { GetServerSideProps } from "next";

interface PendenciasProps {
    idProcesso: string;
    idParcela: string;
}

const Pendencias = (props: PendenciasProps) => {
    const { idProcesso } = props;

    const router = useRouter();

    useEffect(() => {
        router.replace('/vendas');
        // if (!idProcesso || !idParcela) {
        //     return;
        // } else {
            
        // }
    }, []);

    return <div>Nenhuma parcela selecionada, redirecionando...</div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso } = context.params as { idProcesso: string };
    return { props: { idProcesso } };
};

export default Pendencias;