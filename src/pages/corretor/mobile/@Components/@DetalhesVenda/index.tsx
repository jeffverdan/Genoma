import React, { useState, useEffect } from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import { ItemListRecentsType, listAndamentoType, UrlsAnunciosType, ListInvestimentoType } from "@/interfaces/Corretores"
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, CalendarIcon, CurrencyDollarIcon, DocumentArrowDownIcon, PhotoIcon, CheckIcon, ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { LocationOn } from "@mui/icons-material";
import DocumentInfoIcon from "@/images/DocumentInfoIcon";
import { AlignmentType, Document, Packer, Paragraph, TextRun, UnderlineType, Header, Footer, IRunOptions, IStylesOptions, ISectionOptions } from "docx";
import { formatoPorExtenso, logicaGenero, retornoEstadoCivil } from "@/components/MEI_TOOLS";
import formatarParaMoeda from '@/functions/formatoMoedaViewApenas';
import { saveAs } from "file-saver";
import Image from "next/image";
import DialogDetalhes from "./DialogDetalhes";
import FlameIcon from "@/images/FlameIcon";
import HotSteamIcon from "@/images/HotSteamIcon";
import SnowflakeIcon from "@/images/SnowflakeIcon";
import { Chip, Skeleton } from '@mui/material/';
import PostExibirInvestimento from '@/apis/postExibirInvestimento';
import UploadNota from '../@UploadNota';
import { ClockIcon } from '@heroicons/react/24/outline';
import ShowDocument from '@/apis/getDocument';
import ProgressBar from '@/components/ProgressBar';
import converterParaReal from '@/functions/converterParaReal';

interface PropsType {
    setSelectProcess: (e: ItemListRecentsType | null) => void
    selectProcess: ItemListRecentsType | null
    listAndamento: listAndamentoType
    setSelectedTab?: (e: number) => void;
    getListAndamento: () => void
}

export default function DetalhesVenda(props: PropsType) {
    const { setSelectProcess, selectProcess, listAndamento, setSelectedTab, getListAndamento } = props;
    const [open, setOpen] = useState<boolean>(false);
    const [parcelasProcesso, setParcelasProcesso] = useState<[]>([])
    const [dadosInvestimento, setDadosInvestimentos] = useState<ListInvestimentoType>([])
    const [loading, setLoading] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [documentoNota, setDocumentoNota] = useState<any[]>([]);
    
    useEffect(() => {
        setImgError(false);
    }, [selectProcess?.url_imagens, selectProcess?.link_imagem_principal]);

    console.log('selectProcess: ', selectProcess)

    const onLinkUrl = (url: string) => {
        window.open(url, '_blank');
    };

    const listaParcelas = async () => {
        const codProcesso = selectProcess?.cod_imovel;
        const parcelas: any = listAndamento.list.filter((data: any) => data.cod_imovel === codProcesso && data.tipo_comissao === 'partes')
        console.log('PARCELAS: ', parcelas);
        setParcelasProcesso(parcelas);

        if(selectProcess?.temperatura_calculada){
            setLoading(true);
            const imovelId = selectProcess?.imovel_id || 0;
            const data: any = await PostExibirInvestimento(imovelId);
            setDadosInvestimentos(data);
            setLoading(false);
        }
    }
    console.log('Dados Investimento: ', dadosInvestimento)

    useEffect(() => {
        listaParcelas();
    }, []);

    useEffect(() => {
        const returnDocument = async () => {
            const documento: any = selectProcess?.documentos?.data;
            setDocumentoNota(documento);
        }
        returnDocument();
    }, [selectProcess]);
    console.log('documentoNota teste: ', documentoNota)
    console.log('dadosInvestimento: ', dadosInvestimento)

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

    console.log(selectProcess);
    console.log('LISTA DE ANDAMENTO EM DETALHES: ', listAndamento);

    const termometro = selectProcess?.temperatura_calculada || '';
    const classTermometro = termometro === 'frio' ? 'frio' : termometro === 'morno' ? 'morno' : 'quente';
    const iconTemperatura = termometro === 'frio' ? <SnowflakeIcon fill={'#ACA9FF'} height={20} /> : termometro === 'morno' ? <HotSteamIcon fill={'#74848B'} height={20} /> : <FlameIcon fill={'#FF7878'} height={20} />;  
    console.log('Termometro: ', termometro);

    const downloadMEI = async () => {
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
            const textoDiscriminacaoServicos = "Participação na Intermediação da venda do imóvel " + (!selectProcess.unidade ? '' : "sendo o " + selectProcess.unidade) + ", situado na " + selectProcess.logradouro?.toUpperCase() + ", nº" + selectProcess.numero + ", " + selectProcess.bairro + ", " + selectProcess.bairro + "/" + selectProcess.estado + ".";
            const userData = selectProcess.dados_corretor;
            const USUARIO = {
                ...userData,
                valor_real: selectProcess.valor,
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
            const doc = new Document({
                styles: STYLES,
                sections: arraySetores,
            });

            const unidade = selectProcess.unidade ? '_' + selectProcess.unidade.replace('.', '').replace(' ', '_') : '';
            const complemento = selectProcess.complemento ? '_' + selectProcess.complemento.replace('.', '').replace(' ', '_') : '';

            Packer.toBlob(doc).then((blob) => {
                console.log('selectProcess: ', selectProcess)
                const imovel = selectProcess?.logradouro + '_' + selectProcess?.bairro + '_' + selectProcess?.numero + unidade + complemento + '_' + selectProcess?.bairro + '_' + selectProcess?.estado;
                const TITULO_IMOVEL = imovel.split(" ").join("_");
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

    return (
        <div className="detalhes-container">
            {
                openUpload
                ? <UploadNota 
                    openUpload={openUpload} 
                    setOpenUpload={setOpenUpload} 
                    selectProcess={selectProcess} 
                    documentoNota={documentoNota} 
                    setSelectedTab={setSelectedTab} 
                    setSelectProcess={setSelectProcess} 
                    getListAndamento={getListAndamento} 
                />
                : <>
                    <div className="header-container">
                        <ButtonComponent
                            name="close"
                            variant="text"
                            onClick={() => setSelectProcess(null)}
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
                            termometro ?
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
                    
                    {/*Cards Valor e Ações de Status*/}
                    <div className="cards-mei">
                        {
                            !termometro &&
                            <div className="mei-container">
                                {
                                    selectProcess?.documentos?.data?.[0] 
                                    ?
                                    <>
                                        {/*Visualiza documento - STATUS - Solicitado / Liberado / Em transferência */}
                                        <Chip label={'Enviado'} className="chip yellow" />
                                        <span className="title">Nota fiscal enviada!</span>
                                        <div className="show-document" onClick={() => ShowDocument(selectProcess?.documentos?.data?.[0].id?.toString(), 'nota')}>
                                            {selectProcess?.documentos?.data?.[0]?.nome_original} 
                                            <CheckIcon width={20} height={20} fill={'#01988C'} />
                                        </div>
                                    </>
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

                        <div className={`mei-container`}>
                            {
                                !termometro &&
                                <>
                                    {/*Em andamento / Em pós-venda / Solicitado / Liberado / Em transferência - Cancelado (red500)*/}
                                    <ClockIcon className={`icon-clock`} width={24} height={24} />
                                    <Chip label={'Em adamento'} className="chip yellow" />
                                </>
                            }

                            <span className="title">{termometro ? 'Valor de anúncio' : returnLabel()?.label}</span>
                            <span className={`valor ${termometro ? 'valor-termometro' : ''}`}>
                                {
                                    !dadosInvestimento?.[0]?.opcao?.valor_anunciado 
                                    ? <Skeleton animation="wave" width={150} />
                                    : <>
                                            <span className="moeda">R$</span>
                                            <span className="valor-numero">
                                                {dadosInvestimento?.[0]?.opcao?.valor_anunciado?.replace(/^R\$\s?/, '') || 'R$ 0,00'}
                                            </span>
                                        </>
                                }
                            </span>

                            {
                                !termometro &&
                                <span className="tipo">{(selectProcess?.tipo_comissao === 'partes' ? `Parcela ${selectProcess?.numero_parcela} ${selectProcess?.total_parcelas ? 'de ' + selectProcess?.total_parcelas : ''}` : 'Á Vista')}</span>
                            }

                            {/*BTN Liberado ou Solicitado*/}
                            {/* {
                                !termometro 
                                ?
                                <ButtonComponent
                                    name="solicitar"
                                    variant="contained"
                                    // onClick={(e) => handleLinkAnuncio()}
                                    labelColor="white"
                                    size={"large"}
                                    disabled={false} // Solicitado - TRUE
                                    label={"Solicitar transferência"} // Solicitado
                                    startIcon={<ArrowTopRightOnSquareIcon fill="white" width={20} height={20} />}
                                />
                                :
                                ''
                            } */}

                            {/*Barra de progresso para Em transferência*/}
                            {/* <div className="progress-container">
                                <div className="progress-value">R$ 0.000,00 de 0.000,00</div>
                                <ProgressBar progress={0} />
                            </div> */}
                            
                            {
                                termometro 
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
                        termometro 
                        ?
                            termometro === 'frio' || termometro === 'morno' ?
                                <>
                                    <div className="vendidos-regiao">
                                        <span className="title">Últimos imóveis vendidos na região:</span>
                                        <ul>
                                            {
                                                loading
                                                ?
                                                <LoadingListSujestoes />
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
                                                {/* <li>
                                                    <div className="sub-title"><CheckIcon width={20} height={20} /> Ajuste de preço</div>
                                                    <div className="content">Altere o valor do anúncio para deixá-lo mais competitivo.</div>
                                                </li>

                                                <li>
                                                    <div className="sub-title"><CheckIcon width={20} height={20} /> Atualizar fotos</div>
                                                    <div className="content">Recomendamos novas fotos do imóvel.</div>
                                                </li>

                                                <li>
                                                    <div className="sub-title"><CheckIcon width={20} height={20} /> Melhore a descrição do imóvel</div>
                                                    <div className="content">Cuidado com erros de português ou não mencionar pontos importantes e atrativos.</div>
                                                </li> */}
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

                    <div className="info-container">
                        {
                            !termometro
                            ?
                            <>
                                <div className="item-detalhado">
                                    <div className="title-item-detalhado">
                                        Valor detalhado:
                                    </div>

                                    <div className="grid">
                                        <div className="row">
                                            <div className="head">
                                                <div className="papel">Gerente</div>
                                                <Chip className="chip neutral" label={'5%'}/>
                                            </div>

                                            <div className="col">
                                                <div className="titulo">Porcentagem</div>
                                                <div className="titulo">Valor de rateio</div>
                                            </div>

                                            <div className="col">
                                                <div className="titulo">50%</div>
                                                <div className="valor">R$ 1.500,00</div>
                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className="head">
                                                <div className="papel">Corretor opcionista</div>
                                                <Chip className={'chip neutral'} label={'18%'}/>
                                            </div>

                                            <div className="col">
                                                <div className="titulo">Porcentagem</div>
                                                <div className="titulo">Valor de rateio</div>
                                            </div>

                                            <div className="col">
                                                <div className="valor">100%</div>
                                                <div className="valor">R$ 1.000,00</div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col">
                                                <div className="titulo-total">Total da comissão</div>
                                            </div>

                                            <div className="col">
                                                <div className="valor-total">R$ 2.500,00</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                            :
                            ''
                        }
                    </div>

                    <div className="info-container">
                        {
                            termometro
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
                </>
            }
        </div>
    )
}