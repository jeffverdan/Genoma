import { FormEditComissaoType } from '@/interfaces/Apoio/planilhas_comissao';
import axiosInstance from '../http/axiosInterceptorInstance';

type ResponseType = {
  comissao: {
    // historico_observacao: 'ok',
    status_comissao: 'true' | 'false',
    // mensagem_comissao: 'Comissão salva',
    status_parcela: 'true' | 'false',
    // mensagem_parcela: 'Parcela de comissao salva',
    // status_parcelas_deletadas: 'Erro ao excluir registros: Operação de exclusão falhou.'
  }
}

export default async function saveComissaoApoio(data: FormEditComissaoType): Promise<ResponseType | undefined> {
  
  const token = localStorage.getItem('token');
  let result
  
  await axiosInstance.post('salvar_comissao_apoio', {
    ...data,
    comissao_id: data.id,
    perfil: "apoio",
    usuario_id_logado: localStorage.getItem('usuario_id')
  }, {
    headers: { Authorization: `Bearer ${token}` },
    onUploadProgress: (progressEvent) => {
    //   const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0)) * 100);
      // setProgressBar([{percent: percentage, status: 'active'}]);
    },
  })
  .then(res => {
    result = res.data;
    console.log(res);
    // setProgressBar([{percent: 100, status: 'success'}]); 
  })
  .catch(function (error) {
    console.log(error);
    // setProgressBar([{percent: 0, status: 'error'}]);
  })

return result;
};

