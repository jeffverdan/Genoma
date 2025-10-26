import Axios from 'axios';

async function postDeletarCardAnalise(cardId: number) {
    let data;
    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'deletar_card_analise', {
        card_id: cardId
    }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => {
            data = res.data;
            console.log('RETORNO :', res); //
            
        })
        .catch(err => {
            console.log(err);
        })    
    return data;
}

export default postDeletarCardAnalise;