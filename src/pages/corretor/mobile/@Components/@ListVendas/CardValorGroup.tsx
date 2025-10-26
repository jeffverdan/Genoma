import ButtonComponent from "@/components/ButtonComponent";
import { listAndamentoType, TypeComissionsCorretores, ValoresProducao } from "@/interfaces/Corretores";
import { Skeleton } from "@mui/lab";
import { useState } from "react";
import { Chip } from "@mui/material";

interface CardValorProps {
    // valor?: string;
    type: TypeComissionsCorretores
    handleTab: (type: TypeComissionsCorretores) => void // Função para lidar com a mudança de aba  
    list: listAndamentoType
    loading?: boolean; // Indica se está carregando
    valoresProducao: ValoresProducao[]; // Valores de produção para o painel
}

export default function CardValorGroup(props: CardValorProps) {
    const { type, list, handleTab, loading, valoresProducao } = props;
    const [date, setDate] = useState<Date>(new Date());

    console.log('valoresProducao: ', valoresProducao);

    // const arrTags = [
    //     {label: 'Em Andamento', style: 'yellow600'},
    //     {label: 'Liberado', style: 'yellow500'},
    //     {label: 'Solicitado', style: 'primary500'},
    //     {label: 'Em Transferência', style: 'green500'},
    //     {label: 'Concluído', style: 'green500'},
    // ]

    return (
        <>
            <div className={type === 'cancelados' ? 'card-cancelados' : `card-content card-full-w ${type}`}>
                <p className="label">Total de produção</p>
                <div className="divider"></div>
                <div className="valor-container">
                    {/* <span className="sigla">R$</span> */}
                    <span className="valor">
                        {loading
                            // ? <Skeleton width={type === 'cancelados' ? 50 : 160} />
                            // : list?.valorTotal || "-----"

                            ? <Skeleton width={type === 'cancelados' ? 50 : 160} />
                            : valoresProducao?.find(data => data.label === 'Valor total')?.valor || "R$ 0,00"
                        }
                    </span>
                </div>
                <div className="action-container">
                    {(!!list?.list[0]) && <ButtonComponent variant="text" label={`Ver produção (${!!list.list[0] ? list.list.length : ''})`} size="small" onClick={() => handleTab(type)} />}
                </div>
            </div>

            <div className="card-list-valor">
                {
                    valoresProducao?.filter((data, index) => index > 0 && index < 6).map((data, index) => (
                        <div className="content" key={index}>
                            <Chip className={`chip ${data.style}`} label={data.label} />
                            <div className="valor">
                                { loading ? 
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        R$
                                        <Skeleton width={100} /> 
                                    </div>
                                    : data.valor
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}