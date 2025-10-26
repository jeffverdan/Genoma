import { ApiReturnTopicType } from '@/interfaces/PosVenda/Analise';
import axiosInstance from '../http/axiosInterceptorInstance';

async function getSaveTopicos(idProcesso: string) {
    let data;
    const error = 'Erro ao retornar os Bancos';

    function capitalizeFirstWord(str: string | undefined): string {
        if (!str) return ""
        const words = str.toLowerCase().split(' ');
        const capitalizedWords = words.map(word => {
            if (word.length > 1) return word.charAt(0).toUpperCase() + word.slice(1)
            else return word.charAt(0) + word.slice(1)
        });
        return capitalizedWords.join(' ');
    };

    await axiosInstance.post('dados_salvos_topicos', {
        'processo_id': idProcesso
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }).then(res => {
        console.log(res);
        data = res.data as ApiReturnTopicType[];
        data?.forEach((e) => {
            e.processo_id = idProcesso;

            // SEPARO OS CAMPOS DE CADA TÓPICO
            if (e.topico_id === 1) {
                // AVERBAÇÃO
                const vendedores = [...new Set(e.data.map((e) => e.subtopico_id_vendedor) as number[])];
                e.quantAverbacao = vendedores.length;
                e.vendedoresAverbacao = vendedores?.map((id_vendedor) => ({
                    id: id_vendedor,
                    tipo: e.data.filter((filter) => id_vendedor === filter.subtopico_id_vendedor).map((vendedores) => ({
                        id_vinculo_tipo: vendedores.id,
                        id: vendedores.subtopico_id
                    }))
                }))
            } else if (e.topico_id === 2) {
                // ENTREGA DAS CHAVES
                e.id_vinculo_card = e.data[0].id;
                e.bancoResponsavel = e.data[0].banks_id;
                e.vendedorResponsavel = e.data[0].subtopico_id_vendedor;
                e.formPagamento = e.data[0].subtopico_id;
            } else if (e.topico_id === 3) {
                e.id_vinculo_card = e.data[0].id;
                e.obsLaudemios = e.data[0].observacao;
            } else if (e.topico_id === 4) {
                e.pendencia = e.data.map((e_taxa) => ({
                    id: e_taxa.subtopico_id,
                    id_vinculo_tipo: e_taxa.id
                }))
            } else if (e.topico_id === 5) {
                e.momentoReforco = e.data[0].subtopico_id.toString();
                e.observacaoReforco = e.data[0].observacao                
                e.id_vinculo_card = e.data[0].id
            } else if (e.topico_id === 6) {
                e.assuntoOutros = e.data[0].subtopico_id.toString();
                e.observacaoOutros = e.data[0].observacao                
                e.id_vinculo_card = e.data[0].id
            }
        })
        console.log(data);
    })
        .catch(err => {
            console.log(error);
        })
    return data;
}

export default getSaveTopicos;