import axiosInstance from '../http/axiosInterceptorInstance';
import { differenceInDays, parse, isSameMonth } from 'date-fns';

// Definição das interfaces para tipagem
interface Processo {
  responsavel: string;
  responsavel_id: number;
  forma_pagamento: string;
  data_entrada: string;
  data_expiracao_status?: string;
  a_vista: 0 | 1
  financiado: 0 | 1
  id: number
}

interface ResponsavelResumo {
  responsavel: string;
  id: number;
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

const inputDateFormat = 'yyyy-MM-dd HH:mm:ss';

const calcDays = (dataExpiracao?: string): number => {
  if (!dataExpiracao) return NaN;
  const startDate = parse(dataExpiracao, inputDateFormat, new Date());
  return differenceInDays(startDate, new Date());
};

const filterDates = (dateStr: string, filter: number): boolean => {
  if (filter === 0) return true;
  const date = parse(dateStr, inputDateFormat, new Date());
  const currentYear = new Date().getFullYear();
  return isSameMonth(date, new Date(currentYear, filter - 1));
};

async function getDataGraficoPosVenda(month: number = 0): Promise<ResponsavelResumo[] | false> {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Token não encontrado");

    const response = await axiosInstance.get('lista_processos_responsaveis', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response || !response.data || response.data.status === 498 || response.data.status === 401) {
      return false;
    }

    const processos = response.data as Processo[];
    const responsaveisUnicos = Array.from(new Set(processos.map(p => p.responsavel)));

    return responsaveisUnicos.map(responsavel => {
      const processosFiltrados = processos.filter(p => p.responsavel === responsavel && filterDates(p.data_entrada, month));
      
      return {
        responsavel,
        id: processos.find(p => p.responsavel === responsavel)?.responsavel_id ?? 0,
        total: processosFiltrados.filter(e => e.id).length,
        a_vista: processosFiltrados.filter(p => p.forma_pagamento?.includes("À vista")).length,
        financiado: processosFiltrados.filter(p => p.forma_pagamento?.includes("Financiado")).length,
        fgts: processosFiltrados.filter(p => p.forma_pagamento?.includes("FGTS")).length,
        consorcio: processosFiltrados.filter(p => p.forma_pagamento?.includes("Consórcio")).length,
        em_dia: processosFiltrados.filter(p => calcDays(p.data_expiracao_status) > 3).length,
        alerta: processosFiltrados.filter(p => {
          const days = calcDays(p.data_expiracao_status);
          return days <= 3 && days >= 0;
        }).length,
        atrasado: processosFiltrados.filter(p => calcDays(p.data_expiracao_status) < 0).length,
        sem_prazo: processosFiltrados.filter(p => !p.data_expiracao_status).length,
        sem_pagamento: processosFiltrados.filter(p => !p.forma_pagamento).length,
        total_processos: processos.length,        
        check_a_vista: processos.find(p => p.responsavel === responsavel)?.a_vista ?? false,
        check_financiado: processos.find(p => p.responsavel === responsavel)?.financiado ?? false,
      };
    });

  } catch (error) {
    console.error("Erro ao buscar processos:", error);
    return false;
  }
}

export default getDataGraficoPosVenda;
