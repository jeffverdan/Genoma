import { GetServerSideProps } from "next";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views-react-18-fix";
import { CheckIcon, PencilIcon } from "@heroicons/react/24/solid";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Chip, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Skeleton, Divider, CircularProgress, Button } from "@mui/material";
import { HiArrowLeft, HiArrowRight, HiPencil } from "react-icons/hi2";
import ButtonComponent from "@/components/ButtonComponent";
import HeadSeo from "@/components/HeadSeo";
import InputSelect from "@/components/InputSelect/Index";
import RadioGroup from '@/components/RadioGroup';
import InputAutoComplete from "@/components/InputAutoComplete";
import InputText from "@/components/InputText/Index";
import { ComissaoIndividuoType, ParcelaComissoesType, ParcelaFranquiasType, ParcelaIndividuosType } from "@/interfaces/Apoio/planilhas_comissao";
import { Percent } from "@mui/icons-material";
import validarCPF from "@/functions/validarCPF";
import validarCNPJ from "@/functions/validarCNPJ";
import cnpjMask from "@/functions/cnpjMask";
import cpfMask from "@/functions/cpfMask";
import getParcelaComissao from "@/apis/getParcelaComissao";
import formatoMoeda from "@/functions/formatoMoedaViewApenas";
import formatoMoedaInput from "@/functions/formatoMoeda";
import getListGerentesPosVenda from "@/apis/getListGerentesApoio";
import getListOpcionistas from "@/apis/getListOpcionistas";
import GetListChavesPix from "@/apis/GetListChavesPix";
import GetListBancos from "@/apis/getListBancos";
import SwitchWithLabel from "@/components/SwitchButton";
import saveParcelaComissao from "@/apis/SalvarParcelaComissao.tsx";
import { useRouter } from 'next/router';
import getListEmpresas from "@/apis/getListEmpresas";
import getListDiretoresComerciais from "@/apis/getListDiretoresComerciais";
import EditPagamento from "./@DialogEditPagamento";
import EditPagamentoFranquias from "./@DialogFranquiasEditPagamento";
import { useRadioLaudo } from "@/functions/tipoLaudoOpcionista";

interface PropsType { idProcesso: string, idParcela: string };

interface DialogEditPagamentoType {
    key: keyof ParcelaIndividuosType,
    index: number,
    open: boolean
}

interface DialogFranquiasEditPagamentoType {
    key: keyof ParcelaFranquiasType,
    open: boolean
}

type ListType = {
    id: number | string
    nome: string
}

type OptionData = {
    id?: number
    usuario_id: string | number
    nome?: string
    cpf_cnpj?: string
    agencia?: string | null
    numero_conta?: string | null
    pix?: string | null
    banco_id?: string | null
    nome_empresarial?: string
    cnpj?: string
    empresa_id?: string | number
    cpf?: string
    label: string
}

const limitQuantAgents = (limit: number) => {
    const array: ListType[] = [
        { id: '0', nome: 'Selecione...' },
    ];

    for (let i = 1; i <= limit; i++) {
        array.push({ id: i, nome: `${i}` });
    }
    return array
};

const validatePercents = (e: number | string) => {
    if (typeof e === 'string') {
        e = e.replace(",", ".");
        // e = Number(e)
    }
    if (Number(e) < 0 || Number.isNaN(e)) return 0
    else if (Number(e) > 100) return 100
    else return e
};

const formatNumber = (value: string | null) => {
    if (!value) return 0;
    return Number((value.replace(/[R$.]+/g, '')).replace(",", "."));
};

const emptyValue = {
    value_autocomplete: {
        usuario_id: 0,
        label: ''
    },
    cpf: '',
    creci: '',
    porcentagem_real: '',
    desconto: '',
    valor_real: '',
    "id": '',
    "usuario_id": '',
    "name": '',
    "porcentagem_comissao": '',
    "tipo_pessoa": "PF",
    "nome_empresarial": '',
    "cnpj": '',
    "tipo_pagamento": 'pix',
    "agencia": '',
    "numero_conta": '',
    "pix": '',
    "banco_id": '',
    "nome_banco": '',
    "tipo_chave_pix_id": '',
    "chave_pix": ''
} as const

export default function EditarPlanilha(props: PropsType) {
    const { idProcesso, idParcela } = props;
    const errRequired = 'Campo obrigatório';
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [checkRepasse, setCheckRepasse] = useState(false);
    const [selectItem, setSelectItem] = useState<number>(0);
    const [listBancos, setListBancos] = useState<ListType[]>([]);
    const [listChavesPix, setListChavesPix] = useState<ListType[]>([]);
    const [listQuantAgents, setListQuantAgents] = useState(() => {
        return limitQuantAgents(4);
    });
    const [check, setCheck] = useState({
        gerentes_gerais: false,
        diretores_gerais: false,
    });

    useEffect(() => {
        if (!checkRepasse) {
            setValue('repasse_franquias', []);
        }
    }, [checkRepasse]);

    const [pessoaPagamento, setPessoaPagamento] = useState([
        { value: 'PF', disabled: false, label: 'Pessoa física', checked: false },
        { value: 'PJ', disabled: false, label: 'Pessoa jurídica', checked: false }
    ]);

    const [editPagamento, setEditPagamento] = useState<DialogEditPagamentoType>({
        key: 'corretores_vendedores',
        index: -1,
        open: false
    });

    const [editPagamentoFranquia, setEditPagamentoFranquia] = useState<DialogFranquiasEditPagamentoType>({
        key: 'royalties',
        open: false
    });

    const [radioLaudo, setRadioLaudo] = useRadioLaudo();

    const {
        register,
        watch,
        setValue,
        formState: { errors },
        handleSubmit,
        clearErrors,
        setError
    } = useForm<ParcelaComissoesType>({
        defaultValues: {
            corretores_vendedores: [],
            corretores_opcionistas: [],
            gerentes: [],
            gerentes_gerais: [],
            diretores_gerais: [],
            repasse_franquias: [],
            comunicacao: {},
            royalties: {},
            empresas: [],
        }
    });

    console.log('ID Processo: ', idProcesso);
    console.log('ID Parcela: ', idParcela);
    console.log('Form: ', watch());
    console.log('errors: ', errors);

    const emptyList = {
        usuario_id: 0,
        label: 'Selecione...',
    } as OptionData;

    const [listsApoio, setListsApoio] = useState({
        corretores_vendedores: [emptyList],
        corretores_opcionistas: [emptyList],
        gerentes: [emptyList],
        gerentes_gerais: [emptyList],
        diretores_gerais: [emptyList],
        repasse_franquias: [emptyList],
        empresas: [emptyList],
    });


    const getList = async () => {
        const dataParcela = await getParcelaComissao(idParcela);
        Object.keys(dataParcela).forEach((param) => {
            const key = param as keyof ParcelaComissoesType
            if(key === 'gerentes_gerais' || key === 'diretores_gerais') {
                if((dataParcela[key] as []).length > 0) {
                    setCheck({...check, [key]: true});
                }
            }
            setValue(key, dataParcela[key]);
        });

        const lista = await getListGerentesPosVenda();
        if (lista) {
            listsApoio.gerentes = lista.gerentes as unknown as OptionData[];
            listsApoio.gerentes_gerais = lista.gerentes_gerais as unknown as OptionData[];
        }
        console.log(lista);


        const corretores = await getListOpcionistas() as unknown as OptionData[];
        listsApoio.corretores_opcionistas = corretores;
        listsApoio.corretores_vendedores = corretores;

        // const franquias = await getListFranquias();

        const empresas = await getListEmpresas();
        const cnpjs = [...new Set(empresas.map((lojas) => lojas.cnpj))];
        const empresasFiltradas = cnpjs.map((cnpj) => empresas.find(empresa => empresa.cnpj === cnpj)) as OptionData[];
        // const arrEmpresas = empresasFiltradas.map(e => ({ usuario_id: e?.usuario_id || 0, label: e?.label || '' }));
        listsApoio.empresas = empresasFiltradas;
        listsApoio.repasse_franquias = empresasFiltradas;

        const diretores = await getListDiretoresComerciais();
        listsApoio.diretores_gerais = diretores;
        console.log(diretores);

        setListsApoio({ ...listsApoio });
        setLoading(false);
        console.log(listsApoio);


        const chavesPix = await GetListChavesPix() as unknown as ListType[];
        setListChavesPix(chavesPix);

        const bancos = await GetListBancos() as unknown as ListType[];
        bancos.unshift({ id: '', nome: 'Selecione...' })
        setListBancos(bancos || []);
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            getList(); 
        }, 100);
    }, []);

    const blocks = [
        { name: 'Corretores Vendedores', key: 'corretores_vendedores' },
        { name: 'Corretores Opcionistas', key: 'corretores_opcionistas' },
        { name: 'Gerentes', key: 'gerentes' },
        { name: 'Gerentes Gerais', key: 'gerentes_gerais' },
        { name: 'Diretor Comercial', key: 'diretores_gerais' },
        { name: 'Repasse franquia', key: 'repasse_franquias' },
        { name: 'Royalties', key: 'royalties' },
        { name: 'Comunicação', key: 'comunicacao' },
        { name: 'Empresas', key: 'empresas' },
    ] as const;

    const isValidEntity = (entity: ComissaoIndividuoType[], key: keyof ParcelaComissoesType) => {
        const paramsToCheck = ['creci', 'porcentagem_real'] as const;
        if (key === 'repasse_franquias' && checkRepasse) return false;
        else if (key !== 'repasse_franquias' && entity.length === 0) return false;
        for (const item of entity) {
            if (item.tipo_pessoa === 'PF' && (!item.cpf || !item.name)) return false;
            if (item.tipo_pessoa === 'PJ' && (!item.cnpj || !item.nome_empresarial)) return false;
            if (!paramsToCheck.every((key) => item[key])) return false;
        }
        return true;
    };

    const handleSelectItem = (i: number) => {
        setSelectItem(i);
    };

    const handleQuant = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const key = e.target.name.replace('quantidade_', '') as keyof ParcelaIndividuosType;
        const percentGrupoOpcion = radioLaudo.find((e) => e.value === watch('corretores_opcionistas.0.tipo_laudo_opcionista'))?.percent || 0;

        const arry = watch(key);
        const pessoa = key === 'empresas' || key === 'repasse_franquias' ? 'PJ' : 'PF';

        if (Number(value) > Number(arry?.length)) {
            for (let i = Number(arry?.length); i < Number(value); i++) {
                arry?.push({ ...emptyValue, tipo_pessoa: pessoa });
            }
        } else {
            for (let i = Number(value); i <= Number(arry?.length); i++) {
                arry?.pop();
            }
        }

        if (key === 'corretores_opcionistas') {
            calcParcelas(arry.length, percentGrupoOpcion, arry);
        }
        setValue(key, arry);
    };

    const calcParcelas = (quantParcela: number, valorTotal: number, arrPessoa: ComissaoIndividuoType[]) => {
        const parcelaIdeal = (valorTotal / quantParcela).toFixed(2);
        let valorSendoDestribuido = valorTotal;
        arrPessoa.forEach((pessoa, index) => {
            const valorParcela = (quantParcela > index + 1) ? parcelaIdeal : valorSendoDestribuido.toFixed(2);
            console.log(valorParcela);

            pessoa.porcentagem_real = valorParcela;

            if (valorSendoDestribuido > Number(parcelaIdeal)) valorSendoDestribuido = valorSendoDestribuido - Number(parcelaIdeal);

        });
        validatePercentOpcionistas();
    };

    const onChangeRadioLaudo = (e: string) => {
        watch('corretores_opcionistas').forEach((item, index) => {
            setValue(`corretores_opcionistas.${index}.tipo_laudo_opcionista`, e);
        });
        const percentGrupoOpcion = radioLaudo.find((tipo) => tipo.value === e)?.percent || 0;
        const arry = watch('corretores_opcionistas');
        calcParcelas(arry.length, percentGrupoOpcion, arry);
        onBlurAutoSave();
    };

    const checkValueAutoComplete = (index: number, comissaoAgent: keyof ParcelaIndividuosType) => {
        const id = watch(`${comissaoAgent}.${index}.value_autocomplete`).usuario_id
        if(!id) {
            setValue(`${comissaoAgent}.${index}`, emptyValue);
        }
    };

    const handleAutoComplete = (e: React.ChangeEvent<HTMLInputElement>, value: OptionData | null, index_gg: number, comissaoAgent: keyof ParcelaIndividuosType) => {
        if (comissaoAgent) {
            const name = typeof e === 'string' ? e : '';
            setValue(`${comissaoAgent}.${index_gg}`, {
                ...watch(`${comissaoAgent}.${index_gg}`),
            });

            if (value) {
                setValue(`${comissaoAgent}.${index_gg}.name`, value?.label || name);
                clearErrors(`${comissaoAgent}.${index_gg}.name`);                
                Object.keys(value).forEach((key) => {
                    const type = key as keyof OptionData;
                    if (type === 'id') return;
                    setValue(`${comissaoAgent}.${index_gg}.${key as keyof ComissaoIndividuoType}`, value[type]);
                });
                setValue(`${comissaoAgent}.${index_gg}.value_autocomplete`, value || { usuario_id: '', label: name });
            } else {
                setValue(`${comissaoAgent}.${index_gg}.value_autocomplete`, value || { usuario_id: '', label: name });
            }
        }
    };

    const handleEmpresa = (e: any, value: any, index: number, key: 'empresas' | 'repasse_franquias') => {
        console.log(value);
        console.log(e);

        if (!value) {
            const name = typeof e === 'string' ? e : '';
            setValue(`${key}.${index}`, {
                ...emptyValue,
                tipo_pessoa: 'PJ',
                nome_empresarial: name,
                value_autocomplete: {
                    usuario_id: '',
                    label: name
                }
            });
        } else {
            const oldValues = {
                ...watch(`${key}.${index}`),
                value_autocomplete: {
                    label: value.label,
                    usuario_id: value.id,
                }
            };
            setValue(`${key}.${index}`, { ...oldValues, ...value });
        }
    };

    const funcOpenEditPagamento = (key: keyof ParcelaIndividuosType, index_item: number) => {
        setEditPagamento({ key: key, index: index_item, open: true });
    };

    const msgCPF = "Numero do CPF inválido";
    const msgCNPJ = "Numero do CNPJ inválido";

    const isValidCPF_CNPJ = (value: string) => {
        if (value.length >= 1) {
            const type = value?.length <= 14 ? 'cpf' : ' cnpj';
            if (type === 'cpf') {
                return validarCPF(value);
            } else {
                return validarCNPJ(value);
            }
        } else return true
    };

    const handlePorcentagem = (comissaoAgent: keyof ParcelaIndividuosType | keyof ParcelaFranquiasType, index?: number) => {
        const valor = calcValueToPercent(comissaoAgent, index);
        const obj = watch(comissaoAgent);

        if (comissaoAgent !== 'empresas') {
            let desconto = 0;
            arrKeys.forEach((key) => {
                desconto = (desconto + (watch()[key].reduce((acc, value) => acc + formatNumber(value.desconto), 0)));
            });
            console.log(desconto);

            if (desconto !== 0) {
                const descontoValor = (desconto / watch('empresas').length);
                console.log(descontoValor.toFixed(2));

                watch('empresas').forEach((empresa, index) => {
                    empresa.valor_real = calcValueToPercent('empresas', index);
                    setValue(`empresas.${index}.bonificacao`, formatoMoedaInput(descontoValor.toFixed(2)));
                });
            }
        }


        if (Array.isArray(obj)) {
            const key = comissaoAgent as keyof ParcelaIndividuosType;
            setValue(`${key}.${index || 0}.valor_real`, valor || '0,00');
        } else {
            const key = comissaoAgent as keyof ParcelaFranquiasType;
            setValue(`${key}.valor_real`, valor || '0,00');
        }
    };

    const calcPercentDestribuida = () => {
        const arrKeys = [
            'corretores_opcionistas',
            'corretores_vendedores',
            'gerentes',
            'gerentes_gerais',
            'diretores_gerais',
            'repasse_franquias',
        ] as const;

        let count = 0;
        arrKeys.forEach((key) => {
            count += Number(watch(key).reduce((acc, value) => acc + Number(value.porcentagem_real), 0) || 0);
        });

        const royalties = Number(watch('royalties.porcentagem_real') || 0);
        const comunicacao = Number(watch('comunicacao.porcentagem_real') || 0);
        count = count + royalties + comunicacao;

        return count;
    };

    const calcTotalDestribuido = () => {
        const valorParcela = formatNumber(watch('valor_parcela'));
        const percent = calcPercentDestribuida();
        const valor = (valorParcela * percent) / 100
        return formatoMoeda(valor.toFixed(2));
    };

    const calcTotalEmpres = () => {
        const valorParcela = formatNumber(watch('valor_parcela'));
        const valoresDestribuidos = formatNumber(calcTotalDestribuido())
        const valor = valorParcela - valoresDestribuidos;
        return formatoMoeda(valor.toFixed(2));
    };

    const checkValorEmpresa = () => {
        const percentCadastrada = watch('empresas').reduce((acc, value) => acc + Number(value.porcentagem_real), 0) || 0;
        const percentCalculada = 100 - calcPercentDestribuida();
        const tabSelect = blocks[selectItem].key

        if (percentCadastrada !== percentCalculada) {
            return 'red'
        } else {

            return ''
        }
    };

    const calcValueToPercent = (key: keyof ParcelaComissoesType, index?: number) => {
        let percent = 0;
        let desconto = 0;
        let bonificacao = 0;

        const param = watch(`${key}`) || '';
        if (typeof param === 'object') {
            percent = Number(Array.isArray(param) ? param[index || 0].porcentagem_real : param.porcentagem_real) || 0;
            desconto = formatNumber(Array.isArray(param) ? param[index || 0].desconto : '') || 0; // ROYATIS E COMUNICAÇÃO N TEM DESCONTO
            console.log(desconto);
            bonificacao = formatNumber(Array.isArray(param) ? param[index || 0].bonificacao || '' : '') || 0;
        }

        if (Number.isNaN(percent)) return '';
        const valorParcela = formatNumber(watch('valor_parcela'));
        const valor = ((valorParcela * percent) / 100) - desconto + bonificacao;
        return formatoMoeda(valor.toFixed(2));
    };

    const checkIconsMenu = (key: keyof ParcelaComissoesType) => {
        const obj = watch(`${key}`) || '';

        let check = true;
        if (key === 'empresas' && checkValorEmpresa() === 'red') check = false;
        else if (typeof obj === 'object') {
            if (Array.isArray(obj)) {
                check = isValidEntity(obj, key);
            } else {
                check = !!obj.porcentagem_real
            }
        }
        return check
    };

    const returnColorIcon = (index: number) => {
        const key = blocks[index].key
        if (selectItem === index) return 'green'
        else if (key === 'empresas') return checkValorEmpresa()
        else return ''
    };

    const checkCPF = (e?: React.ChangeEvent<HTMLInputElement>) => {
        if (!e) return '';
        const key = e.target.name as 'corretores_vendedores.0.cpf' | 'corretores_vendedores.0.cnpj';
        const value = e.target.value;
        const check = isValidCPF_CNPJ(value);
        if (check) {
            clearErrors(key)
            onBlurAutoSave();
        }
        else {
            const msg = key.includes('cpf') ? msgCPF : msgCNPJ;
            setError(key, { type: "validate", message: msg });
        }
    };

    const onChangePercent = (key: keyof ParcelaIndividuosType) => {
        if (key === 'corretores_opcionistas') validatePercentOpcionistas();
        else onBlurAutoSave();
    };

    const [currentCount, setCurrentCount] = useState<NodeJS.Timeout>();

    const arrKeys = [
        'corretores_opcionistas',
        'corretores_vendedores',
        'gerentes',
        'gerentes_gerais',
        'diretores_gerais',
        'repasse_franquias',
    ] as const;
    const onBlurAutoSave = async (url?: string) => {
        clearTimeout(currentCount);


        setCurrentCount(setTimeout(async () => {
            const data = watch();

            arrKeys.forEach((key) => {
                data[key].forEach((item, index) => {
                    item.valor_real = calcValueToPercent(key, index);
                })
            });

            data.comunicacao.valor_real = calcValueToPercent('comunicacao');
            data.royalties.valor_real = calcValueToPercent('royalties');

            const res = await saveParcelaComissao(watch());

            if (res) arrKeys.forEach((key) => res[key]?.array_relacao?.forEach((item, index) => {
                setValue(`${key}.${index}.usuario_id`, item.usuario_id)
                if (url) router.push(url);
            }))
        }, url ? 500 : 5000));
    };

    const btnFooterBlocos = (index: number) => {
        onBlurAutoSave();
        setSelectItem(index);
    };

    const salvarSair = async () => {
        setLoadingBtn(true);
        const url = `/apoio/${idProcesso}/planilha-comissao`;
        await onBlurAutoSave(url);
    };

    const checkIsRequired = (item: ComissaoIndividuoType, index: number, campo: string) => {
        if (index === selectItem) {
            if ((campo === 'cpf' || campo === 'name') && item.tipo_pessoa === 'PJ') return false;
            if ((campo === 'nome_empresarial' || campo === 'cnpj') && item.tipo_pessoa === 'PF') return false;

            return errRequired;
        }
        return false;
    };

    const validatePercentOpcionistas = () => {
        const total = watch('corretores_opcionistas').reduce((acc, cur) => acc + Number(cur.porcentagem_real), 0);
        const tipoLaudo = watch('corretores_opcionistas.0.tipo_laudo_opcionista');
        const percentGrupoOpcion = radioLaudo.find((e) => e.value === tipoLaudo)?.percent || 0;

        console.log(total, percentGrupoOpcion);


        if (tipoLaudo && total > percentGrupoOpcion) {
            setError('corretores_opcionistas.0.porcentagem_real', {
                type: 'validate', message: 'Porcentagem dos opcionistas é maior que a do laudo.'
            })
        }
        else {
            clearErrors('corretores_opcionistas.0.porcentagem_real');
            onBlurAutoSave()
        }
    };

    const visualizarPlanilha = async () => {
        const url = `/apoio/${idProcesso}/planilha-comissao/${idParcela}/visualizar`;
        onBlurAutoSave(url);
    };

    const handleMaisQuant = (key: keyof ParcelaComissoesType) => {
        setListQuantAgents(limitQuantAgents(listQuantAgents.length * 2))
        setValue(key, '');
    };

    const checkBlocoDisabled = (key: keyof ParcelaComissoesType) => {
        if ((key === 'repasse_franquias' && !checkRepasse) ||
            ((key === 'gerentes_gerais' && !check.gerentes_gerais) ||
                (key === 'diretores_gerais' && !check.diretores_gerais))) {
            return false
        }
        return true;
    };

    return (
        <>
            <HeadSeo titlePage={"Editar Planilhas"} description='Editar planilhas' />

            <div className="edit-parcelas-container">
                <div className="menu-edit-container">
                    <div className="items-container">
                        <Chip label={`planilha 1`} className="chip neutral" />

                        <List>
                            {blocks.map((item, index) => (
                                <ListItemButton
                                    selected={selectItem === index}
                                    key={index}
                                    onClick={() => handleSelectItem(index)}
                                    className="item-content"
                                >
                                    {!loading ?
                                        <>
                                            <ListItemIcon className={'icon-item'}>
                                                {((selectItem === index) || !checkIconsMenu(item.key))
                                                    ? <HiPencil className={returnColorIcon(index)} />
                                                    : <CheckIcon className="green" />
                                                }
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.name}
                                                className="name-item"
                                            />
                                        </>
                                        : <Skeleton variant="rounded" width={204} height={42} />
                                    }
                                </ListItemButton>
                            ))
                            }
                        </List>

                    </div>

                    <ButtonComponent
                        onClick={salvarSair}
                        disabled={loadingBtn}
                        name="sair"
                        size={"large"}
                        variant={"outlined"}
                        label={"Voltar"}
                        startIcon={loadingBtn ? <CircularProgress size={20} /> : <ArrowBackIcon className="icon" />}
                    />

                </div>

                <div className="form-container">
                    <SwipeableViews
                        axis={'y'}
                        index={selectItem}
                        // onChangeIndex={handleTab}
                        className={'swipe-container apoio '}
                    >
                        {blocks.map((bloco, index) => (
                            <div key={index} hidden={index != selectItem} className="block-overflow" >
                                {!loading &&
                                    <div className="block-comissao">
                                        <h3>{bloco.name}</h3>

                                        {(bloco.key !== 'royalties' && bloco.key !== 'comunicacao') ?
                                            <>
                                                {bloco.key === 'repasse_franquias' &&
                                                    <SwitchWithLabel width={'max-content'} label={"Tem repasse"} check={checkRepasse} setCheck={setCheckRepasse} />
                                                }
                                                {console.log("Bloco: ", bloco.key)                                                }
                                                {(bloco.key === 'gerentes_gerais' || bloco.key === 'diretores_gerais') &&
                                                    <SwitchWithLabel 
                                                        width={'max-content'} 
                                                        label={`Tem ${bloco.key === 'diretores_gerais' ? "Diretor Comercial" : "Gerente Geral"}`} 
                                                        check={check[bloco.key]} 
                                                        setCheck={(value) => {
                                                            setCheck({ ...check, [bloco.key]: value });
                                                            if (value === false) setValue(bloco.key, []);
                                                        }} 
                                                    />
                                                }

                                                {(bloco.key === 'corretores_opcionistas') &&

                                                    <>
                                                        <div className="flex gap16">
                                                            <p>Tipo de laudo</p>
                                                            <Chip
                                                                className="chip green"
                                                                label={(radioLaudo.find((radio) => radio.value === watch('corretores_opcionistas.0')?.tipo_laudo_opcionista)?.percent || '0') + '%'}
                                                            />
                                                        </div>
                                                        <div>
                                                            <RadioGroup
                                                                label={''}
                                                                name={`corretores_opcionistas.0.tipo_laudo_opcionista`}
                                                                value={watch('corretores_opcionistas.0')?.tipo_laudo_opcionista?.toString() || ''}
                                                                options={radioLaudo}
                                                                setOptions={setRadioLaudo}
                                                                setValue={setValue}
                                                                changeFunction={onChangeRadioLaudo}

                                                            />
                                                            {/* {errors?.[`porcentagem_${comissaoAgent}`] && <p className='errorMsg'>*{errors?.[`porcentagem_${comissaoAgent}`]?.message}</p>} */}
                                                        </div>
                                                    </>

                                                }

                                                {checkBlocoDisabled(bloco.key) &&
                                                    <div className='select_quantidade_agents'>
                                                        <InputSelect
                                                            label={`Quantidade?*`}
                                                            value={watch(`quantidade_${bloco.key}`)}
                                                            option={listQuantAgents}
                                                            {...register(`quantidade_${bloco.key}`, {
                                                                onChange: (e) => handleQuant(e)
                                                            })}
                                                            subHeader={<Button type='button' onClick={() => handleMaisQuant(`quantidade_${bloco.key}`)}>Mais...</Button>}
                                                        />
                                                    </div>
                                                }

                                                {watch(bloco.key).map((item, index_item) => (
                                                    <>
                                                        {index_item > 0 && <Divider />}

                                                        {bloco.key !== 'empresas' && bloco.key !== 'repasse_franquias' && <RadioGroup
                                                            label={''}
                                                            options={pessoaPagamento}
                                                            setOptions={setPessoaPagamento}
                                                            name={`${bloco.key}.${index_item}.tipo_pessoa`}
                                                            value={item.tipo_pessoa}
                                                            setValue={setValue}
                                                        />}

                                                        <div className='flex gap16'>
                                                            {item.tipo_pessoa === "PF" ?
                                                                <>
                                                                    <InputAutoComplete
                                                                        options={listsApoio[bloco.key]}
                                                                        freeSolo={false}
                                                                        label='Nome completo*'
                                                                        placeholder={'Mariana Alves Da Silva'}
                                                                        value={item.value_autocomplete}
                                                                        index={index_item}
                                                                        onBlur={() => checkValueAutoComplete(index_item, bloco.key)}
                                                                        onChange={(e: any, v: OptionData | null) => handleAutoComplete(e, v, index_item, bloco.key)}
                                                                        sucess={!errors[bloco.key]?.[index_item]?.name && !!item.name}
                                                                        error={!!errors[bloco.key]?.[index_item]?.name}
                                                                        errorMsg={errRequired}
                                                                        register={register}
                                                                        pathReg={`${bloco.key}.${index_item}.value_autocomplete`}
                                                                    />
                                                                    <input hidden value={item.name} {...register(`${bloco.key}.${index_item}.name`, { required: checkIsRequired(item, index, 'name') })} />

                                                                    <InputText
                                                                        label={'CPF*'}
                                                                        key={item.tipo_pessoa}
                                                                        value={item.cpf}
                                                                        sucess={!errors[bloco.key]?.[index_item]?.cpf && !!item.cpf}
                                                                        error={!!errors[bloco.key]?.[index_item]?.cpf}
                                                                        msgError={errors[bloco.key]?.[index_item]?.cpf}
                                                                        placeholder="000.000.000-00"
                                                                        saveOnBlur={checkCPF}
                                                                        {...register(`${bloco.key}.${index_item}.cpf`, {
                                                                            required: checkIsRequired(item, index, 'cpf'),
                                                                            setValueAs: (e) => cpfMask(e)
                                                                        })}
                                                                    />
                                                                </>
                                                                : <>
                                                                    {(bloco.key === 'empresas' || bloco.key === 'repasse_franquias') ?
                                                                        <InputAutoComplete
                                                                            options={listsApoio[bloco.key]}
                                                                            label='Nome empresa*'
                                                                            freeSolo={false}
                                                                            placeholder={'Dna Imóveis'}
                                                                            value={item.value_autocomplete}
                                                                            index={index_item}
                                                                            onChange={(e: any, v: OptionData | null) => handleEmpresa(e, v, index_item, bloco.key)}
                                                                            sucess={!errors[bloco.key]?.[index_item]?.nome_empresarial && !!item.nome_empresarial}
                                                                            error={!!errors[bloco.key]?.[index_item]?.value_autocomplete}
                                                                            errorMsg={errRequired}
                                                                            register={register}
                                                                            pathReg={`${bloco.key}.${index_item}.value_autocomplete`}
                                                                        />
                                                                        :
                                                                        <InputText
                                                                            label={'Razão Social*'}
                                                                            value={item.nome_empresarial}
                                                                            placeholder="Nome Empresarial"
                                                                            sucess={!errors[bloco.key]?.[index_item]?.nome_empresarial && !!item.nome_empresarial}
                                                                            error={!!errors[bloco.key]?.[index_item]?.nome_empresarial}
                                                                            msgError={errors[bloco.key]?.[index_item]?.nome_empresarial}
                                                                            onBlurFunction={onBlurAutoSave}
                                                                            {...register(`${bloco.key}.${index_item}.nome_empresarial`, {
                                                                                required: checkIsRequired(item, index, 'nome_empresarial'),
                                                                            })}
                                                                        />
                                                                    }

                                                                    <InputText
                                                                        label={'CNPJ*'}
                                                                        key={item.tipo_pessoa}
                                                                        sucess={!errors[bloco.key]?.[index_item]?.cnpj && !!item.cnpj}
                                                                        error={!!errors[bloco.key]?.[index_item]?.cnpj}
                                                                        msgError={errors[bloco.key]?.[index_item]?.cnpj}
                                                                        width={bloco.key === 'empresas' ? "26vw" : ''}
                                                                        value={item.cnpj}
                                                                        placeholder="000.000.000/0000-00"
                                                                        saveOnBlur={checkCPF}
                                                                        {...register(`${bloco.key}.${index_item}.cnpj`, {
                                                                            required: checkIsRequired(item, index, 'cnpj'),
                                                                            setValueAs: (e) => cnpjMask(e)
                                                                        })}
                                                                    />
                                                                </>
                                                            }


                                                            <InputText
                                                                label={'CRECI*'}
                                                                value={item.creci}
                                                                placeholder="RJ-3450600/O*"
                                                                sucess={!errors[bloco.key]?.[index_item]?.creci && !!item.creci}
                                                                error={!!errors[bloco.key]?.[index_item]?.creci}
                                                                msgError={errors[bloco.key]?.[index_item]?.creci}
                                                                onBlurFunction={onBlurAutoSave}
                                                                {...register(`${bloco.key}.${index_item}.creci`, {
                                                                    required: checkIsRequired(item, index, 'creci'),
                                                                })}
                                                            />

                                                        </div>

                                                        <div className={`flex gap16`} key={`${bloco.key}.${index_item}.porcentagem_real`}>
                                                            <InputText
                                                                label={'Total de comissão*'}
                                                                error={!!errors[bloco.key]?.[index_item]?.porcentagem_real}
                                                                msgError={errors[bloco.key]?.[index_item]?.porcentagem_real}
                                                                sucess={!errors[bloco.key]?.[index_item]?.porcentagem_real && !!item.porcentagem_real}
                                                                value={item.porcentagem_real}
                                                                iconBefore={<Percent />}
                                                                onBlurFunction={() => onChangePercent(bloco.key)}
                                                                placeholder="100"
                                                                {...register(`${bloco.key}.${index_item}.porcentagem_real`, {
                                                                    required: checkIsRequired(item, index, 'porcentagem_real'),
                                                                    setValueAs: (e) => validatePercents(e),
                                                                    onChange: () => handlePorcentagem(bloco.key, index_item),
                                                                })}
                                                            />

                                                            <InputText
                                                                label={'Desconto'}
                                                                width={bloco.key === 'empresas' ? "calc(13vw - 8px)" : ''}
                                                                sucess={!errors[bloco.key]?.[index_item]?.desconto && !!item.desconto}
                                                                error={!!errors[bloco.key]?.[index_item]?.desconto}
                                                                msgError={errors[bloco.key]?.[index_item]?.desconto}
                                                                value={(item.desconto)}
                                                                onBlurFunction={onBlurAutoSave}
                                                                {...register(`${bloco.key}.${index_item}.desconto`, {
                                                                    setValueAs: (e) => formatoMoedaInput(e),
                                                                    onChange: () => handlePorcentagem(bloco.key, index_item)
                                                                })}
                                                            />

                                                            {bloco.key === 'empresas' &&
                                                                <InputText
                                                                    label={'Bonificação'}
                                                                    width={bloco.key === 'empresas' ? "calc(13vw - 8px)" : ''}
                                                                    sucess={!errors[bloco.key]?.[index_item]?.bonificacao && !!item.bonificacao}
                                                                    error={!!errors[bloco.key]?.[index_item]?.bonificacao}
                                                                    msgError={errors[bloco.key]?.[index_item]?.bonificacao}
                                                                    value={(item.bonificacao)}
                                                                    onBlurFunction={onBlurAutoSave}
                                                                    {...register(`${bloco.key}.${index_item}.bonificacao`, {
                                                                        setValueAs: (e) => formatoMoedaInput(e),
                                                                        onChange: () => handlePorcentagem(bloco.key, index_item)
                                                                    })}
                                                                />
                                                            }

                                                            <InputText
                                                                label={'Valor'}
                                                                disabled
                                                                sucess={!!item.valor_real}
                                                                name={`${bloco.key}.valor_real`}
                                                                placeholder="R$ 0,00"
                                                                value={calcValueToPercent(bloco.key, index_item)}
                                                            // {...register(`${bloco.key}.valor_real`)}
                                                            />

                                                        </div>

                                                        <div className='payment_tools'>
                                                            <ButtonComponent onClick={() => funcOpenEditPagamento(bloco.key, index_item)} size={'medium'} variant={'text'} label={'Editar pagamento'} startIcon={<PencilIcon width={20} />} />
                                                            {!!item.tipo_pagamento && <Chip className="chip green" label={item.tipo_pagamento?.toUpperCase()} />}
                                                            {item.tipo_pagamento === "pix" ?
                                                                !!item.pix && <Chip className="chip green" label={item.pix} />
                                                                :
                                                                <>
                                                                    {!!item.nome_banco && <Chip className="chip green" label={item.nome_banco?.toUpperCase()} />}
                                                                    {!!item.agencia && <Chip className="chip green" label={`AGÊNCIA: ${item.agencia}`} />}
                                                                    {!!item.numero_conta && <Chip className="chip green" label={`CONTA: ${item.numero_conta}`} />}
                                                                </>
                                                            }
                                                        </div>
                                                    </>
                                                ))}
                                            </>
                                            :
                                            <>
                                                <div className='flex gap16'>
                                                    <InputText
                                                        label={'Total de comissão*'}
                                                        sucess={!errors[bloco.key]?.porcentagem_real && !!watch(`${bloco.key}.porcentagem_real`)}
                                                        onBlurFunction={onBlurAutoSave}
                                                        iconBefore={<Percent />}
                                                        placeholder="10%"
                                                        {...register(`${bloco.key}.porcentagem_real`, {
                                                            setValueAs: (e) => validatePercents(e),
                                                            onChange: () => handlePorcentagem(bloco.key)
                                                        })}
                                                    />

                                                    <InputText
                                                        label={'Valor'}
                                                        disabled
                                                        name={`${bloco.key}.valor_real`}
                                                        placeholder="R$ 0,00"
                                                        value={calcValueToPercent(bloco.key)}
                                                    // {...register(`${bloco.key}.valor_real`)}
                                                    />
                                                </div>

                                                <div className='payment_tools'>
                                                    <ButtonComponent onClick={() => setEditPagamentoFranquia({ key: bloco.key, open: true })} size={'medium'} variant={'text'} label={'Editar pagamento'} startIcon={<PencilIcon width={20} />} />
                                                    {!!watch(`${bloco.key}`)?.tipo_pagamento && <Chip className="chip green" label={watch(`${bloco.key}`).tipo_pagamento?.toUpperCase()} />}
                                                    {watch(`${bloco.key}`)?.tipo_pagamento === "pix" ?
                                                        !!watch(`${bloco.key}`)?.pix && <Chip className="chip green" label={watch(`${bloco.key}`).pix} />
                                                        :
                                                        <>
                                                            {!!watch(`${bloco.key}`)?.nome_banco && <Chip className="chip green" label={watch(`${bloco.key}`).nome_banco?.toUpperCase()} />}
                                                            {!!watch(`${bloco.key}`)?.agencia && <Chip className="chip green" label={`AGÊNCIA: ${watch(`${bloco.key}`).agencia}`} />}
                                                            {!!watch(`${bloco.key}`)?.numero_conta && <Chip className="chip green" label={`CONTA: ${watch(`${bloco.key}`).numero_conta}`} />}
                                                        </>
                                                    }
                                                </div>
                                            </>
                                        }



                                        <footer className='footer_planilhas'>
                                            {/* BOTÕES DE AVANÇAR E RETROCEDER */}
                                            <div>
                                                {index > 0 &&
                                                    <ButtonComponent
                                                        size={"large"}
                                                        variant={"text"}
                                                        name={"previous"}
                                                        label={"Anterior"}
                                                        startIcon={<HiArrowLeft className='primary500' />}
                                                        onClick={handleSubmit(() => btnFooterBlocos(index - 1))}
                                                    />}
                                            </div>
                                            <div>
                                                <ButtonComponent
                                                    size={"large"}
                                                    variant={"contained"}
                                                    name={"previous"}
                                                    labelColor='white'
                                                    label={index + 1 === blocks.length ? "Visualizar" : "Próximo"}
                                                    endIcon={<HiArrowRight fill='white' />}
                                                    onClick={handleSubmit(() => index + 1 === blocks.length ? visualizarPlanilha() : btnFooterBlocos(index + 1))}
                                                />
                                            </div>
                                        </footer>
                                    </div>
                                }
                            </div>
                        ))}
                    </SwipeableViews>

                    <footer className="footer-form">
                        <div className="container-cards apoio">
                            <div className="card-apoio valores">
                                <p className="sub">Soma total de porcentagem =</p>
                                <p className={`sub ${calcPercentDestribuida() >= 100 ? 'red' : ''}`}>{calcPercentDestribuida()}%</p>
                                <p className="sub border">Restante empresa =</p>
                                <p className={`sub border ${checkValorEmpresa()}`}>{100 - calcPercentDestribuida()}%</p>
                                <p className="title">Total de porcentagem = </p>
                                <p className="green">100%</p>
                            </div>

                            <div className="card-apoio valores">
                                <p className="sub">Soma total de comissão =</p>
                                <p className="sub">{calcTotalDestribuido()}</p>
                                <p className="sub border">Restante empresa =</p>
                                <p className={`sub border ${checkValorEmpresa()}`}>{calcTotalEmpres()}</p>
                                <p className="title">Valor total da planilha = </p>
                                <p className="green">{watch('valor_parcela') ? watch('valor_parcela') : <Skeleton variant="rounded" width={80} height={10} />}</p>
                            </div>
                        </div>

                        <ButtonComponent
                            label={"Visualizar Planilha"}
                            onClick={() => visualizarPlanilha()}
                            size={"large"}
                            variant={"contained"}
                            labelColor="white"
                            endIcon={<HiArrowRight fill='white' />}
                        />
                    </footer>
                    <EditPagamento
                        register={register}
                        watch={watch}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        setError={setError}
                        errors={errors}
                        handleBlurPixCPF_CNPJ={isValidCPF_CNPJ}
                        msgCPF={msgCPF}
                        msgCNPJ={msgCNPJ}
                        listBancos={listBancos}
                        listChavesPix={listChavesPix}
                        editPagamento={editPagamento}
                        setEditPagamento={setEditPagamento}
                    />

                    <EditPagamentoFranquias
                        register={register}
                        watch={watch}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        setError={setError}
                        errors={errors}
                        handleBlurPixCPF_CNPJ={isValidCPF_CNPJ}
                        msgCPF={msgCPF}
                        msgCNPJ={msgCNPJ}
                        listBancos={listBancos}
                        listChavesPix={listChavesPix}
                        editPagamento={editPagamentoFranquia}
                        setEditPagamento={setEditPagamentoFranquia}
                    />
                </div>
            </div>
        </>
    )
}



// EXECUTA ANTES DO DASHBOARD
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso, idParcela } = context.params as unknown as PropsType;
    return { props: { idProcesso, idParcela } };
};