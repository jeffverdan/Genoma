import axiosInstance from '../http/axiosInterceptorInstance';

interface PropsType {
    mes: number
    ano: number
}

export type GraficoEscriturasType = {
    "responsavel_id": number,
    "nome_responsavel": string,
    "contador_escrituras": number
}

export type TimeLineStatusTableType = {
    "processo_id": number,
    "data_escritura": string,
    "responsavel_id": number,
    "nome_resposavel": string
    "nome_gerente": string
    "logradouro": string
    "numero": string
    "unidade": string | null,
    "complemento": string | null,
    "bairro": string
    "cidade": string
    "uf": string
    "forma_pagamento": string
    "todos_status": {
        "total_dias": number,
        "status": {
            "created_at": string,
            "nome_status": string,
            "diferenca_dias": number
        }[]
    }
}

export type ResGraficosEscriturasType = {
    grafico_linhas: GraficoEscriturasType[],
    linha_tempo_status: TimeLineStatusTableType[]
}

export default async function getGraficosEscrituras({ mes, ano }: PropsType) : Promise<ResGraficosEscriturasType | undefined>{
    let data;
    // const responsavelId = localStorage.getItem('usuario_id');

    await axiosInstance.post('dashboard_escrituras', {
        mes,
        ano
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }).then(res => {
        data = res.data;
        console.log('RETORNO dashboard_escrituras :', res);

    }).catch(err => {
        console.log(err);
    })
    return data;
}