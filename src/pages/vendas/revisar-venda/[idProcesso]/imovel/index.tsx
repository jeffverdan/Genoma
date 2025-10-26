import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import HeadSeo from '@/components/HeadSeo';
import ContextBlocks from '@/context/Vendas/ContextSideBar';
import SideMenu from '@/components/SideMenu';
import ButtonComponent from '@/components/ButtonComponent';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import Sobre from '@/components/DetalhesVenda/Imovel/Editavel/Sobre';
import Registro from '@/components/DetalhesVenda/Imovel/Editavel/Registro';
import Laudemio from '@/components/DetalhesVenda/Imovel/Editavel/Laudemio';
import VerticalCards from '@/components/VerticalCards';
import Prazo from '@/components/DetalhesVenda/Imovel/Editavel/Prazo';
import Clausula from '@/components/DetalhesVenda/Imovel/Editavel/Clausulas';
import Valores from '@/components/DetalhesVenda/Imovel/Editavel/Valores';
import GetProcesso from '@/apis/getProcesso';
import SaveImovel from '@/apis/postSaveImovel';
import Documentos from '@/components/DetalhesVenda/Imovel/Editavel/Documentos';
import { HiCheck } from 'react-icons/hi2';
import SimpleDialog from '@/components/Dialog';
import ModalReviewImovel from '../@ReviewImovel';
import ImovelData from '@/interfaces/Imovel/imovelData';
import GetListaDocumentos from '@/apis/getListaDocumentos';
import { ListaDocumentosType } from '@/interfaces/Documentos';

const ReviewImovel = ({ idProcesso }: { idProcesso: any }) => {
    const router = useRouter();
    const [selectItem, setSelectItem] = useState(0);
    const [imovelData, setImovelData] = useState<ImovelData>({});
    const [dataToSave, setDataToSave] = useState<any>([]);
    const [listDocumentImovel, setListDocumentImovel] = useState<ListaDocumentosType[]>([]);
    
    const [loading, setLoading] = useState(false);
    const [blocks, setBlocks] = useState([
        { id: 1, page: Sobre, name: 'Endereço do imóvel', status: '', key: 'Endereço', hidden: false, saved: false },
        { id: 2, page: Registro, name: 'Registro e Escritura', status: '', key: 'Registro e escritura', hidden: false, saved: false },
        { id: 3, page: Laudemio, name: 'Laudêmio', status: '', key: 'Laudêmio', hidden: false, saved: false },
        { id: 4, page: Valores, name: 'Valores', status: '', key: 'Valores', hidden: false, saved: false },
        { id: 5, page: Prazo, name: 'Prazo da escritura e multa', status: '', key: 'Prazo de escritura e/ou Multa', hidden: false, saved: false },
        { id: 6, page: Clausula, name: 'Cláusulas', status: '', key: 'Cláusulas', hidden: false, saved: false },
        { id: 7, page: Documentos, name: 'Documentos do imóvel', status: '', key: 'Documentos', hidden: false, saved: false },
    ]);
    const [correcoesOpen, setCorrecoesOpen] = useState(false);

    const saveBlocks = async () => {
        if (dataToSave.length === 0) {
            console.log('não salva nada')
        }
        else {
            if(dataToSave.bloco === 7 && blocks[6]) {
                blocks[6] = { ...blocks[6], saved: dataToSave.recibo_saved }
            } else {                
                const res = await SaveImovel(dataToSave) as any;
                blocks.forEach((block) => {
                    if(res && block.id === dataToSave.bloco) block.saved = true
                })
            }
        }
        setDataToSave([]);
    };    

    const context = {
        blocks, saveBlocks, selectItem, setSelectItem, idProcesso
    };

    const getImovelData = async () => {
        setLoading(true);

        const data = await GetProcesso(idProcesso, router) as ImovelData;        
        const newBlocks: any = []
        data?.devolucoes?.imovel?.reviewChecks?.forEach((e) => {
            blocks.forEach((block) => {
                if (block.key === e.nome) {
                    newBlocks.push({ ...block, saved: e.saved })
                }
            });
        })
        setBlocks(newBlocks);

        const listDocImovel = await GetListaDocumentos() as unknown as ListaDocumentosType[];        
        setListDocumentImovel(listDocImovel.filter(e => e.tipo === 'imóvel'));

        if (data) {
            setImovelData(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        getImovelData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const salvarSair = () => {
        saveBlocks();
        router.push(`/vendas/revisar-venda/${idProcesso}`)
    };

    return (
        <>
            <HeadSeo titlePage='Revisar Venda' description="" />
            <ContextBlocks.Provider value={context}>
                <div className='review-imovel-vendas'>
                    <div className='side-bar'>
                        <SideMenu
                            context={ContextBlocks}
                            loading={loading}
                            review
                        />
                        <ButtonComponent
                            label="Salvar e sair"
                            name="secondary"
                            size='medium'
                            variant='text'
                            onClick={salvarSair}
                            startIcon={<ArrowLeftOnRectangleIcon className="icon start-icon" />}
                        />
                    </div>

                    <div className='content-container'>

                        <VerticalCards
                            blocks={blocks}
                            dataProcesso={imovelData}
                            saveBlocks={saveBlocks}
                            setSelectItem={setSelectItem}
                            selectItem={selectItem}
                            idProcesso={idProcesso}
                            setDataToSave={setDataToSave}
                            loading={loading}
                            listDocuments={listDocumentImovel}
                        />

                        <footer className='footer review'>
                            {!loading ?
                                <ButtonComponent
                                    size={'medium'}
                                    variant={'text'}
                                    label={`Ver correções (${blocks.length})`}
                                    onClick={() => setCorrecoesOpen(true)}
                                />
                                : <div></div>
                            }

                            <ButtonComponent
                                size='large'
                                variant='contained'
                                label='Concluir correção'
                                endIcon={<HiCheck fill='white' />}
                                labelColor='white'
                                onClick={salvarSair}
                            />
                        </footer>
                    </div>

                    <SimpleDialog
                        open={correcoesOpen}
                        onClose={() => setCorrecoesOpen(false)}
                        className='dialog-review-imovel'
                    >
                        <ModalReviewImovel
                            review={imovelData?.devolucoes?.imovel}
                            modal
                        />

                    </SimpleDialog>
                </div>


            </ContextBlocks.Provider>

        </>
    );
};

// EXECUTA ANTES DO DASHBOARD
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso } = context.params as { idProcesso: string };
    return { props: { idProcesso } };
};

export default ReviewImovel;