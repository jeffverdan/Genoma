import Axios from 'axios';
import axiosInstance from '../http/axiosInterceptorInstance';

async function SaveImovel(dataToSave: any) {
    if (dataToSave.uf) dataToSave = { ...dataToSave, estado: dataToSave.uf};
    if (dataToSave.valor_venda) dataToSave = { ...dataToSave, valorVenda: dataToSave.valor_venda };
    if (dataToSave.valor_anunciado) dataToSave = { ...dataToSave, valorEstimado: dataToSave.valor_anunciado };
    if (dataToSave.observacao_pagamento) dataToSave = { ...dataToSave, observacaoPagamento: dataToSave.observacao_pagamento };
    // if (dataToSave.informacao) {
    //     // const { forma_pagamento, inscricaoMunicipal, lavrada, livro, matricula, prazo, prazo_escritura, rgi, tipo_escritura, valoMulta, valorSinal, valor_venda, data_assinatura, escritura } = dataToSave.informacao;
    //     Object.keys(dataToSave.informacao).forEach((key) => {
    //         dataToSave = {
    //             ...dataToSave,
    //             [key]: dataToSave.informacao[key]
    //         }
    //     })
    // };

    let data;

    await axiosInstance.post('salvar_imovel_bloco', dataToSave, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => {
            data = res.data;
            console.log('RETORNO salvar_imovel_bloco :', res);                
            if(res.data) {
                if(res.data.porcenagem_preenchida_imovel < 37) data.lastBlock = 1
                else if(res.data.porcenagem_preenchida_imovel < 67) data.lastBlock = 2
                else if(res.data.porcenagem_preenchida_imovel < 74) data.lastBlock = 3
                else if(res.data.porcenagem_preenchida_imovel < 81) data.lastBlock = 4
                else if(res.data.porcenagem_preenchida_imovel < 94) data.lastBlock = 5
                else if(res.data.porcenagem_preenchida_imovel === 100) data.lastBlock = 7
            }
        })
        .catch(err => {
            console.log(err);
        })    
    return data;
}

export default SaveImovel;