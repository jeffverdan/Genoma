import AutoComplete from "@/components/AutoComplete";
import { DataFilter } from "@/interfaces/PosVenda/FiltroEndereco";
import { Button, Chip, CircularProgress, Collapse, Divider, Menu, Paper, SelectChangeEvent } from "@mui/material";

import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { HiArrowPath } from "react-icons/hi2";
import { differenceInMinutes, getYear, subBusinessDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ptBR } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/pt-br';
// import SwipeableViews from "react-swipeable-views";
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import ButtonComponent from "@/components/ButtonComponent";
import { virtualize } from 'react-swipeable-views-utils';
import getAgendaPos from "@/apis/getAgendaPosVenda";
import { DeadlineTypes, retornoApi } from "@/interfaces/PosVenda/Agenda";
import { HiExclamationCircle } from "react-icons/hi";
import { addBusinessDays, differenceInBusinessDays } from 'date-fns';
import { OptionData } from "@/components/AutoComplete/interface";
import Image from "next/image";
import AgendaImg from "@/images/agenda_posvenda.svg";
import { useRouter } from "next/router";
import { SkeletonAgendaRow } from "@/components/Skeleton/PosVenda/Agenda";
import CheckBox from "@/components/CheckBox";
import { da } from "date-fns/locale";
import InputSelect from "@/components/InputSelect/Index";
import getPosVendaResp from "@/apis/getPosVendaResp";
import Link from "next/link";
import React from "react";

interface Props {
    selectedIndex: number,
    setSelectedIndex: (e: number) => void,
    collapseMenu: boolean,
    user: {
        id: string | null;
        perfil: string | null;
    }
};

type DeadLinesType = {
    vermelhos: number,
    laranjas: number,
    amarelos: number,
}

type DeadlinesMouthType = {
    dia: number,
    mes: number,
    ano: number,
    deadlines: DeadLinesType
}[]

type ArrDayDateType = {
    day: number,
    month: number,
    date: Dayjs
    carouselId: number
}

type LabelType = 'Atenção' | 'A Vencer' | 'Atrasado';

type KeysType = 'amarelos' | 'laranjas' | 'vermelhos';

type ArrDeadLine = {
    label: LabelType,
    color: 'yellow' | 'orange' | 'red'
    key: KeysType
    disabled: 'enable' | 'hidden'
}

type ArrYearDatesType = ArrDayDateType[][];

type FilterDeadlinesType = {
    label: LabelType,
    value: KeysType,
    checked: boolean
}

type ListPosVenda = {
    id: number | string;
    name: string;
};

interface Filtro {
    key: "amarelos" | "laranjas" | "vermelhos";
    disabled: string;
}

const arrMouth = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const arrWeek = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
const arrWeekNames = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

function monthLength(month: number, year: number) {
    return new Date(year, month, 0).getDate();
};

const AgendaPosVenda = ({ collapseMenu, user }: Props) => {

    useEffect(() => {
        if (!collapseMenu) setWidthDiv('calc(100vw - 106px');
        else setWidthDiv('calc(100vw - 295px');
    }, [collapseMenu]);

    const [arrDeadLines, setArrDeadLines] = useState<ArrDeadLine[]>([
        { label: 'Atenção', key: 'amarelos', color: 'yellow', disabled: 'enable' },
        { label: 'A Vencer', key: 'laranjas', color: 'orange', disabled: 'enable' },
        { label: 'Atrasado', key: 'vermelhos', color: 'red', disabled: 'enable' },
    ]);

    const isHidden = (item: retornoApi, filtro: ArrDeadLine, arrDeadLines: ArrDeadLine[]): boolean => {
        const yellowRule = !item.deadline.amarelos[0] || arrDeadLines.find(e => e.key === 'amarelos')?.disabled === 'hidden';
        const orangeRule = !item.deadline.laranjas[0] || arrDeadLines.find(e => e.key === 'laranjas')?.disabled === 'hidden';
        const redRule = !item.deadline.vermelhos[0] || arrDeadLines.find(e => e.key === 'vermelhos')?.disabled === 'hidden';

        const conditions = {
            amarelos: redRule && orangeRule,
            vermelhos: orangeRule && yellowRule,
            laranjas: redRule && yellowRule
        };

        return (
            filtro.disabled === 'hidden' &&
            conditions[filtro.key]
        );
    };


    const [widthDiv, setWidthDiv] = useState<number | string>('100%');

    const route = useRouter();
    const [userName, setUserName] = useState<string>()
    const [idSelect, setIdSelect] = useState<number>()
    const [filters, setFilters] = useState<DataFilter>({
        endereco: null
    });
    const [listAdress, setListAdress] = useState<OptionData[]>([]);
    const [deadlinesMouth, setDeadlinesMouth] = useState<DeadlinesMouthType>();
    const [deadLineHoje, setDeadLineHoje] = useState<DeadLinesType>({
        vermelhos: 0,
        amarelos: 0,
        laranjas: 0
    });

    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
    const [timeDifference, setTimeDifference] = useState<string | null>("0 minutos");

    const [dateSelect, setDateSelect] = useState<Dayjs>(dayjs());
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const [arrDatas, setArrDatas] = useState<number[]>([]);
    const [arrYearDatas, setArrYearDatas] = useState<ArrYearDatesType>([]);
    const [process, setProcess] = useState<retornoApi[]>([]);
    const processNoFiltered = useRef<retornoApi[]>([]);
    // const [processFilter, setProcessFilter] = useState<retornoApi[]>([]);
    const [filterDeadlines, setFilterDeadlines] = useState<FilterDeadlinesType[]>([
        { label: "Atenção", value: "amarelos", checked: true },
        { label: "A Vencer", value: "laranjas", checked: true },
        { label: "Atrasado", value: "vermelhos", checked: true },
    ]);
    const [posvendaList, setPosvendaList] = useState<ListPosVenda[]>([]);
    const [filterRespo, setFilterRespo] = useState<string | number | undefined>();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const createArrDatas = (month: number, year: number) => {
        const dataFinal = monthLength(month, year);
        const arr = [];
        for (var i = 1; i <= dataFinal; i += 1) {
            arr.push(i);
        }
        return arr;
    };

    const createArrDatasComplete = (month: number, year: number) => {
        const dataFinal = monthLength(month, year)
        const arr = [];
        for (var i = 1; i <= dataFinal; i += 1) {
            arr.push(i);
        }

        const arrDatas = arr.map((day) => ({
            day: day,
            month: month,
            date: dayjs(`${year}/${month}/${day}`),
            carouselId: Number(`${year}${month}${day}`)
        }));
        return arrDatas;
    };

    const getArrDatas = () => {
        const mesAtual = dateSelect.month() + 1;
        const anoAtual = dateSelect.year();

        if (deadlinesMouth?.[0].mes === mesAtual) return '';

        const arrMesAtual = createArrDatas(mesAtual, anoAtual);
        setArrDatas([...arrMesAtual]);

        if (!!process[0]) setDeadlinesMouth(arrMesAtual.map(dia => ({
            dia: dia,
            mes: mesAtual,
            ano: anoAtual,
            deadlines: totalDeadlinesForDay(dia)
        })));

        setIdSelect(Number(`${anoAtual}${mesAtual}${dateSelect.day()}`));

        // PEGANDO TODAS AS DATAS DO ANO
        // const arrYearComplete = []
        // for (var i = 0; i <= 11; i += 1) {
        //     const arrMesComplete = createArrDatasComplete(i, anoAtual);
        //     arrYearComplete.push(arrMesComplete);
        // }
        // setArrYearDatas(arrYearComplete);
        // setArrDatasAnterior([...arrMesAnterior]);
    };
    
    const getProcess = async () => {
        setLoading(true);
        setDateSelect(dayjs());
        const filtro = user?.perfil !== 'Coordenadora de Pós-Negociação' ? user?.id || '' : '';
        const processRes = await getAgendaPos(filtro || '');
        // console.log('processRes: ', processRes)
        getDeadlines(dayjs(), processRes);


        if (posvendaList.length === 0) {
            const responsaveis = await getPosVendaResp() as unknown as ListPosVenda[];
            responsaveis.unshift({ id: '', name: "Selecione..." }),
                responsaveis.push({ id: 0, name: 'Todos os responsáveis' })
            setPosvendaList(responsaveis || []);
        }
        setFilterRespo(0);
    };

    const actionRoute = (url?: string, params?: string) => {
        if (!url) return '';
        if (params) localStorage.setItem('params', params || '');
        route.push(url);
    };

    const itemsSorting = (items: retornoApi[]) => {
        const sortingItems: retornoApi[] = [];

        items.forEach(item => {
            if (!!item.deadline.amarelos[0]) sortingItems.push(item);
        })
        items.forEach(item => {
            if (!!item.deadline.laranjas[0]) sortingItems.push(item);
        })
        items.forEach(item => {
            if (!!item.deadline.vermelhos[0]) sortingItems.push(item)
        })

        return [...new Set(sortingItems)]
    };

    const returnDeadLines = (daySelect: Dayjs, arrProcess: retornoApi[]) => {
        const dateSelect = new Date(daySelect.format('YYYY/MM/DD'));

        const processByDate = (arrProcess).map((item) => {
            const deadlines: DeadlineTypes = {
                vermelhos: [],
                laranjas: [],
                amarelos: []
            };

            const dataAnalisePos = new Date(item.data_analise);
            const diaDaAnalisePos = differenceInBusinessDays(dateSelect, dataAnalisePos);

            const daysjsDateEscritura = dayjs(
                item.data_reagendada_gerente ? item.data_reagendada_gerente :
                    item.data_agenda_pos ? item.data_agenda_pos : item.dataEscritura.format()
            )
            const dateEscritura = new Date(daysjsDateEscritura.format('YYYY/MM/DD'));
            const diasAteEscrituraCOR = dayjs(dateEscritura).diff(daySelect, 'days'); // DIAS CORRIDOS
            const diasAteEscrituraUT = differenceInBusinessDays(dateEscritura, dateSelect); // DIAS UTEIS
            const prazo = Number(item.prazo_escritura);
            const diasAteEscritura = diasAteEscrituraUT; // CHAVE PAR ALTERNAR ENTRE DIAS UTEIS E CORRIDOS (ESCRITURA e ITBI)
            const guiaItbi = item.itbi.find((e) => Number(e.id) === 2);

            //BLOCO ITBI
            // console.log('ITEM ITBI: ' , item)
            // console.log('GUIA ITBI: ' , guiaItbi)
            if (!!item.itbi[0] && !guiaItbi) {
                // PROTOCOLO DE ITBI CADASTRADO SEM GUIA DE ITBI NO SISTEMA
                item.itbi.forEach((protocolo) => {
                    const dataValidade = dayjs(protocolo.data_validade);
                    const dateValidade = new Date(protocolo.data_validade);
                    const diasAteVencerCOR = dataValidade.diff(daySelect, 'days'); // DIAS CORRIDOS
                    const diasAteVencerUT = differenceInBusinessDays(dateValidade, dateSelect); // DIAS UTEIS

                    const diasAteVencer = diasAteVencerCOR; // CHAVE PAR ALTERNAR ENTRE DIAS UTEIS E CORRIDOS (CERTIDÕES)

                    if (diasAteVencer <= 0) {
                        deadlines.vermelhos.push({
                            msg: <p><b>Protocolo de ITBI</b> aponta vencimento da Guia {diasAteVencer < 0 ? 'há '+ (diasAteVencer * -1) + ' dias' : 'hoje' }.</p>,
                            action_link: `https://carioca.rio/tema/itbi/`,
                            action_label: 'Gerar novo documento'
                        })
                    } else if (diasAteVencer <= 5) {
                        deadlines.laranjas.push({
                            msg: <p>Necessária a retirada da <b>Guia de ITBI</b> a vencer em {dataValidade.format('DD/MM/YYYY')}.</p>,
                            action_link: `https://carioca.rio/tema/itbi/`,
                            action_label: 'Gerar documento'
                        })
                    } else if (diasAteVencer <= 28) {
                        deadlines.amarelos.push({
                            msg: <p><b>Guia do ITBI</b> disponível para impressão.</p>,
                            action_link: `https://carioca.rio/tema/itbi/`,
                            action_label: 'Gerar documento'
                        })
                    }
                })
            } else if (diaDaAnalisePos > 2 && !guiaItbi) {
                if (diasAteEscritura <= 0) {
                    deadlines.vermelhos.push({
                        msg: <p><b>Protocolo de ITBI</b> pendente e Recibo de Sinal vencido há {diasAteEscritura < 0 ? diasAteEscritura * -1 + ' dias' : 'hoje'}.</p>,
                        action_link: `https://carioca.rio/tema/itbi/`,
                        action_label: 'Gerar documento'
                    })
                } else if (diasAteEscritura < 11) {
                    deadlines.laranjas.push({
                        msg: <p><b>Protocolo de ITBI</b> pendente. Recibo de Sinal vence em {diasAteEscritura} {diasAteEscritura > 1 ? 'dias' : 'dia'}.</p>,
                        action_link: `https://carioca.rio/tema/itbi/`,
                        action_label: 'Gerar documento'
                    })
                } else {
                    deadlines.amarelos.push({
                        msg: <p>Atenção ao <b>Protocolo do ITBI</b> pendente.</p>,
                        action_link: `https://carioca.rio/tema/itbi/`,
                        action_label: 'Gerar documento'
                    })
                }
            }

            if (item.status_processo_id !== 6) {
                // ESCRITURA
                if (diasAteEscritura <= 0 && !item.comfirmacao_gerente) {
                    deadlines.vermelhos.push({
                        // DATA DA ESCRITURA ATRASADA SEM CONFIRMAÇÃO GERENTE
                        msg: <p>Prazo do <b>Recibo de Sinal atrasado</b> há {diasAteEscritura * -1} {diasAteEscritura < -1 ? 'dias uteis' : 'dia'}; Contrato venceu em <b>{daysjsDateEscritura.format('DD/MM/YYYY')}.</b></p>,
                        action_label: 'Agendar Escritura',
                        action_route: `posvenda/${item.processo_id}/status/`,
                        action_params: '5'
                    })
                } else if (!item.data_agenda_pos && diasAteEscritura < 6 && !item.comfirmacao_gerente) {
                    deadlines.laranjas.push({
                        // PRAZO DA ESCRITURA VENCENDO SEM AGENDAMENTO PELO PÓS
                        msg: <p>Prazo do <b>Recibo de sinal a vencer</b> em <b>{daysjsDateEscritura.format('DD/MM/YYYY')}</b>.Escritura não agendada.</p>,
                        action_label: 'Agendar Escritura',
                        action_route: `posvenda/${item.processo_id}/status/`,
                        action_params: '5'
                    })
                } else if (!item.data_agenda_pos && diasAteEscritura < 10 && !item.comfirmacao_gerente) {
                    deadlines.amarelos.push({
                        // PRAZO DA ESCRITURA VENCENDO SEM AGENDAMENTO PELO PÓS
                        msg: <p>Prazo do <b>Recibo de sinal a vencer</b> em <b>{daysjsDateEscritura.format('DD/MM/YYYY')}</b>.Escritura não agendada.</p>,
                        action_label: 'Agendar Escritura',
                        action_route: `posvenda/${item.processo_id}/status/`,
                        action_params: '5'
                    })
                };

                // BLOCO CERTIDÃO
                if (prazo >= diasAteEscritura) {
                    if (!item.certidao[0] && diasAteEscritura > 10 && diasAteEscritura < 31) {
                        deadlines.amarelos.push({
                            // NENHUM TIPO DE DOCUMENTO "CERTIDÃO" CADASTRADO NO PROCESSO E FALTA MENOS DE 31 DIAS PARA PRAZO DA ESCRITURA
                            // msg: <p><b>Nenhuma Certidão encontrada</b> escritura vence em <b>{diasAteEscritura} {diasAteEscritura > 1 ? 'dias' : 'dia'}</b>.</p>,
                            msg: <p><b>Nenhuma Certidão encontrada</b>. Prazo de Recibo de Sinal vence em <b>{daysjsDateEscritura.format('DD/MM/YYYY')}</b>.</p>,
                            action_route: `posvenda/${item.processo_id}/pedidos-servico/`,
                            action_label: 'Solicitar serviço'
                        })

                    } else if (!item.certidao[0] && diasAteEscritura > 0 && diasAteEscritura < 11) {
                        deadlines.laranjas.push({
                            // NENHUM TIPO DE DOCUMENTO "CERTIDÃO" CADASTRADO NO PROCESSO E FALTA MENOS DE 31 DIAS PARA PRAZO DA ESCRITURA
                            msg: <p><b>Nenhuma Certidão encontrada</b>. Prazo de Recibo de Sinal vence em <b>{daysjsDateEscritura.format('DD/MM/YYYY')}</b>.</p>,
                            action_route: `posvenda/${item.processo_id}/pedidos-servico/`,
                            action_label: 'Solicitar serviço'
                        })
                    } else if (!item.certidao[0] && diasAteEscritura <= 0 && !item.comfirmacao_gerente) {
                        deadlines.vermelhos.push({
                            // NENHUM TIPO DE DOCUMENTO "CERTIDÃO" CADASTRADO NO PROCESSO E DATA DE ESCRITURA VENCIDA SEM CONFIRMAÇÃO GERENTE
                            msg: <p>Prazo do <b>Recibo de Sinal vencido</b> em <b>{daysjsDateEscritura.format('DD/MM/YYYY')}</b>. Certidões não solicitadas.</p>,
                            action_route: `posvenda/${item.processo_id}/pedidos-servico/`,
                            action_label: 'Solicitar serviço'
                        })
                    } else if (item.certidao[0]) {
                        // CASO TENHA ALGUMA CERTIDÃO CADASTRADA
                        item.certidao.forEach((certidao) => {
                            if (certidao.data_validade) {
                                // DATA DE VALIDADE CADASTRADA NO SITEMA
                                const dataValidade = dayjs(certidao.data_validade);
                                const dateValidade = new Date(certidao.data_validade);
                                const diasAteVencerCOR = dataValidade.diff(daySelect, 'days'); // DIAS CORRIDOS
                                const diasAteVencerUT = differenceInBusinessDays(dateValidade, dateSelect); // DIAS UTEIS


                                const diasAteVencer = diasAteVencerCOR; // CHAVE PAR ALTERNAR ENTRE DIAS UTEIS E CORRIDOS (CERTIDÕES)
                                if (diasAteVencer <= 0) {
                                    deadlines.vermelhos.push({
                                        // TIPO DE DOCUMENTO CERTIDÃO COM DATA DE VALIDADE VENCIDA
                                        msg: <p><b>{certidao.tipo}</b> vencida <b>{diasAteVencer === 0 ? 'hoje' : `há ${diasAteVencer * -1} dia${diasAteVencer < -1 ? 's' : ''}`}</b>.</p>,
                                        action_route: `posvenda/${item.processo_id}/pedidos-servico/`,
                                        action_label: 'Solicitar nova certidão'
                                    })
                                }
                                else if (diasAteVencer <= 5) {
                                    deadlines.laranjas.push({
                                        // TIPO DE DOCUMENTO CERTIDÃO COM DATA DE VALIDADE FALTANDO MENOS DE 6 DIAS PARA VENCER
                                        msg: <p><b>{certidao.tipo}</b> vai vencer em <b>{diasAteVencer} dia{diasAteVencer > 1 ? 's' : ''}</b>.</p>,
                                        action_route: `posvenda/${item.processo_id}/pedidos-servico/`,
                                        action_label: 'Refrescar certidão'
                                    })
                                } else if (diasAteVencer <= 10) {
                                    deadlines.amarelos.push({
                                        // TIPO DE DOCUMENTO CERTIDÃO COM DATA DE VALIDADE FALTANDO MENOS DE 11 DIAS PARA VENCER
                                        msg: <p><b>{certidao.tipo}</b> vai vencer em <b>{diasAteVencer} dia{diasAteVencer > 1 ? 's' : ''}</b>.</p>,
                                        action_route: `posvenda/${item.processo_id}/pedidos-servico/`,
                                        action_label: 'Refrescar certidão'
                                    })
                                }

                            } else if (certidao.dias_prazo && certidao.data_entrada_documento) {
                                // DATA DE VALIDADE NÃO CADASTRADA NO SITEMA
                                // PARA TER UMA IDEIA DE DATA DE EMISSÃO PEGO A DATA CADASTRADA NO SISTEMA
                                const dataValidade = dayjs(certidao.data_entrada_documento).add(Number(certidao.dias_prazo), 'day');
                                const dateValidade = new Date(dataValidade.format());
                                const tempoCadastrado = daySelect.diff(dayjs(certidao.data_entrada_documento), 'day');
                                const diasAteVencerCOR = dataValidade.diff(daySelect, 'days'); // DIAS CORRIDOS
                                const diasAteVencerUT = differenceInBusinessDays(dateValidade, dateSelect); // DIAS UTEIS

                                const diasAteVencer = diasAteVencerCOR // CHAVE PAR ALTERNAR ENTRE DIAS UTEIS E CORRIDOS (CERTIDÕES SEM DATA DE VALIDADE CADASTRADA)
                                if (diasAteVencer <= 0) {
                                    deadlines.vermelhos.push({
                                        // TIPO DE DOCUMENTO CERTIDÃO PROVAVELMENTE VENCIDA
                                        msg: <p><b>{certidao.tipo}</b> está cadastrada no nosso sistema há <b>{tempoCadastrado} dia{tempoCadastrado > 1 ? 's' : ''}</b> e sua válidade é de <b>{certidao.dias_prazo} dias</b>.</p>,
                                        action_route: `posvenda/${item.processo_id}/pedidos-servico/`,
                                        action_label: 'Solicitar nova certidão'
                                    })
                                }
                                else if (diasAteVencer <= 5) {
                                    deadlines.laranjas.push({
                                        // TIPO DE DOCUMENTO CERTIDÃO SEM DATA DE VALIDADE FALTANDO MENOS DE 6 DIAS PARA VENCER
                                        msg: <p><b>{certidao.tipo}</b> está cadastrada no nosso sistema há <b>{tempoCadastrado} dia{tempoCadastrado > 1 ? 's' : ''}</b> e sua válidade é de <b>{certidao.dias_prazo} dias</b>.</p>,
                                        action_route: `posvenda/${item.processo_id}/pedidos-servico/`,
                                        action_label: 'Refrescar certidão'
                                    })
                                } else if (diasAteVencer <= 10) {
                                    deadlines.amarelos.push({
                                        // TIPO DE DOCUMENTO CERTIDÃO SEM DATA DE VALIDADE FALTANDO MENOS DE 11 DIAS PARA VENCER
                                        msg: <p><b>{certidao.tipo}</b> está cadastrada no nosso sistema há <b>{tempoCadastrado} dia{tempoCadastrado > 1 ? 's' : ''}</b> e sua válidade é de <b>{certidao.dias_prazo} dias</b>.</p>,
                                        action_route: `posvenda/${item.processo_id}/pedidos-servico/`,
                                        action_label: 'Refrescar certidão'
                                    })
                                }
                            }
                        })
                    }
                }
            };

            if (item.comfirmacao_gerente && diasAteEscritura === 5) {
                deadlines.amarelos.push({
                    // ESCRITURA CONFIRMADA PELO GERENTE
                    msg: <p><b>Escritura assinada</b> pelas partes em {daysjsDateEscritura.format('DD/MM/YYYY')}.</p>,
                    action_label: 'Solicitar serviço',
                    action_route: `posvenda/${item.processo_id}/pedidos-servico/`,
                    // action_params: '5'
                })
            };

            // RETORNO PARA ADICIONAR "deadline" EM CADA PROCESSO DO processByDate;            
            return item = {
                ...item,
                deadline: deadlines
            }
        });
        return processByDate;
    };

    const totalDeadlinesForDay = (day: number) => {
        const deadline = {
            amarelos: 0,
            laranjas: 0,
            vermelhos: 0
        };

        const month = dateSelect.month() + 1;
        const year = dateSelect.year();
        const stringDate = `${year}/${month}/${day}`
        const date = dayjs(stringDate);


        const processByDate = returnDeadLines(date, processNoFiltered.current);
        const deadLinesToDay = itemsSorting(processByDate);

        deadLinesToDay.forEach((e) => {
            deadline.amarelos += (e.deadline.amarelos.length || 0)
            deadline.laranjas += (e.deadline.laranjas.length || 0)
            deadline.vermelhos += (e.deadline.vermelhos.length || 0)
        });

        if (dateSelect.format('DD/MM/YYYY') === date.format('DD/MM/YYYY')) {
            // console.log(dateSelect.format('DD/MM/YYYY'));
            // console.log(deadline);
        }
        return deadline;
    };

    const getDeadlines = async (date: Dayjs, processRes: retornoApi[]) => {
        setLoading(true);

        const processByDate = returnDeadLines(date, processRes);
        const deadLinesToDay = itemsSorting(processByDate);
        processNoFiltered.current = processByDate;
        // console.log(deadLinesToDay);

        const arrListAdress = deadLinesToDay.map((e) => ({
            processo_id: e.processo_id,
            imovel_id: e.processo_id,
            logradouro: e.logradouro,
            numero: e.numero,
            complemento: e.complemento,
            unidade: e.unidade,
            bairro: e.uf,
            cidade: e.cidade
        }));

        if (!process[0]) {
            const deadline = {
                amarelos: 0,
                laranjas: 0,
                vermelhos: 0
            };

            deadLinesToDay.forEach((e) => {
                deadline.amarelos += (e.deadline.amarelos.length || 0)
                deadline.laranjas += (e.deadline.laranjas.length || 0)
                deadline.vermelhos += (e.deadline.vermelhos.length || 0)
            });
            setDeadLineHoje(deadline);
        }
        const procressFilter = filterEndereco(filters.endereco)
        setListAdress(arrListAdress)
        setProcess(procressFilter);
        setLoading(false);
    };

    useEffect(() => {
        getArrDatas();
    }, [dateSelect, process]);

    useEffect(() => {
        if (dateSelect && processNoFiltered) {
            getDeadlines(dateSelect, processNoFiltered.current);
        }
    }, [dateSelect])

    useEffect(() => {
        setLoading(true)
        getProcess();
        setUserName(localStorage.getItem('nome_usuario') || '');

        const intervalId = setInterval(() => {
            setTimeDifference(calculateTimeDifference());
        }, 60000); // Atualiza a cada minuto (60000 milissegundos)

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const calculateTimeDifference = (): string | null => {
        if (lastUpdated) {
            const minutesDifference = differenceInMinutes(new Date(), lastUpdated);
            return `${minutesDifference} minutos`;
        }
        return null;
    };

    const getMouth = (date: Dayjs | null) => {
        const number = dayjs(date).month();
        return arrMouth[number];
    };

    const getWeekDay = (day: number) => {
        const month = dateSelect.month();
        const year = dateSelect.year();
        const weekDayNumber = dayjs(`${year}/${month + 1}/${day}`).day();
        return arrWeek[weekDayNumber];
    };

    const onClickDay = (day: number) => {
        const year = dateSelect.year();
        const month = dateSelect.month() + 1;
        setDateSelect(dayjs(`${year}/${month}/${day}`));
    };

    const onClickMonth = (month: number) => {
        const year = dateSelect.year();
        const day = dateSelect.date();
        const currentDayjs = dayjs(); // Data atual
        const currentMonth = currentDayjs.month() + 1; // Mês atual (1 a 12)
        const currentDay = currentDayjs.date(); // Dia atual (1 a 31)
        const currentYear = currentDayjs.year();
        const mesJaneiroDezembro = 13; // Mês 13 para tratar o mês de janeiro
        
        // const dayTratado = month === 1
        //     ? day > 28 ? 28 : day
        //     : day > 30 ? 30 : dateSelect.date();

        // console.log('currentYear: ' , currentYear);
        // console.log('year: ' , dateSelect.year())

        const dayTratado = (month === currentMonth && currentYear === year) || (month === mesJaneiroDezembro && currentYear !== year) ? currentDay : 1
            ? day > 28 ? 28 : 1
            : day > 30 ? 30 : 1;

        setDateSelect(dayjs(`${year}/${month > 9 ? month : ('0' + month)}/${dayTratado > 9 ? dayTratado : ('0' + dayTratado)}`));
    };

    const handleFilterEndereco = (event: any, newValue: OptionData | string | null) => {
        const filter = filterEndereco(newValue);
        // setProcessFilter([...filter]);
        setProcess(filter);
        setFilters({ endereco: newValue });
    };

    const filterEndereco = (newValue: OptionData | string | null) => {
        let filter = processNoFiltered.current;

        if (typeof newValue === 'string') {
            filter = filter.filter((item) => item.logradouro.toLowerCase().includes(newValue.toLowerCase()))
        } else {
            if (newValue?.logradouro) {
                filter = filter.filter((item) => item.logradouro === newValue.logradouro);
            }
            if (newValue?.numero) {
                filter = filter.filter((item) => item.numero === newValue.numero);
            }
            if (newValue?.unidade) {
                filter = filter.filter((item) => item.unidade === newValue.unidade);
            }
        }
        const deadLinesToDay = itemsSorting(filter);
        return deadLinesToDay;
    };


    const filterByDeadlines = (deadlinesFilters: FilterDeadlinesType[], processList: retornoApi[]) => {
        const newList: retornoApi[] = processList;

        deadlinesFilters.forEach((e) => {
            arrDeadLines.forEach((item) => {
                if (item.key === e.value) item.disabled = e.checked ? 'enable' : 'hidden'
            })
        })
        return newList;
    };

    const onFilterByDeadlines = (e: ChangeEvent<HTMLInputElement>) => {
        const check = e.target.checked;
        const value = e.target.value as KeysType;
        const processList = filterEndereco(filters.endereco);
        filterDeadlines.forEach((filter) => {
            if (filter.value === value) {
                filter.checked = check;
            }
        });
        const newList = filterByDeadlines(filterDeadlines, processList);
        setProcess(newList);
        setFilterDeadlines([...filterDeadlines]);
    };

    const onFilterRespo = async (e: SelectChangeEvent<unknown>) => {
        const value = e.target.value as number;
        setFilterRespo(value);

        const processRes = await getAgendaPos(value || '');
        getDeadlines(dayjs(), processRes);
    };

    function stopBubbling(evt: MouseEvent<HTMLDivElement | HTMLAnchorElement, globalThis.MouseEvent>){
        evt.stopPropagation();
        evt.cancelable = true;
    }

    return (
        <div className="agenda-container posvenda">
            <div className="calendar-container">
                <div className="header-calendar" id="div-header">
                    <div className="tools-calendar">
                        <ButtonComponent
                            size={'small'}
                            variant={'outlined'}
                            name="date-now"
                            onClick={() => setDateSelect(dayjs())}
                            label={'Hoje'}
                        />
                        <ButtonComponent
                            size={'medium'}
                            variant={'text'}
                            name="setas"
                            onClick={() => onClickMonth((dateSelect?.month() || 0))}
                            label={''}
                            endIcon={<ChevronLeft />}
                        />
                        <ButtonComponent
                            size={'medium'}
                            variant={'text'}
                            name="mounth"
                            aria-controls={open ? 'date-calendar' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            startIcon={!dateSelect ? <CircularProgress size={20} /> : ''}
                            onClick={handleClick}
                            label={`${dateSelect ? getMouth(dateSelect) : ''} ${dateSelect.year()}`}
                        />
                        <ButtonComponent
                            size={'medium'}
                            variant={'text'}
                            name="setas"
                            onClick={() => onClickMonth((dateSelect?.month() || 0) + 2)}
                            label={''}
                            endIcon={<ChevronRight />}
                        />

                        <Menu
                            id="date-calendar"
                            aria-labelledby="date-calendar"
                            className="menu-date-calendar"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <LocalizationProvider
                                localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
                                dateAdapter={AdapterDayjs}
                                adapterLocale="pt-br"
                            >
                                <DateCalendar
                                    value={dateSelect}
                                    onChange={(newValue) => setDateSelect(newValue || dayjs())}
                                />
                            </LocalizationProvider>
                        </Menu>

                    </div>

                    <div className='atualizar-lista'>
                        <ButtonComponent
                            size={'medium'}
                            variant={'text'}
                            name={'atualizar-painel'}
                            onClick={() => getProcess()}
                            label={'Atualizar painel'}
                            endIcon={<HiArrowPath className={loading ? 'rotate' : ''} />}
                        />
                        <span>{lastUpdated ? `Há ${timeDifference}` : ''}</span>
                    </div>

                </div>
                <div className="carousel-calendar">
                    <SwipeableViews
                        axis={'x'}
                        index={dateSelect.date() - 1}
                        onChangeIndex={(e: any) => console.log("CHANGE: ", e)}
                        className='swipe-container'
                    // enableMouseEvents
                    >
                        {/* {arrMouth[dayjs().month() === 0 ? 11 : dayjs().month() - 1]} */}
                        {arrDatas.map((tab, index) => (
                            <div className={`day-carousel-container ${index === dateSelect.date() - 1 ? 'select' : ''}`} key={index}>
                                <div className="deadlines-container">
                                    {arrDeadLines.map((urgencia) => (
                                        <>
                                            {!!deadlinesMouth?.[tab - 1]?.deadlines[urgencia.key] &&
                                                <Chip className={`chip ${urgencia.color}`} label={deadlinesMouth?.[tab - 1]?.deadlines[urgencia.key]} />
                                            }
                                        </>
                                    ))}
                                </div>
                                <Button className={`btn-day`} onClick={() => onClickDay(tab)}>
                                    <p>{getWeekDay(tab)}</p>
                                    <span>{tab}</span>
                                </Button>
                            </div>
                        ))}
                        {/* {arrMouth[dayjs().month() === 11 ? 1 : dayjs().month() + 1]} */}
                    </SwipeableViews>

                </div>
            </div>

            <div className="content-container">
                <Paper className="paper eventos" elevation={0}>
                    <Image src={AgendaImg} alt="agenda" />

                    <div className="name-container">
                        <h1>{!!userName && userName + ', '} administre seus prazos com mais facilidade</h1>
                        {(!!deadLineHoje.amarelos || !!deadLineHoje.vermelhos || !!deadLineHoje.laranjas) && <span>
                            Hoje você tem:
                            {!!deadLineHoje?.vermelhos &&
                                <>
                                    <span className="red"> {deadLineHoje?.vermelhos} </span>
                                    {deadLineHoje?.vermelhos > 1 ? 'prazos atrasados' : 'prazo atrasado'}
                                    {(!!deadLineHoje?.laranjas || !!deadLineHoje?.amarelos) && ', '}
                                </>
                            }

                            {!!deadLineHoje?.laranjas &&
                                <>
                                    <span className="orange"> {deadLineHoje?.laranjas} </span>
                                    {deadLineHoje?.laranjas > 1 ? 'prazos a vencer' : 'prazo a vencer'}
                                    {!!deadLineHoje?.amarelos && ', '}
                                </>
                            }

                            {!!deadLineHoje?.amarelos &&
                                <>
                                    <span className="yellow"> {deadLineHoje?.amarelos} </span>
                                    {deadLineHoje?.amarelos > 1 ? 'prazos que exigem' : 'prazo que exige'} atenção
                                </>
                            }

                            .
                        </span>}
                        {!deadLineHoje?.amarelos && !deadLineHoje?.laranjas && !deadLineHoje?.vermelhos &&
                            <span>Você está em dia. Parabéns!</span>
                        }
                    </div>

                </Paper>

                <div className="process-container">
                    <div className="list-process">
                        <AutoComplete options={listAdress} value={filters.endereco} onChange={handleFilterEndereco} disabled={loading} />
                        <Paper className="paper enderecos">
                            {dateSelect &&
                                <div>
                                    <div className="header-date">
                                        <p className="date">{dateSelect.date()} de {arrMouth[dateSelect.month() || 0]}, {arrWeekNames[dateSelect.day()]}</p>

                                        <div className="check-container">
                                            {filterDeadlines.map((filter, index) => (
                                                <CheckBox
                                                    label={filter.label}
                                                    value={filter.value}
                                                    checked={filter.checked}
                                                    key={index}
                                                    onChange={onFilterByDeadlines}
                                                />
                                            ))}

                                            {user?.perfil === 'Coordenadora de Pós-Negociação' &&
                                                <InputSelect
                                                    label={"Filtro Responsavel"}
                                                    name={"filtro_respo"}
                                                    value={filterRespo || ''}
                                                    onChange={onFilterRespo}
                                                    option={posvendaList}
                                                    divClass="small"
                                                />
                                            }
                                        </div>
                                    </div>

                                    <Divider />

                                    {loading
                                        ? <SkeletonAgendaRow />
                                        : process?.map(item => {
                                            return (
                                                <div
                                                    className={
                                                        `adress-container 
                                                        ${(arrDeadLines.some(filtro => isHidden(item, filtro, arrDeadLines))) ? 'hidden' : ''
                                                        }`
                                                    }
                                                    key={item.processo_id}
                                                    // onClick={(e) => [stopBubbling(e), route.push(`/posvenda/${item.processo_id}/detalhes-venda`)]}
                                                >
                                                    <div className="header-adress">
                                                        <p className="cursorClick" onClick={(e) => [stopBubbling(e), route.push(`/posvenda/${item.processo_id}/detalhes-venda`)]}>
                                                            {item.logradouro.replace('Rua', 'R.').replace("Avenida", 'Av.')}
                                                            {item.numero && ', ' + item.numero}
                                                            {item.unidade && ' - ' + item.unidade}
                                                            {item.complemento && ' - ' + item.complemento}
                                                            {item.cidade && ' - ' + item.cidade}
                                                            {item.uf && ' / ' + item.uf}
                                                            { }
                                                        </p>
                                                        <div className="chips-container">
                                                            <Chip className="chip neutral" label={item.nome_responsavel_02} />
                                                            {arrDeadLines.map((urgencia) => (
                                                                <>
                                                                    {!!item.deadline?.[urgencia.key][0] &&
                                                                        <Chip
                                                                            className={`chip ${urgencia.color}`}
                                                                            label={`${item.deadline?.[urgencia.key].length} ${urgencia.label.toLowerCase()}${item.deadline?.[urgencia.key].length > 1 && urgencia.key === 'vermelhos' ? 'S' : ''}`}
                                                                        />}
                                                                </>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {arrDeadLines.map((urgencia) => (
                                                        item.deadline?.[urgencia.key].map((e, index) => (
                                                            <div className={`deadline-row ${urgencia.disabled}`} key={index}>
                                                                <div className={`chip ${urgencia.color}`}>
                                                                    <div className="svg"><HiExclamationCircle size={20} /></div>
                                                                    {e.msg}
                                                                </div>
                                                                {!!e.action_route &&
                                                                    <ButtonComponent
                                                                        size={"small"}
                                                                        variant={"contained"}
                                                                        onClick={() => actionRoute(e.action_route, e.action_params)}
                                                                        label={e.action_label || ''}
                                                                        labelColor="white"
                                                                    />
                                                                }
                                                                {!!e.action_link &&
                                                                    <Link
                                                                        href={e.action_link}
                                                                        target="blank"
                                                                        className="site"
                                                                        onClick={(e) => stopBubbling(e)}
                                                                    >
                                                                        <ButtonComponent
                                                                            size={"small"}
                                                                            variant={"contained"}
                                                                            label={e.action_label || ''}
                                                                            labelColor="white"
                                                                        />
                                                                    </Link>
                                                                }
                                                            </div>
                                                        ))
                                                    ))}
                                                </div>
                                            )
                                        })}

                                </div>}

                        </Paper>
                    </div>
                </div>

            </div>


            <div className="agenda-footer" style={{ width: widthDiv }}>
                {dateSelect && <p className="date">{dateSelect.date()} de {arrMouth[dateSelect.month() || 0]}, {arrWeekNames[dateSelect.day()]}</p>}
                {arrDeadLines.map((urgencia) => (
                    <div className="count-container" key={urgencia.key}>
                        {!!deadlinesMouth?.find(e => e.dia === dateSelect.date())?.deadlines[urgencia.key] &&
                            <>
                                <Chip className={`chip ${urgencia.color}`} label={deadlinesMouth?.find(e => e.dia === dateSelect.date())?.deadlines[urgencia.key]} />
                                <span className={urgencia.color}>
                                    {urgencia.label}
                                    {dateSelect.date() && urgencia.key === 'vermelhos' && deadlinesMouth.find(e => e.dia === dateSelect.date())?.deadlines[urgencia.key] as number > 1 ? 's' : ''}
                                </span>

                            </>
                        }
                    </div>
                ))}

            </div>

        </div>
    )
};

export default AgendaPosVenda;