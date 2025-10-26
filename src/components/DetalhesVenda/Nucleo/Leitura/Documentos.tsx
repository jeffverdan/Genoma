
import ShowDocument from '@/apis/getDocument';
import ButtonComponent from '@/components/ButtonComponent';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { Tipos } from '@/interfaces/Users/document';
import { Link } from '@mui/material';
import { HiPencil } from 'react-icons/hi2';

interface Props {
    imovelData: imovelDataInterface
    handleShow?: any
    index?: number
};

const Documentos = ({ imovelData, handleShow, index }: Props) => {
    const perfil = localStorage.getItem('perfil_login');
    return (
        <div className='detalhes-content'>
            <h2>Documentos do imóvel</h2>

            <div className='row'>
                <div className='col'>
                    <div>
                        {!!imovelData.imovel?.documentos[0] && <p>Tipo</p>}
                        {imovelData.imovel?.documentos.map((doc) => (
                            <p className='tipo-doc' key={doc.id}>{doc.tipo_documento_ids.map((item: Tipos) => (
                                (' ' + item.nome_tipo)
                            )).toString()}</p>
                        ))}
                    </div>
                </div>

                <div className='col 2'>
                    <div>
                        {!!imovelData.imovel?.documentos[0] && <p>Nome do arquivo</p>}
                        {imovelData.imovel?.documentos.map((item) => (
                            <div className='link' key={item.id}>
                                <Link key={item.id} className='link' onClick={() => ShowDocument(item.id, 'documento')}>
                                    {item.nome_original}
                                </Link>
                            </div>
                        ))}
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

export default Documentos;
