import Axios from 'axios';

interface Props {
    "inscricao": string
}

interface Respose {
    certidao_Base64: string,
    response: string
}

async function getEfiteutica(props: Props): Promise<Respose | any> {
    let data;

    // const link = 'api-efiteutica-node20-br-fwcybhbbhwf6gphx.brazilsouth-01.azurewebsites.net'

    await Axios.post('https://api-efiteutica-node20-br-fwcybhbbhwf6gphx.brazilsouth-01.azurewebsites.net/get-certidao', props)
        .then(res => {
            if(!!res?.data?.certidao_Base64) {
                const pdfBase64 = res.data.certidao_Base64;
                const byteArray = Buffer.from(pdfBase64, 'base64');
                res.data.certidao_Base64 = byteArray;
            }
            data = res.data;
            console.log("Status Efiteutica: ", res?.data?.response);
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

export default getEfiteutica;