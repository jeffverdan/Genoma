import { DataToSaveType, ItemsCorrecoes } from '@/interfaces/PosVenda/Devolucao';
import axiosInstance from '../http/axiosInterceptorInstance';

type ReviewApiType = {
    id: number,
    nome: string
    pf_pj_id: number
    tipo: "Imóvel" | "Pessoa Jurídica" | "Pessoa Física" | "Representante" | "Correções do recibo de sinal"
    tipo_pessoa: "vendedor" | "comprador"
    check_gerente: 0 | 1
    id_correcao: number
}

type Keys = 'vendedor_pf' | 'vendedor_pj' | 'comprador_pj' | 'comprador_pf';

async function ReturnDataRevisaoPos(id: number) {
    let data: DataToSaveType = {
        imovel: {},
        recibo: {},
        vendedor_pf: { reviews: [] },
        vendedor_pj: { reviews: [] },
        comprador_pf: { reviews: [] },
        comprador_pj: { reviews: [] },
        // incompleto: {}
    }

    await axiosInstance.post('exibir_devolucao', {
        'progress_status_progresses_id': id
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }).then(res => {

        const arrPessoas = ['vendedor', 'comprador'];
        const arrPF_PJ = [
            { label: 'Pessoa Física', path: '_pf' },
            { label: 'Pessoa Jurídica', path: '_pj' },
            { label: 'Representante', path: '_pj' },
        ];

        res.data.tipo_devolucao.data.forEach((review: ReviewApiType) => {
            arrPessoas.forEach(tipoPessoa => {
                arrPF_PJ.forEach(pf_pj => {
                    if (review.tipo_pessoa === tipoPessoa && review.tipo === pf_pj.label) {
                        const type: Keys = (tipoPessoa + pf_pj.path) as Keys;
                        data[type].reviews?.some((e) => e.id === review.pf_pj_id) ?
                            data[type].reviews?.forEach((vendedor) => {
                                if (vendedor.id === review.pf_pj_id) {
                                    vendedor.reviewChecks?.push({
                                        id: review.id,
                                        nome: review.nome,
                                        tipo: review.tipo,
                                        saved: review.check_gerente === 1,
                                        id_correcao: review.id_correcao
                                    })
                                }
                            })
                            :
                            data[type].reviews?.push({
                                id: review.pf_pj_id,
                                reviewChecks: [{
                                    id: review.id,
                                    nome: review.nome,
                                    tipo: review.tipo,
                                    saved: review.check_gerente === 1,
                                    id_correcao: review.id_correcao
                                }]

                            });
                    }
                })
            })
        });

        data.imovel = {
            obs: res.data.valores_documentos_imovel_observacao,
            reviewChecks: res.data.tipo_devolucao.data.filter(((e: any) => e.tipo === 'Imóvel'))
        };
        data.recibo = {
            obs: res.data.recibo_sinal_observacao,
            reviewChecks: res.data.tipo_devolucao.data.filter(((e: any) => e.tipo === 'Correções do recibo de sinal'))
        };
        data.vendedor_pf = {
            ...data.vendedor_pf,
            obs: res.data.vendedores_observacao
        };
        data.vendedor_pj = {
            ...data.vendedor_pj,
            obs: res.data.vendedores_juridicos_observacao
        };
        data.comprador_pf = {
            ...data.comprador_pf,
            obs: res.data.compradores_observacao
        };
        data.comprador_pj = {
            ...data.comprador_pj,
            obs: res.data.compradores_juridicos_observacao
        };
        // data.incompleto = {
        //     vendedor: res.data.cadastro_incompleto_vendedor === 1,
        //     comprador: res.data.cadastro_incompleto_comprador === 1,
        //     obs: res.data.cadastro_incompleto_observacao,
        // };
        console.log(data);

    })
        .catch(err => {
            console.log(err);
        })
    return data;
}

export default ReturnDataRevisaoPos;