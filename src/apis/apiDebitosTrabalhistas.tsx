import Axios from 'axios';

interface Props {
    cpf?: string 
    cnpj?: string
}

interface Respose {
    status: string // 'sucess' | 'error'
    base64?: string // Base64
    debito?: true | false
    texto?: string
    validade?: string // DD/MM/AAAA
    nome?: string
    error?: string | undefined
  }

async function getDebitosTrabalhistas(props: Props): Promise<Respose> {
    if(!props.cpf && !props.cnpj) { return { status: 'error', error: 'CPF ou CNPJ não informado' } }
    let data = { status: 'error', error: 'Certidão não encontrada' };

    // const link = 'api-efiteutica-node20-br-fwcybhbbhwf6gphx.brazilsouth-01.azurewebsites.net'

    await Axios.post('https://api-deb-trabalhista-node20-br-d3h5chg3gbe6adbm.canadacentral-01.azurewebsites.net/certidao', props)
        .then(res => {
            // if(!!res?.data?.certidao_Base64) {
            //     const pdfBase64 = res.data.base64;
            //     const byteArray = Buffer.from(pdfBase64, 'base64');
            //     res.data.base64 = byteArray;
            // }
            data = res.data;
            console.log("Status Debito Trabalhista: ", res?.data?.status);
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

export default getDebitosTrabalhistas;