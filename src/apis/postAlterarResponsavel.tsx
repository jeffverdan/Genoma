import Axios from 'axios';

async function postAlterarResponsavel(idProcesso: number, idResponsavel: string) {
    let data;

    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'alterar_responsavel', {
        id_responsavel: idResponsavel,
        processo_id: idProcesso,
    }, {
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

export default postAlterarResponsavel;