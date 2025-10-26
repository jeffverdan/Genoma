import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import Pessoa from '@/interfaces/Users/userData';
import { Alert, Chip } from '@mui/material';
import ResumoProcesso from './ResumoProcesso';

interface Props {
    imovelData: imovelDataInterface
};


const Observacoes = ({ imovelData }: Props) => {

    return (
            <div className='detalhes-content obs'>
                <h2>Observações gerais sobre a venda</h2>
                <p>{imovelData.informacao?.observacao_pagamento}</p>

                {/*OBSERVAÇÃO FEEDBACK ESCRITURA*/}
                {
                    imovelData.dados_escritura?.motivo_escritura &&
                    <p>{imovelData.dados_escritura?.data_escritura} - {imovelData.dados_escritura?.motivo_escritura}</p>
                }  
            </div>
    )
};

export default Observacoes;