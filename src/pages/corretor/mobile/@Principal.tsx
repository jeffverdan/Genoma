import React, { useState } from "react";
import { InicialFooterTabType, ItemListRecentsType, listAndamentoType, QuestionsType, UrlsAnunciosType, ValoresProducao } from "@/interfaces/Corretores";
import ListVendas from "./@Components/@ListVendas";
import FooterTabs from "./@Components/FooterTabs";
import DetalhesVenda from "./@Components/@DetalhesVenda";

interface PropsType {
    // tabs: InicialFooterTabType[]
    loading: boolean
    listAndamento: listAndamentoType
    loadingConcluidos: boolean
    listConcluidos: listAndamentoType
    loadingCancelados: boolean
    listCancelados: listAndamentoType
    setSelectedTab: (e: number) => void; // TAB DO FOOTER
    setSelectTabType: (e: number) => void; // TAB DE TIPO DE COMISSAO NA ABA COMISSAO
    selectProcess: ItemListRecentsType | null
    setSelectProcess: (e: ItemListRecentsType | null) => void
    getListAndamento: (limite?: number, status?: number) => void
    listProcess: any
    setListProcess: any
    valoresProducao: ValoresProducao[]; // Valores de produção para o painel
    listagemUltimaComissao: ItemListRecentsType[]; // Lista de últimas comissões
}

export default function Principal (props: PropsType) {
    const { setSelectedTab, listAndamento, loading, listCancelados, loadingCancelados, listConcluidos, loadingConcluidos, setSelectTabType, selectProcess, setSelectProcess, getListAndamento, listProcess, setListProcess, valoresProducao, listagemUltimaComissao } = props;

    return (
        <>
            <ListVendas 
                setSelectProcess={setSelectProcess} 
                setSelectTabType={setSelectTabType}
                selectProcess={selectProcess} 
                setSelectedTab={setSelectedTab} 
                listAndamento={listAndamento} 
                loading={loading}
                listCancelados={listCancelados}
                loadingCancelados={loadingCancelados}
                listConcluidos={listConcluidos}
                loadingConcluidos={loadingConcluidos}
                valoresProducao={valoresProducao}
                listagemUltimaComissao={listagemUltimaComissao}
                getListAndamento={getListAndamento}
            />          
        </>
    )
}