import { useCallback, useEffect, useState } from "react";
import { ListBulletIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { Avatar, Chip, Collapse, Skeleton } from "@mui/material";
import { ItemListRecentsType, listAndamentoType, UrlsAnunciosType, } from "@/interfaces/Corretores";
import Image from "next/image";
import converterParaReal from "@/functions/converterParaReal";
import { useRouter } from "next/router";

interface PropsType {    
    setSelectProcess: (e: ItemListRecentsType | null) => void
    selectProcess: ItemListRecentsType | null    
    loading: boolean
    listAndamento: listAndamentoType
    listConcluidos: listAndamentoType
    listCancelados: listAndamentoType
    listagemUltimaComissao: ItemListRecentsType[]; // Lista de últimas comissões
}

export default function ListRecents({ setSelectProcess, loading, listAndamento, listCancelados, listConcluidos, listagemUltimaComissao }: PropsType) {
    const [collapseList, setCollapseList] = useState(true);
    const [list, setList] = useState<ItemListRecentsType[]>([]);
    const router = useRouter();
    console.log("Listagem de comissões recentes:", listagemUltimaComissao);

    const labelChipAndDate = (item: ItemListRecentsType) => {
        if(item?.finance_status_id === '9'){
            return { label: "Em andamento", labelDate: "Previsão de pagamento", chip: 'yellow600' };
        }
        else if(item?.finance_status_id === '12'){
            return { label: "Em transferência", labelDate: "Última transferência", chip: 'green500' };
        }
        else if(item?.finance_status_id === '13'){
            // ID 13 Transferido mas exibindo como Concluído
            return { label: "Concluído", labelDate: "Data de conclusão", chip: 'green500' };
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

    const handleClickComissao = (value: number | undefined, status: string | undefined) => {
        console.log('STATUS ULTIMAS COMISSÕES: ', status)

        sessionStorage.setItem('comissao_menu', '1');
        sessionStorage.setItem('comissao_menu_status', String(status));

        switch (status) {
            case '10':
                sessionStorage.setItem('comissao_type_menu', '0');
                break;

            case '11':
                sessionStorage.setItem('comissao_type_menu', '1');
                break;

            case '12':
                
                sessionStorage.setItem('comissao_type_menu', '2');
                break;

            case '9':
                sessionStorage.setItem('comissao_type_menu', '3');
                break;

            case '13':
                sessionStorage.setItem('comissao_type_menu', '4');
                break;

            case '16':
                sessionStorage.setItem('comissao_type_menu', '5');
                break;
        
            default:
                sessionStorage.removeItem('comissao_menu');
                sessionStorage.removeItem('comissao_menu_status');
                sessionStorage.removeItem('comissao_type_menu');
                break;
        }

        urlRedirect(String(value))
    }

    return (
        <div className="ultimas-vendas">
            <div className="header-list" onClick={() => setCollapseList((e) => !e)}>
                <ListBulletIcon className="icon" />
                {/* <h5>Últimas comissões {!!listagemUltimaComissao?.[0] ? `(${listagemUltimaComissao?.length > 3 ? 3 : listagemUltimaComissao?.length})` : ''}</h5> */}
                <h5>Últimas comissões {listagemUltimaComissao?.length > 0 ? `(${listagemUltimaComissao?.length})` : ''}</h5>
            </div>
            <Collapse in={collapseList} timeout={600}>
                <div className="list-corretores">
                    {listagemUltimaComissao?.map((item, i) => (
                        !loading ? 
                        <div key={loading ? i : item.id} className="item-container" >
                            <div className="valor-date">
                                <div className="valor-container">
                                    <Skeleton variant="rectangular" width={100} height={20} />
                                    <div className="valor-content">
                                        <span className="moeda">R$</span>
                                        <Skeleton variant="rectangular" width={60} height={20} />
                                    </div>
                                    <Skeleton variant="text" width={100} height={20} />
                                </div>
                                <div className="date-container">
                                    <Skeleton variant="text" width={100} height={20} />
                                    <Skeleton variant="text" width={60} height={20} />
                                </div>
                            </div>
                            <div className="info-container">
                                <Avatar>
                                    <Skeleton variant="circular" width={40} height={40} />
                                </Avatar>
                                <div className="endereco-container">
                                    <Skeleton variant="text" width={200} height={20} />
                                    <Skeleton variant="text" width={150} height={20} />
                                </div>
                            </div>
                        </div>
                            : <div key={item.id} className="item-container" /*onClick={() => setSelectProcess(item)}*/ onClick={() => handleClickComissao(item?.parcela_id, item?.finance_status_id)}>
                                <div className="valor-date">
                                    <div className="valor-container">
                                        <Chip className={`chip ${labelChipAndDate(item)?.chip}`} label={labelChipAndDate(item)?.label} />
                                        <div className="valor-content">
                                            <span className="moeda">R$</span>
                                            <span className="valor">{converterParaReal(item?.soma ?? 0) || '-----'}</span>
                                        </div>
                                        <span className="tipo">{(item.tipo_comissao === 'partes' ? `Parcela ${item.numero_parcela} ${item.total_parcelas ? 'de ' + item.total_parcelas : ''}` : 'Á Vista')}</span>
                                    </div>
                                    <div className="date-container">
                                        <p className={labelChipAndDate(item)?.chip}>{labelChipAndDate(item)?.labelDate}</p>
                                        <span>{item?.data_ordenacao_exibicao || 'Não definida'}</span>
                                    </div>
                                </div>

                                <div className="info-container">
                                    <Avatar >{item.url_imagens ? <Image height={40} src={item.url_imagens} alt={"Fotografio imóvel"} /> : <PhotoIcon width={20} />}</Avatar>
                                    <div className="endereco-container">
                                        <p>{item.logradouro}{item.numero ? ', ' + item.numero : ''}</p>
                                        <p className="subtitle">
                                            {/* {item.complemento || ''}
                                            {(item.complemento && item.bairro) ? ' - ' : ''}
                                            {item.bairro || ''} */}

                                            {/* {(item.unidade) && ' / '} */}
                                            {item.unidade}
                                            {(item.complemento) && ' / '}
                                            {item.complemento}
                                            {(item.bairro) && ' - '}
                                            {item.bairro}
                                        </p>
                                    </div>
                                </div>
                            </div>
                    ))}
                </div>
            </Collapse>
        </div>
    )
}