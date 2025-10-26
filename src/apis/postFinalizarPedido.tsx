import Axios from 'axios';

async function PostFinalizarPedido(dataToSave: any) {
    let data;
    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'finalizar_pedido', dataToSave, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => {
            data = res.data;
            console.log('RETORNO finalizar pedido :', res);               
            
        })
        .catch(err => {
            console.log(err);
        })    
    return data;
}

export default PostFinalizarPedido;