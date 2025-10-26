const numeroExtenso: any = require('numero-por-extenso');

import React, { useContext, useEffect, useState } from 'react'
import { GetServerSideProps } from 'next';
import HeaderPage from '../@header';
import HeadSeo from '@/components/HeadSeo';
//import FooterDashboard from './@footerDashboard';
//import Cards from './@cardsDashboard';
//import NavFooterMobile from '@/components/NavFooterMobile';
//import DialogVenda from './@dialog';
import GlobalContext from '@/context/GlobalContext';
//import getProcesso from '@/apis/getProcesso';
//import ReciboSinal from './@components/ReciboSinal';
import PostLocalizaProcesso from '@/apis/postLocalizaProcesso';
import GetLaudemiosList from '@/apis/getLaudemiosList';
import GetListEscrituras from '@/apis/getListEscrituras';
import GetProcesso from '@/apis/getProcesso';
import Axios from 'axios';
import styles from './Recibo.module.scss';
import Image from 'next/image';
import logoGen from '../../../../../../images/logo-recibo.svg';
import logoEmpresa from '../../../../../../images/logo_recibo.png'; // DNA
// import logoEmpresa from '../../../../../../images/logo_placeholder.png'; // DEMO
import FooterRecibo from './@components/FooterRecibo';
import { saveAs } from "file-saver";
import { useRouter } from 'next/router';

import {
    AlignmentType,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    TabStopPosition,
    TabStopType,
    TextRun,
    ImageRun,
    UnderlineType,
    convertInchesToTwip,
    Header, Footer,
    Table, TableRow, TableCell, BorderStyle, WidthType, ShadingType, IRunOptions
} from "docx";
import { any } from 'cypress/types/bluebird';
import postRascunhoDownload from '@/apis/postRascunhoDownload';
import redirect403 from '@/functions/redirect403';
import Corner from '@/components/Corner';
import dayjs from 'dayjs';

type ImovelData = {
    bairro: string
    cidade: string
    logradouro: string
    numero: string
    complemento: string
    unidade: string
}

interface IEmpresa {
    id?: number,
    razaoSocial?: string,
    cnpj?: string,
    verificarFranquia: number
}

const returnTipoImovel = (tipo?: string) => {
    if (tipo) {
        const fisrtWord = tipo.split(' ')[0];
        const genero = fisrtWord[fisrtWord.length - 1];
        return `pel${genero} ${tipo.toLowerCase()}`
    } else {
        return 'pelo ...........';
    }
};

function Recibo({ idProcesso }: { idProcesso: any }) {
    const [loading, setLoading] = useState(true);
    const [imovelData, setImovelData] = useState<ImovelData>();
    const [dadosVenda, setDadosVenda] = useState<any>([]);
    const [tipoLaudemio, setTipoLaudemio] = useState<any>([]);
    const [listEscrituras, setListEscrituras] = useState<any>([]);
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const [suspense, setSuspense] = useState<boolean>(true);
    const [downloadDate, setDownloadDate] = useState({ date: '', hours: '' });
    const now = dayjs();

    // LOGO RECIBO PARA BASE64
    const [base64String, setBase64String] = useState<string | null>(null);

    // DADOS EMPRESA
    const [dadosEmpresa, setDadosEmpresa] = useState<IEmpresa>()

    useEffect(() => {

        const returnDadosEmpresa = async () => {
            const dadosEmpresa = localStorage.getItem('empresa_loja');
            if (dadosEmpresa !== null) {
                const showEmpresa = JSON.parse(dadosEmpresa)[0];
                setDadosEmpresa(
                    {
                        id: showEmpresa?.id || '',
                        razaoSocial: showEmpresa?.nome_empresarial || '',
                        cnpj: showEmpresa?.cnpj || '',
                        verificarFranquia: showEmpresa?.verificar_franquia || ''
                    }
                )
            }
        };

        const convertImageToBase64 = async () => {
            try {
                // Use logoEmpresa.src para obter a URL da imagem
                const response = await fetch(logoEmpresa.src);
                const blob = await response.blob();
                const reader = new FileReader();

                reader.onloadend = () => {
                    // O resultado é a string em Base64
                    setBase64String(reader.result as string);
                };

                reader.readAsDataURL(blob);
            } catch (error) {
                console.error('Erro ao converter a imagem para Base64:', error);
            }
        };

        const porcentagemVisualizacao = async () => {
            const token: any = localStorage.getItem('token');
            const processo: any = await GetProcesso(idProcesso, router);

            if (processo?.informacao?.data_download_recibo !== '') {
                const dataHoraDownload = processo?.informacao?.data_download_recibo.split(' ');
                const splitHorarioDownload = dataHoraDownload[1].split(':');
                const horaDownload = `${splitHorarioDownload[0]}h:${splitHorarioDownload[1]}`;

                setDownloadDate({
                    date: dataHoraDownload[0],
                    hours: horaDownload
                })
            }

            // Processo enviado para o Pós nos sequintes status, vai exibir tela de 403
            // 1,2,3,4,5,6,7,21,26
            const statusProcesso = processo?.status[0]?.id;
            redirect403(statusProcesso, router, setSuspense)

            if (!processo?.validar_imovel
                && !processo?.validar_vendedor
                /*&& (processo?.porcenagem_preenchida_compradores > 0 
                || processo?.porcenagem_preenchida_compradores < 100)*/) {

                router.push('/vendas/gerar-venda/' + processo.processo_id + '/dashboard')
            }

            // if(processo?.porcenagem_preenchida_imovel < 100 
            //     || processo?.porcenagem_preenchida_vendedores < 100
            //     || processo?.porcenagem_preenchida_compradores > 0 && processo?.porcenagem_preenchida_compradores < 100
            // ){   
            //     router.push('/vendas/gerar-venda/' + processo.processo_id + '/dashboard')
            // }
        }

        const getImovelData = async () => {
            const data: any = await PostLocalizaProcesso(idProcesso);
            if (data?.imovel) {
                setImovelData(data.imovel);
                setDadosVenda(data.imovel);
            }

        };

        const getLaudemios = async () => {
            const data: any = await GetLaudemiosList();
            setTipoLaudemio(data);
        };

        const getEscrituras = async () => {
            const data: any = await GetListEscrituras();
            setListEscrituras(data);
        };

        const returnGets = async () => {
            setLoading(true);
            await returnDadosEmpresa();
            await convertImageToBase64();
            await porcentagemVisualizacao();
            await getImovelData();
            await getLaudemios();
            getEscrituras();
            setLoading(false);
        }
        returnGets();

        // setLoading(true);
        // getImovelData();        
        // getLaudemios();
        // getEscrituras();
        // setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // console.log('DADOS EMPRESA: ', dadosEmpresa);
    // console.log('DADOS VENDA: ', dadosVenda);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // COD RECIBO SINAL
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // O loading false, parece que não deixa ele quebrar o código
    const formatoPorExtenso = (valor: any) => {
        if (loading === false) {
            let retornoPorExtenso = '................';
            if (valor !== null) {
                let valorNumero = valor?.replace(/R\$/g, '');
                valorNumero = valorNumero?.replace(/\./g, '');
                valorNumero = valorNumero?.replace(/\,/g, '.');
                retornoPorExtenso = numeroExtenso.porExtenso(valorNumero, numeroExtenso.estilo.monetario);
            }
            return retornoPorExtenso.trim();
        }
    };

    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();

    //lê os laudemios retornados em dadosReciboEnviado
    const laudemiosEnviados: any = dadosVenda?.laudemios?.map((laudemio: any) => parseInt(laudemio.valor_laudemio));

    //Comparar dadosReciboEnviado a uma lista de todos os laudemios "tipoLaudemio" e retorna o id e nomes para exibir
    const laudemioValorToName = tipoLaudemio?.filter((laudemio: any) => laudemiosEnviados?.includes(laudemio.id));

    const laudemiosSemNome: [] = dadosVenda?.laudemios?.filter((laudemio: any) => laudemio?.tipo_laudemio === "2" || laudemio?.tipo_laudemio === "1") || '';
    laudemioValorToName.push(...laudemiosSemNome);

    // Plural Vendedor
    const logicaPluralVendS = dadosVenda?.vendedores?.data.length > 1 ? "S" : "";
    const logicaPluralVendSMinusculo = dadosVenda?.vendedores?.data.length > 1 ? "s" : "";
    const logicaPluraVendMminusculo = dadosVenda?.vendedores?.data.length > 1 ? "m" : "";
    const logicaPluraVendAO = dadosVenda?.vendedores?.data.length > 1 ? "ão" : "á";
    const logicaPluraVendEM = dadosVenda?.vendedores?.data.length > 1 ? "em" : "";

    // Plural Comprador
    const logicaPluralCompS = dadosVenda?.compradores?.data?.length > 1 ? "S" : "";
    const logicaPluralCompSMinusculo = dadosVenda?.compradores?.data?.length > 1 ? "s" : "";
    const logicaPluraCompMminusculo = dadosVenda?.compradores?.data?.length > 1 ? "m" : "";
    const logicaPluraCompAO = dadosVenda?.compradores?.data?.length > 1 ? "ão" : "á";
    const logicaPluraCompEM = dadosVenda?.compradores?.data?.length > 1 ? "em" : "";

    const logicaGenero = (tipo: string, dadosUsuarios: any[], letra: any, comecoDeFrase?: any) => {
        let genero = '';
        let arrayGenero: any[] = [];
        dadosUsuarios?.forEach((element: { genero: any; }) => {
            arrayGenero.push(element.genero);
        });

        if (arrayGenero.includes("M") || arrayGenero.includes("")) {
            switch (letra) {
                case 'or':
                    if (dadosUsuarios?.length > 1) {
                        if (tipo === 'maiusculo') {
                            genero = 'ES'
                        } else {
                            genero = 'es'
                        }
                    } else {

                    }

                    break;
                case 'o':
                    if (dadosUsuarios?.length > 1) {
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
                    if (dadosUsuarios?.length > 1) {
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
                    if (dadosUsuarios?.length > 1) {
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
                    if (dadosUsuarios?.length > 1) {
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
        if (comecoDeFrase) genero = genero[0]?.toUpperCase() + genero.slice(1);
        return genero;
    }


    // Texto Vendedor
    const rascunhoTitulo = "RECIBO DE SINAL E PRINCÍPIO DE PAGAMENTO E PROMESSA DE COMPRA E VENDA";
    const textoVendedor = "Que entre si fazem de um lado como OUTORGANTE" + logicaPluralVendS + " PROMITENTE" + logicaPluralVendS + " VENDEDOR" + logicaGenero('maiusculo', dadosVenda?.vendedores?.data, 'or') + ":";
    let dadosVendedor = '';
    let arrayVendedores: any[] = [];

    //pular linha
    const vendedoresFiltrados = (dadosVenda?.vendedores?.data || []).filter((v: any) => v.verificar_conjuge === 0);
    const ultimoIndexVendedores = vendedoresFiltrados.length - 1;
    let pularLinhaVendedor = '';

    dadosVenda?.vendedores?.data.forEach((vendedor: any, index: any) => {
        if (vendedor.tipo_pessoa === 0) {

            if (index === ultimoIndexVendedores) {
                pularLinhaVendedor = ", "

            } else {
                pularLinhaVendedor = "; \n"

            }
            // Primeiro, encontrar o cônjuge correspondente
            const conjugeVendedor = dadosVenda?.vendedores?.data.find(
                (v: any) => v.id === vendedor.usuario_id_conjuge
            );

            const dadosBaseVendedor = ", " + vendedor.nacionalidade
                + ", Filh" + (vendedor.genero === "F" ? "a" : "o") + " de " + vendedor.nome_mae
                + " " + (vendedor.nome_pai !== null ? "e " + vendedor.nome_pai : "") + ", "
                + vendedor.profissao + (vendedor.rg ? ", RG Nº " + vendedor.rg : "")
                + (vendedor.rg_expedido ? ", expedido por "
                    + vendedor.rg_expedido : "") + (vendedor.data_rg_expedido ? ", na data " + vendedor.data_rg_expedido : "")
                + ", CPF: " + vendedor.cpf_cnpj
                + (vendedor.email !== null ? ", " + vendedor.email + "," : "");

            if (conjugeVendedor && !!vendedor.conjuge) {
                dadosVendedor = dadosBaseVendedor + " "
                    + (vendedor.uniao_estavel == "S" ? "em união estavel " : (vendedor.genero === "F" ? "casada " : "casado ")) + 'com '
                    + vendedor.conjuge + ", "
                    + conjugeVendedor.nacionalidade + ", "
                    + "Filh" + (conjugeVendedor.genero === "F" ? "a" : "o") + " de " + conjugeVendedor.nome_mae
                    + " " + (conjugeVendedor.nome_pai !== null ? "e " + conjugeVendedor.nome_pai : "") + ", "
                    + conjugeVendedor.profissao + (conjugeVendedor.rg ? ", RG Nº " + conjugeVendedor.rg : "")
                    + (conjugeVendedor.rg_expedido ? ", expedido por " + conjugeVendedor.rg_expedido : "")
                    + (conjugeVendedor.data_rg_expedido ? ", na data " + conjugeVendedor.data_rg_expedido : "")
                    + (conjugeVendedor.registro_casamento !== '1' ? ", CPF: " + conjugeVendedor.cpf_cnpj + ", " : '')
                    + (conjugeVendedor.email !== null ? conjugeVendedor.email + "" : "")
                    + " residentes e domiciliados" + " na " + vendedor.logradouro + ", " + vendedor.numero + "" + (vendedor.unidade !== null ? (", " + vendedor.unidade) : '') + (vendedor.complemento !== null ? (", " + vendedor.complemento) : '') + ", " + vendedor.cep + ", " + vendedor.bairro + ", " + vendedor.cidade + " - " + vendedor.estado + pularLinhaVendedor;
            } else if (!conjugeVendedor && !!vendedor.conjuge) {
                dadosVendedor = dadosBaseVendedor + " "
                    + (vendedor.uniao_estavel == "S" ? "em união estavel " : (vendedor.genero === "F" ? "casada " : "casado ")) + 'com '
                    + vendedor.conjuge + ", "
                    + " residentes e domiciliados" + " na " + vendedor.logradouro + ", " + vendedor.numero + "" + (vendedor.unidade !== null ? (", " + vendedor.unidade) : '') + (vendedor.complemento !== null ? (", " + vendedor.complemento) : '') + ", " + vendedor.cep + ", " + vendedor.bairro + ", " + vendedor.cidade + " - " + vendedor.estado + pularLinhaVendedor;
            } else {
                dadosVendedor = dadosBaseVendedor + ' ' + vendedor.estado_civil_nome.toLowerCase().slice(0, -1) + (vendedor.genero === "F" ? "a" : "o") + ", " + " residente e domiciliad" + (vendedor.genero === "F" ? "a" : "o") + " na " + vendedor.logradouro + ", " + vendedor.numero + "" + (vendedor.unidade !== null ? (", " + vendedor.unidade) : '') + (vendedor.complemento !== null ? (", " + vendedor.complemento) : '') + ", " + vendedor.cep + ", " + vendedor.bairro + ", " + vendedor.cidade + " - " + vendedor.estado + pularLinhaVendedor;
            }

        } else {
            dadosVendedor = ', sociedade empresária com sede na ' + vendedor.logradouro + ", " + vendedor.numero + "" + (vendedor.unidade !== null ? (", " + vendedor.unidade) : '') + (vendedor.complemento !== null ? (", " + vendedor.complemento) : '') + ", " + vendedor.bairro + ", " + vendedor.cidade + " - " + vendedor.estado + ", CEP: " + vendedor.cep + ", inscrito no CNPJ sob o nº " + vendedor.cpf_cnpj + ", devidamente representado por ";
            vendedor.representante_socios.data.forEach((representante: any, key_representante: any) => {
                dadosVendedor += representante.name + ', ' + (representante.nacionalidade !== null && representante.nacionalidade !== "" ? representante.nacionalidade + ', ' : '') + retornoEstadoCivil(representante.estado_civil, representante.registro_casamento, representante.uniao_estavel, representante.conjuge, representante.genero) + (representante.estado_civil !== null && representante.estado_civil !== "" ? ", " : "") + (representante.profissao !== null && representante.profissao !== '' ? representante.profissao + ", " : '') + (representante.rg ? " RG Nº " + representante.rg : "") + (representante.rg_expedido ? ", expedido por " + representante.rg_expedido : "") + (representante.data_rg_expedido ? ", na data " + representante.data_rg_expedido : "") + " inscrito no CPF sobre o nº " + representante.cpf_cnpj + ", " + (representante.email !== null ? " e-mail " + representante.email + "," : "") + ((vendedor.representante_socios.data.length - 1) !== key_representante ? " e por " : " ");
            });
        }
        arrayVendedores.push(dadosVendedor);
    });

    const finalParagrafoVendedor = "doravante denominad" + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ".";

    //Texto Comprador
    let textoComprador = ''
    if (dadosVenda?.compradores?.data.length === 0) {
        textoComprador = "E de outro lado como OUTORGADO PROMITENTE COMPRADOR:"
    }
    else {
        textoComprador = "E de outro lado como OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + " PROMITENTE" + logicaPluralCompS + " COMPRADOR" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'or') + ":";
    }

    let dadosComprador = 'alguma coisa aqui';
    let arrayCompradores: any[] = [];

    //pular linha
    const compradoresFiltrados = (dadosVenda?.compradores?.data || []).filter((v: any) => v.verificar_conjuge === 0);
    const ultimoIndexCompradores = compradoresFiltrados.length - 1;
    let pularLinhaComprador = '';

    if (dadosVenda?.compradores?.data.length > 0) {
        dadosVenda?.compradores?.data.forEach((comprador: any, index: any) => {
            if (comprador.tipo_pessoa === 0) {

                if (index === ultimoIndexCompradores) {
                    pularLinhaComprador = ", "
                } else {
                    pularLinhaComprador = "; \n"
                }

                // Primeiro, encontrar o cônjuge correspondente
                const conjugeComprador = dadosVenda?.compradores?.data.find(
                    (v: any) => v.id === comprador.usuario_id_conjuge
                );
                const dadosBaseComprador = ", " + comprador.nacionalidade
                    + ", Filh" + (comprador.genero === "F" ? "a" : "o") + " de " + comprador.nome_mae
                    + " " + (comprador.nome_pai !== null ? "e " + comprador.nome_pai : "") + ", "
                    + comprador.profissao + (comprador.rg ? ", RG Nº " + comprador.rg : "")
                    + (comprador.rg_expedido ? ", expedido por "
                        + comprador.rg_expedido : "") + (comprador.data_rg_expedido ? ", na data " + comprador.data_rg_expedido : "")
                    + ", CPF: " + comprador.cpf_cnpj
                    + (comprador.email !== null ? ", " + comprador.email + "," : "")

                if (conjugeComprador) {
                    dadosComprador = dadosBaseComprador + ", "
                        + (comprador.uniao_estavel == "S" ? "em união estavel " : (comprador.genero === "F" ? "casada " : "casado ")) + 'com '
                        + comprador.conjuge + ", "
                        + conjugeComprador.nacionalidade + ", "
                        + "Filh" + (conjugeComprador.genero === "F" ? "a" : "o") + " de " + conjugeComprador.nome_mae
                        + " " + (conjugeComprador.nome_pai !== null ? "e " + conjugeComprador.nome_pai : "") + ", "
                        + conjugeComprador.profissao + (conjugeComprador.rg ? ", RG Nº " + conjugeComprador.rg : "")
                        + (conjugeComprador.rg_expedido ? ", expedido por "
                            + conjugeComprador.rg_expedido : "") + (conjugeComprador.data_rg_expedido ? ", na data " + conjugeComprador.data_rg_expedido : "")
                        + ", CPF: " + conjugeComprador.cpf_cnpj + ", "
                        + (conjugeComprador.email !== null ? conjugeComprador.email + "," : "")
                        + " residentes e domiciliados" + " na " + comprador.logradouro + ", " + comprador.numero + "" + (comprador.unidade !== null ? (", " + comprador.unidade) : '') + (comprador.complemento !== null ? (", " + comprador.complemento) : '') + ", " + comprador.cep + ", " + comprador.bairro + ", " + comprador.cidade + " - " + comprador.estado + pularLinhaComprador;
                } else if (!conjugeComprador && !!comprador.conjuge) {
                    dadosComprador = dadosBaseComprador + " "
                        + (comprador.uniao_estavel == "S" ? "em união estavel " : (comprador.genero === "F" ? "casada " : "casado ")) + 'com '
                        + comprador.conjuge + ", "
                        + " residentes e domiciliados" + " na " + comprador.logradouro + ", " + comprador.numero + "" + (comprador.unidade !== null ? (", " + comprador.unidade) : '') + (comprador.complemento !== null ? (", " + comprador.complemento) : '') + ", " + comprador.cep + ", " + comprador.bairro + ", " + comprador.cidade + " - " + comprador.estado + pularLinhaComprador;
                }
                else {
                    dadosComprador = dadosBaseComprador + ' ' + comprador.estado_civil_nome.toLowerCase().slice(0, -1) + (comprador.genero === "F" ? "a" : "o") + ", " + " residente e domiciliad" + (comprador.genero === "F" ? "a" : "o") + " na " + comprador.logradouro + ", " + comprador.numero + "" + (comprador.unidade !== null ? (", " + comprador.unidade) : '') + (comprador.complemento !== null ? (", " + comprador.complemento) : '') + ", " + comprador.cep + ", " + comprador.bairro + ", " + comprador.cidade + " - " + comprador.estado + pularLinhaComprador;
                }
                arrayCompradores.push(dadosComprador);
            } else {
                dadosComprador = ', sociedade empresária com sede na ' + (comprador.logradouro || '(Rua)') + ", " + (comprador.numero || '(Número)') + "" + (comprador.unidade !== null ? (", " + comprador.unidade) : '') + (comprador.complemento !== null ? (", " + comprador.complemento) : '') + ", " + (comprador.bairro || '(Bairro)') + ", " + (comprador.cidade || 'Rio de Janeiro') + " - " + (comprador.estado || 'RJ') + ", CEP: " + (comprador.cep || '(CEP)') + ", inscrito no CNPJ sob o nº " + (comprador.cpf_cnpj || '00.000.000/0000-00') + ", devidamente representado por ";
                comprador.representante_socios.data.forEach((representante: any, key_representante: any) => {
                    dadosComprador += (representante.name || '(Nome completo)') + ', ' + (representante.nacionalidade !== null && representante.nacionalidade !== "" ? representante.nacionalidade + ', ' : '') + retornoEstadoCivil((representante.estado_civil || '(Estado Civil)'), (representante.registro_casamento || '(Regime de Casamento)'), (representante.uniao_estavel || '(União Estável)'), (representante.conjuge || '(Nome do Cônjuge)'), (representante.genero || '(Gênero)')) + (representante.estado_civil !== null && representante.estado_civil !== "" ? ", " : "(Estado Civil), ") + (representante.profissao !== null && representante.profissao !== '' ? representante.profissao + ", " : '') + (representante.rg ? " RG Nº " + representante.rg : "") + (representante.rg_expedido ? ", expedido por " + representante.rg_expedido : "") + (representante.data_rg_expedido ? ", na data " + representante.data_rg_expedido : "") + " inscrito no CPF sobre o nº " + (representante.cpf_cnpj || '000.000.000-00') + ", " + (representante.email !== null ? representante.email + "," : "") + ((comprador.representante_socios.data.length - 1) !== key_representante ? " e por " : " ");
                });
                arrayCompradores.push(dadosComprador);
            }

        });
    }
    else {
        dadosComprador = "(Nome Completo), brasileiro, Filho de (Nome da Mãe), (Profissão), CPF: 000.000.000-00, residente e domiciliado na (Rua), (Número), (CEP), (Bairro), Rio de Janeiro - RJ, (Estado Civil), "
        arrayCompradores.push(dadosComprador);
    };

    let finalParagrafoComprador = ""
    if (dadosVenda?.compradores?.data.length === 0) {
        finalParagrafoComprador = "doravante denominado OUTORGADO.";
    }
    else {
        finalParagrafoComprador = "doravante denominad" + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + ".";
    };


    const enderecoImovel: string = dadosVenda.logradouro + ", " + dadosVenda.numero + "" + (dadosVenda.unidade !== null ? (', ' + dadosVenda.unidade) : '') + (dadosVenda.complemento !== null ? (', ' + dadosVenda.complemento) : '') + ", " + dadosVenda.bairro + ", " + dadosVenda.cidade + " - " + dadosVenda.uf;
    const dadosImovel: string = "Recebe" + logicaPluraCompMminusculo + ", neste ato, " + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ", a importância de " + dadosVenda?.informacao?.valorSinal + " (" + formatoPorExtenso(dadosVenda?.informacao?.valorSinal) + ") como SINAL E PRINCÍPIO DE PAGAMENTO pela venda do imóvel situado na " + enderecoImovel + ", pelo que se compromete" + logicaPluraVendMminusculo + " a vender " + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'ao') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + " nos termos das cláusulas e condições a seguir pactuadas:";
    const clausulaPri: string = "CLÁUSULA PRIMEIRA";
    const textClausulaPri: string = " - Da propriedade: " +
        logicaGenero('maiusculo', dadosVenda?.vendedores?.data, 'o') +
        " OUTORGANTE" + logicaPluralVendS + " " +
        (dadosVenda?.vendedores?.data.length > 1 ? "são" : "é") +
        " legítim" + logicaGenero('minusculo', dadosVenda?.vendedores?.data, 'o') +
        " proprietári" + logicaGenero('minusculo', dadosVenda?.vendedores?.data, 'o') +
        " do imóvel constituído " + returnTipoImovel(dadosVenda?.informacao?.tipo_imovel) + " situado na " +
        enderecoImovel + verificarVagas() + (dadosVenda?.laudemios?.length > 0 ? ", foreio a " : '') +
        laudemios(laudemioValorToName) + ", nesta cidade, devidamente descrito e caracterizado no corpo " +
        escritura() + " lavrada em " + lavrada() + ", Folha " + folha() + ", Livro " + livro() + ", ato " +
        ato() + ", no Cartório do " + cartorio() + "º Ofício de Notas. Registrado no " + rgiRegistro() +
        "º RGI na matrícula nº " + dadosVenda?.informacao?.matricula + " e Inscrição Municipal nº " +
        dadosVenda?.informacao?.inscricaoMunicipal;

    const clausulaSeg: string = "CLÁUSULA SEGUNDA";
    const clausulaExceto: string = (dadosVenda?.informacao?.excecoes !== null && dadosVenda?.informacao?.excecoes.trim() !== "") ? (', exceto: ' + dadosVenda?.informacao?.excecoes) + "." : '.';
    const textClausulaSeg: string = " - Da forma de aquisição e situação jurídica: " + logicaGenero('maiusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " declara" + logicaPluraVendMminusculo + " que " + (dadosVenda?.vendedores?.data.length > 1 ? "adquiriram" : "adquiriu") + " o imóvel em questão nos termos da Escritura mencionada na cláusula primeira, declarando que o referido imóvel encontra-se livre e desembaraçado de todo e qualquer ônus judicial ou extrajudicial, hipotecas legais ou convencionais, arresto, sequestro, litispendência, foro ou pensão, até a presente data, declarando, outrossim, que inexiste contra seu nome, bem como em relação ao imóvel objeto do presente negócio jurídico, quaisquer procedimentos judiciais, extrajudiciais ou administrativos que, de alguma forma, possam impedir, pôr em risco ou simplesmente afetar a pacífica e segura aquisição do mesmo, respondendo, portanto, por quaisquer débitos anteriores à celebração do presente instrumento, seja de que natureza for, que porventura venham a ser futuramente apuradas, respondendo, ainda, pela evicção de direito" + clausulaExceto;
    const clausulaTer: string = "CLÁUSULA TERCEIRA";
    const textClausulaTer: string = " - Da Compra e Venda: E que assim como o possuem, pelo presente e melhor forma de direito, " + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " promete" + logicaPluraVendMminusculo + " e se obriga" + logicaPluraVendMminusculo + " a VENDER o imóvel em questão " + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'ao') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + ", no estado em que se encontra e conforme foi vistoriado pel" + logicaGenero('miniusculo', dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + ", pelo preço certo e ajustado de ";
    const textClausulaTerParteDois: string = "(" + formatoPorExtenso(dadosVenda?.informacao?.valor_venda) + "), a ser integralizado da seguinte forma:"

    const textClausulaTerSegPar: string = "a) " + dadosVenda?.informacao?.valorSinal + " (" + formatoPorExtenso(dadosVenda?.informacao?.valorSinal) +
        "), através de transferência bancária para a conta " +
        "d" + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') +
        " OUTORGANTE" + logicaPluralVendS +
        " (Dados bancários, Banco: ...., Agência:...., Conta:...., Pix:.... )" +
        ", como sinal e princípio de pagamento, pelo que " +
        logicaGenero('minusculo', dadosVenda?.vendedores?.data, 'o') +
        " OUTORGANTE" + logicaPluralVendS + " " +
        (dadosVenda?.vendedores?.data.length > 1 ? "dão" : "dá") +
        " plena quitação, quando da compensação bancária.";
    let textClausulaTerTerPar: string = '';
    let textClausulaTerTerPar1: string = '';
    let textClausulaTerTerPar2: string = '';

    const apenasNumeros = (string: string) => {
        const numsStr = string?.replace("R$", "").replace(/[^0-9]/g, '');
        const valorInt: number = parseInt(numsStr);
        return valorInt;
    };

    let saldoValor: number = apenasNumeros(dadosVenda?.informacao?.valor_venda) - apenasNumeros(dadosVenda?.informacao?.valorSinal);

    function formatReal(int: string | number) {
        var tmp = int + '';
        tmp = tmp?.replace(/([0-9]{2})$/g, ",$1");
        if (tmp?.length > 6)
            tmp = tmp?.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

        return tmp;
    };

    if (dadosVenda?.informacao?.forma_pagamento !== null && dadosVenda?.informacao?.forma_pagamento.search(/2|4/) !== -1) {
        textClausulaTerTerPar = "b) E saldo no valor de R$ " + formatReal(saldoValor) + " (" + formatoPorExtenso(formatReal(saldoValor)) +
            ") pagos no ato da assinatura da Escritura Pública de Compra e Venda ou Instrumento Particular com Força de Escritura Pública, da seguinte forma:";

        textClausulaTerTerPar1 = "1) R$..............(.......), pagos através de recursos próprios por meio de cheque administrativo nominal " + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'ao') + " OUTORGANTE" + logicaPluralVendS;

        textClausulaTerTerPar2 = "2) ..................... (......) pagos através de financiamento imobiliário, que deverá ocorrer no prazo de 45 (quarenta e cinco) dias úteis, contados da data do recebimento de toda documentação exigida para liberação do financiamento junto à instituição financeira de escolha d" + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + ", sendo certo que " + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " declaram ciência que o crédito estará disponível em até 5 (cinco) dias úteis, após a apresentação do instrumento de financiamento devidamente registrado em nome d" + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + " junto à Instituição Financeira escolhida.";

    } else {
        textClausulaTerTerPar = "b) E saldo no valor de R$ " + formatReal(saldoValor) +
            " (" + formatoPorExtenso(formatReal(saldoValor)) +
            ") pagos no ato da lavratura da Escritura Pública de Compra e Venda, através de transferência bancária para " +
            logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'ao') + " OUTORGANTE" + logicaPluralVendSMinusculo +
            ", que deverá ocorrer no prazo em até " +
            `${dadosVenda?.informacao?.prazo || '30'} (${numeroExtenso.porExtenso(parseInt(dadosVenda?.informacao?.prazo)) || "trinta"}) dias úteis` +
            ", desde que apresentadas todas as certidões elencadas Cláusula Sexta.";
    }

    const textClausulaTerQuaPar = "Parágrafo Primeiro - Caso haja algum apontamento nas certidões d" + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " e ou relativas ao imóvel, de caráter insanável ou que seja impeditivo para a presente transação, " + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " dever" + logicaPluraVendAO + " restituir " + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'ao') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + " o sinal mencionado nesta cláusula no item a), na forma simples no prazo de 48 horas contados da solicitação de devolução.";
    let textClausulaQua = '';
    const clausulaQua = "CLÁUSULA QUARTA";
    if (dadosVenda?.informacao?.forma_pagamento !== null && dadosVenda?.informacao?.forma_pagamento.search(/2|4/) !== -1) {
        textClausulaQua = " - Da falta do pagamento: Na falta do pagamento no vencimento do saldo acordado mencionado na cláusula anterior, e ou desfazimento por sua culpa " + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + " perder" + logicaPluraCompAO + " o sinal objeto deste instrumento em favor d" + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ", desde que entregue" + (dadosVenda?.vendedores?.data.length > 1 ? "m" : "") + " toda documentação exigida pelas partes para liberação do financiamento junto à instituição financeira dentro do prazo estipulado. E caso o desfazimento ocorra por culpa d" + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ", " + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " mesm" + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " fica" + (dadosVenda?.vendedores?.data.length > 1 ? "m" : "") + " obrigad" + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " a devolver em dobro o valor do sinal recebido. Em qualquer dos casos, a parte que der causa se obriga a pagar a comissão devida à " + dadosEmpresa?.razaoSocial?.toUpperCase() + ", CJ-008711, conforme o artigo 725 do CCB.";
    } else {
        textClausulaQua = " - Da falta do pagamento: Na falta do pagamento no vencimento do saldo acordado mencionado na cláusula anterior, e ou desfazimento por sua culpa " + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + " perder" + logicaPluraCompAO + " o sinal objeto deste instrumento em favor d" + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ". E caso o desfazimento ocorra por culpa d" + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " ficar" + logicaPluraCompAO + " obrigad" + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " a devolver em dobro o valor do sinal recebido. Em qualquer dos casos, a parte que der causa se obriga a pagar a comissão devida à " + dadosEmpresa?.razaoSocial?.toUpperCase() + ", CJ-008711/ RJ, conforme o artigo 725 do CCB.";
    }
    const clausulaQui = "CLÁUSULA QUINTA";
    let textClausulaQui = '';
    if (dadosVenda?.informacao?.forma_pagamento !== null && dadosVenda?.informacao?.forma_pagamento.search(/2|4/) !== -1) {
        textClausulaQui = " - Da imissão de posse: " + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'o', "comecoDeFrase") + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + " ser" + logicaPluraCompAO + " imitido" + logicaPluralCompSMinusculo + " na posse do imóvel objeto deste instrumento, em quando da liberação do saldo devedor financiado já disponível na conta d" + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ", ou seja, após a quitação total do imóvel.";
    } else {
        textClausulaQui = " - Da imissão de posse: " + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'o', 'comecoDeFrase') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + " ser" + logicaPluraCompAO + " imitido" + logicaPluralCompSMinusculo + " na posse do imóvel objeto deste instrumento, no da lavratura da Escritura Pública de Compra e Venda, ou seja, após a quitação total do imóvel.";
    }
    const clausulaSex = "CLÁUSULA SEXTA";
    const textClausulaSex = " - Das obrigações d" + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ": Correrão por conta d" + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " as seguintes despesas e obrigações:";
    const textClausulaSexA = "a) Certidões negativas pessoais desta cidade e da comarca sua residência tais como: 1º e 2º Ofícios de Interdições e Tutelas, 2º Ofício Distribuidor Cível, 2º Ofício Distribuidor Fiscal e Fazendário, Justiça Federal, Certidão Nacional de Débitos Trabalhistas do TST (CNDT);"
    const textClausulaSexB = "b) Certidões relativas ao imóvel: certidão ônus reais, certidão de quitação fiscal imobiliária e enfitêutica, certidão do 2º Distribuidor Fiscal e Fazendário, declaração de quitação condominial, cotas do IPTU (" + anoAtual + "), Foro, Laudêmio (se houver), Taxa de Incêndio, certidão negativa do FUNESBOM (taxa dos Bombeiros), cópias autenticadas da" + logicaPluralVendSMinusculo + " cédula" + logicaPluralVendSMinusculo + " de identidade, comprovante de estado civil.";
    const textClausulaSexC = "c) Caso " + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " não entregue" + logicaPluraVendMminusculo + " o imóvel " + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'ao') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + " na data acertada, ficar" + logicaPluraVendAO + " obrigad" + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " a pagar uma multa diária de " + (dadosVenda?.informacao?.valoMulta !== null ? dadosVenda?.informacao?.valoMulta : 'R$ ..................') + "(" + formatoPorExtenso(dadosVenda?.informacao?.valoMulta) + ") enquanto permanece" + (dadosVenda?.vendedores?.data.length > 1 ? "m" : "r") + " no imóvel objeto deste instrumento, além de arcar" + logicaPluraVendEM + " com o pagamento dos impostos, encargos e taxas que incidam ou venham a incidir sobre o imóvel em questão, bem como a ressarcir " + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + " de quaisquer despesas que este" + logicaPluralCompSMinusculo + " vier" + logicaPluraCompEM + " a fazer para obtenção da propriedade e posse do imóvel, inclusive honorários advocatícios e custas judiciais.";
    const textClausulaSexD = "d) Pagamento da corretagem para " + dadosEmpresa?.razaoSocial?.toUpperCase() + " conforme mencionado na Cláusula Oitava.";
    const clausulaSet = "CLÁUSULA SÉTIMA";
    const textClausulaSet = " - Das obrigações d" + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + ":";
    const textClausulaSetA = "a) " + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'o', 'comecoDeFrase') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + " se obriga" + logicaPluraCompMminusculo + ", a partir da data do recebimento das chaves, pelo pagamento de todos os impostos e taxas que incidam ou venham a incidir sobre o imóvel.";

    let textClausulaSetB = '';
    if (dadosVenda?.informacao?.forma_pagamento !== null && dadosVenda?.informacao?.forma_pagamento.search(/2|4/) !== -1) {
        textClausulaSetB = "b) Correrão por conta d" + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + " as seguintes despesas e obrigações: custos do Instrumento particular com força de escritura pública e seu respectivo registro imobiliário, imposto de transmissão, custo de engenharia, planta baixa do imóvel, cópias de cédulas de identidade e CPF autenticadas, além dos eventuais trâmites e despesas bancárias junto à instituição financeira de sua escolha consecutivas do financiamento.";
    } else if ((dadosVenda?.informacao?.forma_pagamento !== null && dadosVenda?.informacao?.forma_pagamento.search(/1/) !== -1)) {
        textClausulaSetB = "b) Correrão por conta d" + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + " as seguintes despesas e obrigações: custos da escritura pública e seu respectivo registro imobiliário, imposto de transmissão, custo de engenharia, planta baixa do imóvel, cópias de cédulas de identidade e CPF autenticadas.";
    } else {
        textClausulaSetB = "b) Correrão por conta d" + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + " as seguintes despesas e obrigações: custos da escritura pública com o uso do FGTS e seu respectivo registro imobiliário, imposto de transmissão, custo de engenharia, planta baixa do imóvel, cópias de cédulas de identidade e CPF autenticadas.";
    }


    let textClausulaSetC = '';
    if (dadosVenda?.informacao?.forma_pagamento !== null && dadosVenda?.informacao?.forma_pagamento.search(/2|4/) !== -1) {
        textClausulaSetC = "c) Caso as certidões apresentadas pel" + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " expirem no curso do prazo para obtenção do financiamento, caberá " + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'ao') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + " custear e requerer a emissão de novas.";
    } else {
        textClausulaSetC = "";
    }

    const clausulaOit = "CLÁUSULA OITAVA";
    const textClausulaOit = " - Da Corretagem - " + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " se obriga" + logicaPluraVendMminusculo + " ao pagamento de 5% (cinco por cento) do valor do imóvel à título de corretagem à " + dadosEmpresa?.razaoSocial?.toUpperCase() + ", e corretores participantes da venda indicados pela intermediária, que deverão ser pagos no dia da assinatura " + escritura() + ". O pagamento da " + dadosEmpresa?.razaoSocial?.toUpperCase() + " e seus corretores participantes da venda, serão pagos separadamente conforme indicado pela intermediária. ";
    const textClausulaOitUni = "Parágrafo Único - As partes declaram ter ciência de que a função da corretora é a aproximação das mesmas, de modo que não a responsabilizam por obrigações atinentes a cada contratante e necessárias ao sucesso da operação, a exemplo da obtenção de certidões, apresentação de documentos e quitação do saldo devedor, inclusive mediante financiamento, devendo cada contratante zelar, sob sua responsabilidade e risco, pelo cumprimento das obrigações respectivas. Igualmente, as partes declaram ter ciência de que a corretora não se responsabiliza pelas informações equivocadas eventualmente prestadas por um contratante, devendo a questão ser direcionada ao responsável por esse ato.";
    const clausulaNon = "CLÁUSULA NONA";
    const textClausulaNon = " - Da irrevogabilidade: Sem prejuízo do disposto na Cláusula Quarta deste instrumento, as partes firmam o presente em caráter irrevogável e irretratável que lhes é facultado pelos artigos 417 a 420 do Código Civil Brasileiro, obrigando-se por si, seus herdeiros e sucessores, a fazê-lo bom, firme e valioso.";
    const clausulaDec = "CLÁUSULA DÉCIMA";
    const clausulaBensMoveis = (dadosVenda?.informacao?.bens_moveis !== null && dadosVenda?.informacao?.bens_moveis.trim() !== "") ? dadosVenda?.informacao?.bens_moveis : "vazio de coisas e pessoas";
    const textClausulaDec = " - Dos bens móveis: O imóvel será entregue " + clausulaBensMoveis + ".";
    const clausulaDecPri = "CLÁUSULA DÉCIMA PRIMEIRA";
    const textClausulaDecPri = " – 1 - As certidões descritas na cláusula sétima devem estar à disposição do cartório responsável pela lavratura da Escritura Pública de Compra e Venda pelo menos com 48 (quarenta e oito) horas de antecedência. 2 – Fica acordado entre as partes que caso haja qualquer apontamento junto às certidões d" + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ", el" + logicaGenero('minusculo', dadosVenda?.vendedores?.data, 'or') + " se responsabiliza" + logicaPluraVendMminusculo + " pelo pagamento de débitos existentes, baixas e cancelamentos, referentes ao apontamento, nos devidos órgãos responsáveis.";
    const clausulaDecSeg = "CLÁUSULA DÉCIMA-SEGUNDA";
    let textClausulaDecSeg = '';

    if (dadosVenda?.informacao?.forma_pagamento !== null && dadosVenda?.informacao?.forma_pagamento.search(/2|4/) !== -1) {
        textClausulaDecSeg = " – Do Instrumento particular: O Instrumento particular com força de escritura pública será assinado, em até " + dadosVenda?.informacao?.prazo + " (" + numeroExtenso.porExtenso(parseInt(dadosVenda?.informacao?.prazo)) + ") dias úteis, contados da data do recebimento de toda documentação exigida para liberação do financiamento junto à instituição financeira de escolha d" + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + ", no dia, hora e local previamente acordado entre as partes, entendendo-se como frustração à venda o não comparecimento no horário aprazado, cabendo assim, a perda ou devolução do sinal, além da comissão devida à " + dadosEmpresa?.razaoSocial?.toUpperCase() + ".";
    } else {
        textClausulaDecSeg = " – Da Escritura Pública de Compra e Venda: A Escritura Pública de Compra e Venda, será assinada em até " + dadosVenda?.informacao?.prazo + " (" + numeroExtenso.porExtenso(parseInt(dadosVenda?.informacao?.prazo)) + ") dias úteis, contados da assinatura do presente contrato, no dia, hora e local previamente acordado entre as partes, entendendo-se como frustração à venda o não comparecimento no horário aprazado, cabendo assim, a perda ou devolução do sinal, além da comissão devida à " + dadosEmpresa?.razaoSocial?.toUpperCase() + ".";
    }

    const clausulaDecTer = "CLÁUSULA DÉCIMA-TERCEIRA";
    const textClausulaDecTer = " - Do foro: As partes elegem o foro da cidade do Rio de Janeiro para dirimir eventuais dúvidas deste acordo, com a expressa renúncia de qualquer outro por mais privilegiado que seja.";
    const textFinal = "E por estarem justos e contratados, " + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " assina" + logicaPluraVendMminusculo + " este instrumento confessando ter recebido o SINAL E PRINCÍPIO DE PAGAMENTO, pelo que d" + logicaPluraVendAO + " quitação " + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'ao') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + " e este" + logicaPluralCompSMinusculo + " também assina" + logicaPluraCompMminusculo + " manifestando integral conformidade com todos os termos, cláusulas e condições deste instrumento, fazendo-se tudo na presença e assinatura das testemunhas abaixo qualificadas, em 3 (três) vias para um só efeito.";
    const termoCiencia = "TERMO DE CIÊNCIA";
    const textoTermoCiencia = " Para a conclusão do negócio com segurança, a " + dadosEmpresa?.razaoSocial?.toUpperCase() + " possui serviços de pós-negociação, oferecendo também todos os serviços de despachante (retirada de certidões, registros, averbações, acompanhamento de processos, laudêmio, execução fiscal, revisão de ITBI e etc) não se responsabilizando por qualquer pagamento efetuado para terceiros. Nossos operadores entrarão em contato no prazo de até 48 horas úteis para falar sobre os nossos serviços.";
    const dataContrato = "Rio de Janeiro, ...........................................................";

    const linhaAssinaturaVendedor = ".............................................................................";
    //const assinaturaVendedor = dadosMinutaVendedor.name;

    const linhaAssinaturaComprador = ".............................................................................";
    //const assinaturaComprador = dadosMinutaComprador.name;

    const tituloTestemunhas = "TESTEMUNHAS";
    const linhaPrimeiraTestemunha = "1. .........................................................................";
    const linhaSegundaTestemunha = "2. .........................................................................";
    const nomeTestemunha = "Nome:";
    const enderecoTesteminha = "Endereço:"
    const documentosTestemunha = "RG:.......................... CPF...................................";

    const observacaoTitulo = "OBSERVAÇÃO:";
    const observacao = " Eventuais pagamentos ou cheques recebidos permanecerão sob a responsabilidade da " + dadosEmpresa?.razaoSocial?.toUpperCase() + " até a assinatura d" + logicaGenero('miniusculo', dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ". E caso estes não assinem este instrumento, os mesmos serão devolvidos " + logicaGenero('minusculo', dadosVenda?.compradores?.data, 'ao') + " OUTORGAD" + logicaGenero('maiusculo', dadosVenda?.compradores?.data, 'o') + " sem quaisquer ônus para as partes.";

    function laudemios(laudemios: any[]) {
        let returoLaudemio = '';
        let separa = '';
        const countLaudemio = laudemios.length;
        laudemios.forEach((element: any, key: any) => {

            switch (element.tipo_laudemio) {
                case "1":
                    if (countLaudemio === 1 || key === 0) {
                        separa = '';
                    } else if ((countLaudemio - 1) === key) {
                        separa = ' e ';
                    } else {
                        separa = ', ';
                    }
                    returoLaudemio += separa + " RIP nº " + element.valor_laudemio;
                    break;

                case "2":
                    if (countLaudemio === 1 || key === 0) {
                        separa = '';
                    } else if ((countLaudemio - 1) === key) {
                        separa = ' e ';
                    } else {
                        separa = ', ';
                    }
                    returoLaudemio += separa + " Laudêmio da prefeitura";
                    break;
                default:
                    break;
            }
            switch (element.tipo_laudemio_id) {
                case 3:
                    if (countLaudemio === 1 || key === 0) {
                        separa = '';
                    } else if ((countLaudemio - 1) === key) {
                        separa = ' e ';
                    } else {
                        separa = ', ';
                    }
                    returoLaudemio += separa + " Laudêmio da Familia: " + element.nome;
                    break;

                case 4:
                    if (countLaudemio === 1 || key === 0) {
                        separa = '';
                    } else if ((countLaudemio - 1) === key) {
                        separa = ' e ';
                    } else {
                        separa = ', ';
                    }
                    returoLaudemio += separa + " Laudêmio da Igreja: " + element.nome;
                    break;

                default:
                    break;
            }
        });
        return returoLaudemio;
    };

    const handleBtnAvancar = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const imageBase64Datafooter = `/9j/4AAQSkZJRgABAQEBLAEsAAD/7QAsUGhvdG9zaG9wIDMuMAA4QklNA+0AAAAAABABLAAAAAEAAQEsAAAAAQAB/+ICQElDQ19QUk9GSUxFAAEBAAACMEFEQkUCEAAAbW50clJHQiBYWVogB88ABgADAAAAAAAAYWNzcEFQUEwAAAAAbm9uZQAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1BREJFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKY3BydAAAAPwAAAAyZGVzYwAAATAAAABrd3RwdAAAAZwAAAAUYmtwdAAAAbAAAAAUclRSQwAAAcQAAAAOZ1RSQwAAAdQAAAAOYlRSQwAAAeQAAAAOclhZWgAAAfQAAAAUZ1hZWgAAAggAAAAUYlhZWgAAAhwAAAAUdGV4dAAAAABDb3B5cmlnaHQgMTk5OSBBZG9iZSBTeXN0ZW1zIEluY29ycG9yYXRlZAAAAGRlc2MAAAAAAAAAEUFkb2JlIFJHQiAoMTk5OCkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAADzUQABAAAAARbMWFlaIAAAAAAAAAAAAAAAAAAAAABjdXJ2AAAAAAAAAAECMwAAY3VydgAAAAAAAAABAjMAAGN1cnYAAAAAAAAAAQIzAABYWVogAAAAAAAAnBgAAE+lAAAE/FhZWiAAAAAAAAA0jQAAoCwAAA+VWFlaIAAAAAAAACYxAAAQLwAAvpz/4SMcaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA3LjEtYzAwMCA3OS5hODczMWI5LCAyMDIxLzA5LzA5LTAwOjM3OjM4ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6eG1wR0ltZz0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL2cvaW1nLyIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczpzdE1mcz0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL01hbmlmZXN0SXRlbSMiCiAgICAgICAgICAgIHhtbG5zOmlsbHVzdHJhdG9yPSJodHRwOi8vbnMuYWRvYmUuY29tL2lsbHVzdHJhdG9yLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnBkZj0iaHR0cDovL25zLmFkb2JlLmNvbS9wZGYvMS4zLyI+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvanBlZzwvZGM6Zm9ybWF0PgogICAgICAgICA8ZGM6dGl0bGU+CiAgICAgICAgICAgIDxyZGY6QWx0PgogICAgICAgICAgICAgICA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPjIxMDQyMS1kbmEtY3JhY2hhLWE3PC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOkFsdD4KICAgICAgICAgPC9kYzp0aXRsZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAyMi0wMi0xNlQxMDoxNDoxNi0wMzowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjItMDItMTZUMTM6MTQ6MTlaPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMjItMDItMTZUMTA6MTQ6MTYtMDM6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIElsbHVzdHJhdG9yIDI2LjAgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6VGh1bWJuYWlscz4KICAgICAgICAgICAgPHJkZjpBbHQ+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8eG1wR0ltZzp3aWR0aD4yNTY8L3htcEdJbWc6d2lkdGg+CiAgICAgICAgICAgICAgICAgIDx4bXBHSW1nOmhlaWdodD4xMjwveG1wR0ltZzpoZWlnaHQ+CiAgICAgICAgICAgICAgICAgIDx4bXBHSW1nOmZvcm1hdD5KUEVHPC94bXBHSW1nOmZvcm1hdD4KICAgICAgICAgICAgICAgICAgPHhtcEdJbWc6aW1hZ2U+LzlqLzRBQVFTa1pKUmdBQkFnRUJMQUVzQUFELzdRQXNVR2h2ZEc5emFHOXdJRE11TUFBNFFrbE5BKzBBQUFBQUFCQUJMQUFBQUFFQSYjeEE7QVFFc0FBQUFBUUFCLys0QURrRmtiMkpsQUdUQUFBQUFBZi9iQUlRQUJnUUVCQVVFQmdVRkJna0dCUVlKQ3dnR0JnZ0xEQW9LQ3dvSyYjeEE7REJBTURBd01EQXdRREE0UEVBOE9EQk1URkJRVEV4d2JHeHNjSHg4Zkh4OGZIeDhmSHdFSEJ3Y05EQTBZRUJBWUdoVVJGUm9mSHg4ZiYjeEE7SHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmLzhBQUVRZ0FEQUVBQXdFUiYjeEE7QUFJUkFRTVJBZi9FQWFJQUFBQUhBUUVCQVFFQUFBQUFBQUFBQUFRRkF3SUdBUUFIQ0FrS0N3RUFBZ0lEQVFFQkFRRUFBQUFBQUFBQSYjeEE7QVFBQ0F3UUZCZ2NJQ1FvTEVBQUNBUU1EQWdRQ0JnY0RCQUlHQW5NQkFnTVJCQUFGSVJJeFFWRUdFMkVpY1lFVU1wR2hCeFd4UWlQQiYjeEE7VXRIaE14Wmk4Q1J5Z3ZFbFF6UlRrcUt5WTNQQ05VUW5rNk96TmhkVVpIVEQwdUlJSm9NSkNoZ1poSlJGUnFTMFZ0TlZLQnJ5NC9QRSYjeEE7MU9UMFpYV0ZsYVcxeGRYbDlXWjJocGFtdHNiVzV2WTNSMWRuZDRlWHA3ZkgxK2YzT0VoWWFIaUltS2k0eU5qbytDazVTVmxwZVltWiYjeEE7cWJuSjJlbjVLanBLV21wNmlwcXF1c3JhNnZvUkFBSUNBUUlEQlFVRUJRWUVDQU1EYlFFQUFoRURCQ0VTTVVFRlVSTmhJZ1p4Z1pFeSYjeEE7b2JId0ZNSFI0U05DRlZKaWN2RXpKRFJEZ2hhU1V5V2lZN0xDQjNQU05lSkVneGRVa3dnSkNoZ1pKalpGR2lka2RGVTM4cU96d3lncCYjeEE7MCtQemhKU2t0TVRVNVBSbGRZV1ZwYlhGMWVYMVJsWm1kb2FXcHJiRzF1YjJSMWRuZDRlWHA3ZkgxK2YzT0VoWWFIaUltS2k0eU5qbyYjeEE7K0RsSldXbDVpWm1wdWNuWjZma3FPa3BhYW5xS21xcTZ5dHJxK3YvYUFBd0RBUUFDRVFNUkFEOEFPc3RlWVU3ai9lZVgvVWI5V1Y1LyYjeEE7b2w3aTI0ZnJqN3drbWM0OUE3RlU5dEU0VzBhbnJ4Qk5mZmZPZTFFdUxJVDV2b0dneDhHQ0E4dnYzVmNwY3QyS3V4VjJLcGw1UDBoTCYjeEE7cnpQWnh3a1JTTjZ0UDVUU0Z6djRkTzJXNGRLYzh2REJvbjlBdHh1ME5Sd1lKRTdqYjd3enUrMHk5c21wUEdRdGFMSU4wUFhvZm82ZCYjeEE7Y3hkWjJmbTA1cVkyNytoK1A2T2ZrNlREcUlaQjZTaE13bTUyS3V4VjJLdXhWZ1huMGthekFRYUVXNmtFZjY3NWxZUHBkNTJiL2RuMyYjeEE7L29DVHdhazY3VERtUDVoMXk5eTVZZTVNSXBvcFZxakErSTdqNWpDMEdKSE5maXhkaXJzVmRpcnNWV3QxenVleFA4V2o4ZnZmTHZhYiYjeEE7L0haZTZQM0JyTnE2QjJLdXhWeEZkamlsQno2ZEcrOFh3TjRkai9UTUhOb1l5M2pzZnNjM0RyWlIybHVQdFFFc0VzVFVkYWVCN0g1SCYjeEE7Tlhsd3lnYUlkbmp5eG1MQlU4cWJIMG4vQU02Vi93QnEzL2toblI3dFg3citqOWptL3dBRTBQTDlHY2U5ZnE5S1lEeTNTUEN2YmgreCYjeEE7Uy81Qi93RDlxbi9wMnluOTMvUit4dWQveUQvL0FMVlAvVHRqKzYvby9ZcXQvd0E2WC8ycmYrU0dZLzhBZ3Y4QXRmOEFzWE8vd3IvYiYjeEE7UDlrNy9uUy8rMWIvQU1rTWY4Ri8ydjhBMksvNFYvdG4reWQvenBmL0FHcmYrU0dQK0MvN1gvc1Yvd0FLL3dCcy93Qms3L25TL3dEdCYjeEE7Vy84QUpESC9BQVgvQUd2L0FHSy80Vi90bit5ZC93QTZYLzJyZitTR1ArQy83WC9zVi93ci9iUDlrcldYK0dQcktmVXZxWDFyZjAvUiYjeEE7OUwxT2hyVGp2MHJsbVB3T0wwY0hGNVZiWGs4Zmg5WEh3K2QwbVV2cGVtM3E4ZlRwOFhLbkdudlhMOG5Ed25pcmg2M3ljYU4zdHpRZiYjeEE7KzRUL0FKZHYrU2VZUCtCLzdWL3NXLzhBZmYwdnRkL3VFLzVkditTZVArQi83Vi9zVi9mZjB2dGQvdUUvNWR2K1NlUCtCLzdWL3NWLyYjeEE7ZmYwdnRkL3VFLzVkditTZVArQi83Vi9zVi9mZjB2dGQvdUUvNWR2K1NlUCtCLzdWL3NWL2ZmMHZ0UWw1L2czMVI5Yy9SM3E4ZHZXOSYjeEE7RGx4cWY1dDZWeVEvS2RQRC93QmkyNC96TmVueEs4dUpRLzVCL3dEOXFuL3Aydy80TC90Zit4YlA4TS8yei9aTGsvd0h5K0Q5Rjh2OCYjeEE7bjZ2WDhNZjhGLzJ2L1lvUDV2cjRuK3lWUCtkTC93QzFiL3lReC93WC9hLzlpeC93ci9iUDlrNy9BSjB2L3RXLzhrTWY4Ri8ydi9ZciYjeEE7L2hYKzJmN0ozL09sL3dEYXQvNUlZLzRML3RmK3hYL0N2OXMvMlR2K2RMLzdWdjhBeVF4L3dYL2Evd0RZci9oWCsyZjdKMy9PbC84QSYjeEE7YXQvNUlZLzRML3RmK3hYL0FBci9BR3ovQUdUWC9PbGY5cTMvQUpJWmw0dUhoOUZjUGx5ZGZucmkvZWZWL1M1L2E3L25TdjhBdFcvOCYjeEE7a01zM2F2M1g5SDdIZjg2Vi93QnEzL2toanV2N3IrajlqdjhBblN2KzFiL3lReDNYOTEvUit4My9BRHBYL2F0LzVJWTdyKzYvby9ZNyYjeEE7L25TdisxYi9BTWtNZDEvZGYwZnNhYi9CSEU4djBaeDcxK3Iwd1M1YjhreDhPOXVHL2dwLzhnLy9BTzFUL3dCTzJVL3Uvd0NqOWpjLyYjeEE7LzlrPTwveG1wR0ltZzppbWFnZT4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOkFsdD4KICAgICAgICAgPC94bXA6VGh1bWJuYWlscz4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDo0ZWM3YTg2MC00MzU0LWY1NGUtOGI4ZS04MjUyZDBmOGM5MjY8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6NGVjN2E4NjAtNDM1NC1mNTRlLThiOGUtODI1MmQwZjhjOTI2PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnV1aWQ6NUQyMDg5MjQ5M0JGREIxMTkxNEE4NTkwRDMxNTA4Qzg8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOlJlbmRpdGlvbkNsYXNzPnByb29mOnBkZjwveG1wTU06UmVuZGl0aW9uQ2xhc3M+CiAgICAgICAgIDx4bXBNTTpEZXJpdmVkRnJvbSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgIDxzdFJlZjppbnN0YW5jZUlEPnhtcC5paWQ6YzNhZjE4ODEtODYzYy01MDRhLTliZWEtMGYxYjUxZTNhNmY4PC9zdFJlZjppbnN0YW5jZUlEPgogICAgICAgICAgICA8c3RSZWY6ZG9jdW1lbnRJRD54bXAuZGlkOmMzYWYxODgxLTg2M2MtNTA0YS05YmVhLTBmMWI1MWUzYTZmODwvc3RSZWY6ZG9jdW1lbnRJRD4KICAgICAgICAgICAgPHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD51dWlkOjVEMjA4OTI0OTNCRkRCMTE5MTRBODU5MEQzMTUwOEM4PC9zdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgICAgIDxzdFJlZjpyZW5kaXRpb25DbGFzcz5wcm9vZjpwZGY8L3N0UmVmOnJlbmRpdGlvbkNsYXNzPgogICAgICAgICA8L3htcE1NOkRlcml2ZWRGcm9tPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6YzY4ZjZlMzMtZDUyMC1jYjQ0LTg5MWEtYzRmMWY5ZjU3MGY2PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIxLTA0LTIxVDExOjE1OjI5LTAzOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBJbGx1c3RyYXRvciAyNS4yIChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6NGVjN2E4NjAtNDM1NC1mNTRlLThiOGUtODI1MmQwZjhjOTI2PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIyLTAyLTE2VDEwOjE0OjE2LTAzOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBJbGx1c3RyYXRvciAyNi4wIChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8eG1wTU06TWFuaWZlc3Q+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0TWZzOmxpbmtGb3JtPkVtYmVkQnlSZWZlcmVuY2U8L3N0TWZzOmxpbmtGb3JtPgogICAgICAgICAgICAgICAgICA8c3RNZnM6cmVmZXJlbmNlIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgICAgPHN0UmVmOmZpbGVQYXRoPkM6XFVzZXJzXFZJTklDSVVTXERlc2t0b3BcZG5hLXJvZGFwZS1yZWNpYm8uanBnPC9zdFJlZjpmaWxlUGF0aD4KICAgICAgICAgICAgICAgICAgPC9zdE1mczpyZWZlcmVuY2U+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06TWFuaWZlc3Q+CiAgICAgICAgIDx4bXBNTTpJbmdyZWRpZW50cz4KICAgICAgICAgICAgPHJkZjpCYWc+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RSZWY6ZmlsZVBhdGg+QzpcVXNlcnNcVklOSUNJVVNcRGVza3RvcFxkbmEtcm9kYXBlLXJlY2liby5qcGc8L3N0UmVmOmZpbGVQYXRoPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6QmFnPgogICAgICAgICA8L3htcE1NOkluZ3JlZGllbnRzPgogICAgICAgICA8aWxsdXN0cmF0b3I6U3RhcnR1cFByb2ZpbGU+UHJpbnQ8L2lsbHVzdHJhdG9yOlN0YXJ0dXBQcm9maWxlPgogICAgICAgICA8aWxsdXN0cmF0b3I6Q3JlYXRvclN1YlRvb2w+QUlSb2JpbjwvaWxsdXN0cmF0b3I6Q3JlYXRvclN1YlRvb2w+CiAgICAgICAgIDxwZGY6UHJvZHVjZXI+QWRvYmUgUERGIGxpYnJhcnkgMTUuMDA8L3BkZjpQcm9kdWNlcj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pv/bAEMAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgIBAQIBAQECAgICAgICAgIBAgICAgICAgICAv/bAEMBAQEBAQEBAQEBAQIBAQECAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAv/AABEIAFQJsQMBEQACEQEDEQH/xAAeAAEAAQQDAQEAAAAAAAAAAAAABwMFBggBAgkKBP/EAGcQAAEBBAQKBAcJCwgGBA8AAAABAgMGBwQFEVYXGBkhV5WWl9XWCBIWMRNBUVWU1NcJFCI0QmFxc7IVMjU3UmJ1dqG0tiMzOEZy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kgZPMi60ilu6bEMoGWVVwuwettGTpkleiaeu4S5IGTzIutIpbumxDKBllVcLsHrbRk6ZJXomnruEuSBk8yLrSKW7psQygZZVXC7B620ZOmSV6Jp67hLkgZPMi60ilu6bEMoGWVVwuwettGTpkleiaeu4S5IGTzIutIpbumxDKBllVcLsHrbRk6ZJXomnruEuSBk8yLrSKW7psQygZZVXC7B620ZOmSV6Jp67hLkgZPMi60ilu6bEMoGWVVwuwettGTpkleiaeu4S5IGTzIutIpbumxDKBllVcLsHrbRk6ZJXomnruEuSBk8yLrSKW7psQygZZVXC7B620ZOmSV6Jp67hLkgZPMi60ilu6bEMoGWVVwuwettGTpkleiaeu4S5IGTzIutIpbumxDKBllVcLsHrbRk6ZJXomnruEuSBk8yLrSKW7psQygZZVXC7B620ZOmSV6Jp67hLkgZPMi60ilu6bEMoGWVVwuwettGTpkleiaeu4S5IGTzIutIpbumxDKBllVcLsHrbRk6ZJXomnruEuSBk8yLrSKW7psQygZZVXC7B620ZOmSV6Jp67hLkgZPMi60ilu6bEMoGWVVwuwettGTpkleiaeu4S5IGTzIutIpbumxDKBllVcLsHrbRk6ZJXomnruEuSBk8yLrSKW7psQygZZVXC7B620ZOmSV6Jp67hLkgZPMi60ilu6bEMoGWVVwuwettGTpkleiaeu4S5IGTzIutIpbumxDKBllVcLsHrbRk6ZJXomnruEuSBk8yLrSKW7psQygZZVXC7B620ZOmSV6Jp67hLkgZPMi60ilu6bEMoGWVVwuwettGTpkleiaeu4S5IGTzIutIpbumxDKBllVcLsHrbRk6ZJXomnruEuSBk8yLrSKW7psQygZZVXC7B620ZOmSV6Jp67hLkgZPMi60ilu6bEMoGWVVwuwettGTpkleiaeu4S5IGTzIutIpbumxDKBllVcLsHrbRk6ZJXomnruEuSBk8yLrSKW7psQygZZVXC7B620ZOmSV6Jp67hLkgZPMi60ilu6bEMoGWVVwuwettGTpkleiaeu4S5IGTzIutIpbumxDKBllVcLsHrbRk6ZJXomnruEuSBk8yLrSKW7psQygZZVXC7B620ZOmSV6Jp67hLkgZPMi60ilu6bEMoGWVVwuwettGTpkleiaeu4S5IGTzIutIpbumxDKBllVcLsHrbRk6ZJXomnruEuSBk8yLrSKW7psQygZZVXC7B620ZOmSV6Jp67hLkgZPMi60ilu6bEMoGWVVwuwettGTpkleiaeu4S5IGTzIutIpbumxDKBllVcLsHrbRk6ZJXomnruEuSBk8yLrSKW7psQygZZVXC7B620ZOmSV6Jp67hLkgZPMi60ilu6bEMoGWVVwuwettGTpkleiaeu4S5IGTzIutIpbumxDKBllVcLsHrbRk6ZJXomnruEuSBk8yLrSKW7psQygZZVXC7B620ZOmSV6Jp67hLkgZPMi60ilu6bEMoGWVVwuwettGTpkleiaeu4S5IGTzIutIpbumxDKBllVcLsHrbRk6ZJXomnruEuSBk8yLrSKW7psQygZZVXC7B620ZOmSV6Jp67hLkgZPMi60ilu6bEMoGWVVwuwettGTpkleiaeu4S5IGTzIutIpbumxDKBllVcLsHrbRk6ZJXomnruEuSBk8yLrSKW7psQygZZVXC7B620ZOmSV6Jp67hLkgZPMi60ilu6bEMoGWVVwuwettGTpkleiaeu4S5IGTzIutIpbumxDKBllVcLsHrbRk6ZJXomnruEuSBk8yLrSKW7psQygZZVXC7B620ZOmSV6Jp67hLkgZPMi60ilu6bEMoGWVVwuwettLjV3ueMlqI/V66ieaKtNO0ZXr11CaoiNKlqpZBKZ/gpYSpgiwWSekRKN5icJfHx4bt3ZZklDw0YLqTUrs040IZu7JONCUIxY1koRxEI4epdxfCVJJwgsddnZzdXd8UboWdFGjNoldVm0VQhKzZs8KpVxLJxoQqhOPFwl9xAZOJ/WWZn99cQqv+cGGx89PEg1BoTCucPHTZ3RxiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCeniQKEwrnDx02d0MQCTl5Zma5hbkwT08SBQmFc4eOmzuhiAScvLMzXMLcmCelPjQhIoTCucPHTZ3QxAJNtWo1Eky1REVM9cQstqdW1UW2DM6Z7PoQ5SslKqJyELTkYk4+Li+Y4RI2GITjQ8PGPFj8tn4/m71i6iOYk9zA6PFPVqms19NKr36qivfudXcIOHb5W2mrWm3LcDNsstWs22sIwqqq22kbymkDJ1/VS/KMF4e3StiW+DpVUUX8aMazNZRdRC3BjxqqqpxpTjxmZwVk2dJjss+tXxli8HvyVFllfFwKrKs1VsXD6SU4sSMWIxBPcupAqqIsYTiXv74ggpfF88vjDt7uCc6e7RlcmTIRi4EHXJdSAvfOHaCCvZ8c73kF509dNlcAZLqQF75w7QQV7PhveQXnT102VwBkupAXvnDtBBXs+G95BedPXTZXAGS6kBe+cO0EFez4b3kF509dNlcAZLqQF75w7QQV7PhveQXnT102VwBkupAXvnDtBBXs+G95BedPXTZXAGS6kBe+cO0EFez4b3kF509dNlcAZLqQF75w7QQV7PhveQXnT102VwBkupAXvnDtBBXs+G95BedPXTZXAO7PuXUgVVf9MJxJmVc0QQV3/QsvjhODuCJ4EvT1aMrkHqpgGhDzlEnplV8HJM3DdP+416SvZB//9k=`;

        const imageBase64DataHeader = base64String?.split(',')[1]; // Remove o prefixo "data:image/png;base64,"

        const table = new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("Hello")],
                            columnSpan: 2,
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [],
                        }),
                        new TableCell({
                            children: [],
                        }),
                    ],
                }),
            ],
        });

        const table2 = new Table({
            alignment: AlignmentType.CENTER,
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("World")],
                            margins: {
                                top: convertInchesToTwip(0.69),
                                bottom: convertInchesToTwip(0.69),
                                left: convertInchesToTwip(0.69),
                                right: convertInchesToTwip(0.69),
                            },
                            columnSpan: 3,
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [],
                        }),
                        new TableCell({
                            children: [],
                        }),
                        new TableCell({
                            children: [],
                        }),
                    ],
                }),
            ],
            width: {
                size: 100,
                type: WidthType.AUTO,
            },
            columnWidths: [convertInchesToTwip(0.69), convertInchesToTwip(0.69), convertInchesToTwip(0.69)],
        });

        const table3 = new Table({
            alignment: AlignmentType.CENTER,
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("Foo")],
                        }),
                        new TableCell({
                            children: [new Paragraph("v")],
                            columnSpan: 3,
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("Bar1")],
                            shading: {
                                fill: "b79c2f",
                                type: ShadingType.REVERSE_DIAGONAL_STRIPE,
                                color: "auto",
                            },
                        }),
                        new TableCell({
                            children: [new Paragraph("Bar2")],
                            shading: {
                                fill: "42c5f4",
                                type: ShadingType.PERCENT_95,
                                color: "auto",
                            },
                        }),
                        new TableCell({
                            children: [new Paragraph("Bar3")],
                            shading: {
                                fill: "880aa8",
                                type: ShadingType.PERCENT_10,
                                color: "e2df0b",
                            },
                        }),
                        new TableCell({
                            children: [new Paragraph("Bar4")],
                            shading: {
                                fill: "FF0000",
                                type: ShadingType.CLEAR,
                                color: "auto",
                            },
                        }),
                    ],
                }),
            ],
            width: {
                size: convertInchesToTwip(4.86),
                type: WidthType.DXA,
            },
            margins: {
                top: convertInchesToTwip(0.27),
                bottom: convertInchesToTwip(0.27),
                right: convertInchesToTwip(0.27),
                left: convertInchesToTwip(0.27),
            },
        });

        const table4 = new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("0,0")],
                            columnSpan: 2,
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("1,0")],
                        }),
                        new TableCell({
                            children: [new Paragraph("1,1")],
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("2,0")],
                            columnSpan: 2,
                        }),
                    ],
                }),
            ],
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
        });

        const table5 = new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("0,0")],
                        }),
                        new TableCell({
                            children: [new Paragraph("0,1")],
                            rowSpan: 2,
                        }),
                        new TableCell({
                            children: [new Paragraph("0,2")],
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("1,0")],
                        }),
                        new TableCell({
                            children: [new Paragraph("1,2")],
                            rowSpan: 2,
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("2,0")],
                        }),
                        new TableCell({
                            children: [new Paragraph("2,1")],
                        }),
                    ],
                }),
            ],
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
        });

        const borders = {
            top: {
                style: BorderStyle.DASH_SMALL_GAP,
                size: 1,
                color: "ffffff",
            },
            bottom: {
                style: BorderStyle.DASH_SMALL_GAP,
                size: 1,
                color: "ffffff",
            },
            left: {
                style: BorderStyle.DASH_SMALL_GAP,
                size: 1,
                color: "ffffff",
            },
            right: {
                style: BorderStyle.DASH_SMALL_GAP,
                size: 1,
                color: "ffffff",
            },
        };

        const table6 = new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            borders,
                            children: [new Paragraph("0,0")],
                            rowSpan: 2,
                        }),
                        new TableCell({
                            borders,
                            children: [new Paragraph("0,1")],
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            borders,
                            children: [new Paragraph("1,1")],
                            rowSpan: 2,
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            borders,
                            children: [new Paragraph("2,0")],
                        }),
                    ],
                }),
            ],
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
        });

        const table7 = new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("0,0")],
                        }),
                        new TableCell({
                            children: [new Paragraph("0,1")],
                        }),
                        new TableCell({
                            children: [new Paragraph("0,2")],
                            rowSpan: 2,
                        }),
                        new TableCell({
                            children: [new Paragraph("0,3")],
                            rowSpan: 3,
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("1,0")],
                            columnSpan: 2,
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("2,0")],
                            columnSpan: 2,
                        }),
                        new TableCell({
                            children: [new Paragraph("2,2")],
                            rowSpan: 2,
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("3,0")],
                        }),
                        new TableCell({
                            children: [new Paragraph("3,1")],
                        }),
                        new TableCell({
                            children: [new Paragraph("3,3")],
                        }),
                    ],
                }),
            ],
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
        });

        const table8 = new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph("1,1")] }),
                        new TableCell({ children: [new Paragraph("1,2")] }),
                        new TableCell({ children: [new Paragraph("1,3")] }),
                        new TableCell({ children: [new Paragraph("1,4")], rowSpan: 4, borders }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph("2,1")] }),
                        new TableCell({ children: [new Paragraph("2,2")] }),
                        new TableCell({ children: [new Paragraph("2,3")], rowSpan: 3 }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph("3,1")] }),
                        new TableCell({ children: [new Paragraph("3,2")], rowSpan: 2 }),
                    ],
                }),
                new TableRow({
                    children: [new TableCell({ children: [new Paragraph("4,1")] })],
                }),
            ],
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
        });

        let clausulaTerItemB: any = '';
        if (dadosVenda?.informacao?.forma_pagamento !== null && dadosVenda?.informacao?.forma_pagamento.search(/2|4/) !== -1) {
            clausulaTerItemB = new Paragraph({
                style: "normalPara3",
                children: [
                    new TextRun({
                        text: textClausulaTerTerPar,
                        break: 1,
                    }),
                    new TextRun({
                        text: textClausulaTerTerPar1,
                        break: 2,
                    }),
                    new TextRun({
                        text: textClausulaTerTerPar2,
                        break: 2,
                    }),
                ]
            });

        } else {
            clausulaTerItemB = new Paragraph({
                style: "normalPara3",
                children: [
                    new TextRun({
                        text: textClausulaTerTerPar,
                        break: 1,
                    }),
                ]
            });
        }


        const tableTermoCiencia = new Table({
            alignment: AlignmentType.CENTER,
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: termoCiencia,
                                            break: 1,
                                            bold: true
                                        }),
                                        new TextRun({
                                            text: textoTermoCiencia,
                                            break: 1,
                                        })
                                    ],
                                    style: "normalPara2",
                                }),
                            ],
                            margins: {
                                top: convertInchesToTwip(0.05),
                                bottom: convertInchesToTwip(0.15),
                                left: convertInchesToTwip(0.10),
                                right: convertInchesToTwip(0.10),
                            }
                        }),
                    ],
                }),

            ],
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
        });

        /* const bordersAssinatura = {
            top: {
                style: BorderStyle.DASH_SMALL_GAP,
                size: 1,
                color: "FFFFFF",
            },
            bottom: {
                style: BorderStyle.DASH_SMALL_GAP,
                size: 1,
                color: "FF0000",
            },
            left: {
                style: BorderStyle.DASH_SMALL_GAP,
                size: 1,
                color: "FF0000",
            },
            right: {
                style: BorderStyle.DASH_SMALL_GAP,
                size: 1,
                color: "FF0000",
            },
        }; */

        const bordersAssinatura = {
            top: {
                style: BorderStyle.DASH_SMALL_GAP,
                size: 1,
                color: "FF0000",
            },
            bottom: {
                style: BorderStyle.DASH_SMALL_GAP,
                size: 1,
                color: "FF0000",
            },
            left: {
                style: BorderStyle.DASH_SMALL_GAP,
                size: 1,
                color: "FF0000",
            },
            right: {
                style: BorderStyle.DASH_SMALL_GAP,
                size: 1,
                color: "FF0000",
            },
        };

        let arrayAssinatura: any[] = [];
        let assinaturaVendedorA: any = '';
        dadosVenda?.vendedores?.data.forEach((vendedor: { tipo_pessoa: number; name: any; representante_socios: { data: any[]; }; nome_fantasia: any; cpf_cnpj: string; }, index: any) => {
            if (vendedor.tipo_pessoa === 0) {
                assinaturaVendedorA = new TableCell({
                    borders,
                    children: [
                        new Paragraph({
                            text: linhaAssinaturaVendedor,
                            style: "normalPara2"
                        }),
                        new Paragraph({
                            text: vendedor.name,
                            style: "normalPara2"
                        })
                    ],
                    margins: {
                        top: (arrayAssinatura.length > 2 ? convertInchesToTwip(0.40) : convertInchesToTwip(0.30)),
                    }
                });
                arrayAssinatura.push(assinaturaVendedorA);
            } else {
                vendedor.representante_socios.data.forEach((representante: any, index: any) => {
                    assinaturaVendedorA = new TableCell({
                        borders,
                        children: [
                            new Paragraph({
                                text: linhaAssinaturaVendedor,
                                style: "normalPara2"
                            }),
                            new Paragraph({
                                text: vendedor.nome_fantasia,
                                style: "normalPara2"
                            }),
                            new Paragraph({
                                text: 'CNPJ nº ' + vendedor.cpf_cnpj,
                                style: "normalPara2"
                            })
                        ],
                        margins: {
                            top: (arrayAssinatura.length > 2 ? convertInchesToTwip(0.40) : convertInchesToTwip(0.30)),
                        }
                    });
                    arrayAssinatura.push(assinaturaVendedorA);
                })
            }
        });

        let assinaturaCompradorA: any = '';
        if (dadosVenda?.compradores?.data.length > 0) {
            dadosVenda?.compradores?.data.forEach((comprador: { tipo_pessoa: number; name: any; representante_socios: { data: any[]; }; nome_fantasia: any; cpf_cnpj: string; }, index: any) => {
                if (comprador.tipo_pessoa === 0) {
                    assinaturaCompradorA = new TableCell({
                        borders,
                        children: [
                            new Paragraph({
                                text: linhaAssinaturaComprador,
                                style: "normalPara2"
                            }),

                            new Paragraph({
                                text: comprador.name,
                                style: "normalPara2"
                            })
                        ],
                        margins: {
                            top: (arrayAssinatura.length > 2 ? convertInchesToTwip(0.40) : convertInchesToTwip(0.30)),
                        }
                    });
                    arrayAssinatura.push(assinaturaCompradorA);
                } else {
                    comprador.representante_socios.data.forEach((representante: any, index: any) => {
                        assinaturaCompradorA = new TableCell({
                            borders,
                            children: [
                                new Paragraph({
                                    text: linhaAssinaturaComprador,
                                    style: "normalPara2"
                                }),
                                new Paragraph({
                                    text: comprador.nome_fantasia,
                                    style: "normalPara2"
                                }),
                                new Paragraph({
                                    text: 'CNPJ nº ' + comprador.cpf_cnpj,
                                    style: "normalPara2"
                                })
                            ],
                            margins: {
                                top: (arrayAssinatura.length > 2 ? convertInchesToTwip(0.40) : convertInchesToTwip(0.30)),
                            }
                        });
                        arrayAssinatura.push(assinaturaCompradorA);
                    })
                }
            });
        }
        else {
            assinaturaCompradorA = new TableCell({
                borders,
                children: [
                    new Paragraph({
                        text: linhaAssinaturaComprador,
                        style: "normalPara2"
                    }),
                    new Paragraph({
                        text: "(Nome comprador)",
                        style: "normalPara2"
                    })
                ],
                margins: {
                    top: (arrayAssinatura.length > 2 ? convertInchesToTwip(0.40) : convertInchesToTwip(0.30)),
                }
            });
            arrayAssinatura.push(assinaturaCompradorA);
        }


        const exibirTableCell = (dadosAssinatura: any[], index_array: number) => {
            let arrayExibirTableCell: any[] = [];
            let arrayElementos: number[] = [];
            arrayElementos.push(index_array * 2);
            arrayElementos.push(index_array * 2 + 1);
            dadosAssinatura.forEach((element: any, index: any) => {
                if (arrayElementos.includes(index)) {
                    arrayExibirTableCell.push(element);
                }
            });
            return arrayExibirTableCell;
        }

        const exibirTableRow = (dadosAssinatura: any) => {
            let countTableRow = dadosAssinatura.length / 2;
            let countRestoTableRow = dadosAssinatura.length % 2;

            let valorFinalCountTableRow = 0;
            if (countRestoTableRow > 0) {
                valorFinalCountTableRow = Math.trunc(countTableRow) + 1;
            }


            let arrayTableRow: any = [];
            for (let index = 0; index < countTableRow; index++) {
                let elementoTableRow = new TableRow({
                    children: exibirTableCell(dadosAssinatura, index)
                });
                arrayTableRow.push(elementoTableRow);
            }
            return arrayTableRow;
        }

        const assinatura = new Table({
            alignment: AlignmentType.CENTER,
            rows: exibirTableRow(arrayAssinatura),
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
        });


        let arrayVendedoresDownload = [];
        dadosVenda?.vendedores?.data.filter((e: any) => e.verificar_conjuge == 0).forEach((element: any, index: number) => {
            const name = new TextRun({
                text: (dadosVenda?.vendedores?.data.length > 1 ? (index + 1) + ") " : '') + (element.tipo_pessoa === 0 ? element.name : element.nome_fantasia),
                bold: true
            });
            arrayVendedoresDownload.push(name);

            if (!!element.usuario_id_conjuge && !!element.conjuge) {
                const dadosConjuge0 = new TextRun(arrayVendedores[index].split(element.conjuge)[0]);
                arrayVendedoresDownload.push(dadosConjuge0);

                const nameConjuge = new TextRun({
                    text: element.conjuge,
                    bold: true
                });
                arrayVendedoresDownload.push(nameConjuge);

                const dadosConjuge1 = new TextRun(arrayVendedores[index].split(element.conjuge)[1]);
                arrayVendedoresDownload.push(dadosConjuge1);
            } else {
                const dadosVendedores = new TextRun(arrayVendedores[index]);
                arrayVendedoresDownload.push(dadosVendedores);
            }
        });
        const finalVendedor = new TextRun(finalParagrafoVendedor);
        arrayVendedoresDownload.push(finalVendedor);


        let arrayCompradoresDownload = [];

        if (dadosVenda?.compradores?.data.length > 0) {
            dadosVenda?.compradores?.data.filter((e: any) => e.verificar_conjuge == 0).forEach((element: any, index: number) => {
                const name = new TextRun({
                    text: (dadosVenda?.compradores?.data.length > 1 ?
                        (index + 1) + ") " : '') + (element.tipo_pessoa === 0 ? element.name : element.nome_fantasia),
                    bold: true
                });
                arrayCompradoresDownload.push(name);

                if (!!element.usuario_id_conjuge && !!element.conjuge) {
                    const dadosConjuge0 = new TextRun(arrayCompradores[index].split(element.conjuge)[0]);
                    arrayCompradoresDownload.push(dadosConjuge0);

                    const nameConjuge = new TextRun({
                        text: element.conjuge,
                        bold: true
                    });
                    arrayCompradoresDownload.push(nameConjuge);

                    const dadosConjuge1 = new TextRun(arrayCompradores[index].split(element.conjuge)[1]);
                    arrayCompradoresDownload.push(dadosConjuge1);
                } else {
                    const dadosComprador = new TextRun(arrayCompradores[index]);
                    arrayCompradoresDownload.push(dadosComprador);
                }
            });
        }
        else {
            const compradorVazio =
                new TextRun({
                    text: '',
                    bold: true
                });
            arrayCompradoresDownload.push(compradorVazio);

            const dadosComprador = new TextRun(arrayCompradores[0]);
            arrayCompradoresDownload.push(dadosComprador);
        }

        const finalComprador = new TextRun(finalParagrafoComprador);
        arrayCompradoresDownload.push(finalComprador);


        const testemunhasObservacao = new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            borders,
                            children: [
                                new Paragraph({
                                    text: tituloTestemunhas,
                                    style: "normalPara4"
                                }),
                                new Paragraph({
                                    text: linhaPrimeiraTestemunha,
                                    style: "normalPara4"
                                }),
                                new Paragraph({
                                    text: nomeTestemunha,
                                    style: "normalPara4"
                                }),
                                new Paragraph({
                                    text: enderecoTesteminha,
                                    style: "normalPara4"
                                }),
                                new Paragraph({
                                    text: documentosTestemunha,
                                    style: "normalPara4"
                                }),
                                new Paragraph({
                                    text: linhaSegundaTestemunha,
                                    style: "normalPara4"
                                }),
                                new Paragraph({
                                    text: nomeTestemunha,
                                    style: "normalPara4"
                                }),
                                new Paragraph({
                                    text: enderecoTesteminha,
                                    style: "normalPara4"
                                }),
                                new Paragraph({
                                    text: documentosTestemunha,
                                    style: "normalPara4"
                                }),
                            ],
                        }),
                        new TableCell({
                            borders,
                            width: {
                                size: 50,
                                type: WidthType.PERCENTAGE,
                            },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: observacaoTitulo,
                                            bold: true
                                        }),
                                        new TextRun(observacao),
                                    ],
                                    style: "normalPara3"
                                }),
                            ],
                        }),
                    ],
                }),
            ],
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
        });

        const doc = new Document({
            styles: {
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
                            size: 18,
                            bold: true,
                        },
                        paragraph: {
                            alignment: AlignmentType.CENTER,
                            spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 },

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
                            size: 18,
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
                            size: 18,
                        },
                        paragraph: {
                            alignment: AlignmentType.JUSTIFIED,
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
                    }
                ],
            },
            sections: [
                {
                    properties: {
                        page: {
                            margin: {
                                footer: 100,
                                left: 900,
                                right: 900
                            },
                        },
                    },
                    headers: {
                        default: new Header({
                            children: [
                                new Paragraph({
                                    children: [
                                        new ImageRun({
                                            // data: Uint8Array.from(atob(imageBase64DataHeader), c =>
                                            //     c.charCodeAt(0)
                                            // ),
                                            data: Uint8Array.from(atob(imageBase64DataHeader || ''), (c) => c.charCodeAt(0)),
                                            transformation: {
                                                width: 176,
                                                height: 100
                                            }
                                        })
                                    ],
                                }),
                            ],
                        }),
                    },
                    footers: {
                        default: new Footer({
                            children: [
                                new Paragraph({
                                    children: [
                                        new ImageRun({
                                            data: Uint8Array.from(atob(imageBase64Datafooter), c =>
                                                c.charCodeAt(0)
                                            ),
                                            transformation: {
                                                width: 795,
                                                height: 60
                                            }
                                        })
                                    ],
                                    style: "normalParaFooter"
                                }),
                            ],
                        }),
                    },
                    children: [
                        new Paragraph({
                            text: rascunhoTitulo,
                            style: "normalPara"
                        }),
                        new Paragraph({
                            //alignment: AlignmentType.JUSTIFIED,
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: textoVendedor,
                                    //size: 24,
                                    break: 1
                                })
                            ],
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: arrayVendedoresDownload
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: textoComprador,
                                    break: 1
                                })
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: arrayCompradoresDownload
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: dadosImovel,
                                    break: 1
                                })
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: clausulaPri,
                                    break: 1,
                                    bold: true
                                }),
                                new TextRun({
                                    text: textClausulaPri,
                                })
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: clausulaSeg,
                                    break: 1,
                                    bold: true
                                }),
                                new TextRun({
                                    text: textClausulaSeg,
                                })
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: clausulaTer,
                                    break: 1,
                                    bold: true
                                }),
                                new TextRun({
                                    text: textClausulaTer,
                                }),
                                new TextRun({
                                    text: dadosVenda?.informacao?.valor_venda,
                                    bold: true
                                }),
                                new TextRun({
                                    text: textClausulaTerParteDois,
                                })
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: textClausulaTerSegPar,
                                    break: 1,
                                }),
                            ]
                        }),
                        clausulaTerItemB,
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: textClausulaTerQuaPar,
                                    break: 1,
                                }),
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: clausulaQua,
                                    break: 1,
                                    bold: true
                                }),
                                new TextRun({
                                    text: textClausulaQua,
                                })
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: clausulaQui,
                                    break: 1,
                                    bold: true
                                }),
                                new TextRun({
                                    text: textClausulaQui,
                                })
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: clausulaSex,
                                    break: 1,
                                    bold: true
                                }),
                                new TextRun({
                                    text: textClausulaSex,
                                })
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: textClausulaSexA,
                                    break: 1,
                                }),
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: textClausulaSexB,
                                    break: 1,
                                }),
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: textClausulaSexC,
                                    break: 1,
                                }),
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: textClausulaSexD,
                                    break: 1,
                                }),
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: clausulaSet,
                                    break: 1,
                                    bold: true
                                }),
                                new TextRun({
                                    text: textClausulaSet,
                                })
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: textClausulaSetA,
                                    break: 1,
                                }),
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: textClausulaSetB,
                                    break: 1,
                                }),
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: textClausulaSetC,
                                    break: textClausulaSetC !== '' ? 1 : 0,
                                }),
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: clausulaOit,
                                    break: textClausulaSetC !== '' ? 1 : 0,
                                    bold: true
                                }),
                                new TextRun({
                                    text: textClausulaOit,
                                })
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: textClausulaOitUni,
                                    break: 1,
                                }),
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: clausulaNon,
                                    break: 1,
                                    bold: true
                                }),
                                new TextRun({
                                    text: textClausulaNon,
                                })
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: clausulaDec,
                                    break: 1,
                                    bold: true
                                }),
                                new TextRun({
                                    text: textClausulaDec,
                                })
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: clausulaDecPri,
                                    break: 1,
                                    bold: true
                                }),
                                new TextRun({
                                    text: textClausulaDecPri,
                                })
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: clausulaDecSeg,
                                    break: 1,
                                    bold: true
                                }),
                                new TextRun({
                                    text: textClausulaDecSeg,
                                })
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: clausulaDecTer,
                                    break: 1,
                                    bold: true
                                }),
                                new TextRun({
                                    text: textClausulaDecTer,
                                })
                            ]
                        }),
                        new Paragraph({
                            style: "normalPara3",
                            children: [
                                new TextRun({
                                    text: textFinal,
                                    break: 1,
                                }),
                            ],
                            spacing: {
                                after: 300,
                            },
                        }),
                        tableTermoCiencia,
                        new Paragraph({
                            style: "normalPara2",
                            children: [
                                new TextRun({
                                    text: dataContrato,
                                    break: 2,
                                }),
                            ],
                            spacing: {
                                after: 300,
                            },
                        }),
                        assinatura,
                        new Paragraph({
                            text: '',
                            spacing: {
                                before: 150,
                                //before: 150
                            }
                        }),
                        testemunhasObservacao,
                        /* table,
                        new Paragraph({
                            text: "Another table",
                            heading: HeadingLevel.HEADING_2,
                        }),
                        table2,
                        new Paragraph({
                            text: "Another table",
                            heading: HeadingLevel.HEADING_2,
                        }),
                        table3,
                        new Paragraph("Merging columns 1"), */
                        //table4,
                        /* new Paragraph("Merging columns 2"),
                        table5,
                        new Paragraph("Merging columns 3"),
                        table6,
                        new Paragraph("Merging columns 4"),
                        table7,
                        new Paragraph("Merging columns 5"),
                        table8, */
                    ],

                }
            ]
        });

        Packer.toBlob(doc).then((blob) => {
            let imovel = dadosVenda.logradouro + '_' + dadosVenda.bairro + '_' + dadosVenda.cidade + '_' + dadosVenda.numero;
            let titulo_imovel = imovel.split(" ").join("_");;
            saveAs(blob, "Recibo_de_Sinal_" + titulo_imovel + ".docx");

            setLoading(false);
            porcentagemDownloadRascunho()
        });

        setOpen(true);

        const date = now.format('DD/MM/YYYY');
        const hours = `${now.get('hour')}h:${now.get('minute')}`
        setDownloadDate({
            date: date,
            hours: hours
        })

    }

    const porcentagemDownloadRascunho = async () => {
        const imovelId: number = dadosVenda.id;
        const processoId: number = dadosVenda.processo_id;
        const usuarioId: any = localStorage.getItem('usuario_id');
        const rascunhoDownload = await postRascunhoDownload(imovelId, processoId, usuarioId);
        return rascunhoDownload;
    };

    function retornoEstadoCivil(estado_civil: string | null, registro_casamento: any, uniao_estavel: string, valor_conjuge: string, genero: string) {
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
                            regime += "(Regime de Casamento)"
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

            if (uniao_estavel == "S") {
                uniao = ", união estavel"
                conjuge = " com " + valor_conjuge;
            }

            return estado + regime + uniao + conjuge;
        } else {
            return '';
        }

    };

    function verificarVagas() {
        if (dadosVenda?.informacao?.vaga !== null && dadosVenda?.informacao?.vaga !== '0') {

            let valor: any = "";
            let stringVaga = "vagas";
            let vagas: number = parseInt(dadosVenda?.informacao?.vaga);

            if (dadosVenda?.informacao?.vaga === '1') {
                valor = 'uma';
                stringVaga = 'vaga';
            }
            else if (dadosVenda?.informacao?.vaga === '2') {
                valor = 'duas';
            }
            else {
                valor = numeroExtenso.porExtenso(vagas);
            }

            // if (numeroExtenso.porExtenso(formatoPorExtenso(dadosVenda?.informacao?.vaga)) === 'um') {
            //     valor = 'uma';
            //     stringVaga = 'vaga';
            // }
            // else if (numeroExtenso.porExtenso(formatoPorExtenso(dadosVenda?.informacao?.vaga)) === 'dois') {
            //     valor = 'duas';
            // }

            // else {
            //     valor = numeroExtenso.porExtenso(dadosVenda?.informacao?.vaga);
            // }

            return ', possuindo ' + dadosVenda?.informacao?.vaga + ' (' + valor + ') ' + stringVaga + ' de garagem';
        }
        else {
            return '';
        }
    }

    function escritura() {
        return listEscrituras?.find(
            (value: { id: number; }) => Number(dadosVenda?.informacao?.escritura) === value.id
        )?.escritura;
    };

    function lavrada() {
        if (dadosVenda?.informacao?.lavrada === null) {
            return '............................';
        }
        else {
            return dadosVenda?.informacao?.lavrada
        }
    }

    function folha() {
        if (dadosVenda?.informacao?.folha === null) {
            return '............................';
        }
        else {
            return dadosVenda?.informacao?.folha
        }
    }

    function livro() {
        if (dadosVenda?.informacao?.livro === null) {
            return '............................';
        }
        else {
            return dadosVenda?.informacao?.livro
        }
    }

    function ato() {
        if (dadosVenda?.informacao?.ato === null) {
            return '............................';
        }
        else {
            return dadosVenda?.informacao?.ato
        }
    }

    function cartorio() {
        if (dadosVenda?.informacao?.cartorio === null) {
            return '............................';
        }
        else {
            return dadosVenda?.informacao?.cartorio
        }
    }

    function rgiRegistro() {
        if (dadosVenda?.informacao?.rgi === null) {
            return '............................';
        }
        else {
            return dadosVenda?.informacao?.rgi
        }
    };

    console.log("Array Vendedores: ", arrayVendedores);

    return (
        suspense === false &&
        <div className={styles.container}>
            <HeadSeo titlePage='Dashboard' description="" />

            <div className={styles.containerRecibo}>
                <HeaderPage imovel={imovelData as ImovelData} />

                {/*Conteúdo do Recibo de Sinal*/}
                {
                    loading === false &&
                    <div className={styles.content}>
                        <div className={styles.page}>
                            <div className={styles.logo}>
                                <Image
                                    src={logoEmpresa}
                                    alt={`$dadosEmpresa?.razaoSocial`}
                                    title={dadosEmpresa?.razaoSocial}
                                    width={176}
                                    height={100}
                                />
                            </div>

                            <div className={styles.body}>
                                <div className={styles.row}>
                                    <div className={styles.title}> {rascunhoTitulo} </div>

                                    <div className={styles.reviewContent}>
                                        <p>
                                            {textoVendedor}<br />
                                            {dadosVenda.vendedores.data.filter((e: any) => e.verificar_conjuge === 0).map((vendedor: any, index: number) => {
                                                return (
                                                    <div key={index}>
                                                        <span className={styles.destaque}>{dadosVenda.vendedores.data.length > 1 ? (index + 1) + ") " : ''}{vendedor?.tipo_pessoa === 0 ? vendedor?.name : vendedor?.razao_social}</span>
                                                        {(!!vendedor.usuario_id_conjuge && !!vendedor.conjuge) ? <>
                                                            <span>{arrayVendedores[index].split(vendedor.conjuge)[0]}</span>
                                                            <b>{vendedor.conjuge}</b>
                                                            <span>{arrayVendedores[index].split(vendedor.conjuge)[1]}</span>
                                                        </>
                                                            : <span>{arrayVendedores[index]}</span>
                                                        }

                                                        {(index + 1) === dadosVenda.vendedores.data.filter((e: any) => e.verificar_conjuge === 0).length ? finalParagrafoVendedor : ''}
                                                    </div>
                                                );
                                            })}
                                        </p>

                                        <p>
                                            {textoComprador}<br />
                                            {dadosVenda.compradores.data.length > 0
                                                ?
                                                dadosVenda.compradores.data.filter((e: any) => e.verificar_conjuge === 0).map((comprador: any, index: number) => {
                                                    return (
                                                        <>
                                                            <span className={styles.destaque}>{dadosVenda.compradores.data.length > 1 ? (index + 1) + ") " : ''}{(comprador.tipo_pessoa === 0 ? (comprador.name || '(Nome Completo)') : (comprador.razao_social || '(Nome Razão Social)'))}</span>

                                                            {(!!comprador.usuario_id_conjuge && !!comprador.conjuge) ? <>
                                                                <span>{arrayCompradores[index].split(comprador.conjuge)[0]}</span>
                                                                <b>{comprador.conjuge}</b>
                                                                <span>{arrayCompradores[index].split(comprador.conjuge)[1]}</span>
                                                            </>
                                                                : <span>{arrayCompradores[index]}</span>
                                                            }

                                                            {(index + 1) === dadosVenda.compradores.data.filter((e: any) => e.verificar_conjuge === 0).length ? finalParagrafoComprador : ''}
                                                        </>
                                                    );
                                                })
                                                :
                                                <>
                                                    {arrayCompradores[0]}
                                                    {finalParagrafoComprador}
                                                </>

                                            }
                                        </p>

                                        <p> {dadosImovel} </p>

                                        <p>
                                            <span className={styles.destaque}> {clausulaPri} </span> {textClausulaPri}
                                        </p>

                                        <p>
                                            <span className={styles.destaque}> {clausulaSeg} </span> {textClausulaSeg}
                                        </p>

                                        <p>
                                            <span className={styles.destaque}> {clausulaTer} </span> {textClausulaTer} <span className={styles.destaque}>{dadosVenda.informacao.valor_venda}</span> {textClausulaTerParteDois}
                                        </p>

                                        <p> {textClausulaTerSegPar} </p>
                                        {dadosVenda.informacao.forma_pagamento !== null && dadosVenda.informacao.forma_pagamento.search(/2|4/) !== -1 ?
                                            <>
                                                <p> {textClausulaTerTerPar} </p>
                                                <p> {textClausulaTerTerPar1} </p>
                                                <p> {textClausulaTerTerPar2} </p>
                                            </>
                                            :
                                            <p> {textClausulaTerTerPar} </p>
                                        }


                                        <p> {textClausulaTerQuaPar} </p>

                                        <p>
                                            <span className={styles.destaque}> {clausulaQua} </span> {textClausulaQua}
                                        </p>

                                        <p>
                                            <span className={styles.destaque}> {clausulaQui} </span> {textClausulaQui}
                                        </p>

                                        <p>
                                            <span className={styles.destaque}> {clausulaSex} </span> {textClausulaSex}
                                        </p>
                                        <p> {textClausulaSexA} </p>
                                        <p> {textClausulaSexB} </p>
                                        <p> {textClausulaSexC} </p>
                                        <p> {textClausulaSexD} </p>

                                        <p>
                                            <span className={styles.destaque}> {clausulaSet} </span> {textClausulaSet}
                                        </p>
                                        <p> {textClausulaSetA} </p>
                                        <p> {textClausulaSetB} </p>
                                        <p> {textClausulaSetC} </p>

                                        <p>
                                            <span className={styles.destaque}> {clausulaOit} </span> {textClausulaOit}
                                        </p>

                                        <p> {textClausulaOitUni} </p>

                                        <p>
                                            <span className={styles.destaque}> {clausulaNon} </span> {textClausulaNon}
                                        </p>

                                        <p>
                                            <span className={styles.destaque}> {clausulaDec} </span> {textClausulaDec}
                                        </p>

                                        <p>
                                            <span className={styles.destaque}> {clausulaDecPri} </span> {textClausulaDecPri}
                                        </p>

                                        <p>
                                            <span className={styles.destaque}> {clausulaDecSeg} </span> {textClausulaDecSeg}
                                        </p>

                                        <p>
                                            <span className={styles.destaque}> {clausulaDecTer} </span> {textClausulaDecTer}
                                        </p>

                                        <p> {textFinal} </p>

                                        <div className={styles.termoCiencia}>
                                            <div className={styles.title}> {termoCiencia} </div>
                                            <p> {textoTermoCiencia} </p>
                                        </div>

                                        <p className={styles.dataContrato}>{dataContrato}</p>

                                        <div className={styles.assinaturas}>
                                            {dadosVenda.vendedores.data.map((vendedor: any, index: number) => {
                                                return (
                                                    <>
                                                        {
                                                            vendedor.representante_socios.data.length > 0
                                                                ?
                                                                vendedor.representante_socios.data.map((representante: any, index: number) => {
                                                                    return <div key={index}>
                                                                        <p>{linhaAssinaturaVendedor}</p>
                                                                        <p>{vendedor.nome_fantasia}</p>
                                                                        <p>{'CNPJ nº ' + vendedor.cpf_cnpj}</p>
                                                                    </div>
                                                                })
                                                                :
                                                                <div>
                                                                    <p>{linhaAssinaturaVendedor}</p>
                                                                    <p>{vendedor.name}</p>
                                                                </div>
                                                        }
                                                    </>
                                                )
                                            })}

                                            {
                                                dadosVenda.compradores.data.length > 0 ?
                                                    dadosVenda.compradores.data.map((comprador: any, index: number) => {
                                                        return (
                                                            <>
                                                                {
                                                                    comprador.representante_socios.data.length > 0
                                                                        ?
                                                                        comprador.representante_socios.data.map((representante: any, index: number) => {
                                                                            return <div key={index}>
                                                                                <p>{linhaAssinaturaVendedor}</p>
                                                                                <p>{comprador.nome_fantasia}</p>
                                                                                <p>{'CNPJ nº ' + comprador.cpf_cnpj}</p>
                                                                            </div>
                                                                        })
                                                                        :
                                                                        <div>
                                                                            <p>{linhaAssinaturaVendedor}</p>
                                                                            <p>{comprador.name}</p>
                                                                        </div>
                                                                }
                                                            </>
                                                        )
                                                    })
                                                    :
                                                    <div>
                                                        <p>{linhaAssinaturaVendedor}</p>
                                                        <p>(Nome comprador)</p>
                                                    </div>
                                            }

                                        </div>

                                        <div className={styles.testemunhasObservacao}>
                                            <div className={styles.testemunhas}>
                                                <div className={styles.testemunha}>
                                                    <p style={{ marginBottom: '5px' }}>{tituloTestemunhas}</p>
                                                    <p>{linhaPrimeiraTestemunha}</p>
                                                    <p>{nomeTestemunha}</p>
                                                    <p>{enderecoTesteminha}</p>
                                                    <p>{documentosTestemunha}</p>
                                                </div>

                                                <div className={styles.testemunha}>
                                                    <p>{linhaSegundaTestemunha}</p>
                                                    <p>{nomeTestemunha}</p>
                                                    <p>{enderecoTesteminha}</p>
                                                    <p>{documentosTestemunha}</p>
                                                </div>
                                            </div>

                                            <div className={styles.observacao}>
                                                <p><span>{observacaoTitulo}</span> {observacao}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.tira}></div>
                    </div>
                }
                <div className='h83'></div>
            </div>

            <FooterRecibo handleDownload={handleBtnAvancar} downloadDate={downloadDate} />

            <Corner
                open={open}
                setOpen={setOpen}
                direction='up'
                vertical={'bottom'}
                horizontal={'right'}
                type={'download-rascunho'}
                idProcesso={idProcesso}
            />

            {/* <FooterDashboard options={progress} /> */}

            {/* <DialogVenda open={true} /> */}

            {/*Mobile*/}
            {/* <NavFooterMobile label="Entregar venda" disabled={true} /> */}
        </div>

    )
};

// EXECUTA ANTES DO DASHBOARD
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso } = context.params as { idProcesso: string };
    return { props: { idProcesso } };
};

export default Recibo;