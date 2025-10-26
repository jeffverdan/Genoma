
import ButtonComponent from '@/components/ButtonComponent';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { HiPencil } from 'react-icons/hi2';

interface Props {
    imovelData: imovelDataInterface,
    handleShow?: any
    index?: number
};

const Prazo = ({ imovelData, handleShow, index }: Props) => {
    const perfil = localStorage.getItem('perfil_login');

    return (
        <div className='detalhes-content'>
            <h2>Prazo de Escritura e multa</h2>

            <div className='row'>
                <div className='col 1'>
                    <div>
                        <p>Prazo para Escritura</p>
                        <span>{imovelData.informacao?.prazo || '---'}</span>
                    </div>

                    <div>
                        <p>Valor da multa diária</p>
                        <span>{imovelData.informacao?.valoMulta || '---'}</span>
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

export default Prazo;
