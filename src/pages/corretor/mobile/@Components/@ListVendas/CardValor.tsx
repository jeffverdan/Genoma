import ButtonComponent from "@/components/ButtonComponent";
import { listAndamentoType, TypeComissionsCorretores } from "@/interfaces/Corretores";
import { Skeleton } from "@mui/lab";
import { useState } from "react";

interface CardValorProps {
    // valor?: string;
    type: TypeComissionsCorretores
    handleTab: (type: TypeComissionsCorretores) => void // Função para lidar com a mudança de aba  
    list: listAndamentoType
    loading?: boolean; // Indica se está carregando
}

export default function CardValor(props: CardValorProps) {
    const { type, list, handleTab, loading } = props;
    const [date, setDate] = useState<Date>(new Date());

    const returnLabel = () => {
        switch (type) {
            case 'liberado':
                return 'Liberado';
            case 'producao-anual':
                return `Em andamento (${date.getFullYear()})`;
            case 'a-receber':
                return 'A receber';
            case 'sacado':
                return 'Sacado';
            case 'concluidos':
                return 'Concluídos';
            case 'cancelados':
                return 'Cancelados';
            case 'andamento':
                return 'Em andamento';
            default:
                return '';
        }
    };

    const returnLabelBtn = () => {
        switch (type) {
            case 'producao-anual':
                return `Ver em andamento`;
            case 'concluidos':
                return 'Ver concluídos';
            case 'cancelados':
                return 'Ver cancelados';
            case 'andamento':
                return 'Ver em andamento';
            default:
                return '';
        }
    };

    return (
        <div className={type === 'cancelados' ? 'card-cancelados' : `card-content ${type}`}>
            <p className="label">{returnLabel()}</p>
            <div className="divider"></div>
            <div className="valor-container">
                <span className="sigla">R$</span>
                <span className="valor">
                    {loading
                        ? <Skeleton width={type === 'cancelados' ? 50 : 160} />
                        : list?.valorTotal || "-----"
                    }
                </span>
            </div>
            <div className="action-container">
                {(!!list?.list[0]) && <ButtonComponent variant="text" label={`${returnLabelBtn()} (${!!list.list[0] ? list.list.length : ''})`} size="small" onClick={() => handleTab(type)} />}
            </div>
        </div>
    )
}