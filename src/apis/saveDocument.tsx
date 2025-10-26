import ImovelData from '@/interfaces/Imovel/imovelData';
import axiosInstance from '../http/axiosInterceptorInstance';

type progress = {
  percent: number
  status: string
  error?: string
}

async function SaveDocument(idProcesso: any, file: any, idDonoDocumento: any, papel: any, index_Doc: any, setProgressBar: (prevState: progress[]) => void, progressBar: progress[], servicoId?: any, option?: any, dataProcesso?: any, setMsgDocumentoUnico?: any) {
  let result;
  let arrayData = new FormData(); 
  console.log('Papel: ', papel)
  console.log('idDonoDocumento: ', idDonoDocumento)
  console.log('FILE: ', file)

  if (file?.file) {
    if (typeof (file.file) === 'string' || file.file instanceof String) {
      let arquivoVazio = new File(["foo"], "nao_teve_alteracao_foo.txt", {
        type: "text/plain",
      });
      arrayData.append(`arquivo`, arquivoVazio);
    } else {
      arrayData.append(`arquivo`, file.file);
    }
    

    if (file.item) {
      file.item.forEach((tipo: any, index_tipo: any) => {
        arrayData.append(`tipo_documento_ids[${index_tipo}]`, tipo.value);
        arrayData.append(`multiplo_documento_id[${index_tipo}]`, tipo.id ? tipo.id : "");
      })
    }

    if ((option?.[0]?.nome === 'nota' || option?.[0]?.nome === 'boleto_financeiro') && file.item.length === 0 ) {
      arrayData.append(`tipo_documento_ids[${0}]`, option[0]?.id);
      arrayData.append(`multiplo_documento_id[${0}]`, '');
    }

    // Parcela da NOTA
    if(option?.[0]?.nome === 'nota'){
      arrayData.append(`parcela_id`, dataProcesso?.parcela_id);
    }

    // PArcela do Boleto
    if(option?.[0]?.nome === 'boleto_financeiro'){
      arrayData.append(`parcela_id`, dataProcesso?.parcela?.id);
    }

    if(option?.[0]?.nome === 'boleto_financeiro' || option?.[0]?.nome === 'nota'){
      arrayData.append(`identifica_documento`, option[0]?.nome);
    }

    arrayData.append(`processo_id`, idProcesso);
    arrayData.append('usuario_id', localStorage.getItem('usuario_id') || '');

    // ID do Serviço vindo pelo NÚCLEO
    if (servicoId) {
      arrayData.append(`solicitacao_id`, servicoId);
    }
    
    // imovelData?.devolucoes?.tipo_devolucao?.data.forEach(e => {
    //   console.log(e);
    //   if(e.tipo_pessoa === papel && e.tipo === "Incompleto") arrayData.append(`id_correcao`, e.id_correcao.toString());
    // })
    arrayData.append(`documentos_id`, file.id ? file.id : "");
    arrayData.append(papel === 'imovel' ? `imovel_id` : `idDonoDocumento`, idDonoDocumento);

    arrayData.append(`papel`, papel);
  };

  await axiosInstance.post('salvar_documento_unico', arrayData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    onUploadProgress: (progressEvent) => {
      const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0 )) * 100);      
      progressBar[index_Doc] = { percent: percentage, status: 'active', error: '' };
      setProgressBar([...progressBar]);
    },
    
  })
    .then(res => {
      result = res.data;
      console.log(res);
      progressBar[index_Doc] = { percent: 100, status: 'success', error: '' };
      setProgressBar([...progressBar]);
    })
    .catch(function (error) {
      console.log(error);
      if(option?.[0]?.nome === 'boleto_financeiro'){
        setMsgDocumentoUnico('O documento não é um boleto válido.')
      }
      
      progressBar[index_Doc] = { percent: 0, status: 'error', error: '' };
      setProgressBar([...progressBar]);
    })

  return result;
};

export default SaveDocument;