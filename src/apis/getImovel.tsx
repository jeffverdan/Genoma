import axiosInstance from '../http/axiosInterceptorInstance';

async function getImovel(processoId: number, router: any) {
    let data;
    const msgCopyNana = {
        title: 'Ops, seu tempo de login expirou!',
        subtitle: 'Mas não tem problema, basta realizar o login novamente.'
    };
    
    await axiosInstance.post('retorna_processo', {
            'processo_id': processoId,
            'usuario_logado': localStorage.getItem('usuario_id')
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => {
            data = res?.data;

            if(data?.status === false){               
                if(data?.msg === 'GG do processo'){
                    router.push('/vendas/detalhes-venda/' + processoId);
                }
                else{
                    router.push('/403')
                }
            }
            else{
                if(res?.data) {

                    if(res?.data?.imovel?.documentos.length === 0){
                        if(res.data.porcenagem_preenchida_imovel < 37) data.lastBlock = 1
                        else if(res.data.porcenagem_preenchida_imovel < 67) data.lastBlock = 2
                        else if(res.data.porcenagem_preenchida_imovel < 74) data.lastBlock = 3
                        else if(res.data.porcenagem_preenchida_imovel < 81) data.lastBlock = 4
                        else if(res.data.porcenagem_preenchida_imovel < 94) data.lastBlock = 5
                        else if(res.data.porcenagem_preenchida_imovel === 100) data.lastBlock = 7
                    }
                    else{
                        data.lastBlock = 7
                    }
    
    
                    // USANDO PARA HEADER EM VENDEDORES E COMPRADORES
                    data.imovelData = {
                        bairro: res.data.bairro,
                        cidade: res.data.cidade,
                        logradouro: res.data.logradouro,
                        numero: res.data.numero,
                        complemento: res.data.complemento,
                        unidade: res.data.unidade,
                        porcenagem_preenchida_imovel: res.data.porcenagem_preenchida_imovel,
                    }
                }
            }
        })
        .catch(err => {
            console.log(err);
            data = err;
            data.message = data.response.data.message === "The token has been blacklisted" ? msgCopyNana : data.response.data.message
        })
    return data;
}

export default getImovel;