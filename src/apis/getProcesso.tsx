import axiosInstance from '../http/axiosInterceptorInstance';
import { Laudemios, LaudemiosListItem } from '@/interfaces/Imovel/laudemiosType'
import GetLaudemiosList from './getLaudemiosList';
import userInterface from '@/interfaces/Users/userData';
import { historicoProcesso } from '@/interfaces/Imovel/historicoProcesso';
import { NextRouter } from 'next/router';
import { comissaoEnvolvidos } from '@/interfaces/Imovel/comissao';
import ImovelData from '@/interfaces/Imovel/imovelData';
import { ItemsCorrecoes, SelectType } from '@/interfaces/PosVenda/Devolucao';
import Pessoa from '@/interfaces/Users/userData';

const tiposLaudemios = [
    { name: 'União', id: '1', label: 'RIP' },
    { name: 'Prefeitura', id: '2', label: '' },
    { name: 'Família', id: '3', label: 'Nome' },
    { name: 'Igreja', id: '4', label: 'Nome' },
];

const tipoRegimeCasamento = [
    { "id": '1', name: "Separação total de bens", },
    { "id": '2', name: "Separação parcial de bens", },
    { "id": '3', name: "Separação legal de bens", },
    { "id": '4', name: "Comunhão de bens", },
    { "id": '5', name: "Comunhão parcial de bens", },
];

const dadosFaltandoPessoas = (pessoa: userInterface) => {
    pessoa.genero_label = pessoa.genero === "M" ? "Masculino" : pessoa.genero === "F" ? "Feminino" : '';
    pessoa.registro_casamento_label = tipoRegimeCasamento.find((e) => e.id === pessoa.registro_casamento)?.name || '';
    return pessoa;
};

const returnPagamento = (liquida?: string) => {
    switch (liquida) {
        case 'especie':
            return 'Espécie'
        case 'deposito':
            return 'Depósito'
        case 'ted_doc':
            return 'TED/DOC'
        case 'pix':
            return 'PIX'
        case 'cheque':
            return 'Cheque/Cheque adm.'
    };
};

const returnLaudoOpc = (liquida?: string) => {
    switch (liquida) {
        case 'simples':
            return 'Simples'
        case 'com_chave':
            return 'Com chave'
        case 'exclusividade':
            return 'Exclusividade'
        case 'lançamento':
            return 'Lançamentos'
        default:
            return
    };
};

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

type EnvolvidosType = {
    vendedor_pf: Pessoa[]
    vendedor_pj: Pessoa[]
    comprador_pj: Pessoa[]
    comprador_pf: Pessoa[]
}

async function GetProcesso(idProcesso: string, router?: NextRouter) {
    let data: any
    const url_atual = typeof window !== 'undefined' ? window.location.href : '';
    await axiosInstance.post('retorna_processo', {
        'processo_id': idProcesso,
        'usuario_logado': localStorage.getItem('usuario_id'),
        'url_atual': url_atual
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    })
        .then(async res => {
            data = {
                ...res.data,
                vagas: res.data?.informacao?.vaga,
                devolucoes: {
                    ...res.data.devolucoes,
                    imovel: {},
                    recibo: {},
                    vendedor_pf: { reviews: [] },
                    vendedor_pj: { reviews: [] },
                    comprador_pf: { reviews: [] },
                    comprador_pj: { reviews: [] },
                    incompleto: {}
                }
            }

            if (data?.status === false) {
                if (data?.msg === 'GG do processo' && router) {
                    router.push('/vendas/detalhes-venda/' + idProcesso);
                }
                else {
                    // router.push('/403')
                }
            }
            else {
                const list = await GetLaudemiosList() as any;

                if (!!list[0]) {
                    data?.laudemios?.forEach((laudemio: Laudemios) => {
                        laudemio.valorName = list.find((item: LaudemiosListItem) => item.id === Number(laudemio.valor_laudemio))?.nome || laudemio.valor_laudemio
                        laudemio.nameTipo = tiposLaudemios.find((item) => item.id === laudemio.tipo_laudemio)?.name || ''
                        laudemio.labelTipo = tiposLaudemios.find((item) => item.id === laudemio.tipo_laudemio)?.label || ''
                    })
                    data.vendedores.forEach((vendedor: userInterface) => {
                        vendedor.representante_socios?.data.forEach((rep) => dadosFaltandoPessoas(rep))
                        vendedor = dadosFaltandoPessoas(vendedor);
                    });
                    data.compradores.forEach((comprador: userInterface) => {
                        comprador.representante_socios?.data.forEach((rep) => dadosFaltandoPessoas(rep))
                        comprador = dadosFaltandoPessoas(comprador);
                    });
                    
                    // data.gerente.forEach((gerente: userInterface) => {
                    //     // gerente.representante_socios?.data.forEach((rep) => dadosFaltandoPessoas(rep))
                    //     gerente = dadosFaltandoPessoas(gerente)
                    // });

                };

                data.historico_processo.forEach((history: historicoProcesso) => {
                    if (history.documento_id && history.papel) {
                        history.tag = history.identifica_documento === 'imóvel' ? 'Imóvel' : history.identifica_documento === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'
                    } else if (history.documento_id && history.identifica_documento) {
                        history.tag = history.identifica_documento === 'imóvel' ? 'Imóvel' : 'Comissão'
                    } else if (history.status) {
                        history.tag = "Status"
                    }
                });

                if (data.comissao?.liquida) {
                    data.comissao.forma_pagamento = returnPagamento(data.comissao.liquida);
                    data.comissao.tipo = data.comissao?.comissao === 'partes' ? 'Parcelada' : 'Integral';
                    data.comissao?.corretores_opicionistas_comissao.forEach((opc: comissaoEnvolvidos) => {
                        opc.tipo_laudo_opcionista_label = returnLaudoOpc(opc?.tipo_laudo_opcionista);
                    })
                }
            }

            if (data.devolucoes) {
                const envolvidos: EnvolvidosType = {
                    vendedor_pf: [],
                    comprador_pf: [],
                    vendedor_pj: [],
                    comprador_pj: [],
                };

                res.data.vendedores.forEach((e: Pessoa) => {
                    if (e.tipo_pessoa === 1) {
                        envolvidos.vendedor_pj.push(e);
                        e.representante_socios?.data.forEach(rep => envolvidos.vendedor_pj.push(rep));
                    } else {
                        envolvidos.vendedor_pf.push(e);
                    }
                });
                res.data.compradores.forEach((e: Pessoa) => {
                    if (e.tipo_pessoa === 1) {
                        envolvidos.comprador_pj.push(e);
                        e.representante_socios?.data.forEach(rep => envolvidos.comprador_pj.push(rep));
                    } else {
                        envolvidos.comprador_pf.push(e);
                    }
                });

                console.log("Pessoas envolvidas: ", envolvidos);
                

                const arrPessoas = ['vendedor', 'comprador'];
                const arrPF_PJ = [
                    { label: 'Pessoa Física', path: '_pf' },
                    { label: 'Pessoa Jurídica', path: '_pj' },
                    { label: 'Representante', path: '_pj' },
                ];

                res.data.devolucoes?.tipo_devolucao?.data.forEach((review: ReviewApiType) => {
                    arrPessoas.forEach(tipoPessoa => {
                        arrPF_PJ.forEach(pf_pj => {
                            if (review.tipo_pessoa === tipoPessoa && review.tipo === pf_pj.label) {
                                const type: Keys = (tipoPessoa + pf_pj.path) as Keys;
                                data.devolucoes[type]?.reviews?.some((e: SelectType) => e.id === review.pf_pj_id) ?
                                    data.devolucoes[type]?.reviews?.forEach((vendedor: SelectType) => {
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
                                    data.devolucoes[type]?.reviews?.push({
                                        id: review.pf_pj_id,
                                        nome: envolvidos[type].find(e => e.id === review.pf_pj_id)?.name || envolvidos[type].find(e => e.id === review.pf_pj_id)?.nome_fantasia,
                                        nome_empresa: pf_pj.label === "Representante" ? envolvidos[type].find(e => e.id === review.pf_pj_id)?.vinculo_empresa?.nome_fantasia : '',
                                        representante: envolvidos[type].find(e => e.id === review.pf_pj_id)?.pj_representante === 1,
                                        socio: envolvidos[type].find(e => e.id === review.pf_pj_id)?.pj_socio === 1,
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
                
                data.devolucoes.imovel = {
                    obs: res.data.devolucoes?.valores_documentos_imovel_observacao,
                    reviewChecks: res.data.devolucoes?.tipo_devolucao?.data.filter(((e: any) => e.tipo === 'Imóvel')).map((review: ReviewApiType) => ({
                        id: review.id,
                        nome: review.nome,
                        tipo: review.tipo,
                        saved: review.check_gerente === 1,
                        id_correcao: review.id_correcao
                    }))
                };

                data.devolucoes.recibo = {
                    obs: res.data.devolucoes?.recibo_sinal_observacao,
                    reviewChecks: res.data.devolucoes?.tipo_devolucao?.data.filter(((e: any) => e.tipo === 'Correções do recibo de sinal')).map((review: ReviewApiType) => ({
                        id: review.id,
                        nome: review.nome,
                        tipo: review.tipo,
                        saved: review.check_gerente === 1,
                        id_correcao: review.id_correcao
                    }))
                };
                data.devolucoes.vendedor_pf = {
                    ...data.devolucoes.vendedor_pf,
                    obs: res.data.devolucoes?.vendedores_observacao,                    
                };
                data.devolucoes.vendedor_pj = {
                    ...data.devolucoes.vendedor_pj,
                    obs: res.data.devolucoes?.vendedores_juridicos_observacao,
                    data: res.data.vendedores.filter((e: Pessoa) => e.tipo_pessoa === 1)
                };
                data.devolucoes.comprador_pf = {
                    ...data.devolucoes.comprador_pf,
                    obs: res.data.devolucoes?.compradores_observacao
                };
                data.devolucoes.comprador_pj = {
                    ...data.devolucoes.comprador_pj,
                    obs: res.data.devolucoes?.compradores_juridicos_observacao,
                    data: res.data.compradores.filter((e: Pessoa) => e.tipo_pessoa === 1)
                };
                data.devolucoes.incompleto = {
                    vendedor: res.data.devolucoes?.cadastro_incompleto_vendedor === 1,
                    comprador: res.data.devolucoes?.cadastro_incompleto_comprador === 1,
                    obs: res.data.devolucoes?.cadastro_incompleto_observacao,
                };
            }


            console.log("Retorna Processo ", data);
        })
        .catch(err => {
            console.log(err);
            // router.push('/403')
        })
    return data;
}

export default GetProcesso;