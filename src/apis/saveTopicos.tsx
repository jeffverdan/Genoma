import { SelectsType } from '@/interfaces/PosVenda/Analise';
import axiosInstance from '../http/axiosInterceptorInstance';

async function SaveTopico(dataToSave: SelectsType) {
  const token = localStorage.getItem('token');
  console.log(dataToSave);
  let result = false

  let arrayData = new FormData();
  arrayData.append(`topico_id`, dataToSave.topico_id?.toString() || '');
  arrayData.append(`processo_id`, dataToSave.processo_id);
  arrayData.append(`card_id`, dataToSave.card_id);

  if (dataToSave.topico_id === 1) {
    dataToSave.vendedoresAverbacao?.forEach(((e, index_vendedor) => {
      arrayData.append(`subtopico_id_vendedor[${index_vendedor}]`, e.id.toString() || '');
      e.tipo.forEach((tipo, index_tipo) => {
        arrayData.append(`subtopico_id_tipo[${index_vendedor}][${index_tipo}]`, tipo.id?.toString() || '');
        arrayData.append(`id[${index_vendedor}][${index_tipo}]`, tipo.id_vinculo_tipo || '');
      })
    }))
  } else if (dataToSave.topico_id === 2) {
    console.log(dataToSave);
    arrayData.append(`id`, dataToSave.id_vinculo_card?.toString() || '');
    arrayData.append(`subtopico_id_tipo`, dataToSave.formPagamento?.toString() || '');
    arrayData.append(`subtopico_id_vendedor`, Number(dataToSave.formPagamento) === 1 ? (dataToSave.vendedorResponsavel?.toString() || '') : '');
    arrayData.append(`banks_id`, (dataToSave.formPagamento === 2 || dataToSave.formPagamento === 7) ? dataToSave.bancoResponsavel?.toString() || '' : '');
  } else if (dataToSave.topico_id === 3) {
    arrayData.append(`obs_laudemio`, dataToSave.obsLaudemios || '');
    arrayData.append(`id`, dataToSave.id_vinculo_card?.toString() || '');
  } else if (dataToSave.topico_id === 4) {
    dataToSave.pendencia?.forEach((e, index_taxa) => {
      arrayData.append(`id[${index_taxa}]`, e.id_vinculo_tipo?.toString() || '');
      arrayData.append(`subtopico_id_tipo[${index_taxa}]`, e.id.toString() || '');
    })
  } else if (dataToSave.topico_id === 5) {
    arrayData.append(`id`, dataToSave.id_vinculo_card?.toString() || '');
    arrayData.append(`subtopico_id_tipo`, dataToSave.momentoReforco?.toString() || '');
    arrayData.append(`obs_reforco`, dataToSave.observacaoReforco?.toString() || '');
  } else if (dataToSave.topico_id === 6) {
    arrayData.append(`id`, dataToSave.id_vinculo_card?.toString() || '');
    arrayData.append(`subtopico_id_tipo`, dataToSave.assuntoOutros?.toString() || '');
    arrayData.append(`obs_outro`, dataToSave.observacaoOutros?.toString() || '');
  }

  await axiosInstance.post('salvar_topico', arrayData, {
    headers: { Authorization: `Bearer ${token}` },
    onUploadProgress: (progressEvent) => {
      const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0)) * 100);
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

export default SaveTopico;