import Axios from 'axios';

interface Props {
  "inscricao": string,
  "municipio": string
}

async function getFunesbom(props: Props) {
  let data;

  await Axios.post('https://api-funesbom.vercel.app/get-certidao', props)
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

export default getFunesbom;