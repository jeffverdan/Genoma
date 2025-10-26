import React, { useContext, useEffect, useState } from 'react'
import { GetServerSideProps } from 'next';
import Header from './@header';
import HeadSeo from '@/components/HeadSeo';
import FooterDashboard from './@footerDashboard';
import Cards from './@cardsDashboard';
import NavFooterMobile from '@/components/NavFooterMobile';
import DialogVenda from './@dialog';
import GlobalContext from '@/context/GlobalContext';
import getProcesso from '@/apis/getProcesso';
import CardMessage from './@cardMessage';
import { useRouter } from 'next/router';
import redirect403 from '@/functions/redirect403';


type ImovelData = {
    bairro: string
    cidade: string
    logradouro: string
    numero: string
    complemento: string
    unidade: string
}

// Componente Dashboard
const Dashboard = ({ idProcesso }: { idProcesso: any }) => {    
    const [loading, setLoading] = useState(false);
    const {token, imovelSave} = useContext(GlobalContext);    
    const [imovelData, setImovelData] = useState<ImovelData>();
    const [progress, setProgress] = useState({
        imovel: 0,
        vendedores: 0,
        compradores: 0,
        recibo: 0,
        comissao: 0,
        porcentagem_total_concluida: 0,
        foguete_emails: 0,
        foguete_segunda_clausula: 0,
        foguete_doc_compradores: 0,
        foguete_doc_vendedores: 0,
        validar_imovel: false,
        validar_vendedor: false,
    })
    const [foguetes, setFoguetes] = useState('');
    const router = useRouter();
    const [suspense, setSuspense] = useState<boolean>(true);

    const getImovelData = async () => {
        setLoading(true);
        // TENTA PEGAR IMOVEL DA RESPOSTA DA API 'salvar_dados_midas'
        if(imovelSave) setImovelData(imovelSave)

        //SE NÃO CONSEGUI PUXA DA API 'retorna_processo' USANDO ID PASSADO NO LINK
        else {
            const data = await getProcesso(idProcesso, router) as any;

            // Processo enviado para o Pós nos sequintes status, vai exibir tela de 403
            // 1,2,3,4,5,6,7,21,26
            const statusProcesso = data?.status[0]?.id;
            redirect403(statusProcesso, router, setSuspense, 'gerar-venda');

            if(data) {
                progress.imovel = data?.porcenagem_preenchida_imovel;
                progress.vendedores = data?.porcenagem_preenchida_vendedores;
                progress.compradores = data?.porcenagem_preenchida_compradores;
                progress.recibo = data?.porcenagem_preenchida_rascunho;
                progress.comissao = data?.porcentagem_preenchida_comissao;
                progress.porcentagem_total_concluida = data?.porcentagem_total_concluida;
                progress.foguete_emails = data?.emails_todos_envolvidos;
                progress.foguete_segunda_clausula = data?.clausula_segunda;
                progress.foguete_doc_compradores = data?.todos_documentos_compradores;
                progress.foguete_doc_vendedores = data?.todos_documentos_vendedores;

                progress.validar_imovel = data?.validar_imovel;
                progress.validar_vendedor = data?.validar_vendedor;

                setProgress({...progress})
                setImovelData(data);
                setFoguetes(data?.foguete);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        sessionStorage.removeItem('urlCadastro')
        getImovelData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    console.log(foguetes)
    
    return (
        suspense === false &&
        <>
            <HeadSeo titlePage='Dashboard' description="" />

            <div className="container-page-process">
                <Header imovel={imovelData as ImovelData} />

                <Cards progress={progress} />                
                {
                    loading === false &&
                    <CardMessage progress={progress} />
                }                
            </div>
            
            <FooterDashboard options={progress} idProcesso={idProcesso} foguetes={foguetes} />

            {
                localStorage.getItem('startInfo') === null || localStorage.getItem('startInfo') === 'false' 
                ?
                <DialogVenda open={true} />
                :
                ''
            }
            

            {/*Mobile*/}
            <NavFooterMobile label="Entregar venda" disabled={true} />
        </>
    );
};

// EXECUTA ANTES DO DASHBOARD
export const getServerSideProps: GetServerSideProps = async (context) => {       
    const { idProcesso } = context.params as { idProcesso: string };      
    return { props: { idProcesso } };
};

export default Dashboard;