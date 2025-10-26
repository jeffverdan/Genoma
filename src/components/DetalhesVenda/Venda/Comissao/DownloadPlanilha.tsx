import formatoMoeda from '@/functions/formatoMoedaViewApenas';
import { comissaoEnvolvidos, dadosRepasseType, ParcelasComissionType, ParcelasUserComissionType } from '@/interfaces/Imovel/comissao';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

type Margins = number | [number, number] | [number, number, number, number];

type textTypes = { text: string | null | undefined; fontSize: number; margin: Margins; alignment: string; tocItem: any };

const returnDados = (corretor: comissaoEnvolvidos, label: string, numero: number | undefined) => {
    return [
        { text: !!numero ? numero + `º ${label}` : label, fontSize: 9, margin: [0, 2, 0, 2], alignment: 'right', tocItem: true },
        { text: corretor.porcentagem_real + '%', fontSize: 9, margin: [0, 2, 0, 2], alignment: 'center', tocItem: true },
        { text: corretor.desconto === null || formatoMoeda(corretor.desconto) === '0' || corretor.desconto === '' ? '' : corretor.desconto, fontSize: 9, margin: [0, 2, 0, 2], alignment: 'center', tocItem: true },
        { text: corretor.valor_real === null ? '0,00' : formatoMoeda(corretor.valor_real), fontSize: 9, margin: [0, 2, 0, 2], alignment: 'center', tocItem: true },
        { text: corretor.tipo_pessoa === 'PF' ? corretor.name : corretor.nome_empresarial, fontSize: 9, margin: [0, 2, 0, 2], alignment: 'center', tocItem: true },
        { text: corretor.tipo_pessoa === 'PF' ? corretor.cpf : corretor.cnpj, fontSize: 9, margin: [0, 2, 0, 2], alignment: 'center', tocItem: true },
        { text: corretor.creci, fontSize: 9, margin: [0, 2, 0, 2], alignment: 'center', tocItem: true },
        {
            text: corretor.tipo_pagamento === 'pix'
                ? 'PIX: ' + corretor.pix
                : 'Banco: ' + corretor.nome_banco + ' Agência: ' + corretor.agencia + ' C/C: ' + corretor.numero_conta, fontSize: 9, margin: [0, 2, 0, 2], alignment: 'center', tocItem: true
        },
    ] as textTypes[];
};

const returnDadosRepasse = (dadosRepasse?: dadosRepasseType, label?: string) => {
    if (!dadosRepasse) return []
    else
        return [
            { text: label, fontSize: 9, margin: [0, 15, 0, 2], alignment: 'right' },
            { text: dadosRepasse?.porcentagem + '%', fontSize: 9, margin: [0, 15, 0, 2], alignment: 'center', tocItem: true },
            { text: formatoMoeda(dadosRepasse?.desconto), fontSize: 9, margin: [0, 15, 0, 2], alignment: 'center', tocItem: true },
            { text: formatoMoeda(dadosRepasse?.valor_real), fontSize: 9, margin: [0, 15, 0, 2], alignment: 'center', tocItem: true },
            { text: dadosRepasse?.nome_empresarial, fontSize: 9, margin: [0, 15, 0, 2], alignment: 'center', tocItem: true },
            { text: dadosRepasse?.empresa_cnpj, fontSize: 9, margin: [0, 15, 0, 2], alignment: 'center', tocItem: true },
            { text: dadosRepasse?.creci_empresa, fontSize: 9, margin: [0, 15, 0, 2], alignment: 'center', tocItem: true },
            {
                text:
                    dadosRepasse.tipo_pagamento === 'pix'
                        ? 'PIX: ' + dadosRepasse?.pix
                        : 'Banco: ' + dadosRepasse?.nome_banco + ' Agência: ' + dadosRepasse?.agencia + ' C/C: ' + dadosRepasse?.numero_conta, fontSize: 9, margin: [0, 15, 0, 2], alignment: 'center', tocItem: true
            },
        ] as textTypes[];
};



const DownloadPlanilha = async (imovelData: imovelDataInterface) => {

    pdfMake.vfs = pdfFonts?.pdfMake?.vfs;

    const d = new Date();
    const semana = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    const mes = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]
    const datas = d.getDate();
    const ano = d.getFullYear();
    const imovelDataComissao = imovelData.comissao;
    const enderecoImovel = imovelData.logradouro + ", " + imovelData.numero + "" + (imovelData.unidade !== null ? (', ' + imovelData.unidade) : '') + (imovelData.complemento !== null ? (', ' + imovelData.complemento) : '') + ", " + imovelData.bairro + ", " + imovelData.cidade + " - " + imovelData.uf;
    const enderecoNomePDF = imovelData.logradouro + "_" + imovelData.numero + "" + (imovelData.unidade !== null ? ('_' + imovelData.unidade) : '') + (imovelData.complemento !== null ? ('_' + imovelData.complemento) : '') + "_" + imovelData.bairro + "_" + imovelData.cidade + "_" + imovelData.uf;
    const reportTitle = [
        {
            text: 'Planilha de Comissão',
            fontSize: 15,
            bold: true,
            margin: [15, 20, 0, 45] as Margins,
            tocItem: true
        },
    ];
    const dadosVendedor: textTypes[][] = [];
    imovelData.comissao?.corretores_vendedores_comissao?.forEach((corretor, index) => {
        const numero = imovelData.comissao?.corretores_vendedores_comissao?.[1] ? index + 1 : undefined;        
        dadosVendedor.push(returnDados(corretor, 'Vendedor', numero));
    });
    const dadosOpcionista: textTypes[][] = [];
    imovelData.comissao?.corretores_opicionistas_comissao?.forEach((corretor, index) => {
        const numero = imovelData.comissao?.corretores_opicionistas_comissao?.[1] ? index + 1 : undefined;        
        dadosOpcionista.push(returnDados(corretor, 'Opcionista', numero));
    });
    const dadosGerente: textTypes[][] = [];
    imovelData.comissao?.comissao_gerentes?.forEach((corretor, index) => {
        const numero = imovelData.comissao?.comissao_gerentes?.[1] ? index + 1 : undefined        
        dadosGerente.push(returnDados(corretor, 'Gerente', numero));
    });
    const dadosGG: textTypes[][] = [];
    imovelData.comissao?.comissao_gerente_gerais?.forEach((corretor, index) => {
        const numero = imovelData.comissao?.comissao_gerente_gerais?.[1] ? index + 1 : undefined        
        dadosGG.push(returnDados(corretor, 'Gerente Geral', numero));
    });

    const dadosDiretor: textTypes[][] = [];
    const diretor = imovelData.comissao?.dados_diretor_comercial;
    if (diretor) {
        const dataDiretor = {
            ...diretor,
            cnpj: diretor.cpf_cnpj,
            tipo_pessoa: 'PJ',
            nome_empresarial: diretor.nome_real || diretor.name,
            porcentagem_real: diretor.porcetagem_comissao,
            tipo_pagamento: 'pix'
        } as unknown as comissaoEnvolvidos;
        
        dadosDiretor.push(returnDados(dataDiretor, 'Gerente Geral', undefined));
    };


    let dadosRepasse: textTypes[][] = [];
    const dadosRoyalties: textTypes[][] = [returnDadosRepasse(imovelDataComissao?.dados_royalties, "Royalties") as textTypes[]];
    const dadosComunicacao: textTypes[][] = [returnDadosRepasse(imovelDataComissao?.dados_comunicacao, "Comunicação") as textTypes[]];

    if (imovelDataComissao?.dados_repasse && imovelDataComissao?.verificar_repasse === 'true') {
        dadosRepasse = [returnDadosRepasse(imovelDataComissao.dados_repasse, 'Repasse Franquia') as textTypes[]]
    };

    const dadosEmpresa = imovelDataComissao?.comissao_empresas.map((empresa, index) => {
        return [
            { text: 'Empresa', fontSize: 9, margin: [0, 15, 0, 2] as Margins, alignment: 'right', tocItem: true },
            { text: empresa.porcentagem_real + '%', fontSize: 9, margin: [0, 15, 0, 2] as Margins, alignment: 'center', tocItem: true },
            { text: formatoMoeda(empresa.desconto || ''), fontSize: 9, margin: [0, 15, 0, 2] as Margins, alignment: 'center', tocItem: true },
            { text: formatoMoeda(empresa.valor_real), fontSize: 9, margin: [0, 15, 0, 2] as Margins, alignment: 'center', tocItem: true },
            { text: empresa.nome_empresarial, fontSize: 9, margin: [0, 15, 0, 2] as Margins, alignment: 'center', tocItem: true },
            { text: empresa.cnpj, fontSize: 9, margin: [0, 15, 0, 2] as Margins, alignment: 'center', tocItem: true },
            { text: empresa.creci, fontSize: 9, margin: [0, 15, 0, 2] as Margins, alignment: 'center', tocItem: true },
            {
                text:
                    empresa.tipo_pagamento === 'pix'
                        ? 'PIX: ' + empresa.pix
                        : 'Banco: ' + empresa.nome_banco + ' Agência: ' + empresa.agencia + ' C/C: ' + empresa.numero_conta, fontSize: 9, margin: [0, 15, 0, 2], alignment: 'center', tocItem: true
            },
        ]
    });

    const details = [
        {
            text: 'Rio de Janeiro, ' + semana[d.getDay()] + ', ' + datas + ' de ' + mes[d.getMonth()] + ' de ' + ano + '',
            fontSize: 10,
            bold: false,
            margin: [0, 10, 0, 15] as Margins,
            tocItem: true
        },

        {
            text: 'Loja: ' + imovelData.comissao?.loja?.nome,
            fontSize: 10,
            bold: false,
            margin: [0, 0, 0, 0] as Margins,
            tocItem: true
        },

        {
            text: 'Data da Venda: ' + imovelData.informacao?.data_assinatura,
            fontSize: 10,
            bold: false,
            margin: [0, 5, 0, 0] as Margins,
            tocItem: true
        },

        {
            text: 'Referência: ' + imovelData.codigo,
            fontSize: 10,
            bold: false,
            margin: [0, 5, 0, 0] as Margins,
            tocItem: true
        },

        {
            text: 'Imóvel: ' + enderecoImovel,
            fontSize: 10,
            bold: false,
            margin: [0, 5, 0, 10] as Margins,
            tocItem: true
        },

        {
            text: 'Valor da Comissão: ' + formatoMoeda(imovelData.comissao?.valor_comissao_liquida),
            fontSize: 9,
            bold: false,
            margin: [0, 10, 0, 25] as Margins,
            tocItem: true
        },

        {
            table: {
                headerRows: 1,
                widths: [60, 55, 50, 60, 180, 85, 60, 150],
                body: [
                    [
                        { text: '', style: 'tableHeader', fontSize: 9, alignment: 'right', tocItem: true },
                        { text: 'Porcentagem', style: 'tableHeader', fontSize: 9, bold: true, alignment: 'center', tocItem: true },
                        { text: 'Descontos', style: 'tableHeader', fontSize: 9, bold: true, alignment: 'center', tocItem: true },
                        { text: 'A Receber', style: 'tableHeader', fontSize: 9, bold: true, alignment: 'center', tocItem: true },
                        { text: 'Nome Empresarial', style: 'tableHeader', fontSize: 9, bold: true, alignment: 'center', tocItem: true },
                        { text: 'CNPJ (MEI)/CPF', style: 'tableHeader', fontSize: 9, bold: true, alignment: 'center', tocItem: true },
                        { text: 'CRECI', style: 'tableHeader', fontSize: 9, bold: true, alignment: 'center', tocItem: true },
                        { text: 'Dados Bancários', style: 'tableHeader', fontSize: 9, bold: true, alignment: 'center', tocItem: true },
                    ],

                    ...dadosVendedor || [],
                    ...dadosOpcionista || [],
                    ...dadosGerente || [],
                    ...dadosGG || [],
                    ...dadosDiretor,
                    ...dadosRepasse,
                    ...dadosRoyalties,
                    ...dadosComunicacao,
                    ...dadosEmpresa || []
                ],
            },
            layout: 'headerLineOnly'
        }
    ];

    function Rodape(currentPage: { toString: () => any; }, pageCount: any) {
        return {
            margin: [20, 10, 20, 0] as Margins, //left, top, right, bottom
            table: {
                headerRows: 1,
                widths: [150, '*', 150],
                body: [
                    [
                        {
                            text: 'Atualizado em: ' + imovelData.comissao?.data_atualizacao,
                            fontSize: 9,
                            bold: false,
                            alignment: 'left',
                            tocItem: true
                        },
                        {
                            text: 'DNA Imóveis LTDA',
                            fontSize: 9,
                            bold: false,
                            alignment: 'center',
                            tocItem: true
                        },
                        {
                            text: `Página ${currentPage.toString()} de ${pageCount}`,
                            fontSize: 9,
                            alignment: 'right',
                            margin: [0, 0, 0, 10] as Margins,
                            tocItem: true
                        }
                    ]
                ]
            },
            layout: 'noBorders',
        }
    };

    const docDefinitions = {
        pageSize: 'A4' as "A4",
        pageMargins: [15, 50, 15, 40] as Margins,
        pageOrientation: "landscape" as "landscape",

        header: [reportTitle],
        content: [details],
        footer: Rodape
    };

    pdfMake.createPdf(docDefinitions).download('Planilha_de_Comissao_' + enderecoNomePDF + '.pdf');


}

export default DownloadPlanilha