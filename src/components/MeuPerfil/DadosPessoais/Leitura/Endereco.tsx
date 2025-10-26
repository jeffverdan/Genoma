
import ButtonComponent from '@/components/ButtonComponent';
import userInterface from '@/interfaces/Users/userData';
import { Chip, Paper, Skeleton } from '@mui/material';
import { HiPencil } from 'react-icons/hi2';
import Perfil from '@/interfaces/Perfil';

interface Props {
    dataPerfil: Perfil,
    loading: Boolean,
    setLoading: (e: Boolean) => void
    handleShow?: any
    index?: number
};

const Endereco = ({ dataPerfil, loading, setLoading, handleShow, index }: Props) => {

    const skeletonText = <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />;

    return (
        <Paper className='card-content'>
            <div className='detalhes-content'>
                <h2>Endereço</h2>

                <div className="row">
                    <div className="col">
                        <p>CEP</p>
                        <span>{loading ? skeletonText : dataPerfil?.cep || '---'}</span>
                    </div>

                    <div className="col">
                        <p>Lograduro</p>
                        <span>{loading ? skeletonText : dataPerfil?.logradouro || '---'}</span>
                    </div>
                </div>

                <div className='row'>
                    <div className="col">
                        <p>Número</p>
                        <span>{loading ? skeletonText : dataPerfil?.numero || '---'}</span>
                    </div>

                    <div className="col">
                        <p>Unidade</p>
                        <span>{loading ? skeletonText : dataPerfil?.unidade || '---'}</span>
                    </div>

                    <div className="col">
                        <p>Complemento</p>
                        <span>{loading ? skeletonText : dataPerfil?.complemento || '---'}</span>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <p>Cidade</p>
                        <span>{loading ? skeletonText : dataPerfil?.cidade || '---'}</span>
                    </div>

                    <div className="col">
                        <p>Bairro</p>
                        <span>{loading ? skeletonText : dataPerfil?.bairro || '---'}</span>
                    </div>

                    <div className="col">
                        <p>Estado</p>
                        <span>{loading ? skeletonText : dataPerfil?.estado || '---'}</span>
                    </div>
                </div>
 
                <div className="btn-edit-detalhe">
                    <ButtonComponent 
                        size={'large'} 
                        variant={'text'} 
                        startIcon={<HiPencil size={20} />}
                        label={'Editar'}
                        onClick={e => handleShow(index, 'editar')}
                    />
                </div>
            </div>
        </Paper>
    )
}

export default Endereco;
