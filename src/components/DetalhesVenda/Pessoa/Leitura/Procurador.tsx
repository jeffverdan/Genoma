
import ButtonComponent from '@/components/ButtonComponent';
import userInterface from '@/interfaces/Users/userData';
import { Chip } from '@mui/material';
import { HiPencil } from 'react-icons/hi2';

interface Props {
    pessoaData: userInterface
    handleShow?: any
    index?: number
};

const Procurador = ({ pessoaData, handleShow, index }: Props) => {

    const perfil = localStorage.getItem('perfil_login');

    return (
        <div className='detalhes-content'>
            <h2>Procurador</h2>

            <div className='row'>
                <div className='col'>
                    <div>
                        <p>Nome do procurador(a)</p>
                        <span>{pessoaData.procurador?.nome || '---'}</span>
                    </div>
                </div>

                <div className='col'>
                    <div>
                        <p>Celular do procurador(a)</p>
                        <span>{pessoaData.procurador?.telefone || '---'}</span>
                    </div>
                </div>
            </div>

            {
                (perfil === 'Pós-venda' || perfil === 'Coordenadora de Pós-Negociação') &&
                <div className="btn-edit-detalhe">
                    <ButtonComponent 
                        size={'large'} 
                        variant={'text'} 
                        startIcon={<HiPencil size={20} />}
                        label={'Editar'}
                        onClick={e => handleShow(index, 'editar')}
                    />
                </div>
            }
        </div>
    )
}

export default Procurador;
