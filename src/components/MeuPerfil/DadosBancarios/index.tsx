import React, {useState} from 'react';
import DadosBancarioLeitura from '@/components/MeuPerfil/DadosBancarios/Leitura/DadosBanco';
import DadosBancarioEditavel from '@/components/MeuPerfil/DadosBancarios/Editavel/DadosBanco';
import Perfil from '@/interfaces/Perfil';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import { Collapse } from '@mui/material';
import Corner from '@/components/Corner';
import SkeletonCard from '../SkeletonCard';
import postSaveMeuPerfil from '@/apis/postSaveMeuPerfil';

interface IProps{
    // editar: Boolean,
    // setEditar: (e: Boolean) => void,
    dataPerfil: Perfil,
    loading: Boolean,
    setLoading: (e: Boolean) => void
    listaBancos: any[],
    listaChavesPix: any[],
    returnPerfil: () => void
}

export default function DadosBancarios({ dataPerfil, loading, setLoading, listaBancos, listaChavesPix, returnPerfil} : IProps) {
    const [openCorner, setOpenCorner] = useState(false);
    const [open, setOpen] = useState(false);
    const [loadingBlocks, setLoadingBlocks] = useState(false);
    const [blockSave, setBlockSave] = useState<any>([]);
    const [blocks, setBlocks] = useState([
        { name: 'dadposBancarios', status: false, leitura: DadosBancarioLeitura, editar: DadosBancarioEditavel },
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
                setLoading(true);
                console.log('salvar com: ', blockSave);
                // const res = await SaveImovel(blockSave) as any;
                // console.log("Res SaveImovel: ", res);
                const res = await postSaveMeuPerfil(blockSave) as any;
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
                                refreshData={returnPerfil}    
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
                                    listaBancos={listaBancos} 
                                    listaChavesPix={listaChavesPix} 
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
                    value={'banco'}
                />
            }
        </div>
    )
}
