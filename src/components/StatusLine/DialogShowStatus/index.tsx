import React from 'react'
import SimpleDialog from '@/components/Dialog';
import { Visualizar } from '@/interfaces/PosVenda/AlterarStatus';
import Averbacao from './Averbacao';
import Taxas from './Taxas';
import Engenharia from './Engenharia';
import BancoDocumentacao from './BancoDocumentacao';
import ITBI from './ITBI';
import Escritura from './Escritura';
import Registro from './Registro';
import Laudemio from './Laudemio';

interface IDialog {
    openModal: boolean,
    setOpenModal: (e: boolean) => void,
    cardSelect: Visualizar
    setCardSelect: (e: Visualizar) => void
}

export default function DialogShowStatus({openModal, setOpenModal, cardSelect, setCardSelect}: IDialog) {

    const handleCloseModal = async () => {
        setCardSelect({});
        setOpenModal(false);
    }

    // console.log('cardSelect: ', cardSelect)

    return (
        <div>
            <SimpleDialog
                open={openModal}
                className='modal-status'
                onClose={handleCloseModal}
                title={
                    <div className="header-m">
                        <div className="title">{cardSelect.nome}</div>
                        <div className="data">Início: {cardSelect.data}</div>
                    </div>
                }
            >
                {/*Data de expiração para Certidões e Taxas*/}
                {
                    (cardSelect.status_id === 4 || cardSelect.status_id === 3) &&
                    <div className="info">
                        <div className="title">Data de vencimento</div>
                        <div className="content">
                            {cardSelect.data_expiracao}               
                        </div>
                    </div>
                }

                {/*Averbação*/}
                { cardSelect.status_id === 21 && <Averbacao cardSelect={cardSelect} /> }

                {/*Taxas*/}
                { cardSelect.status_id === 4 && <Taxas cardSelect={cardSelect} /> }

                {/*Engenharia*/}
                { cardSelect.status_id === 30 && <Engenharia cardSelect={cardSelect} /> }

                {/*Banco e Documentação*/}
                { cardSelect.status_id === 29 && <BancoDocumentacao cardSelect={cardSelect} /> }

                {/*ITBI*/}
                { cardSelect.status_id === 28 && <ITBI cardSelect={cardSelect} /> }

                {/*Escritura*/}
                { cardSelect.status_id === 5 && <Escritura cardSelect={cardSelect} /> }

                {/*Registro*/}
                { cardSelect.status_id === 6 && <Registro cardSelect={cardSelect} /> }

                {/*Laudemio*/}
                { cardSelect.status_id === 33 && <Laudemio cardSelect={cardSelect} /> }

                {/*Observação*/}
                <div className="info">
                    <div className="title">Última observação para o gerente</div>
                    <div className="content">
                        {
                            cardSelect.mensagem 
                            ? `${cardSelect.data} - ${cardSelect.mensagem}`
                            : '----'
                        }
                        
                    </div>
                </div>
            </SimpleDialog>
        </div>
    )
}
