import axiosInstance from '../http/axiosInterceptorInstance';

async function saveEmailEntregarVenda(id: number, email: string, nome: string, type: string, processoId: string) {
    const token = localStorage.getItem('token');
    let data;

    await axiosInstance.post('salvar_email', { id: id, email: email, nome: nome, type: type, processoId }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
        .then(res => {
            //if (res.data.status && res.data.status === (401 || 498)) {
            if(res.data.status === 401 || res.data.status === 498){
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

export default saveEmailEntregarVenda;