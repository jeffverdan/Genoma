import React, { useState, useEffect } from 'react';
import { Link, Paper, Pagination, TableContainer, AlertTitle, Alert } from '@mui/material';
import { FaExclamationCircle } from 'react-icons/fa';

const CardInfo = () => {
    return (
        <div className="card-info">
            <h2 className="title">
                Devolva a venda para o gerente responsável e solicite as revisões necessárias
            </h2>
            <p className="subtitle">
                Selecione os campos abaixo que precisam ser revisadas para que você possa dar continuidade ao processo.
            </p>

            <Alert
                className='alert info'
                icon={<FaExclamationCircle size={20} />}                
                variant="filled"
                sx={{ width: '100%' }}
            >
                <span className='info-alert'>
                    Assim que o gerente concluir as alterações na venda, ela retorna para a sua aba de processos 
                </span>
                <span className='info-alert bold'>
                    {` Em Andamento.`}
                </span>
            </Alert>

            <p className='rodape'>
                O que está precisando de revisão? Selecione os tópicos que julgar necessário.
            </p>
        </div>
    )
}

export default CardInfo;