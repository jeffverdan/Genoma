const numeroExtenso: any = require('numero-por-extenso');

import React, {useState, useEffect} from 'react'
import PostLocalizaProcesso from '@/apis/postLocalizaProcesso';
import GetLaudemiosList from '@/apis/getLaudemiosList';
import GetListEscrituras from '@/apis/getListEscrituras';
import GetProcesso from '@/apis/getProcesso';
import Image from 'next/image';
import logoEmpresa from '../../../../../../images/logo_recibo.png'; // DNA
// import logoEmpresa from '../../../../../../images/logo_placeholder.png'; // DEMO

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

import postRascunhoDownload from '@/apis/postRascunhoDownload';
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

export default function DownloadRascunho() {
    const [loading, setLoading] = useState(true);
    const [dataProcesso, setDataProcesso] = useState([{}]);
    const [selectItem, setSelectItem] = useState(0);
    const [dataSave, setDataSave] = useState([]);

    // const {token, imovelSave} = useContext(GlobalContext);    
    const [imovelData, setImovelData] = useState<ImovelData>();
    const [dadosVenda, setDadosVenda] = useState<any>([]);
    const [tipoLaudemio, setTipoLaudemio] = useState<any>([]);
    const [listEscrituras, setListEscrituras] = useState<any>([]);

    const [dadosMinutaVendedor, setDadosMinutaVendedor] = useState([]);
    const [dadosMinutaComprador, setDadosMinutaComprador] = useState([]);

    const [open, setOpen] = useState(false);

    const [progress, setProgress] = useState({
        imovel: 0,
        vendedores: 0,
        compradores: 0,
        recibo: 0,
        comissao: 0,
    })

    const idProcesso = '418'

    // const context = {
    //     loading, setLoading,
    //     dataProcesso, setDataProcesso,
    //     dataSave, setDataSave,
    //     selectItem, setSelectItem,
    //     idProcesso
    // };

    const router = useRouter();
    const [suspense, setSuspense] = useState<boolean>(true);
    const [downloadDate, setDownloadDate] = useState({ date: '', hours: '' });
    const dataHoje = dayjs().format('YYYY-MM-DD');
    const now = dayjs();

    // LOGO RECIBO PARA BASE64
    const [base64String, setBase64String] = useState<string | null>(null);

    // DADOS EMPRESA
    const [dadosEmpresa, setDadosEmpresa] = useState<IEmpresa>()

    useEffect(() => {

        const returnDadosEmpresa = async () => {
            let arrDadosEmpresa;
            const dadosEmpresa = localStorage.getItem('empresa_loja');
            if(dadosEmpresa !== null){
                arrDadosEmpresa = JSON.parse(dadosEmpresa)
            }
            const showEmpresa = arrDadosEmpresa[0];
            setDadosEmpresa(
                {
                    id: showEmpresa.id || '', 
                    razaoSocial: showEmpresa.nome_empresarial || '', 
                    cnpj: showEmpresa.cnpj || '', 
                    verificarFranquia: showEmpresa.verificar_franquia || ''
                }
            )
        }

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
            console.log(processo);

            if(processo?.informacao?.data_download_recibo !== ''){
                const dataHoraDownload = processo?.informacao?.data_download_recibo.split(' ');
                const splitHorarioDownload =  dataHoraDownload[1].split(':');
                const horaDownload = `${splitHorarioDownload[0]}h:${splitHorarioDownload[1]}`;
                
                setDownloadDate({
                    date: dataHoraDownload[0],
                    hours: horaDownload
                })
            }

            if(!processo?.validar_imovel 
                && !processo?.validar_vendedor 
                /*&& (processo?.porcenagem_preenchida_compradores > 0 
                || processo?.porcenagem_preenchida_compradores < 100)*/){

                    router.push('/vendas/gerar-venda/' + processo.processo_id + '/dashboard')
            }
        }

        const getImovelData = async () => {    
            const data: any = await PostLocalizaProcesso(idProcesso);

            console.log(data);
            setImovelData(data.imovel);
            setDadosVenda(data.imovel);
            console.log('imovelData' , imovelData)
            console.log('dadosVenda: ' , dadosVenda)

            // MOVIDO
            if ( dadosVenda?.vendedores?.data?.length !== 0) {
                setDadosMinutaVendedor(dadosVenda?.vendedores?.data[0])
            }
        
            if ( dadosVenda?.compradores?.data?.length !== 0) {
                setDadosMinutaComprador(dadosVenda?.compradores?.data[0])
            }
            
        };
    
        const getLaudemios = async () => {
            const data: any = await GetLaudemiosList();
            console.log('Laudemios: ', data)
            setTipoLaudemio(data);
            console.log('tipoLaudemio: ' , tipoLaudemio)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const formatoPorExtenso = (valor: any) => {

        if(loading === false){
            let retornoPorExtenso = '................';
        
            console.log(valor)
            
            if (valor !== null) {
                let valorNumero = valor?.replace(/R\$/g, '');
                valorNumero = valorNumero?.replace(/\./g, '');
                valorNumero = valorNumero?.replace(/\,/g, '.');
                console.log(valorNumero);
                retornoPorExtenso = numeroExtenso.porExtenso(valorNumero, numeroExtenso.estilo.monetario);
            }

            console.log(retornoPorExtenso)
            return retornoPorExtenso.trim();
        }
    }

    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();

    //lê os laudemios retornados em dadosReciboEnviado
    const laudemiosEnviados: any = dadosVenda?.laudemios?.map((laudemio: any) => parseInt(laudemio.valor_laudemio));
    //console.log(laudemiosEnviados);

    //Comparar dadosReciboEnviado a uma lista de todos os laudemios "tipoLaudemio" e retorna o id e nomes para exibir
    const laudemioValorToName = tipoLaudemio?.filter((laudemio: any) => laudemiosEnviados?.includes(laudemio.id));
    //console.log('laudemioValorToName: ' , laudemioValorToName)
    const laudemiosSemNome: [] = dadosVenda?.laudemios?.filter((laudemio: any) => laudemio?.tipo_laudemio === "2" || laudemio?.tipo_laudemio === "1") || '';
    laudemioValorToName.push(...laudemiosSemNome);

    // Plural Vendedor
    const logicaPluralVendS = dadosVenda?.vendedores?.data.length > 1 ? "S" : "";
    const logicaPluralVendSMinusculo = dadosVenda?.vendedores?.data.length > 1 ? "s" : "";
    const logicaPluraVendlEs = dadosVenda?.vendedores?.data.length > 1 ? "ES" : "";
    const logicaPluraVendMminusculo = dadosVenda?.vendedores?.data.length > 1 ? "m" : "";
    const logicaPluraVendAO = dadosVenda?.vendedores?.data.length > 1 ? "ão" : "á";
    const logicaPluraVendEM = dadosVenda?.vendedores?.data.length > 1 ? "em" : "";

    // Plural Comprador
    const logicaPluralCompS = dadosVenda?.compradores?.data?.length > 1 ? "S" : "";
    const logicaPluralCompSMinusculo = dadosVenda?.compradores?.data?.length > 1 ? "s" : "";
    const logicaPluralCompEs = dadosVenda?.compradores?.data?.length > 1 ? "ES" : "";
    const logicaPluraCompMminusculo = dadosVenda?.compradores?.data?.length > 1 ? "m" : "";
    const logicaPluraCompAO = dadosVenda?.compradores?.data?.length > 1 ? "ão" : "á";
    const logicaPluraCompEM = dadosVenda?.compradores?.data?.length > 1 ? "em" : "";

    const logicaGenero = (tipo: string, dadosUsuarios: any[], letra: any, comecoDeFrase?: any) => {
        let genero = '';
        let arrayGenero: any[] = [];
        dadosUsuarios?.forEach((element: { genero: any; }) => {
            arrayGenero.push(element.genero);
        });
        ////console.log(comecoDeFrase);
        if (arrayGenero.includes("M") || arrayGenero.includes("")) {
            /* if (dadosUsuarios.length > 1) {

            } else {

            } */
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
        ////console.log(genero);
        return genero;
    }

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

    }


    // Texto Vendedor
    const rascunhoTitulo = "RECIBO DE SINAL E PRINCÍPIO DE PAGAMENTO E PROMESSA DE COMPRA E VENDA";
    const textoVendedor = "Que entre si fazem de um lado como OUTORGANTE" + logicaPluralVendS + " PROMITENTE" + logicaPluralVendS + " VENDEDOR" + logicaGenero('maiusculo', dadosVenda?.vendedores?.data, 'or') + ":";
    let dadosVendedor = '';
    let arrayVendedores: string[] = [];
    //console.log(arrayVendedores);

     dadosVenda?.vendedores?.data.forEach((vendedor: any, index: any) => {
        if (vendedor.tipo_pessoa === 0) {
            dadosVendedor = ", " + vendedor.nacionalidade + ", " + retornoEstadoCivil(vendedor.estado_civil, vendedor.registro_casamento, vendedor.uniao_estavel, vendedor.conjuge, vendedor.genero) + ", Filh" + (vendedor.genero === "F" ? "a" : "o") + " de " + vendedor.nome_mae + " " + (vendedor.nome_pai !== null ? "e " + vendedor.nome_pai : "") + ", " + vendedor.profissao + (vendedor.rg ? ", RG Nº " + vendedor.rg : "") + (vendedor.rg_expedido ? ", expedido por " + vendedor.rg_expedido : "") + (vendedor.data_rg_expedido ? ", na data " + vendedor.data_rg_expedido : "") + ", CPF: " + vendedor.cpf_cnpj + ", " + (vendedor.email !== null ? vendedor.email + "," : "") + " residente e domiciliad" + (vendedor.genero === "F" ? "a" : "o") + " na " + vendedor.logradouro + ", " + vendedor.numero + "" + (vendedor.unidade !== null ? (", " + vendedor.unidade) : '') + (vendedor.complemento !== null ? (", " + vendedor.complemento) : '') + ", " + vendedor.cep + ", " + vendedor.bairro + ", " + vendedor.cidade + " - " + vendedor.estado + ", ";
            arrayVendedores.push(dadosVendedor);
        } else {
            dadosVendedor = ', sociedade empresária com sede na ' + vendedor.logradouro + ", " + vendedor.numero + "" + (vendedor.unidade !== null ? (", " + vendedor.unidade) : '') + (vendedor.complemento !== null ? (", " + vendedor.complemento) : '') + ", " + vendedor.bairro + ", " + vendedor.cidade + " - " + vendedor.estado + ", CEP: " + vendedor.cep + ", inscrito no CNPJ sob o nº " + vendedor.cpf_cnpj + ", devidamente representado por ";
            vendedor.representante_socios.data.forEach((representante: any, key_representante: any) => {
                dadosVendedor += representante.name + ', ' + (representante.nacionalidade !== null && representante.nacionalidade !== "" ? representante.nacionalidade + ', ' : '') + retornoEstadoCivil(representante.estado_civil, representante.registro_casamento, representante.uniao_estavel, representante.conjuge, representante.genero) + (representante.estado_civil !== null && representante.estado_civil !== "" ? ", " : "") + (representante.profissao !== null && representante.profissao !== '' ? representante.profissao + ", " : '') + (representante.rg ? " RG Nº " + representante.rg : "") + (representante.rg_expedido ? ", expedido por " + representante.rg_expedido : "") + (representante.data_rg_expedido ? ", na data " + representante.data_rg_expedido : "") + " inscrito no CPF sobre o nº " + representante.cpf_cnpj + ", " + (representante.email !== null ? " e-mail " + representante.email + "," : "") + ((vendedor.representante_socios.data.length - 1) !== key_representante ? " e por " : " ");
            });
            arrayVendedores.push(dadosVendedor);
        }
    });
    const finalParagrafoVendedor = "doravante denominad" + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ".";

    //Texto Comprador
    let textoComprador = ''
    if ( dadosVenda?.compradores?.data.length === 0) {
        textoComprador = "E de outro lado como OUTORGADO PROMITENTE COMPRADOR:"
    }
    else {
        textoComprador = "E de outro lado como OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + " PROMITENTE" + logicaPluralCompS + " COMPRADOR" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'or') + ":";
    }

    let dadosComprador = 'alguma coisa aqui';
    let arrayCompradores: (string | IRunOptions)[] = [];

    if ( dadosVenda?.compradores?.data.length > 0) {
        //console.log('tem comprador');

         dadosVenda?.compradores?.data.forEach((comprador: any, index: any) => {
            //console.log(comprador.length)
            if (comprador.tipo_pessoa === 0) {
                dadosComprador = ", " + (comprador.nacionalidade || 'brasileiro') + ", " + (retornoEstadoCivil((comprador.estado_civil || '(Estado Civil)'), (comprador.registro_casamento || ('Regime de Casamento')), (comprador.uniao_estavel || '(União Estável)'), (comprador.conjuge || '(Nome do Cônjuge)'), (comprador.genero || '(Gênero)')) || '(Estado Civil)') +  ", Filh" + (comprador.genero === "F" ? "a" : "o") + " de " + (comprador.nome_mae || '(Nome da Mãe)') + (comprador.nome_pai !== null ? " e " + comprador.nome_pai : "") + ", " + (comprador.profissao || '(Profissão)') + (comprador.rg ? ", RG Nº " + comprador.rg : "") + (comprador.rg_expedido ? ", expedido por " + comprador.rg_expedido : "") + (comprador.data_rg_expedido ? ", na data " + comprador.data_rg_expedido : "") + ", CPF: " + (comprador.cpf_cnpj || '000.000.000-00') + ", " + (comprador.email !== null ? comprador.email + "," : "") + " residente e domiciliad" + (comprador.genero === "F" ? "a" : "o") + " na " + (comprador.logradouro || '(Rua)') + ", " + (comprador.numero || '(Número)') + "" + (comprador.unidade !== null ? (", " + comprador.unidade) : '') + (comprador.complemento !== null ? (", " + comprador.complemento) : '') + ", " + (comprador.cep || '(CEP)') + ", " + (comprador.bairro || '(Bairro)') + ", " + (comprador.cidade || 'Rio de Janeiro') + " - " + (comprador.estado || 'RJ') + ", ";
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
        //console.log('sem comprador');
        dadosComprador = "(Nome Completo), brasileiro, Filho de (Nome da Mãe), (Profissão), CPF: 000.000.000-00, residente e domiciliado na (Rua), (Número), (CEP), (Bairro), Rio de Janeiro - RJ, (Estado Civil), "
        arrayCompradores.push(dadosComprador);
    }

    //const finalParagrafoComprador = "doravante denominad" + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + ".";
    let finalParagrafoComprador = ""
    if ( dadosVenda?.compradores?.data.length === 0) {
        finalParagrafoComprador = "doravante denominado OUTORGADO.";
    }
    else {
        finalParagrafoComprador = "doravante denominad" + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + ".";
    }

    ////console.log(arrayCompradores);

    console.log('VALOR SINAL: ' , dadosVenda?.informacao?.valorSinal);
    console.log('Valor Extenso: ' , formatoPorExtenso(dadosVenda?.informacao?.valorSinal))

    const enderecoImovel: string = dadosVenda.logradouro + ", " + dadosVenda.numero + "" + (dadosVenda.unidade !== null ? (', ' + dadosVenda.unidade) : '') + (dadosVenda.complemento !== null ? (', ' + dadosVenda.complemento) : '') + ", " + dadosVenda.bairro + ", " + dadosVenda.cidade + " - " + dadosVenda.uf;
    const dadosImovel: string = "Recebe" + logicaPluraCompMminusculo + ", neste ato, " + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ", a importância de " + dadosVenda?.informacao?.valorSinal + " (" + formatoPorExtenso(dadosVenda?.informacao?.valorSinal) + ") como SINAL E PRINCÍPIO DE PAGAMENTO pela venda do imóvel situado na " + enderecoImovel + ", pelo que se compromete" + logicaPluraVendMminusculo + " a vender " + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'ao') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + " nos termos das cláusulas e condições a seguir pactuadas:";
    const clausulaPri: string = "CLÁUSULA PRIMEIRA";
    const textClausulaPri: string = " - Da propriedade: " + logicaGenero('maiusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " " + ( dadosVenda?.vendedores?.data.length > 1 ? "são" : "é") + " legítim" + logicaGenero('minusculo',  dadosVenda?.vendedores?.data, 'o') + " proprietári" + logicaGenero('minusculo',  dadosVenda?.vendedores?.data, 'o') + " do imóvel constituído pelo........... situado na " + enderecoImovel + verificarVagas() + (dadosVenda?.laudemios?.length > 0 ? ", foreio a " : '') + laudemios(laudemioValorToName) + ", nesta cidade, devidamente descrito e caracterizado no corpo " + escritura() + " lavrada em " + lavrada() + ", Folha " + folha() + ", Livro " + livro() + ", ato " + ato() + ", no Cartório do " + cartorio() + "º Ofício de Notas. Registrado no " + rgiRegistro() + "º RGI na matrícula nº " + dadosVenda?.informacao?.matricula + " e Inscrição Municipal nº " + dadosVenda?.informacao?.inscricaoMunicipal;
    const clausulaSeg: string = "CLÁUSULA SEGUNDA";
    const clausulaExceto: string = (dadosVenda?.informacao?.excecoes !== null && dadosVenda?.informacao?.excecoes.trim() !== "") ? (', exceto: ' + dadosVenda?.informacao?.excecoes) + "." : '.';
    const textClausulaSeg: string = " - Da forma de aquisição e situação jurídica: " + logicaGenero('maiusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " declara" + logicaPluraVendMminusculo + " que " + ( dadosVenda?.vendedores?.data.length > 1 ? "adquiriram" : "adquiriu") + " o imóvel em questão nos termos da Escritura mencionada na cláusula primeira, declarando que o referido imóvel encontra-se livre e desembaraçado de todo e qualquer ônus judicial ou extrajudicial, hipotecas legais ou convencionais, arresto, sequestro, litispendência, foro ou pensão, até a presente data, declarando, outrossim, que inexiste contra seu nome, bem como em relação ao imóvel objeto do presente negócio jurídico, quaisquer procedimentos judiciais, extrajudiciais ou administrativos que, de alguma forma, possam impedir, pôr em risco ou simplesmente afetar a pacífica e segura aquisição do mesmo, respondendo, portanto, por quaisquer débitos anteriores à celebração do presente instrumento, seja de que natureza for, que porventura venham a ser futuramente apuradas, respondendo, ainda, pela evicção de direito" + clausulaExceto;
    const clausulaTer: string = "CLÁUSULA TERCEIRA";
    const textClausulaTer: string = " - Da Compra e Venda: E que assim como o possuem, pelo presente e melhor forma de direito, " + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " promete" + logicaPluraVendMminusculo + " e se obriga" + logicaPluraVendMminusculo + " a VENDER o imóvel em questão " + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'ao') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + ", no estado em que se encontra e conforme foi vistoriado pel" + logicaGenero('miniusculo',  dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + ", pelo preço certo e ajustado de ";
    const textClausulaTerParteDois: string = "(" + formatoPorExtenso(dadosVenda?.informacao?.valor_venda) + "), a ser integralizado da seguinte forma:"
    const textClausulaTerSegPar: string = "a) " + dadosVenda?.informacao?.valorSinal + " (" + formatoPorExtenso(dadosVenda?.informacao?.valorSinal) + "), neste ato através do(s) cheque(s) nº(s)........................., sacado contra o Banco nº................, como sinal e princípio de pagamento, pelo que " + logicaGenero('minusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " " + ( dadosVenda?.vendedores?.data.length > 1 ? "dão" : "dá") + " plena quitação, quando da compensação bancária.";
    let textClausulaTerTerPar: string = '';
    let textClausulaTerTerPar1: string = '';
    let textClausulaTerTerPar2: string = '';
    let textClausulaTerTerPar3: string = '';

    const apenasNumeros = (string: string) => {

        console.log(string);

        //var numsStr = string.replace(/[^0-9]/g, '');
        const numsStr = string?.replace("R$", "").replace(/[^0-9]/g, '');
        console.log(typeof(numsStr));
        const valorInt: number = parseInt(numsStr);
        return valorInt;
        //return parseInt(numsStr);
    }

    console.log('Valor venda: ' , dadosVenda?.informacao?.valor_venda);
    console.log('Valor sinal: ' , dadosVenda?.informacao?.valorSinal);
    let saldoValor: number = apenasNumeros(dadosVenda?.informacao?.valor_venda) - apenasNumeros(dadosVenda?.informacao?.valorSinal);
    console.log(saldoValor);

    function formatReal(int: string | number) {
        var tmp = int + '';
        tmp = tmp?.replace(/([0-9]{2})$/g, ",$1");
        if (tmp?.length > 6)
            tmp = tmp?.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

        return tmp;
    }

    if (dadosVenda?.informacao?.forma_pagamento !== null && dadosVenda?.informacao?.forma_pagamento.search(/2|4/) !== -1) {
        //textClausulaTerTerPar = "financiado b) E saldo no valor de R$ ..................... (.......................) pagos no ato da lavratura da Escritura Pública de Compra e Venda ou Instrumento Particular com Força de Escritura Pública, que deverá ocorrer no prazo de 45 (quarenta e cinco) dias úteis, contados da data do recebimento de toda documentação exigida para liberação do financiamento junto à instituição financeira de escolha d" + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + ", sendo certo que " + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " declara" + logicaPluraVendMminusculo + " ciência que o crédito estará disponível em até 5 (cinco) dias úteis, após a apresentação do instrumento de financiamento devidamente registrado em nome d" + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + " junto à Instituição Financeira escolhida.";
        textClausulaTerTerPar = "b) E saldo no valor de R$ " + formatReal(saldoValor) + " (" + formatoPorExtenso(formatReal(saldoValor)) + ") pagos no ato da assinatura da Escritura Pública de Compra e Venda ou Instrumento Particular com Força de Escritura Pública, da seguinte forma:";

        textClausulaTerTerPar1 = "1) R$..............(.......), pagos através de recursos próprios por meio de cheque administrativo nominal " + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'ao') + " OUTORGANTE" + logicaPluralVendS;

        textClausulaTerTerPar2 = "2) ..................... (......) pagos através de financiamento imobiliário, que deverá ocorrer no prazo de 45 (quarenta e cinco) dias úteis, contados da data do recebimento de toda documentação exigida para liberação do financiamento junto à instituição financeira de escolha d" + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + ", sendo certo que " + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " declaram ciência que o crédito estará disponível em até 5 (cinco) dias úteis, após a apresentação do instrumento de financiamento devidamente registrado em nome d" + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + " junto à Instituição Financeira escolhida.";

    } else {
        textClausulaTerTerPar = "b) E saldo no valor de R$ " + formatReal(saldoValor) + " (" + formatoPorExtenso(formatReal(saldoValor)) + ") pagos no ato da lavratura da Escritura Pública de Compra e Venda, através de cheque administrativo nominal " + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'ao') + " outorgante" + logicaPluralVendSMinusculo + " e ou transferência bancária, que deverá ocorrer no prazo em até 30 (trinta) dias úteis, desde que apresentadas todas as certidões elencadas Cláusula Sexta.";
    }
    
    const textClausulaTerQuaPar = "Parágrafo Primeiro - Caso haja algum apontamento nas certidões d" + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " e ou relativas ao imóvel, de caráter insanável ou que seja impeditivo para a presente transação, " + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " dever" + logicaPluraVendAO + " restituir " + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'ao') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + " o sinal mencionado nesta cláusula no item a), na forma simples no prazo de 48 horas contados da solicitação de devolução.";
    let textClausulaQua = '';
    const clausulaQua = "CLÁUSULA QUARTA";
    if (dadosVenda?.informacao?.forma_pagamento !== null && dadosVenda?.informacao?.forma_pagamento.search(/2|4/) !== -1) {
        textClausulaQua = " - Da falta do pagamento: Na falta do pagamento no vencimento do saldo acordado mencionado na cláusula anterior, e ou desfazimento por sua culpa " + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + " perder" + logicaPluraCompAO + " o sinal objeto deste instrumento em favor d" + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ", desde que entregue" + ( dadosVenda?.vendedores?.data.length > 1 ? "m" : "") + " toda documentação exigida pelas partes para liberação do financiamento junto à instituição financeira dentro do prazo estipulado. E caso o desfazimento ocorra por culpa d" + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ", " + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " mesm" + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " fica" + ( dadosVenda?.vendedores?.data.length > 1 ? "m" : "") + " obrigad" + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " a devolver em dobro o valor do sinal recebido. Em qualquer dos casos, a parte que der causa se obriga a pagar a comissão devida à " + dadosEmpresa?.razaoSocial?.toUpperCase() + ", CJ-008711, conforme o artigo 725 do CCB.";
    } else {
        textClausulaQua = " - Da falta do pagamento: Na falta do pagamento no vencimento do saldo acordado mencionado na cláusula anterior, e ou desfazimento por sua culpa " + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + " perder" + logicaPluraCompAO + " o sinal objeto deste instrumento em favor d" + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ". E caso o desfazimento ocorra por culpa d" + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " ficar" + logicaPluraCompAO + " obrigad" + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " a devolver em dobro o valor do sinal recebido. Em qualquer dos casos, a parte que der causa se obriga a pagar a comissão devida à " + dadosEmpresa?.razaoSocial?.toUpperCase() + ", CJ-008711/ RJ, conforme o artigo 725 do CCB.";
    }
    const clausulaQui = "CLÁUSULA QUINTA";
    let textClausulaQui = '';
    if (dadosVenda?.informacao?.forma_pagamento !== null && dadosVenda?.informacao?.forma_pagamento.search(/2|4/) !== -1) {
        textClausulaQui = " - Da imissão de posse: " + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'o', "comecoDeFrase") + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + " ser" + logicaPluraCompAO + " imitido" + logicaPluralCompSMinusculo + " na posse do imóvel objeto deste instrumento, em quando da liberação do saldo devedor financiado já disponível na conta d" + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ", ou seja, após a quitação total do imóvel.";
    } else {
        textClausulaQui = " - Da imissão de posse: " + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'o', 'comecoDeFrase') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + " ser" + logicaPluraCompAO + " imitido" + logicaPluralCompSMinusculo + " na posse do imóvel objeto deste instrumento, no da lavratura da Escritura Pública de Compra e Venda, ou seja, após a quitação total do imóvel.";
    }
    const clausulaSex = "CLÁUSULA SEXTA";
    const textClausulaSex = " - Das obrigações d" + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ": Correrão por conta d" + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " as seguintes despesas e obrigações:";
    const textClausulaSexA = "a) Certidões negativas pessoais desta cidade e da comarca sua residência tais como: 1º e 2º Ofícios de Interdições e Tutelas, 2º Ofício Distribuidor Cível, 2º Ofício Distribuidor Fiscal e Fazendário, Justiça Federal, Certidão Nacional de Débitos Trabalhistas do TST (CNDT);"
    const textClausulaSexB = "b) Certidões relativas ao imóvel: certidão ônus reais, certidão de quitação fiscal imobiliária e enfitêutica, certidão do 2º Distribuidor Fiscal e Fazendário, declaração de quitação condominial, cotas do IPTU (" + anoAtual + "), Foro, Laudêmio (se houver), Taxa de Incêndio, certidão negativa do FUNESBOM (taxa dos Bombeiros), cópias autenticadas da" + logicaPluralVendSMinusculo + " cédula" + logicaPluralVendSMinusculo + " de identidade, comprovante de estado civil.";
    const textClausulaSexC = "c) Caso " + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " não entregue" + logicaPluraVendMminusculo + " o imóvel " + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'ao') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + " na data acertada, ficar" + logicaPluraVendAO + " obrigad" + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " a pagar uma multa diária de " + (dadosVenda?.informacao?.valoMulta !== null ? dadosVenda?.informacao?.valoMulta : 'R$ ..................') + "(" + formatoPorExtenso(dadosVenda?.informacao?.valoMulta) + ") enquanto permanece" + ( dadosVenda?.vendedores?.data.length > 1 ? "m" : "r") + " no imóvel objeto deste instrumento, além de arcar" + logicaPluraVendEM + " com o pagamento dos impostos, encargos e taxas que incidam ou venham a incidir sobre o imóvel em questão, bem como a ressarcir " + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + " de quaisquer despesas que este" + logicaPluralCompSMinusculo + " vier" + logicaPluraCompEM + " a fazer para obtenção da propriedade e posse do imóvel, inclusive honorários advocatícios e custas judiciais.";
    const textClausulaSexD = "d) Pagamento da corretagem para " + dadosEmpresa?.razaoSocial?.toUpperCase() + " conforme mencionado na Cláusula Oitava.";
    const clausulaSet = "CLÁUSULA SÉTIMA";
    const textClausulaSet = " - Das obrigações d" + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + ":";
    const textClausulaSetA = "a) " + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'o', 'comecoDeFrase') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + " se obriga" + logicaPluraCompMminusculo + ", a partir da data do recebimento das chaves, pelo pagamento de todos os impostos e taxas que incidam ou venham a incidir sobre o imóvel.";

    let textClausulaSetB = '';
    if (dadosVenda?.informacao?.forma_pagamento !== null && dadosVenda?.informacao?.forma_pagamento.search(/2|4/) !== -1) {
        textClausulaSetB = "b) Correrão por conta d" + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + " as seguintes despesas e obrigações: custos do Instrumento particular com força de escritura pública e seu respectivo registro imobiliário, imposto de transmissão, custo de engenharia, planta baixa do imóvel, cópias de cédulas de identidade e CPF autenticadas, além dos eventuais trâmites e despesas bancárias junto à instituição financeira de sua escolha consecutivas do financiamento.";
    } else if ((dadosVenda?.informacao?.forma_pagamento !== null && dadosVenda?.informacao?.forma_pagamento.search(/1/) !== -1)){
        textClausulaSetB = "b) Correrão por conta d" + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + " as seguintes despesas e obrigações: custos da escritura pública e seu respectivo registro imobiliário, imposto de transmissão, custo de engenharia, planta baixa do imóvel, cópias de cédulas de identidade e CPF autenticadas.";
    } else {
        textClausulaSetB = "b) Correrão por conta d" + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + " as seguintes despesas e obrigações: custos da escritura pública com o uso do FGTS e seu respectivo registro imobiliário, imposto de transmissão, custo de engenharia, planta baixa do imóvel, cópias de cédulas de identidade e CPF autenticadas.";
    }


    let textClausulaSetC = '';
    if (dadosVenda?.informacao?.forma_pagamento !== null && dadosVenda?.informacao?.forma_pagamento.search(/2|4/) !== -1) {
        textClausulaSetC = "c) Caso as certidões apresentadas pel" + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " expirem no curso do prazo para obtenção do financiamento, caberá " + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'ao') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + " custear e requerer a emissão de novas.";
    } else {
        textClausulaSetC = "";
    }

    const clausulaOit = "CLÁUSULA OITAVA";
    const textClausulaOit = " - Da Corretagem - " + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + " se obriga" + logicaPluraVendMminusculo + " ao pagamento de 5% (cinco por cento) do valor do imóvel à título de corretagem à " + dadosEmpresa?.razaoSocial?.toUpperCase() + ", e corretores participantes da venda indicados pela intermediária, que deverão ser pagos no dia da assinatura " + escritura() +". O pagamento da " + dadosEmpresa?.razaoSocial?.toUpperCase() + " e seus corretores participantes da venda, serão pagos separadamente conforme indicado pela intermediária. ";
    const textClausulaOitUni = "Parágrafo Único - As partes declaram ter ciência de que a função da corretora é a aproximação das mesmas, de modo que não a responsabilizam por obrigações atinentes a cada contratante e necessárias ao sucesso da operação, a exemplo da obtenção de certidões, apresentação de documentos e quitação do saldo devedor, inclusive mediante financiamento, devendo cada contratante zelar, sob sua responsabilidade e risco, pelo cumprimento das obrigações respectivas. Igualmente, as partes declaram ter ciência de que a corretora não se responsabiliza pelas informações equivocadas eventualmente prestadas por um contratante, devendo a questão ser direcionada ao responsável por esse ato.";
    const clausulaNon = "CLÁUSULA NONA";
    const textClausulaNon = " - Da irrevogabilidade: Sem prejuízo do disposto na Cláusula Quarta deste instrumento, as partes firmam o presente em caráter irrevogável e irretratável que lhes é facultado pelos artigos 417 a 420 do Código Civil Brasileiro, obrigando-se por si, seus herdeiros e sucessores, a fazê-lo bom, firme e valioso.";
    const clausulaDec = "CLÁUSULA DÉCIMA";
    const clausulaBensMoveis = (dadosVenda?.informacao?.bens_moveis !== null && dadosVenda?.informacao?.bens_moveis.trim() !== "") ? dadosVenda?.informacao?.bens_moveis : "vazio de coisas e pessoas";
    const textClausulaDec = " - Dos bens móveis: O imóvel será entregue " + clausulaBensMoveis + ".";
    const clausulaDecPri = "CLÁUSULA DÉCIMA PRIMEIRA";
    const textClausulaDecPri = " – 1 - As certidões descritas na cláusula sétima devem estar à disposição do cartório responsável pela lavratura da Escritura Pública de Compra e Venda pelo menos com 48 (quarenta e oito) horas de antecedência. 2 – Fica acordado entre as partes que caso haja qualquer apontamento junto às certidões d" + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ", el" + logicaGenero('minusculo',  dadosVenda?.vendedores?.data, 'or') + " se responsabiliza" + logicaPluraVendMminusculo + " pelo pagamento de débitos existentes, baixas e cancelamentos, referentes ao apontamento, nos devidos órgãos responsáveis.";
    const clausulaDecSeg = "CLÁUSULA DÉCIMA-SEGUNDA";
    let textClausulaDecSeg = '';

    console.log('Valor prazo: ' , dadosVenda?.informacao?.prazo)
    console.log('Valor prazo typeof: ' , typeof(dadosVenda?.informacao?.prazo))

    if (dadosVenda?.informacao?.forma_pagamento !== null && dadosVenda?.informacao?.forma_pagamento.search(/2|4/) !== -1) {
        textClausulaDecSeg = " – Do Instrumento particular: O Instrumento particular com força de escritura pública será assinado, em até " + dadosVenda?.informacao?.prazo + " (" + numeroExtenso.porExtenso(parseInt(dadosVenda?.informacao?.prazo)) + ") dias úteis, contados da data do recebimento de toda documentação exigida para liberação do financiamento junto à instituição financeira de escolha d" + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'o') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + ", no dia, hora e local previamente acordado entre as partes, entendendo-se como frustração à venda o não comparecimento no horário aprazado, cabendo assim, a perda ou devolução do sinal, além da comissão devida à " + dadosEmpresa?.razaoSocial?.toUpperCase() + ".";
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
    const observacao = " Eventuais pagamentos ou cheques recebidos permanecerão sob a responsabilidade da " + dadosEmpresa?.razaoSocial?.toUpperCase() + " até a assinatura d" + logicaGenero('miniusculo',  dadosVenda?.vendedores?.data, 'o') + " OUTORGANTE" + logicaPluralVendS + ". E caso estes não assinem este instrumento, os mesmos serão devolvidos " + logicaGenero('minusculo',  dadosVenda?.compradores?.data, 'ao') + " OUTORGAD" + logicaGenero('maiusculo',  dadosVenda?.compradores?.data, 'o') + " sem quaisquer ônus para as partes.";

    function laudemios(laudemios: any[]) {
        let returoLaudemio = '';

        let separa = '';
        const countLaudemio = laudemios.length;
        laudemios.forEach((element: any, key: any) => {
            //console.log("Elemnento: ", element);
            //console.log(key, "countLaudemio = ", countLaudemio);
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
    }

    const handleBtnAvancar = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        //console.log('Avançar');
        //setCountMenu(4);
        const arrayVenda = {

        }
        //console.log(arrayVenda);

        //setDadosMinutaImovel(arrayVenda);
        ////console.log(dadosMinutaImovel);

        //setPosicaoMinuta(1);
        //closeMinuta(e);    
        //const imageBase64Data = `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`;
        //const imageBase64DataHeader = `iVBORw0KGgoAAAANSUhEUgAAAlgAAAFUCAYAAAD4TEI6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2RDY4MzFCM0QzN0YxMUVCOERBRkQ3QzRBNEQ2ODFCQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2RDY4MzFCNEQzN0YxMUVCOERBRkQ3QzRBNEQ2ODFCQiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZENjgzMUIxRDM3RjExRUI4REFGRDdDNEE0RDY4MUJCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZENjgzMUIyRDM3RjExRUI4REFGRDdDNEE0RDY4MUJCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Us7y9QAAb1VJREFUeNrsvQeA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`;
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
        if ( dadosVenda?.compradores?.data.length > 0) {
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
            //console.log("index_array = ", index_array);
            dadosAssinatura.forEach((element: any, index: any) => {
                if (arrayElementos.includes(index)) {
                    arrayExibirTableCell.push(element);
                }
            });
            return arrayExibirTableCell;
        }

        const exibirTableRow = (dadosAssinatura: any) => {
            //console.log(dadosAssinatura.length);
            let countTableRow = dadosAssinatura.length / 2;
            let countRestoTableRow = dadosAssinatura.length % 2;

            //console.log("countTableRow = countTableRow", countTableRow);
            //console.log("countRestoTableRow = ", countRestoTableRow);

            let valorFinalCountTableRow = 0;
            if (countRestoTableRow > 0) {
                valorFinalCountTableRow = Math.trunc(countTableRow) + 1;
            }
            //console.log("valorFinalCountTableRow = valorFinalCountTableRow", valorFinalCountTableRow);


            let arrayTableRow: any = [];
            for (let index = 0; index < countTableRow; index++) {
                let elementoTableRow = new TableRow({
                    children: exibirTableCell(dadosAssinatura, index)
                });

                //console.log(elementoTableRow);
                arrayTableRow.push(elementoTableRow);
            }
            //console.log(arrayTableRow);

            /* let elementoTableRow = new TableRow({
                children: dadosAsinatura
            }); */
            ////console.log(elementoTableRow);
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

        let dadosVendedores: any = '';
        let arrayVendedoresDownload = [];
         dadosVenda?.vendedores?.data.forEach((element: { tipo_pessoa: number; name: any; nome_fantasia: any; }, index: number) => {
            dadosVendedores =
                new TextRun({
                    text: ( dadosVenda?.vendedores?.data.length > 1 ? (index + 1) + ") " : '') + (element.tipo_pessoa === 0 ? element.name : element.nome_fantasia),
                    bold: true
                });
            arrayVendedoresDownload.push(dadosVendedores);

            dadosVendedores = new TextRun(arrayVendedores[index]);
            arrayVendedoresDownload.push(dadosVendedores);
        });
        dadosVendedores = new TextRun(finalParagrafoVendedor);
        arrayVendedoresDownload.push(dadosVendedores);

        let dadosCompradores: any = '';
        let arrayCompradoresDownload = [];

        if ( dadosVenda?.compradores?.data.length > 0) {
             dadosVenda?.compradores?.data.forEach((element: { tipo_pessoa: number; name: any; nome_fantasia: any; }, index: number) => {
                dadosCompradores =
                    new TextRun({
                        text: ( dadosVenda?.compradores?.data.length > 1 ? (index + 1) + ") " : '') + (element.tipo_pessoa === 0 ? element.name : element.nome_fantasia),
                        bold: true
                    });
                arrayCompradoresDownload.push(dadosCompradores);

                dadosCompradores = new TextRun(arrayCompradores[index]);
                arrayCompradoresDownload.push(dadosCompradores);
            });
        }
        else {
            dadosCompradores =
                new TextRun({
                    text: '',
                    bold: true
                });
            arrayCompradoresDownload.push(dadosCompradores);

            dadosCompradores = new TextRun(arrayCompradores[0]);
            arrayCompradoresDownload.push(dadosCompradores);
        }

        dadosCompradores = new TextRun(finalParagrafoComprador);
        arrayCompradoresDownload.push(dadosCompradores);


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
                    },
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
                    ],

                }
            ]
        });

        Packer.toBlob(doc).then((blob) => {
            //console.log(blob);
            let imovel = dadosVenda.logradouro + '_' + dadosVenda.bairro + '_' + dadosVenda.cidade + '_' + dadosVenda.numero;
            let titulo_imovel = imovel.split(" ").join("_");;
            saveAs(blob, "Recibo_de_Sinal_" + titulo_imovel + ".docx");
            //console.log("Document created successfully");

            setLoading(false);
            porcentagemDownloadRascunho()

            // setTimeout(() => {
            //     setOpen(true);
            // }, 2000);
        });

        setOpen(true);
        
        // console.log('selectItem: ' , selectItem)
        // console.log('dataProcesso' , dataProcesso)
        // console.log('Dados venda: ' , dadosVenda?.informacao?.data_download_recibo);

        // const downloadData = ;
        // const downloadHora = ;

        console.log(now)
        const date = now.format('DD/MM/YYYY');
        const hours = `${now.get('hour')}h:${now.get('minute')}`
        setDownloadDate({
            date: date,
            hours: hours
        })

    }

    function verificarVagas() {
        if (dadosVenda?.informacao?.vaga !== null && dadosVenda?.informacao?.vaga !== '0') {

            let valor: any = "";
            let stringVaga = "vagas";
            let vagas: number = parseInt(dadosVenda?.informacao?.vaga);

            console.log(dadosVenda?.informacao?.vaga); //string

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
    }

    const porcentagemDownloadRascunho = async () => {
        console.log(dadosVenda)
        const imovelId: number = dadosVenda.id;
        const processoId: number = dadosVenda.processo_id;
        const usuarioId: any = localStorage.getItem('usuario_id');
        const rascunhoDownload = await postRascunhoDownload(imovelId, processoId, usuarioId);
        return rascunhoDownload;
    }
}
