import React from 'react'
import { Chip } from '@mui/material'
import { Visualizar } from '@/interfaces/PosVenda/AlterarStatus';

interface IDialog {
    cardSelect: Visualizar
}

export default function ITBI({cardSelect}: IDialog) {
    return (
        <>
            <div className="info">
                <div className="title">Comprador responsável</div>
                <div className="content">
                    {cardSelect?.responsaveis_venda?.[0]?.nome_comprador}
                </div>
            </div>
        </>
        
    )
}
