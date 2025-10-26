
import ButtonComponent from '@/components/ButtonComponent';
import userInterface from '@/interfaces/Users/userData';
import { Chip, Paper } from '@mui/material';
import { HiPencil } from 'react-icons/hi2';

// interface Props {
//     pessoaData: userInterface
//     handleShow?: any
//     index?: number
// };

const Pagamento = (/*{ pessoaData, handleShow, index }: Props*/) => {
    return (
        <Paper className='card-content'>
            <div className='detalhes-content'>
                <h2>Dados pessoais</h2>

                <div className="row">
                    <div className="col">
                        <p>Nome completo</p>
                        <span>Fulana da Silva</span>
                    </div>
                </div>

                <div className='row'>
                    <div className="col">
                        <p>CPF</p>
                        <span>123.456.789.10</span>
                    </div>

                    <div className="col">
                        <p>CNPJ</p>
                        <span>123.456.789.10</span>
                    </div>

                    <div className="col">
                        <p>CRECI</p>
                        <span>123.456.789.10</span>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <p>Telefone/Celular</p>
                        <span>(21) 91234-5678</span>
                    </div>
                </div>

                {/* {
                    perfil === 'Pós-venda' && 
                    <div className="btn-edit-detalhe">
                        <ButtonComponent 
                            size={'large'} 
                            variant={'text'} 
                            startIcon={<HiPencil size={20} />}
                            label={'Editar'}
                            onClick={e => handleShow(index, 'editar')}
                        />
                    </div>
                } */}
            </div>
        </Paper>
    )
}

export default Pagamento;
