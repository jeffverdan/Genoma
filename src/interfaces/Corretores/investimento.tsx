type TabsInvestimentoType = {
    // { label: 'VGV', value: 0, color: '#FFB74D', chipColor: 'yellow', icon: undefined, opcoes: 0, valor_total: '' },
    label: "VGV" | "Carteira" | "Frio" | "Morno" | "Quente";
    value: number;
    color: string;
    chipColor: 'yellow' | 'purple' | 'neutral' | 'red';
    icon?: JSX.Element;
    opcoes: number;
    valor_total: string;
    list: ListInvestimentoType[] | [];
}

type ListInvestimentoType = {    
        imovel_id: number;
        logradouro: string;
        numero: string;
        unidade: string;
        complemento: string;
        bairro: string;
        cidade: string;
        uf: string;
        cod_imovel: string;
        valor_anunciado: string;
        tipo_imovel: string;
        data_criacao_midas: string;
        data_atualizacao: string;
        data_atualizacao_formato_banco: string;
        tipo_opcao: string;
        link_anuncio: string;
        link_imagem_miniatura: string;
        link_imagem_principal: string;
        status_midas: string;
        temperatura_calculada: "frio" | "morno" | "quente" | "vgv";
}

type KeyInvestimentoType = "frio" | "morno" | "quente";

export type { TabsInvestimentoType, ListInvestimentoType, KeyInvestimentoType }