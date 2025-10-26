import axiosInstance from '../http/axiosInterceptorInstance';

async function getListaCartorio() {
    let data;
    await axiosInstance.get('listar_cartorio', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    })
    .then(res => {
        if (res !== undefined) {
            if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
                localStorage.clear();
            } else {
                data = res.data.data;

                const outro = {id: '-1', nome: 'Outro', cep: ''}
                data.push(outro); // Adiciona opção Outro com id 99
            }
        }
    })   
    .catch(error => {
        console.log(error);
    })

    return data;
}
export default getListaCartorio