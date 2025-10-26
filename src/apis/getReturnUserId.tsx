import Axios from 'axios';

async function GetReturnUserId(id: string, idProcesso: any, router: any/*, routerQuery: any*/) {
    let data;
    const error = 'Erro ao retornar o processo';
    console.log(id);
    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'exibir_usuario', {
            'usuario_logado': localStorage.getItem('usuario_id'),
            'usuario_id': id,
            'processo_id': idProcesso
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res => {
            console.log(res);
            if(res.data.status === false){                
                if(res.data.msg === 'GG do processo'){
                    router.push('/vendas/detalhes-venda/' + idProcesso);
                }
                else{
                    router.push('/403')
                }
            }

            data = res.data.usuario;
            
            console.log(data);
        })
        .catch(err => {
            console.log(error);
        })
    return data;
}

export default GetReturnUserId;