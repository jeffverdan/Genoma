import Pessoa from "../Users/userData";

type VendedorApiArr = {
    "id": number,
    "name": string,
    "email": string,
    // "email_verified_at": null,
    // "ddi": "55",
    // "telefone": string,
    // "created_at": "2022-10-10T19:40:16.000000Z",
    // "updated_at": "2025-03-26T19:35:49.000000Z",
    // "endereco": string | null,
    "cpf_cnpj": string,
    "rg": string | null,
    "estado_civil": "1" | "2" | "3" | "4",
    "data_nascimento": string,
    "nacionalidade": "Brasileiro",
    "tipo_pessoa": 0 | 1,
    "razao_social": string | null,
    "nome_fantasia": string | null,
    "nome_mae": string,
    "nome_pai": string | null,
    "profissao": string,
    "rg_expedido": string | null,
    "data_rg_expedido": string, // DD/MM/AAAA
    "cep": string,
    "bairro": string,
    "logradouro": string,
    "numero": string,
    "unidade": string | null,
    "complemento": string | null,
    "cidade": string,
    "estado": string,
    "registro_casamento": "1" | "2" | "3" | "4",
    "uniao_estavel": string | null,
    "conjuge": string | null,
    "genero": "M" | "F",
    // "pivot": {
    //   "processo_id": 336,
    //   "usuario_id": 399,
    //   "id": 933
    // }
    representante_socios: {
        data: any[]
    }
};

// type ItemListRecentsType = {
//     id: string | number
//     logradouro: string
//     numero: string | null
//     complemento: string | null
//     bairro: string
//     type: TypeComissionsCorretores
//     estado: string
//     unidade: string | null
//     url_imagens?: string
//     url_anuncio?: string
//     valor: string // SEM R$
//     data: string // DD/MM/AAAA
//     cod_imovel: string
//     valor_venda: string, // SEM R$
//     valor_anunciado: string, // SEM R$
//     data_assinatura: string, // DD/MM/AAAA
//     previsao_escritura: string, // DD/MM/AAAA
//     vendedores: VendedorApiArr[]
//     tipo_comissao: "partes" | "integral",
//     numero_parcela: string,
//     total_parcelas: number,

//     "dados_corretor": {
//         "name": string,
//         "cpf": string | null,
//         "creci": string | null,
//         "nome_empresa": string | null,
//         "cnpj": string | null,
//         "tipo_pessoa": 0 | 1
//     }

//     imovel_id?: number,
//     cidade?: string,
//     uf?: string,
//     tipo_imovel?: string,
//     data_criacao_midas?: string,
//     data_atualizacao?: string,
//     data_atualizacao_formato_banco?: string,
//     tipo_opcao?: string,
//     link_anuncio?: string,
//     link_imagem_miniatura?: string,
//     link_imagem_principal?: string,
//     status_midas?: string,
//     temperatura_calculada?: string
//     parcela_id?: number
//     documentos: {
//         data: {
//             arquivo: string,
//             id: number,
//             identifica_documento: string,
//             identifica_documento_id: string,
//             identificacao: string | null,
//             link: string | null ,
//             nome_original: string,
//             nome_tipo: string | null,
//             solicitacao_id: string | null,
//             tipo_documento_id: string | null,
//             tipo_documento: {
//                 id: number,
//                 documento_id: number,
//                 tipo_documento_id: number,
//                 processo_id: number,
//                 data_emissao: number | string | null,
//                 validade_dias: number | string | null,
//                 data_vencimento: number | string | null,
//                 nome: string
//             }
//         }[]
//     }
// };

type ItemListRecentsType = {
    id?: string | number
    logradouro: string
    numero?: string | null
    complemento?: string | null
    bairro?: string
    type?: TypeComissionsCorretores
    estado?: string
    unidade?: string | null
    url_imagens?: string
    url_anuncio?: string
    valor?: string // SEM R$
    data?: string // DD/MM/AAAA
    cod_imovel?: string
    valor_venda?: string, // SEM R$
    valor_anunciado?: string, // SEM R$
    data_assinatura?: string, // DD/MM/AAAA
    previsao_escritura?: string, // DD/MM/AAAA
    vendedores?: VendedorApiArr[]
    tipo_comissao?: "partes" | "integral",
    numero_parcela?: string,
    total_parcelas?: number,

    "dados_corretor"?: {
        "name": string,
        "cpf": string | null,
        "creci": string | null,
        "nome_empresa": string | null,
        "cnpj": string | null,
        "tipo_pessoa": 0 | 1
    }

    imovel_id?: number,
    cidade?: string,
    uf?: string,
    tipo_imovel?: string,
    data_criacao_midas?: string,
    data_atualizacao?: string,
    data_atualizacao_formato_banco?: string,
    tipo_opcao?: string,
    link_anuncio?: string,
    link_imagem_miniatura?: string,
    link_imagem_principal?: string,
    status_midas?: string,
    temperatura_calculada?: string
    parcela_id?: number
    documentos?: {
        data?: {
            arquivo: string,
            id: number,
            identifica_documento: string,
            identifica_documento_id: string,
            identificacao: string | null,
            link: string | null ,
            nome_original: string,
            nome_tipo: string | null,
            solicitacao_id: string | null,
            tipo_documento_id: string | null,
            tipo_documento: {
                id: number,
                documento_id: number,
                tipo_documento_id: number,
                processo_id: number,
                data_emissao: number | string | null,
                validade_dias: number | string | null,
                data_vencimento: number | string | null,
                nome: string
            }
        }[]
    }
    processo_id?: number,
    dia_pagamento?: string,
    valor_gg?: number | null,
    valor_gerente?: number | null,
    valor_parcela?: string | number | null,
    valor_corretor?: number | null,
    valor_opcionista?: number | null,
    valor_diretor?: number | null,
    soma?: number,
    status_parcela?: string,
    finance_status_id?: string,
    tipo_pessoa?: number | string | null,
    data_ordenacao_exibicao?: string // DD/MM/AAAA
    porcentagem_real_corretor?: string 
    porcentagem_real_gg?: string 
    porcentagem_real_gerente?: string 
    porcentagem_real_opcionista?: string 
    porcentagem_real_diretor?: string 
    porcentagem_comissao_corretor?: string
    porcentagem_comissao_gg?: string 
    porcentagem_comissao_gerente?: string 
    porcentagem_comissao_opcionista?: string 
    porcentagem_comissao_diretor?: string 
    soma_porcentagem?: number;
    valor_faltante?: number,
    valor_transferido?: number,
    porcentagem_faltante?: number, 
    
    parcelas?: {
        numero_parcela: string,
        total_parcelas: number,
        logradouro: string,
        numero: string,
        unidade: string | null,
        complemento: string | null,
        bairro: string,
        cidade: string,
        uf: string,
        parcela_id: number,
        valor_parcela: string,
        status_parcela: string,
        finance_status_id: string,
        data_ordenacao_exibicao: string,
        soma: number,
    }[],

    contas_receber?: {
        data: {
            id?: number,
            agencia?: string | number,
            banco_id?: number,
            numero_conta?: string,
            pix?: string,
            principal?: number,
            tipo_chave_pix_id?: number,
            nome_banco?: string,
            tipo_pagamento?: string,
            apelido?: string
            
        }[]
    },
    concorda_valor?: number,
    tipo_pagamento?: string,
};

type ListInvestimentoType = {
    opcao?: {
        imovel_id?: number,
        logradouro?: string,
        numero?: string,
        unidade?: string,
        complemento?: string,
        bairro?: string,
        cidade?: string,
        uf?: string,
        cod_imovel?: string,
        valor_anunciado?: string,
        tipo_imovel?: string,
        data_criacao_midas?: string,
        data_atualizacao?: string,
        data_atualizacao_formato_banco?: string,
        tipo_opcao?: string,
        link_anuncio?: string,
        link_imagem_miniatura?: string,
        link_imagem_principal?: string,
        status_midas?: string,
        temperatura_calculada?: string
    }
    sujestoes?: {
        logradouro?: string,
        numero?: string,
        unidade?: string,
        complemento?: string,
        bairro?: string,
        cidade?: string,
        uf?: string,
        valor_venda?: string,
        tipo_imovel?: string | null
    }[]
}[]

type listAndamentoType = {
    list: ItemListRecentsType[] | [],
    valorTotal: string | undefined
}

type TypeComissionsCorretores = 'liberado' | 'producao-anual' | "a-receber" | "sacado" | "concluidos" | "cancelados" | "andamento" | "transferencia" | "solicitado";

type TYPES_COMISSION_TYPE = [
    // { label: 'Produção', key: 'andamento' },
    // { label: 'Liberado', key: 'liberado' },
    // { label: 'Solicitado', key: 'solicitado' },
    // { label: 'Em transferência', key: 'transferencia' },
    // { label: 'Em andamento', key: 'andamento' },
    // { label: 'Concluídos', key: 'concluidos' },
    // { label: 'Cancelados', key: 'cancelados' },
    // { label: 'Cancelados', key: 'cancelados' },

    { id: 10, label: 'Liberado', key: 'liberado' },
    { id: 11, label: 'Solicitado', key: 'solicitado' },
    { id: 12, label: 'Em transferência', key: 'transferencia' },
    { id: 9, label: 'Em andamento', key: 'andamento' },
    // { id: 14, label: 'Concluídos', key: 'concluidos' },
    { id: 13, label: 'Concluído', key: 'concluidos' }, // ID 13 Transferido como Concluído
    { id: 16, label: 'Cancelado', key: 'cancelados' },
];


type InicialFooterTabType = { id: number, label: string, icon: JSX.Element, submenu?: boolean }

type QuestionsType = {
    pergunta: string
    resposta: string
}[]

type UrlsAnunciosType = {
    cod: string;
    url_anuncio?: string;
    urls_images?: string[];
}

type ReturnTypeOpcoes = {
    porcentagem_quente: string | null,
    porcentagem_morno: string | null,
    porcentagem_frio: string | null,
    
    valor_quente: string,
    valor_morno: string,
    valor_frio: string,

    soma_total: string,  
    quantidade_total: number
    quantidade_quente: number
    quantidade_morno: number
    quantidade_frio: number

    diferenca_vgv: number
};

type ValoresProducao = {
  id?: string | number;
  label?: string;
  status?: string;
  style?: string;
  valor?: string | number;
  qtd?: string | number;
  endereco?: {
    logradouro?: string;
    numero?: string | null;
    complemento?: string | null;
    bairro?: string | null;
    cidade?: string | null;
    uf?: string | null;
  }[]
}

export type { ItemListRecentsType, InicialFooterTabType, TypeComissionsCorretores, listAndamentoType, QuestionsType, UrlsAnunciosType, VendedorApiArr, TYPES_COMISSION_TYPE, ReturnTypeOpcoes, ListInvestimentoType, ValoresProducao }