
import ButtonComponent from '@/components/ButtonComponent';
import userInterface from '@/interfaces/Users/userData';
import { Chip, Paper, Skeleton } from '@mui/material';
import { HiPencil } from 'react-icons/hi2';
import Perfil from '@/interfaces/Perfil';

interface Props {
    dataPerfil: Perfil,
    loading: Boolean,
    setLoading: (e: Boolean) => void
    setEditar: (e: Boolean) => void
    handleShow?: any
    index?: number
};

const DadosBanco = ({ dataPerfil, loading, setLoading, setEditar, handleShow, index }: Props) => {

    const skeletonText = <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />;

    return (
        <Paper className='card-content'>
            <div className='detalhes-content'>
                <h2>Informações de pagamento</h2>

                <div className="subtitle">Banco</div>

                <div className="row">
                    <div className="col">
                        <p>Instituição financeira</p>
                        <span>
                            {loading ? skeletonText : dataPerfil?.nome_banco || '---'}
                        </span>
                    </div>

                    <div className="col">
                        <p>Agência</p>
                        <span>
                            {loading ? skeletonText : dataPerfil?.agencia || '---'}
                        </span>
                    </div>

                    <div className="col">
                        <p>Conta</p>
                        <span>
                            {loading ? skeletonText : dataPerfil?.numero_conta || '---'}
                        </span>
                    </div>
                </div>

                <div className="subtitle">PIX</div>

                <div className='row'>
                    <div className="col">
                        <p>Tipo de chave</p>
                        <span>{loading ? skeletonText : dataPerfil?.tipo_chave_pix || '---'}</span>
                    </div>

                    <div className="col">
                        <p>Chave PIX</p>
                        <span>{loading ? skeletonText : dataPerfil?.pix || '---'}</span>
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

export default DadosBanco;
