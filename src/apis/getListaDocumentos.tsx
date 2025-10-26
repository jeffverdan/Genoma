import axiosInstance from '../http/axiosInterceptorInstance';

async function GetListaDocumentos() {
    let data;
    const error = 'Erro ao retornar os laudemios';
    await axiosInstance.get('tipodocumentos', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res => {            
            data = res.data.data;
            console.log("GetListdocumentosdata ", data);
        })
        .catch(err => {
            console.log(error);
        })
    return data;
}

export default GetListaDocumentos;