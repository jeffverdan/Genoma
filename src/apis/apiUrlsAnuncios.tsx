import Axios from 'axios';

interface Props {
  "cod": string,
}

interface Respose {
  url_anuncio: string,
  urls: string[],
}

async function apiUrlsAnuncios(props: Props): Promise<Respose | undefined> {
  let data;

  await Axios.post('https://dnaimoveis-api-d0f3cbdnctfvb9da.canadacentral-01.azurewebsites.net/image-cod', props)
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

export default apiUrlsAnuncios;