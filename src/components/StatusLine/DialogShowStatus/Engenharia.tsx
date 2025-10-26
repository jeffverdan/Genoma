import React from 'react'
import { Chip } from '@mui/material'
import { Visualizar } from '@/interfaces/PosVenda/AlterarStatus';

interface IDialog {
    cardSelect: Visualizar
}

export default function Engenharia({cardSelect}: IDialog) {
    return (
        <>
            <div className="info">
                <div className="title">Instituição financeira responsável</div>
                <div className="content">
                    {cardSelect?.engenharia?.[0]?.nome_banco}               
                </div>
            </div>

            <div className="info">
                <div className="title">Último agendamento</div>
                <div className="content">
                    Dia - {cardSelect?.engenharia?.[0]?.data_engenharia}               
                </div>
                <div className="content">
                    Horário - {cardSelect?.engenharia?.[0]?.hora_engenharia}               
                </div>
            </div>

            <div className="info">
                <div className="title">Laudo de engenharia</div>
                <div className="content">
                    {cardSelect?.engenharia?.[0]?.check_engenharia === 1 ? 'Informado' : 'Não informado'}         
                </div>
            </div>
        </>
        
    )
}
