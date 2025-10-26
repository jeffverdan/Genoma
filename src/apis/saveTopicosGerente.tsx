import axiosInstance from '../http/axiosInterceptorInstance';

type PropsType = {
    topico_id: string
    processo_id: string
    card_id: string
    id: string
    subtopico_id_tipo: string
    forma_pagamento_avista: boolean
    id_responsavel_chaves: string
    obs_reforco?: string
}

async function SaveTopicosGerente(dataToSave: PropsType) {
    const token = localStorage.getItem('token');    
    let result = false

    let arrayData = new FormData();
    arrayData.append(`topico_id`, dataToSave.topico_id);
    arrayData.append(`processo_id`, dataToSave.processo_id);
    arrayData.append(`id`, dataToSave.id);
    arrayData.append(`card_id`, dataToSave.card_id);
    arrayData.append(`subtopico_id_tipo`, dataToSave.subtopico_id_tipo);
    arrayData.append(`subtopico_id_vendedor`, dataToSave.forma_pagamento_avista ? dataToSave.id_responsavel_chaves : '');
    arrayData.append(`banks_id`, !dataToSave.forma_pagamento_avista ? dataToSave.id_responsavel_chaves : '');
    arrayData.append(`obs_reforco`, dataToSave.obs_reforco || '');

    await axiosInstance.post('salvar_topico', arrayData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
            const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0)) * 100);
            // setProgressBar([{percent: percentage, status: 'active'}]);
        },
    })
        .then(res => {
            result = res.data;
            console.log(res);
            // setProgressBar([{percent: 100, status: 'success'}]); 
        })
        .catch(function (error) {
            console.log(error);
            // setProgressBar([{percent: 0, status: 'error'}]);
        })

    return result;
};

export default SaveTopicosGerente;