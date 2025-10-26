import Axios from 'axios';

async function SaveComissao(dataToSave: any) {
    let data;
    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'salvar_comissao_bloco', dataToSave, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => {
            data = res.data;
            console.log('RETORNO salvar_comissao_bloco :', res);               
            
        })
        .catch(err => {
            console.log(err);
        })    
    return data;
}

export default SaveComissao;