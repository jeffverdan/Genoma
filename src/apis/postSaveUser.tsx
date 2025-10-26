import Axios from 'axios';
import axiosInstance from '../http/axiosInterceptorInstance';

const params = ['cpf', 'dataNascimento', 'nome',]

async function SaveUser(dataToSave: any) {
    // CONVERTENDO PARAMETROS DIFERNTES DE RETORNO
    if (dataToSave.cpf_cnpj) dataToSave = { ...dataToSave, cpf: dataToSave.cpf_cnpj };
    if (dataToSave.data_nascimento) dataToSave = { ...dataToSave, dataNascimento: dataToSave.data_nascimento };
    if (dataToSave.name) dataToSave = { ...dataToSave, nome: dataToSave.nome || dataToSave.name };
    if (dataToSave.id) dataToSave = { ...dataToSave, usuario_id: dataToSave.id };
    if (dataToSave.registro_casamento) dataToSave = { ...dataToSave, regime_casamento: dataToSave.registro_casamento };
    if (dataToSave.data_rg_expedido) dataToSave = { ...dataToSave, rg_data_expedicao: dataToSave.data_rg_expedido };
    if (dataToSave.uf) dataToSave = { ...dataToSave, estado: dataToSave.uf };

    if (dataToSave.bloco === 2 && !!dataToSave.averbacao) {
        // dataToSave = new FormData();        
        // dataToSave.append(`processo_id`, dataToSave.processo_id);
        // dataToSave.append(`card_id`, dataToSave.averbacao.id);
        
        //     arrayData.append(`subtopico_id_vendedor[${index_vendedor}]`, e.id.toString() || '');
        //     e.tipo.forEach((tipo, index_tipo) => {
        //         arrayData.append(`subtopico_id_tipo[${index_vendedor}][${index_tipo}]`, tipo.id?.toString() || '');
        //         arrayData.append(`id[${index_vendedor}][${index_tipo}]`, tipo.id_vinculo_tipo || '');
        //     })
        
    }

    let data;
    await axiosInstance.post('salvar_user_bloco', dataToSave, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    })
        .then(res => {
            data = res.data;
            console.log('RETORNO salvar_user_bloco :', res);

            // Id do usuário para ser usado no form para edição sem o id dele ser recuperado
            console.log('Id salvo: ' + res.data.usuario.id);
            localStorage.setItem('usuario_cadastro_id', res.data.usuario.id)

            if (res.data) {
                if (res.data.porcentagem_cadastro_concluida < 20) data.lastBlock = 1
                else if (res.data.porcentagem_cadastro_concluida < 60) data.lastBlock = 2
                else if (res.data.porcentagem_cadastro_concluida < 80) data.lastBlock = 3
                else if (res.data.porcentagem_cadastro_concluida === 100) data.lastBlock = 4
                res.data.user = {
                    ...res.data.user,
                    usuario_id: res.data.user.id
                }
            }
        })
        .catch(err => {
            console.log(err);
        })
    return data;
}

export default SaveUser;