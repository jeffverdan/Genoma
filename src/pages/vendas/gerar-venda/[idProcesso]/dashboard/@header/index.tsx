import React, { useEffect, useState } from 'react';
import InputCodImovel from '@/components/Vendas/InputCodImovel';
import Mapa from '@/components/Vendas/Mapa';
import VendasContext from '@/context/VendasContext';
import { MyImovel } from '@/interfaces/Imovel';
import ButtonBack from '@/components/ButtonBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ButtonSalvarSair from '@/components/ButtonSalvarSair';
import Button from '@/components/ButtonComponent';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ImovelProps {
    imovel: {
        bairro?: string
        cidade?: string
        logradouro?: string
        numero?: string
        complemento?: string
        unidade?: string
        type?: 'vendedores' | 'compradores'
    }
}

export default function Header(props: ImovelProps) {
    const imovel = props.imovel || {};
    // const user = props.user || '';
    const [userName, setUserName] = useState('');
    const router = useRouter();
    const urlParam = router.query;
    // console.log(urlParam);
    const user = urlParam.users;
    const url: any = router.route.split('/'); // Usar para url sem parâmetro
    console.log(url);

    useEffect(() => {
        setUserName(localStorage.getItem('nome_usuario') || '');
    },[]);

    const voltar = () => {
        let urlBack: any = '';
        if(url[4] === "dashboard" && url[5] === "[users]" /*|| url[4] === "dashboard"*/ ){
            urlBack = '/vendas/gerar-venda/' + urlParam.idProcesso + '/dashboard';
        }
        else{
            urlBack = '/vendas'
        }
        return urlBack;
    }

    return (
        <div className="header-page">
           {imovel.logradouro &&
            <div className="content">
                <div className="nav">
                    <Button
                        label="Voltar"
                        name="minimal"
                        size="medium"
                        variant="text"
                        id='btn-back'
                        startIcon={<ArrowBackIcon className="icon icon-left" />}
                        onClick={() => url[5] === "recibo" ? router.back() : router.push(voltar())}
                    />

                    {
                        url[4] === "dashboard" && url[5] === "recibo" 
                        ? ''
                        :
                        <ButtonSalvarSair url={'/vendas/'} />
                    }
                </div>

                <div className="info">

                    {imovel.type === 'vendedores' || user === 'vendedores' || user === 'comprador' 
                        ? <h3 className="bold">{userName?.split(' ')[0]}, cadastre quem {user === 'vendedor' ? 'vende' : 'compra'} o imóvel.</h3>
                        : url[5] === 'recibo'
                            ? <h3 className="bold">{userName?.split(' ')[0]}, vamos revisar o Recibo de Sinal?</h3>
                            : <h3 className="bold">Continue seu cadastro selecionando a etapa desejada.</h3>
                        
                    }

                    <div className="address">
                        <div className="row"><LocationOnIcon className="icon-header" id="map-ico" /> <span data-testid="header-state">{imovel.bairro || ""} - {imovel.cidade || ""}</span></div>
                        <div className="row"><span data-testid="header-adress">{(imovel.logradouro || "") + ', ' + (imovel.numero || '') + ' ' + (imovel.unidade && '/ ' + imovel.unidade + ' ' || '') + (imovel.complemento && '/ ' + imovel.complemento || '')}</span></div>
                    </div>
                </div>
            </div>}
        </div>
    )
}