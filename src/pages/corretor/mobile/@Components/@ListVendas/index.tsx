import { useEffect, useState } from "react";
import CardValor from "./CardValorAccordion";
import ListRecents from "./ListRecents";
import { ItemListRecentsType, listAndamentoType, TypeComissionsCorretores, UrlsAnunciosType, ValoresProducao } from "@/interfaces/Corretores";
import SwipeableViews from "react-swipeable-views-react-18-fix";

interface PropsType {
    // setSelectTabType: (e: number) => void;    
    setSelectedTab: (e: number) => void; // TAB DO FOOTER
    setSelectTabType: (e: number) => void; // TAB DE TIPO DE COMISSAO NA ABA COMISSAO
    setSelectProcess: (e: ItemListRecentsType | null) => void
    selectProcess: ItemListRecentsType | null
    loading: boolean
    listAndamento: listAndamentoType
    loadingConcluidos: boolean
    listConcluidos: listAndamentoType
    loadingCancelados: boolean
    listCancelados: listAndamentoType
    valoresProducao: ValoresProducao[]; // Valores de produção para o painel
    listagemUltimaComissao: ItemListRecentsType[]; // Lista de últimas comissões
    getListAndamento: (limite?: number, status?: number) => void
}

export default function ListVendas(props: PropsType) {
    const [user, setUser] = useState<string>('');
    const [selectCard, setSelectCard] = useState(0);
    const { setSelectedTab, listAndamento, setSelectProcess, selectProcess, loading, listCancelados, loadingCancelados, listConcluidos, loadingConcluidos, setSelectTabType, valoresProducao, listagemUltimaComissao, getListAndamento } = props;

    useEffect(() => {
        const name = localStorage.getItem('nome_usuario') || '';
        setUser(name);
    }, []);

    const handleTab = (type: TypeComissionsCorretores) => {
        const typesComission = [
            { label: 'Produção', key: 'andamento' },
            { label: 'Concluídos', key: 'concluidos' },
            // { label: 'Cancelados', key: 'cancelados' },
            // { label: 'Sacado', key: 'sacado' },
        ];
        const index = typesComission.findIndex(item => item.key === type);
        setSelectTabType(index); // Define a aba de tipo de comissão na aba Comissão;
        getListAndamento(0, 10)
        setSelectedTab(1); // Muda para a aba de comissão
    };

    return (
        <div className="list-vendas">
            <h4>Olá, {user ? user.split(" ")[0] + '!' : ''} Acompanhe o seu saldo de comissão.</h4>
            {/* <SwipeableViews
                axis={'x'}
                index={selectCard}
                enableMouseEvents={false}
                ignoreNativeScroll={true}
                // onChangeIndex={handleTab}
                className='swipe-principal-container'
            > */}
                <CardValor type="andamento" list={listAndamento} loading={loading} handleTab={handleTab} valoresProducao={valoresProducao} />
                {/* <CardValor type="concluidos" list={listConcluidos} loading={loadingConcluidos} handleTab={handleTab}  /> */}
                {/* <CardValor type="cancelados" list={listCancelados} loading={loadingCancelados} handleTab={handleTab}  /> */}
            {/* </ SwipeableViews > */}
            
            <ListRecents 
                setSelectProcess={setSelectProcess} 
                selectProcess={selectProcess} 
                loading={loading || loadingConcluidos || loadingCancelados}
                listAndamento={listAndamento}
                listCancelados={listCancelados}
                listConcluidos={listConcluidos}
                listagemUltimaComissao={listagemUltimaComissao}
            />
            {/* <RecentQuestions /> */}
        </div>
    )
}