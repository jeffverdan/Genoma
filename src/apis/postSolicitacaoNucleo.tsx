import Axios from 'axios';

interface Servico {
    tipo?: number | string;
    servico_detalhado?: number | string;
    observacao?: string;
}
  
interface FormValues {
    quantidade_servicos: number | string;
    servico?: Servico[];
    onus_solicitada: string;
    vendedor_comarca: string;
}

async function postSolicitacaoNucleo(idProcesso: string, dataToSave: FormValues) {
    let data;
    const responsavelId = localStorage.getItem('usuario_id');
    console.log('API: ', dataToSave)

    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'salvar_solicitacao_multipla_nucleo', {
        responsavel_requisicao: responsavelId,
        processo_id: idProcesso,
        solicitacao: dataToSave
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

export default postSolicitacaoNucleo;