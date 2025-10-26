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
import { CircularProgress } from '@mui/material';
import DialogConcluirPedido from '@/components/DialogConcluirPedido';
import { useRouter } from 'next/router';
import InputText from '@/components/InputText/Index';
import formatoMoeda from '@/functions/formatoMoeda';

interface Servico {
    tipo?: number | string;
    servicoDetalhado?: number | string;
    observacao?: string;
    valorCusto?: string;
    valorServico?: string;
    valorTotal?: string;
}

interface FormValues {
    quantidade_servicos: number | string;
    servico?: Servico[];
    onus_solicitada: string;
    vendedor_comarca: string;
}

interface TipoServico {
    id?: number | string;
    nome?: string;
    valor_custas?: string;
    preco_total?: string;
    valor_servico?: string;
    tipo_servico?: {
        id?: number;
        nome?: string;
    }[];
}

// interface ArrLista {
//   id?: number;
//   nome?: string
// }[]

const PainelPedidos = ({ idProcesso }: { idProcesso: string }) => {
    const router = useRouter();
    //const idProcesso = "336";
    const [loading, setLoading] = useState(false);
    const [processData, setProcessData] = useState<ProcessType>();
    const errorMsg = 'Campo obrigatório';
    const [newStatus, setNewStatus] = useState(true);
    const [arrQtd, setArrQtd] = useState([]);
    //const [servicos, setServicos] = useState<Servico[]>([]);
    const [listaTipoServico, setListaTipoServico] = useState([]);
    const [listaDetalheServico, setListaDetalheServico] = useState<TipoServico[]>([]);
    const [listaDetalhesServicoSelecionada, setListaDetalhesServicoSelecionada] = useState<TipoServico[][]>([]);
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
            // onus_solicitada: '',
            //vendedor_comarca: '',
            servico: [],
        },
    });

    console.log('WATCH: ', watch());
    console.log('ERRORS: ', errors);
    //console.log('SERVICOS: ', servicos);

    const returnProcess = async () => {
        setLoading(true);

        const servicos: any = await getTypesServices();
        servicos.unshift({ id: '', name: 'Selecione...' });
        setListaTipoServico(servicos);
        // servicos.push({ id: '', name: 'Selecione...' });

        const servicosDetalhados: any = await getDetailedServices();
        setListaDetalheServico(servicosDetalhados);

        const array: any = [];
        array.push({ id: '', name: 'Selecione...' });
        for (let i = 1; i <= 10; i++) {
            array.push({ id: i, name: String(i) });
        }
        setArrQtd(array);

        const res = await PostLocalizaProcesso(idProcesso) as unknown as ProcessType;
        setProcessData(res);
        setLoading(false);
    };

    useEffect(() => {
        returnProcess();
    }, []);

    const salvarSair = () => { };

    const onVoltar = () => {
        setNewStatus(false);
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
                    observacao: '',
                    valorCusto: '',
                    valorServico: '',
                    valorTotal: '',
                }
            );
        }
        //setServicos(novosServicos);
        setValue('servico', novosServicos);
        clearErrors('servico');
    };

    const handleSelectServicos = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const tipo_servico = e.target.value;
        const detalheServico = listaDetalheServico.filter(
            (detalhe: any) => detalhe.tipo_servico?.id === parseInt(tipo_servico)
        );
        console.log(detalheServico)

        detalheServico.unshift({id: '0', nome: 'Selecione...'});
        setListaDetalhesServicoSelecionada((prevState) => {
            const newState = [...prevState];
            newState[index] = detalheServico;
            return newState;
        });

        setValue(`servico.${index}.tipo`, tipo_servico);
        //servicos[index].tipo = tipo_servico;
    };
    console.log('listaDetalhesServicoSelecionada: ', listaDetalhesServicoSelecionada)

    const handleSelectServicosDetalhados = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        // const detalheServico = listaDetalheServico.filter(
        //     (detalhe: any) => detalhe.tipo_servico?.id === parseInt(tipo_servico)
        //     );
        //     console.log(detalheServico)
        const value = e.target.value.toString();
        //servicos[index].servicoDetalhado = value;

        const retornoServico = listaDetalheServico.find((servico: any) => servico.id === Number(value))

        //servicos[index].valorCusto = retornoServico?.valor_custas;
        setValue(`servico.${index}.valorCusto`, retornoServico?.valor_custas);

        //servicos[index].valorTotal = retornoServico?.preco_total;
        setValue(`servico.${index}.valorTotal`, retornoServico?.preco_total);

        //servicos[index].valorServico = retornoServico?.valor_servico;
        setValue(`servico.${index}.valorServico`, retornoServico?.valor_servico);

        //setValue(servico.${index}.servicoDetalhado, value);
        //clearErrors(servico.${index}.servicoDetalhado);

        //servicos[index].valorServicoDetalhado = '';
        //setValue(servico.${index}.valorServicoDetalhado, '');
        //clearErrors(servico.${index}.valorServicoDetalhado);
    }

    const handleObservacao = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
        setValue(`servico.${index}.observacao`, e.target.value);
        //servicos[index].observacao = e.target.value;
    };

    const handleRemoverServico = (index: number) => {
        const valoresAtuais = getValues('servico') || [];
        const novosServicos = valoresAtuais.filter((_, i) => i !== index);
        //setServicos(novosServicos);
        setValue('servico', novosServicos);
        clearErrors('servico');

        if (novosServicos.length === 0) {
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

    //console.log(servicos);

    const calculaTotal = (index:number) => {
        const valor_custas = Number((watch(`servico.${index}.valorCusto`)?.replace(/[R$.]+/g, ''))?.replace(",", "."));

        const valor_servico = Number((watch(`servico.${index}.valorServico`)?.replace(/[R$.]+/g, ''))?.replace(",", "."));

        const valor_total = (valor_custas + valor_servico).toFixed(2);
        setValue(`servico.${index}.valorTotal`, formatoMoeda(valor_total.toString()?.replace(".", ",")));
        console.log(valor_total);
    }
    

    const clearErrorsOnus = async () => {
        clearErrors('onus_solicitada');
        console.log('TESTE')
    }

    const clearErrorComarca = async () => {
        clearErrors('vendedor_comarca');
    }

    const onSaveNewStatus = async (data: FormValues) => {
        if (watch('onus_solicitada') === '' && watch('vendedor_comarca') === '') {
            setError('onus_solicitada', { message: errorMsg });
            setError('vendedor_comarca', { message: errorMsg });
        }

        console.log('FormValues: ', data);
        setDataToSave(data);
        setOpenModal(true);
    };

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
                    <h2>Gere o boleto do serviço</h2>
                    {/* <p>
                Selecione os tipos de serviços para encaminharmos ao Núcleo. <br />
                Se necessário, escreva uma observação sobre o tipo de serviço solicitado.
            </p> */}

                    <InputSelect
                        label={'Quantos serviços nessa solicitação?*'}
                        option={arrQtd || []}
                        placeholder={'Selecione'}
                        error={!!errors.quantidade_servicos}
                        msgError={errors.quantidade_servicos}
                        // required={true}
                        sucess={!errors.quantidade_servicos && !!watch('quantidade_servicos')}
                        value={watch('quantidade_servicos') || ''}
                        {...register('quantidade_servicos', {
                            validate: (value) => {
                                if (value === '') {
                                    return 'Nenhum status foi selecionado';
                                }
                            },
                            required: errorMsg,
                            onChange: handleQuantidade,
                        })}
                    />
                </div>

                {watch("servico")?.map((servico, index) => (
                    <div key={index} className='cards'>
                        <p>Serviço {`${index + 1}`}</p>

                        <div className='selects-line'>
                            <InputSelect
                                option={listaTipoServico}
                                label={'Tipo de Serviço *'}
                                placeholder={'Selecione'}
                                error={!!errors.servico?.[index]?.tipo}
                                msgError={errors.servico?.[index]?.tipo}
                                required={true}
                                sucess={!errors.servico?.[index]?.tipo && !!servico.tipo}
                                value={servico.tipo || '0'}
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
                                option={listaDetalhesServicoSelecionada[index] || []}
                                label={'Serviço Detalhado *'}
                                placeholder={'Selecione'}
                                disabled={!listaDetalhesServicoSelecionada.length}
                                error={!!errors.servico?.[index]?.servicoDetalhado}
                                msgError={errors.servico?.[index]?.servicoDetalhado}
                                required={true}
                                sucess={!errors.servico?.[index]?.servicoDetalhado && !!servico.servicoDetalhado}
                                value={servico.servicoDetalhado || '0'}
                                {...register(`servico.${index}.servicoDetalhado`, {
                                    validate: (value) => {
                                        if (value === '0') {
                                            return 'Nenhum serviço detalhado foi selecionado';
                                        }
                                    },
                                    required: errorMsg,
                                    onChange: (e) => handleSelectServicosDetalhados(e, index),
                                })}
                            />
                        </div>

                        <InputText
                            label={'Custo'}
                            placeholder={'Ex: R$0,00'}
                            sucess={!errors.servico?.[index]?.valorCusto && !!servico.valorCusto}
                            error={!!errors.servico?.[index]?.valorCusto ? true : false}
                            msgError={errors.servico?.[index]?.valorCusto}
                            value={servico.valorCusto}
                            required={true}
                            onBlurFunction={() => calculaTotal(index)}
                            inputProps={{
                                maxlength: 14
                            }}
                            {...register(`servico.${index}.valorCusto`, {
                                //required: true,
                                required: errorMsg,
                                setValueAs: e => formatoMoeda(e),
                                //validate: (value) => validarCPF(value) || "CPF inválido",
                                //onChange: (e) => [handleInput('cpf',  e.target.value), handleCpf(e.target.value)],
                            })}
                        />
                        <InputText
                            label={'Valor do Serviço'}
                            placeholder={'Ex: R$0,00'}
                            sucess={!errors.servico?.[index]?.valorServico && !!servico.valorServico}
                            error={!!errors.servico?.[index]?.valorServico ? true : false}
                            msgError={errors.servico?.[index]?.valorServico}
                            value={servico.valorServico}
                            required={true}
                            onBlurFunction={() => calculaTotal(index)}
                            inputProps={{
                                maxlength: 14
                            }}
                            {...register(`servico.${index}.valorServico`, {
                                //required: true,
                                required: errorMsg,
                                setValueAs: e => formatoMoeda(e),
                                //validate: (value) => validarCPF(value) || "CPF inválido",
                                //onChange: (e) => [handleInput('cpf',  e.target.value), handleCpf(e.target.value)],
                            })}
                        />
                        <InputText
                            label={'Valor total'}
                            placeholder={'Ex: R$0,00'}
                            sucess={!errors.servico?.[index]?.valorTotal && !!servico.valorTotal}
                            error={!!errors.servico?.[index]?.valorTotal ? true : false}
                            msgError={errors.servico?.[index]?.valorTotal}
                            value={servico.valorTotal}
                            required={true}
                            disabled={true}
                            inputProps={{
                                maxlength: 14
                            }}
                            {...register(`servico.${index}.valorTotal`, {
                                //required: true,
                                required: errorMsg,
                                setValueAs: e => formatoMoeda(e),
                                //validate: (value) => validarCPF(value) || "CPF inválido",
                                //onChange: (e) => [handleInput('cpf',  e.target.value), handleCpf(e.target.value)],
                            })}
                        />

                        {/* <TextArea
                label={`Observações do serviço ${index + 1}`}
                minRows={4}
                placeholder='Exemplo...'
                value={watch(`servico.${index}.observacao`) || ''}
                {...register(`servico.${index}.observacao`, {
                    required: false,
                    onChange: (e) => handleObservacao(e, index),
                })}
                /> */}

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

                {/* {
                watch('quantidade_servicos') &&
                <div className='cards' >
                    <h2>Informações adicionais</h2>
                    <p>Precisamos de mais algumas informações para acelerar o trabalho do Núcleo.</p>

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
                            />
                        </div>
                        {
                            (errors.onus_solicitada && watch('onus_solicitada') === '') &&
                            <p className="errorMsg" style={{position: 'absolute'}}>{'*' + errors.onus_solicitada.message}</p>
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
                            />
                        </div>
                        {
                            (errors.vendedor_comarca && watch('vendedor_comarca') === '') &&
                            <p className="errorMsg" style={{position: 'absolute'}}>{'*' + errors.vendedor_comarca.message}</p>
                        }
                    </div>
                </div>
            } */}
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

//EXECUTA ANTES DO Devolucao
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { idProcesso } = context.params as { idProcesso: string };
  return { props: { idProcesso } };
};

export default PainelPedidos;
