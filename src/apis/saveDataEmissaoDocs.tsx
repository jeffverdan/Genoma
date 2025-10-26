import axiosInstance from '../http/axiosInterceptorInstance';

type progress = {
    percent: number
    status: string
}

interface Props {
    data_emissao?: string,
    data_vencimento?: string,
    multiplo_documento_id: string | number,
    validade_dias?: string,
    // setProgressBar: (prevState: [progress]) => void
}

async function SaveDataEmissaoDoc(props: Props) {
    const { data_emissao, data_vencimento, multiplo_documento_id, validade_dias } = props;
    const token = localStorage.getItem('token');
    let result;
    const req = {
        data_emissao,
        data_vencimento,
        multiplo_documento_id,
        validade_dias
    };

    await axiosInstance.post('salvar_data_emissao_certidoes', req, {
        headers: { Authorization: `Bearer ${token}` },
        // onUploadProgress: (progressEvent) => {
        //     const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0)) * 100);
        //     setProgressBar([{ percent: percentage, status: 'active' }]);
        // },
    })
        .then(res => {
            result = res.data;
            console.log(res);
            // setProgressBar([{ percent: 100, status: 'success' }]);
        })
        .catch(function (error) {
            console.log(error);
            // setProgressBar([{ percent: 0, status: 'error' }]);
        })
    return result;
};

export default SaveDataEmissaoDoc;