import React, { useState, useEffect } from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import { ItemListRecentsType, listAndamentoType, UrlsAnunciosType, ListInvestimentoType } from "@/interfaces/Corretores"
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, CalendarIcon, CurrencyDollarIcon, DocumentArrowDownIcon, PhotoIcon, CheckIcon, ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { CheckCircle, LocationOn } from "@mui/icons-material";
import DocumentInfoIcon from "@/images/DocumentInfoIcon";
import { AlignmentType, Document, Packer, Paragraph, TextRun, UnderlineType, Header, Footer, IRunOptions, IStylesOptions, ISectionOptions } from "docx";
import { formatoPorExtenso, logicaGenero, retornoEstadoCivil } from "@/components/MEI_TOOLS";
import formatarParaMoeda from '@/functions/formatoMoedaViewApenas';
import { saveAs } from "file-saver";
import Image from "next/image";
import DialogDetalhes from '../../../mobile/@Components/@DetalhesVenda/DialogDetalhes';
import FlameIcon from "@/images/FlameIcon";
import HotSteamIcon from "@/images/HotSteamIcon";
import SnowflakeIcon from "@/images/SnowflakeIcon";
import { Chip, Skeleton } from '@mui/material/';
import PostExibirInvestimento from '@/apis/postExibirInvestimento';
import UploadNota from '../../../mobile/@Components/@UploadNota';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import ShowDocument from '@/apis/getDocument';
import ProgressBar from '@/components/ProgressBar';
import converterParaReal from '@/functions/converterParaReal';
import HeadSeo from '@/components/HeadSeo';
import PostDadosParcelaUsuario from '@/apis/postDadosParcelaUsuario';
import { useRouter } from 'next/router';
import MobileNavPage from '@/pages/corretor/components/MobileNavPage';
import convertReal from '@/functions/converterReal';
import ValorDetalhado from '@/pages/corretor/components/@ValorDetalhado';

export default function VendaPage(){
    const router = useRouter();
    const { idCorretor, slug, id } = router.query;
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');
    const [selectProcess, setSelectProcess] = useState<ItemListRecentsType | null>(null)
    // const { setSelectProcess, selectProcess, listAndamento, setSelectedTab, getListAndamento } = props;
    const [open, setOpen] = useState<boolean>(false);
    const [parcelasProcesso, setParcelasProcesso] = useState<ItemListRecentsType[]>([])
    const [dadosInvestimento, setDadosInvestimentos] = useState<ListInvestimentoType>([])
    const [imgError, setImgError] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [documentoNota, setDocumentoNota] = useState<any[]>([]);
    const [refColor, setRefColor] = useState('');

    console.log('ROUTER: ', router)
    
    const returnValores = async () => {
        setLoading(true)
        if (router.isReady && slug) {
            if(slug !== 'parcela' && slug !== 'investimento') {
                router.push('/corretor');
            }
            else{
                if(slug === 'parcela'){
                    // Parcela
                    const response = await PostDadosParcelaUsuario(id as string);
                    console.log('response: ', response)
                    if(response){
                        await setSelectProcess(response);     
                        setStatusColor(response); 
                        listaParcelas(response);              
                        setLoading(false)
                    }
                    else{
                        setLoading(true)
                        setMessage('Erro ao retornar dados da venda')
                    }
                }
                else{
                    // Investimento
                    // const imovelId: number = Number(id);
                    const data: any = await PostExibirInvestimento(Number(id));
                    if(data){
                        setSelectProcess(data?.[0]?.opcao)
                        setDadosInvestimentos(data);
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
    console.log('SELECTPROCESS: ', selectProcess);
    console.log('dadosInvestimento: ', dadosInvestimento);

    const setStatusColor = async (response: ItemListRecentsType) => {
        switch (response?.finance_status_id) {
            case '9':
                setRefColor('yellow600');
                break;
            case '10':
                setRefColor('green500');
                break;
            case '11':
                setRefColor('primary500');
                break;
            case '12':
                setRefColor('green500');
                break;
            case '13': 
                // ID 13 Tranferido sendo exibido como Concluído
                setRefColor('green500');
                break;
            case '16':
                setRefColor('reed500');
                break;
            default:
                setRefColor('');
        }
    };

    const listaParcelas = async (response: ItemListRecentsType) => {
        setParcelasProcesso(response?.parcelas || []);

        // if(selectProcess?.temperatura_calculada){
        //     setLoading(true);
        //     const imovelId = selectProcess?.imovel_id || 0;
        //     const data: any = await PostExibirInvestimento(imovelId);
        //     setDadosInvestimentos(data);
        //    setLoading(false);
        // }
    }
    console.log('PARCELAS: ', parcelasProcesso)

    useEffect(() => {
        returnValores()
    }, [router.isReady, slug]);
    
    useEffect(() => {
        setImgError(false);
    }, [selectProcess?.url_imagens, selectProcess?.link_imagem_principal]);

    const onLinkUrl = (url: string) => {
        window.open(url, '_blank');
    };

    useEffect(() => {
        const returnDocument = async () => {
            const documento: any = selectProcess?.documentos?.data;
            setDocumentoNota(documento);
        }
        returnDocument();
    }, [selectProcess]);
    // console.log('documentoNota teste: ', documentoNota)
    // console.log('dadosInvestimento: ', dadosInvestimento)

    const returnLabel = () => {
        if(!selectProcess?.type) return { label: "" };
        if (selectProcess.type === 'producao-anual') {
            return { label: "Valor a receber" }
        } else if (selectProcess.type === 'andamento') {
            return { label: "Valor a receber" }
        } else if (selectProcess.type === 'concluidos') {
            return { label: "Valor recebido" }
        } else if (selectProcess.type === 'cancelados') {
            return { label: "Valor cancelado" }
        }
    };

    const termometro = selectProcess?.temperatura_calculada || '';
    const classTermometro = termometro === 'frio' ? 'frio' : termometro === 'morno' ? 'morno' : 'quente';
    const iconTemperatura = termometro === 'frio' ? <SnowflakeIcon fill={'#ACA9FF'} height={20} /> : termometro === 'morno' ? <HotSteamIcon fill={'#74848B'} height={20} /> : <FlameIcon fill={'#FF7878'} height={20} />;  
    // console.log('Termometro: ', termometro);

    // DOWNLOAD DO MEI
    const downloadMEI = () => {
        const TITULO = "DOCUMENTO FISCAL SIMPLIFICADO DE SERVIÇOS DE MICROEMPREENDEDOR INDIVIDUAL";
        const STYLES = {
            default: {
                heading1: {
                    run: {
                        font: "Tahoma",
                        size: 52,
                        bold: true,
                        color: "000000",
                        underline: {
                            type: UnderlineType.SINGLE,
                            color: "000000",
                        },
                    },
                    paragraph: {
                        alignment: AlignmentType.CENTER,
                        spacing: { line: 340 },
                    },
                },
                heading2: {
                    run: {
                        font: "Tahoma",
                        size: 26,
                        bold: true,
                    },
                    paragraph: {
                        spacing: { line: 340 },
                    },
                },
                heading3: {
                    run: {
                        font: "Tahoma",
                        size: 26,
                        bold: true,
                    },
                    paragraph: {
                        spacing: { line: 276 },
                    },
                },
                heading4: {
                    run: {
                        font: "Tahoma",
                        size: 26,
                        bold: true,
                    },
                    paragraph: {
                        alignment: AlignmentType.JUSTIFIED,
                    },
                },
            },
            paragraphStyles: [
                {
                    id: "normalPara",
                    name: "Normal Para",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Tahoma",
                        size: 22,
                        bold: true,
                    },
                    paragraph: {
                        alignment: AlignmentType.CENTER,
                        spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 },

                    },
                },
                {
                    id: "normalParaSpace",
                    name: "Normal ParaSpace",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Tahoma",
                        size: 22,
                    },
                },
                {
                    id: "normalPara2",
                    name: "Normal Para2",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Tahoma",
                        size: 22,
                    },
                    paragraph: {
                        alignment: AlignmentType.CENTER,
                        //spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 },
                    },
                },
                {
                    id: "normalPara3",
                    name: "Normal Para3",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Tahoma",
                        size: 22,
                    },
                    paragraph: {
                        alignment: AlignmentType.JUSTIFIED,
                    },
                },
                {
                    id: "normalParaSubTitle",
                    name: "Normal ParaSubTitle",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Tahoma",
                        size: 22,
                    },
                },
                {
                    id: "normalPara4",
                    name: "Normal Para4",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Tahoma",
                        size: 18,
                    },
                    paragraph: {
                        alignment: AlignmentType.LEFT,
                    },
                },
                {
                    id: "normalParaFooter",
                    name: "Normal Para Footer",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,

                    paragraph: {
                        spacing: {
                            before: 200,
                            after: 100,
                        },
                        indent: {
                            left: -930,
                        },
                    },
                },
            ],
        };
        const HEADER = new Header({
            children: [
                new Paragraph({
                    children: [
                        // new ImageRun({
                        //     data: imageBase64DataHeader,
                        //     transformation: {
                        //         width: 176,
                        //         height: 100
                        //     }
                        // })
                    ],
                }),
            ]
        });
        const FOOTER = new Footer({
            children: [
                new Paragraph({
                    children: [
                        // new ImageRun({
                        //     data: imageBase64Datafooter,
                        //     transformation: {
                        //         width: 795,
                        //         height: 60
                        //     }
                        // })
                    ],
                    style: "normalParaFooter"
                }),
            ],
        });
        const PARAGRAPH_1 = new Paragraph({
            text: TITULO,
            style: "normalPara",
            // break: 2,
        });
        const arraySetores: ISectionOptions[] = [];

        if (selectProcess?.vendedores) {
            const arrayVendedores: (string | IRunOptions)[] = [];

            selectProcess.vendedores?.forEach((vendedor) => {
                let dadosVendedor = '';
                if (vendedor.tipo_pessoa === 0) {
                    dadosVendedor = ", " + vendedor.nacionalidade + ", Filh" + (vendedor.genero === "F" ? "a" : "o") + " de " + vendedor.nome_mae + " " + (vendedor.nome_pai !== null ? "e " + vendedor.nome_pai : "") + ", " + vendedor.profissao + (vendedor.rg ? ", RG Nº " + vendedor.rg : "") + (vendedor.rg_expedido ? ", expedido por " + vendedor.rg_expedido : "") + (vendedor.data_rg_expedido ? ", na data " + vendedor.data_rg_expedido : "") + ", CPF: " + vendedor.cpf_cnpj + ", " + (vendedor.email !== null ? vendedor.email + "," : "") + " residente e domiciliad" + (vendedor.genero === "F" ? "a" : "o") + " na " + vendedor.logradouro + ", " + vendedor.numero + "" + (vendedor.unidade !== null ? (", " + vendedor.unidade) : '') + (vendedor.complemento !== null ? (", " + vendedor.complemento) : '') + ", " + vendedor.cep + ", " + vendedor.bairro + ", " + vendedor.cidade + " - " + vendedor.estado + ", " + retornoEstadoCivil(vendedor.estado_civil, vendedor.registro_casamento, vendedor.uniao_estavel, vendedor.conjuge, vendedor.genero) + ", ";
                } else {
                    dadosVendedor = ', sociedade empresária com sede na ' + vendedor.logradouro + ", " + vendedor.numero + "" + (vendedor.unidade !== null ? (", " + vendedor.unidade) : '') + (vendedor.complemento !== null ? (", " + vendedor.complemento) : '') + ", " + vendedor.bairro + ", " + vendedor.cidade + " - " + vendedor.estado + ", CEP " + vendedor.cep + ", inscrito no CNPJ sob o nº " + vendedor.cpf_cnpj + ", devidamente representado por ";
                    vendedor.representante_socios?.data.forEach((representante, key_representante) => {
                        dadosVendedor += representante.name + ', ' + (representante.nacionalidade !== null && representante.nacionalidade !== "" ? representante.nacionalidade + ', ' : '') + retornoEstadoCivil(representante.estado_civil, representante.registro_casamento, representante.uniao_estavel, representante.conjuge, representante.genero) + (representante.estado_civil !== null && representante.estado_civil !== "" ? ", " : "") + (representante.profissao !== null && representante.profissao !== '' ? representante.profissao + ", " : '') + (representante.rg ? " RG Nº " + representante.rg : "") + (representante.rg_expedido ? ", expedido por " + representante.rg_expedido : "") + (representante.data_rg_expedido ? ", na data " + representante.data_rg_expedido : "") + " inscrito no CPF sobre o nº " + representante.cpf_cnpj + ", " + (representante.email !== null ? " e-mail " + representante.email + "," : "") + ((vendedor.representante_socios?.data.length && vendedor.representante_socios?.data.length - 1) !== key_representante ? " e por " : " ");
                    });
                }
                arrayVendedores.push(dadosVendedor);
            });

            const finalParagrafoVendedor = "doravante denominad" + logicaGenero('miniusculo', selectProcess.vendedores, 'o') + " OUTORGANTE" + (!!selectProcess.vendedores?.[2] ? "S" : "") + ".";

            let dadosVendedores: any = 'Tomador: ';
            const arrayVendedoresDownload: any[] = [];

            dadosVendedores = new TextRun(dadosVendedores);
            arrayVendedoresDownload.push(dadosVendedores);

            selectProcess.vendedores?.forEach((element, index) => {
                dadosVendedores =
                    new TextRun({
                        text: (!!selectProcess.vendedores?.[2] ? (index + 1) + ") " : '') + (element.tipo_pessoa === 0 ? element.name : element.nome_fantasia),
                        bold: true
                    });

                arrayVendedoresDownload.push(dadosVendedores);

                dadosVendedores = new TextRun(arrayVendedores[index]);
                arrayVendedoresDownload.push(dadosVendedores);
            });
            dadosVendedores = new TextRun(finalParagrafoVendedor);
            arrayVendedoresDownload.push(dadosVendedores);

            const tituloDiscrimincaoServicos = "DISCRIMINAÇÃO DOS SERVIÇOS VALOR:";
            const textoDiscriminacaoServicos = "Participação na Intermediação da venda do imóvel " + (!selectProcess.unidade ? '' : "sendo o " + selectProcess.unidade) + ", situado na " + selectProcess.logradouro?.toUpperCase() + ", nº" + selectProcess.numero + ", " + selectProcess.bairro + ", " + selectProcess.bairro + "/" + selectProcess.uf + ".";
            const userData = selectProcess.dados_corretor;
            const USUARIO = {
                ...userData,
                valor_real: selectProcess.soma,
            };

            const nomeGerente = (USUARIO.tipo_pessoa === 1 ? USUARIO.nome_empresa : USUARIO.name) || '';
            const razaoSocial = (USUARIO.nome_empresa || '')
                ? "(" + USUARIO.nome_empresa + ")"
                : '';
            const creci = "CRECI: " + (USUARIO.creci ? USUARIO.creci : '');
            const cpf = USUARIO.cpf
                ? "CPF: " + USUARIO.cpf
                : "CNPJ: " + USUARIO.cnpj
            const dataHoje = new Date();

            const dataEmissao = "DATA DA EMISSÃO: " + dataHoje.getDate() + '/' + (dataHoje.getMonth() < 10 ? '0' : '') + (dataHoje.getMonth() + 1) + '/' + dataHoje.getFullYear();

            const valorReal = formatarParaMoeda(USUARIO.valor_real || '');
            const valorRecebido = "Valor recebido " + valorReal + " (" + formatoPorExtenso(valorReal || "") + ")";

            const sectores = {
                properties: {
                    page: {
                        margin: {
                            footer: 0,
                            left: 900,
                            right: 900
                        },
                    },
                },
                headers: {
                    default: HEADER,
                },
                footers: {
                    default: FOOTER,
                },
                children: [
                    PARAGRAPH_1,

                    new Paragraph({
                        //alignment: AlignmentType.JUSTIFIED,
                        style: "normalPara2",
                        children: [
                            new TextRun({
                                text: nomeGerente,
                                break: 2,
                            }),

                            new TextRun({
                                text: razaoSocial,
                                bold: true,
                                break: 1,
                            }),

                            new TextRun({
                                text: creci,
                                //size: 24,
                                break: 2,
                            }),

                            new TextRun({
                                text: cpf,
                                //size: 24,
                                break: 2,
                            }),

                            new TextRun({
                                text: dataEmissao,
                                //size: 24,
                                break: 2,
                            }),
                        ],
                    }),

                    new Paragraph({
                        children: [
                            new TextRun({
                                text: '',
                                break: 2
                            }),
                        ],
                    }),

                    new Paragraph({
                        style: "normalPara3",
                        children: arrayVendedoresDownload
                    }),

                    new Paragraph({
                        style: "normalParaSubTitle",
                        children: [
                            new TextRun({
                                text: tituloDiscrimincaoServicos,
                                underline: {
                                    type: UnderlineType.SINGLE,
                                    color: "000000",
                                },
                                break: 3,
                            }),
                        ],
                    }),

                    new Paragraph({
                        //alignment: AlignmentType.JUSTIFIED,
                        style: "normalPara3",
                        children: [
                            new TextRun({
                                text: textoDiscriminacaoServicos,
                                break: 1,
                            }),
                        ],
                    }),

                    new Paragraph({
                        //alignment: AlignmentType.JUSTIFIED,
                        style: "normalPara3",
                        children: [
                            new TextRun({
                                text: valorRecebido,
                                break: 2,
                            }),
                        ],
                    }),

                    new Paragraph({
                        //alignment: AlignmentType.JUSTIFIED,
                        style: "normalPara2",
                        children: [
                            new TextRun({
                                text: '__________________________________________',
                                break: 4,
                            }),

                            new TextRun({
                                text: nomeGerente,
                                bold: false,
                                break: 1.5,
                            }),

                            new TextRun({
                                text: cpf,
                                break: 1.5,
                            }),
                        ],
                    }),
                ],
            };
            arraySetores.push(sectores);
        }
        startDownload(STYLES, arraySetores);
    };
    
    const startDownload = (STYLES: IStylesOptions, arraySetores: ISectionOptions[]) => {
        if (selectProcess) {
            console.log('arraySetores: ', arraySetores)
            const doc = new Document({
                styles: STYLES,
                sections: arraySetores,
            });

            const unidade = selectProcess?.unidade ? '_' + selectProcess?.unidade?.replace('.', '').replace(' ', '_') : '';
            const complemento = selectProcess?.complemento ? '_' + selectProcess?.complemento?.replace('.', '').replace(' ', '_') : '';

            Packer.toBlob(doc).then((blob) => {
                console.log('blob: ', blob)
                console.log('selectProcess: ', selectProcess)
                const imovel = selectProcess?.logradouro + '_' + selectProcess?.bairro + '_' + selectProcess?.numero + unidade + complemento + '_' + selectProcess?.bairro + '_' + selectProcess?.uf;
                const TITULO_IMOVEL = imovel.split(" ").join("_");
                console.log('IMOVEL: ', imovel);
                console.log('TITULO_IMOVEL: ', TITULO_IMOVEL);
                const res = saveAs(blob, "Recibo_de_MEI_" + TITULO_IMOVEL + ".docx");
                console.log("Document created successfully: ", res);
            });
        }
    };

    const handleLinkAnuncio = () => {
        const link = selectProcess?.link_anuncio;
        if (link) {
            window.open(link, '_blank', 'noopener,noreferrer');
        }
    }

    const handleSolicitarTransferencia = () => {
        router.push(`/corretor/${idCorretor}/${slug}/${id}/solicitar-transferencia`);
    }

    const LoadingListSujestoes = () => {
        const arr = [1,2,3,4,5]
        return (
            <>
                {
                    arr.map(data => <>
                        <li>
                            <div className="endereco">
                                <div className="info-end-1"><Skeleton animation="wave" width={150} /></div>
                                <div className="info-end-2"><Skeleton animation="wave" width={150} /></div>  
                            </div>
                            <div className="valor"><Skeleton animation="wave" width={200} /></div>
                        </li>
                    </>)
                }
            </>
        )
    }

    const handleUpload = () => {
        setOpenUpload(true);
        sessionStorage.setItem('header_address', 'true');
    }

    // function convertReal(value: number): string {
    //     return converterParaReal(value ?? 0).replace('R$', '').toString().replace(/^R\$\s?/, '');
    // }

    const truncateText = (text: string, maxLength = 35) => {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };


    return (
        <main className="corretor inicial-page">
            <HeadSeo titlePage={slug === 'investimento' ? 'Detalhes do Investimento' : 'Detalhes da Parcela'} description="Alguma coisa" />

            { !loading ? 
            <>
                <div className="back-page-principal-container">
                    <div className="btn">
                        <ButtonComponent
                            name="close"
                            variant="text"
                            onClick={() => router.push('/corretor')}
                            size={"large"}
                            label={"Voltar"}
                            startIcon={<ArrowLeftIcon width={20} />}
                        />
                        {/* <div>
                            <Chip className={`chip neutral500}`} label={'0%'} />
                            <Chip className={`chip ${refColor}`} label={selectProcess?.status_parcela === 'AGUARDANDO PAGAMENTO' ? 'Em andamento' : selectProcess?.status_parcela} />
                        </div> */}
                    </div>
                </div>

                <div className='page-principal-container'>
                    <div className="detalhes-container">
                        <div className="header-container">
                            <ButtonComponent
                                name="close"
                                variant="text"
                                onClick={() => router.push('/corretor')}
                                size={"large"}
                                label={"Voltar"}
                                startIcon={<ArrowLeftIcon width={20} />}
                            />
                            {
                                (selectProcess?.url_imagens || selectProcess?.link_imagem_principal) && !imgError
                                    ? <Image 
                                        className="img-anuncio" 
                                        src={selectProcess?.url_imagens || selectProcess?.link_imagem_principal || ''} 
                                        alt={"Fotografio imóvel"} 
                                        width={100} 
                                        height={60}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            objectPosition: 'center'
                                        }}
                                        onError={() => setImgError(true)}
                                        onClick={() => handleLinkAnuncio()}
                                    /> 
                                    : <PhotoIcon height={164} onClick={() => handleLinkAnuncio()} />  
                            }

                            {
                                slug === 'investimento' ?
                                <div className="legenda-termometro">
                                    {iconTemperatura}
                                    <Chip className={`chip ${classTermometro}`} label={termometro} />
                                </div>
                                : ''
                            }

                            <div className="adress-container">
                                <div className="adress-row">
                                    <LocationOn className="icon-header" />
                                    <span>{selectProcess?.logradouro}</span>
                                    <span>{selectProcess?.numero ? ', ' + selectProcess?.numero : ''}</span>
                                </div>

                                <span className="adress-row sub">
                                    <span>
                                        {selectProcess?.unidade ? selectProcess?.unidade + ` - ` : ''}
                                        {selectProcess?.complemento ? selectProcess?.complemento + ` - ` : ''}
                                        {selectProcess?.complemento || selectProcess?.unidade ? ` ${selectProcess?.bairro}` : selectProcess?.bairro}
                                        {selectProcess?.estado ? ' - ' + selectProcess?.estado : ''}
                                    </span>
                                </span>
                            </div>
                        </div>

                        {/*Cards Ações de Status*/}
                        <div className="cards-mei">
                            {
                                slug === 'parcela' &&
                                <div className={`mei-container status-${selectProcess?.finance_status_id !== '9' && selectProcess?.finance_status_id !== '10' ? refColor : ''}`}>
                                    {
                                        /*selectProcess?.documentos?.data?.[0] && */
                                        (selectProcess?.finance_status_id === '11' || selectProcess?.finance_status_id === '12' || selectProcess?.finance_status_id === '13')
                                        ?
                                        selectProcess?.documentos?.data?.[0]
                                            ?
                                            <>
                                                {/*Visualiza documento - STATUS - Solicitado / Liberado / Em transferência */}
                                                <CheckCircleIcon width={24} height={24} className={`icon-check-circle`} />
                                                <Chip label={'Enviado'} className={`chip green500`} />
                                                <span className="title">Nota fiscal enviada!</span>
                                                <div className="show-document" onClick={() => ShowDocument(selectProcess?.documentos?.data?.[0].id?.toString(), 'nota')}>
                                                    {/* {selectProcess?.documentos?.data?.[0]?.nome_original}  */}
                                                    {truncateText(selectProcess?.documentos?.data?.[0]?.nome_original)}
                                                    
                                                    {selectProcess?.documentos?.data?.[0] ? <CheckIcon width={20} height={20} fill={'#01988C'} /> : null}
                                                </div>
                                            </>
                                            :
                                            <div>Documento não encontrado</div>
                                        :
                                        <>
                                            {/*STATUS - Em andamento e Liberado */}
                                            <span className="title">Envie sua nota fiscal assinada:</span>
                                            <span className="sub-title">Importante para receber sua comissão.</span>
                                            <ButtonComponent
                                                name="download"
                                                variant="text"
                                                onClick={() => downloadMEI()}
                                                labelColor="#464F53"
                                                size={"large"}
                                                label={"Baixar Recibo"}
                                                startIcon={<DocumentArrowDownIcon fill='#01988C' />}
                                            />

                                            {
                                                selectProcess?.type === 'andamento' &&
                                                <ButtonComponent
                                                    name="upload"
                                                    variant="outlined"
                                                    onClick={handleUpload}
                                                    labelColor="#01988C"
                                                    size={"large"}
                                                    label={"Enviar nota assinada"}
                                                    startIcon={<ArrowUpTrayIcon />}
                                                />
                                            }
                                        </>
                                    }                         
                                </div>
                            }

                            <div 
                                className={`mei-container status-${(selectProcess?.finance_status_id !== '12' && selectProcess?.finance_status_id !== '10') 
                                    ? (selectProcess?.finance_status_id === '9' 
                                        ? 'yellow500' 
                                        : refColor) 
                                    : ''}
                                `}
                            >
                                {
                                    slug === 'parcela' &&
                                    <>
                                        {/*Em andamento / Em pós-venda / Solicitado / Liberado / Em transferência - Cancelado (red500)*/}
                                        {
                                            selectProcess?.finance_status_id === '9'
                                            ?
                                            <ClockIcon className={`icon-clock`} width={24} height={24} />
                                            : selectProcess?.finance_status_id === '10'
                                                ? ''
                                                : <CheckCircleIcon width={24} height={24} className={`icon-check-circle`} />
                                        }
                                        
                                        <div style={{display: 'inline-block'}}>
                                            <Chip 
                                                label={selectProcess?.status_parcela === 'AGUARDANDO PAGAMENTO' 
                                                        ? 'Em andamento' 
                                                        : selectProcess?.status_parcela === 'TRANSFERIDO' 
                                                            ? 'Concluído'
                                                            : selectProcess?.status_parcela} 
                                                className={`chip ${refColor}`} 
                                            />
                                            <Chip 
                                                label={selectProcess?.data_ordenacao_exibicao ?? 'Não definida'} 
                                                className={`chip neutral500`} 
                                                style={{marginLeft: '8px'}}
                                            />
                                        </div>
                                        
                                    </>
                                }

                                <span className="title">{slug === 'investimento' ? 'Valor de anúncio' : 'Valor a receber'}</span>
                                <span className={`valor ${slug === 'investimento' ? 'valor-termometro' : ''}`}>
                                    <span className="moeda">R$</span>
                                    <span className="valor-numero">
                                        { slug === 'parcela' ? convertReal(selectProcess?.soma ?? 0) : (selectProcess?.valor_anunciado?.replace('R$', ' ') ?? 0) }
                                    </span>
                                </span>

                                {
                                    slug === 'parcela' &&
                                    <span className="tipo">{(selectProcess?.tipo_comissao === 'partes' ? `Parcela ${selectProcess?.numero_parcela} ${selectProcess?.total_parcelas ? 'de ' + selectProcess?.total_parcelas : ''}` : 'Á Vista')}</span>
                                }

                                {/*BTN Liberado ou Solicitado*/}
                                {
                                    slug === 'parcela' 
                                    ?
                                    (selectProcess?.finance_status_id === '10' || selectProcess?.finance_status_id === '11')
                                    &&
                                    <ButtonComponent
                                        name="solicitar"
                                        variant="contained"
                                        onClick={(e) => handleSolicitarTransferencia()}
                                        labelColor="white"
                                        size={"large"}
                                        disabled={selectProcess?.finance_status_id === '11' ? true : false} // Solicitado - TRUE
                                        label={"Solicitar transferência"} // Solicitado
                                        startIcon={<CurrencyDollarIcon fill="white" width={20} height={20} />}
                                    />
                                    : ''
                                }

                                {/*Barra de progresso para Em transferência*/}
                                {/*ID 13 Tranferido sendo exibido como Concluído*/}
                                {
                                    slug === 'parcela' 
                                    ? (selectProcess?.finance_status_id === '12' || selectProcess?.finance_status_id === '13') &&
                                        <div className="progress-container">
                                            <div className={`progress-value ${selectProcess.finance_status_id === '13' ? 'green500' : ''}`}>R$ {convertReal(selectProcess?.valor_transferido ?? 0)} DE {convertReal(selectProcess?.soma ?? 0)}</div>
                                            <ProgressBar progress={selectProcess?.porcentagem_faltante} />
                                        </div>
                                    : ''
                                }
                                
                                {
                                    slug === 'investimento' 
                                    ?
                                        termometro === 'frio' || termometro === 'morno'
                                        ?
                                        <ButtonComponent
                                            name="link"
                                            variant="outlined"
                                            onClick={(e) => handleLinkAnuncio()}
                                            labelColor="#01988C"
                                            size={"large"}
                                            label={"Link do anúncio"}
                                            endIcon={<ArrowTopRightOnSquareIcon />}
                                        />
                                        :''
                                    :
                                    ''
                                }
                                
                                {
                                    selectProcess?.tipo_comissao === 'partes' &&
                                    <ButtonComponent
                                        name="download"
                                        variant="text"
                                        onClick={() => setOpen(true)}
                                        labelColor="#464F53"
                                        size={"large"}
                                        label={"Ver parcelas"}
                                    />
                                }
                            </div>
                        </div>

                        {/*LINK do Anúncio*/}
                        {
                            selectProcess?.url_anuncio && <div className="mei-container">
                                <span className="title">Valor do anuncio</span>
                                <span className="valor">{selectProcess?.valor_anunciado}</span>
                                <ButtonComponent
                                    name="link"
                                    variant="outlined"
                                    onClick={() => onLinkUrl(selectProcess?.url_anuncio as string)}
                                    size={"large"}
                                    label={"Link do anúncio"}
                                    startIcon={<ArrowTopRightOnSquareIcon />}
                                />
                            </div>
                        }

                        {
                            // Exibe a lista dos imóveis mais vendidos na região quando termometro for frio e morno
                            slug === 'investimento' 
                            ?
                                termometro === 'frio' || termometro === 'morno' ?
                                    <>
                                        <div className="vendidos-regiao">
                                            <span className="title">Últimos imóveis vendidos na região:</span>
                                            <ul>
                                                {
                                                    loading
                                                    ?
                                                    'aqio'
                                                    // <LoadingListSujestoes />
                                                    :
                                                    dadosInvestimento?.[0]?.sujestoes?.length !== 0 ?
                                                        dadosInvestimento?.[0]?.sujestoes?.map((data) => <>
                                                            <li>
                                                                <div className="endereco">
                                                                    <div className="info-end-1">{data?.logradouro}, {data?.numero}</div>
                                                                    <div className="info-end-2">{data?.bairro} {data?.unidade ? ' - ' + data.unidade : ''} {data?.complemento ? ' / ' + data?.complemento : ''}</div>  
                                                                </div>
                                                                <div className="valor">{data?.valor_venda} </div>
                                                            </li>
                                                        </>)
                                                    :
                                                    <div style={{textAlign: 'center'}}>Nenhum imóvel encontrado</div>
                                                }
                                            </ul>
                                        </div>

                                        <div className="card-dicas">
                                            <div className="row">
                                                <div className="title">Como você aquece a sua opção?</div>
                                                <ul>
                                                    <li>
                                                        <div className="content" style={{padding: '0px'}}>Ajuste o valor de anúncio do imóvel! Cada vez que você reduzir o valor anunciado em 5% ou mais de diferença, seu imóvel será aquecido e sua opção estará mais atraente para uma venda de impacto.</div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </>
                                : ''
                            : ''
                        }

                        {
                            slug === 'parcela'
                            ?
                            <ValorDetalhado dadosParcela={selectProcess} />
                            :
                            ''
                        }

                        <div className="info-container">
                            {
                                slug === 'investimento'
                                ?
                                <>
                                    <div className="item-container">
                                        <span className="title"><CalendarIcon /> Última atualização</span>
                                        <span className="sub">{selectProcess?.data_atualizacao}</span>
                                    </div>

                                    <div className="item-container">
                                        <span className="title"><CalendarIcon /> Data de captação</span>
                                        <span className="sub">{selectProcess?.data_criacao_midas}</span>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="item-container">
                                        <span className="title"><CurrencyDollarIcon /> Valor de venda</span>
                                        <span className="sub">{"R$ " + selectProcess?.valor_venda || "---"}</span>
                                    </div>

                                    <div className="item-container">
                                        <span className="title"><CalendarIcon /> Data de assinatura</span>
                                        <span className="sub">{selectProcess?.data_assinatura}</span>
                                    </div>

                                    <div className="item-container">
                                        <span className="title"><DocumentInfoIcon /> Previsão de escritura</span>
                                        <span className="sub">{selectProcess?.previsao_escritura}</span>
                                    </div>
                                </>
                            }
                        </div>

                        <DialogDetalhes
                            open={open}
                            setOpen={setOpen}
                            title={'Parcelas'}
                            paperWidth={'1040px'}
                            parcelasProcesso={parcelasProcesso}
                        />
                    </div>
                    <MobileNavPage slug={slug} />  
                </div>
            </>
            :
            <div className="loading-container">
                {/* <Skeleton variant="rectangular" width={300} height={200} />
                <Skeleton variant="text" width={200} height={40} />
                <Skeleton variant="text" width={150} height={20} />
                <Skeleton variant="text" width={250} height={20} />
                <Skeleton variant="text" width={300} height={20} /> */}
                {message}
            </div>
            } 
        </main>
    );
};
