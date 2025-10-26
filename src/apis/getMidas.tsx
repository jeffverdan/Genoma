import Axios, {AxiosRequestConfig } from 'axios';

interface MidasProps {
    value: string;
}

interface AxiosConfig extends AxiosRequestConfig {
    mode?: string;
    crossdomain?: boolean;
    headers?: Record<string, string>;
}

async function getMidas(value: string) {
    const params: MidasProps = {
        value: value
    }

    const config: AxiosConfig = {
        mode: 'cors', // Define o modo da requisição como 'cors'
        crossdomain: true, // Permite requisições cross-domain
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            //'Authorization': 'Bearer your_token_here' // Define um cabeçalho de autorização, se necessário
        }
    };

    let data;
    const error = 'Mídas não retornou nenhum imóvel com esse código';
    
    await Axios.post('https://infoideias.net/servicos/portal/pesquisa_imovel_dna/lead/288', 
        { "referencia_dna": params.value, "token_dna": "XYZ2022" },    
        config)
        .then(res => {
            data = res.data
        })
        .catch(err => {
            //console.log(err);
            console.log(error);
        })
    return data;
}

export default getMidas;