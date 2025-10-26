import axiosInstance from '../http/axiosInterceptorInstance';

async function postValoresComissaoPorStatus(limite?: number, status?: number, dadosEndereco?: any, page?: number, tipo?: string) {
    let data;
    const usuarioId = localStorage.getItem('usuario_id') || '';
    const {logradouro, numero, unidade, complemento} = dadosEndereco
    const filtroOrdenacaoComissao = localStorage.getItem('filtro_ordenacao') || '';
    const objFiltroOrdenacaoComissao = filtroOrdenacaoComissao ? JSON.parse(filtroOrdenacaoComissao) : '';
    console.log(objFiltroOrdenacaoComissao)
    const paramsOrdenacaoComissao = objFiltroOrdenacaoComissao ? objFiltroOrdenacaoComissao.patch + '_' + objFiltroOrdenacaoComissao.id : '';
    
    await axiosInstance.post('comissao_por_status', 
        {
            'usuario_id': usuarioId,
            'grupo_status': 'Envolvido',
            'limite': limite,
            'status': status ? status : '',
            'logradouro': logradouro,
            'numero': numero,
            'unidade': unidade,
            'complemento': complemento,
            'filtro_ordenacao': status ? paramsOrdenacaoComissao : '',
            'page': page || 1,
            'tipo': tipo || ''
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }
    )
    .then(res => {
        if (res !== undefined) {
            if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
                localStorage.clear();
            } else {
                data = res.data;
            }
        }
    })   
    .catch(error => {
        console.log(error);
    })

    return data;
}
export default postValoresComissaoPorStatus