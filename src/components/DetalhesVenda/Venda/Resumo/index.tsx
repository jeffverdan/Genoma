import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import ResumoProcesso from './ResumoProcesso';
import Observacoes from './Observacoes';

interface Props {
    imovelData: imovelDataInterface
};


const Resumo = ({ imovelData }: Props) => {

    return (
        <div className='detalhes-container'>
            <ResumoProcesso imovelData={imovelData} />
            <Observacoes imovelData={imovelData} />
        </div>
    )
};

export default Resumo;