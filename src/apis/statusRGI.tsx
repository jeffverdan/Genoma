import Axios from 'axios';

interface Props {
    "protocolo": string,
    "rgi": number
  }
async function getStatusRGI(props: Props) {
    let data;
    
    await Axios.post('https://apis-genoma.vercel.app/consulta-rgi', props )
        .then(res => {
            console.log(res);
            data = res.data;
            
        })
        .catch(err => {
            data = err;
            if (Axios.isAxiosError(err)) {
                console.error('Erro Axios:', err.message);
                console.error('Detalhes do Erro:', err.toJSON());
              } else {
                console.error('Erro:', err);
              }
        })    
    return data;
}

export default getStatusRGI;