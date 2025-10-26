// import Axios from 'axios';
import { DataRows } from '@/interfaces/Apoio/tabelas';
import axiosInstance from '../http/axiosInterceptorInstance';
import { FiltersToolbar, FiltersType } from '@/components/Filters/interfaces';

interface RequestParamsType {
    envio_planilha: number,
    page: number,
    filtro_endereco: string,
    filtro_numero: string,
    filters: FiltersToolbar
    // loja_id: FiltersType[],
    selectOrder: { patch: string, id: number }
}

type apiDataType = {
    "processo_id": number,
    "logradouro": string,
    "uf": string,
    "cidade": string,
    "numero": string,
    "unidade": string | null,
    "complemento": null | string,
    "bairro": string,
    "data_assinatura": string,
    "data_entrada": string,
    "hora_entrada": string,
    "loja_name": string,
    "valor_comissao": string,
    "valor_venda": string,
    "gerente_id": number,
    "gerente_name": string,
    "pos_venda_id": number,
    "pos_venda_name": string,
    "tipo_venda": 'Integral' | 'Parcelado' | 'Não cadastrado',
    "status_visualizacao_atual": 0 | 1,
    "status_atual_id": number,
    "status_atual": string
}

type ResponseType = {
    "current_page": number,
    "data": DataRows[]
    "from": number,
    "last_page": number,
    "per_page": number,
    "to": number,
    "total": number
}

// ARRAY DE FILTROS
const arrParams = ['filtro_gerente', 'filtro_responsavel', 'filtro_loja', 'filtro_tipo_venda'] as const

export default async function listaApoio(data: RequestParamsType): Promise<undefined | ResponseType> {
    const { envio_planilha, page, filtro_endereco, filtro_numero, filters, selectOrder } = data;
    const token = localStorage.getItem('token');
    let result;
    
    let arrayData = new FormData();

    arrayData.append('envio_planilha', envio_planilha.toString());
    arrayData.append('page', page.toString());

    arrParams.forEach((key) => {
        filters[key]?.forEach((item, index) => arrayData.append(`${key}[${index}]`, item.id.toString()));
    });
    arrayData.append('ordenacao', selectOrder?.patch ? `${selectOrder.patch}_${selectOrder.id}` : '');

    arrayData.append('filtro_endereco', filtro_endereco);
    arrayData.append('filtro_numero', filtro_numero);
    // arrayData.append('ordenacao', selectOrder?.patch ? `${selectOrder.patch}_${selectOrder.id}` : '');

    await axiosInstance.post('listagem_apoio', arrayData, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
        .then(res => {
            console.log(res.data.data);

            if (!!res.data?.data) {
                result = {
                    ...res.data,
                    data: res.data.data.map((e: apiDataType) => ({
                        ...e,
                        comissao_incompleta: e.tipo_venda === 'Não cadastrado'
                    }))
                }
            } else {
                // localStorage.clear();
                //recarregaDocs();
            }
        })
        .catch(function (error) {
            console.log(error);
        })
    return result;
};