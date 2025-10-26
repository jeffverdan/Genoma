import React, {useEffect, useState} from 'react'
import { Paper, Skeleton, Chip } from "@mui/material"
import Perfil from '@/interfaces/Perfil'
import { useRouter } from 'next/router'
interface Props {
    dataPerfil: Perfil,
    loading: Boolean,
    setLoading: (e: Boolean) => void
}

export default function CardPerfil({dataPerfil, loading, setLoading} : Props) {

    const [dadosPerfisUsuario, setDadosPerfisUsuario] = useState([]);
    const [perfis, setPerfis] = useState([]);
    const [lojas, setLojas] = useState([]);
    const skeletonText = <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />;
    const router = useRouter();

    useEffect(() => {
        const returnStorage = async () => {
            let perfisUsuario: any;
            let arrayperfisUsuario: any;

            if(localStorage.getItem('perfis_usuario') !== null){
                perfisUsuario = localStorage.getItem('perfis_usuario');
                arrayperfisUsuario = JSON.parse(perfisUsuario);
            }
            else{
                router.push('/')
            }

            setDadosPerfisUsuario(arrayperfisUsuario);
            // console.log(arrayperfisUsuario);

            const returnLojas = arrayperfisUsuario?.flatMap((item: any) => item.loja).filter((loja: any) => loja !== null).filter((loja: any, index: number, self: any[]) => self.findIndex((l) => l.nome === loja.nome) === index).map((loja: any, index: number) => (
                <Chip className="chip green" key={index} label={loja.nome} />
            ));
            setLojas(returnLojas);

            const returnPerfis = arrayperfisUsuario?.map((data: any, index: number) => <Chip className="chip primary" key={index} label={data.nome} />)
            setPerfis(returnPerfis)
            // const lojas = arrayperfisUsuario.map((data: any) => data.loja);
            
        }
        returnStorage()
    }, [])

    // console.log(dadosPerfisUsuario);

    const returnNameGerente = (name: any) => {
        let nameAbv = name.split(' ')[0];
        if(name.split(' ')[1]) {
            nameAbv = nameAbv + " " + (name.split(' ')[1].length > 2 ? name.split(' ')[1][0]?.toUpperCase() : name.split(' ')[2][0]?.toUpperCase()) + '.';
        }
        return nameAbv;
    };

    function stringAvatar(name: any) {
        name = returnNameGerente(name);
        let iniciais = `${name.split(' ')[0]?.[0]}${name.split(' ')[1]?.[0]}`;
        return iniciais;
    };

    function limitarTexto(nome: any, limite: number) {
        if (nome.length > limite) {
            return nome.slice(0, limite - 3) + '...'; // Subtrai 3 para acomodar as reticências
        }
        return nome; // Retorna o nome original se não ultrapassar o limite
    }

    return (
        <Paper className='card-content card-perfil'>          
            <>
                <div className="header">
                    <div className="avatar">{loading ? <Skeleton variant="circular" width={102} height={102} /> : stringAvatar(dataPerfil?.nome)}</div>
                </div>
                <div className="row">
                    <div className="nome">{loading ? skeletonText : limitarTexto(dataPerfil?.nome, 20)}</div>
                    <div className="perfil">{loading ? skeletonText : perfis}</div>
                    <div className="loja">{loading ? skeletonText : lojas}</div>
                </div>
            </>
        </Paper>
    )
}
