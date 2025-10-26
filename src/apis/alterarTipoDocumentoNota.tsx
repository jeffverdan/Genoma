import Axios from 'axios';

async function alterarTipoDocumentoNota(arrayData: any, /*recarregaDocs: () => Promise<void>*/) {
    const token = localStorage.getItem('token');
    let data;

    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'alterar_tipo_documento_nota', arrayData, {
        headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    })
        .then(res => {
        if (res.data.status && res.data.status === (401 || 498)) {
            localStorage.clear();
        } else {
            data = res.data;

            //recarregaDocs();
        }
        })
        .catch(function (error) {
            console.log(error);
        })

    return data;
};

export default alterarTipoDocumentoNota;