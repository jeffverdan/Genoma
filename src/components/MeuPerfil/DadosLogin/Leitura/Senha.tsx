
import ButtonComponent from '@/components/ButtonComponent';
import userInterface from '@/interfaces/Users/userData';
import { Chip, Paper, Skeleton } from '@mui/material';
import { HiPencil } from 'react-icons/hi2';
import Perfil from '@/interfaces/Perfil';
import { HiLockClosed } from 'react-icons/hi2';

interface Props {
    dataPerfil: Perfil,
    loading: Boolean,
    setLoading: (e: Boolean) => void
    handleShow?: any
    index?: number
};

const Senha = ({ dataPerfil, loading, setLoading, handleShow, index }: Props) => {

    const skeletonText = <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />;

    return (
        <Paper className='card-content'>
            <div className='detalhes-content'>
                <h2>Dados de login</h2>

                <div className="row">
                    <div className="col">
                        <p>Email</p>
                        <span>
                            {loading ? skeletonText : dataPerfil?.email} <HiLockClosed style={{fill: '#A7B7BE'}} />
                        </span>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <p>Senha</p>
                        <span>
                            {loading ? skeletonText : '********'}
                        </span>
                    </div>
                </div>

                {
                    <div className="btn-edit-detalhe">
                        <ButtonComponent 
                            size={'large'} 
                            variant={'text'} 
                            startIcon={<HiPencil size={20} />}
                            label={'Alterar senha'}
                            onClick={e => handleShow(index, 'editar')}
                        />
                    </div>
                }
            </div>
        </Paper>
    )
}

export default Senha;
