
import ButtonComponent from '@/components/ButtonComponent';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { HiPencil } from 'react-icons/hi2';

interface Props {
    imovelData: imovelDataInterface
    handleShow?: any
    index?: number
};

const Clausulas = ({ imovelData, handleShow, index }: Props) => {
    const perfil = localStorage.getItem('perfil_login');
    return (
        <div className='detalhes-content'>
            <h2>Cláusulas contratuais</h2>

            <div className='row'>
                <div className='col 1'>
                    <div>
                        <p>Clausula segunda</p>
                        <span>{imovelData.informacao?.excecoes || '---'}</span>
                    </div>

                    <div>
                        <p>Clausula décima</p>
                        <span>{imovelData.informacao?.bens_moveis || '---'}</span>
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

export default Clausulas;
