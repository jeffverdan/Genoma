import ProgressBar from "@/components/ProgressBar";
import converterParaReal from "@/functions/converterParaReal";
import { ItemListRecentsType } from "@/interfaces/Corretores"
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Chip, Avatar } from '@mui/material/';
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

interface PropsType {
    list: ItemListRecentsType[]
    setSelectProcess: (e: ItemListRecentsType | null) => void
    typeList?: string
    listagemUltimaComissao: ItemListRecentsType[];
    statusIdMenu?: number; // Status do menu
    setStatusIdMenu: (e: number) => void; // Função para atualizar o status do menu
}

export default function ListComission(props: PropsType) {
    const { list, setSelectProcess, typeList, listagemUltimaComissao, statusIdMenu, setStatusIdMenu } = props;
    const [listAtt, setListAtt] = useState<ItemListRecentsType[]>(list);
    const router = useRouter();

    useEffect(() => {
        setListAtt(list);
    }, [list]);

    console.log('LISTATT: ' , listAtt)

    // console.log('ListComission - list: ', list);    

    const labelChipAndDate = (item: ItemListRecentsType) => {
        if(item?.finance_status_id === '9'){
            return { label: "Em andamento", labelDate: "Previsão de pagamento", chip: 'yellow600' };
        }
        else if(item?.finance_status_id === '12'){
            return { label: "Em transferência", labelDate: "Última transferência", chip: 'yellow500' };
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
    }, [router, statusIdMenu]);

    function convertReal(value: string | number | null | undefined): string {
        if (value === null || value === undefined) return '0,00';

        // Se já for número, só formatar
        if (typeof value === 'number') {
            return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // Remove tudo que não for número ou vírgula/ponto
        let valorLimpo = value.toString().replace(/[^0-9.,]/g, '');

        // Se vier no formato brasileiro (tem vírgula e ponto)
        if (valorLimpo.match(/^\d{1,3}(\.\d{3})*,\d{2}$/)) {
            // Troca ponto por nada e vírgula por ponto para virar float
            valorLimpo = valorLimpo.replace(/\./g, '').replace(',', '.');
        } else if (valorLimpo.match(/^\d+(\.\d{2})$/)) {
            // Formato americano: 3000.00
            // Nada a fazer, já está correto
        } else if (valorLimpo.match(/^\d+,\d{2}$/)) {
            // Formato brasileiro sem milhar: 3000,00
            valorLimpo = valorLimpo.replace(',', '.');
        }

        const numero = parseFloat(valorLimpo);

        if (isNaN(numero)) return '0,00';

        return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    return (
        <div className="list-corretores">
            {
                listAtt?.length !== 0 
                ?
                <div style={{marginBottom: '0', fontSize: '14px', textAlign: 'center', color: '#74848B', padding: '10px', backgroundColor: '#fff', borderRadius: '8px'}}>
                    { listAtt?.length !== 0 ? `Mostrando ${listAtt?.length} ${listAtt?.length === 1 ? 'venda' : 'vendas'}` : ''}
                </div>
                : ''
            }
            
            {listagemUltimaComissao?.map((item, i) => (
                <div key={i} className="item-container" /*onClick={() => setSelectProcess(item)}*/ onClick={() => urlRedirect(String(item?.parcela_id))}>
                    <div className="valor-date">
                        <div className="valor-container">
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Chip className={`chip ${labelChipAndDate(item)?.chip}`} label={labelChipAndDate(item)?.label} />
                                { labelChipAndDate(item)?.label !== 'Em andamento' ? <Chip className={`chip neutral500`} label={`${item?.soma_porcentagem || 0}%`} /> : '' }
                            </div>
                            <div className={`valor-content`}>
                                <span className="moeda">R$</span>
                                <span className="valor">{converterParaReal(item.soma ?? 0) || item.valor_anunciado || '-----'}</span>
                            </div>
                            <span className="tipo">{(item.tipo_comissao === 'partes' ? `Parcela ${item.numero_parcela} ${item.total_parcelas ? 'de ' + item.total_parcelas : ''}` : 'Á Vista')}</span>
                        </div>
                        <div className="date-container">
                            <p className={labelChipAndDate(item)?.chip}>{labelChipAndDate(item)?.labelDate}</p>
                            <span>{item?.data_ordenacao_exibicao || 'Não definida'}</span>
                        </div>
                    </div>

                    {
                        // (labelChipAndDate(item)?.label === 'Em transferência') &&
                        item.finance_status_id === '12'
                        ?
                        <div className="progress-container">
                            <div className={`progress-value`}>R$ {convertReal(item?.valor_transferido ?? 0)} DE {convertReal(item?.soma ?? 0)}</div>
                            <ProgressBar progress={item?.porcentagem_faltante} />
                        </div>
                        :
                        ''
                    }
                    
                    <div className="info-container">
                        <Avatar >{
                            item.url_imagens
                                ? <Image className="img-anuncio" src={item.url_imagens} width={40} height={40} alt={"Fotografio imóvel"} />
                                : item.link_imagem_miniatura
                                    ? <Image className="img-anuncio" src={item?.link_imagem_miniatura || ''} width={40} height={40} alt={"Fotografio imóvel"} />
                                    : <PhotoIcon width={20} />
                        }</Avatar>
                        <div className="endereco-container">
                            <p>{item.logradouro}{item.numero ? ', ' + item.numero : ''}</p>
                            <p className="subtitle">
                                {item.unidade || ''}
                                {item.complemento || ''}
                                {((item.unidade || item.complemento) && item.bairro) ? ' - ' : ''}
                                {item.bairro || ''}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}