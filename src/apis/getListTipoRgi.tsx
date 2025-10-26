import Axios from 'axios';

async function GetListTipoRgi() {
    let data;
    const error = 'Erro ao retornar o processo';
    await Axios.get(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'listar_tipo_rgi', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res => {            
            data = res.data;
        })
        .catch(err => {
            console.log(error);
        })
    return data;
}

export default GetListTipoRgi;