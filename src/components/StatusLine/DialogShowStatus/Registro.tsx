import React, {useState, useEffect} from 'react'
import { Chip } from '@mui/material'
import { Visualizar } from '@/interfaces/PosVenda/AlterarStatus';

interface IDialog {
    cardSelect: Visualizar
}

export default function Registro({cardSelect}: IDialog) {
    const [tipoRgi, setTipoRgi] = useState<string>('');

    useEffect(() => {
        const returnTipoRgi = async () => {
            const tipo: any = cardSelect?.registro?.tipo_rgi_id;
            console.log(tipo);
    
            switch (tipo) {
                case 1:
                    setTipoRgi('2º'); 
                    break;
    
                case 2:
                    setTipoRgi('3º'); 
                    break;
    
                case 3:
                    setTipoRgi('5º'); 
                    break;
    
                case 4:
                    setTipoRgi('9º'); 
                    break;
    
                case 5:
                    setTipoRgi('11º'); 
                    break;
            
                default:
                    break;
            }
        }
        returnTipoRgi();
    }, [])

    return (
        <>
            <div className="info">
                <div className="title">Acompanhamento</div>
                <div className="content">
                    {
                        cardSelect?.registro?.check_registro === 1 &&
                        'O comprador fará o registro pela empresa (DNA Imóveis).'
                    }
                </div>
                <div className="content">
                    Tipo de RGI - {tipoRgi}          
                </div>
                <div className="content">
                    Número de protocolo - {cardSelect?.registro?.protocolo_rgi}          
                </div>
            </div>
        </>
        
    )
}
