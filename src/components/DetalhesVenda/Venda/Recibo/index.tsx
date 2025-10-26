import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import ReciboAssinado from './ReciboAssinado';
import WaitingDocusign from './WaitingDocusign';

interface Props {
    imovelData: imovelDataInterface,
    returnData: any
};


const Recibo = ({ imovelData, returnData }: Props) => {

    return (
        <div className='detalhes-container'>
            <ReciboAssinado imovelData={imovelData}  returnData={returnData}/>
            {imovelData.uso_docusing === 1 && <WaitingDocusign imovelData={imovelData} />}
        </div>
    )
};

export default Recibo;