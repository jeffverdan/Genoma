import Axios from 'axios';

async function postSalvarNovoMetodoPagamento(valores: any) {
    let data;
    const usuarioId = localStorage.getItem('usuario_id') || '';
    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'salvar_confirmar_valor', {
        agencia: valores?.agencia,
        apelido: valores?.apelido,
        banco: valores?.banco,
        conta: valores?.conta,
        chave_pix: valores?.chave_pix,
        pix: valores?.pix,
        tipo: valores?.tipo,
        usuario_id: usuarioId
    }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => {
            data = res.data;
            console.log('RETORNO :', res);               
            
        })
        .catch(err => {
            console.log(err);
        })    
    return data;
}

export default postSalvarNovoMetodoPagamento;