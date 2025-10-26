
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

const DadosPessoa = ({ dataPerfil, loading, setLoading, handleShow, index }: Props) => {

    const skeletonText = <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />;

    return (
        <Paper className='card-content'>
            <div className='detalhes-content'>
                <h2>Dados pessoais</h2>

                <div className="row">
                    <div className="col">
                        <p>Nome completo</p>
                        <span>
                            {loading ? skeletonText : dataPerfil?.nome}
                        </span>
                    </div>
                </div>

                <div className='row'>
                    <div className="col">
                        <p>CPF</p>
                        <span>{loading ? skeletonText : dataPerfil?.cpf || '---'}</span>
                    </div>

                    <div className="col">
                        <p>CRECI</p>
                        <span>{loading ? skeletonText : dataPerfil?.creci || '---'}</span>
                    </div>

                    <div className="col">
                        <p>Telefone/Celular</p>
                        <span>{loading ? skeletonText : dataPerfil?.telefone || '---'}</span>
                    </div>
                </div>

                <div className="subtitle">Dados de pessoa jurídica</div>

                <div className="row">
                    <div className="col">
                        <p>Razão social</p>
                        <span>{loading ? skeletonText : dataPerfil.nome_empresa || '---'}</span>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <p>CNPJ</p>
                        <span>{loading ? skeletonText : dataPerfil?.cnpj || '---'}</span>
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

export default DadosPessoa;
