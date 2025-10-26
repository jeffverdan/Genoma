import { DeadlineTypes } from "@/interfaces/PosVenda/Agenda";
import DataRows from "@/interfaces/PosVenda/DadosPainelTeste";
import { differenceInBusinessDays } from "date-fns";
import dayjs, { Dayjs } from "dayjs";
import { ArrDocs, retornoApi } from '@/interfaces/PosVenda/Agenda';


const arrDeadLines = [
    { label: 'Atenção', labelSingular: 'Prazo que exige atenção', labelPlural: 'Prazos que exigem atenção', key: 'amarelos', color: 'yellow', disabled: 'enable' },
    { label: 'A Vencer', labelSingular: 'Prazo que está vencendo', labelPlural: 'Prazos que estão vencendo', key: 'laranjas', color: 'orange', disabled: 'enable' },
    { label: 'Atrasado', labelSingular: 'Prazo que está vencido', labelPlural: 'Prazos que estão vencidos', key: 'vermelhos', color: 'red', disabled: 'enable' },
] as const;

const tratamentoApiMapaPrioridades = (item: retornoApi) => {
    console.log(item);
    if(!item) return;
    const dataFormat = item.data_assinatura ? (`${item.data_assinatura.split('/')[2]}-${item.data_assinatura.split('/')[1]}-${item.data_assinatura.split('/')[0]}`) : '';
    const date = dayjs(dataFormat).add(Number(item.prazo_escritura), 'd');
    console.log('Data e Prazo', dataFormat, Number(item.prazo_escritura));    
    
    const itbiDocs = item.certidao?.filter((doc) => doc.tipo.includes('ITBI'));
    const certidoes = item.certidao?.filter((doc) => !doc.tipo.includes('ITBI'));

    const documentosFiltradosTiposRepetidos = certidoes?.reduce<Record<number, ArrDocs>>((acc, doc) => {
        const existingDoc = acc[Number(doc.id_dono_documento)];

        if (!existingDoc || doc.id_dono_documento !== existingDoc.id_dono_documento) {
            acc[Number(doc.id_dono_documento)] = doc;
        } else if (doc.id_dono_documento === existingDoc.id_dono_documento) {
            if (new Date(doc.data_entrada_documento) > new Date(existingDoc.data_entrada_documento)) {
                acc[Number(doc.id_dono_documento)] = doc;
            }
        }
        return acc;
    }, {});

    const documentosFiltrados = itbiDocs?.reduce<Record<number, ArrDocs>>((acc, doc) => {
        const existingDocITBI = acc[doc.id];

        if (!existingDocITBI || new Date(doc.data_validade || doc.data_entrada_documento) > new Date(existingDocITBI.data_validade || existingDocITBI.data_entrada_documento)) {
            acc[doc.id] = doc;
        }
        return acc;
    }, {});

    console.log(itbiDocs);
    console.log(documentosFiltrados ? Object.values(documentosFiltrados) : documentosFiltrados);


    return item = {
        ...item,
        dataEscritura: date,
        dataEscrituraFormat: date.format('DD/MM/YYYY'),
        itbi: documentosFiltrados ? Object.values(documentosFiltrados) : documentosFiltrados,
        certidao: documentosFiltradosTiposRepetidos ? Object.values(documentosFiltradosTiposRepetidos) : documentosFiltradosTiposRepetidos
    }
};

function returnDeadLines(daySelect: Dayjs, item?: retornoApi): DeadlineTypes {
    const dateSelect = new Date(daySelect.format('YYYY/MM/DD'));
    const deadlines: DeadlineTypes = {
        vermelhos: [],
        laranjas: [],
        amarelos: []
    };

    if (!daySelect || !item) return deadlines;
    console.log(item.processo_id || item.id);
    const dataAnalisePos = new Date(item.data_analise);
    const diaDaAnalisePos = differenceInBusinessDays(dateSelect, dataAnalisePos);
    const daysjsDateEscritura = dayjs(
        item.data_reagendada_gerente ? item.data_reagendada_gerente :
            item.data_agenda_pos ? item.data_agenda_pos : item.dataEscritura ? item.dataEscritura.format() : ''
    );
    
    if (daysjsDateEscritura) {
        const dateEscritura = new Date(daysjsDateEscritura.format('YYYY/MM/DD'));
        const diasAteEscrituraCOR = dayjs(dateEscritura).diff(daySelect, 'days'); // DIAS CORRIDOS
        const prazo = Number(item.prazo_escritura);
        const diasAteEscrituraUT = differenceInBusinessDays(dateEscritura, dateSelect); // DIAS UTEIS
        const diasAteEscritura = diasAteEscrituraUT; // CHAVE PAR ALTERNAR ENTRE DIAS UTEIS E CORRIDOS (ESCRITURA e ITBI)
        console.log("Dias até escritura: ",diasAteEscritura);
        
        const guiaItbi = item.itbi?.find((e) => Number(e.id) === 2);

        //BLOCO ITBI
        console.log('ITEM ITBI: ' , item.itbi);
        console.log('GUIA ITBI: ' , guiaItbi);

        if (!!item.itbi?.[0] && !guiaItbi) {
            // PROTOCOLO DE ITBI CADASTRADO SEM GUIA DE ITBI NO SISTEMA
            item.itbi.forEach((protocolo) => {
                const dataValidade = dayjs(protocolo.data_validade);
                const dateValidade = new Date(protocolo.data_validade);
                const diasAteVencerCOR = dataValidade.diff(daySelect, 'days'); // DIAS CORRIDOS
                const diasAteVencerUT = differenceInBusinessDays(dateValidade, dateSelect); // DIAS UTEIS

                const diasAteVencer = diasAteVencerCOR; // CHAVE PAR ALTERNAR ENTRE DIAS UTEIS E CORRIDOS (CERTIDÕES)

                if (diasAteVencer <= 0) {
                    deadlines.vermelhos.push({
                        msg: <p><b>Protocolo de ITBI</b> aponta vencimento da Guia {diasAteVencer < 0 ? 'há ' + (diasAteVencer * -1) + ' dias' : 'hoje'}.</p>,
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
                    action_route: `posvenda/${item.processo_id || item.id}/status/`,
                    action_params: '5'
                })
            } else if (!item.data_agenda_pos && diasAteEscritura < 6 && !item.comfirmacao_gerente) {
                deadlines.laranjas.push({
                    // PRAZO DA ESCRITURA VENCENDO SEM AGENDAMENTO PELO PÓS
                    msg: <p>Prazo do <b>Recibo de sinal a vencer</b> em <b>{daysjsDateEscritura.format('DD/MM/YYYY')}</b>.Escritura não agendada.</p>,
                    action_label: 'Agendar Escritura',
                    action_route: `posvenda/${item.processo_id || item.id}/status/`,
                    action_params: '5'
                })
            } else if (!item.data_agenda_pos && diasAteEscritura < 10 && !item.comfirmacao_gerente) {
                deadlines.amarelos.push({
                    // PRAZO DA ESCRITURA VENCENDO SEM AGENDAMENTO PELO PÓS
                    msg: <p>Prazo do <b>Recibo de sinal a vencer</b> em <b>{daysjsDateEscritura.format('DD/MM/YYYY')}</b>.Escritura não agendada.</p>,
                    action_label: 'Agendar Escritura',
                    action_route: `posvenda/${item.processo_id || item.id}/status/`,
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
                        action_route: `posvenda/${item.processo_id || item.id}/pedidos-servico/`,
                        action_label: 'Solicitar serviço'
                    })

                } else if (!item.certidao[0] && diasAteEscritura > 0 && diasAteEscritura < 11) {
                    deadlines.laranjas.push({
                        // NENHUM TIPO DE DOCUMENTO "CERTIDÃO" CADASTRADO NO PROCESSO E FALTA MENOS DE 31 DIAS PARA PRAZO DA ESCRITURA
                        msg: <p><b>Nenhuma Certidão encontrada</b>. Prazo de Recibo de Sinal vence em <b>{daysjsDateEscritura.format('DD/MM/YYYY')}</b>.</p>,
                        action_route: `posvenda/${item.processo_id || item.id}/pedidos-servico/`,
                        action_label: 'Solicitar serviço'
                    })
                } else if (!item.certidao[0] && diasAteEscritura <= 0 && !item.comfirmacao_gerente) {
                    deadlines.vermelhos.push({
                        // NENHUM TIPO DE DOCUMENTO "CERTIDÃO" CADASTRADO NO PROCESSO E DATA DE ESCRITURA VENCIDA SEM CONFIRMAÇÃO GERENTE
                        msg: <p>Prazo do <b>Recibo de Sinal vencido</b> em <b>{daysjsDateEscritura.format('DD/MM/YYYY')}</b>. Certidões não solicitadas.</p>,
                        action_route: `posvenda/${item.processo_id || item.id}/pedidos-servico/`,
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
                                    action_route: `posvenda/${item.processo_id || item.id}/pedidos-servico/`,
                                    action_label: 'Solicitar nova certidão'
                                })
                            }
                            else if (diasAteVencer <= 5) {
                                deadlines.laranjas.push({
                                    // TIPO DE DOCUMENTO CERTIDÃO COM DATA DE VALIDADE FALTANDO MENOS DE 6 DIAS PARA VENCER
                                    msg: <p><b>{certidao.tipo}</b> vai vencer em <b>{diasAteVencer} dia{diasAteVencer > 1 ? 's' : ''}</b>.</p>,
                                    action_route: `posvenda/${item.processo_id || item.id}/pedidos-servico/`,
                                    action_label: 'Refrescar certidão'
                                })
                            } else if (diasAteVencer <= 10) {
                                deadlines.amarelos.push({
                                    // TIPO DE DOCUMENTO CERTIDÃO COM DATA DE VALIDADE FALTANDO MENOS DE 11 DIAS PARA VENCER
                                    msg: <p><b>{certidao.tipo}</b> vai vencer em <b>{diasAteVencer} dia{diasAteVencer > 1 ? 's' : ''}</b>.</p>,
                                    action_route: `posvenda/${item.processo_id || item.id}/pedidos-servico/`,
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
                                    action_route: `posvenda/${item.processo_id || item.id}/pedidos-servico/`,
                                    action_label: 'Solicitar nova certidão'
                                })
                            }
                            else if (diasAteVencer <= 5) {
                                deadlines.laranjas.push({
                                    // TIPO DE DOCUMENTO CERTIDÃO SEM DATA DE VALIDADE FALTANDO MENOS DE 6 DIAS PARA VENCER
                                    msg: <p><b>{certidao.tipo}</b> está cadastrada no nosso sistema há <b>{tempoCadastrado} dia{tempoCadastrado > 1 ? 's' : ''}</b> e sua válidade é de <b>{certidao.dias_prazo} dias</b>.</p>,
                                    action_route: `posvenda/${item.processo_id || item.id}/pedidos-servico/`,
                                    action_label: 'Refrescar certidão'
                                })
                            } else if (diasAteVencer <= 10) {
                                deadlines.amarelos.push({
                                    // TIPO DE DOCUMENTO CERTIDÃO SEM DATA DE VALIDADE FALTANDO MENOS DE 11 DIAS PARA VENCER
                                    msg: <p><b>{certidao.tipo}</b> está cadastrada no nosso sistema há <b>{tempoCadastrado} dia{tempoCadastrado > 1 ? 's' : ''}</b> e sua válidade é de <b>{certidao.dias_prazo} dias</b>.</p>,
                                    action_route: `posvenda/${item.processo_id || item.id}/pedidos-servico/`,
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
                action_route: `posvenda/${item.processo_id || item.id}/pedidos-servico/`,
                // action_params: '5'
            })
        };
    };
    
    return deadlines;
};

export { returnDeadLines, arrDeadLines, tratamentoApiMapaPrioridades }
