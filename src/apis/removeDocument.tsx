import Axios from 'axios';

async function removeDocument(document_id?: number, recibo?: boolean, pessoa?: string) {
    const token = localStorage.getItem('token');
    let data;

    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 +  'deletar_documento', {
        "documento_id": document_id,
        recibo,
        "papel": pessoa,
        "usuario_id": localStorage.getItem('usuario_id')
    }, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => {
            if (res.data.status && res.data.status === (401 || 498)) {
                localStorage.clear();
                data = false;
            } else {
                //data = true;
                data = res.data;
            };
        })
        .catch((error) => {
            console.log(error);
        })

    return data;
};

export default removeDocument;