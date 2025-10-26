import React, {useState, useEffect} from 'react';
import ButtonComponent from '@/components/ButtonComponent';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { Chip, Link } from '@mui/material';
import styles from './Pedido.module.scss';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import UploadDocumentos from '@/components/UploadDocumentos';
import { useForm } from 'react-hook-form';
import PedidosNucleo from '@/interfaces/Nucleo/pedidos';
import ShowDocument from '@/apis/getDocument';
import NucleoInterface from '@/interfaces/Nucleo/nucleo';
import listaEstados from '@/functions/listaEstados';
import { dataDocument } from '@/interfaces/Users/document';

interface Props {
    imovelData: imovelDataInterface
    handleShow?: any
    index?: number
    saveBlocks?: () => void
    solicitacoes: PedidosNucleo[]
    setSolicitacoes: (e: PedidosNucleo[]) => void
    documentosNucleo?: NucleoInterface
    returnSolicitacoes?: () => void
};

interface FormValues {
    tipoDocumento: string
}

const Pedidos = ({ imovelData, handleShow, index, saveBlocks, solicitacoes, setSolicitacoes, documentosNucleo, returnSolicitacoes }: Props) => {
    const perfil = localStorage.getItem('perfil_login');
    const [listaDocumentos, setlistaDocumentos] = useState<any>([]);
    const [multiDocs, setMultiDocs] = useState<any>([]);
    const [showButton, setShowButton] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [docs, setDocs] = useState<dataDocument[] | []>([]);

    useEffect(() => {
        if(documentosNucleo) {
            const groupDocs = [];
            if (documentosNucleo?.imovel?.documentos?.data) {
                groupDocs.push(...documentosNucleo.imovel.documentos.data.filter((doc) => doc?.solicitacao_id));
            };
            
            documentosNucleo?.imovel?.vendedores?.data?.forEach((vendedor) => {
                if (vendedor.documentos?.data) {
                    groupDocs.push(...vendedor.documentos.data.filter((doc) => doc?.solicitacao_id));
                }
            });

            documentosNucleo?.imovel?.compradores?.data?.forEach((comprador) => {
                if (comprador.documentos?.data) {
                    groupDocs.push(...comprador.documentos.data.filter((doc) => doc?.solicitacao_id));
                }
            });
            
            setDocs(groupDocs);            
            
        }
    },[documentosNucleo])

        

    const dataContext = {
        dataProcesso: imovelData,
        selectItem: '',
        idProcesso: imovelData?.id || '',
        multiDocs,
        setMultiDocs
    };

    const {
        register,
        unregister,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
        handleSubmit,
      } = useForm<FormValues>({
        defaultValues: {
          tipoDocumento: '',
        }
    });

    const controleComprovantes = async () => {
        const arrBtn: any = [];
        solicitacoes?.forEach(e => {
            arrBtn.push({open: false});
        });
        setShowButton(arrBtn);
    };

    useEffect(() => {
        controleComprovantes()
    }, [solicitacoes])

    const handleOpen = async () => { 
        // console.log('Teste')
    };

    const handleUpload = async (e: any, index: number) => {
        solicitacoes.forEach((e, i) => {
            showButton[i].open = false; // Retorna todos para false
        });

        setMultiDocs([]);
        const updatedShowButton = [...showButton];
        updatedShowButton[index].open = true; // Aualiza somente o que foi clicado
        setShowButton(updatedShowButton);
    };

    const nomeEstado = (id: string | number) => {
        const estadosArr = listaEstados();
        let estadoArr: any = [];
        let nomeEstado: any = [];
        estadoArr = estadosArr?.find((data: any) => data.id === id) || {};
        nomeEstado = estadoArr?.nome;
        return nomeEstado;
    };
    
    return (
        <>
            {
                solicitacoes?.map((pedidos, index) => <>
                <div className='detalhes-content'>
                    <h2>{pedidos.data_criacao}</h2>
                    <div className={`row ${styles.rowNucleo}`}>
                        <div className='col 1'>
                            <div>
                                <p>Serviço</p>
                                <div className={styles.rowService}>

                                    {
                                        pedidos?.grupo_id 
                                            ? pedidos?.servicos_pedido?.data?.map((data: any, index: number) => 
                                                <>
                                                    <Chip className='chip neutral' label={data?.servico_detalhado?.tipo_servico?.nome} />
                                                    <Chip className='chip primary' label={data?.servico_detalhado?.nome} />
                                                </>
                                            ) 
                                            :
                                            <>
                                                <Chip className='chip neutral' label={pedidos?.servico_detalhado?.tipo_servico?.nome} />
                                                <Chip className='chip primary' label={pedidos?.servico_detalhado?.nome} />
                                            </>
                                    }

                                </div>
                            </div>
                        </div>
        
                        <div className='col 2'>
                            <div>
                                <p>Status no Núcleo</p>
                                <div className={styles.rowService + ' ' + styles.collumn}>

                                {
                                        pedidos?.grupo_id 
                                            ? pedidos?.servicos_pedido?.data?.map((data: any, index: number) => 
                                                <>
                                                    {
                                                        data.status_solicitação.data.map((status: any, index: number) =>
                                                            <>
                                                                <Chip 
                                                                    className={`chip 
                                                                        ${status?.id === 1 
                                                                            ? 'pimary' 
                                                                            : status?.id === 4
                                                                                ? 'green'
                                                                                : 'neutral' 
                                                                        }
                                                                    `} 
                                                                    label={status?.status || ''} 
                                                                />
                                                            </>
                                                        )
                                                    }
                                                </>
                                            ) 
                                            :
                                            <>
                                            <Chip 
                                                    className={`chip 
                                                        ${pedidos?.status_solicitação?.data?.[0]?.id === 1 
                                                            ? 'pimary' 
                                                            : pedidos?.status_solicitação?.data?.[0]?.id === 4
                                                                ? 'green'
                                                                : 'neutral' 
                                                        }
                                                    `} 
                                                    label={pedidos?.status_solicitação?.data?.[0]?.status || ''} 
                                                />
                                            </>
                                    }

                                                                      
                                </div>
                            </div>
                        </div>
        
                        <div className='col 3'>
                            <div>
                                <p>Previsão de entrega</p>
                                {
                                    pedidos?.servicos_pedido?.data?.map((data, index) => 
                                        <span key={index} className={styles.rowService}>{data?.status_solicitação?.data?.[0]?.data_previsao || '---'}</span>
                                    )
                                }
                                {/* <span className={styles.rowService}>{pedidos?.status_solicitação?.data?.[0]?.data_previsao || '---'}</span> */}
                            </div>
                        </div>
                    </div>
    
                                    
                    {/*Ônus e Comarca*/}
                    <div>
                        {
                            pedidos.onus_solicitada !== null &&
                            <div className="col" style={{marginBottom: '20px'}}>
                                <p>Ônus Reais</p>
                                <div className={styles.rowService + ' ' + styles.onusComarca}>
                                    <Chip className={`chip ${pedidos.onus_solicitada === 0 ? 'red' : 'green'}`} label={pedidos.onus_solicitada === 0 ? 'Não' : 'Sim'} />
                                    <span>{pedidos.justificativa_onus || ''}</span>
                                </div>
                            </div>
                        }

                        {
                            pedidos.vendedor_comarca !== null &&
                            <div className="col">
                                <p>Outra comarca</p>
                                <div className={styles.rowService + ' ' + styles.onusComarca}>
                                    <Chip className={`chip ${pedidos.vendedor_comarca === 0 ? 'red' : 'green'}`} label={pedidos.vendedor_comarca === 0 ? 'Não' : 'Sim'} />
                                    {
                                        pedidos?.comarca?.length !== 0
                                        ? pedidos?.comarca?.map((data) => 
                                            <><span>{data?.name} - {nomeEstado(data?.estado_id?.toString() || '') || ''}</span></>
                                        )
                                        : '---'
                                    }
                                </div>
                            </div>
                        }
                    </div>

                    <p className={styles.rowTitle}>Documentos enviados do núcleo</p>
                    <div className={styles.doc}>
                        <div className={styles.docHeader}>
                            <p>Tipo</p>
                            {/* <p>Emissão</p>
                            <p>Vencimento</p> */}
                            <p>Identificação</p>
                            <p>Nome do arquivo</p>
                        </div>

                        <div className={styles.docRow}>
                            {
                                pedidos?.servicos_pedido?.data?.map((pedido) => 
                                    <>
                                        <div className={pedido?.Documentos?.data?.length ? styles.docRowLine : ''}>
                                            {
                                                pedido?.Documentos?.data?.length ?
                                                pedido?.Documentos?.data?.map((doc) =>
                                                    <>
                                                        <>
                                                            <span className={styles.docName}>{doc?.tipos_multiplos_documentos?.map((tipo) => tipo.nome_tipo).join(', ')}</span>
                                                        </>
                                                        
                                                        {/* <>
                                                            <span className={styles.docName}>{doc?.tipos_multiplos_documentos?.map((tipo) => tipo.data_emissao || '---').join(', ')}</span>
                                                        </>

                                                        <>
                                                            <span className={styles.docName}>{doc?.tipos_multiplos_documentos?.map((tipo) => tipo.data_vencimento || '---').join(', ')}</span>
                                                        </> */}

                                                        <>
                                                            <span className={styles.docName}>{doc?.identificacao}</span>
                                                        </>

                                                        <>
                                                            <Link key={doc.id} className='link' onClick={() => ShowDocument(doc.id || '', 'documento')}>
                                                                {!doc.nome_original ? doc.arquivo : doc.nome_original}
                                                            </Link>
                                                        </>
                                                    </>
                                                )
                                                : ''
                                            }
                                        </div>
                                    </>
                                )
                            }

                            {/*Template para quando não tiver nenhum documento*/}
                            <>
                                {
                                    docs?.filter((doc: any) => doc.solicitacao_id === pedidos.id).length === 0 &&
                                    <>
                                        <div className={styles.docRowLine}>
                                            <><span className={styles.docName}>---</span></>
                                            <><span className={styles.docName}>---</span></>
                                            <><span className={styles.docName}>---</span></>
                                            {/* <><span className={styles.docName}>---</span></> */}
                                        </div>
                                    </>
                                }
                            </>
                        </div>
                    </div>

                    <div className={`row ${styles.rowNucleo}`}>
                        {/* <div className='col 1'>
                            <div>
                                <p>Tipo</p>
                                <div className={styles.collumn}>
                                    {docs.map((doc) => doc.solicitacao_id === pedidos.id
                                        ? <>
                                            {doc.tipo_documento?.nome
                                                ? <span className="mensagem fw400" style={{marginBottom: '15px'}}>{doc.tipo_documento.nome}</span>
                                                : <span className="mensagem fw400" style={{marginBottom: '15px'}}>{doc.tipos_multiplos_documentos.map((e: any) => e.nome_tipo).join(', ')}</span>
                                            }
                                        </>
                                        : ""
                                    )}
                                </div>
                            </div>
                        </div>
        
                        <div className='col 2'>
                            <p>Nome do arquivo</p>
                            <div className={styles.collumn}>
                                {docs.map((doc) => doc.solicitacao_id === pedidos.id
                                    ? <>
                                        <Link key={doc.id} className='link' onClick={() => ShowDocument(doc.id, 'documento')}>
                                            {!doc.nome_original ? doc.nome_original : doc.arquivo}
                                        </Link>
                                    </>
                                    : ""
                                )}
                            </div>
                        </div> */}
                    </div>
    
                    <div className={`row ${styles.rowNucleo}`} style={{flexDirection: 'inherit'}}>
                        <div className='col 1' style={{maxWidth: 'inherit'}}>
                            <div>
                                <p>Observações do núcleo</p>
                                <div className={styles.content}>
                                    {
                                        pedidos?.servicos_pedido?.data.map((data) => 
                                            <>
                                                <div style={{marginBottom: '10px'}}>
                                                    {
                                                        data?.status_solicitação?.data?.[0]?.mensagem
                                                        ? <><Chip className='chip neutral' label={data?.servico_detalhado?.tipo_servico?.nome} /> <span>{data?.status_solicitação?.data?.[0]?.mensagem || '---'}</span></>
                                                        : ''
                                                    }
                                                </div> 
                                                
                                            </>
                                        ) 
                                    }
                                    {/* {pedidos.status_solicitação?.data?.[0]?.mensagem || '---'} */}
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div className={`row ${styles.rowNucleo}`} style={{flexDirection: 'inherit'}}>
                        <div className='col 1' style={{maxWidth: 'inherit'}}>
                            <div>
                                <p>Observações do pós-venda</p>
                                <div className={styles.content} style={{display: 'flex', flexDirection: 'column'}}>
                                    {/* {pedidos.observacao || '---'} */}
                                    {
                                        pedidos?.grupo_id 
                                            ? pedidos?.servicos_pedido?.data?.map((data: any, index: number) => 
                                                <>
                                                    <div style={{marginBottom: '8px'}}>
                                                        {!!data?.observacao && <Chip className='chip neutral' label={data?.servico_detalhado?.tipo_servico?.nome} />} <span>{data?.observacao || ''}</span>
                                                    </div>
                                                </>
                                            ) 
                                            :
                                            <div>
                                                {!!pedidos?.observacao && <Chip className='chip neutral' label={pedidos?.servico_detalhado?.tipo_servico?.nome} />} <span>{pedidos?.observacao || ''}</span>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/*Depois que o Pós ou o Núcleo enviou o seu documento de referência, esse botão some*/}
                    {/*Exibe o componente de Upload quando clica no botão*/}
                    {                        
                        loading === false &&
                        showButton?.[index]?.open === false ? 
                            perfil === 'Pós-venda' && pedidos?.Documentos?.data?.find((doc: any) => doc.tipo_documento?.id === 62)
                            || perfil === 'Núcleo' && pedidos?.Documentos?.data?.find((doc: any) => doc.tipo_documento?.id === 61) ?
                                ''
                                :
                                (perfil === 'Pós-venda' || perfil === 'Núcleo') && pedidos?.Documentos?.data?.find((doc: any) => doc.tipo_documento?.id !== 62) &&
                                <div className={styles.btnDoc}>
                                    <ButtonComponent 
                                        size={'small'} 
                                        variant={'text'} 
                                        label={'Inserir comprovante de pagamento'} 
                                        startIcon={<DocumentTextIcon width={24} height={24} />}
                                        onClick={e => handleUpload(e, index)}
                                    />
                                </div>
                            :
                            <div className="content">
                                <UploadDocumentos                                     
                                    register={register}
                                    errors={errors}
                                    context={dataContext}                                     
                                    pessoa="imovel" 
                                    idDonoDocumento={''} 
                                    option={[{
                                        id: '',
                                        nome: 'boleto',
                                        tipo: 'boleto',
                                        validade_dias: null
                                    }]} 
                                    idPedido={pedidos?.id}
                                    pedidoDocumentoId={localStorage.getItem('perfil_login') === 'Pós-venda' ? 62 : 61}
                                    idProcessoPedido={documentosNucleo?.id}
                                    refresh={returnSolicitacoes}
                                />
                            </div>
                    }
    
                    {/*Depois que o documento for adicionado exibe o que foi enviado pelo Pós e pelo Núcleo*/}
                    {
                        (pedidos?.Documentos?.data?.length !== 0 && localStorage.getItem('perfil_login') === 'Pós-venda') &&
                        <>
                            <p className={styles.rowTitle}>Cobrança</p>
                            <div className={`row ${styles.rowNucleo}`}>
                                <div className='col 1'>
                                    <div className={styles.collumn}>
                                        <p>Tipo</p>
                                        {
                                            pedidos?.Documentos?.data?.map((documento) => 
                                                <>
                                                    <span style={{marginBottom: '0'}}>{documento.tipo_documento?.id === 61 ? 'BOLETO' : ''}</span>
                                                    <span style={{marginBottom: '0'}}>{documento.tipo_documento?.id === 62 ? 'COMPROVANTE' : ''}</span>
                                                </>
                                            )
                                        }
                                    </div>
                                </div>

                                <div className='col 2'>
                                    <div className={styles.collumn}>
                                        <p>Nome do arquivo</p>
                                        {
                                            pedidos?.Documentos?.data?.map((documento) => 
                                                <>
                                                    <div>
                                                        {
                                                            documento.tipo_documento?.id === 61 ?
                                                                <Link key={documento.id} className='link' onClick={() => ShowDocument(documento.id, 'boleto')} style={{marginBottom: '0'}}>
                                                                    {documento.nome_original}
                                                                </Link>
                                                            : ''
                                                        }
                                                    </div>

                                                    <div>
                                                        {
                                                            documento.tipo_documento?.id === 62 ?
                                                                <Link key={documento.id} className='link' onClick={() => ShowDocument(documento.id, 'comprovante')} style={{marginBottom: '0'}}>
                                                                {!documento.nome_original ? documento.arquivo : documento.nome_original}
                                                            </Link>
                                                            : ''
                                                        }
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {/* <p className={styles.rowTitle}>Cobrança</p>
                    <div className={`row ${styles.rowNucleo}`}>
                        <div className='col 1'>
                            <div>
                                <p>Tipo</p>
                                <div className={styles.collumn}>
                                    <span>BOLETO</span>
                                    <span>COMPROVANTE</span>
                                </div>
                            </div>
                        </div>
        
                        <div className='col 2'>
                            <div className={styles.collumn}>
                                <p>Nome do arquivo</p>
                                <span>1231443534645645.pdf</span>
                                <span>1231443534645645.pdf</span>
                            </div>
                        </div>
                    </div> */}
                </div>
            </>)}
        </>
    )
}

export default Pedidos;
