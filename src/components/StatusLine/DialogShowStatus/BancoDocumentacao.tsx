import React from 'react'
import { Chip } from '@mui/material'
import { Visualizar } from '@/interfaces/PosVenda/AlterarStatus';

interface IDialog {
    cardSelect: Visualizar
}

export default function BancoDocumentacao({cardSelect}: IDialog) {
    return (
        <>
            <div className="info">
                <div className="title">Documentos corretos:</div>
                {
                    cardSelect?.banco_documentos?.[0]?.doc_vendedor === 1 &&
                    <div className="content">
                        . Vendedores               
                    </div>
                }

                {
                    cardSelect?.banco_documentos?.[0]?.doc_comprador === 1 &&
                    <div className="content">
                        . Compradores               
                    </div>
                }

                {
                    cardSelect?.banco_documentos?.[0]?.doc_imovel === 1 &&
                    <div className="content">
                        . Imóvel             
                    </div>
                }
                
                {
                    (cardSelect?.banco_documentos?.[0]?.doc_imovel === 0 && 
                        cardSelect?.banco_documentos?.[0]?.doc_comprador === 0 &&
                        cardSelect?.banco_documentos?.[0]?.doc_vendedor === 0
                    ) &&
                    <div className="content">
                        ----               
                    </div>
                }
            </div>
        </>
        
    )
}
