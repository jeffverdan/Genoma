import Axios from 'axios';

async function postConfirmarTransferencia(parcelaId: number, valor: string, soma?: number | null) {
    let data;
    const usuarioId = localStorage.getItem('usuario_id') || '0';
    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'salvar_confirmar_valor', {
        parcela_id: parcelaId,
        confirmar_valor: valor,
        usuario_id: usuarioId,
        soma: soma
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

export default postConfirmarTransferencia;