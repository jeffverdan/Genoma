import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Header from '@/components/DetalhesVenda/Header';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import InputSelect from '@/components/InputSelect/Index';
import { useForm } from 'react-hook-form';
import ButtonComponent from '@/components/ButtonComponent';
import RadioGroup from '@/components/RadioGroup';
import { ArrowRightIcon, TrashIcon } from '@heroicons/react/24/solid';
import PostLocalizaProcesso from '@/apis/postLocalizaProcesso';
import TextArea from '@/components/TextArea';
import getTypesServices from '@/apis/getTypeServices';
import getDetailedServices from '@/apis/getDetailedServices';
import CheckBox from '@/components/CheckBox';
import { CircularProgress, Skeleton } from '@mui/material';
import DialogConcluirPedido from '@/components/DialogConcluirPedido';
import { useRouter } from 'next/router';
import GetLaudemiosList from '@/apis/getLaudemiosList';
import InputText from '@/components/InputText/Index';
import Pessoa from '@/interfaces/Users/userData';
import listaEstados from '@/functions/listaEstados';

interface Servico {
  tipo?: number | string;
  servicoDetalhado?: number | string;
  valorServicoDetalhado?: number | string;
  observacao?: string;
}

interface Comarca {
    vendedor?: string;
    estado?: string;
}

interface FormValues {
  quantidade_servicos: number | string;
  quantidade_comarca: number | string;
  servico?: Servico[];
  onus_solicitada: string;
  vendedor_comarca: string;
  justificativa_onus: string,
  vendedores_comarca?: Comarca[]
}

interface TipoServico {
    id?: number | string;
    nome?: string;
    tipo_servico?: {
        id?: number | string;
        nome?: string;
    }[];
}

interface Laudemios {
    tipo_laudemio?: string,
    valor_laudemio?: string,
    id?: number | string,
    tipo_laudemio_id?: number,
    nome?: string
}

interface ListaVendedores {
    id: string | number; 
    name: string | undefined; 
    uf?: string 
}

const PainelPedidos = ({ idProcesso }: { idProcesso: string }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [processData, setProcessData] = useState<ProcessType>();
    const errorMsg = 'Campo obrigatório';
    const [newStatus, setNewStatus] = useState(true);
    const [arrQtd, setArrQtd] = useState([]);
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [vendedoresComarca, setVendedoresComarca] = useState<Comarca[]>([]);
    const [listaTipoServico, setListaTipoServico] = useState([]);
    const [listaDetalheServico, setListaDetalheServico] = useState<TipoServico[]>([]);
    const [listaDetalhesServicoSelecionada, setListaDetalhesServicoSelecionada] = useState<TipoServico[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [onus, setOnus] = useState([
        { value: '1', disabled: false, label: 'Sim', checked: false },
        { value: '0', disabled: false, label: 'Não', checked: false }
    ]);
    const [comarca, setComarca] = useState([
        { value: '1', disabled: false, label: 'Sim', checked: false },
        { value: '0', disabled: false, label: 'Não', checked: false }
    ]);
    const [dataToSave, setDataToSave] = useState<FormValues>();
    const [selectFamilia, setSelectFamilia] = useState<Laudemios[]>([]);
    const [selectIgreja, setSelectIgreja] = useState<Laudemios[]>([]);
    const objInicial = {id: '0', nome: 'Selecione...'};
    const objTipo = {id: '0', nome: 'Selecione o tipo de serviço'};
    const objDetalhado = {id: '0', nome: 'Selecione o serviço detalhado'};
    const estados = listaEstados();
    const [listVendedores, setListVendedores] = useState<ListaVendedores[]>([]);
    
    const {
        register,
        watch,
        setValue,
        getValues,
        clearErrors,
        setError,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
        quantidade_servicos: '',
        onus_solicitada: '',
        vendedor_comarca: '',
        servico: [{
            tipo: '',
            servicoDetalhado: '',
            valorServicoDetalhado: '', // Usado para valores como por exemplo Familias do Laudemio e RIP
            observacao: '',
        }],
        justificativa_onus: '',
        quantidade_comarca: '',
        vendedores_comarca: [
            // {
            //     vendedor: '',
            //     estado: ''
            // }
        ]
        },
    });

    console.log('WATCH: ', watch());
    console.log('ERRORS: ', errors);

    const returnProcess = async () => {
        setLoading(true);

        // Serviços
        const servicos: any = await getTypesServices();
        servicos.unshift(objTipo);
        setListaTipoServico(servicos);

        // Serviços Detalhados
        const servicosDetalhados: any = await getDetailedServices();
        servicosDetalhados.unshift(objDetalhado);
        setListaDetalheServico(servicosDetalhados);

        // Quantidade
        const array: any = [];
        for (let i = 1; i <= 10; i++) {
            array.push({ id: i.toString(), name: String(i) });
        }
        array.unshift(objInicial);
        setArrQtd(array);

        // Dados de Vendedores
        const res: ProcessType = await PostLocalizaProcesso(idProcesso) as unknown as ProcessType;    
        const newArrayVendedores = res.vendedores.flatMap((obj: Pessoa) => {
            if (!!obj?.representante_socios?.data?.[0]) {
                return [obj, ...obj?.representante_socios?.data];
            } else {
                return obj;
            }
        });
        const optionsVendedores = newArrayVendedores.map((vendedor) => ({id: vendedor.id, name: vendedor.name || vendedor.nome_fantasia, uf: vendedor.estado}))
        optionsVendedores.unshift({id: '0', name: 'Selecione', uf: ''});
        setListVendedores(optionsVendedores)

        // Laudemios
        const laudemiosList: any = await GetLaudemiosList();
        const selectFamilia = laudemiosList.filter((lista: any) => lista.tipo_laudemio_id === 3);
        const selectIgreja = laudemiosList.filter((lista: any) => lista.tipo_laudemio_id === 4);
        selectFamilia.unshift({id: '0', nome: 'Selecione uma família'});
        selectIgreja.unshift({id: '0', nome: 'Selecione uma igreja'});
        setSelectFamilia(selectFamilia);
        setSelectIgreja(selectIgreja);

        if(res){
            indicarServicos(servicosDetalhados, res);
        }

        setProcessData(res);
        setLoading(false);
    };
    console.log('LIST VENDEDORES: ' , listVendedores)

    const indicarServicos = (servicosDetalhados: any[], res: ProcessType) => {             
        const totalVendedores: number = res.vendedores.length; // PJ considera só a empresa, no caso se só tiver a empresa ai é jogo de solteiro, independente da quantidade de representantes e sócios.

        // Verificar se um serviço indicado já foi solicitado
        const resServicosDetalhados = res?.solicitacao_nucleo?.map((valor: any) => valor.servico_detalhado);
        const solicitouJogo = resServicosDetalhados?.filter((id: any) => id?.id === (totalVendedores >= 5 ? 5 : totalVendedores));
        const solicitouLaudemio: any = resServicosDetalhados?.filter((id: any) => id?.id === 21 || id?.id === 20 || id?.id === 18 || id?.id === 19);
        const quantVendedores = solicitouJogo?.length !== 0 ? 0 : 1;

        // Valor Solicitação de serviços
        const resValorServicoSolicitado = res?.solicitacao_nucleo?.map((valor: any) => valor.valor_servico_detalhado);
        const solicitacaoValorServicoLaudemio = resValorServicoSolicitado?.filter((valor: any) => valor?.id === 1 || valor?.id === 2 || valor?.id === 3 || valor?.id === 4 || valor?.id === 5 || valor?.id === 6 || valor?.id === 7 || valor || valor === null || valor === '');

        // Quantidade Laudemio e Averbação
        const laudemios: any = res?.imovel?.laudemios;
        const quantLaudemio = (laudemios.length - solicitouLaudemio?.length) < 0 ? 0 : (laudemios.length - solicitouLaudemio?.length) || 0;
        const quantAverbacao: number = 0;

        // Somar todas as quantidades
        const somaPedidos = quantVendedores + quantLaudemio + quantAverbacao;
        
        setValue('quantidade_servicos', somaPedidos.toString());              
        
        // Averbação
        const averbacao = '';

        // Array para os serviços
        const arrServicos: Servico[] = [];        

        // Jogo de Certidão
        if(solicitouJogo?.length === 0){
            arrServicos.push({
                tipo: '1',
                servicoDetalhado: totalVendedores >= 5 ? '5' : totalVendedores.toString(),
                valorServicoDetalhado: '',
                observacao: '',
            })
        }
        
        // Laudemio
        let tipoLaudemio: string | number;
        let valorLaudemio: string | number;
        
        laudemios?.forEach((element: any, index: number) => {
            // ID da lista de laudemios
            // 1 - União
            // 2 - Prefeitura
            // 3 - Familia
            // 4 - Igreja

            // ID da lista de serviços
            // 20 - Prefeitura
            // 21 - União
            // 19 - Familia
            // 18 - Igreja

            valorLaudemio = element.valor_laudemio;

            switch (element?.tipo_laudemio) {
                case '1':
                    tipoLaudemio = '21' // União
                    break;

                case '2':
                    tipoLaudemio = '20' // Prefeitura
                    break;

                case '3':
                    tipoLaudemio = '19' // Familia
                    break;
                
                case '4':
                    tipoLaudemio = '18' // Igreja
                    break;
                
                default:
                    tipoLaudemio = ''
                    break;
            }

            const encontrado = solicitacaoValorServicoLaudemio?.map((valor: any) => valor);
            const familiaIgreja = encontrado?.filter(item => typeof item === 'object');
            const ripPrefeitura = encontrado?.filter(item => typeof item !== 'object' && solicitouLaudemio.some((valor: any) => valor.id === 21) || (item === null && solicitouLaudemio.some((valor: any) => valor.id === 20)));
            if (
                !familiaIgreja?.some(item => item?.id === Number(valorLaudemio)) && // Verifica em 'familia' pelo id
                !ripPrefeitura?.includes(valorLaudemio) // Verifica em 'rip e prefeitura'
            ) {
                arrServicos.push({
                    tipo: '5',
                    servicoDetalhado: tipoLaudemio,
                    valorServicoDetalhado: valorLaudemio,
                    observacao: '',
                });
            }
        });

        setServicos(arrServicos);
        setValue('servico', arrServicos);
        clearErrors('servico');

        // Select da lista de Certidões
        const servicosJogoCertidao = servicosDetalhados.filter(
            (detalhe: any) => detalhe.tipo_servico?.id === 1
        );
        servicosJogoCertidao.unshift(objDetalhado)

        const servicosAverbacao = servicosDetalhados.filter(
            (detalhe: any) => detalhe.tipo_servico?.id === 2
        );
        servicosAverbacao.unshift(objDetalhado)

        const servicosLaudemio = servicosDetalhados.filter(
            (detalhe: any) => detalhe.tipo_servico?.id === 5
        );
        servicosLaudemio.unshift(objDetalhado)

        // console.log('SERVICOS JOGO CERTIDAO: ' , servicosJogoCertidao)
        // console.log('SERVICOS AVERBACAO: ' , servicosAverbacao)
        // console.log('SERVICOS LAUDEMIO: ' , servicosLaudemio)
        
        if(somaPedidos === 0){
            listaDetalheServico.unshift(objDetalhado);
        } 
        else{
            setListaDetalhesServicoSelecionada((prevState) => {
                const newState: any[] = [objDetalhado, ...prevState];
            
                // Se solicitouJogo tem itens, atribui servicosJogoCertidao ao newState[0]
                if (solicitouJogo?.length === 0) {
                    newState[0] = servicosJogoCertidao;
            
                    // Caso existam laudemios, eles começam a ser adicionados a partir de newState[1]
                    if (laudemios?.length > 0) {
                        for (let i = 0; i < laudemios.length; i++) {
                            newState[i + 1] = servicosLaudemio;
                        }
                    }
                } 
                // Se solicitouJogo está vazio, servicosLaudemio passa a ser newState[0]
                else if (laudemios?.length > 0) {
                    for (let i = 0; i < laudemios.length; i++) {
                        newState[i] = servicosLaudemio;
                    }
                }
            
                // Mantém outros loops ou lógicas, como o de averbacao
                // for (let i = 0; i < averbacao.length; i++) {
                //     newState[i + 1] = servicosAverbacao;
                // }
            
                return newState;
            });
        }
    }

    useEffect(() => {
        returnProcess();
    }, []);

    const salvarSair = () => {};

    const onVoltar = () => {
        setNewStatus(false);
        sessionStorage.removeItem('sugestao-servicos')
        router.back();
    };

    const onClose = () => {
        setOpenModal(false);
    }

    const handleQuantidade = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const valor = parseInt(e.target.value);
        const valoresAnteriores = getValues('servico') || [];

        const novosServicos: Servico[] = [];
        for (let i = 0; i < valor; i++) {
            novosServicos.push(
                valoresAnteriores[i] || {
                tipo: '',
                servicoDetalhado: '',
                valorServicoDetalhado: '',
                observacao: '',
                }
            );
        }
        setServicos(novosServicos);
        setValue('servico', novosServicos);
        clearErrors('servico');
    };   

    const handleSelectServicos = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const tipo_servico = e.target.value.toString();
        const detalheServico = listaDetalheServico.filter(
            (detalhe: any) => detalhe.tipo_servico?.id === parseInt(tipo_servico)
        );
        detalheServico.unshift(objDetalhado)
        
        setListaDetalhesServicoSelecionada((prevState) => {
            const newState: any[] = [...prevState];
            newState[index] = detalheServico;
            return newState;
        });

        setValue(`servico.${index}.tipo`, tipo_servico);
        servicos[index].tipo = tipo_servico;
        clearErrors(`servico.${index}.tipo`);

        setValue(`servico.${index}.servicoDetalhado`, '');
        servicos[index].servicoDetalhado = '';
        clearErrors(`servico.${index}.servicoDetalhado`);
    };

    const handleObservacao = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
        setValue(`servico.${index}.observacao`, e.target.value);
        servicos[index].observacao = e.target.value;
    };

    const handleRemoverServico = (index: number) => {
        const valoresAtuais = getValues('servico') || [];
        const novosServicos = valoresAtuais.filter((_, i) => i !== index);
        setServicos(novosServicos);
        setValue('servico', novosServicos);
        clearErrors('servico');

        if(novosServicos.length === 0) {
            setValue('quantidade_servicos', '')
            setValue('onus_solicitada', '');
            clearErrors('onus_solicitada');
            setValue('vendedor_comarca', '');
            clearErrors('vendedor_comarca');
        } 
        else {
            setValue('quantidade_servicos', novosServicos.length)
        }

        listaDetalhesServicoSelecionada.splice(index, 1);
    };

    const clearErrorsOnus = async () => {
        clearErrors('onus_solicitada');
    }

    const clearErrorComarca = async () => {
        clearErrors('vendedor_comarca');
    }

    const handleSelectDetalhesServicos = (e: any, index: number, type: string) => {
        const value = e.target.value.toString();
        servicos[index].servicoDetalhado = value;
        setValue(`servico.${index}.servicoDetalhado`, value);
        clearErrors(`servico.${index}.servicoDetalhado`);
        
        servicos[index].valorServicoDetalhado = '';
        setValue(`servico.${index}.valorServicoDetalhado`, '');
        clearErrors(`servico.${index}.valorServicoDetalhado`);
    }

    const handleLaudemioDetalhado = (e: any, index: number, type: string) => {
        const value = e.target.value.toString();
        servicos[index].valorServicoDetalhado = value;
        setValue(`servico.${index}.valorServicoDetalhado`, value);
        clearErrors(`servico.${index}.valorServicoDetalhado`);
    }

    const onSaveNewStatus = async (data: FormValues) => {
        if(watch('onus_solicitada') === '' && watch('vendedor_comarca') === ''){
            setError('onus_solicitada', {message: errorMsg});
            setError('vendedor_comarca', {message: errorMsg});
        }

        setDataToSave(data);
        setOpenModal(true);
    };

    // console.log('WATCH SERVIÇOS: ' , watch('servico'))
    // console.log('ERRORS: ' , errors)
    // console.log('SERVICOS: ' , servicos);

    const handleJustificativaOnus = (e: any) => {
        setValue('justificativa_onus', e.target.value);
        if(e.target.value.length > 0) clearErrors('justificativa_onus')
        else setError('justificativa_onus', {message: errorMsg})
    }

    const clearJustificativaOnus = async (e: any) => {
        if(watch('onus_solicitada') === '1') setValue('justificativa_onus', '');
        clearErrors('justificativa_onus');
    }

    const clearSelectComarca = async (e: any) => {
        if(watch('vendedor_comarca') === '0') {
            setValue('quantidade_comarca', '')
            setValue('vendedores_comarca', [])
        }
        clearErrors('vendedor_comarca');
        clearErrors('quantidade_comarca');
        clearErrors('vendedores_comarca');
    }

    const handleQuantidadeComarca = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const valor = parseInt(e.target.value);
        const valoresAnteriores = getValues('vendedores_comarca') || [];

        const novasComarcas: Comarca[] = [];
        for (let i = 0; i < valor; i++) {
            novasComarcas.push(
                valoresAnteriores[i] ||
                {
                    vendedor: '',
                    estado: '',
                }
            );
        }
        setVendedoresComarca(novasComarcas);
        setValue('vendedores_comarca', novasComarcas);
        clearErrors('vendedores_comarca');
    };  

    const handleVendedores = (e: any, index: number) => {
        const value = e.target.value;
        const ufVendedor = listVendedores.find((vendedor) => vendedor.id === value)?.uf;
        const selecionarEstado: any = estados?.find((estado) => estado.uf === ufVendedor);
        setValue(`vendedores_comarca.${index}.estado`, selecionarEstado?.id);
        clearErrors(`vendedores_comarca.${index}.estado`);
    }


    return (
    <>
        <Header
            imovel={processData?.imovel || {}}
            urlVoltar={'/posvenda'}
            salvarSair={newStatus ? undefined : salvarSair}
            gerente={processData?.gerente.data[0]}
            onVoltar={newStatus ? onVoltar : undefined}
        />

        <div className='new-status-container'>
            <div className='cards'>
                
                {
                    loading === false ?
                    <>
                        <h2>Deseja solicitar serviço ao Núcleo?</h2>
                        <p>
                            Selecione os tipos de serviços que deseja encaminhar ao Núcleo. <br />
                            Se necessário, adicione uma observação para fornecer mais detalhes<br /> 
                            sobre o serviço solicitado.
                        </p>
                        <InputSelect
                            label={'Quantos serviços nessa solicitação?*'}
                            option={arrQtd || []}
                            placeholder={'Selecione o tipo de serviço'}
                            error={!!errors.quantidade_servicos}
                            msgError={errors.quantidade_servicos}
                            required={true}
                            // sucess={!errors.quantidade_servicos && !!watch('quantidade_servicos')}
                            value={watch('quantidade_servicos') || '0'}
                            {...register('quantidade_servicos', {
                                validate: (value) => {
                                    if (value === '0') {
                                        return 'Nenhuma quantidade foi selecionada';
                                    }
                                },
                                required: errorMsg,
                                onChange: handleQuantidade,
                            })}
                        />
                    </>
                    : 
                    <>
                        <Skeleton animation="wave" variant="rectangular" height={40} width={500} style={{borderRadius: '10px'}} />
                        <Skeleton animation="wave" variant="rectangular" height={28} width={434} style={{borderRadius: '10px'}} />
                        <Skeleton animation="wave" variant="rectangular" height={85} width={434} style={{borderRadius: '10px'}} />
                    </>

                }
            </div>

            {
                loading === false && servicos.length !== 0 ?
                <>
                    {servicos.map((servico, index) => (
                        <div key={index} className='cards'>
                            <p>Serviço {`${index + 1}`}</p>

                            <div className='selects-line'>
                                <InputSelect
                                    option={listaTipoServico}
                                    label={'Tipo de Serviço *'}
                                    placeholder={'Selecione...'}
                                    error={!!errors.servico?.[index]?.tipo}
                                    msgError={errors.servico?.[index]?.tipo}
                                    required={true}
                                    sucess={!errors.servico?.[index]?.tipo && !!watch(`servico.${index}.tipo`)}
                                    value={watch(`servico.${index}.tipo`) || '0'}
                                    {...register(`servico.${index}.tipo`, {
                                        validate: (value) => {
                                            if (value === '0') {
                                            return 'Nenhum tipo de serviço foi selecionado';
                                            }
                                        },
                                        required: errorMsg,
                                        onChange: (e) => handleSelectServicos(e, index),
                                    })}
                                />

                                <InputSelect
                                    option={listaDetalhesServicoSelecionada[index] || [objDetalhado]}
                                    label={'Serviço Detalhado *'}
                                    placeholder={'Selecione...'}
                                    disabled={!watch(`servico.${index}.tipo`)}
                                    error={!!errors.servico?.[index]?.servicoDetalhado}
                                    msgError={errors.servico?.[index]?.servicoDetalhado}
                                    required={true}
                                    sucess={!errors.servico?.[index]?.servicoDetalhado && !!watch(`servico.${index}.servicoDetalhado`)}
                                    value={watch(`servico.${index}.servicoDetalhado`) || '0'}
                                    {...register(`servico.${index}.servicoDetalhado`, {
                                        validate: (value) => {
                                            if (value === '0') {
                                                return 'Nenhum serviço detalhado foi selecionado';
                                            }
                                        },
                                        required: errorMsg,
                                        onChange: (e) => handleSelectDetalhesServicos(e, index, ''),
                                    })}
                                />
                            </div>

                            <>
                                {/* LAUDEMIO === UNIÃO */}
                                {servico.servicoDetalhado === '21' &&
                                    <InputText
                                        label='Insira o RIP referente ao laudêmio*'
                                        placeholder='9999.99999.999-9'
                                        error={!!errors?.servico?.[index]?.valorServicoDetalhado}
                                        msgError={errors.servico?.[index]?.valorServicoDetalhado}
                                        value={servico.valorServicoDetalhado}
                                        required={true}
                                        {...register(`servico.${index}.valorServicoDetalhado`, {
                                            required: errorMsg,
                                        })} 
                                        onChange={e => handleLaudemioDetalhado(e, index, 'uniao')}
                                    />
                                }

                                {/* LAUDEMIO === FAMÍLIA */}
                                {servico.servicoDetalhado === '19' &&
                                    <InputSelect
                                        label='Selecione a família referente ao laudêmio*'
                                        error={!!errors?.servico?.[index]?.valorServicoDetalhado}
                                        msgError={errors.servico?.[index]?.valorServicoDetalhado}
                                        option={selectFamilia}
                                        value={servico.valorServicoDetalhado || '0'}
                                        required={true}
                                        sucess={!errors.servico?.[index]?.valorServicoDetalhado && !!watch(`servico.${index}.valorServicoDetalhado`)}
                                        {...register(`servico.${index}.valorServicoDetalhado`, {
                                            required: errorMsg,
                                            validate: (value) => {
                                                if (value === '0') {
                                                return 'Nenhuma familia foi selecionada';
                                                }
                                            },
                                        })} 
                                        onChange={e => handleLaudemioDetalhado(e, index, 'familia')}
                                    />
                                }

                                {/* LAUDEMIO === IGREJA */}
                                {servico.servicoDetalhado === '18' &&
                                    <InputSelect
                                        label='Selecione a igreja referente ao laudêmio*'
                                        error={!!errors?.servico?.[index]?.valorServicoDetalhado}
                                        msgError={errors.servico?.[index]?.valorServicoDetalhado}
                                        option={selectIgreja}
                                        value={servico.valorServicoDetalhado || '0'}
                                        required={true}
                                        sucess={!errors.servico?.[index]?.valorServicoDetalhado && !!watch(`servico.${index}.valorServicoDetalhado`)}
                                        {...register(`servico.${index}.valorServicoDetalhado`, {
                                            required: errorMsg,
                                            validate: (value) => {
                                                if (value === '0') {
                                                return 'Nenhuma igreja foi selecionada';
                                                }
                                            },
                                        })} 
                                        onChange={e => handleLaudemioDetalhado(e, index, 'igreja')}
                                    />
                                }
                            </>

                            <TextArea
                                label={`Observações referentes ao Serviço ${index + 1}`}
                                minRows={4}
                                placeholder='Exemplo: outorgante de outra comarca'
                                value={watch(`servico.${index}.observacao`) || ''}
                                {...register(`servico.${index}.observacao`, {
                                    required: false,
                                    onChange: (e) => handleObservacao(e, index),
                                })}
                            />

                            {/* {
                                Number(watch('quantidade_servicos')) > 1 &&
                                <ButtonComponent
                                    name='danger'
                                    size={'large'}
                                    variant={'contained'}
                                    label={''}
                                    labelColor='white'
                                    disabled={false}
                                    startIcon={<TrashIcon width={20} fill='white' />}
                                    onClick={(e) => handleRemoverServico(index)}
                                />
                            } */}
                        </div>
                    ))}

                    {
                        watch('quantidade_servicos') &&
                        <div className='cards' >
                            <h2>Informações adicionais</h2>
                            <p>Selecione as opções abaixo para agilizar o trabalho do Núcleo</p>

                            <div style={{position: 'relative'}}>
                                <p style={{fontWeight: '700'}}>A ônus reais será solicitada nesse momento?*</p>
                                <div className='selects-line' style={{margin: '30px 0'}}>
                                    <RadioGroup 
                                        {...register(`onus_solicitada`, {
                                            required: errorMsg,
                                        })} 
                                        label={''} 
                                        options={onus} 
                                        setOptions={setOnus} 
                                        name='onus_solicitada' 
                                        value={watch('onus_solicitada')} 
                                        setValue={setValue} 
                                        changeFunction={e => clearJustificativaOnus(e)}
                                    />
                                    {
                                        (errors.onus_solicitada && watch('onus_solicitada') === '') &&
                                        <p className="errorMsg" style={{position: 'absolute', bottom: '0px'}}>{'*' + errors.onus_solicitada.message}</p>
                                    }
                                </div>

                                {
                                    watch('onus_solicitada') === '0' &&
                                    <>
                                        <TextArea
                                            label={'Justificativa*'}
                                            minRows={2}
                                            placeholder={'Digite aqui o motivo...'}
                                            value={watch('justificativa_onus')}
                                            error={!!errors.justificativa_onus}
                                            {...register('justificativa_onus', {
                                                required: errorMsg,
                                                onChange: (e) => handleJustificativaOnus(e),
                                            })}
                                        />
                                        {
                                            errors.justificativa_onus &&
                                            <span className="errorMsg">
                                            * { errorMsg }
                                            </span> 
                                        }
                                    </>
                                }
                            </div>
                            
                            <div style={{position: 'relative'}}>
                                <p style={{fontWeight: '700'}}>Alguns dos vendedores possuem certidões de outro estado (outra comarca)?*</p>
                                <div className='selects-line' style={{margin: '30px 0'}}>
                                    <RadioGroup 
                                        {...register(`vendedor_comarca`, {
                                            required: errorMsg,
                                            validate: (value) => {
                                                if (value === '') {
                                                    return 'Selecione se a ônus será solicitada';
                                                }
                                                else{
                                                    clearErrorComarca()
                                                }
                                            }, 
                                        })} 
                                        label={''} 
                                        options={comarca} 
                                        setOptions={setComarca} 
                                        name='vendedor_comarca' 
                                        value={watch('vendedor_comarca')} 
                                        setValue={setValue} 
                                        changeFunction={e => clearSelectComarca(e)}
                                    />
                                    {
                                    (errors.vendedor_comarca && watch('vendedor_comarca') === '') &&
                                        <p className="errorMsg" style={{position: 'absolute', bottom: '0px'}}>{'*' + errors.vendedor_comarca.message}</p>
                                    }
                                </div>

                                {
                                    watch('vendedor_comarca') === '1' &&
                                    <>
                                        <InputSelect
                                            label={'Quantidade*'}
                                            option={arrQtd || []}
                                            placeholder={'Selecione a quantidade'}
                                            error={!!errors.quantidade_comarca}
                                            msgError={errors.quantidade_comarca}
                                            required={true}
                                            width={'230px'}
                                            style={{width: '230px'}}
                                            // sucess={!errors.quantidade_servicos && !!watch('quantidade_servicos')}
                                            value={watch('quantidade_comarca') || '0'}
                                            {...register('quantidade_comarca', {
                                                validate: (value) => {
                                                    if (value === '0') {
                                                        return 'Nenhuma quantidade foi selecionada';
                                                    }
                                                },
                                                required: errorMsg,
                                                onChange: handleQuantidadeComarca,
                                            })}
                                        />

                                        {
                                           watch('quantidade_comarca') !== '' &&
                                            watch('vendedores_comarca')?.map((data: any, index: number) => 
                                                <div className="selects-line" key={index} style={{margin: '30px 0'}}>
                                                    <InputSelect
                                                        label={'Vendedores*'}
                                                        option={listVendedores || []}
                                                        placeholder={'Selecione o vendedor'}
                                                        error={!!errors.vendedores_comarca?.[index]?.vendedor}
                                                        msgError={errors.vendedores_comarca?.[index]?.vendedor}
                                                        required={true}
                                                        // sucess={!errors.quantidade_servicos && !!watch('quantidade_servicos')}
                                                        value={watch(`vendedores_comarca.${index}.vendedor`) || '0'}
                                                        {...register(`vendedores_comarca.${index}.vendedor`, {
                                                            validate: (value) => {
                                                                if (value === '0') {
                                                                    return 'Nenhum vendedor foi selecionada';
                                                                }
                                                            },
                                                            required: errorMsg,
                                                            onChange: (e) => handleVendedores(e, index)
                                                        })}
                                                    />

                                                    <InputSelect
                                                        label={'Estado (comarca)*'}
                                                        option={estados || []}
                                                        placeholder={'Selecione o estado'}
                                                        error={!!errors.vendedores_comarca?.[index]?.estado}
                                                        msgError={errors.vendedores_comarca?.[index]?.estado}
                                                        required={true}
                                                        // sucess={!errors.quantidade_servicos && !!watch('quantidade_servicos')}
                                                        value={watch(`vendedores_comarca.${index}.estado`) || '0'}
                                                        {...register(`vendedores_comarca.${index}.estado`, {
                                                            validate: (value) => {
                                                                if (value === '0') {
                                                                    return 'Nenhum estado foi selecionado';
                                                                }
                                                            },
                                                            required: errorMsg,
                                                        })}
                                                    />
                                                </div>
                                            )
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    }
                </>
                :
                ''
            }
        </div>
        
        <footer className='footer-checkout'>
            <ButtonComponent
            size={'large'}
            variant={'contained'}
            label={'Enviar pedido'}
            labelColor='white'
            disabled={loading}
            endIcon={loading ? <CircularProgress size={20} /> : <ArrowRightIcon width={20} fill='white' />}
            onClick={handleSubmit(onSaveNewStatus)}
            />
        </footer>

        <DialogConcluirPedido 
            open={openModal} 
            onClose={onClose}
            dataToSave={dataToSave}
            idProcesso={idProcesso}
        />
    </>
  );
};

// EXECUTA ANTES DO Devolucao
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { idProcesso } = context.params as { idProcesso: string };
  return { props: { idProcesso } };
};

export default PainelPedidos;
