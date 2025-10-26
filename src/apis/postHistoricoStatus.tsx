import Axios from 'axios';

async function postHistoricoStatus(processoId: number) {
    const token = localStorage.getItem('token');
    let data;

    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 +  'historico_status', {
        "processo_id": processoId,
    }, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => {
            if (res.data.status) {
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

export default postHistoricoStatus;