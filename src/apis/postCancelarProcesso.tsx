import Axios from 'axios';

async function postCancelarProcesso(processoId: number, usuarioId: string, dataCancelamento: string, observacao: string) {
    const token = localStorage.getItem('token');
    let data;

    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 +  'cancelar_processo', {
        "processo_id": processoId,
        'responsavel_alteracao_id': usuarioId,
        "data_cancelamento": dataCancelamento,
        "mensagem": observacao
    }, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => {
            if (res.data.status && res.data.status === (401 || 498)) {
                localStorage.clear();
                data = false;
            } else {
                //data = true;
                data = res.data;
            };
        })
        .catch((error) => {
            console.log(error);
        })

    return data;
};

export default postCancelarProcesso;