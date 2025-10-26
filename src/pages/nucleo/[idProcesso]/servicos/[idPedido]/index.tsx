import { GetServerSideProps } from 'next';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/DetalhesVenda/Header';
import GetProcesso from '@/apis/getProcesso';
import PostLocalizaProcesso from '@/apis/postLocalizaProcesso';
import ImovelDataType from '@/interfaces/Imovel/imovelData';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
// import PDFContainer from '@/components/DomReadPDF';
import dynamic from 'next/dynamic';
import { ArrowRightIcon, CheckCircleIcon, CheckIcon, DocumentTextIcon, ListBulletIcon, PencilIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import {DocumentTextIcon as OutlinedDocumentTextIcon, BuildingOffice2Icon} from '@heroicons/react/24/outline'
import { Chip, CircularProgress, Skeleton } from '@mui/material';
import ButtonComponent from '@/components/ButtonComponent';
import ShowDocument from '@/apis/getDocument';
import SelectInput, { SelectChangeEvent } from '@mui/material/Select/SelectInput';
// import InputSelect from '@/components/InputSelect/Index';
import GetListTopicos from '@/apis/getListTopicosAnalise';
import { ApiTopicosAnaliseType, SelectsType } from '@/interfaces/PosVenda/Analise';
import SkeletonDocumentos from '@/components/Skeleton/PosVenda/Analise/documentos';
import AlterarStatus from '@/apis/AlterarStatus';
import DocUsuarios from '@/components/AnaliseDocumentosServicos/components/DocUsuarios';
import Pessoa from '@/interfaces/Users/userData';
import { Document } from '@/interfaces/Users/document';
import AnaliseServicos from '@/components/AnaliseServicos';
import DocumentosServico from '@/components/AnaliseDocumentosServicos/@DocumentosServico';
import PedidosNucleo from '@/interfaces/Nucleo/pedidos';
import { useForm } from 'react-hook-form';
import { FormValues, Usuario } from '@/interfaces/Nucleo/formValue';
import PostSalvarHistoricoSolicitacao from '@/apis/postSalvarHistoricoSolicitacao';
import DialogServicos from './DialogServicos';
import { data } from 'cypress/types/jquery';
import PostFinalizarPedido from '@/apis/postFinalizarPedido';

// Importe o componente de forma dinâmica
const PDFViewClientOnly = dynamic(() => import('@/components/DomReadPDF'), {
    ssr: false // Informa ao Next.js para não renderizar este componente no servidor
});

const AnaliseServicosNucleo = ({ idProcesso, idPedido }: { idProcesso: string, idPedido?: string | number }) => {
    const errorMsg = 'Campo obrigatório';
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [processData, setProcessData] = useState<ProcessType>();
    const [pedido, setPedido] = useState<ProcessType>();
    const [newTopic, setNewTopic] = useState(false);
    const [loadingDocs, setLoadingDocs] = useState(false);
    const [selects, setSelects] = useState<SelectsType>({
        processo_id: idProcesso,
        card_id: ''
    });
    const [lists, setLists] = useState<ApiTopicosAnaliseType>();
    const [docVendedor, setDocVendedor] = useState<Document>();
    const [docComprador, setDocComprador] = useState<Document>();
    const [openServico, setOpenServico] = useState(false);
    const [servicoDetalhado, setServicoDetalhado] = useState<PedidosNucleo>()
    const [actionBtn, setActionBtn] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [validarFinalizar, setValidarFinalizar] = useState(true);

    // console.log('WATCH: ' , watch());
    const [progressBar, setProgressBar] = useState([{
        percent: -1,
        status: 'Salvando certidão...',
    }]);
    let count = 0

    const {
        register,
        watch,
        setValue,
        getValues,
        formState: { errors },
        handleSubmit,
        setError,
        clearErrors,
    } = useForm<FormValues>({
        defaultValues: {
            status_servico: '',
            observacao: '',
            dataPrevisao: '',
            quantidade_vendedores: 0,
            quantidade_compradores: 0,
            vendedores: [],
            compradores: [],
            tipoDocumento: ''
        }
    });

    const getImovelData = async () => {
        setLoading(true);

        if(localStorage.getItem('origem_nucleo') !== null || localStorage.getItem('origem_nucleo') !== undefined) {
            localStorage.removeItem('origem_nucleo');
        }

        const data = await PostLocalizaProcesso(idProcesso) as unknown as ProcessType;

        if (data) {
            // onCheckFunesbom(data);
            setPedido(data);
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

            const optionsVendedores = newArrayVendedores.map((vendedor) => ({id: vendedor.id, name: vendedor.name || vendedor.nome_fantasia, documentos: vendedor.documentos, tipo_pessoa: vendedor.tipo_pessoa}))
            const optionsCompradores = newArrayCompradores.map((comprador) => ({id: comprador.id, name: comprador.name || comprador.nome_fantasia, documentos: comprador.documentos, tipo_pessoa: comprador.tipo_pessoa}))
            setProcessData(data);
            const resLists = await GetListTopicos(idProcesso) as unknown as ApiTopicosAnaliseType;
            resLists.bancos.unshift({ id: '', name: 'Banco/Instituição financeira' });            
            resLists.tipos.lista_entrega_das_chaves.unshift({ id: '', name: 'FORMA DE PAGAMENTO' });
            resLists.tipos.lista_outros.unshift({ id: '', name: 'ASSUNTO' });
            // console.log(resLists);

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
            setOpenServico(true);
            sessionStorage.removeItem('editar_analise');
        };
        setLoading(false);
    };

    useEffect(() => {
        getImovelData();
    }, [openServico])

    // console.log('lists:' , lists);
    // console.log('docVendedor: ', docVendedor);
    // console.log('docComprador: ', docComprador);

    const salvarSair = () => {
        router.back();
    };

    const onVoltar = () => {
        setOpenServico(false);
        // router.back();
    };

    const handleSaveServico = async () => {
        setOpenDialog(true);
    };

    const onSaveServico = async () => {
        setLoading(true);
        const dataToSave = {
            responsavel_alteracao_id: localStorage.getItem('usuario_id'),
            status_solicitacao_id: watch('status_servico'),
            solicitacao_id: servicoDetalhado?.id,
            mensagem: watch('observacao'),
            processo_id: idProcesso,
            previsao: watch('dataPrevisao'),
        }
        const data = await PostSalvarHistoricoSolicitacao(dataToSave);
        
        if(data){
            getImovelData();

            setTimeout(() => {
                setLoading(false);
                setOpenServico(false);
            }, 2000);
        }
    }
    
    const handleSaveFinalizar = async () => {
        setOpenDialog(true);
    }

    const onSaveFinalizar = async () => {
        const servico = pedido?.solicitacao_nucleo?.find((data) => data?.id === Number(idPedido));
        setLoading(true);
    
        const dataToSave = {
            processo_id: idProcesso,
            grupo_id: servico?.grupo_id,
            usuario_id: localStorage.getItem('usuario_id') || '',
        };

        const data = await PostFinalizarPedido(dataToSave);
        
        if(data){
            // getImovelData();

            setTimeout(() => {
                setLoading(false);
                setOpenServico(false);
                router.push('/nucleo');
                sessionStorage.setItem('finalizar', 'true');
            }, 2000);
        }
        else{
            console.log('Erro ao finalizar o Pedido')
        }
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
        router.push(`/nucleo/${processData?.imovel?.processo_id}/detalhes-venda`)
    }

    const verificaServicosConcluidos = () => {
        const servicosNucleo: any = [processData?.solicitacao_nucleo?.find((data: any) => data?.id === Number(idPedido))];

        const teste = servicosNucleo?.map((pedidos: any) => (
            pedidos?.grupo_id 
                ? pedidos?.servicos_pedido?.data?.some((data: any, index: number) => (
                    data?.status_solicitação?.data?.some((data2: any) => data2.id !== 4 ? setValidarFinalizar(true) : setValidarFinalizar(false))
                )) 
                :
                pedidos?.status_solicitaçao?.data?.id !== 4 ? setValidarFinalizar(true) : setValidarFinalizar(false)
        ))
    }

    useEffect(() => { 
        verificaServicosConcluidos();
    }, [processData])
    
    return (
        <>
            <Header
                imovel={processData?.imovel || {}}
                urlVoltar={openServico ? 'voltar' : undefined}
                salvarSair={openServico ? undefined : salvarSair}
                gerente={processData?.gerente.data[0]}
                responsavel={processData?.responsaveis?.data?.[0]}
                onVoltar={openServico ? onVoltar : undefined}
            />
            {!openServico
                ?
                <div className='analise-container'>
                    <PDFViewClientOnly id={processData?.imovel.id} />
                    <div className='cards-doc-topicos'>
                        <AnaliseServicos
                            processData={processData}
                            idProcesso={idProcesso}
                            idPedido={idPedido}
                            servicoDetalhado={servicoDetalhado}
                            setOpenServico={setOpenServico}
                            setServicoDetalhado={setServicoDetalhado}
                        />

                        <DocUsuarios
                            pessoa={'vendedor'}
                            handleInput={handleInput}
                            quantidade={lists?.qtdVendedores}
                            lists={lists}
                            docLists={docVendedor}
                            loading={loading}
                            processData={processData}
                            url={'nucleo'}
                        />

                        <DocUsuarios
                            pessoa={'comprador'}
                            handleInput={handleInput}
                            quantidade={lists?.qtdCompradores}
                            lists={lists}
                            docLists={docComprador}
                            loading={loading}
                            processData={processData}
                            url={'nucleo'}
                        />

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
                    </div>
                </div>
                : 
                <DocumentosServico 
                    processData={processData}
                    setActionBtn={setActionBtn}
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    setError={setError}
                    clearErrors={clearErrors}
                    getValues={getValues}
                    errors={errors}
                    lists={lists}
                    servicoDetalhado={servicoDetalhado}
                />
            }
            <footer className='footer-checkout'>
                <ButtonComponent
                    size={'large'}
                    variant={'contained'}
                    label={`${openServico ? 'Atualizar pós-venda' : 'Finalizar'}`}
                    labelColor='white'
                    disabled={!openServico ? validarFinalizar : loading}
                    endIcon={loading ? <CircularProgress size={20} /> : openServico ? <ArrowRightIcon width={20} fill='white' /> : <CheckIcon width={20} fill='white' />}
                    onClick={openServico ? handleSubmit(() => handleSaveServico()) : () => handleSaveFinalizar()}
                />
            </footer>

            <DialogServicos 
                open={openDialog}
                setOpen={setOpenDialog} 
                type={openServico ? 'servico' : 'finalizar'}
                statusServico={watch('status_servico')}
                save = {openServico ? onSaveServico : onSaveFinalizar}
            />
        </>
    )
}

// EXECUTA ANTES DO DASHBOARD
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso } = context.params as { idProcesso: string };
    const { idPedido } = context.params as { idPedido: string };
    return { props: { idProcesso, idPedido } };
};

export default AnaliseServicosNucleo;
