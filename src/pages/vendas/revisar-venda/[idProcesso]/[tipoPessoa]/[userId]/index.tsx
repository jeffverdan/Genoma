import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import HeadSeo from '@/components/HeadSeo';
import ContextBlocks from '@/context/Vendas/ContextSideBar';
import SideMenu from '@/components/SideMenu';
import ButtonComponent from '@/components/ButtonComponent';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';

import DadosPessoa from '@/components/DetalhesVenda/Pessoa/Editavel/DadosPessoa';
import Endereco from '@/components/DetalhesVenda/Pessoa/Editavel/Endereco';
import Documentos from '@/components/DetalhesVenda/Pessoa/Editavel/Documentos';
import Procurador from '@/components/DetalhesVenda/Pessoa/Editavel/Procurador';
import DadosEmpresa from '@/components/DetalhesVenda/Pessoa/Editavel/DadosEmpresa';

import GetProcesso from '@/apis/getProcesso';
import SaveImovel from '@/apis/postSaveImovel';
import { HiCheck } from 'react-icons/hi2';
import SimpleDialog from '@/components/Dialog';
import ModalReviewImovel from '../../@ReviewPF_PJ';
import ImovelData from '@/interfaces/Imovel/imovelData';
import GetListaDocumentos from '@/apis/getListaDocumentos';
import { ListaDocumentosType } from '@/interfaces/Documentos';
import VerticalCards from '@/components/VerticalCards';
import SaveUser from '@/apis/postSaveUser';
import Pessoa from '@/interfaces/Users/userData';
import { SelectType } from '@/interfaces/PosVenda/Devolucao';

interface ParamsType {
    idProcesso: string,
    tipoPessoa: 'vendedor' | 'comprador'
    userId: string,
};

type ReviewsType = {
    pf?: {
        reviews: SelectType[] | undefined
        obs: string
    }
    pj?: {
        reviews: SelectType[] | undefined
        obs: string 
    }
}

const ReviewImovel = ({ idProcesso, tipoPessoa, userId }: ParamsType) => {
    const router = useRouter();
    const [selectItem, setSelectItem] = useState(0);
    const [imovelData, setImovelData] = useState<ImovelData>({});
    const [dataPessoa, setDataPessoa] = useState<Pessoa>();
    const [dataToSave, setDataToSave] = useState<any>([]);
    const [listDocumentImovel, setListDocumentImovel] = useState<ListaDocumentosType[]>([]);
    const key_pf: 'vendedor_pf' | 'comprador_pf' = `${tipoPessoa}_pf`;
    const key_pj: 'vendedor_pj' | 'comprador_pj' = `${tipoPessoa}_pj`;
    const key_incompleto: 'cadastro_incompleto_vendedor' | 'cadastro_incompleto_comprador' = `cadastro_incompleto_${tipoPessoa}`;

    const [loading, setLoading] = useState(false);
    const [selectUser, setSelectUser] = useState<SelectType>();
    const [reviews, setReviews] = useState<ReviewsType>({})
    const [blocks, setBlocks] = useState([
        { id: 0, page: DadosPessoa, name: 'Dados pessoais', status: '', key: 'Dados pessoais', hidden: false, saved: false },
        { id: 1, page: Endereco, name: 'Endereço', status: '', key: 'Endereço', hidden: false, saved: false },
        { id: 2, page: Procurador, name: 'Procurador', status: '', key: 'Procurador', hidden: false, saved: false },
        { id: 4, page: Documentos, name: 'Documentos', status: '', key: 'Documentos', hidden: false, saved: false },
        { id: 4, page: Documentos, name: 'Documentos', status: '', key: 'Documentos da empresa', hidden: false, saved: false },
        { id: 0, page: DadosEmpresa, name: 'Dados empresa', status: '', key: 'Dados da empresa', hidden: false, saved: false },
    ]);
    const [correcoesOpen, setCorrecoesOpen] = useState(false);

    const saveBlocks = async () => {
        if (dataToSave.length === 0) {
            console.log('não salva nada')
        }
        else {
            dataToSave.processo_id = idProcesso;
            dataToSave.usuario_id = Number(userId) || '';
            dataToSave.tipo_usuario = tipoPessoa;
            blocks.filter(e => e.id === dataToSave.bloco)?.forEach((block) => {
                selectUser?.reviewChecks.forEach((review) => {
                    if (review.nome === block.key) dataToSave.id_correcao = review.id_correcao;
                })
            })
            if (dataToSave.bloco === 7) {
                // blocks[6].saved = dataToSave.recibo_saved;
            } else {
                const res = await SaveUser(dataToSave) as any;
                blocks.forEach((block) => {
                    if (res) block.saved = block.id === dataToSave.bloco;
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
        const newBlocks: any = [];

        // EDITANDO USUARIO
        if (data && Number(userId)) {
            const usersPf = data.devolucoes?.[key_pf];
            const usersPj = data.devolucoes?.[key_pj];
            const findUser = usersPf?.reviews?.find(e => e.id === Number(userId)) || usersPj?.reviews?.find(e => e.id === Number(userId));
            setReviews({
                pf: {
                    reviews: usersPf?.reviews?.filter(e => e.id === Number(userId)),
                    obs: data.devolucoes?.[key_pf].obs || ''
                },
                pj: {
                    reviews: usersPj?.reviews?.filter(e => e.id === Number(userId)),
                    obs: data.devolucoes?.[key_pj].obs || ''
                },
            })
            setSelectUser(findUser);

            findUser?.reviewChecks.forEach(e => {
                blocks.forEach((block) => {
                    if (block.key === e.nome) {
                        newBlocks.push({ ...block, saved: e.saved })
                    }
                })
            });

            data?.[`${tipoPessoa}es`]?.forEach((pessoa) => {
                if (findUser?.representante) {
                    pessoa.representante_socios?.data.forEach(rep => {
                        if (rep.id === findUser.id) setDataPessoa(rep)
                    })
                } else {
                    if (pessoa.id === findUser?.id) setDataPessoa(pessoa)
                }
            })
            setImovelData(data);

            // const listDocImovel = await GetListaDocumentos() as unknown as ListaDocumentosType[];
            // setListDocumentImovel(listDocImovel);
            setBlocks(newBlocks);

        }
        // CRIANDO NOVO USUARIO
        else {
            console.log(userId);
            if (userId === 'pessoa-fisica') setBlocks(blocks.filter((e) => !e.key.includes('empresa')));
            else if (userId === 'pessoa-juridica') setBlocks(blocks.filter((e) => e.key.includes('empresa') || e.key === 'Endereço'));
            else if (userId === 'representante') setBlocks(blocks.filter((e) => !e.key.includes('empresa') && e.key !== 'Procurador'));
        }
        console.log(blocks);

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
                            dataProcesso={dataPessoa}
                            saveBlocks={saveBlocks}
                            setSelectItem={setSelectItem}
                            selectItem={selectItem}
                            idProcesso={idProcesso}
                            setDataToSave={setDataToSave}
                            loading={loading}
                            imovelData={imovelData}
                            // listDocuments={listDocumentImovel}
                            type={`${tipoPessoa}es`}
                        />

                        <footer className='footer review'>
                            {!loading && !!selectUser?.reviewChecks?.length ?
                                <ButtonComponent
                                    size={'medium'}
                                    variant={'text'}
                                    label={`Ver correções (${selectUser?.reviewChecks?.length})`}
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
                        open={!!selectUser?.reviewChecks?.[0] ? correcoesOpen : false}
                        onClose={() => setCorrecoesOpen(false)}
                        className='dialog-review-imovel'
                    >
                        <ModalReviewImovel
                            type={tipoPessoa}
                            reviewPF={reviews.pf}
                            reviewPJ={reviews.pj}
                            incompleto={false}
                            incompletoObs={''}
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
    const { idProcesso, tipoPessoa, userId } = context.params as unknown as ParamsType;
    return { props: { idProcesso, tipoPessoa, userId } };
};

export default ReviewImovel;