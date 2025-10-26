import { CheckIcon, ExclamationTriangleIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Paper, LinearProgress } from '@mui/material';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import { GetServerSideProps } from 'next';

import loadingEvaluating from '@/images/loading_evaluating.svg';
import sucessEvaluating from '@/images/sem-conflitos.svg';
import HeadSeo from '@/components/HeadSeo';
import ButtonComponent from '@/components/ButtonComponent';
import { reciboAIExtract } from '@/components/OpenAI_TextExtract';
import openAI_API from '@/components/OpenAI_TextExtract/openAI_API';
import { promptRecibo } from '@/components/OpenAI_TextExtract/prompts';
import { arrayEscritura, laudemiosFamilia, laudemiosIgreja, tiposLaudemios } from '@/components/Listas';

import { jsonFormatType, pessoaType } from '@/interfaces/OpenAI';
import imovelDataInterface from '@/interfaces/Imovel/imovelData'
import GetProcesso from '@/apis/getProcesso';
import ShowDocument from '@/apis/getDocument';
import getOCR from '@/apis/getOCR';
import Image from 'next/image';
import Header from './@Header';
import CheckBox from '@/components/CheckBox';
import PaperCard from './@components/Paper';
import CadastrarPessoa from './@CadastrarPessoa';
import Pessoa from '@/interfaces/Users/userData';
import getCpfDadosUsuario from '@/apis/getCpfDadosUsuario';
import { ArrConflitosType } from "@/interfaces/IA_Recibo/index";
import saveConflitos from '@/apis/saveConflitos';
import getConflitosRecibo from '@/apis/getConflitosRecibo';
import saveImovel from '@/apis/postSaveImovel';
import SaveUser from '@/apis/postSaveUser';
import EntregarVenda from './@Entregar';
import abrevEstado from '@/functions/abrevEstado';
import entregarVendaAPI from '@/apis/postEntregarVenda';
import postEnvioDocuSign from '@/apis/postEnvioDocuSign';
import FormValues from '@/interfaces/Vendas/EntregarVenda';
import FormValuesType from "@/interfaces/EntregarVenda";
import Loading from '../@CheckoutComponents/@Loading';
import { useForm } from 'react-hook-form';

const EmptyPessoa = {
    id: '',
    tipo_pessoa: 0,
    name: '',
    nome_fantasia: '',
    cpf_cnpj: '',
    email: '',
    telefone: '',
    genero: '',
    genero_label: '',
    data_nascimento: '',
    ddi: '',
    nacionalidade: '',
    nome_mae: '',
    nome_pai: '',
    estado_civil: '',
    estado_civil_nome: '',
    uniao_estavel: '',
    registro_casamento: '',
    registro_casamento_label: '',
    conjuge: '',
    profissao: '',
    rg: '',
    rg_expedido: '',
    data_rg_expedido: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    unidade: '',
    razao_social: '',
} as const;

type ConflitosType = {
    label: 'imóvel' | 'vendedores' | 'compradores' | 'documento'
    conflitos: ArrConflitosType[]
    check: boolean
}

type arrImovelType = ['bairro', 'uf', 'logradouro', 'numero'];
type KeyPessoasType = 'compradores' | 'vendedores';

type ResponseSaveUser = {
    usuario: Pessoa,
    status_perfil: string
}

// const feedbacksLoading = [ // ETAPAS REAIS
//     {progress: 1 , msg: 'Carregando dados do processo...'},
//     {progress: 5 , msg: 'Recebendo o Recibo de Sinal...'},
//     {progress: 10 , msg: 'Iniciando leitura do recibo...'},
//     {progress: 25 , msg: 'Convertendo em imagens...'},
//     {progress: 35 , msg: 'Convertendo as imagens em texto...'},
//     {progress: 70 , msg: 'Salvando OCR, e retornando dados do texto...'},
//     {progress: 90 , msg: 'Comparando dados do recibo com do cadastro...'},
//     {progress: 100 , msg: 'Tudo pronto!'}
// ];

const feedbacksLoading = [
    { progress: 1, msg: 'Carregando dados do processo...' },
    { progress: 5, msg: 'Carregando dados do processo...' },
    { progress: 10, msg: 'Baixando Recibo de Sinal...' },
    { progress: 25, msg: 'Identificando campos......' },
    { progress: 35, msg: 'Iniciando leitura...' },
    { progress: 50, msg: 'Metade do documento já foi lido, aguarde só mais um pouco...' },
    { progress: 65, msg: 'Finalizando leitura...' },
    { progress: 70, msg: 'Fazendo comparativos...' },
    { progress: 90, msg: 'Definindo percentual de acertos...' },
    { progress: 100, msg: 'Tudo pronto!' }
];

const listEstadoCivil = [
    { name: 'Selecione o estado civil', id: '0' },
    { "id": '1', name: "Casado", },
    { "id": '2', name: "Solteiro", },
    { "id": '3', name: "Divorciado", },
    { "id": '4', name: "Viúvo", },
    { "id": '5', name: "Separado", }
];

const listRegimeCasamento = [
    { name: 'Selecione o regime de casamento', id: '0' },
    { "id": '1', name: "Separação total de bens", },
    { "id": '2', name: "Separação parcial de bens", },
    { "id": '3', name: "Separação legal de bens", },
    { "id": '4', name: "Comunhão de bens", },
    { "id": '5', name: "Comunhão parcial de bens", },
];

const keysEntregarVenda = ['processo_id', 'informacao_imovel_id'];

type StepsType = {
    id: number;
    campo: 'quantidade' | 'dados' | 'entrega';
    elemento: 'vendedores' | 'compradores' | 'imóvel' | 'venda';
    title: string;
    active: boolean;
}

const arrCampoLabel = (campo: string) => {
    if (campo === 'cpf') return 'CPF';
    else if (campo === 'quantidade') return 'Dados encontrados'
    else if (campo === 'laudemios') return 'Laudêmio';
    else if (campo === 'valor_venda') return 'Valor da venda';
    else if (campo === 'inscricaoMunicipal') return 'Inscrição municipal';
    else if (campo === 'nome') return 'Nome completo';
    else if (campo === 'estado_civil') return 'Estado civil';
    else if (campo === 'tipo_escritura') return 'Escritura';
    else if (campo === 'prazo') return 'Prazo da escritura';
    else if (campo === 'numero') return 'Número';
    else if (campo === 'nome_mae') return 'Nome mãe';
    else if (campo === 'nome_pai') return 'Nome pai';

    else return (campo[0].toUpperCase() + campo.substring(1));
};

const returnBloco = (campo: string) => {
    switch (campo) {
        case 'inscricaoMunicipal':
            return 2
        case 'tipo_escritura':
            return 2
        case 'laudemios':
            return 3
        case 'valor_venda':
            return 4
        case 'prazo':
            return 5
        default: return 1
    }
};

const stringLimpa = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
};

const EntregarVendaLeituraIA = ({ idProcesso }: { idProcesso: string }) => {
    const [imovelData, setImovelData] = useState<imovelDataInterface>({});
    const router = useRouter();
    const [file, setFile] = useState<File>();
    const [progress, setProgress] = useState(0);
    const [listConflitos, setListConflitos] = useState<ConflitosType[]>([]);
    const [indexFeedback, setIndexFeedback] = useState(0);
    const [steps, setSteps] = useState<StepsType[]>([
        { id: 1, campo: 'quantidade', elemento: 'vendedores', title: 'Conflito de dados em vendedores', active: false },
        { id: 2, campo: 'quantidade', elemento: 'compradores', title: 'Conflito de dados em compradores', active: false },
        { id: 3, campo: 'dados', elemento: 'vendedores', title: 'Conflito de dados em vendedores', active: false },
        { id: 4, campo: 'dados', elemento: 'compradores', title: 'Conflito de dados em compradores', active: false },
        { id: 5, campo: 'dados', elemento: 'imóvel', title: 'Conflito de dados em imóvel', active: false },
    ]);
    const [openCadastrar, setOpenCadastrar] = useState(false);
    const [conflitoSelect, setConflitoSelect] = useState<ArrConflitosType>();
    const [percentError, setPercentError] = useState(0);

    // PARTE DE ENTREGAR PARA O PÓS
    const [openLoading, setOpenLoading] = useState<Boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [stepLoading, setStepLoading] = useState<number>(0)
    const [refreshScreen, setRefreshScreen] = useState<Boolean>(true); // Para evitar de recarregar o getConflitos e voltar para a tela de loading

    console.log("lista de conflitos: ", listConflitos);

    useEffect(() => {
        const index = feedbacksLoading.map(e => e.progress).indexOf(progress);
        setIndexFeedback(index);
    }, [progress]);

    const getImovelData = async () => {
        setProgress(1);
        const data = await GetProcesso(idProcesso, router) as any;

        if (data) {
            // const perfil_login = localStorage.getItem('perfil_login_id');
            // const statusID = data.status[0].id // 12 - Venda incompleta
            // console.log(statusID);
            // const perfilGerente = perfil_login === '3' || perfil_login === '4';
            // if ((!data.status_rascunho_id || (statusID !== 12 && statusID !== 15)) && perfilGerente) router.push('/vendas')
            // else if (data.status_rascunho_id === 1 && perfil_login === '3') router.push(`/vendas/gerar-venda/${idProcesso}/dashboard/`)


            setImovelData(data as imovelDataInterface);
        }
        setProgress(5);
    };

    let count = 0;
    useEffect(() => {
        // progressTest()
        if (count === 0) getImovelData();
        count += 1;
    }, []);
    console.log('imovelData: ', imovelData);

    const {
        register,
        watch,
        setValue,
        formState: { errors },
        handleSubmit,
        clearErrors,
        setError,
        setFocus,
    } = useForm<FormValues>({
        defaultValues: {
            imovel_id: imovelData?.imovel_id,
            processo_id: imovelData?.id,
            informacao_imovel_id: imovelData?.informacao?.id,
            prazo_type: imovelData?.imovel?.informacao?.tipo_dias || '1',
            reciboType: imovelData?.informacao?.recibo_type || 'manual',
            data_assinatura: imovelData?.informacao?.data_assinatura || '',
            prazo_escritura: imovelData?.informacao?.prazo,
            posvenda_franquia: '0',
            valor_comissao_liquida: imovelData?.comissao?.valor_comissao_liquida,
            deducao: imovelData?.comissao?.deducao,
            valor_comissao_total: imovelData?.comissao?.valor_comissao_total,
            emailCheck: imovelData?.imovel?.email_check || '0',
            data_previsao_escritura: '',
            observacao: imovelData?.informacao?.observacao || '',

            testemunhas: [
                { id: imovelData?.testemunhas?.data?.[0]?.id || '', name: imovelData?.testemunhas?.data?.[0]?.nome || '', email: imovelData?.testemunhas?.data?.[0]?.email || '', tipo_pessoa: 3 },
                { id: imovelData?.testemunhas?.data?.[1]?.id || '', name: imovelData?.testemunhas?.data?.[1]?.nome || '', email: imovelData?.testemunhas?.data?.[1]?.email || '', tipo_pessoa: 3 },
            ]
        }
    });

    useEffect(() => {
        if (imovelData) {
            setValue('imovel_id', imovelData?.imovel_id);
            setValue('processo_id', imovelData?.id || '');
            setValue('informacao_imovel_id', imovelData?.informacao?.id);
            setValue('prazo_type', imovelData.imovel?.informacao?.tipo_dias || '1');
            setValue('reciboType', imovelData.informacao?.recibo_type || 'manual');
            setValue('data_assinatura', imovelData.informacao?.data_assinatura || '');
            setValue('prazo_escritura', imovelData.informacao?.prazo);
            setValue('posvenda_franquia', '0');
            setValue('valor_comissao_liquida', imovelData.comissao?.valor_comissao_liquida);
            setValue('deducao', imovelData.comissao?.deducao);
            setValue('valor_comissao_total', imovelData.comissao?.valor_comissao_total);
            setValue('emailCheck', imovelData.imovel?.email_check || '0');
            setValue('data_previsao_escritura', '');
            setValue('observacao', imovelData?.informacao?.observacao || '');
            setValue('testemunhas', [
                {
                    id: imovelData.testemunhas?.data?.[0]?.id || '',
                    name: imovelData.testemunhas?.data?.[0]?.nome || '',
                    email: imovelData.testemunhas?.data?.[0]?.email || '',
                    tipo_pessoa: 3,
                },
                {
                    id: imovelData.testemunhas?.data?.[1]?.id || '',
                    name: imovelData.testemunhas?.data?.[1]?.nome || '',
                    email: imovelData.testemunhas?.data?.[1]?.email || '',
                    tipo_pessoa: 3,
                },
            ]);
        }
    }, [imovelData, setValue]);

    console.log('WATCH EVALUATING: ', watch())

    const getCPF = async (cpf: string) => {
        if (cpf.length === 14) {
            const dataCpf: any = await getCpfDadosUsuario(cpf);
            if (dataCpf?.id) return dataCpf;
        }
    };

    const calcPercentErrors = (listErrors: ConflitosType[]) => {
        let percentOk = 100;
        const numberQuant = {
            vendedores: imovelData.vendedores?.length || 0,
            compradores: imovelData.compradores?.length || 0,
            documento: 0,
        };

        listErrors.forEach((e) => {
            (['vendedores', 'compradores'] as const).forEach((key) => {
                e.conflitos.forEach((conflito) => {
                    if (e.label === key && conflito.tipo_conflito === 'quantidade') {
                        numberQuant[key] += 1;
                    }
                })
            })
        })

        listErrors.forEach((arrConflitos) => {
            arrConflitos.conflitos.forEach((c) => {
                if (c.tipo_conflito === 'quantidade' && arrConflitos.label !== 'imóvel') {
                    const key = arrConflitos.label;
                    const percent = (25 / numberQuant[key]);

                    percentOk -= percent;
                } else if (arrConflitos.label !== 'imóvel') {
                    const key = arrConflitos.label;
                    const percent = (25 / numberQuant[key] / 5);

                    percentOk -= percent;
                } else if (arrConflitos.label === 'imóvel') {

                    percentOk -= 5;
                }
            })
        })

        return Math.ceil(100 - percentOk);
    };

    const getConflitos = async () => {
        const resConflitos = await getConflitosRecibo(imovelData.processo_id);

        const newList: ConflitosType[] = []
        if (!!resConflitos?.conflitos?.[0]) {
            (['imóvel', 'vendedores', 'compradores'] as const).forEach((key) => {
                const conflitos = resConflitos.conflitos.filter((e) => e.tipo === key);

                newList.push({
                    label: key,
                    check: conflitos.every((c) => !!c.valor_editado || !!c.validar_campos),
                    conflitos: conflitos.map((conflito) => ({
                        id: conflito.id,
                        campo: conflito.campo,
                        tipo_conflito: conflito.campo === 'quantidade' ? 'quantidade' : 'dados',
                        campo_label: arrCampoLabel(conflito.campo),
                        valor_recibo: conflito.valor_recibo,
                        valor_cadastro: conflito.valor_cadastro,
                        valor_edit: conflito.valor_editado || '',
                        checked_IA: conflito.validar_campos === 1,
                        checked_edit: !!conflito.valor_editado,
                        bloco: key === 'imóvel' ? returnBloco(conflito.campo) : undefined,
                        pessoa: conflito.campo === 'quantidade' ? {
                            ...EmptyPessoa,
                            tipo: key as 'vendedores' | 'compradores',
                            name: conflito.valor_recibo.split(' - ')[0],
                            cpf_cnpj: conflito.valor_recibo.split(' - ')[1] || conflito.valor_editado || '',
                            tipo_pessoa: !!conflito.valor_recibo.split(' - ')[1] ? 0 : 1,
                            tipo_usuario: key.replace('es', '') as 'vendedor' | 'comprador'
                        } : key !== 'imóvel' ? imovelData[key]?.find((e) => e.id === Number(conflito.referencia_id)) : undefined
                    })),
                })
            })

            setPercentError(calcPercentErrors(newList));
            filterSteps(newList);
            setListConflitos(newList);
            setTimeout(() => {
                setProgress(100);
            }, 1000)
        } else {
            const ocrSave = await getOCR(idProcesso);
            const docAntigo = !ocrSave?.nome || ocrSave.nome !== imovelData.informacao?.recibo;
            if (!ocrSave || docAntigo) return getFile();

            const completion = await openAI_API({ prompt: promptRecibo, ocr: ocrSave.ocr });

            if (completion && completion?.choices[0]?.message?.content) {
                const jsonResult = JSON?.parse(completion?.choices[0]?.message?.content) as jsonFormatType;
                console.log("LEITURA FINALIZADA, GERANDO JSON");
                jsonResult.tipo_escritura = arrayEscritura.find(e => stringLimpa(e.name).includes(stringLimpa(jsonResult.tipo_escritura)))?.name || jsonResult.tipo_escritura;

                console.log(completion.choices[0]);
                console.log("JSON FORMAT: ", jsonResult);
                ExtractText(undefined, jsonResult);
            }
        }
    };

    // let count = 0;
    // useEffect(() => {
    //     // progressTest()
    //     if (count === 0) getImovelData();
    //     count += 1;
    // }, []);

    let countConflitos = 0;
    useEffect(() => {
        console.log('AQUI')
        if (imovelData?.imovel_id && !file && countConflitos === 0) {
            countConflitos += 1;

            if (refreshScreen) {
                getConflitos()
            }
        }
    }, [imovelData]);

    const getFile = async () => {
        setProgress(10);
        const fileBlob = await ShowDocument(imovelData.imovel_id, 'recibo', true);
        setFile(fileBlob);
        ExtractText(fileBlob);
    };

    const returnLabelBtn = () => {
        if (listConflitos.length > 0) return 'Revisar e entregar venda'
        else return 'Ir para a etapa final'
    };

    const filterSteps = (list: ConflitosType[]) => {
        const stepsConflitos: StepsType[] = [];
        list.forEach((c) => {
            steps.forEach((s) => {
                if (c.label === s.elemento && c.conflitos.some((conflito) => conflito.tipo_conflito === s.campo)) {
                    stepsConflitos.push(s);
                }
            })
        })
        setSteps(stepsConflitos);
    };

    async function ExtractText(file?: File, data?: jsonFormatType) {
        setListConflitos([]);
        if (!data && file && imovelData) {
            data = await reciboAIExtract({ file, setProgress, imovelData });
        }

        const valoresIniciais = {
            id: '',
            checked_IA: false,
            checked_edit: false,
            valor_edit: ''
        };

        setProgress(90);
        console.log("Res: ", data);
        console.log("ImovelData: ", imovelData);
        const msgCampoVazio = 'Sem cadastro';
        if (data) {
            // REVISANDO CONFLITOS RECIBO VALIDO
            if (!data.documento_valido) {
                listConflitos.push({
                    label: 'documento',
                    conflitos: [],
                    check: false
                });
                return ''
            }

            // REVISANDO CONFLITOS ABA IMÓVEL
            const arrImovel = ['bairro', 'uf', 'logradouro', 'numero'] as arrImovelType;
            const conflitos: ArrConflitosType[] = [];
            data.imovel.uf = abrevEstado(data.imovel.uf);

            arrImovel.forEach((param) => {
                const valueCadastro = stringLimpa(imovelData[param] || '');
                const valueRecibo = stringLimpa(data?.imovel[param] || '');
                if (data && valueRecibo && valueCadastro && valueRecibo !== valueCadastro) {
                    console.log("CONFLITO IMOVEL, CAMPO ", param + ": ", data.imovel[param]);
                    conflitos.push({
                        tipo_conflito: 'dados',
                        campo: param,
                        campo_label: arrCampoLabel(param),
                        valor_recibo: data.imovel[param],
                        valor_cadastro: imovelData[param] || msgCampoVazio,
                        bloco: 1,
                        ...valoresIniciais,
                    })
                }
            })

            if (data.prazo_escritura !== Number(imovelData.informacao?.prazo)) {
                conflitos.push({
                    tipo_conflito: 'dados',
                    campo: 'prazo',
                    campo_label: 'Prazo da escritura',
                    valor_recibo: data?.prazo_escritura,
                    valor_cadastro: imovelData?.informacao?.prazo || '',
                    bloco: 5,
                    ...valoresIniciais,
                })
            }

            console.log(data.foreiro);


            if (data?.foreiro?.[0]) {
                data.foreiro.forEach((laudemio_recibo) => {
                    const tipoId = tiposLaudemios.find((e) => e.name === laudemio_recibo.tipo)?.id;
                    if (!imovelData.laudemios?.find((laudemio_cadastro) => laudemio_cadastro.tipo_laudemio === tipoId)) {
                        conflitos.push({
                            tipo_conflito: 'dados',
                            campo: 'laudemios',
                            campo_label: 'Laudêmio',
                            valor_recibo: `${laudemio_recibo.tipo}${laudemio_recibo.complemento ? ' - ' + laudemio_recibo.complemento : ''}`,
                            valor_cadastro: 'Sem cadastro',
                            bloco: 3,
                            ...valoresIniciais,
                        })
                    }
                })
            }

            if (imovelData.informacao?.valor_venda.replace(' ', '') !== data.valor_venda.replace(' ', '')) {
                conflitos.push({
                    tipo_conflito: 'dados',
                    campo: 'valor_venda',
                    campo_label: 'Valor da venda',
                    valor_recibo: data.valor_venda || msgCampoVazio,
                    valor_cadastro: imovelData.informacao?.valor_venda || msgCampoVazio,
                    bloco: 4,
                    ...valoresIniciais,
                })
            }
            if (imovelData.informacao?.inscricaoMunicipal.replace(/\D+/g, '') !== data.imovel.inscricao_municipal.replace(/\D+/g, '')) {
                conflitos.push({
                    tipo_conflito: 'dados',
                    campo: 'inscricaoMunicipal',
                    campo_label: 'Inscrição municipal',
                    valor_recibo: data.imovel.inscricao_municipal || msgCampoVazio,
                    valor_cadastro: imovelData.informacao?.inscricaoMunicipal || msgCampoVazio,
                    bloco: 2,
                    ...valoresIniciais,
                })
            }

            const escrituraLimpa = stringLimpa(imovelData.informacao?.tipo_escritura || '');
            const escrituraBanco = stringLimpa(data.tipo_escritura || '');

            if (!escrituraLimpa.includes(escrituraBanco)) {
                if (!data.tipo_escritura.toLowerCase().includes('clausula')) {
                    console.log("CONFLITO EM TIPO DE ESCRITURA");
                    conflitos.push({
                        tipo_conflito: 'dados',
                        campo: 'tipo_escritura',
                        campo_label: 'Escritura',
                        valor_recibo: data.tipo_escritura || msgCampoVazio,
                        valor_cadastro: imovelData.informacao?.tipo_escritura || msgCampoVazio,
                        bloco: 2,
                        ...valoresIniciais,
                    })
                }
            }

            if (conflitos[0]) {
                listConflitos.push({
                    label: 'imóvel',
                    conflitos: conflitos,
                    check: false
                })
            }


            (['compradores', 'vendedores'] as KeyPessoasType[]).forEach((e) => {
                const vend_comp: ConflitosType = {
                    label: e,
                    conflitos: [],
                    check: false,
                };


                data?.[e].forEach(async (pessoaRecibo, index) => {
                    const dataCadastro = imovelData[e]?.find((pessoa) => pessoa.cpf_cnpj === pessoaRecibo.cpf || pessoa.name?.toLowerCase() === pessoaRecibo.nome.toLowerCase());
                    console.log("Usuario encontrado: ", dataCadastro);

                    if (!dataCadastro) {
                        console.log(`CONFLITO ${e.toUpperCase()} NÃO CADASTRADO CPF: ${pessoaRecibo.cpf} - ${pessoaRecibo.nome.toLowerCase()}`);
                        vend_comp.conflitos.push({
                            ...valoresIniciais,
                            tipo_conflito: 'quantidade',
                            campo: 'quantidade',
                            campo_label: 'Dados encontrados',
                            valor_recibo: pessoaRecibo.nome + ' - ' + pessoaRecibo.cpf,
                            valor_cadastro: 'Sem cadastro',
                            pessoa: {
                                ...EmptyPessoa,
                                tipo: e,
                                name: pessoaRecibo.nome,
                                cpf_cnpj: pessoaRecibo.cpf,
                                estado_civil: listEstadoCivil.find((e) => e.name.toLowerCase() === pessoaRecibo.estado_civil.toLowerCase())?.id || '',
                                registro_casamento: listRegimeCasamento.find((e) => e.name.toLowerCase() === pessoaRecibo.regime_casamento?.toLowerCase())?.id || '',
                                tipo_pessoa: !!pessoaRecibo.cpf ? 0 : 1,
                                tipo_usuario: e.replace('es', '') as 'vendedor' | 'comprador'
                            }
                        });
                    } else {
                        if (pessoaRecibo.cpf && dataCadastro.cpf_cnpj !== pessoaRecibo.cpf) {
                            console.log(`CONFLITO ${e.toUpperCase()} CPF: ${pessoaRecibo.cpf}`);
                            vend_comp.conflitos.push({
                                tipo_conflito: 'dados',
                                campo: 'cpf',
                                campo_label: 'CPF',
                                valor_recibo: pessoaRecibo.cpf || msgCampoVazio,
                                valor_cadastro: imovelData?.[e]?.[index].cpf_cnpj || msgCampoVazio,
                                ...valoresIniciais,
                                pessoa: dataCadastro
                            })
                        }
                        if (pessoaRecibo.nome && dataCadastro.name?.toLowerCase() !== pessoaRecibo.nome.toLowerCase()) {
                            console.log(`CONFLITO ${e.toUpperCase()} NOME: ${pessoaRecibo.nome}`);
                            vend_comp.conflitos.push({
                                tipo_conflito: 'dados',
                                campo: 'nome',
                                campo_label: 'Nome completo',
                                valor_recibo: pessoaRecibo.nome || msgCampoVazio,
                                valor_cadastro: imovelData?.[e]?.[index].name || msgCampoVazio,
                                ...valoresIniciais,
                                pessoa: dataCadastro
                            })
                        }
                        if (pessoaRecibo.estado_civil && dataCadastro.estado_civil_nome.slice(0, -1).toLowerCase() !== pessoaRecibo.estado_civil.slice(0, -1).toLowerCase()) {
                            console.log(`CONFLITO ${e.toUpperCase()}: ESTADO CIVIL: ${pessoaRecibo.estado_civil}`);
                            vend_comp.conflitos.push({
                                tipo_conflito: 'dados',
                                campo: 'estado_civil',
                                campo_label: 'Estado civil',
                                valor_recibo: pessoaRecibo.estado_civil || msgCampoVazio,
                                valor_cadastro: imovelData?.[e]?.[index].estado_civil_nome || msgCampoVazio,
                                ...valoresIniciais,
                                pessoa: dataCadastro
                            })
                        }
                        if (pessoaRecibo.nome_mae !== "Não informado" && dataCadastro.nome_mae?.toLowerCase() !== pessoaRecibo.nome_mae.toLowerCase()) {
                            console.log(`CONFLITO ${e.toUpperCase()} NOME MÃE: ${pessoaRecibo.nome_mae}`);
                            vend_comp.conflitos.push({
                                tipo_conflito: 'dados',
                                campo: 'nome_mae',
                                campo_label: 'Nome mãe',
                                valor_recibo: pessoaRecibo.nome_mae || msgCampoVazio,
                                valor_cadastro: imovelData?.[e]?.[index].nome_mae || msgCampoVazio,
                                ...valoresIniciais,
                                pessoa: dataCadastro
                            })
                        }
                        if (pessoaRecibo.nome_pai !== "Não informado" && dataCadastro.nome_pai?.toLowerCase() !== pessoaRecibo.nome_pai.toLowerCase()) {
                            console.log(`CONFLITO ${e.toUpperCase()} NOME PAI: ${pessoaRecibo.nome_pai}`);
                            vend_comp.conflitos.push({
                                tipo_conflito: 'dados',
                                campo: 'nome_pai',
                                campo_label: 'Nome pai',
                                valor_recibo: pessoaRecibo.nome_pai || msgCampoVazio,
                                valor_cadastro: imovelData?.[e]?.[index].nome_pai || msgCampoVazio,
                                ...valoresIniciais,
                                pessoa: dataCadastro
                            })
                        }
                    }
                })
                if (vend_comp.conflitos[0]) listConflitos.push(vend_comp);
            })
            setPercentError(calcPercentErrors(listConflitos));
            filterSteps(listConflitos);

            listConflitos.forEach((e) => e.conflitos.forEach(conflito => saveCards(conflito, e.label)));
            setListConflitos([...listConflitos]);
            setTimeout(() => {
                setProgress(100);
            }, 500);
        }
    };

    const saveCards = async (conflito: ArrConflitosType, tipo: "vendedores" | "compradores" | "imóvel" | "documento") => {
        const id = conflito.id;
        const referencia_id = conflito.pessoa ? conflito.pessoa.id : imovelData.imovel_id || '';
        const campo = conflito.campo;
        const valor_recibo = conflito.valor_recibo;
        const valor_cadastro = conflito.valor_cadastro;
        const valor_edit = conflito.valor_edit;
        const validar_campos = conflito.checked_IA;
        const processo_id = imovelData.processo_id || '';

        const data = { id, tipo, referencia_id, campo, valor_recibo, valor_cadastro, valor_edit, validar_campos, processo_id }
        const res = await saveConflitos(data);
        conflito.id = res?.id || '';
    };

    const returnIndexSteps = () => {
        const idActive = steps.find((e) => e.active);
        return idActive ? steps.indexOf(idActive) : 0
    };

    console.log('IMOVELDATA: ', imovelData)

    const handleEnviarVenda = async () => {
        const reqData = {
            processo_id: imovelData.processo_id || '',
            informacao_imovel_id: imovelData.informacao?.id || '',
            prazo_escritura: imovelData.informacao?.prazo,
            posvenda_franquia: watch('posvenda_franquia'),
        };

        // Para ativar o modal de entrega da venda
        // setOpenDialogEntrega(true);

        const tipoRecibo = imovelData.informacao?.recibo_type;
        if (tipoRecibo === 'manual') {
            const res = await entregarVendaAPI(reqData);
            if (res) {
                localStorage.setItem('venda_entregue', imovelData.processo_id || '');
                router.push('/vendas');
            }
            console.log("Result API entregarVenda: ", res);
        }
        else {

            // Abre o modal de Enviando Recibo
            setOpenLoading(true);

            const res: any = await postEnvioDocuSign(imovelData?.id || '', reqData);
            console.log('ENVIO DOCUSIGN: ', res);

            // Se tudo der certo, muda o copy do modal
            if (res?.[0]?.status === true) {
                setTimeout(() => {
                    setLoading(true)
                    setStepLoading(1)
                }, 3000);
            }
            else {
                console.log('Erro ao enviar para o DocuSign')
                setTimeout(() => {
                    setLoading(true)
                    setStepLoading(2)
                }, 3000);
            }
        }
    };

    const handleNextStep = async () => {
        const idActive = steps.find((e) => e.active);
        const nameGerente = imovelData.gerente?.find(e => e.name)?.name;
        const allCheck = listConflitos.find((e) => e.conflitos.filter(conflito => !conflito.checked_IA && !conflito.checked_edit).length > 0);
        const stepEntregar: StepsType = { id: 6, campo: 'entrega', elemento: 'venda', title: `${nameGerente ? nameGerente.split(' ')[0] + ', a' : 'A'}gora você pode entregar a sua venda!`, active: true };
        const entregarPos = idActive?.campo === 'entrega';

        if (entregarPos) {
            handleEnviarVenda()
        }
        else if (!steps[0] || !allCheck) {
            if (idActive) {
                // ACABOU DE COMPLETAR O ULTIMO CONFLITO
                const index = steps.indexOf(idActive);
                steps[index].active = false;
            }
            // SAIU DA PÁGINA, VOLTOU E TODOS OS CONFLITOS ESTÃO RESOLVIDOS OU NÃO HÁ CONFLITOS
            steps.push(stepEntregar);
            setRefreshScreen(false)
        }
        else if (!idActive) {
            // ENTROU PELA PRIMEIRA VEZ E TEM CONFLITOS
            steps[0].active = true;
        } else {
            const index = steps.indexOf(idActive);
            steps[index].active = false;

            if (index + 1 >= steps.length) {
                // ULTIMA STEP         
                steps.push(stepEntregar);
                setRefreshScreen(false)
            } else {
                // AINDA RESTA OUTROS CONFLITOS
                steps[index + 1].active = true;
            }

        }
        setSteps([...steps])
    };

    const returnTitle = (value: number) => {
        if (value < 100) {
            return 'Avaliando Recibo de Sinal'
        } else {
            return listConflitos.length > 0
                ? 'Encontramos alguns erros...'
                : 'Parabéns, você teve 100% de acerto nos dados da venda!'
        }
    };

    const returnText = () => {
        if (progress < 100) {
            return 'Nossa IA está avaliando o Recibo de Sinal para assegurar que os dados preenchidos na plataforma estejam corretos. ';
        } else {
            return listConflitos.length > 0
                ?
                <div className='text-conflitos'>
                    <p>Para agilizar sua revisão, identificamos que {percentError}% dos <b>dados preenchidos estão diferentes de como constam no Recibo de Sinal</b>.</p>

                    <p><b>Você preencheu corretamente {100 - percentError}% dos dados! :)</b></p>

                    <p>A venda só poderá ser entregue após revisão.</p>
                </div>
                : 'Que notícia boa! Nossa IA identificou que todos os campos preenchidos estão de acordo com o Recibo de Sinal. Prossiga para a etapa final!'
        }
    };

    const onCheckIAMistake = (item: ArrConflitosType, e: React.ChangeEvent<HTMLInputElement>, tipo: "vendedores" | "compradores" | "imóvel" | "documento") => {
        const check = e.target.checked;
        item.checked_IA = check;
        saveCards(item, tipo);
        listConflitos.forEach((e) => e.check = e.conflitos.every((c) => !!c.checked_edit || !!c.checked_IA));
        setListConflitos([...listConflitos]);
        console.log(check, item);
    };
    console.log(imovelData);


    const onClickEdit = async (conflito: ArrConflitosType, itemList: ConflitosType) => {
        const pessoa = conflito.pessoa;
        console.log(conflito);

        if (itemList.label === 'imóvel') {
            let form: any = imovelData;
            if (form.informacao) {
                Object.keys(form.informacao).forEach((key) => {
                    form = { ...form, [key]: form.informacao[key] };
                })
            };


            const idLaudemio = conflito.campo === "laudemios" ? tiposLaudemios.find((e) => e.name === conflito.valor_recibo.toString().split(' - ')[0])?.id : undefined;
            const laudemios = imovelData.laudemios?.filter((e) => e.tipo_laudemio !== idLaudemio);
            console.log(imovelData.laudemios);
            console.log(idLaudemio);
            console.log(laudemios);

            if (idLaudemio && idLaudemio !== '0') {
                const complemento = conflito.valor_recibo.toString().split(' - ')?.[1] || '';
                const list = [...laudemiosFamilia, ...laudemiosIgreja];
                const complementoId = list.find((e) => stringLimpa(e.name) === stringLimpa(complemento))?.id.toString();
                console.log(complemento, complementoId);

                laudemios?.push({
                    id: '',
                    imovel_id: imovelData.imovel_id || '',
                    tipo_laudemio: idLaudemio,
                    valor_laudemio: complementoId || complemento || '',
                    nameTipo: '',
                    valorName: '',
                    labelTipo: ''
                })
            }

            form = {
                ...form,
                bloco: conflito.bloco || 0,
                usuario_id: localStorage.getItem('usuario_id'),
                [conflito.campo]: conflito.valor_recibo,
                laudemios: laudemios || form.laudemios,
            }




            if (conflito.campo === 'tipo_escritura') {
                form.escritura = arrayEscritura.find((e) => e.name === conflito.valor_recibo)?.id
            }

            const res = await saveImovel(form) as unknown as ResponseSaveUser;
            if (res) {
                if (conflito.campo === 'prazo' && imovelData.informacao) imovelData.informacao.prazo = conflito.valor_recibo.toString() || '';
                setImovelData({ ...imovelData, [conflito.campo]: conflito.valor_recibo, laudemios: laudemios });
                conflito.valor_edit = conflito.valor_recibo;
                conflito.checked_edit = true;
                saveCards(conflito, itemList.label);
                itemList.check = itemList.conflitos.every((c) => !!c.checked_edit || !!c.checked_IA);
                setListConflitos([...listConflitos]);
            }
        }

        else if (conflito.tipo_conflito === 'dados') {
            const idEstadoCivil = conflito.campo === 'estado_civil' ? listEstadoCivil.find((e) => stringLimpa(e.name) === stringLimpa(conflito.valor_recibo.toString())) : undefined

            let form = {
                ...pessoa,
                tipo_usuario: itemList.label?.replace('es', ''),
                processo_id: imovelData.processo_id,
                [conflito.campo]: conflito.valor_recibo,
                estado_civil: idEstadoCivil?.id || pessoa?.estado_civil
            }

            const res = await SaveUser(form) as unknown as ResponseSaveUser;
            if (res.usuario) {
                listConflitos.forEach((e) => e.conflitos.forEach((c) => { if (c.pessoa?.id === res.usuario.id) c.pessoa = res.usuario }))
                conflito.valor_edit = conflito.valor_recibo;
                conflito.checked_edit = true;
                saveCards(conflito, itemList.label);
                itemList.check = itemList.conflitos.every((c) => !!c.checked_edit || !!c.checked_IA);
                setListConflitos([...listConflitos]);
            }

        } else {
            if (pessoa?.cpf_cnpj && !pessoa.usuario_id) {
                const dadosBanco = await getCPF(pessoa.cpf_cnpj) as unknown as Pessoa;
                conflito.pessoa = { ...conflito.pessoa, ...dadosBanco };
            }
            setOpenCadastrar(!!pessoa);
            setConflitoSelect(conflito);
        }

    };

    const returnLabelSemCadastro = (e: StepsType) => {
        const length = listConflitos.filter(c => c.label === e.elemento).reduce((acc, conflito) => acc + conflito.conflitos.length, 0)
        const type = e.elemento[0].toUpperCase() + e.elemento.substring(1);
        return `${(length === 1 ? type.replace('es', '') : type)} sem cadastro (${length})`;
    };

    useEffect(() => {
        const campo = conflitoSelect?.campo;
        const type = conflitoSelect?.pessoa?.tipo;

        if (campo === 'quantidade' && type) {
            listConflitos.forEach((e, i_grupo) => {
                e.check = e.conflitos.every((c) => !!c.checked_edit || !!c.checked_IA);

                if (e.label === type) {
                    e.conflitos.forEach((conflito, i_conflito) => {
                        console.log(conflitoSelect);
                        if (conflito.id === conflitoSelect.id) {
                            listConflitos[i_grupo].conflitos[i_conflito] = conflitoSelect;
                            if (!openCadastrar && conflitoSelect) saveCards(conflitoSelect, e.label);
                        }
                    })

                }
            })
        }
        setListConflitos([...listConflitos]);

    }, [openCadastrar]);

    const disableBtn = () => {
        const stepActive = steps.find((s) => s.active)
        const conflitosAtivos: ArrConflitosType[] = [];
        listConflitos.filter(c => c.label === stepActive?.elemento).forEach(c => {
            c.conflitos.forEach((conflito) => {
                if (stepActive?.campo === conflito.tipo_conflito) conflitosAtivos.push(conflito);
            })
        });

        if (steps.some((s) => s.active)) {
            return !conflitosAtivos.every((e) => e.checked_IA || e.checked_edit)
        } else return false;
    };

    console.log('OPEN CADASTRAR: ', openCadastrar);
    console.log('STEPS: ', steps);
    console.log('REFRESH SCREEN: ', refreshScreen)

    return (
        <>
            {!!openCadastrar && conflitoSelect &&
                <CadastrarPessoa
                    conflito={conflitoSelect}
                    setConflito={setConflitoSelect}
                    setOpenCadastrar={setOpenCadastrar}
                    data={imovelData}
                />
            }

            {!openCadastrar &&
                <>
                    <div className='recibo-evaluating'>
                        {steps.filter(i => i.active)?.map((e) => (
                            <>
                                <Header
                                    imovel={imovelData}
                                    title={e.title}
                                    quantConflitos={listConflitos.filter(c => c.label === e.elemento).reduce((acc, conflito) => acc + conflito.conflitos.length, 0)}
                                />
                            </>
                        ))}

                        {steps.some((e) => e.active) &&
                            <SwipeableViews
                                axis={'x'}
                                index={returnIndexSteps()}
                                className='swipe-container'
                            >
                                {steps.map((e, index) => (
                                    <div key={index} className={'conflitos-container'}>

                                        {e.campo === 'entrega'
                                            ? <EntregarVenda
                                                imovelData={imovelData}
                                                setImovelData={setImovelData}
                                                refreshScreen={refreshScreen}
                                                setRefreshScreen={setRefreshScreen}

                                                register={register}
                                                errors={errors}
                                                watch={watch}
                                                clearErrors={clearErrors}
                                                setError={setError}
                                                setValue={setValue}
                                                setFocus={setFocus}
                                            />

                                            : listConflitos.filter(c => c.label === e.elemento)?.map((item, indexList) =>
                                                <>
                                                    {item.conflitos.filter((c) => c.tipo_conflito === e.campo).map((conflito, indexConflito) => (
                                                        <>
                                                            {conflito.pessoa && item.conflitos[indexConflito - 1]?.pessoa !== conflito.pessoa && <h4 className='name'>{conflito.pessoa.name}</h4>}
                                                            <PaperCard
                                                                conflito={conflito}
                                                                onCheckIAMistake={(e) => onCheckIAMistake(conflito, e, item.label)}
                                                                onClickEdit={() => onClickEdit(conflito, item)}
                                                                type={e.elemento}
                                                                checked_IA={conflito.checked_IA}
                                                                checked_edit={conflito.checked_edit}
                                                            />
                                                        </>
                                                    ))}
                                                </>
                                            )
                                        }

                                    </div>
                                ))}
                            </SwipeableViews>
                        }


                        {!steps.some((e) => e.active) &&
                            <Paper elevation={1} className='card-evaluating'>
                                <Image src={progress < 100 || listConflitos.length > 0 ? loadingEvaluating : sucessEvaluating} alt={'carregando'} />
                                <h2 className='title'> {returnTitle(progress)} </h2>
                                <p>{returnText()}</p>

                            </Paper>
                        }
                    </div>
                    <footer className='footer loading'>
                        {progress > 0 && <LinearProgress className='footer-line' variant="determinate" value={progress} />}
                        <div className='feedback'>
                            <SwipeableViews
                                axis={'y'}
                                index={indexFeedback}
                                className='swipe-container'
                            >
                                {feedbacksLoading.map((e, index) => (
                                    <div key={index}>
                                        {<p>{e.msg}</p>}
                                    </div>
                                ))}
                            </SwipeableViews>
                        </div>

                        {progress === 100 &&
                            <ButtonComponent
                                onClick={handleSubmit((e) => handleNextStep())}
                                // onClick={() => handleNextStep()}
                                labelColor='white'
                                disabled={disableBtn()}
                                endIcon={<CheckIcon width={24} fill='white' />}
                                size={'large'}
                                variant={'contained'}
                                label={returnLabelBtn()}
                            />
                        }
                    </footer>
                </>
            }
            {
                Object.keys(errors).length === 0
                    ? <Loading enviar={handleEnviarVenda} loading={loading} step={stepLoading} setStep={setStepLoading} setLoading={setLoading} open={openLoading} setOpen={setOpenLoading} idProcesso={Number(imovelData?.id)} />
                    : ''
            }

        </>
    )
}

// EXECUTA ANTES DO DASHBOARD
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso } = context.params as { idProcesso: string };
    console.log("Server Side");

    return { props: { idProcesso } };
};

export default EntregarVendaLeituraIA;