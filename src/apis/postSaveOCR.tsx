import axiosInstance from '../http/axiosInterceptorInstance';

interface DataToSave {
    ocr: string
    tipo: "recibo" // IR ADICIONANDO OS OUTROS TIPOS CONFORME O USO
    processo_id: string
    nome: string
}

async function SaveOCR(props: DataToSave) {
    let data;

    await axiosInstance.post('salvar_ocr', {
        responsavel_alteracao_id: localStorage.getItem('usuario_id'),
        ...props,
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    })
        .then(res => {
            if (res.data.status && res.data.status === (401 || 498)) {
                localStorage.clear();
            } else {
                data = res.data;
            }
        })
        .catch(function (error) {
            console.log(error);
        })

    return data;
};

export default SaveOCR;