import React from 'react'
import { Chip } from '@mui/material'
import { Visualizar } from '@/interfaces/PosVenda/AlterarStatus';

interface IDialog {
    cardSelect: Visualizar
}

export default function Escritura({cardSelect}: IDialog) {
    return (
        <>
            <div className="info">
                <div className="title">Agendamento</div>
                <div className="content">
                    Dia - {cardSelect?.escritura?.data_escritura}            
                </div>
                <div className="content">
                    Horário - {cardSelect?.escritura?.hora_escritura}             
                </div>
            </div>

            <div className="info">
                <div className="title">Local</div>
                <div className="content">
                    {!cardSelect?.escritura?.local_escritura ? '----' : cardSelect?.escritura?.local_escritura}              
                </div>
                <div className="content">
                    {!cardSelect?.escritura?.cep ? '----' : cardSelect?.escritura?.cep}<br/>
                    {cardSelect?.escritura?.logradouro}, {cardSelect?.escritura?.numero} {cardSelect?.escritura?.unidade !== '' ? ' - ' + cardSelect?.escritura?.unidade : ''} {cardSelect?.escritura?.complemento !== '' ? ' / ' + cardSelect?.escritura?.complemento : '' }<br/>
                    {cardSelect?.escritura?.cidade} - {cardSelect?.escritura?.uf}, {cardSelect?.escritura?.bairro}<br/>
                </div>
            </div>
        </>
        
    )
}
