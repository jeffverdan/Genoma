import Axios from 'axios';

async function postEditarNota(id: number, idProcesso: number, titulo: string, descricao: string, importante: boolean) {
    let data;
    const responsavelId = localStorage.getItem('usuario_id');

    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'editar_nota/' + id, {
        id: id,
        responsavel_id: responsavelId,
        processo_id: idProcesso,
        titulo: titulo,
        descricao: descricao,
        importante: importante
    }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => {
            data = res.data;
            console.log('RETORNO :', res);               
            
        })
        .catch(err => {
            console.log(err);
        })    
    return data;
}

export default postEditarNota;