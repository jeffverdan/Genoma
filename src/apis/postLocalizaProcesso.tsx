import Pessoa from '@/interfaces/Users/userData';
import axiosInstance from '../http/axiosInterceptorInstance';
import { tratamentoApiMapaPrioridades } from '@/functions/returnDeadLines';

type ListStatusType = {
    id: string | number
    status: string
}

async function PostLocalizaProcesso(idProcesso: any) {
    let data;
    
    await axiosInstance.post('localizar_processo', {
            'processo_id': idProcesso
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res => {
            const vendedor_pj: Pessoa[] = [];
            const comprador_pj: Pessoa[] = [];

            res?.data?.processo?.imovel?.vendedores?.data?.forEach((e: Pessoa) => {
                if(e.tipo_pessoa === 1) {
                    vendedor_pj.push(e);
                    e.representante_socios?.data.forEach(rep => vendedor_pj.push(rep));
                }
            }),

            res?.data?.processo?.imovel?.compradores?.data?.forEach((e: Pessoa) => {
                if(e.tipo_pessoa === 1) {
                    comprador_pj.push(e);
                    e.representante_socios?.data.forEach(rep => comprador_pj.push(rep));
                }
            }),
            data = {
                ...res?.data?.processo, 
                mapa_prioridades: tratamentoApiMapaPrioridades(res?.data?.mapa_prioridades),
                lista_status: res.data.lista_status.map((item: any) => ({
                    id: item.id, label: item.status
                })),
                vendedores: [...res?.data?.processo?.imovel?.vendedores?.data ],
                compradores: [ ...res?.data?.processo?.imovel?.compradores?.data],
                vendedores_pf: res?.data?.processo?.imovel?.vendedores?.data?.filter((e: Pessoa) => e.tipo_pessoa === 0),
                vendedores_pj: vendedor_pj,
                compradores_pf: res?.data?.processo?.imovel?.compradores?.data?.filter((e: Pessoa) => e.tipo_pessoa === 0),
                compradores_pj: comprador_pj,
                status_devolucao_id: res?.data?.processo?.status?.data?.[0].id === 22 
                    ? res?.data?.processo?.status?.data?.[0]?.status_relacao_processo_id
                    : undefined,
                solicitacao_nucleo: res?.data?.solicitação_nucleo?.data
                
            };

        })
        .catch(err => {
            console.log(err);
        })
    return data;
}

export default PostLocalizaProcesso;