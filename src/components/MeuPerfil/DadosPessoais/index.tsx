import React, {useState} from 'react';
import DadosPessoaLeitura from '@/components/MeuPerfil/DadosPessoais/Leitura/DadosPessoa';
import EnderecoLeitura from '@/components/MeuPerfil/DadosPessoais/Leitura/Endereco';
import DadosPessoaEditavel from '@/components/MeuPerfil/DadosPessoais/Editavel/DadosPessoa';
import EnderecoEditavel from '@/components/MeuPerfil/DadosPessoais/Editavel/Endereco';
import Perfil from '@/interfaces/Perfil';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import { Collapse } from '@mui/material';
import SkeletonCard from '@/components/MeuPerfil/SkeletonCard';
import Corner from '@/components/Corner';
import postSaveMeuPerfil from '@/apis/postSaveMeuPerfil';

interface IProps{
    dataPerfil: Perfil,
    loading: Boolean,
    setLoading: (e: Boolean) => void
    returnPerfil: () => void
}

export default function DadosPessoais({dataPerfil, loading, setLoading, returnPerfil} : IProps) {
    const [openCorner, setOpenCorner] = useState(false);
    const [open, setOpen] = useState(false);
    const [loadingBlocks, setLoadingBlocks] = useState(false);
    const [blockSave, setBlockSave] = useState<any>([]);
    const [blocks, setBlocks] = useState([
        { name: 'dadposPessoais', status: false, leitura: DadosPessoaLeitura, editar: DadosPessoaEditavel },
        { name: 'endereco', status: false, leitura: EnderecoLeitura, editar: EnderecoEditavel },

    ])

    const handleShow = async (posicao: number, type: string) => {
    
        if(type === 'editar'){

            // Salva os dados do último bloco
            saveBlocks();
            
            console.log(blockSave.bloco)
            if(blockSave?.bloco){
                console.log('TEM BLOCO')
                setOpen(true)
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
            // setLoadingBlocks(true);
            setLoading(true)
            console.log('salvar com: ', blockSave);
            const res = await postSaveMeuPerfil(blockSave) as any;
            // console.log("Res SaveImovel: ", res);
            await returnPerfil();

            setOpenCorner(true)
        }
        
        setBlockSave([]);
        setLoadingBlocks(false);
    };

    return (
        <div className="dados-pessoais-perfil">
            {
                blocks.map((block: any, index: number) => 
                                    
                    loadingBlocks === false ?

                    <><div className='detalhes-container'>
                        <Collapse  orientation="vertical" in={block?.status === false} collapsedSize={0}>
                            <block.leitura 
                                index={index} 
                                handleShow={handleShow} 
                                dataPerfil={dataPerfil} 
                                loading={loading} 
                                setLoading={setLoading} 
                                // refreshData={returnPerfil}    
                                saveBlocks={saveBlocks} 
                            />
                        </Collapse>
                        
                        { block?.status && <Collapse  orientation="vertical" in={block?.status === true} collapsedSize={0}>
                            <div className='detalhes-content'>
                                <block.editar 
                                    index={index} 
                                    handleShow={handleShow} 
                                    setBlockSave={setBlockSave} 
                                    saveBlocks={saveBlocks} 
                                    dataPerfil={dataPerfil} 
                                    loading={loading} 
                                    setLoading={setLoading} 
                                />
                            </div>
                        </Collapse>}                    
                    </div></>

                    :
                    <SkeletonCard key={index} />
                )
            }

            {
                openCorner === true &&
                <Corner 
                    open={openCorner}
                    setOpen={setOpenCorner}
                    vertical="bottom"
                    horizontal="right"
                    direction="up"
                    type={'feedback-meu-perfil'}
                    className='bottom-10'
                    value={'pessoa'}
                />
            }
        </div>
    )
}
