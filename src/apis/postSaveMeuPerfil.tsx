import Axios from 'axios';

async function postSaveMeuPerfil(blockSave: any) {
    let data;

    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'salvar_dados_perfil', {
        ...blockSave
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

export default postSaveMeuPerfil;