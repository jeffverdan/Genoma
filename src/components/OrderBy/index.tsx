import { Avatar, Checkbox, Chip, FormControl, FormControlLabel, FormGroup, FormLabel, ListItemIcon, Menu, MenuItem, Radio, RadioGroup } from '@mui/material';
import React, { use, useEffect, useRef, useState } from 'react';
import ButtonComponent from '../ButtonComponent';
import { HiBarsArrowDown } from 'react-icons/hi2';

type Props = {
    setSelectOrders: (props: { patch: string, id: number }) => void
    selectOrders: { patch: string, id: number }
    returnList: (idArrayVendas?: number) => Promise<void>
    dataAssinatura?: boolean
    prazoEscritura?: boolean
    status?: boolean
    rank?: boolean
    progresso?: boolean
    dataPedido?: boolean
    diasCorridos?: boolean
    dataEntrada?: boolean
    dataFechamento?: boolean
    valorComissao?: boolean
    valorVenda?: boolean
    dataSolicitacao?: boolean

    //Corretores
    dataAmdamento?: boolean
    dataTansferencia?: boolean
    dataConclusao?: boolean
    dataCancelamento?: boolean
    // dataSolicitacao?: boolean
    dataLiberacao?: boolean
    statusIdMenuComissao?: number;

    // Financeiro
    valorParcela?: boolean
    dataPrevista?: boolean
    dataAtualizacao?: boolean
    valorOpcao?: boolean
    valorRateio?: boolean
    dataParcelaCancelamento?: boolean
    dataFinanceiroConcluido?: boolean
}

type pacthKeys = 'order_assinatura' | 'order_escritura' | 'order_status' | 'order_rank' | 'data_pedido' | 'dias_corridos' | 'data_entrada' | 'valor_comissao' | 'valor_venda'

interface OrdersListType {
    order_assinatura: OrdersType[],
    order_escritura: OrdersType[],
    order_status: OrdersType[],
    order_rank: OrdersType[],
    data_pedido: OrdersType[],
    dias_corridos: OrdersType[],
    data_entrada: OrdersType[],
    // data_fechamento: OrdersType[],
    valor_comissao: OrdersType[],
    valor_venda: OrdersType[],
    valor_rateio_transferido: OrdersType[],
    data_cancelamento: OrdersType[],
    data_criacao_status: OrdersType[],
}

type OrdersType = {
    id: number,
    label: string,
    title?: string
    active?: boolean
}

type PropsFormControl = {
    arrList: OrdersType[],
    handleCheck: (value: number, patch: string) => void
    value: { patch: string, id: number }
    patch: string
    title: string
}

interface labelProps {
    children: string
}

const FormControlRadio = (props: PropsFormControl) => {
    const { arrList, handleCheck, value, patch, title } = props;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(patch, '');
        handleCheck(Number(value), patch);
    };

    return (
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label" className='order-title'>{title}</FormLabel>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={value.patch + value.id}
                onChange={handleChange}
            >
                {arrList.map((pessoa) => (
                    <FormControlLabel
                        key={pessoa.id}
                        control={<Radio className='radio' size='small' color='primary' sx={{ color: '#01988C' }} />}
                        label={pessoa.label}
                        className={`order-row ${value.patch + value.id === patch + pessoa.id ? 'selected' : ''}`}
                        value={patch + pessoa.id}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    )
}

export default function OrderBy(props: Props) {
    const { 
        returnList, 
        setSelectOrders, 
        selectOrders, 
        dataAssinatura, 
        prazoEscritura, 
        status, 
        rank, 
        dataPedido, 
        diasCorridos, 
        dataEntrada, 
        dataFechamento, 
        valorComissao, 
        valorVenda, 
        dataSolicitacao,
        dataLiberacao,
        dataAmdamento,
        dataCancelamento,
        dataConclusao,
        dataTansferencia,
        valorParcela,
        dataPrevista,
        dataAtualizacao,
        valorOpcao,
        statusIdMenuComissao,
        valorRateio,
        dataParcelaCancelamento,
        dataFinanceiroConcluido
    } = props;
    const [anchorMenu, setAnchorMenu] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorMenu);
    const [currentCount, setCurrentCount] = useState<NodeJS.Timeout>();

    useEffect(() => {
        const filtroOrdenacao = localStorage.getItem('filtro_ordenacao');
        if (filtroOrdenacao) {
            const parsedFiltro = JSON.parse(filtroOrdenacao);
            if (parsedFiltro.patch === 'order_status') {
                const updatedId = parsedFiltro.id === 1 ? 2 : 1;
                setSelectOrders({ id: updatedId, patch: parsedFiltro.patch });
            } else {
                setSelectOrders(parsedFiltro);
            }
        }
    }, []);

    // LISTAS
    const defaultValueOrders = {          
        valor_opcao: [
            { id: 1, label: 'Maior comissão', title: 'Opção', active: valorOpcao },
            { id: 2, label: 'Menor comissão' },
        ],      
        data_liberacao: [
            { id: 1, label: 'Mais recentes', title: 'Data de liberação', active: dataLiberacao },
            { id: 2, label: 'Mais antigos' },
        ],  
        data_andamento: [
            { id: 1, label: 'Mais recentes', title: 'Previsão de pagamento', active: dataAmdamento },
            { id: 2, label: 'Mais antigos' },
        ],        
        data_transferencia: [
            { id: 1, label: 'Mais recentes', title: 'Data de transferência', active: dataTansferencia },
            { id: 2, label: 'Mais antigos' },
        ],  
        // data_solicitacao: [
        //     { id: 1, label: 'Mais recentes', title: 'Data de solicitação', active: dataSolicitacao },
        //     { id: 2, label: 'Mais antigos' },
        // ],  
        data_conclusao: [
            { id: 1, label: 'Mais recentes', title: 'Data de conclusão', active: dataConclusao },
            { id: 2, label: 'Mais antigos' },
        ],  
        data_cancelamento: [
            { id: 1, label: 'Mais recentes', title: 'Data de cancelamento', active: dataCancelamento },
            { id: 2, label: 'Mais antigos' },
        ],  
        valor_parcela: [
            { id: 1, label: 'Maior valor', title: 'Valor da parcela', active: valorParcela },
            { id: 2, label: 'Menor valor' },
        ],
        data_atualizacao: [
            { id: 1, label: 'Mais recentes', title: 'Data de atualização', active: dataAtualizacao },
            { id: 2, label: 'Mais antigos' },
        ],
        order_assinatura: [
            { id: 1, label: 'Mais recentes', title: 'Data de assinatura', active: dataAssinatura },
            { id: 2, label: 'Mais antigos' },
        ],
        data_criacao_status: [
            { id: 1, label: 'Mais recentes', title: 'Data de conclusão', active: dataFinanceiroConcluido },
            { id: 2, label: 'Mais antigos' },
        ],  
        valor_rateio_transferido: [
            { id: 1, label: 'Mais progresso', title: 'Rateio', active: valorRateio },
            { id: 2, label: 'Menos progresso' },
        ],
        order_escritura: [
            { id: 1, label: 'Maior', title: 'Prazo de escritura', active: prazoEscritura },
            { id: 2, label: 'Menor' },
        ],
        data_entrada: [
            { id: 1, label: 'Mais recentes', title: 'Data de entrada', active: dataEntrada },
            { id: 2, label: 'Mais antigos' },
        ],
        order_status: [
            { id: 1, label: 'Maior', title: 'Prazo de status', active: status },
            { id: 2, label: 'Menor' },
        ],
        order_rank: [
            { id: 1, label: 'Progresso do maior para menor', title: 'Progresso ou rank', active: rank },
            { id: 2, label: 'Progresso do menor para maior' },
            { id: 3, label: 'Rank com mais foguetes' },
            { id: 4, label: 'Rank com menos foguetes' },
        ],
        data_pedido: [
            { id: 1, label: 'Mais recentes', title: 'Data do pedido', active: dataPedido },
            { id: 2, label: 'Mais antigos' },
        ],
        dias_corridos: [
            { id: 1, label: 'Mais dias', title: 'Dias corridos', active: diasCorridos },
            { id: 2, label: 'Menos dias' },
        ],
        // data_fechamento: [
        //     { id: 1, label: 'Mais recentes', title: 'Data de fechamento', active: dataFechamento },
        //     { id: 2, label: 'Mais antigos' },
        // ],
        valor_comissao: [
            { id: 1, label: 'Maior valor', title: 'Valor', active: valorComissao },
            { id: 2, label: 'Menor valor' },
        ],
        valor_venda: [
            { id: 1, label: 'Maior VGV', title: 'VGV', active: valorVenda },
            { id: 2, label: 'Menor VGV' },
        ],
        data_solicitacao: [
            { id: 1, label: 'Mais recentes', title: 'Data de solicitação', active: dataSolicitacao },
            { id: 2, label: 'Mais antigos' },
        ],
        data_prevista: [
            { id: 1, label: 'Mais recentes', title: 'Data prevista', active: dataPrevista },
            { id: 2, label: 'Mais antigos' },
        ],
        // data_cancelamento: [
        //     { id: 1, label: 'Mais recentes', title: 'Data de cancelamento', active: dataParcelaCancelamento },
        //     { id: 2, label: 'Mais antigos' },
        // ],
    };

    const [ordersLists, setOrdersLists] = useState<OrdersListType>(defaultValueOrders);
    // const prevSelectOrders = useRef(selectOrders);
    useEffect(() => {
        setOrdersLists(defaultValueOrders);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataAssinatura, rank, valorRateio, dataParcelaCancelamento, dataFinanceiroConcluido])

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorMenu(null);
    };

    const onClear = () => {
        setSelectOrders({ id: -1, patch: '' });
        localStorage.removeItem('filtro_ordenacao');
        returnList();
    };

    const refreshTable = () => {
        clearTimeout(currentCount);

        setCurrentCount(setTimeout(() => {
            returnList()
        }, 500));
    };
    
    const handleCheck = async (value: number, patch: string) => {
        setSelectOrders({ id: value, patch: patch });          
        localStorage.setItem('filtro_ordenacao', JSON.stringify({id: value, patch: patch}));
        handleCloseMenu();
    };
    
    useEffect(() => {        
        if(selectOrders?.id >= 0) {
            refreshTable();
        }
    },[selectOrders])

    const countFilterActive = () => {
        return selectOrders?.id > 0 ? `(1)` : ''
    };
    
    return (
        <div className=''>
            <ButtonComponent
                size={'small'}
                variant={'text'}
                name={'filter'}
                startIcon={<HiBarsArrowDown />}
                label={`Ordernar ${countFilterActive()}`}
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
                    <p className='menu-title'>Ordenar por:</p>
                    <ButtonComponent onClick={onClear} size={'large'} variant={'text'} label={'Limpar ordenação'} />
                </div>
                <div className='content-filters'>
                    {(Object.keys(ordersLists) as pacthKeys[]).map((chave) => {
                        if (ordersLists[chave][0].active) return (
                            <FormControlRadio
                                arrList={ordersLists[chave]}
                                key={chave}
                                handleCheck={handleCheck}
                                value={{ ...selectOrders }}
                                patch={chave}
                                title={ordersLists[chave][0]?.title || ''}
                            />
                        )
                    })}
                </div>
            </Menu>
        </div>
    )
}