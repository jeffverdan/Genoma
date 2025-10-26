// components/StatusTimeline.tsx
"use client";

import { useRouter } from 'next/router';
import { Stack, Tooltip } from "@mui/material";
import { motion } from "framer-motion";

type StatusType = {
    nome_status: string;
    diferenca_dias: number
};

interface Props {
    status: StatusType[];
    processo_id: number
}

// Função para gerar cor baseada na "temperatura"
function getColor(dias: number, min: number, max: number) {
    const percent = (dias - min) / (max - min || 1); // normaliza entre 0 e 1
    const hue = 40 - percent * 40; // laranja (40) até vermelho escuro (0)
    const saturation = 70;
    const lightness = 80 - percent * 30; // mais dias = mais escuro
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export default function StatusTimeline({ status, processo_id }: Props) {
    // Calcula os dias de cada status
    const minDias = status ? Math.min(...status.map((s) => s.diferenca_dias)) : 0;
    const maxDias = status ? Math.max(...status.map((s) => s.diferenca_dias)) : 0;
    const router = useRouter();

    return (
        <Stack direction="row" spacing={0} sx={{ width: "100%" }} className="stack-line">
            {status?.map((s) => (
                    <div className="status-content" style={{ flex: s.diferenca_dias }} key={s.nome_status}>
                        <p>{s.nome_status}</p>
                        <Tooltip
                            key={s.nome_status}
                            title={`${s.nome_status}: ${s.diferenca_dias} dias`}
                            arrow
                            placement="top"
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                style={{                                 
                                    margin: '4px 0px',                                    
                                    height: 28,
                                    backgroundColor: getColor(s.diferenca_dias, minDias, maxDias),                                    
                                    cursor: "pointer",
                                }}
                                whileHover={{
                                    scale: 1.05,                                    
                                    boxShadow: "0px 4px 12px rgba(0,0,0,0.25)",
                                    zIndex: 1,
                                }}
                                onClick={() => [localStorage.setItem('tab_select', '6'), router.push(`posvenda/${processo_id}/detalhes-venda/`)]}

                            />
                        </Tooltip>
                        <p>{s.diferenca_dias}</p>
                    </div>
                
            ))}
        </Stack>
    );
}
