import React, {useState, useEffect} from 'react'
import { Chip } from '@mui/material'
import { Visualizar } from '@/interfaces/PosVenda/AlterarStatus';

interface IDialog {
    cardSelect: Visualizar
}

export default function Laudemio({cardSelect}: IDialog) {
    const [qtdLaudemio, setQtdLaudemio] = useState('');

    useEffect(() => {
        const quantidadeAverbacao = async () => {
            if(cardSelect?.laudemio?.length === 1) setQtdLaudemio('1 laudêmio')
            else setQtdLaudemio(`${cardSelect?.laudemio?.length} laudêmios`);
    
        }
        quantidadeAverbacao();
    }, [])

    return (
        <>
            <Chip className='chip default' label={qtdLaudemio} style={{marginBottom: '15px'}} />
            <div className="info">
                <>
                    {
                        cardSelect?.laudemio?.map((laudemio) => <>
                                <div className="content">
                                    {laudemio.nome_tipo_laudemio === 'União'
                                    ? `União, RIP - ${laudemio.nome_lista_laudemio}`
                                    : laudemio.nome_tipo_laudemio === "Familia do imóvel"
                                        ? `Família do imóvel, ${laudemio.nome_lista_laudemio}`
                                        : laudemio.nome_tipo_laudemio === "Prefeitura"
                                            ? laudemio.nome_tipo_laudemio
                                            : `Igreja, ${laudemio.nome_lista_laudemio}`}
                                </div>
                            </>
                        )
                    }
                </>
            </div>
        </>
        
    )
}
