import axiosInstance from '../http/axiosInterceptorInstance';

async function GetAllList() {
    let data;
    const error = 'Erro ao retornar listas';
    await axiosInstance.get('exibir_listas', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res => {
            data = res.data;
            // console.log("Laudemios List ",data);
        })
        .catch(err => {
            console.log(error);
        })
    return data;
}

export default GetAllList;