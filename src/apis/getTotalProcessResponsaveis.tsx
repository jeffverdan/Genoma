import axiosInstance from '../http/axiosInterceptorInstance';
import { differenceInDays, parse, isSameMonth } from 'date-fns';

interface Process {
  responsavel: string;
  responsavel_id: number;
  forma_pagamento: string;
  data_entrada: string;
  data_expiracao_status: string | null;
}

interface Res {
  data: Process[];
}

interface ResponsavelData {
  responsavel: string;
  id: number | undefined;
  total: number;
  a_vista: number;
  financiado: number;
  fgts: number;
  consorcio: number;
  em_dia: number;
  alerta: number;
  atrasado: number;
  sem_prazo: number;
  sem_pagamento: number;
  total_processos: number;
}

async function getTotalProcessResponsaveis(month?: number) {
  const token = localStorage.getItem('token');
  let data: ResponsavelData[] | undefined;
  const filter = month || 0; // 0 SIGNIFICA SEM FILTRO
  const inputDateFormat = 'yyyy-MM-dd HH:mm:ss';


  const calcDays = (dataExpiracao: string | null) => {
    if (!dataExpiracao) return 0
    const startDate = parse(dataExpiracao, inputDateFormat, new Date());
    const dateNow = new Date();
    const result = differenceInDays(startDate, dateNow);
    return result;
  };

  const filterDates = (value: string) => {
    if (Number(filter) === 0) return true;
    const date = parse(value, inputDateFormat, new Date());
    const isMonth = isSameMonth(date, new Date(2023, filter - 1));
    console.log(date);
    return isMonth;
  };

  // Função auxiliar para filtrar processos por responsável e data de entrada
  const filterByResponsavelAndDate = (
    res: Res,
    responsavel: string,
    predicate: (process: Process) => boolean
  ): Process[] =>
    res.data.filter((process) => process.responsavel === responsavel && filterDates(process.data_entrada) && predicate(process));

  // Função auxiliar para verificar a forma de pagamento
  const filterByFormaPagamento = (
    res: Res,
    responsavel: string,
    pagamento: string
  ): Process[] =>
    filterByResponsavelAndDate(res, responsavel, (process) => process.forma_pagamento.includes(pagamento));

  // Função auxiliar para verificar status por dias de expiração
  const filterByStatusExpiracao = (
    res: Res,
    responsavel: string,
    comparator: (days: number) => boolean
  ): Process[] =>
    filterByResponsavelAndDate(res, responsavel, (process) => comparator(calcDays(process.data_expiracao_status)));

  await axiosInstance.get('lista_processos_responsaveis', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }).then(res => {
    if (res !== undefined) {
      if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {

      } else {
        console.log(res.data);
        // Extraindo dados únicos dos responsáveis
        const responsaveisUnicos = [...new Set(res.data.map((process: ResponsavelData) => process.responsavel))] as string[];

        data = responsaveisUnicos.map((responsavel) => {
          const responsavelProcesses = res.data.filter((process: ResponsavelData) => process.responsavel === responsavel);
          const responsavelId = responsavelProcesses[0]?.responsavel_id;

          return {
            responsavel,
            id: responsavelId,
            total: filterByResponsavelAndDate(res, responsavel, () => true).length,
            a_vista: filterByFormaPagamento(res, responsavel, "À vista").length,
            financiado: filterByFormaPagamento(res, responsavel, "Financiado").length,
            fgts: filterByFormaPagamento(res, responsavel, "FGTS").length,
            consorcio: filterByFormaPagamento(res, responsavel, "Consórcio").length,
            em_dia: filterByStatusExpiracao(res, responsavel, (days) => days > 3).length,
            alerta: filterByStatusExpiracao(res, responsavel, (days) => days <= 3 && days >= 0).length,
            atrasado: filterByStatusExpiracao(res, responsavel, (days) => days < 0).length,
            sem_prazo: filterByResponsavelAndDate(res, responsavel, (process) => !process.data_expiracao_status).length,
            sem_pagamento: filterByResponsavelAndDate(res, responsavel, (process) => !process.forma_pagamento).length,
            total_processos: res.data.length,
          };
        });
      }
    }
  }).catch(err => {
    console.log(err);
  })

  return data;
};

export default getTotalProcessResponsaveis;