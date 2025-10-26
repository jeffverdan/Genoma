import axiosInstance from '../http/axiosInterceptorInstance';

interface PropsType {
    informacao_imovel_id: string | number,
    reciboType: 'manual' | 'docusign'
}

async function saveCheckReciboType(props: PropsType) {
    const token = localStorage.getItem('token');
    let data;

    await axiosInstance.post('salvar_check', props, {
        headers: {
            Authorization: `Bearer ${token}`,
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

export default saveCheckReciboType;