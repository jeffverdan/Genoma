import Axios from 'axios';

async function PostSalvarHistoricoSolicitacao(dataToSave: any) {
    let data;
    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'salvar_historico_solicitacao', dataToSave, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => {
            data = res.data;
            console.log('RETORNO salvar_historico_solicitacao :', res);               
            
        })
        .catch(err => {
            console.log(err);
        })    
    return data;
}

export default PostSalvarHistoricoSolicitacao;