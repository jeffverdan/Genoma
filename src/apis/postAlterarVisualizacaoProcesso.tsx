import axiosInstance from '../http/axiosInterceptorInstance';

// ALTERA A VARIAVEL QUE DETERMINA SE O PÓS ABRIU O PROCESSO OU NÃO

async function AlterarVisualizacao(id: number) {
    let data;
    const token = localStorage.getItem('token');

    await axiosInstance.post('atualizar_status_visualizacao_gerente', {
        id
    }, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => {
            if (res.data.status && res.data.status === (401 || 498)) {
                
            }
        })
        .catch(function (error) {
            console.log(error);
        })
    return data;
}

export default AlterarVisualizacao;