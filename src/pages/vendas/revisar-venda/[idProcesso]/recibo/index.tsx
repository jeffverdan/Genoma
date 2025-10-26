import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import HeadSeo from '@/components/HeadSeo';
import ContextBlocks from '@/context/Vendas/ContextSideBar';
import SideMenu from '@/components/SideMenu';
import ButtonComponent from '@/components/ButtonComponent';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import VerticalCards from '@/components/VerticalCards';
import GetProcesso from '@/apis/getProcesso';
import { HiCheck } from 'react-icons/hi2';
import SimpleDialog from '@/components/Dialog';
import ModalReviewRecibo from '../@ReviewRecibo';
import ImovelData from '@/interfaces/Imovel/imovelData';
import DataAssinatura from './@pages/dataAssinatua';
import ReciboSinal from './@pages/reciboSinal';
import SalvarCorrecaoDataAss from '@/apis/SalvarCorrecaoDataAss';

const ReviewRecibo = ({ idProcesso }: { idProcesso: any }) => {
    const router = useRouter();
    const [selectItem, setSelectItem] = useState(0);
    const [imovelData, setImovelData] = useState<ImovelData>({});
    const [dataToSave, setDataToSave] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [blocks, setBlocks] = useState([
        { id: 1, page: DataAssinatura, name: 'Data de assinatura', status: '', key: 'Data de assinatura ausente/incorreta', hidden: false, saved: false },
        { id: 2, page: ReciboSinal, name: 'Recibo de sinal assinado', status: '', key: 'Falta de assinatura dos envolvidos', hidden: false, saved: false },
    ]);
    const [correcoesOpen, setCorrecoesOpen] = useState(false);

    const saveBlocks = async () => {
        if (dataToSave.length === 0) {
            console.log('não salva nada')
        }
        else {
            if (dataToSave.bloco === 1) {
                const res = await SalvarCorrecaoDataAss({
                    processo_id: dataToSave.processo_id,
                    data_assinatura: dataToSave.data_assinatura
                })
                if (res) {
                    blocks.forEach((e) => {
                        if(e.id === 1) e.saved = dataToSave.recibo_saved;
                    })
                }
                console.log("Res Salvar: ", res);

            } else if (dataToSave.bloco === 2) {
                blocks.forEach((e) => {
                    if(e.id === 2) e.saved = dataToSave.recibo_saved;
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
        data?.devolucoes?.recibo?.reviewChecks?.forEach((e) => {
            blocks.forEach((block) => {
                if (block.key === e.nome) {
                    newBlocks.push({ ...block, saved: e.saved })
                }
            });
        })
        setBlocks(newBlocks);
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
                            onClick={() => salvarSair()}
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
                            listDocuments={["recibo"]}
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
                                onClick={() => salvarSair()}
                            />
                        </footer>
                    </div>

                    <SimpleDialog
                        open={correcoesOpen}
                        onClose={() => setCorrecoesOpen(false)}
                        className='dialog-review-imovel'
                    >
                        <ModalReviewRecibo
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

export default ReviewRecibo;