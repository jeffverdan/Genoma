import Axios from 'axios';

async function postSaveFeedBackEscritura(feedBack: any) {
    let data;
    const responsavelId = localStorage.getItem('usuario_id');

    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'salvar_respostas_gerente', feedBack, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => {
            data = res.data;           
        })
        .catch(err => {
            console.log(err);
        })    
    return data;
}

export default postSaveFeedBackEscritura;