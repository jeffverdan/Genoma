import Axios from 'axios';

type UseFormType = {
  tipo_nota: string
  valor_boleto: string
  data_envio: string
  data_emissao: string
  data_validade: string
  parcela_id: number | string | null
  usuario_id: number | string | null
  boleto_id?: number | string | null; // Adicionado para validação
}

async function postSaveDadosBoleto(dadosBoleto: UseFormType) {
    let data;
    const responsavelId = localStorage.getItem('usuario_id');
    const {boleto_id, data_emissao, data_envio, data_validade, parcela_id, tipo_nota, usuario_id, valor_boleto} = dadosBoleto;

    await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'salvar_dados_complementares_boleto', {
        boleto_id: boleto_id,
        data_emissao: data_emissao,
        data_envio: data_envio,
        data_validade: data_validade,
        parcela_id: parcela_id,
        tipo_nota: tipo_nota,
        valor_boleto: valor_boleto,
        usuario_id: responsavelId
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

export default postSaveDadosBoleto;