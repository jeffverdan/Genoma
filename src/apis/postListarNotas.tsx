import Axios from 'axios';

async function postListarNotas(idProcesso: number) {
    let data;
    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'listar_notas', {
        processo_id: idProcesso
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

export default postListarNotas;