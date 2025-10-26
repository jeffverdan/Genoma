import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import Pessoa from '@/interfaces/Users/userData';
import { Alert, Chip } from '@mui/material';

interface Props {
    imovelData: imovelDataInterface
};


const Observacoes = ({ imovelData }: Props) => {

    return (
            <div className='detalhes-content'>
                <h2>
                    Observações de comissão
                </h2>

                <div className='sub-container'>
                    <span className='content'>{imovelData.comissao?.observacoes || '---'}</span>
                </div>
                
            </div>
    )
};

export default Observacoes;