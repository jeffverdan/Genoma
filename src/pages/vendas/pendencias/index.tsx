import { useEffect } from "react";
import { useRouter } from 'next/router';
import { GetServerSideProps } from "next";

interface PendenciasProps {
    idProcesso: string;
    idParcela: string;
}

const Pendencias = (props: PendenciasProps) => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/vendas');
    }, []);

    return <div>Nenhum processo selecionado, redirecionando...</div>;
}

export default Pendencias;