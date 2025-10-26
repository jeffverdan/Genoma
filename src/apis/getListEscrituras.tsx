import Axios from 'axios';

async function GetListEscrituras() {
    let data;
    const error = 'Erro ao retornar o processo';
    await Axios.get(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'tipos_escrituras', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res => {
            console.log(res);
            data = res.data;
            console.log(data);
        })
        .catch(err => {
            console.log(error);
        })
    return data;
}

export default GetListEscrituras;