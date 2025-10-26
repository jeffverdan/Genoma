import { ParcelaComissoesType, ComissaoIndividuoType } from '@/interfaces/Apoio/planilhas_comissao';
import axiosInstance from '../http/axiosInterceptorInstance';

interface PromiseType {
    'corretores_opcionistas'?: IndividualType
    'corretores_vendedores'?: IndividualType
    'gerentes'?: IndividualType
    'gerentes_gerais'?: IndividualType
    'diretores_gerais'?: IndividualType
    'repasse_franquias'?: IndividualType
};

type IndividualType = {
    array_relacao: ComissaoIndividuoType[]
}

export default async function saveParcelaComissao(props: ParcelaComissoesType): Promise<PromiseType | undefined> {
    let data
    await axiosInstance.post('salvar_parcela', {
        ...props
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    })
        .then(async res => {
            console.log("Result to save: ", res);
            data = res.data

        })
        .catch(err => {
            console.log("Error to save: ", err);
        })
    return data;
}