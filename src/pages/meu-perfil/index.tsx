import React, {useState, useEffect} from 'react';
import { GetServerSideProps } from 'next';
import { Paper } from "@mui/material";
import getDetalhesPerfil from '@/apis/getDetalhesPerfil';
import CardPerfil from '@/components/MeuPerfil/CardPerfil';
import DadosPessoais from '@/components/MeuPerfil/DadosPessoais';
import DadosBancarios from '@/components/MeuPerfil/DadosBancarios';
import DadosLogin from '@/components/MeuPerfil/DadosLogin';
import Menu from '@/components/MeuPerfil/Menu';
import Perfil from '@/interfaces/Perfil';
import SkeletonCard from '@/components/MeuPerfil/SkeletonCard';
import { useRouter } from 'next/router';
import GetListBancos from '@/apis/getListBancos';
import GetListChavesPix from '@/apis/GetListChavesPix';

interface IBlocks {
    id: number,
    name: string,
    title: string,
}[]

export default function MeusDados(){
    const [selectMenu, setSelectMenu] = useState(0);
    const [editar, setEditar] = useState<Boolean>(false);
    const [blocks, setBlocks] = useState<IBlocks[]>([
        {id: 0, name: 'DadosPessoais', title: 'Dados pessoais'},
        {id: 1, name: 'DadosBancarios', title: 'Dados bancários'},
        // {id: 2, name: 'DadosLogin', title: 'Dados de login'},
    ])
    const [dataPerfil, setDataPerfil] = useState<Perfil>({});
    const [loading, setLoading] = useState<Boolean>(true)
    const [loadingCards, setLoadingCards] = useState<Boolean>(false)
    const [verificaLogin, setVerificaLogin] = useState<Boolean>(false);
    const router = useRouter();
    const [listaBancos, setListaBancos] = useState([]);
    const [listaChavesPix, setListaChavesPix] = useState([]);

    const returnPerfil = async () => {
        let usuarioId: any;
        if(localStorage.getItem('usuario_id') !== null){
            usuarioId = localStorage.getItem('usuario_id');
        }
        
        const data: any = await getDetalhesPerfil(usuarioId);
        // console.log('DATA: ', data)
        
        if(!!data){
            setDataPerfil(data);
            setLoading(false)
        }
        else{
            router.push('/')
        }
    }

    const returListaBancos = async () => {
        const bancos: any = await GetListBancos();
        // bancos.unshift({id: '0', nome: 'Selecione um banco'})
        setListaBancos(bancos);
    }

    const returnListaChavesPix = async () => {
        const chavesPix: any = await GetListChavesPix(); 
        // chavesPix.unshift({id: '0', nome: 'Selecione uma chave'})
        setListaChavesPix(chavesPix);
    }

    useEffect(() => {
        setLoading(true);
        returnPerfil()
        returListaBancos()
        returnListaChavesPix()
    }, [])

    return (
        <div className="dashboard-meus-dados">
            <div className="side-bar">
                <CardPerfil 
                    dataPerfil={dataPerfil}  
                    loading={loading}
                    setLoading={setLoading}
                />

                <Paper className='card-content'>
                    <Menu 
                        setSelectMenu={setSelectMenu} 
                        setBlocks={setBlocks} 
                        loading={loadingCards} 
                        setLoading={setLoadingCards} 
                    />
                </Paper>
            </div>

            <div className="content">
                {
                    loadingCards
                    ?
                    <SkeletonCard />
                    :
                    <>
                        {selectMenu === 0 && <DadosPessoais loading={loading} setLoading={setLoading} dataPerfil={dataPerfil} returnPerfil={returnPerfil} />}
                        {selectMenu === 1 && <DadosBancarios loading={loading} setLoading={setLoading} dataPerfil={dataPerfil} listaBancos={listaBancos} listaChavesPix={listaChavesPix} returnPerfil={returnPerfil} />}
                        {selectMenu === 2 && <DadosLogin loading={loading} setLoading={setLoading} dataPerfil={dataPerfil} returnPerfil={returnPerfil} />}
                    </>
                }
            </div>
        </div>
    )
}

// // EXECUTA ANTES DO DASHBOARD
// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const { usuarioId } = context.params as { usuarioId: string };
//     return { props: { usuarioId } };
// };