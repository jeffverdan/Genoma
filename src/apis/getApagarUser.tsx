import Axios from 'axios';

async function GetApagarUser(id: any, idProcesso: any, tipo: any, tipoPessoa: any) {
    let data;
    const error = 'Erro ao retornar o processo';
console.log(id);
    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'apagar_usuario', {
            'usuario_id': id,
            'processo_id': idProcesso,
            'tipo': tipo,
            'tipo_pessoa': tipoPessoa
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res => {
            console.log(res);
            // data = res.data.usuario;
            data = res.data;
            console.log(data);
        })
        .catch(err => {
            console.log(error);
        })
    return data;
}

export default GetApagarUser;