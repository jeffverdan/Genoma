import Axios from 'axios';

interface Props {
    pacote: number
    cpfcnpj: string
}

interface Respose {
    "status": 1 | 0
    "cpf": string,
    "nome": string,
    "nascimento": string,
    "mae": string,
    "genero": "M" | "F",
    "situacaoComprovante": string,
    "pacoteUsado": number,
    "saldo": number,
    "consultaID": string,
    "delay": number
    erro?: string
    erroCodigo: number
}

async function getCPF(props: Props): Promise<Respose | undefined> {
    const { pacote, cpfcnpj } = props;
    const token = process.env.NEXT_PUBLIC_API_CPF_TOKEN;
    // const tokenDev = process.env.NEXT_PUBLIC_API_CPF_TOKEN_DEV;
    let data;
    
    // Remove traços e pontos do CPF
    const resizeBy = cpfcnpj.replace(/[^\d]/g, '');

    await Axios.get(`https://api.cpfcnpj.com.br/${token}/${pacote}/${resizeBy}`)
        .then(res => {      
            if(res.data) data = res.data;            
        })
        .catch(err => {
            data = err;
            if (Axios.isAxiosError(err)) {
                console.error('Erro CPF:', err.message);
                console.error('Detalhes do Erro:', err.toJSON());
            } else {
                console.error('Erro CPF:', err);
            }
        })
    return data;
}

export default getCPF;