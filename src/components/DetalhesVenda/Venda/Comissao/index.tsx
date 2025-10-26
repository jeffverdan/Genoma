import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import Planilha from './Planilha';
import Mei from './Mei';
import ComissaoTotal from './ComissaoTotal';
import Porcentagens from './Porcentagens';
import Responsaveis from './Responsaveis';
import Observacoes from './Observacoes';

interface Props {
    imovelData: imovelDataInterface
};


const Comissao = ({ imovelData }: Props) => {

    return (
        <div className='detalhes-container'>
            <Planilha imovelData={imovelData} />
            <Mei imovelData={imovelData} />
            <ComissaoTotal imovelData={imovelData} />
            <Porcentagens imovelData={imovelData} />
            <Responsaveis imovelData={imovelData} />
            <Observacoes imovelData={imovelData} />
        </div>
    )
};

export default Comissao;