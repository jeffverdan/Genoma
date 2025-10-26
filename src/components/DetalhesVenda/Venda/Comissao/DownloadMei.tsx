import {
    AlignmentType,
    Document,
    Packer,
    Paragraph,
    TextRun,
    UnderlineType,
    Header, 
    Footer,
    IRunOptions
} from "docx";
import { saveAs } from "file-saver";

import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { imageBase64DataHeader, imageBase64Datafooter } from '@/images/header_footer_mei_b64'
import { Chip, Link } from "@mui/material";
import { useEffect, useState } from "react";
import ButtonComponent from "@/components/ButtonComponent";
import { HiDownload } from "react-icons/hi";
import formatarParaMoeda from '@/functions/formatoMoedaViewApenas';
import { ParcelasComissionType } from "@/interfaces/Imovel/comissao";

interface sectores { properties: { page: { margin: { footer: number; left: number; right: number; }; }; }; headers: { default: Header; }; footers: { default: Footer; }; children: Paragraph[]; }

interface PropsType {
    imovelData: imovelDataInterface,
    parcela?: ParcelasComissionType
}

const logicaGenero = (tipo: string, dadosUsuarios: any[] | undefined, letra: any) => {
    if (!dadosUsuarios) return ''
    let genero = '';
    const arrayGenero: string[] = [];
    dadosUsuarios.forEach((element: { genero: any; }) => {
        arrayGenero.push(element.genero);
    });

    if (arrayGenero.includes("M") || arrayGenero.includes("")) {
        switch (letra) {
            case 'or':
                if (dadosUsuarios.length > 1) {
                    if (tipo === 'maiusculo') {
                        genero = 'ES'
                    } else {
                        genero = 'es'
                    }
                } else {

                }

                break;
            case 'o':
                if (dadosUsuarios.length > 1) {
                    if (tipo === 'maiusculo') {
                        genero = 'OS'
                    } else {
                        genero = 'os'
                    }
                } else {
                    if (tipo === 'maiusculo') {
                        genero = 'O'
                    } else {
                        genero = 'o'
                    }
                }
                break;
            case 'ao':
                if (dadosUsuarios.length > 1) {
                    if (tipo === 'maiusculo') {
                        genero = 'AOS'
                    } else {
                        genero = 'aos'
                    }
                } else {
                    if (tipo === 'maiusculo') {
                        genero = 'AO'
                    } else {
                        genero = 'ao'
                    }
                }
                break;
            default:
                break;
        }

    } else {
        switch (letra) {
            case 'ao':
                if (dadosUsuarios.length > 1) {
                    if (tipo === 'maiusculo') {
                        genero = 'ÀS'
                    } else {
                        genero = 'às'
                    }
                } else {
                    if (tipo === 'maiusculo') {
                        genero = 'À'
                    } else {
                        genero = 'à'
                    }
                }
                break;
            default:
                if (dadosUsuarios.length > 1) {
                    if (tipo === 'maiusculo') {
                        genero = 'AS'
                    } else {
                        genero = 'as'
                    }
                } else {
                    if (tipo === 'maiusculo') {
                        genero = 'A'
                    } else {
                        genero = 'a'
                    }
                }
                break;
        }
    }
    return genero;
};

function retornoEstadoCivil(estado_civil: string | null, registro_casamento: string, uniao_estavel: string, valor_conjuge: string, genero: string) {
    let estado = '';
    let regime = "";
    let uniao = "";
    let conjuge = "";
    if (estado_civil !== null && estado_civil !== '') {
        switch (estado_civil) {
            case "1":
                estado = (genero === "F") ? "casada," : "casado,";
                regime = " pelo regime de ";
                conjuge = " com " + valor_conjuge;
                switch (registro_casamento) {
                    case "1":
                        regime += "Separação total de bens";
                        break;
                    case "2":
                        regime += "Separação parcial de bens";
                        break;
                    case "3":
                        regime += "Separação legal de bens";
                        break;
                    case "4":
                        regime += "Comunhão de bens";
                        break;
                    case "5":
                        regime += "Comunhão parcial de bens";
                        break;

                    default:
                        break;
                }
                break;
            case "2":
                estado = (genero === "F") ? "solteira" : 'solteiro';
                break;
            case "3":
                estado = (genero === "F") ? "divorciada" : "divorciado";
                break;
            case "4":
                estado = (genero === "F") ? "viúva" : "viúvo";
                break;

            default:
                break;
        }

        if (uniao_estavel === "S") {
            uniao = ", união estavel"
            conjuge = " com " + valor_conjuge;
        }

        return estado + regime + uniao + conjuge;
    } else {
        return '';
    }
};

const extenso = require('extenso');
function formatoPorExtenso(valor: string | null) {

    console.log(valor);

    let retornoPorExtenso = '................';
    if (valor !== null) {
        valor = valor.replace(/R\$/g, '');
        valor = valor.replace(/\./g, '').replace(/\,/g, '.');

        console.log(valor)

        let valorInteiro: string | number = Math.floor(Number(valor));
        const valorDecimal = Math.round((Number(valor) - valorInteiro) * 100);
        retornoPorExtenso = extenso(valorInteiro || 0, { mode: 'currency', currency: { type: 'BRL' } });

        console.log(valorInteiro)
        console.log(valorDecimal)


        if (valorDecimal > 0) {
            const returnDecimal = extenso(valorDecimal);
            retornoPorExtenso += ` e ${returnDecimal} centavos`;
        }
    };

    return retornoPorExtenso.trim();
};

const formatNumber = (value: string | null | undefined) => {
    if (!value) return 0;
    return Number((value.replace(/[R$.]+/g, '')).replace(",", "."));
};

const DownloadMei = ({ imovelData, parcela }: PropsType) => {
    const dadosImovel = { ...imovelData };
    const [array_setores, setArray_setores] = useState<sectores[]>([]);

    const titulo = "DOCUMENTO FISCAL SIMPLIFICADO DE SERVIÇOS DE MICROEMPREENDEDOR INDIVIDUAL";

    const styles = {
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

    const header = new Header({
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

    const footer = new Footer({
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

    const paragraph_1 = new Paragraph({
        text: titulo,
        style: "normalPara",
        // break: 2,
    });

    useEffect(() => {
        if (dadosImovel) {
            const arrayVendedores: (string | IRunOptions)[] = [];
            dadosImovel.vendedores?.forEach((vendedor) => {
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

            const finalParagrafoVendedor = "doravante denominad" + logicaGenero('miniusculo', dadosImovel.vendedores, 'o') + " OUTORGANTE" + (!!dadosImovel.vendedores?.[2] ? "S" : "") + ".";

            let array_usuarios: any[] = []
            if (parcela) {
                parcela.gerentes.forEach(element => {
                    array_usuarios.push(element)
                })
                parcela.gerentes_gerais.forEach(element => {
                    array_usuarios.push(element)
                })
                parcela.corretores_opcionistas.forEach(element => {
                    array_usuarios.push(element)
                })
                parcela.corretores_vendedores.forEach(element => {
                    console.log(element);
                    
                    array_usuarios.push(element)
                })
                parcela.diretores_gerais.forEach(element => {
                    array_usuarios.push(element)
                })
                parcela.repasse_franquias.forEach(element => {
                    array_usuarios.push(element)
                })
                parcela.empresas.forEach(element => {
                    array_usuarios.push(element)
                })

            } else {
                dadosImovel.comissao?.comissao_gerentes?.forEach(element => {
                    array_usuarios.push(element);
                });

                dadosImovel.comissao?.comissao_gerente_gerais?.forEach(element => {
                    array_usuarios.push(element);
                });

                dadosImovel.comissao?.corretores_opicionistas_comissao?.forEach(element => {
                    array_usuarios.push(element);
                });

                dadosImovel.comissao?.corretores_vendedores_comissao?.forEach(element => {
                    console.log(element);
                    
                    array_usuarios.push(element);
                });
                // PARTES SEM RETORNO NA API

                if (dadosImovel.comissao?.dados_empresas?.[0]?.verificar_franquia === 0) {
                    array_usuarios.push(dadosImovel.comissao.dados_diretor_comercial);
                };

                if (dadosImovel.comissao?.dados_repasse) {
                    array_usuarios.push({ ...dadosImovel.comissao.dados_repasse });
                };
                dadosImovel.comissao?.comissao_empresas?.forEach(element => {
                    array_usuarios.push(element);
                });
            }

            let dadosBenesh = { ...dadosImovel.comissao?.dados_royalties };
            const valor_Royalties = parcela ? parcela.royalties?.valor_real : dadosImovel.comissao?.dados_royalties?.valor_real;
            const valorRoyalties = formatNumber(formatarParaMoeda(valor_Royalties || '')) || 0;

            const valor_Comunicacao = parcela ? parcela.comunicacao?.valor_real : dadosImovel.comissao?.dados_comunicacao?.valor_real;
            const valorComunicacao = formatNumber(formatarParaMoeda(valor_Comunicacao || '')) || 0;

            let valorBenesh = (valorRoyalties + valorComunicacao).toFixed(2);
            


            if (dadosBenesh) {
                dadosBenesh.valor_real = formatarParaMoeda(valorBenesh);
                array_usuarios.push(dadosBenesh);
            }

            const array_novo_usuarios: any[] = [];
            console.log(array_usuarios);            
            console.log(array_novo_usuarios);

            array_usuarios.map(usuario => {
                if (array_novo_usuarios.length > 0) {
                    const usuario_existe = array_novo_usuarios.find(id => (id?.usuario_id === usuario?.usuario_id && !!usuario?.usuario_id) || (id?.cnpj === usuario?.cnpj && usuario?.cnpj !== null && usuario?.cnpj !== undefined));
                    console.log('usuario_existe: ', usuario_existe);
                    console.log('array_novo_usuarios dentro: ', array_novo_usuarios);

                    if (usuario_existe) {
                        const index_usuario = array_novo_usuarios.findIndex(id => (id?.usuario_id === usuario?.usuario_id /*&& usuario?.nome_empresarial === null*/ && !!usuario?.usuario_id) || (id?.cnpj === usuario?.cnpj && usuario?.nome_empresarial !== null && usuario?.cnpj !== null && usuario?.cnpj !== undefined));
                        const valor_atual = formatNumber(formatarParaMoeda(array_novo_usuarios[index_usuario]?.valor_real)) || 0;
                        const valor_somar = formatNumber(formatarParaMoeda(usuario?.valor_real)) || 0;
                        const valotTotal = (valor_atual + valor_somar);
                        console.log('usuario', usuario?.nome_empresarial || usuario?.name);
                        console.log('valorAtual', valor_atual);
                        console.log('valorSoma', valor_somar);
                        console.log('valotTotal', valotTotal);
                        // 174.195,00
                        
                        // array_novo_usuarios[index_usuario].valor_real = formatarParaMoeda(valotTotal.toFixed(2));     
                        
                        if (array_novo_usuarios[index_usuario].valor_real === undefined) {
                            array_novo_usuarios[index_usuario].valor_real = formatarParaMoeda("0.00");
                        } else {
                            array_novo_usuarios[index_usuario].valor_real = formatarParaMoeda(
                                (valor_atual + valor_somar).toFixed(2)
                            );
                        }

                    } else {
                        array_novo_usuarios.push({ ...usuario });
                    }
                } else {
                    array_novo_usuarios.push({ ...usuario });
                }
            });
            


            let dadosVendedores: any = 'Tomador: ';
            const arrayVendedoresDownload: any[] = [];

            dadosVendedores = new TextRun(dadosVendedores);
            arrayVendedoresDownload.push(dadosVendedores);

            dadosImovel.vendedores?.forEach((element, index) => {
                dadosVendedores =
                    new TextRun({
                        text: (!!dadosImovel.vendedores?.[2] ? (index + 1) + ") " : '') + (element.tipo_pessoa === 0 ? element.name : element.nome_fantasia),
                        bold: true
                    });

                arrayVendedoresDownload.push(dadosVendedores);

                dadosVendedores = new TextRun(arrayVendedores[index]);
                arrayVendedoresDownload.push(dadosVendedores);
            });
            dadosVendedores = new TextRun(finalParagrafoVendedor);
            arrayVendedoresDownload.push(dadosVendedores);

            const tituloDiscrimincaoServicos = "DISCRIMINAÇÃO DOS SERVIÇOS VALOR:";

            const textoDiscriminacaoServicos = "Participação na Intermediação da venda do imóvel " + (!dadosImovel.unidade ? '' : "sendo o " + dadosImovel.unidade) + ", situado na " + dadosImovel.logradouro?.toUpperCase() + ", nº" + dadosImovel.numero + ", " + dadosImovel.bairro + ", " + dadosImovel.cidade + "/" + dadosImovel.uf + ".";

            // setArray_usuarios(array_novo_usuarios);
            array_usuarios = array_novo_usuarios;

            const newSetores: sectores[] = [];
            array_usuarios.map(usuario => {
                const nomeGerente = !usuario.name
                    ? usuario.nome_empresarial
                    : usuario.name
                        ? usuario.tipo_pessoa === 'PJ'
                            ? usuario.nome_empresarial
                            : usuario.name
                        : '';
                const razaoSocial = (usuario.nome_empresarial && usuario.nome_empresarial != null)
                    ? "(" + usuario.nome_empresarial + ")"
                    : '';
                const creci = "CRECI: " + (usuario.creci ? usuario.creci : '');
                const cpf = usuario.cpf
                    ? usuario.tipo_pessoa === 'PF'
                        ? "CPF: " + usuario.cpf
                        : "CNPJ: " + usuario.cnpj

                    : usuario.cpf_cnpj
                        ? usuario.cpf_cnpj.length >= 18
                            ? 'CNPJ: ' + usuario.cpf_cnpj
                            : 'CPF: ' + usuario.cpf_cnpj
                        : usuario.cnpj
                            ? 'CNPJ: ' + usuario.cnpj
                            : 'CNPJ: ' + usuario.empresa_cnpj;
                const dataHoje = new Date();

                const dataEmissao = "DATA DA EMISSÃO: " + dataHoje.getDate() + '/' + (dataHoje.getMonth() < 10 ? '0' : '') + (dataHoje.getMonth() + 1) + '/' + dataHoje.getFullYear();

                const valorReal = formatarParaMoeda(usuario?.valor_real || '');        
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
                        default: header,
                    },
                    footers: {
                        default: footer,
                    },
                    children: [
                        paragraph_1,

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

                newSetores.push(sectores);
            });
            setArray_setores([...newSetores]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startDownload = () => {
        if (dadosImovel) {
            const doc = new Document({
                styles: styles,
                sections: array_setores
            });

            const unidade = dadosImovel.unidade ? '_' + dadosImovel.unidade.replace('.', '').replace(' ', '_') : '';
            const complemento = dadosImovel.complemento ? '_' + dadosImovel.complemento.replace('.', '').replace(' ', '_') : '';
    
            Packer.toBlob(doc).then((blob) => {
                let imovel = dadosImovel.logradouro + '_' + dadosImovel.bairro + '_' + dadosImovel.numero + unidade + complemento + '_' + dadosImovel.cidade + '_' + dadosImovel.uf;
                let titulo_imovel = imovel.split(" ").join("_");
                const res = saveAs(blob, "Recibo_de_MEI_" + titulo_imovel + ".docx");
                console.log("Document created successfully");
            });
        }
    };

    return (
        parcela ?
            <Link
                className='link'
                onClick={() => startDownload()}>
                {`${parcela.ultima_data_envio?.split(' ')[0]}_mei${parcela.numero_parcela}`}
            </Link>
            :
            <ButtonComponent
                disabled={imovelData.comissao?.status_visualizacao_apoio !== 1}
                labelColor='white'
                size={'large'}
                variant={'contained'}
                label={'Download recibo de MEI'}
                startIcon={<HiDownload fill='white' />}
                onClick={() => startDownload()}
            />
    )

};

export default DownloadMei;