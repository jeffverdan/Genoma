import React, {useState, useEffect} from 'react';
import Collapse from '@mui/material/Collapse';

import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import Sobre from './Leitura/Sobre';
import Registro from './Leitura/Registro';
import Laudemio from './Leitura/Laudemio';
import Valores from './Leitura/Valores';
import Prazo from './Leitura/Prazo';
import Clausulas from './Leitura/Clausulas';
import Documentos from './Leitura/Documentos';

// Editavel
import SobreEditavel from './Editavel/Sobre';
import RegistroEditavel from './Editavel/Registro';
import LaudemioEditavel from './Editavel/Laudemio';
import ValoresEditavel from './Editavel/Valores';
import PrazoEditavel from './Editavel/Prazo';
import ClausulaEditavel from './Editavel/Clausulas';
import DocumentosEditavel from './Editavel/Documentos';

import Loading from '../Loading';
import Snackbar from '@mui/material/Snackbar';

// import UploadDocumentos from '@/components/UploadDocumentos';
// import { useForm } from 'react-hook-form';

import SaveImovel from '@/apis/postSaveImovel';
import { ListaDocumentosType } from '@/interfaces/Documentos';
// import GetListaDocumentos from '@/apis/getListaDocumentos';

interface Props {
    imovelData: imovelDataInterface;
    listaDocumentos: ListaDocumentosType[];
    returnData: () => Promise<void>;
    setOpen: (e: boolean) => void;
    setTituloCard: (e: string) => void;
}

// interface FormValues {
//     tipoDocumento: string
//   }

const Imovel = ({ imovelData, returnData, listaDocumentos, setOpen, setTituloCard }: Props) => {

    const [blockSave, setBlockSave] = useState<any>([]);
    const [loadingBlocks, setLoadingBlocks] = useState(false);

    const [blocks, setBlocks] = useState([
        { name: 'sobre', status: false, leitura: Sobre, editar: SobreEditavel },
        { name: 'registro', status: false, leitura: Registro, editar: RegistroEditavel },
        { name: 'laudemio', status: false, leitura: Laudemio, editar: LaudemioEditavel },
        { name: 'valores', status: false, leitura: Valores, editar: ValoresEditavel },
        { name: 'prazo', status: false, leitura: Prazo, editar: PrazoEditavel },
        { name: 'clausula', status: false, leitura: Clausulas, editar: ClausulaEditavel },
        { name: 'documentos', status: false, leitura: Documentos, editar: DocumentosEditavel },
    ])

    const handleShow = async (posicao: number, type: string) => {

        if(type === 'editar'){

            // Salva os dados do último bloco
            saveBlocks();
            
            console.log(blockSave.bloco)
            if(blockSave?.bloco){
                console.log('TEM BLOCO')
                setOpen(true)
                
                switch (blockSave.bloco) {
                    case 1:
                        setTituloCard('Sobre o imóvel')
                        break;

                    case 2:
                        setTituloCard('Registro e Escritura')
                        break;
                    
                    case 3:
                        setTituloCard('Laudêmio')
                        break;

                    case 4:
                        setTituloCard('Prazo de Escritura e multa')
                        break;

                    case 5:
                        setTituloCard('Cláusulas contratuais')
                        break;

                    case 6:
                        setTituloCard('Documentos do imóvel')
                        break;
                
                    default:
                        break;
                }
            }
            else{
                setOpen(false);
            }

            // // Salva os dados do último bloco
            // await saveBlocks();

            // Passa o bloco atual para true
            blocks[posicao].status = true;

            // Passa todos os outros para false
            blocks.forEach((bloco: any, index: number) => {
                if(index !== posicao){
                    bloco.status = false
                }
            })
        }
        else{
            // Caso clique no botão Salvar ou Voltar
            blocks[posicao].status = false;

            if(type === 'voltar') setBlockSave([]);
        }
        setBlocks([...blocks])            
    }    

    const saveBlocks = async () => {             

        if (blockSave.length === 0) {
            console.log('não salva nada')
            setOpen(false)
        }
        else {
            setLoadingBlocks(true);
            console.log('salvar com: ', blockSave);
            const res = await SaveImovel(blockSave) as any;
            console.log("Res SaveImovel: ", res);
        }
        
        setBlockSave([]);
        await returnData();
        setLoadingBlocks(false);
    };

    return (
        <div>             
            {
                blocks.map((block: any, index: number) => 
                    
                    loadingBlocks === false ?

                    <><div className='detalhes-container'>
                        <Collapse  orientation="vertical" in={block?.status === false} collapsedSize={0}>
                            <block.leitura imovelData={imovelData} refreshData={returnData}  handleShow={handleShow} index={index} saveBlocks={saveBlocks} />
                        </Collapse>
                        
                        { block?.status && <Collapse  orientation="vertical" in={block?.status === true} collapsedSize={0}>
                            <div className='detalhes-content'>
                                <block.editar data={imovelData} index={index} handleShow={handleShow} setBlockSave={setBlockSave} saveBlocks={saveBlocks} listaDocumentos={listaDocumentos} />
                            </div>
                        </Collapse>}                    
                    </div></>

                    :
                    <Loading key={index} />
                )
            }      
        </div>
    )
}

export default Imovel;
