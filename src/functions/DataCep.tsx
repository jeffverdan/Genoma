import Axios from 'axios'

async function DataCep(cep: any){    
    let value:any;

    await Axios.get('https://viacep.com.br/ws/' + cep + '/json/')
    .then(res => {
        console.log(res.data);
        value = res.data;
    })

    .catch(error => {
        console.log(error);
    })

    console.log('Seu CEP: ' , value);
    return value;
}

export default DataCep;