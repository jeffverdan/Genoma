import Axios from 'axios';

async function getUsuariosProcesso(processoId: number,  tipoUsuario: any) {
    let data;
    const msgCopyNana = {
        title: 'Ops, seu tempo de login expirou!',
        subtitle: 'Mas não tem problema, basta realizar o login novamente.'
    };
    
    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'listar_usuarios_processos', {
            'processo_id': processoId,
            'tipoUsuario': tipoUsuario
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => {
            
            data = res.data;
            console.log(data);
            /* if(res.data) {
                if(res.data.porcenagem_preenchida < 37) data.lastBlock = 1
                else if(res.data.porcenagem_preenchida < 67) data.lastBlock = 2
                else if(res.data.porcenagem_preenchida < 74) data.lastBlock = 3
                else if(res.data.porcenagem_preenchida < 81) data.lastBlock = 4
                else if(res.data.porcenagem_preenchida < 94) data.lastBlock = 5
                else if(res.data.porcenagem_preenchida === 100) data.lastBlock = 6

                // USANDO PARA HEADER EM VENDEDORES E COMPRADORES
                data.imovelData = {
                    bairro: res.data.bairro,
                    cidade: res.data.cidade,
                    logradouro: res.data.logradouro,
                    numero: res.data.numero,
                    complemento: res.data.complemento,
                    unidade: res.data.unidade
                }
            } */
        })
        .catch(err => {
            console.log(err);
            data = err;
            data.message = data.response.data.message === "The token has been blacklisted" ? msgCopyNana : data.response.data.message
        })
    return data;
}

export default getUsuariosProcesso;