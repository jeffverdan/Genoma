
import ButtonComponent from '@/components/ButtonComponent';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { HiPencil } from 'react-icons/hi2';

interface Props {
    imovelData: imovelDataInterface
    handleShow?: any
    index?: number
};

const Laudemio = ({ imovelData, handleShow, index }: Props) => {
    const perfil = localStorage.getItem('perfil_login');
    return (
        <div className='detalhes-content'>
            <h2>Laudêmio</h2>

            <div className='row'>
                <div className='col 1'>
                    <div>
                        <p>Quantidade</p>
                        <span>{imovelData.laudemios?.length}</span>
                    </div>
                </div>
            </div>

            <div className='row'>
                <div className='col 1'>
                    {imovelData.laudemios?.map((item) => (
                        <div key={item.id}>
                            <p>Tipo</p>
                            <span>{item.nameTipo}</span>
                        </div>
                    ))}

                </div>

                <div className='col 2'>
                    {imovelData.laudemios?.map((item) => (
                        <div key={item.id} className={item.valorName ? '' : 'empty'}>
                            <p>{item.labelTipo === 'Nome' ? `${item.labelTipo} da ${item.nameTipo}` :  item.labelTipo}</p>
                            <span>{item.valorName}</span>
                        </div>
                    ))}

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

export default Laudemio;
