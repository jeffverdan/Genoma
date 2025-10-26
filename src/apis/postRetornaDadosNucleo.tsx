import Axios from 'axios';

// servico_id
// processo_id
async function PostRetornaDadosNucleo(dataToSave: any) {
    let data;
    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'retorna_dados_nucleo', dataToSave, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => {
            data = res.data;
            console.log('RETORNO retorna_dados_nucleo :', res);               
            
        })
        .catch(err => {
            console.log(err);
        })    
    return data;
}

export default PostRetornaDadosNucleo;