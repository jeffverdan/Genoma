import { GetServerSideProps } from 'next';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/DetalhesVenda/Header';
import PostLocalizaProcesso from '@/apis/postLocalizaProcesso';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
// import PDFContainer from '@/components/DomReadPDF';
import dynamic from 'next/dynamic';
import { ArrowRightIcon, CheckIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import {DocumentTextIcon as BuildingOffice2Icon} from '@heroicons/react/24/outline'
import { Chip, CircularProgress, Skeleton } from '@mui/material';
import ButtonComponent from '@/components/ButtonComponent';
import ShowDocument from '@/apis/getDocument';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import InputSelect from '@/components/InputSelect/Index';
import GetListTopicos from '@/apis/getListTopicosAnalise';
import { ApiTopicosAnaliseType, SelectsType } from '@/interfaces/PosVenda/Analise';
import MultipleSelectCheckmarks from '@/components/SelectMultiInput';
import SaveTopico from '@/apis/saveTopicos';
import SkeletonDocumentos from '@/components/Skeleton/PosVenda/Analise/documentos';

import EntregaDasChaves from '@/components/AnaliseDocumentosServicos/@EntregaDasChaves';
import Taxas from '@/components/AnaliseDocumentosServicos/@Taxas';
import Laudemio from '@/components/AnaliseDocumentosServicos/@Laudemio';
import AnaliseReciboSinal from '@/components/AnaliseReciboSinal';
import Outros from '@/components/AnaliseDocumentosServicos/@Outros';
import ReforcoSinal from '@/components/AnaliseDocumentosServicos/@ReforcoSinal';
import AlterarStatus from '@/apis/AlterarStatus';
import DocUsuarios from '@/components/AnaliseDocumentosServicos/components/DocUsuarios';
import Pessoa from '@/interfaces/Users/userData';
import { Document } from '@/interfaces/Users/document';
// import { CheckCertidoes } from '@/components/AutoSaveCertidoes';


// Importe o componente de forma dinâmica
const PDFViewClientOnly = dynamic(() => import('@/components/DomReadPDF'), {
    ssr: false // Informa ao Next.js para não renderizar este componente no servidor
});

type KeysType = 'topico' | 'quantAverbacao' | 'vendedoresAverbacao';

interface IDocs {
    doc_compradores: [],
    doc_vendedores: []
}

const AnalisePosVenda = ({ idProcesso }: { idProcesso: string }) => {
    const errorMsg = 'Campo obrigatório';
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [processData, setProcessData] = useState<ProcessType>();
    const [newTopic, setNewTopic] = useState(false);
    const [loadingDocs, setLoadingDocs] = useState(false);
    const [selects, setSelects] = useState<SelectsType>({
        processo_id: idProcesso,
        card_id: ''
    });
    const [lists, setLists] = useState<ApiTopicosAnaliseType>();
    const [docVendedor, setDocVendedor] = useState<Document>();
    const [docComprador, setDocComprador] = useState<Document>();

    // console.log('WATCH: ' , watch());
    const [progressBar, setProgressBar] = useState([{
        percent: -1,
        status: 'Salvando certidão...',
    }]);
    let count = 0    

    const getImovelData = async () => {
        setLoading(true);
        const data = await PostLocalizaProcesso(idProcesso) as unknown as ProcessType;        

        if (data) {
            // onCheckFunesbom(data);
            
            const newArrayVendedores = data.vendedores.flatMap((obj: Pessoa) => {
                if (!!obj?.representante_socios?.data?.[0]) {
                  return [obj, ...obj?.representante_socios?.data];
                } else {
                  return obj;
                }
            });

            const newArrayCompradores = data.compradores.flatMap((obj: Pessoa) => {
                if (!!obj?.representante_socios?.data?.[0]) {
                  return [obj, ...obj?.representante_socios?.data];
                } else {
                  return obj;
                }
            });

            const optionsVendedores = newArrayVendedores.map((vendedor) => ({id: vendedor.id, name: vendedor.name || vendedor.nome_fantasia, documentos: vendedor.documentos}))
            const optionsCompradores = newArrayCompradores.map((comprador) => ({id: comprador.id, name: comprador.name || comprador.nome_fantasia, documentos: comprador.documentos}))

            setProcessData(data);
            const resLists = await GetListTopicos(idProcesso) as unknown as ApiTopicosAnaliseType;
            resLists.bancos.unshift({ id: '', name: 'Banco/Instituição financeira' });            
            resLists.tipos.lista_entrega_das_chaves.unshift({ id: '', name: 'FORMA DE PAGAMENTO' });
            resLists.tipos.lista_outros.unshift({ id: '', name: 'ASSUNTO' });
            console.log(resLists);
            

            setLists({
                ...resLists,                
                qtdVendedores: optionsVendedores.length,
                listaVendedores: optionsVendedores || [],
                qtdCompradores: optionsCompradores.length,
                listaCompradores: optionsCompradores || [],
            });

            setDocVendedor(optionsVendedores?.[0]?.documentos);
            setDocComprador(optionsCompradores?.[0]?.documentos);            
        }
        
        // PEGA REDIRECT DE OUTRA URL
        const selectSession = (sessionStorage.getItem('editar_analise') || '');
        if (!!selectSession) {
            setSelects(JSON.parse(selectSession));
            setNewTopic(true);
            sessionStorage.removeItem('editar_analise');
        };
        setLoading(false);
    };

    useEffect(() => {
        getImovelData();
    }, [])

    // console.log('lists:' , lists);
    // console.log('docVendedor: ', docVendedor);
    // console.log('docComprador: ', docComprador);

    const salvarSair = () => {
        router.back();
    };

    const onVoltar = () => {
        setNewTopic(false);
        // router.back();
    };

    const onChangeSelect = (e: SelectChangeEvent<unknown>, index?: number | ReactNode) => {
        // console.log(e.target);
        const key = e.target.name as KeysType;
        const value = e.target.value as number;
        const select = value;

        if (key === 'quantAverbacao') {
            const arr = []
            for (let i = 0; i < value; i++) {
                arr.push(selects?.vendedoresAverbacao?.[i] || { id: '', tipo: [{ id: '' }] });
            }
            setSelects({ ...selects, vendedoresAverbacao: arr, [key]: select })
        } else if (key === 'vendedoresAverbacao' && typeof index === 'number' && selects?.vendedoresAverbacao) {
            selects.vendedoresAverbacao[index].id = value
            setSelects({ ...selects });
        } else setSelects({
            ...selects,
            [key]: select
        });
    };

    // console.log(selects);

    const onCheckSelect = (e: any[], index_vendedor: number) => {
        if (selects?.vendedoresAverbacao?.[index_vendedor]?.tipo) {
            selects.vendedoresAverbacao[index_vendedor].tipo = e;
            setSelects({ ...selects });
        }
    };

    const addNewTopic = () => {
        // ZERANDO CAMPOS
        setSelects({ processo_id: idProcesso, card_id: '' })
        setNewTopic(true);
    };

    const onSaveNewTopic = async () => {
        setLoading(true);
        const resSave = await SaveTopico(selects);
        if (resSave) {
            setNewTopic(false);
            // ZERANDO CAMPOS
            setSelects({ processo_id: idProcesso, card_id: '' })
        }
        setLoading(false);
    };

    const onEditTopic = (topic: SelectsType) => {
        setSelects(topic);
        setNewTopic(true);
    };

    console.log(processData);    

    const onClickAlterarStatus = async () => {
        setLoading(true);
        if(processData?.status?.data[0]?.id === 2) {
            return router.push(`/posvenda/${idProcesso}/status/`);
        }  
        const enderecoProcesso = `${processData?.imovel.logradouro}${processData?.imovel.numero ? ', ' + processData?.imovel.numero : ''}${processData?.imovel.bairro ? ' - ' + processData?.imovel.bairro : ''}`
        const dataToSave = {
            status_processo_id: 2,
            processo_id: idProcesso,
            processo_nome: enderecoProcesso,
        }
        const res = await AlterarStatus(dataToSave);
        if(res) {
            sessionStorage.setItem('change_status', JSON.stringify(true));
            router.push(`/posvenda/${idProcesso}/status/`);
        }
        setLoading(false);
    };

    const handleInput = (type: 'comprador' | 'vendedor', e: any) => {
        const data: 'comprador' | 'vendedor' = type

        if(type === 'comprador'){
            const selectComprador = lists?.listaCompradores?.find((lista) => lista.id === e)
            setDocComprador(selectComprador?.documentos);
        }
        else{
            const selectVendedor = lists?.listaVendedores?.find((lista) => lista.id === e)
            setDocVendedor(selectVendedor?.documentos);
        }
    }

    const openImovel = () => {
        localStorage.setItem('tab_select', '1');
        router.push(`/posvenda/${processData?.imovel?.processo_id}/detalhes-venda`)
    }

    return (
        <>
            <Header
                imovel={processData?.imovel || {}}
                urlVoltar={newTopic ? 'voltar' : undefined}
                salvarSair={newTopic ? undefined : salvarSair}
                gerente={processData?.gerente.data[0]}
                onVoltar={newTopic ? onVoltar : undefined}
            />
            {!newTopic
                ?
                <div className='analise-container'>
                    <PDFViewClientOnly id={processData?.imovel.id} />
                    <div className='cards-doc-topicos'>
                        <AnaliseReciboSinal
                            processData={processData}
                            // arrTopicsPrev={arrTopics}
                            idProcesso={idProcesso}
                            onEditTopicLocal={onEditTopic}
                            addNewTopic={addNewTopic}
                        />
                        
                        {/* <section className='cards docs'>
                            <div className='title'>
                                <OutlinedDocumentTextIcon className="iconOutlined" />
                                <h2>Imóvel</h2>
                            </div>

                            <div className='list-items'>
                                {(loading || loadingDocs)
                                    ? <SkeletonDocumentos />
                                    : processData?.imovel?.documentos?.data?.map((doc) => (
                                        <div className='item' key={doc.id} >
                                            <div className='icon-label'>
                                                <CheckCircleIcon width={14} height={14} />
                                                <p>{doc.tipo_documento_ids?.map((tipo) => ' ' + tipo.nome_tipo).toString().trim()} {doc.tipo_documento_ids?.length > 1 && <Chip className='chip neutral' label={doc.tipo_documento_ids?.length + ' tipos'}/>}</p>
                                            </div>

                                            <div className='icon-label actions actions-doc'>
                                                <ButtonComponent startIcon={<DocumentTextIcon/>} labelColor='#fff' size={'large'} variant={'contained'} label={'Ver documento'} onClick={() => ShowDocument(doc.id, 'documento')} />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </section> */}

                        <section className='cards docs servicos'>
                            <div className='title'>
                                <BuildingOffice2Icon className="iconOutlined" />
                                <h2>Imóvel</h2>
                            </div>

                            <div className='list-items'>
                                {(loading || loadingDocs)
                                    ? <SkeletonDocumentos />
                                    : processData?.imovel?.documentos?.data?.map((doc) => (
                                        <div className='item' key={doc.id} >
                                            <div className='icon-label'>
                                                <DocumentTextIcon width={14} height={14} />
                                                <p>{doc.tipo_documento_ids?.map((tipo) => ' ' + tipo.nome_tipo).toString().trim()} {doc.tipo_documento_ids?.length > 1 && <Chip className='chip neutral' label={doc.tipo_documento_ids?.length + ' tipos'}/>}</p>
                                            </div>

                                            <div className='icon-label actions actions-doc'>
                                                <ButtonComponent size={'small'} labelColor='#fff' variant={'outlined'} startIcon={''} label={'Ver documento'} onClick={() => ShowDocument(doc.id, 'documento')} />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <div className='btn-action'>
                                <ButtonComponent 
                                    size={'large'} 
                                    variant={'text'} 
                                    label={'Ver detalhes do imóvel'} 
                                    onClick={openImovel} 
                                />
                            </div>
                        </section>

                        <DocUsuarios
                            pessoa={'vendedor'}
                            handleInput={handleInput}
                            quantidade={lists?.qtdVendedores}
                            lists={lists}
                            docLists={docVendedor}
                            loading={loading}
                            processData={processData}
                            url={'posvenda'}
                        />

                        <DocUsuarios
                            pessoa={'comprador'}
                            handleInput={handleInput}
                            quantidade={lists?.qtdCompradores}
                            lists={lists}
                            docLists={docComprador}
                            loading={loading}
                            processData={processData}
                            url={'posvenda'}
                        />
                    </div>
                </div>
                : <div className='new-topic-container'>
                    <div className='cards'>
                        <h2>Qual tópico da análise deseja adicionar?</h2>
                        <InputSelect label={'Tópico da análise*'} name={'topico_id'} option={lists?.lista_topicos || []} value={selects?.topico_id || ''} onChange={onChangeSelect} />
                    </div>

                    {!!selects?.topico_id &&
                        <>
                            {/* CARD DE AVERBAÇÃO */}
                            {selects.topico_id === 1 && <div className='cards'>
                                <h2>Para qual vendedor? Qual seria a averbação?</h2>
                                <InputSelect label={'Quantos vendedores?*'} name={'quantAverbacao'} option={lists?.listaVendedores?.map((e, index) => ({id:index + 1, nome: index + 1})) || []} value={selects?.quantAverbacao || ''} onChange={onChangeSelect} />
                                {selects.vendedoresAverbacao?.map((vendedor, index) => (
                                    <div className='selects-line' key={index}>
                                        <InputSelect 
                                            label={'Nome completo*'} 
                                            name={'vendedoresAverbacao'} 
                                            // option={lists?.vendedores_envolvidos || []}
                                            option={lists?.listaVendedores || []}
                                            value={vendedor.id} 
                                            onChange={(e) => onChangeSelect(e, index)} 
                                        />

                                        <MultipleSelectCheckmarks
                                            label={`Tipos de averbações*`}
                                            name={''}
                                            options={lists?.tipos.lista_averbacao?.filter(data => data.id !== 1 && data.id !== 3) || []}
                                            value={vendedor.tipo}
                                            // error={error?.[checkType]?.reviews?.[index]?.errorCheck}
                                            onChange={(e: any[]) => onCheckSelect(e, index)}
                                            labelMenu={`Tipos de averbações`}
                                            // maxWidth={300}
                                            placeholder='Selecione...'
                                        />
                                    </div>
                                ))}
                            </div>}

                            {/* CARD DE ENTREGA DAS CHAVES */}
                            {selects.topico_id === 2 && <>
                                <EntregaDasChaves processData={processData} lists={lists} selects={selects} setSelects={setSelects} onChangeSelect={onChangeSelect} />
                            </>}

                            {/* CARD DE LAUDEMIOS */}
                            {selects.topico_id === 3 && <>
                                <Laudemio processData={processData} selects={selects} setSelects={setSelects} onSaveNewTopic={onSaveNewTopic} />
                            </>}

                            {/* CARD DE PENDENCIAS E TAXAS */}
                            {selects.topico_id === 4 && <>
                                <Taxas processData={processData} lists={lists} selects={selects} setSelects={setSelects} />
                            </>}

                            {/* CARD TAXAS */}
                            {selects.topico_id === 5 && <>
                                <ReforcoSinal lists={lists} selects={selects} setSelects={setSelects} onChangeSelect={onChangeSelect} />
                            </>}

                            {/* CARD OUTROS */}
                            {selects.topico_id === 6 && <>
                                <Outros lists={lists} selects={selects} setSelects={setSelects} onChangeSelect={onChangeSelect} />
                            </>}

                        </>}
                </div>
            }
            <footer className='footer-checkout'>
                <ButtonComponent
                    size={'large'}
                    variant={'contained'}
                    label={newTopic ? 'Salvar edição' : 'Atualizar status e compartilhar com o gerente'}
                    labelColor='white'
                    disabled={loading}
                    endIcon={loading ? <CircularProgress size={20} /> : newTopic ? <CheckIcon width={20} fill='white' /> : <ArrowRightIcon width={20} fill='white' />}
                    onClick={() => newTopic ? onSaveNewTopic() : onClickAlterarStatus()}
                />
            </footer>
        </>
    )
}

// EXECUTA ANTES DO DASHBOARD
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso } = context.params as { idProcesso: string };
    return { props: { idProcesso } };
};

export default AnalisePosVenda;