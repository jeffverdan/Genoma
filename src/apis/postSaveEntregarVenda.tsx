import EntregarVenda from '@/interfaces/Vendas/EntregarVenda';
import axiosInstance from '../http/axiosInterceptorInstance';

async function SaveEntregarVenda(dataToSave: EntregarVenda) {    
    
    await axiosInstance.post('salvar_dados_antes_entrega', {
        usuario_id: localStorage.getItem('usuario_id'),
        ...dataToSave            
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(async res => {
            console.log("Result to save: ", res);
            
        })
        .catch(err => {
            console.log("Error to save: ", err);
        })    
}

export default SaveEntregarVenda;