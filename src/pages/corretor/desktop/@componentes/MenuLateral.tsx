
import { Collapse, Divider, List, ListItemButton } from '@mui/material';
import { useEffect, useState } from 'react';
import Button from '@/components/ButtonComponent';
import { InicialFooterTabType, listAndamentoType, TypeComissionsCorretores, TYPES_COMISSION_TYPE, ItemListRecentsType, ValoresProducao } from '@/interfaces/Corretores';
import { HiChevronDoubleLeft, HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { TabsInvestimentoType } from '@/interfaces/Corretores/investimento';

interface PropsType {
    tabs: InicialFooterTabType[]
    setSelectedIndex: (e: number) => void
    selectedIndex: number

    listAndamento: listAndamentoType
    listConcluidos: listAndamentoType
    listCancelados: listAndamentoType
    TYPES_COMISSION: TYPES_COMISSION_TYPE
    tabsInvestimento: TabsInvestimentoType[]
    selectTabTypeComission: number
    setSelectTabTypeComission: (e: number) => void
    setTabsInvestimentoSelected: (e: number) => void;
    tabsInvestimentoSelected: number;
    returnList: (limite?: number, status?: number) => void
    listagemUltimaComissao: ItemListRecentsType[]; // Lista de últimas comissões
    valoresProducao: ValoresProducao[]
    statusIdMenu?: number; // Status do menu
    setStatusIdMenu: (e: number) => void; // Função para atualizar o status do menu
    setListagemUltimaComissao: (e: ItemListRecentsType[]) => void; // Função para atualizar a lista de últimas comissões
    page?: number; // Página atual
    setPage: (e: number) => void; // Função para atualizar a página
    listaEnderecos?: ItemListRecentsType[];
    setListaEnderecos: (e: ItemListRecentsType[]) => void; // Função para atualizar a lista de endereços
}

export default function MenuLateral(props: PropsType) {
    const [collapseMenu, setCollapseMenu] = useState(true);
    const [collapseMenuComissao, setCollapseMenuComissao] = useState(false);
    const [collapseMenuInvestimento, setCollapseMenuInvestimento] = useState(false);
    // const [statusIdMenu, setStatusIdMenu] = useState<number>(10); // Status Liberado
    const {
        tabs,
        setSelectedIndex,
        selectedIndex,
        TYPES_COMISSION,
        selectTabTypeComission,
        listConcluidos,
        listCancelados,
        listAndamento,
        setSelectTabTypeComission,
        tabsInvestimento,
        setTabsInvestimentoSelected,
        tabsInvestimentoSelected,
        returnList,
        listagemUltimaComissao,
        valoresProducao,
        statusIdMenu,
        setStatusIdMenu,
        setListagemUltimaComissao,
        page,
        setPage,
        listaEnderecos,
        setListaEnderecos
    } = props;

    // console.log('valoresProducao: ', valoresProducao)

    useEffect(() => {
        if (selectedIndex === 1) {
            setCollapseMenuComissao(true);
        }
        if (selectedIndex === 2) {
            setCollapseMenuInvestimento(true);
        }
    }, [selectedIndex]);

    const handleChangeMenu = (index: number) => {
        
        // Passar para o navegador o index do menu lateral
        sessionStorage.setItem('comissao_menu', String(index));

        setSelectedIndex(index);
        if (index === 1) {
            const defaultStatusId = 10; // Status "Liberado"
            const defaultTabIndex = 0;

            sessionStorage.setItem('comissao_menu_status', String(defaultStatusId));
            sessionStorage.setItem('comissao_type_menu', String(defaultTabIndex));
            sessionStorage.removeItem('investimento_menu_item');
            
            setCollapseMenuInvestimento(false);
            setCollapseMenuComissao((prev) => !prev);
            
            // Se nenhuma aba de comissão estiver selecionada, define a padrão.
            // E atualiza o estado para refletir o padrão.
            if (selectTabTypeComission === -1 || statusIdMenu !== defaultStatusId) {
                setSelectTabTypeComission(defaultTabIndex);
                setStatusIdMenu(defaultStatusId);
                returnList(0, defaultStatusId); // Limite 0, Status Liberado
            }
            setListaEnderecos(
            (valoresProducao?.find((data) => data.id === defaultStatusId)?.endereco || [])
                .map((item: any) => ({
                    ...item,
                    logradouro: item.logradouro ?? "",
                    // Add other required ItemListRecentsType properties with default values if needed
                }))
            );
        } else if (index === 2) {
            sessionStorage.removeItem('comissao_type_menu');
            sessionStorage.removeItem('comissao_menu_status');
            setCollapseMenuComissao(false);
            setCollapseMenuInvestimento((prev) => !prev);
            if (tabsInvestimentoSelected === -1) setTabsInvestimentoSelected(0);
        } else {
            sessionStorage.removeItem('comissao_type_menu');
            sessionStorage.removeItem('comissao_menu_status');
            sessionStorage.removeItem('investimento_menu_item');

            setCollapseMenuComissao(false);
            setCollapseMenuInvestimento(false);
            if(index === 0) {
                setStatusIdMenu(0);
                returnList(5, 0);  // Limite 0, Status
            }
            setSelectTabTypeComission(-1);
        }
    };

    const handleChangeMenuComission = (index: number, id: number) => {
        // Passar para o navegador o id do status selecionado no submenu de Comissão
        sessionStorage.setItem('comissao_menu_status', String(id));
        sessionStorage.setItem('comissao_type_menu', String(index));

        setPage(1)
        localStorage.setItem('page', '1');

        // if(index === 1){
        //     setPage(1)
        // }

        setListaEnderecos(
            (valoresProducao?.find((data) => data.id === id)?.endereco || [])
                .map((item: any) => ({
                    ...item,
                    logradouro: item.logradouro ?? ""
                    // Add other required ItemListRecentsType properties with default values if needed
            }))
        );
        
        setStatusIdMenu(id);
        setSelectedIndex(1);
        setSelectTabTypeComission(index);
        returnList(0, id); // Limite 0, Status
    };

    const handleChangeMenuInvestimento = (index: number) => {
        sessionStorage.setItem('investimento_menu_item', String(index));
        setTabsInvestimentoSelected(index);
        setSelectedIndex(2);
    };

    const handleCollapse = () => {
        // CAIXA PRETA ANIMAÇÃO DE MENU PRINCIPAL
        // setCollapseVendas(false);
        const $section = document.getElementById('collapseButton');
        const $icon = document.getElementsByClassName('iconCollapse')[0];
        $icon.classList.toggle('rotate180');
        if (collapseMenu) {
            $section?.classList.remove('w106');
            $section?.classList.add('w295');
        } else {
            $section?.classList.remove('w295');
            $section?.classList.add('w106');
        }
    };

    const returnListLength = (key: TypeComissionsCorretores, statusId: number) => {
        // console.log('key: ', key);
        // console.log('statusId: ', statusId);
        switch (String(statusId)) {
            case '9':
                return '(' + valoresProducao?.find((data) => data.id === statusId)?.qtd + ')' || '';
            case '10':
                return '(' + valoresProducao?.find((data) => data.id === statusId)?.qtd + ')' || '';
            case '11':
                return '(' + valoresProducao?.find((data) => data.id === statusId)?.qtd + ')' || '';
            case '12':
                return '(' + valoresProducao?.find((data) => data.id === statusId)?.qtd + ')' || '';
            case '13':
                // ID 13 Tranferido sendo exibido como Concluído
                return '(' + valoresProducao?.find((data) => data.id === statusId)?.qtd + ')' || '';
            case '16':
                return '(' + valoresProducao?.find((data) => data.id === statusId)?.qtd + ')' || '';
            default:
                return '';
        }
    };

    return (
        <div className='menu-lateral'>
            <Collapse orientation="horizontal" in={collapseMenu} collapsedSize={106} timeout={collapseMenu ? 0 : 700} addEndListener={handleCollapse}>
                <div id='collapseButton' className={`w295`}>
                    <div className={`collapseButton`}>
                        <Button size={'large'} variant={'text'} name={'collapse'} label={''} onClick={() => setCollapseMenu((prev) => !prev)} endIcon={<HiChevronDoubleLeft className='colorP500 iconCollapse' />} fullWidth />
                        <Divider />
                    </div>

                    <div className={`list-items`}>
                        <List className='menu-items'>
                            {tabs?.filter((e) => e.id < 2).map((item) => (
                                <ListItemButton
                                    key={item.id}
                                    className='item'
                                    selected={selectedIndex === item.id}
                                    onClick={() => handleChangeMenu(item.id)}
                                >
                                    {item.icon} {collapseMenu ? item.label : ""}
                                    {item.submenu && (
                                        collapseMenu ? collapseMenuComissao ? <HiChevronDown size={22} /> : <HiChevronUp size={22} /> : ""
                                    )}
                                </ListItemButton>
                            ))}
                        </List>
                        {collapseMenu &&
                            <Collapse in={collapseMenuComissao}>
                                <List className='menu-items sub'>
                                    {TYPES_COMISSION?.map((items, i) => (
                                        <ListItemButton
                                            key={i}
                                            className='item'
                                            selected={selectTabTypeComission === i}
                                            onClick={() => handleChangeMenuComission(i, items.id)}
                                        >
                                            {/* {items.label + ' ' + returnListLength(items.key)} */}
                                            {items.label + ' ' + returnListLength(items.key, items.id)}
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>}
                        <List className='menu-items'>
                            {tabs?.filter((e) => e.id == 2).map((item) => (
                                <ListItemButton
                                    key={item.id}
                                    className='item'
                                    selected={selectedIndex === item.id}
                                    onClick={() => handleChangeMenu(item.id)}
                                >
                                    {item.icon} {collapseMenu ? item.label : ""}
                                    {item.submenu && (
                                        collapseMenu ? collapseMenuInvestimento ? <HiChevronDown size={22} /> : <HiChevronUp size={22} /> : ""
                                    )}
                                </ListItemButton>
                            ))}
                        </List>
                        {collapseMenu &&
                            <Collapse in={collapseMenuInvestimento}>
                                <List className='menu-items sub'>
                                    {tabsInvestimento?.map((items, i) => (
                                        <ListItemButton
                                            key={i}
                                            className='item'
                                            selected={tabsInvestimentoSelected === i}
                                            onClick={() => handleChangeMenuInvestimento(i)}
                                        >
                                            {items.label}
                                            {items.valor_total ? `(${items.opcoes})` : ''}
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        }

                        <List className='menu-items'>
                            {tabs?.filter((e) => e.id == 3).map((item) => (
                                <ListItemButton
                                    key={item.id}
                                    className='item'
                                    selected={selectedIndex === item.id}
                                    onClick={() => handleChangeMenu(item.id)}
                                >
                                    {item.icon} {collapseMenu ? item.label : ""}
                                    {item.submenu && (
                                        collapseMenu ? collapseMenuInvestimento ? <HiChevronDown size={22} /> : <HiChevronUp size={22} /> : ""
                                    )}
                                </ListItemButton>
                            ))}
                        </List>
                    </div>
                    {/* <div className='w295'></div> */}
                </div>
            </Collapse>
        </div>
    )
}