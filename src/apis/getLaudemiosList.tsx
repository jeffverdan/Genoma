import axiosInstance from '../http/axiosInterceptorInstance';

async function GetLaudemiosList() {
    let data;
    const error = 'Erro ao retornar os laudemios';
    await axiosInstance.get('listlaudemio', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res => {
            data = res.data.data;
            // console.log("Laudemios List ",data);
        })
        .catch(err => {
            console.log(error);
        })
    return data;
}

export default GetLaudemiosList;