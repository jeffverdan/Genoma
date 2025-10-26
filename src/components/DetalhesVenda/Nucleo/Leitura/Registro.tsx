
import ButtonComponent from '@/components/ButtonComponent';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { HiPencil } from 'react-icons/hi2';

interface Props {
    imovelData: imovelDataInterface
    handleShow?: any
    index?: number
};

const Registro = ({ imovelData, handleShow, index }: Props) => {
    const perfil = localStorage.getItem('perfil_login');
    return (
        <div className='detalhes-content'>
            <h2>Registro e Escritura</h2>

            <div className='row'>
                <div className='col 1'>
                    <div>
                        <p>Escritura</p>
                        <span>{imovelData.informacao?.tipo_escritura}</span>
                    </div>

                    <div>
                        <p>Matrícula n°</p>
                        <span>{imovelData.informacao?.matricula}</span>
                    </div>

                    <div>
                        <p>lavrada em</p>
                        <span>{imovelData.informacao?.lavrada || '---'}</span>
                    </div>
                </div>

                <div className='col 2'>
                    <div>
                        <p>Vagas Escrituradas</p>
                        <span>{imovelData.informacao?.vaga || '---'}</span>
                    </div>

                    <div>
                        <p>Inscrição Municipal</p>
                        <span>{imovelData.informacao?.inscricaoMunicipal || '---'}</span>
                    </div>

                    <div>
                        <p>Livro</p>
                        <span>{imovelData.informacao?.livro || '---'}</span>
                    </div>
                </div>

                <div className='col 3'>
                    <div className='empty'></div>

                    <div>
                        <p>RGI</p>
                        <span>{imovelData.informacao?.rgi || '---'}</span>
                    </div>

                    <div>
                        <p>Folha</p>
                        <span>{imovelData.informacao?.folha || '---'}</span>
                    </div>
                </div>

                <div className='col 4'>
                    <div className='empty'></div>

                    <div className='empty'></div>

                    <div>
                        <p>Ato</p>
                        <span>{imovelData.informacao?.ato || '---'}</span>
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

export default Registro;
