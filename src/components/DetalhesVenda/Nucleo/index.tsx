import React, {useState, useEffect} from 'react';
import Collapse from '@mui/material/Collapse';
import Pedidos from './Pedidos'; 
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import PedidosNucleo from '@/interfaces/Nucleo/pedidos';
import NucleoInterface from '@/interfaces/Nucleo/nucleo'
// import Loading from '../Loading';
// import Snackbar from '@mui/material/Snackbar';
import SaveImovel from '@/apis/postSaveImovel';

interface Props {
    imovelData: imovelDataInterface
    listaDocumentos?: any
    returnData: any
    setOpen?: any
    setTituloCard?: any
    solicitacoes: PedidosNucleo[]
    setSolicitacoes: (e: PedidosNucleo[]) => void
    documentosNucleo?: NucleoInterface
    returnSolicitacoes?: () => void
}

const Nucleo = ({ imovelData, returnData, listaDocumentos, setOpen, setTituloCard, solicitacoes, setSolicitacoes, documentosNucleo, returnSolicitacoes }: Props) => {

    const [blockSave, setBlockSave] = useState<any>([]);
    const [loadingBlocks, setLoadingBlocks] = useState(false);

    const saveBlocks = async () => {             

        if (blockSave.length === 0) {
            // console.log('não salva nada')
            setOpen(false)
        }
        else {
            setLoadingBlocks(true);
            // console.log('salvar com: ', blockSave);
            const res = await SaveImovel(blockSave) as any;
            // console.log("Res SaveImovel: ", res);
        }
        
        await setBlockSave([]);
        await returnData();
        setLoadingBlocks(false);
    };

    return (
        <div>        
            <div className='detalhes-container'>
                <div className='detalhes-content'>
                    <h2>Solicitações de serviços ao Núcleo de Certidões</h2>
                </div>
                
                <Pedidos imovelData={imovelData} solicitacoes={solicitacoes} setSolicitacoes={setSolicitacoes} documentosNucleo={documentosNucleo} returnSolicitacoes={returnSolicitacoes} />     
            </div>
        </div>
    )
}

export default Nucleo;
