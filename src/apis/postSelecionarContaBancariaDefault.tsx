import axiosInstance from '../http/axiosInterceptorInstance';

async function postSelecionarContaBancariaDefault(idConta: number, idParcela: string | string[] | undefined, tipoConta?: string) {
    let data;
    const usuarioId = localStorage.getItem('usuario_id');
    await axiosInstance.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'salvar_conta_receber', {
        id: idConta,
        parcela_id: idParcela,
        usuario_id: usuarioId,
        tipo: tipoConta
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

export default postSelecionarContaBancariaDefault;