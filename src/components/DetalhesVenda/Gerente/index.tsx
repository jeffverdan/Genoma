import React, {useState, useEffect} from 'react';
import Collapse from '@mui/material/Collapse';

import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import userInterface from '@/interfaces/Users/userData';
import DadosPessoais from './Leitura/DadosPessoa';
import Endereco from './Leitura/Endereco';

// Editavel
// import DadosPessoaisEditavel from './Editavel/DadosPessoa';
// import EnderecoEditavel from './Editavel/Endereco';
import DadosPessoaisEditavel from '../Pessoa/Editavel/DadosPessoa';
import EnderecoEditavel from '../Pessoa/Editavel/Endereco';
import Loading from '../Loading';

// import SaveImovel from '@/apis/postSaveImovel';
// import GetListaDocumentos from '@/apis/getListaDocumentos';

interface Props {
    imovelData: imovelDataInterface
    type: 'gerente'
    // listaDocumentos: any
    returnData: any
}

interface TabsType {
    values?: userInterface[]
    selectTab: number
}

// interface FormValues {
//     tipoDocumento: string
//   }

const Gerente = ({ imovelData, type, returnData }: Props) => {
    const [blockSave, setBlockSave] = useState<any>([]);
    const [loadingBlocks, setLoadingBlocks] = useState(false);   
    const gerente: any = imovelData[type]?.map((gerente: any) => gerente);

    const [blocks, setBlocks] = useState([
        { name: 'dadosPessoais', status: false, leitura: DadosPessoais, editar: DadosPessoaisEditavel },
        { name: 'endereco', status: false, leitura: Endereco, editar: EnderecoEditavel },
    ])

    const handleShow = async (posicao: number, type: string) => {
        if(type === 'editar'){

            // Salva os dados do último bloco
            saveBlocks();

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
        }
        else {
            setLoadingBlocks(true);
            console.log('salvar com: ', blockSave);
            // const res = await SaveImovel(blockSave) as any;
            // console.log("Res SaveImovel: ", res);

        }
        await setBlockSave([]);
        await returnData();
        setLoadingBlocks(false);
    };

    return (
        <div>     
            {
                blocks.map((block: any, index: number) => 
                    loadingBlocks === false ?
                    <>
                        <div className='detalhes-container'>
                            <Collapse  orientation="vertical" in={block?.status === false} collapsedSize={0}>
                                <block.leitura pessoaData={gerente?.[0]} handleShow={handleShow} index={index} />
                            </Collapse>
                            
                            {/* { block?.status && <Collapse  orientation="vertical" in={block?.status === true} collapsedSize={0}>
                                <div className='detalhes-content'>
                                    <block.editar data={gerente[0]} index={index} handleShow={handleShow} setBlockSave={setBlockSave} saveBlocks={saveBlocks} />
                                </div>
                            </Collapse>}                     */}
                        </div>
                    </>
                    :
                    <Loading key={index} />
                )
            }      
        </div>
    )
}

export default Gerente;
