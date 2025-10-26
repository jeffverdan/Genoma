// import { GetServerSideProps } from 'next';
// import { ReactNode, useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Header from '@/components/DetalhesVenda/Header';
// import GetProcesso from '@/apis/getProcesso';
// import PostLocalizaProcesso from '@/apis/postLocalizaProcesso';
// import ImovelDataType from '@/interfaces/Imovel/imovelData';
// import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
// // import PDFContainer from '@/components/DomReadPDF';
// import dynamic from 'next/dynamic';
// import { ArrowRightIcon, CheckCircleIcon, CheckIcon, DocumentTextIcon, ListBulletIcon, PencilIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
// import {DocumentTextIcon as OutlinedDocumentTextIcon, BuildingOffice2Icon} from '@heroicons/react/24/outline'
// import { Chip, CircularProgress, Skeleton } from '@mui/material';
// import ButtonComponent from '@/components/ButtonComponent';
// import ShowDocument from '@/apis/getDocument';
// import SelectInput, { SelectChangeEvent } from '@mui/material/Select/SelectInput';
// import InputSelect from '@/components/InputSelect/Index';
// import GetListTopicos from '@/apis/getListTopicosAnalise';
// import { ApiTopicosAnaliseType, SelectsType } from '@/interfaces/PosVenda/Analise';
// import MultipleSelectCheckmarks from '@/components/SelectMultiInput';
// import SaveTopico from '@/apis/saveTopicos';
// import SkeletonTopicos from '@/components/Skeleton/PosVenda/Analise/topicos';
// import SkeletonDocumentos from '@/components/Skeleton/PosVenda/Analise/documentos';
// import getSaveTopicos from '@/apis/getSaveTopicos';
// import EntregaDasChaves from './@EntregaDasChaves';
// import Taxas from './@Taxas';
// import Laudemio from './@Laudemio';
// import AnaliseReciboSinal from '@/components/AnaliseReciboSinal';
// import Outros from './@Outros';
// import ReforcoSinal from './@ReforcoSinal';
// import AlterarStatus from '@/apis/AlterarStatus';
// import DocUsuarios from './components/DocUsuarios'
// import Pessoa from '@/interfaces/Users/userData';
// import { CheckCertidoes } from '@/components/AutoSaveCertidoes';
// import AnaliseServicos from '../AnaliseServicos';
// import DocumentosServico from './@DocumentosServico';
// import PedidosNucleo from '@/interfaces/Nucleo/pedidos';
// import { useForm } from 'react-hook-form';
// import { Document } from '@/interfaces/Users/document';

// // Importe o componente de forma dinâmica
// const PDFViewClientOnly = dynamic(() => import('@/components/DomReadPDF'), {
//     ssr: false // Informa ao Next.js para não renderizar este componente no servidor
// });

// type KeysType = 'topico' | 'quantAverbacao' | 'vendedoresAverbacao';
// interface IDocs {
//     doc_compradores: [],
//     doc_vendedores: []
// }

// type FormValues = {
//   status_servico: string,
//   observacao: string,
//   dataPrevisao: string
//   quantidade_vendedores: number
//   quantidade_compradores: number
//   vendedores: Usuario[]
//   compradores: Usuario[]
// }
// interface Usuario {
//     id?: number;
//     nome?: string;
// }

// const AnaliseDocumentosServicos = ({ idProcesso, idServicos }: { idProcesso: string, idServicos?: string | number }) => {
//     const errorMsg = 'Campo obrigatório';
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();
//     const [processData, setProcessData] = useState<ProcessType>();
//     const [newTopic, setNewTopic] = useState(false);
//     const [loadingDocs, setLoadingDocs] = useState(false);
//     const [selects, setSelects] = useState<SelectsType>({
//         processo_id: idProcesso,
//         card_id: ''
//     });
//     const [lists, setLists] = useState<ApiTopicosAnaliseType>();
//     const [docVendedor, setDocVendedor] = useState<Document>();
//     const [docComprador, setDocComprador] = useState<Document>();
//     const [openServico, setOpenServico] = useState(false);
//     const [servicoDetalhado, setServicoDetalhado] = useState<PedidosNucleo>()
//     const [actionBtn, setActionBtn] = useState(true);

//     // console.log('WATCH: ' , watch());
//     const [progressBar, setProgressBar] = useState([{
//         percent: -1,
//         status: 'Salvando certidão...',
//     }]);
//     let count = 0


//     const {
//         register,
//         watch,
//         setValue,
//         getValues,
//         formState: { errors },
//         handleSubmit,
//         setError,
//         clearErrors,
//     } = useForm<FormValues>({
//         defaultValues: {
//             status_servico: '',
//             observacao: '',
//             dataPrevisao: '',
//             quantidade_vendedores: 0,
//             quantidade_compradores: 0,
//         }
//     });

//     const onCheckFunesbom = async (data: ProcessType) => {
//         // const idEfiteutica = 6; // ID PRODUÇÃO
//         const idEfiteutica = 7 // ID HOMOLOG    
//         const funesbomDoc = data.imovel?.documentos?.data.find((doc) => doc.tipo_documento_ids.find((tipo) => tipo.tipo_documento_id === 11));
//         const efiteuticaDoc = data.imovel?.documentos?.data.find((doc) => doc.tipo_documento_ids.find((tipo) => tipo.tipo_documento_id === idEfiteutica));

//         if(count === 0 && !!data?.imovel && !funesbomDoc && !efiteuticaDoc) {
//             setLoadingDocs(true);
//             count =+ 1;
//             const inscricao = data.imovel.informacao?.inscricaoMunicipal || '';
    
//             const res = await CheckCertidoes({ inscricao, data: data.imovel, funesbom: true, efiteutica: true, progressBar, setProgressBar });
//             console.log(res);
//             if(res?.funesbom?.certidao_pdf) {
//                 const attData = await PostLocalizaProcesso(idProcesso) as unknown as ProcessType;
//                 setProcessData(attData);
//             }
//             setLoadingDocs(false);
//         }
//     };

//     const getImovelData = async () => {
//         setLoading(true);

//         if(localStorage.getItem('origem_nucleo') !== null || localStorage.getItem('origem_nucleo') !== undefined) {
//             localStorage.removeItem('origem_nucleo');
//         }

//         const data = await PostLocalizaProcesso(idProcesso) as unknown as ProcessType;

//         if (data) {
//             // onCheckFunesbom(data);
            
//             const newArrayVendedores = data.vendedores.flatMap((obj: Pessoa) => {
//                 if (!!obj?.representante_socios?.data?.[0]) {
//                   return [obj, ...obj?.representante_socios?.data];
//                 } else {
//                   return obj;
//                 }
//             });

//             const newArrayCompradores = data.compradores.flatMap((obj: Pessoa) => {
//                 if (!!obj?.representante_socios?.data?.[0]) {
//                   return [obj, ...obj?.representante_socios?.data];
//                 } else {
//                   return obj;
//                 }
//             });

//             const optionsVendedores: any = newArrayVendedores.map((vendedor) => ({id: vendedor.id, name: vendedor.name || vendedor.nome_fantasia, documentos: vendedor.documentos}))
//             const optionsCompradores: any = newArrayCompradores.map((comprador) => ({id: comprador.id, name: comprador.name || comprador.nome_fantasia, documentos: comprador.documentos}))
//             // optionsVendedores.unshift({ id: '0', name: 'Selecione ...', documentos: undefined });
//             // optionsCompradores.unshift({ id: '0', name: 'Selecione ...', documentos: undefined });

//             setProcessData(data);
//             const resLists = await GetListTopicos(idProcesso) as unknown as ApiTopicosAnaliseType;
//             resLists.bancos.unshift({ id: '', name: 'Banco/Instituição financeira' });            
//             resLists.tipos.lista_entrega_das_chaves.unshift({ id: '', name: 'FORMA DE PAGAMENTO' });
//             resLists.tipos.lista_outros.unshift({ id: '', name: 'ASSUNTO' });
//             console.log(resLists);
            

//             setLists({
//                 ...resLists,                
//                 qtdVendedores: optionsVendedores.length,
//                 listaVendedores: optionsVendedores || [],
//                 qtdCompradores: optionsCompradores.length,
//                 listaCompradores: optionsCompradores || [],
//             });

//             setDocVendedor(optionsVendedores?.[0]?.documentos);
//             setDocComprador(optionsCompradores?.[0]?.documentos);            
//         }
        
//         // PEGA REDIRECT DE OUTRA URL
//         const selectSession = (sessionStorage.getItem('editar_analise') || '');
//         if (!!selectSession) {
//             setSelects(JSON.parse(selectSession));
//             setOpenServico(true);
//             sessionStorage.removeItem('editar_analise');
//         };
//         setLoading(false);
//     };

//     useEffect(() => {
//         getImovelData();
//     }, [])

//     // console.log('lists:' , lists);
//     // console.log('docVendedor: ', docVendedor);
//     // console.log('docComprador: ', docComprador);

//     const salvarSair = () => {
//         router.back();
//     };

//     const onVoltar = () => {
//         setOpenServico(false);
//         // router.back();
//     };

//     const onChangeSelect = (e: SelectChangeEvent<unknown>, index?: number | ReactNode) => {
//         // console.log(e.target);
//         const key = e.target.name as KeysType;
//         const value = e.target.value as number;
//         const select = value;

//         if (key === 'quantAverbacao') {
//             const arr = []
//             for (let i = 0; i < value; i++) {
//                 arr.push(selects?.vendedoresAverbacao?.[i] || { id: '', tipo: [{ id: '' }] });
//             }
//             setSelects({ ...selects, vendedoresAverbacao: arr, [key]: select })
//         } else if (key === 'vendedoresAverbacao' && typeof index === 'number' && selects?.vendedoresAverbacao) {
//             selects.vendedoresAverbacao[index].id = value
//             setSelects({ ...selects });
//         } else setSelects({
//             ...selects,
//             [key]: select
//         });
//     };

//     // console.log(selects);

//     // const onCheckSelect = (e: any[], index_vendedor: number) => {
//     //     if (selects?.vendedoresAverbacao?.[index_vendedor]?.tipo) {
//     //         selects.vendedoresAverbacao[index_vendedor].tipo = e;
//     //         setSelects({ ...selects });
//     //     }
//     // };

//     // const addNewTopic = () => {
//     //     // ZERANDO CAMPOS
//     //     setSelects({ processo_id: idProcesso, card_id: '' })
//     //     setOpenServico(true);
//     // };

//     const onSaveFinalizar = async () => {
//         console.log('Clicou em Finalizar')
//     }

//     const onSaveServico = async () => {
//         console.log('Clicou em Atualizar pós-venda')
//     };

//     // const onEditTopic = (topic: SelectsType) => {
//     //     setSelects(topic);
//     //     setOpenServico(true);
//     // };

//     const onClickAlterarStatus = async () => {
//         setLoading(true);
//         const enderecoProcesso = `${processData?.imovel.logradouro}${processData?.imovel.numero ? ', ' + processData?.imovel.numero : ''}${processData?.imovel.bairro ? ' - ' + processData?.imovel.bairro : ''}`
//         const dataToSave = {
//             status_processo_id: 2,
//             processo_id: idProcesso,
//             processo_nome: enderecoProcesso,
//         }
//         const res = await AlterarStatus(dataToSave);
//         if(res) {
//             sessionStorage.setItem('change_status', JSON.stringify(true));
//             router.push(`/posvenda/${idProcesso}/status/`);
//         }
//         setLoading(false);
//     };

//     const handleInput = (type: 'comprador' | 'vendedor', e: any) => {
//         const data: 'comprador' | 'vendedor' = type

//         if(type === 'comprador'){
//             const selectComprador: any = lists?.listaCompradores?.find((lista) => lista.id === e)
//             setDocComprador(selectComprador?.documentos);
//         }
//         else{
//             const selectVendedor: any = lists?.listaVendedores?.find((lista) => lista.id === e)
//             setDocVendedor(selectVendedor?.documentos);
//         }
//     }

//     const openImovel = () => {
//         localStorage.setItem('tab_select', '1');
//         router.push(`/nucleo/${processData?.imovel?.processo_id}/detalhes-venda`)
//     }

//     console.log('Serviço Detalhado: ' , servicoDetalhado);

//     return (
//         <>
//             <Header
//                 imovel={processData?.imovel || {}}
//                 urlVoltar={openServico ? 'voltar' : undefined}
//                 salvarSair={openServico ? undefined : salvarSair}
//                 gerente={processData?.gerente.data[0]}
//                 responsavel={processData?.responsaveis?.data?.[0]}
//                 onVoltar={openServico ? onVoltar : undefined}
//             />
//             {!openServico
//                 ?
//                 <div className='analise-container'>
//                     <PDFViewClientOnly id={processData?.imovel.id} />
//                     <div className='cards-doc-topicos'>
//                         <AnaliseServicos
//                             processData={processData}
//                             idProcesso={idProcesso}
//                             idServicos={idServicos}
//                             servicoDetalhado={servicoDetalhado}
//                             setOpenServico={setOpenServico}
//                             setServicoDetalhado={setServicoDetalhado}
//                         />

//                         <DocUsuarios
//                             pessoa={'vendedor'}
//                             handleInput={handleInput}
//                             quantidade={lists?.qtdVendedores}
//                             lists={lists}
//                             docLists={docVendedor}
//                             loading={loading}
//                             processData={processData}
//                         />

//                         <DocUsuarios
//                             pessoa={'comprador'}
//                             handleInput={handleInput}
//                             quantidade={lists?.qtdCompradores}
//                             lists={lists}
//                             docLists={docComprador}
//                             loading={loading}
//                             processData={processData}
//                         />

//                         <section className='cards docs servicos'>
//                             <div className='title'>
//                                 <BuildingOffice2Icon className="iconOutlined" />
//                                 <h2>Imóvel</h2>
//                             </div>

//                             <div className='list-items'>
//                                 {(loading || loadingDocs)
//                                     ? <SkeletonDocumentos />
//                                     : processData?.imovel?.documentos?.data?.map((doc) => (
//                                         <div className='item' key={doc.id} >
//                                             <div className='icon-label'>
//                                                 <DocumentTextIcon width={14} height={14} />
//                                                 <p>{doc.tipo_documento_ids?.map((tipo) => ' ' + tipo.nome_tipo).toString().trim()} {doc.tipo_documento_ids?.length > 1 && <Chip className='chip neutral' label={doc.tipo_documento_ids?.length + ' tipos'}/>}</p>
//                                             </div>

//                                             <div className='icon-label actions actions-doc'>
//                                                 <ButtonComponent size={'small'} labelColor='#fff' variant={'outlined'} startIcon={''} label={'Ver documento'} onClick={() => ShowDocument(doc.id, 'documento')} />
//                                             </div>
//                                         </div>
//                                     ))}
//                             </div>
//                             <div className='btn-action'>
//                                 <ButtonComponent 
//                                     size={'large'} 
//                                     variant={'text'} 
//                                     label={'Ver detalhes do imóvel'} 
//                                     onClick={openImovel} 
//                                 />
//                             </div>
//                         </section>
//                     </div>
//                 </div>
//                 : 
//                 <DocumentosServico 
//                     setActionBtn={setActionBtn}
//                     register={register}
//                     watch={watch}
//                     setValue={setValue}
//                     setError={setError}
//                     clearErrors={clearErrors}
//                     getValues={getValues}
//                     errors={errors}
//                     lists={lists}
//                     servicoDetalhado={servicoDetalhado}
//                 />
//             }
//             <footer className='footer-checkout'>
//                 <ButtonComponent
//                     size={'large'}
//                     variant={'contained'}
//                     label={`${openServico ? 'Atualizar pós-venda' : 'Finalizar'}`}
//                     labelColor='white'
//                     disabled={false}
//                     endIcon={loading ? <CircularProgress size={20} /> : openServico ? <ArrowRightIcon width={20} fill='white' /> : <CheckIcon width={20} fill='white' />}
//                     onClick={openServico ? handleSubmit(() => onSaveServico()) : () => onSaveFinalizar()}
//                 />
//             </footer>
//         </>
//     )
// }

// // EXECUTA ANTES DO DASHBOARD
// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const { idProcesso } = context.params as { idProcesso: string };
//     return { props: { idProcesso } };
// };

// export default AnaliseDocumentosServicos;