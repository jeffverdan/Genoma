import Axios from 'axios';

async function postRascunhoDownload(imovelId: number, processoId: number, usuarioId: string) {
    let data;
    let dados = {
        imovel_id: imovelId,
        processo_id: processoId,
        usuario_id: usuarioId
    }
    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'salvar_status_rascunho_download_genoma', dados, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => {
            data = res.data;
            console.log('Fez download do rascunho')
            console.log(res);                
        })
        .catch(err => {
            console.log(err);
        })    
    return data;
}

export default postRascunhoDownload;