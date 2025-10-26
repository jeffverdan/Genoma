import { Avatar, Checkbox, Chip, CircularProgress, FormControlLabel, FormGroup, Menu } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ButtonComponent from '../ButtonComponent';
import { FaFilter } from 'react-icons/fa';
import getPosVendaResp from '@/apis/getPosVendaResp';
import getListStatus from '@/apis/getListStatus';
import getListGerentesPosVenda from '@/apis/getListGerentesPosVenda';
import { FiltersKeys, FiltersToolbar, FiltersType } from './interfaces';
import getLojas from '@/apis/getLojas';
import ListaStatusFinanceiro from '@/apis/getListaStatusFinanceiro';

type Props = {
    setSelectFilters: React.Dispatch<React.SetStateAction<FiltersToolbar>>
    selectFilters: FiltersToolbar
    returnList: (idArrayVendas?: number) => Promise<void>
    gerente?: boolean
    formaPagamento?: boolean
    posVenda?: boolean
    statusRascunho?: boolean
    status?: boolean
    modoRecibo?: boolean
    correcoes?: boolean
    orderBy?: 'pos-venda'
    selectedIndex?: number
    tipoVenda?: boolean
    lojas?: boolean
    tab?: number
    solicitacaoOnus?: boolean
    certidoesComarca?: boolean
    laudemio?: boolean
    prazo?: boolean //Prazo do Status
    perfilFinanceiro?: boolean // Estilização para painel de financeiro
    statusFinanceiroFilter?: boolean // Filtro de Status Financeiro
    localStorageKey?: string
}

type PropsFormControl = {
    arrList: FiltersType[],
    refreshList: () => void,
    LabelElement?: (props: labelProps) => JSX.Element
    avatar?: boolean
    handleCheck: (e: boolean, pessoa: FiltersType, filter: FiltersKeys) => void
    filter: FiltersKeys
}

interface labelProps {
    children: string
}

const returnNameGerente = (name: string) => {
    let nameAbv = name.split(' ')[0];
    if (name.split(' ')?.[1]) {
        nameAbv = nameAbv + " " + (name.split(' ')[1].length > 2 ? name.split(' ')[1][0]?.toUpperCase() : name.split(' ')[2][0]?.toUpperCase()) + '.';
    }
    return nameAbv;
};

const FormControlCheck = (props: PropsFormControl) => {
    const { arrList, LabelElement, avatar, handleCheck, filter } = props;

    function stringToColor(string: string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
        return color;
    };

    function stringAvatar(name: string) {
        name = returnNameGerente(name);
        return {
            sx: {
                bgcolor: stringToColor(name),
                width: 24,
                height: 24,
                padding: 1,
                fontSize: 12
            },
            children: `${name.split(' ')[0]?.[0]}${name.split(' ')[1]?.[0]}`,
        };
    };

    return (
        <FormGroup className='form-col'>
            {arrList.map((pessoa, index) => (
                <FormControlLabel
                    key={index}
                    control={<Checkbox className='check' size='small' checked={pessoa.check} />}
                    label={
                        <div className='label-container'>
                            {!!avatar && <Avatar  {...stringAvatar(pessoa.label.toUpperCase())} />}
                            {LabelElement 
                                ? <LabelElement>{pessoa.label}</LabelElement>
                                : <Chip label={pessoa.label} className={`chip ${pessoa.color ? pessoa.color : 'primary'}`} />
                            }
                        </div>
                    }
                    onChange={(e: any) => handleCheck(e.target.checked, pessoa, filter)}
                    className='form-row'
                />
            ))}
        </FormGroup>
    )
}

export default function Filters(props: Props) {
    const { returnList, setSelectFilters, selectFilters, gerente, posVenda, status, formaPagamento, statusRascunho, modoRecibo, correcoes, orderBy, selectedIndex, tipoVenda, lojas, tab, solicitacaoOnus, certidoesComarca, laudemio, perfilFinanceiro, statusFinanceiroFilter, localStorageKey } = props;
    const [anchorMenu, setAnchorMenu] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorMenu);
    const [currentCount, setCurrentCount] = useState<NodeJS.Timeout>();
    const [userProfile, setUserProfile] = useState("");
    const [loadingList, setLoadingList] = useState(false);
    const localKey = localStorageKey ? localStorageKey : Number(tab) >= 0 ? `filters_${tab}` : 'filters_posvenda';

    useEffect(() => {
        setUserProfile(localStorage.getItem('perfil_login') || '');
    }, []);

    // console.log('selectFilters 1: ', selectFilters)


    // LISTAS
    const [gerentesList, setGerentesList] = useState<FiltersType[]>([]);
    const [posvendaList, setPosvendaList] = useState<FiltersType[]>([]);
    const [lojasList, setLojasList] = useState<FiltersType[]>([]);
    const [statusList, setStatusList] = useState<FiltersType[]>([]);
    const [statusFinanceiro, setStatusFinanceiro] = useState<FiltersType[]>([]);
    const [statusRascunhoList, setStatusRascunhoList] = useState<FiltersType[]>([
        { id: '1', label: 'FAZENDO', check: false },
        { id: '2', label: 'PRONTO', check: false },
    ]);
    const [formPagamentoList, setFormPagamentoList] = useState<FiltersType[]>([
        { id: '1', label: 'À VISTA', check: false },
        { id: '2', label: 'FINANCIAMENTO', check: false },
        { id: '3', label: 'FGTS', check: false },
        { id: '4', label: 'CONSORCIO', check: false },
        { id: '5', label: 'PARCELAMENTO', check: false },
        { id: '6', label: 'PIX', check: false },
    ]);
    const [modosRecibosList, setModosRecibosList] = useState<FiltersType[]>([
        { id: 'manual', label: 'Manual', check: false },
        { id: 'docusign', label: 'DocuSign', check: false },
    ]);
    const [correcoesList, setCorrecoesList] = useState<FiltersType[]>([
        { id: 'imovel', label: 'Imóvel', check: false },
        { id: 'vendedor', label: 'Vendedores', check: false },
        { id: 'comprador', label: 'Compradores', check: false },
        { id: 'recibo', label: 'Recibo de Sinal', check: false },
        // { id: 'comissao', label: 'Comissão', check: false },
    ]);

    const [tipoVendaApoio, setTipoVendaApoio] = useState<FiltersType[]>([
        { id: 'Integral', label: 'Integral', check: false },
        { id: 'Parcelada', label: 'Parcelada', check: false },
        // { id: 'comissao', label: 'Comissão', check: false },
    ]);

    const [solicitacaoOnusNucleo, setSolicitacaoOnusNucleo] = useState<FiltersType[]>([
        { id: '1', label: 'Solicitada', check: false },
        { id: '0', label: 'No aguardo', check: false },
        // { id: 'comissao', label: 'Comissão', check: false },
    ]);

    const [certidoesComarcaNucleo, setCertidoesComarcaNucleo] = useState<FiltersType[]>([
        { id: '1', label: 'Sim', check: false },
        { id: '0', label: 'Não', check: false },
        // { id: 'comissao', label: 'Comissão', check: false },
    ]);

    const [tipoLaudemio, setTipoLaudemio] = useState<FiltersType[]>([
        { id: 'prefeitura', label: 'Prefeitura', check: false },
        { id: 'uniao', label: 'União', check: false },
        { id: 'familia', label: 'Família', check: false },
        { id: 'igreja', label: 'Igreja', check: false },
        // { id: 'comissao', label: 'Comissão', check: false },
    ]);

    const [prazoStatus, setPrazoStatus] = useState<FiltersType[]>([
        { id: 'em_dia', label: 'Em dia', check: false },
        { id: 'alerta', label: 'Em alerta', check: false },
        { id: 'atrasados', label: 'Vencidos', check: false },
    ]);

    const returnTipo = () => {
        if (selectedIndex === 3) return 'andamento';
        if (selectedIndex === 4) return 'revisao';
        if (selectedIndex === 5) return 'concluidos';
        if (selectedIndex === 6) return 'cancelados';
    };

    const loadRefreshList = async () => {
        setLoadingList(true);
        if (gerentesList.length > 0) {
            const gerentes = await getListGerentesPosVenda({ tipo_listagem: returnTipo() }) as unknown as FiltersType[];
            setGerentesList(gerentes || []);
        }
        if (posvendaList.length > 0) {
            const responsaveis = await getPosVendaResp(returnTipo()) as unknown as FiltersType[];
            setPosvendaList(responsaveis || []);
        }
        setLoadingList(false);
    };

    const loadLists = async () => {
        if (loadingList) return '';

        setLoadingList(true);
        const filters = localStorage.getItem(localKey) || '';
        const objFilters: FiltersToolbar = filters ? JSON.parse(filters) : [];

        if (solicitacaoOnus) {
            const objFilter = objFilters.filtro_solicitacao_onus || [];

            if (objFilter.length === 0) solicitacaoOnusNucleo.forEach(e => e.check = false);
            solicitacaoOnusNucleo?.forEach((e) => {
                objFilter.forEach(value => {
                    if (e.id === value.id) e.check = true
                })
            });
            setSolicitacaoOnusNucleo(solicitacaoOnusNucleo);
        }

        if (certidoesComarca) {
            const objFilter = objFilters.filtro_certidoes_comarca || [];

            if (objFilter.length === 0) certidoesComarcaNucleo.forEach(e => e.check = false);
            certidoesComarcaNucleo?.forEach((e) => {
                objFilter.forEach(value => {
                    if (e.id === value.id) e.check = true
                })
            });
            setCertidoesComarcaNucleo(certidoesComarcaNucleo);
        }

        if (tipoLaudemio) {
            const objFilter = objFilters.filtro_laudemio || [];

            if (objFilter.length === 0) tipoLaudemio.forEach(e => e.check = false);
            tipoLaudemio?.forEach((e) => {
                objFilter.forEach(value => {
                    if (e.id === value.id) e.check = true
                })
            });
            setTipoLaudemio(tipoLaudemio);
        }

        if (prazoStatus) {
            const objFilter = objFilters.filtro_prazo_status || [];

            if (objFilter.length === 0) prazoStatus.forEach(e => e.check = false);
            prazoStatus?.forEach((e) => {
                objFilter.forEach(value => {
                    if (e.id === value.id) e.check = true
                })
            });
            setPrazoStatus(prazoStatus);
        }

        if (tipoVenda) {
            const objFilter = objFilters.filtro_tipo_venda || [];

            if (objFilter.length === 0) tipoVendaApoio.forEach(e => e.check = false);
            tipoVendaApoio?.forEach((e) => {
                objFilter.forEach(value => {
                    if (e.id === value.id) e.check = true
                })
            });
            setTipoVendaApoio(tipoVendaApoio);
        }

        if (posVenda) {
            const objFilter = objFilters.filtro_responsavel || [];
            const responsaveis = posvendaList.length === 0 ? await getPosVendaResp(returnTipo()) as unknown as FiltersType[] : posvendaList;
            if (objFilter.length === 0) responsaveis?.forEach(e => e.check = false);
            responsaveis?.forEach((e) => {
                objFilter.forEach(value => {
                    if (e.id === value.id) e.check = true
                })
            });
            setPosvendaList(responsaveis || []);
        }

        if (statusList) {
            const objFilter = objFilters.filtro_status || [];
            const statusApi = statusList.length === 0 ? await getListStatus() as unknown as FiltersType[] : statusList;
            if (objFilter.length === 0) statusApi?.forEach(e => e.check = false);
            statusApi?.forEach((e) => {
                objFilter.forEach(value => {
                    if (e.id === value.id) e.check = true
                })
            });

            // Remove do array os status de Finalizados e Cancelados 
            const statusApiFilter = statusApi?.filter((status: any) => status.id !== 7 && status.id !== 27)

            setStatusList(statusApiFilter || []);
        }
        if (statusFinanceiro) {
            const objFilter = objFilters.filtro_status_financeiro || [];
            const statusApi = statusFinanceiro.length === 0 ? await ListaStatusFinanceiro() as unknown as FiltersType[] : statusFinanceiro;
            if(objFilter.length === 0) statusApi?.forEach(e => e.check = false);
            statusApi?.forEach((e) => { 
                objFilter.forEach(value => {
                    if (e.id === value.id) e.check = true
            })});
            
            setStatusFinanceiro(statusApi || []);
        }
        if (formaPagamento) {
            const objFilter = objFilters.filtro_pagamento || [];
            if (objFilter.length === 0) formPagamentoList?.forEach(e => e.check = false);
            formPagamentoList?.forEach((e) => {
                objFilter.forEach(value => {
                    if (e.id === value.id) e.check = true
                })
            });
            setFormPagamentoList(formPagamentoList || []);
        }
        if (statusRascunho) {
            const objFilter = objFilters.filtro_status_rascunho || [];
            if (objFilter.length === 0) statusRascunhoList?.forEach(e => e.check = false);
            statusRascunhoList?.forEach((e) => {
                objFilter.forEach(value => {
                    if (e.id === value.id) e.check = true
                })
            });
            setStatusRascunhoList(statusRascunhoList || []);
        }
        if (modoRecibo) {
            const objFilter = objFilters.filtro_recibo || [];
            if (objFilter.length === 0) modosRecibosList?.forEach(e => e.check = false);
            modosRecibosList?.forEach((e) => {
                objFilter.forEach(value => {
                    if (e.id === value.id) e.check = true
                })
            });
            setModosRecibosList(modosRecibosList || []);
        }
        if (correcoes) {
            const objFilter = objFilters.filtro_correcoes || [];
            if (objFilter.length === 0) correcoesList?.forEach(e => e.check = false);
            correcoesList?.forEach((e) => {
                objFilter.forEach(value => {
                    if (e.id === value.id) e.check = true
                })
            });
            setCorrecoesList(correcoesList || []);
        }

        if (lojas) {
            const objFilter = objFilters.filtro_loja || [];
            const lojas = lojasList.length === 0 ? await getLojas() as unknown as FiltersType[] : lojasList;
            if (objFilter.length === 0) lojas.forEach(e => e.check = false);
            lojas?.forEach((e) => {
                objFilter.forEach(value => {
                    if (e.id === value.id) e.check = true
                })
            });


            setLojasList(lojas || []);
        }

        if (gerente) {
            const objFilter = objFilters.filtro_gerente || [];
            const gerentes = gerentesList.length > 0 ? gerentesList : await getListGerentesPosVenda({ tipo_listagem: returnTipo() }) as unknown as FiltersType[];
            gerentes?.forEach((e) => {
                objFilter.forEach(value => {
                    if (e.id === value.id) e.check = true
                })
            });
            setGerentesList(gerentes || []);
        }        
        setLoadingList(false);
    };

    
    useEffect(() => {
        const value = (Object.keys(selectFilters) as FiltersKeys[]).some(chave => {
            if (!!selectFilters[chave]?.[0]) return true
        });
        if (!value) unCheckList();
        loadLists();
        
    }, [selectFilters, gerente, posVenda, correcoes, tab]);

    useEffect(() => {        
        loadRefreshList();
    }, [selectedIndex]);

    useEffect(() => {
        const syncChecks = () => {
            // Sincroniza os checks para o filtro de Gerentes
            if (gerente) {
                gerentesList.forEach((e) => {
                    e.check = selectFilters.filtro_gerente?.some((f) => f.id === e.id) || false;
                });
            }

            // Sincroniza os checks para o filtro de Pós-venda
            if (posVenda) {
                posvendaList.forEach((e) => {
                    e.check = selectFilters.filtro_responsavel?.some((f) => f.id === e.id) || false;
                });
            }

            // Sincroniza os checks para o filtro de Lojas
            if (lojas) {
                lojasList.forEach((e) => {
                    e.check = selectFilters.filtro_loja?.some((f) => f.id === e.id) || false;
                });
            }

            // Sincroniza os checks para o filtro de Status
            if (status) {
                statusList.forEach((e) => {
                    e.check = selectFilters.filtro_status?.some((f) => f.id === e.id) || false;
                });
            }

            // Sincroniza os checks para o filtro de Status Rascunho
            if (statusRascunho) {
                statusRascunhoList.forEach((e) => {
                    e.check = selectFilters.filtro_status_rascunho?.some((f) => f.id === e.id) || false;
                });
            }

            // Sincroniza os checks para o filtro de Forma de Pagamento
            if (formaPagamento) {
                formPagamentoList.forEach((e) => {
                    e.check = selectFilters.filtro_pagamento?.some((f) => f.id === e.id) || false;
                });
            }

            // Sincroniza os checks para o filtro de Modo de Recibo
            if (modoRecibo) {
                modosRecibosList.forEach((e) => {
                    e.check = selectFilters.filtro_recibo?.some((f) => f.id === e.id) || false;
                });
            }

            // Sincroniza os checks para o filtro de Correções
            if (correcoes) {
                correcoesList.forEach((e) => {
                    e.check = selectFilters.filtro_correcoes?.some((f) => f.id === e.id) || false;
                });
            }

            // Sincroniza os checks para o filtro de Tipo de Venda
            if (tipoVenda) {
                tipoVendaApoio.forEach((e) => {
                    e.check = selectFilters.filtro_tipo_venda?.some((f) => f.id === e.id) || false;
                });
            }

            // Sincroniza os checks para o filtro de Solicitação de Ônus
            if (solicitacaoOnus) {
                solicitacaoOnusNucleo.forEach((e) => {
                    e.check = selectFilters.filtro_solicitacao_onus?.some((f) => f.id === e.id) || false;
                });
            }

            // Sincroniza os checks para o filtro de Certidões de Comarca
            if (certidoesComarca) {
                certidoesComarcaNucleo.forEach((e) => {
                    e.check = selectFilters.filtro_certidoes_comarca?.some((f) => f.id === e.id) || false;
                });
            }

            // Sincroniza os checks para o filtro de Lojas
            if (laudemio) {
                tipoLaudemio.forEach((e) => {
                    e.check = selectFilters.filtro_laudemio?.some((f) => f.id === e.id) || false;
                });
            }

            if (prazoStatus) {
                prazoStatus.forEach((e) => {
                    e.check = selectFilters.filtro_prazo_status?.some((f) => f.id === e.id) || false;
                });
            }
        };

        syncChecks();
    }, [selectFilters]); // Adicione selectFilters como dependência

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorMenu(null);
    };

    const onClear = () => {
        unCheckList();
        (Object.keys(selectFilters) as FiltersKeys[]).map(chave => {
            selectFilters[chave] = []
        })
        localStorage.removeItem(localKey);
        handleCloseMenu();
        returnList();
    };

    const refreshList = () => {
        setGerentesList([...gerentesList]);
        setPosvendaList([...posvendaList]);
        setStatusList([...statusList]);
        setStatusFinanceiro([...statusFinanceiro]);
        setStatusRascunhoList([...statusRascunhoList]);
        setFormPagamentoList([...formPagamentoList]);
        setModosRecibosList([...modosRecibosList]);
        setCorrecoesList([...correcoesList]);
        setTipoVendaApoio([...tipoVendaApoio])
        setLojasList([...lojasList])
        setSolicitacaoOnusNucleo([...solicitacaoOnusNucleo])
        setCertidoesComarcaNucleo([...certidoesComarcaNucleo])
        setTipoLaudemio([...tipoLaudemio])
        setPrazoStatus([...prazoStatus])
    };

    const unCheckList = () => {
        gerentesList.forEach(e => e.check = false);
        posvendaList.forEach(e => e.check = false);
        statusList.forEach(e => e.check = false);
        statusFinanceiro.forEach(e => e.check = false);
        statusRascunhoList.forEach(e => e.check = false);
        formPagamentoList.forEach(e => e.check = false);
        modosRecibosList.forEach(e => e.check = false);
        correcoesList.forEach(e => e.check = false);
        tipoVendaApoio.forEach(e => e.check = false);
        lojasList.forEach(e => e.check = false);
        solicitacaoOnusNucleo.forEach(e => e.check = false);
        certidoesComarcaNucleo.forEach(e => e.check = false);
        tipoLaudemio.forEach(e => e.check = false);
        prazoStatus.forEach(e => e.check = false);
    };

    const refreshTable = () => {
        clearTimeout(currentCount);

        setCurrentCount(setTimeout(() => {
            returnList();
        }, 1000));
    };

    const handleCheck = (e: boolean, pessoa: FiltersType, filter: FiltersKeys) => {
        pessoa.check = e
        console.log('FILTER: ', filter)
        if (!e && selectFilters[filter]) {
            selectFilters[filter] = selectFilters[filter]?.filter(e => e.id !== pessoa.id);
        } else {
            selectFilters[filter]?.push({ ...pessoa, check: e });
        }
        localStorage.setItem(localKey, JSON.stringify(selectFilters));
        setSelectFilters({ ...selectFilters });
        refreshTable();
    };
    // console.log('selectFilters handle Check: ' , selectFilters)

    const countFilterActive = () => {
        let count = 0;
        (Object.keys(selectFilters) as FiltersKeys[]).map(chave => {
            selectFilters[chave]?.forEach((e) => count = !!e.check ? count + 1 : count)
        });
        return count > 0 ? `(${count})` : ''
    };

    const GerenteForm = () => {
        return (
            <div>
                <p className='filter-title'>Gerente</p>
                <FormControlCheck
                    arrList={gerentesList}
                    refreshList={refreshList}
                    LabelElement={(props: labelProps) => <span className='span'>{returnNameGerente(props.children)}</span>}
                    avatar={userProfile !== "Gerente"}
                    handleCheck={handleCheck}
                    filter={'filtro_gerente'}
                />
            </div>
        )
    };

    const StatusRascunho = () => {
        return (
            <div>
                <p className='filter-title'>Status</p>
                <FormControlCheck
                    arrList={statusRascunhoList}
                    refreshList={refreshList}
                    LabelElement={(props: labelProps) => <Chip className='chip green' label={props.children} />}
                    handleCheck={handleCheck}
                    filter={'filtro_status_rascunho'}

                />
            </div>
        )
    };

    const FormaPagamento = () => {
        return (
            <div>
                <p className='filter-title'>Forma de pagamento</p>
                <FormControlCheck
                    arrList={formPagamentoList}
                    refreshList={refreshList}
                    LabelElement={(props: labelProps) => <Chip className='chip' label={props.children} />}
                    handleCheck={handleCheck}
                    filter={'filtro_pagamento'}
                />
            </div>
        )
    };

    const PosVenda = () => {
        return (
            <div>
                <p className='filter-title'>Pós-venda</p>
                <FormControlCheck
                    arrList={posvendaList}
                    refreshList={refreshList}
                    LabelElement={(props: labelProps) => <span className='span'>{returnNameGerente(props.children)}</span>}
                    avatar
                    handleCheck={handleCheck}
                    filter={'filtro_responsavel'}
                />
            </div>
        )
    };

    const Status = () => {
        return (
            <div>
                <p className='filter-title'>{perfilFinanceiro ? "Status Pós-venda" : "Status"}</p>
                <FormControlCheck
                    arrList={statusList}
                    refreshList={refreshList}
                    LabelElement={(props: labelProps) => <Chip className={`chip ${perfilFinanceiro ? "primary" : "green"}`} label={props.children} />}
                    handleCheck={handleCheck}
                    filter={'filtro_status'}
                />
            </div>
        )
    };

    const StatusFinanceiro = () => {
        return (
            <div>
                <p className='filter-title'>Status Financeiro</p>
                <FormControlCheck
                    arrList={statusFinanceiro}
                    refreshList={refreshList}
                    // LabelElement={(props: labelProps) => }
                    handleCheck={handleCheck}
                    filter={'filtro_status_financeiro'}
                />
            </div>
        )
    };

    const Recibo = () => {
        return (
            <div>
                <p className='filter-title'>Recibo de sinal</p>
                <FormControlCheck
                    arrList={modosRecibosList}
                    refreshList={refreshList}
                    LabelElement={(props: labelProps) => <span className='span'>{props.children}</span>}
                    handleCheck={handleCheck}
                    filter={'filtro_recibo'}
                />
            </div>
        )
    };

    const Correcoes = () => {
        return (
            <div>
                <p className='filter-title'>Correções</p>
                <FormControlCheck
                    arrList={correcoesList}
                    refreshList={refreshList}
                    LabelElement={(props: labelProps) => <span>{props.children}</span>}
                    handleCheck={handleCheck}
                    filter={'filtro_correcoes'}
                />
            </div>
        )
    };

    const TipoVendaApoio = () => {
        return (
            <div>
                <p className='filter-title'>Tipo</p>
                <FormControlCheck
                    arrList={tipoVendaApoio}
                    refreshList={refreshList}
                    LabelElement={(props: labelProps) => <span>{props.children}</span>}
                    handleCheck={handleCheck}
                    filter={'filtro_tipo_venda'}
                />
            </div>
        )
    };

    const CertidoesComarca = () => {
        return (
            <div>
                <p className='filter-title'>Certidões de outra comarca</p>
                <FormControlCheck
                    arrList={certidoesComarcaNucleo}
                    refreshList={refreshList}
                    LabelElement={(props: labelProps) => <span>{props.children}</span>}
                    handleCheck={handleCheck}
                    filter={'filtro_certidoes_comarca'}
                />
            </div>
        )
    };

    const SolicitacaoOnus = () => {
        return (
            <div>
                <p className='filter-title'>Solicitação de Ônus Reais</p>
                <FormControlCheck
                    arrList={solicitacaoOnusNucleo}
                    refreshList={refreshList}
                    LabelElement={(props: labelProps) => <span>{props.children}</span>}
                    handleCheck={handleCheck}
                    filter={'filtro_solicitacao_onus'}
                />
            </div>
        )
    };

    const TipoLaudemio = () => {
        return (
            <div>
                <p className='filter-title'>Laudêmio</p>
                <FormControlCheck
                    arrList={tipoLaudemio}
                    refreshList={refreshList}
                    LabelElement={(props: labelProps) => <Chip className='chip primary' label={props.children} />}
                    handleCheck={handleCheck}
                    filter={'filtro_laudemio'}
                />
            </div>
        )
    };

    const PrazoStatus = () => {
        return (
            <div>
                <p className='filter-title'>Prazo do Status</p>
                <FormControlCheck
                    arrList={prazoStatus}
                    refreshList={refreshList}
                    LabelElement={(props: labelProps) => <Chip className={`chip primary ${props.children === 'Em dia' ? 'green' : props.children === 'Em alerta' ? 'yellow' : 'red'}`} label={props.children} />}
                    handleCheck={handleCheck}
                    filter={'filtro_prazo_status'}
                />
            </div>
        )
    };

    const Lojas = () => {
        return (
            <div>
                <p className='filter-title'>{perfilFinanceiro ? 'Loja' : "Franquia"}</p>
                <FormControlCheck
                    arrList={lojasList}
                    refreshList={refreshList}
                    LabelElement={(props: labelProps) => perfilFinanceiro ? <Chip className={`chip neutral`} label={props.children} /> : <span>{props.children}</span>}
                    handleCheck={handleCheck}
                    filter={'filtro_loja'}
                />
            </div>
        )
    };

    return (
        <div className=''>
            <ButtonComponent
                size={'small'}
                variant={'text'}
                name={loadingList ? 'disable' : 'menu'}
                startIcon={loadingList ? <CircularProgress className="circle-loading" size={20} /> : <FaFilter />}
                disabled={loadingList}
                label={`Filtrar ${countFilterActive()}`}
                onClick={handleOpenMenu}
            />
            <Menu
                id="basic-menu"
                anchorEl={anchorMenu}
                className='filters-menu'
                open={open}
                onClose={handleCloseMenu}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <div className='header-filters'>
                    <p className='menu-title'>Filtrar por:</p>
                    <ButtonComponent onClick={onClear} size={'large'} variant={'text'} label={'Limpar filtros'} />
                </div>
                {
                    orderBy === 'pos-venda'
                        ?
                        <div className='content-filters'>
                            {posVenda && <PosVenda />}

                            {status && <Status />}

                            {status && <PrazoStatus />}

                            {formaPagamento && <FormaPagamento />}

                            {correcoes && <Correcoes />}

                            {modoRecibo && <Recibo />}

                            {gerente && <GerenteForm />}

                            {laudemio && <TipoLaudemio />}

                        </div>
                        :
                        <div className='content-filters'>
                            {gerente && <GerenteForm />}

                            {statusRascunho && <StatusRascunho />}

                            {formaPagamento && <FormaPagamento />}

                            {posVenda && <PosVenda />}

                            {lojas && <Lojas />}

                            {tipoVenda && <TipoVendaApoio />}

                            {status && <Status />}

                            {statusFinanceiroFilter && <StatusFinanceiro />}

                            {modoRecibo && <Recibo />}

                            {correcoes && <Correcoes />}

                            {solicitacaoOnus && <SolicitacaoOnus />}

                            {certidoesComarca && <CertidoesComarca />}

                        </div>
                }
            </Menu>
        </div>
    )
}