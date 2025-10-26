import Axios from 'axios';

async function postEsqueciSenha(email: string) {
    let data;

    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API + 'enviaremailsenha', {
        email: email,
        genoma: true,
        
    })
        .then(res => {
            data = res.data;            
        })
        .catch(err => {
            console.log(err);
        })    
    return data;
}

export default postEsqueciSenha;