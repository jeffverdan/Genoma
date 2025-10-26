import React, {useState, useEffect} from 'react'
import { Chip } from '@mui/material'
import { Visualizar } from '@/interfaces/PosVenda/AlterarStatus';

interface IDialog {
    cardSelect: Visualizar
}

export default function Averbacao({cardSelect}: IDialog) {
    const [qtdAverbacao, setQtdAverbacao] = useState('');

    useEffect(() => {
        const quantidadeAverbacao = async () => {
            if(cardSelect?.averbacao?.length === 1) setQtdAverbacao('1 vendedor')
            else setQtdAverbacao(`${cardSelect?.averbacao?.length} vendedores`);
    
        }
        quantidadeAverbacao();
    }, [])
    
    return (
        <>
            <Chip className='chip default' label={qtdAverbacao} style={{marginBottom: '15px'}} />
            <div className="info">
                {
                    cardSelect?.averbacao?.map((averbacao) => 
                        <>
                            <div className="title">{averbacao?.nome}</div>
                            <div className="content">
                                { averbacao?.tipo_averbacao ? averbacao?.tipo_averbacao?.map((tipo) => tipo.sub_topico).join(', ') : '----' }            
                            </div>
                        </>
                    )
                }
                
            </div>
        </>
        
    )
}
