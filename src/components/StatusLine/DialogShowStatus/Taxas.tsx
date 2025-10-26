import React from 'react'
import { Chip } from '@mui/material'
import { Visualizar } from '@/interfaces/PosVenda/AlterarStatus';

interface IDialog {
    cardSelect: Visualizar
}

export default function Taxas({cardSelect}: IDialog) {
    return (
        <>
            <div className="info">
                <div className="title">Vendedor responsável</div>
                <div className="content">
                    {cardSelect?.responsaveis_venda?.[0]?.nome_vendedor}
                </div>

                <div className="title">Comprador responsável</div>
                <div className="content">
                    {cardSelect?.responsaveis_venda?.[0]?.nome_comprador}                
                </div>
            </div>

            <div className="info">
                <div className="title">Inscrição municipal do imóvel</div>
                <div className="content">
                    {cardSelect?.inscricao_municipal}                
                </div>

                <div className="title">Pendências</div>
                <div className="content">
                    { cardSelect?.pendencias ? cardSelect?.pendencias?.map((tipo) => tipo.name).join(', ') : '----' }                
                </div>
            </div>
        </>
        
    )
}
