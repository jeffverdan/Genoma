import { GetServerSideProps } from 'next';
import DetalhesVenda from '@/components/DetalhesVenda';

const DetalhesVendaGerente = ({ idProcesso }: { idProcesso: any }) => {
    return (
        <>
            <DetalhesVenda 
                idProcesso={idProcesso} 
                imovel
                vendedor
                comprador
                nucleo
                historico
                order={[5,1,3,4,6]}
            />
        </>
    )
};

// EXECUTA ANTES DO DASHBOARD
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso } = context.params as { idProcesso: string };
    return { props: { idProcesso } };
};

export default DetalhesVendaGerente;