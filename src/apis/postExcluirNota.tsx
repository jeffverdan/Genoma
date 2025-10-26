import Axios from 'axios';

async function postExcluirNota(id: number) {
    let data;
    const responsavelId = localStorage.getItem('usuario_id');

    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'excluir_nota', {
        id: id
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

export default postExcluirNota;