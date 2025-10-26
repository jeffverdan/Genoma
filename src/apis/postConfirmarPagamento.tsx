import axiosInstance from '../http/axiosInterceptorInstance';

interface ConfirmarPagamentoFinanceiroProps {
  pagamento_id: number;
  parcela_id: string;
  check_pagamento: 0 | 1;
  responsavel_id?: number;
  motivo?: string;
  valor_pago?: string;
  valor_juros?: string;
  valor_multa?: string;
  data_pagamento?: string;
  valor_pago_atrasado?: string;
}

async function ConfirmarPagamentoFinanceiro(props: ConfirmarPagamentoFinanceiroProps) {
  const { pagamento_id, parcela_id, check_pagamento, responsavel_id, motivo, valor_pago, valor_juros, valor_multa, data_pagamento, valor_pago_atrasado } = props;

  const token = localStorage.getItem('token');
  let result

  await axiosInstance.post('salvar_comfirmacao_pagamento_financeiro', {
    pagamento_id: pagamento_id,
    parcela_id: parcela_id,
    check_pagamento: check_pagamento,
    usuario_id: localStorage.getItem('usuario_id'),
    responsavel_id: responsavel_id,
    motivo: motivo,
    valor_pago: valor_pago,
    valor_juros: valor_juros,
    valor_multa: valor_multa,
    data_pagamento: data_pagamento,
    valor_pago_atrasado: valor_pago_atrasado
  }, {
    headers: { Authorization: `Bearer ${token}` },
    onUploadProgress: (progressEvent) => {
      const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0)) * 100);
      // setProgressBar([{percent: percentage, status: 'active'}]);
    },
  })
    .then(res => {
      result = res?.data;
      console.log(res);
      // setProgressBar([{percent: 100, status: 'success'}]); 
    })
    .catch(function (error) {
      console.log(error);
      // setProgressBar([{percent: 0, status: 'error'}]);
    })

  return result;
};

export default ConfirmarPagamentoFinanceiro;