import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import Header from '../../../../components/@Header';
import PostDadosParcelaUsuario from '@/apis/postDadosParcelaUsuario';
import { ItemListRecentsType } from '@/interfaces/Corretores';
import { Chip, Skeleton, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import ButtonComponent from '@/components/ButtonComponent';
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, ArrowRightIcon, PencilIcon, CheckIcon, PlusIcon } from "@heroicons/react/24/solid";
import ModalMetodoPagamento from '../../../../components/@ModalMetodoPagamento';
import postSelecionarContaBancariaDefault from '@/apis/postSelecionarContaBancariaDefault';
import GetListBancos from '@/apis/getListBancos';
import GetListChavesPix from '@/apis/GetListChavesPix';
import DialogMetodoTransferencia from '@/pages/corretor/components/@DialogMetodoTransferencia';
import postAlterarStatusCorretorPagamento from '@/apis/postAlterarStatusCorretorPagamento';
import MobileNavPage from '@/pages/corretor/components/MobileNavPage';
import convertReal from '@/functions/converterReal';

type ContaPrincipal = {
    id?: number,
    agencia?: string | number,
    banco_id?: number,
    numero_conta?: string,
    pix?: string,
    principal?: number,
    tipo_chave_pix_id?: number,
    nome_banco?: string,
    tipo_pagamento?: string,
    apelido?: string,
}

type ListType = {
    id: number | string
    nome: string
}

export default function ConfirmarDadosPagamento() {
    const router = useRouter();
    const { idCorretor, slug, id } = router.query;
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [dadosParcela, setDadosParcela] = useState<ItemListRecentsType | null>(null);
    const [openMetodoTransferencia, setOpenMetodoTransferencia] = useState(false);
    const [openModalMetodoTransferencia, setOpenModalMetodoTransferencia] = React.useState(false);
    const [contaReceber, setContaReceber] = useState<ContaPrincipal | null>(null);
    const [metodosTransferencia, setMetodosTransferencia] = useState<ItemListRecentsType[] | null>([])
    const [selectedMethodIndex, setSelectedMethodIndex] = useState<number>(0);
    const [listBancos, setListBancos] = useState<ListType[]>([]);
    const [listaChavesPix, setListaChavesPix] = useState<[]>([]);
    const [openFeedBack, setOpenFeedBack] = useState<boolean>(false)
    const url = `/corretor/${idCorretor}/parcela/${id}/`

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        const index = Number(value);
        setSelectedMethodIndex(index);

        const selectedMetodo = metodosTransferencia?.[index];
        console.log('ID selecionado:', selectedMetodo?.id, 'Índice:', index);
    };

    console.log('metodosTransferencia: ', metodosTransferencia)
    console.log('Índice Selecionado: ', selectedMethodIndex)
    

    const returnValores = async () => {
        console.log('DOCUMENTOS: ', dadosParcela?.documentos?.data?.length)
        setLoading(true)
        if (router.isReady && slug) {
            if(slug !== 'parcela') {
                router.push('/corretor');
            }
            else{
                if(slug === 'parcela'){
                    const response: any = await PostDadosParcelaUsuario(id as string);
                    console.log('DOCUMENTOS: ' , response?.documentos)

                    if(response?.documentos.length === 0 || response?.finance_status_id !== '10'){
                        router.push(`/corretor/${idCorretor}/${slug}/${id}/`);
                    }
                    else{
                        if(response){      
                            setDadosParcela(response);     
                            returnContaPrincipal(response);
                            setLoading(false)
                        }
                        else{
                            setLoading(true)
                            setMessage('Erro ao retornar dados da venda')
                        }
                    }
                }
            }
        }
    }

    const returnContaPrincipal = async (data: ItemListRecentsType) => {
        const listaContas = data?.contas_receber?.data?.map((data) => data) as ItemListRecentsType[];
        setMetodosTransferencia(listaContas);
        // const principal = data?.contas_receber?.data?.find((conta) => conta.principal === 1) as ContaPrincipal;
        const principal = data?.contas_receber?.data[0] as ContaPrincipal;
        setContaReceber(principal);
        setSelectedMethodIndex(0);
    }

    const returnBancos = async () => {
        const bancos = await GetListBancos() as unknown as ListType[];
        bancos?.unshift({ id: '', nome: 'Selecione...' })
        setListBancos(bancos || []);
    }

    const returnListaChavesPix = async () => {
        const chavesPix: any = await GetListChavesPix(); 
        // chavesPix.unshift({id: '', nome: ''})
        setListaChavesPix(chavesPix);
    }

    useEffect(() => {
        returnValores()
        returnBancos();
        returnListaChavesPix();
    }, [router.isReady, slug])

    const handleConfirmMetodoPagamento = (/*value: number*/ index: number) => async () => {
        // setConfirmedMethodId(selectedMethodId);
        const idParcela = id;
        const indexConta = index;
        const conta = metodosTransferencia?.[indexConta]
        const idConta = Number(conta?.id);
        const tipoConta = conta?.tipo_pagamento;     

        console.log('conta: ' , conta)
        console.log('idConta: ' , idConta)
        console.log('tipoConta: ' , tipoConta)

        const data = await postSelecionarContaBancariaDefault(idConta, idParcela, tipoConta);
        if(data){
            setOpenMetodoTransferencia(false);
            returnValores();
        }
        
    }

    const handleConfirmarMetodoPagamento = async () => {
        const status: number = 11;
        const idParcela: number = Number(id);
        const usuarioId: number = Number(localStorage.getItem('usuario_id') || 0);

        console.log('SALVA OS DADOS PARA PAGAMENTO')
        const indexConta = 0;
        const conta = metodosTransferencia?.[indexConta]
        const idConta = Number(conta?.id);
        const tipoConta = conta?.tipo_pagamento;     

        await postSelecionarContaBancariaDefault(idConta, String(idParcela), tipoConta);

        const data = await postAlterarStatusCorretorPagamento({
            usuario_id: usuarioId,
            parcela_id: idParcela,
            finance_status_id: status,
            soma: dadosParcela?.soma,
        });
        if(data){
            setOpenFeedBack(true)
        }
        else{
            console.error('Erro ao salvar dados')
        }
        // router.push(`/corretor/${idCorretor}/parcela/${id}/`)
    }

    // const confirmedMethod = metodosTransferencia?.find(m => m.id === confirmedMethodId);

    const selectedId = metodosTransferencia?.[selectedMethodIndex ?? 0]?.id;

    return (
        <>
            <Header data={dadosParcela} />
            <div className="corretor inicial-page">
                <div className="detalhes-container">
                    <div className="pagamento-container">
                        {
                            !openMetodoTransferencia
                            ?
                            <>
                                {/*Exibe os dados do metódo de transferência*/}
                                <div className="card-container">                 
                                    <Chip label={`${dadosParcela?.soma_porcentagem || 0}%`} className="chip default" />
                                    <span className="title">Valor a receber</span>
                                    <div className="valor">
                                        {
                                            dadosParcela?.soma
                                            ?
                                                <>
                                                    <span className="moeda">R$</span>
                                                    <span className="valor-numero">
                                                        {convertReal(dadosParcela?.soma)}
                                                    </span>
                                                </>
                                            :
                                            <Skeleton width={180} animation="wave" />
                                        }
                                        
                                    </div>
                                </div>

                                <div className="card-container">
                                    <div className="dados-pagamento">
                                        <h2>Confirme seus dados de pagamento:</h2>

                                        <div className="col">
                                            <div className='row'>
                                                <div className='title'>Nome completo</div>
                                                <div className='value'>{dadosParcela?.dados_corretor?.name || <Skeleton width={180} animation="wave" />}</div>
                                            </div>
                                            <div className='row'>
                                                <div className='title'>CPF</div>
                                                <div className='value'>{dadosParcela?.dados_corretor?.cpf || <Skeleton width={180} animation="wave" />}</div>
                                            </div>
                                        </div>

                                        <div className="col">
                                            <div className='row'>
                                                <div className='title'>Tipo</div>
                                                <div className='value'>{contaReceber ? (
                                                    !!contaReceber?.tipo_pagamento
                                                    ? contaReceber?.tipo_pagamento.charAt(0).toUpperCase() + contaReceber?.tipo_pagamento.slice(1)
                                                    : contaReceber?.pix 
                                                        ? 'PIX'
                                                        : 'Banco'
                                                ) : (
                                                    <Skeleton width={180} animation="wave" />
                                                )}</div>
                                            </div>
                                            
                                            {
                                                contaReceber?.tipo_pagamento === 'banco' || contaReceber?.nome_banco
                                                ?
                                                <>
                                                    <div className='row'>
                                                        <div className='title'>Instituição</div>
                                                        <div className='value'>{contaReceber?.nome_banco || <Skeleton width={180} animation="wave" />}</div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='title'>Agência/Conta</div>
                                                        <div className='value'>{contaReceber?.agencia && contaReceber?.numero_conta ? contaReceber?.agencia + ' / ' +  contaReceber?.numero_conta : <Skeleton width={180} animation="wave" /> }</div>
                                                    </div>
                                                </>
                                                : 
                                                <div className='row'>
                                                    <div className='title'>Chave PIX</div>
                                                    <div className='value'>{contaReceber?.pix || <Skeleton width={180} animation="wave" /> }</div>
                                                </div>
                                            }
                                            
                                        </div>
                                    </div>
                                </div>

                                <div className="card-container">
                                    <div className="dados-pagamento">
                                        <div className="head">
                                            <h3>Método de transferência</h3>
                                            <Chip className="chip green500" label="Padrão" />
                                        </div>
                                        {contaReceber 
                                            ? (
                                                <div className="col col-destaque">
                                                    <div className='row'>
                                                        <div className='title'>{contaReceber 
                                                            ? !contaReceber?.apelido 
                                                                ? '' 
                                                                : contaReceber?.apelido 
                                                            : <Skeleton width={180} animation="wave" />}
                                                        </div>
                                                        {
                                                            contaReceber?.tipo_pagamento === 'banco' || contaReceber?.nome_banco
                                                            ?
                                                                <>
                                                                    <div className='value'>Transferência - {contaReceber?.nome_banco || <Skeleton width={180} animation="wave" />}</div>
                                                                    <div className='value'>Ag. {contaReceber?.agencia} / Conta {contaReceber?.numero_conta || <Skeleton width={180} animation="wave" />}</div>
                                                                </>
                                                            :
                                                                <>
                                                                    <div className='value'>Transferência - {contaReceber ? 'PIX' : <Skeleton width={180} animation="wave" />}</div>
                                                                    <div className='value'>Chave - {contaReceber?.pix || <Skeleton width={180} animation="wave" />}</div>
                                                                </>
                                                        }
                                                    </div>
                                                </div>
                                            ): <Skeleton height={200} animation="wave" />
                                            
                                        }
                                        
                                        <div className="footer-btn">
                                            <ButtonComponent
                                                name="trocar"
                                                variant="text"
                                                onClick={() => {
                                                    // setSelectedMethodId(confirmedMethodId);
                                                    setOpenMetodoTransferencia(true);
                                                }}
                                                labelColor="#464F53"
                                                size={"large"}
                                                label={"Trocar"}
                                                startIcon={<PencilIcon width={20} height={20} fill={'#01988C'} />}
                                                disabled={dadosParcela ? false : true}
                                            />

                                            <ButtonComponent
                                                name="confirm"
                                                variant="contained"
                                                onClick={(e) => handleConfirmarMetodoPagamento()}
                                                labelColor="white"
                                                size={"large"}
                                                label={"Confirmar"}
                                                endIcon={<CheckIcon width={20} height={20} fill={'white'} />}
                                                disabled={dadosParcela ? false : true}
                                            />
                                        </div>
                                    </div>             
                                    <DialogMetodoTransferencia
                                        open={openFeedBack}
                                        setOpen={setOpenFeedBack}
                                        url={url}
                                        // parcelasProcesso={parcelasProcesso}
                                    />               
                                </div>
                            </>
                            :
                            <>
                                {/*Selecioona a metódo de transferência*/}
                                <div className="card-container">
                                    <div className="dados-pagamento">
                                        <h2>Escolha um método de transferência:</h2>
                                        <RadioGroup
                                            className="col col-radio"
                                            value={selectedMethodIndex}
                                            onChange={handleRadioChange}
                                        >
                                            {dadosParcela?.contas_receber?.data?.map((metodo, index) => (
                                                <FormControlLabel
                                                    key={metodo.id}
                                                    value={index}
                                                    className={selectedMethodIndex === index ? 'selected' : ''}
                                                    control={<Radio />}
                                                    label={
                                                        <div className='row-label'>
                                                                <div className='title'>{metodo 
                                                                    ? !metodo?.apelido 
                                                                        ? '' 
                                                                        : metodo?.apelido 
                                                                    : <Skeleton width={180} animation="wave" />}
                                                                </div>
                                                                {
                                                                    metodo?.tipo_pagamento === 'banco' || metodo?.nome_banco
                                                                    ?
                                                                        <>
                                                                            <div className='value'>Transferência - {metodo?.nome_banco || <Skeleton width={180} animation="wave" />}</div>
                                                                            <div className='value'>Ag. {metodo?.agencia} / Conta {metodo?.numero_conta || <Skeleton width={180} animation="wave" />}</div>
                                                                        </>
                                                                    :
                                                                        <>
                                                                            <div className='value'>Transferência - {metodo ? 'PIX' : <Skeleton width={180} animation="wave" />}</div>
                                                                            <div className='value'>Chave - {metodo?.pix || <Skeleton width={180} animation="wave" />}</div>
                                                                        </>
                                                                }
                                                        </div>
                                                    }
                                                    sx={{
                                                        border: selectedMethodIndex === index ? '1px solid #01988C' : '1px solid #eee',
                                                        borderRadius: '8px', padding: '8px', marginBottom: '8px', marginLeft: 0, marginRight: 0,
                                                        '& .MuiFormControlLabel-label': { width: '100%' },
                                                    }}
                                                />
                                            ))}
                                        </RadioGroup>
                                        
                                        <div className="footer-btn">
                                            <ButtonComponent
                                                name="trocar"
                                                variant="text"
                                                onClick={(e) => setOpenModalMetodoTransferencia(true)}
                                                labelColor="#464F53"
                                                size={"large"}
                                                label={"Adicionar novo"}
                                                startIcon={<PlusIcon width={20} height={20} fill={'#01988C'} />}
                                            />

                                            <ButtonComponent
                                                name="confirm"
                                                variant="contained"
                                                // onClick={handleConfirmMetodoPagamento(Number(selectedId)|| 0)}
                                                onClick={handleConfirmMetodoPagamento(Number(selectedMethodIndex)|| 0)}
                                                labelColor="white"
                                                size={"large"}
                                                label={"Salvar"}
                                                endIcon={<CheckIcon width={20} height={20} fill={'white'} />}
                                            />
                                        </div>
                                    </div>                            
                                </div>
                                
                                {
                                    openModalMetodoTransferencia &&
                                    <ModalMetodoPagamento 
                                        open={openModalMetodoTransferencia} 
                                        setOpen={setOpenModalMetodoTransferencia}
                                        title={'Adicione um novo método'}
                                        paperWidth={'720px'}
                                        returnValores={returnValores}
                                        setLoading={setLoading}
                                        listBancos={listBancos}
                                        listaChavesPix={listaChavesPix}
                                    />
                                }
                            </>
                        }
                    </div>  
                </div>
                
                <MobileNavPage slug={slug} /> 
            </div>
        </>
    )
}
