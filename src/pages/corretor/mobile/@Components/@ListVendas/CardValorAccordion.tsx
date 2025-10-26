import ButtonComponent from "@/components/ButtonComponent";
import { listAndamentoType, TypeComissionsCorretores, ValoresProducao } from "@/interfaces/Corretores";
import { Skeleton } from "@mui/lab";
import { useState } from "react";

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { Chip } from "@mui/material";

interface CardValorProps {
    // valor?: string;
    type: TypeComissionsCorretores
    handleTab: (type: TypeComissionsCorretores) => void // Função para lidar com a mudança de aba  
    list: listAndamentoType
    loading?: boolean; // Indica se está carregando
    valoresProducao: ValoresProducao[]; // Valores de produção para o painel
}

export default function CardValorAccordion(props: CardValorProps) {
    const { type, list, handleTab, loading, valoresProducao } = props;
    const [date, setDate] = useState<Date>(new Date());

    let qtdProducao = 0;
    valoresProducao?.forEach(data => {
        if (data?.qtd) {
            qtdProducao += Number(data?.qtd);
        }
    });
    console.log(qtdProducao)
        
    return (
        <div className={type === 'cancelados' ? 'card-cancelados' : `card-content card-accordion ${type}`}>
            <Accordion className={`card-accordion-info `}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography component="span">
                        <p className="label">Total de produção</p>
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
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ul className="list-valor">
                        {
                            valoresProducao?.filter((data, index) => index > 0).map((data, index) => (
                                <li key={index}>
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
                                </li>
                            ))
                        }
                    </ul>
                </AccordionDetails>
            </Accordion>

            {
                qtdProducao > 0 &&
                <div className="action-container">
                    {(!!valoresProducao?.[0]) && <ButtonComponent variant="text" label={`Ver produção (${ qtdProducao })`} size="small" onClick={() => handleTab(type)} />}
                </div>
            }
        </div>
    )
}