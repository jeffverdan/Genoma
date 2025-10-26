import ButtonComponent from "@/components/ButtonComponent";
import { ItemListRecentsType, listAndamentoType, UrlsAnunciosType } from "@/interfaces/Corretores";
import { Avatar, Chip, Divider, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { ListBulletIcon, PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import converterParaReal from "@/functions/converterParaReal";
import { useRouter } from "next/router";
import { useCallback } from "react";

interface PropsType {
    loading: boolean
    listAndamento: listAndamentoType
    listConcluidos: listAndamentoType
    listCancelados: listAndamentoType
    setSelectedIndex: (e: number) => void
    setSelectProcess: (e: ItemListRecentsType | null) => void
    selectProcess: ItemListRecentsType | null
    listagemUltimaComissao: ItemListRecentsType[]; // Lista de últimas comissões
}
export default function UltimasComissoes(props: PropsType) {
    const { loading, listAndamento, listConcluidos, listCancelados, setSelectedIndex, setSelectProcess, selectProcess, listagemUltimaComissao } = props;
    const [date] = useState<Date>(new Date());
    const [list, setList] = useState<ItemListRecentsType[]>([]);
    const router = useRouter();
    console.log('listagemUltimaComissao', listagemUltimaComissao);

    const labelChipAndDate = (item: ItemListRecentsType) => {
        if(item?.finance_status_id === '9'){
            return { label: "Em andamento", labelDate: "Previsão de pagamento", chip: 'yellow600' };
        }
        else if(item?.finance_status_id === '12'){
            return { label: "Em transferência", labelDate: "Última transferência", chip: 'green500' };
        }
        else if(item?.finance_status_id === '13'){ 
            // ID 13 Tranferido sendo exibido como Concluído
            return { label: "Concluídos", labelDate: "Data de conclusão", chip: 'green500' };
        }
        else if(item?.finance_status_id === '16'){
            return { label: "Cancelado", labelDate: "Data de cancelamento", chip: 'red500' };
        }
        else if(item?.finance_status_id === '11'){
            return { label: "Solicitado", labelDate: "Data de solicitação", chip: 'primary500' };
        }
        else if(item?.finance_status_id === '10'){
            return { label: "Liberado", labelDate: "Data de liberação", chip: 'green500' };
        }
    };

    const urlRedirect = useCallback((parcelaId: string) => {
        const corretorId = localStorage.getItem('usuario_id') || '';
        return router.push(`/corretor/${corretorId}/parcela/${parcelaId}`);
    }, [router]);

    return (
        <div className="ultimas-comissoes">
            <div className="header-table">
                Últimas comissões
                <Chip className="chip primary" label={listagemUltimaComissao?.length} />
            </div>
            <Divider />
            {loading ?
                ([1, 2, 3]).map((item, i) => (
                    <div key={i} className="item-row">
                        <Skeleton width={100} height={20} />
                        <Skeleton width={130} height={20} />
                        <Skeleton width={280} height={20} />
                        <div className="data-container">
                            <Skeleton width={150} height={20} />
                            <Skeleton width={75} height={20} />
                        </div>
                        <div className="data-button"></div>
                    </div>
                ))
                : listagemUltimaComissao?.map((item, index) => 
                    <>
                        <div className="item-row" /*onClick={() => setSelectProcess(item)}*/ onClick={() => urlRedirect(String(item?.parcela_id))} key={index}>
                            <Chip className={`chip ${labelChipAndDate(item)?.chip}`} label={labelChipAndDate(item)?.label} />
                            <div className="valor-date">
                                <div className="valor-container">
                                    <span className="sigla">R$</span>
                                    <span className="valor">{converterParaReal(item?.soma ?? 0).replace('R$', '') || "-----"}</span>
                                </div>
                                <span className="tipo">{(item.tipo_comissao === 'partes' ? `Parcela ${item.numero_parcela} ${item.total_parcelas ? 'de ' + item.total_parcelas : ''}` : 'Á Vista')}</span>
                            </div>
                            <div className="endereco-container">
                                <Avatar>{item?.url_imagens ? <Image height={40} src={item?.url_imagens} alt={"Fotografio imóvel"} /> : <PhotoIcon width={20} />}</Avatar>
                                <div>
                                    <span className="logradouro">
                                        {item.logradouro}
                                        {item.numero && ', ' + item.numero}
                                    </span>
                                    <span className="complemento">
                                        {(item.unidade) && ' / '}
                                        {item.unidade}
                                        {(item.complemento) && ' / '}
                                        {item.complemento}
                                        {(item.bairro) && ' - '}
                                        {item.bairro}
                                    </span>
                                </div>
                            </div>
                            <div className="data-container">
                                <span className={`label ${labelChipAndDate(item)?.chip}`}>{labelChipAndDate(item)?.labelDate}</span>
                                <span className="data">{item?.data_ordenacao_exibicao || 'Não definida'}</span>
                            </div>
                            <div className="data-button">
                                <ButtonComponent
                                    name="btn-list"
                                    variant="contained"
                                    size="small"
                                    label={`Ver`}
                                    // onClick={() => setSelectProcess(item)}
                                    onClick={() => urlRedirect(String(item?.parcela_id))}
                                    labelColor="white"
                                />
                            </div>
                        </div>
                        {(index < listagemUltimaComissao?.length || listagemUltimaComissao?.length > 5) && <Divider />}
                    </>
            )}
                
            {list.length > 5 &&
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ButtonComponent name="lista-completa" variant="text" size="small" label={`Mais ${listagemUltimaComissao?.length - 5} ....`} onClick={() => setSelectedIndex(1)} />
                    <ButtonComponent name="" variant="text" size="small" label={`Ver todos (${listagemUltimaComissao?.length - 5})`} onClick={() => setSelectedIndex(1)} />
                </div>
            }
            {/* {(loading && list.length === 0) && <div className="empty-list">Nenhuma comissão ativa encontrada.</div>} */}
        </div>
    )
}