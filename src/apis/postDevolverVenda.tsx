import { DataToSaveType } from '@/interfaces/PosVenda/Devolucao';
import axiosInstance from '../http/axiosInterceptorInstance';

interface Props {
  data: DataToSaveType
  id: string | number
};

type KeyType = ['vendedor_pf', 'vendedor_pj', 'comprador_pf', 'comprador_pj']

async function DevolverVenda(props: Props) {
  const {data, id} = props;
  const arrKeyPessoas: KeyType = ['vendedor_pf', 'vendedor_pj', 'comprador_pf', 'comprador_pj'];

  const param = new FormData();
  param.append('processo_id', id.toString() || '');
  param.append('usuario_id', localStorage.getItem('usuario_id') || '');
  param.append('imovel_obs', data.imovel.obs || '');
  param.append('recibo_obs', data.recibo.obs || '');
  param.append('vendedor_pf_obs', data.vendedor_pf.obs || '');
  param.append('vendedor_pj_obs', data.vendedor_pj.obs || '');
  param.append('comprador_pf_obs', data.comprador_pf.obs || '');
  param.append('comprador_pj_obs', data.comprador_pj.obs || '');

  data.imovel.reviewChecks?.forEach((e, index) => {
    param.append(`imovel_reviewChecks_id[${index}]`, e.id.toString())
    param.append(`imovel_reviewChecks_nome[${index}]`, e.nome)
  });

  data.recibo.reviewChecks?.forEach((e, index) => {
    param.append(`recibo_reviewChecks_id[${index}]`, e.id.toString())
    param.append(`recibo_reviewChecks_nome[${index}]`, e.nome)
  });

  // param.append(`incompleto_vendedor`, data.incompleto.vendedor ? '1' : '0');
  // param.append(`incompleto_comprador`, data.incompleto.vendedor ? '1' : '0');
  // param.append(`incompleto_obs`, data.incompleto.obs || '');

  arrKeyPessoas.forEach((key) => {
    data[key].reviews?.forEach((e, index) => {
      param.append(`${key}_id[${index}]`, e.id?.toString() || '');
      e.reviewChecks?.forEach((e, index_rev) => {
        param.append(`${key}_reviewChecks_id[${index}][${index_rev}]`, e.id.toString())
        param.append(`${key}_reviewChecks_nome[${index}][${index_rev}]`, e.nome)
      });
    });
  })

  await axiosInstance.post('devolver_venda', param, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
  }).then(res => {
    console.log(res);
    
  }).catch(err => {
    console.log(err);
  });
};

export default DevolverVenda;