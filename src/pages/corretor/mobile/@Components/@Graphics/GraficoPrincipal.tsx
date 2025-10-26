
import { Chip, Divider } from '@mui/material/';
import { PieChart } from '@mui/x-charts/PieChart';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid';
import formatoMoeda from '@/functions/formatoMoedaViewApenas';
interface PropsType {
    title: string
    dataAtual?: string
    soma_total: string
    quantidade_total: number
    DATA_CHART: {
        label: string;
        value: number;
        color: string;
    }[]
    vgv: number
}

export default function GraficoPrincipal(props: PropsType) {
    const { title, dataAtual, soma_total, quantidade_total, DATA_CHART, vgv } = props;

    console.log(vgv);
    const isNegativeValue = (vgv?: number): boolean => {
        if (!vgv) return false;


        // Remove R$, espaços e formatação para converter em número
        // const numericValue = Number(
        //     vgv.replace('R$', '')
        //     .replace(/\s/g, '')
        //     .replace('.', '')
        //     .replace(',', '.')
        // );
        if (vgv === 0) return false; // Considerar zero como não negativo
        return vgv < 0;
    };

    // Uso:
    const vgvIsNegative = isNegativeValue(vgv);
    const vgvClass = vgvIsNegative ? 'negativo' : 'positivo';

    const returnClass = (vgv: number): string => {
        if (vgv > 0) return 'green';
        if (vgv < 0) return 'red';
        return '';
    };

    const returnLabel = (vgv: number): string => {
        if (vgv > 0) return 'Aumento de VGV';
        if (vgv < 0) return 'Redução de VGV';
        return 'Sem alteração de VGV';
    };

    return (
        <div className="grafico-principal">
            <div className="header-grafico">
                <p>{title}</p>
                {!!dataAtual && <div className="mes">
                    Mês:
                    <Chip label={dataAtual} className="chip green" />
                    {/* <InputSelect 
                                name="mês" 
                                label="Selecione o mês" 
                                placeholder="Escolha um mês" 
                            /> */}
                </div>}
            </div>
            <Divider />
            <div className="grafico-content">
                <div className="content-info">
                    <div className="valor-content">
                        <span className="cifra">R$</span>
                        <span className="valor">{soma_total}</span>
                    </div>
                    <div className={`comparacao-vgv ${returnClass(vgv)}`}>
                            {vgv > 0 && <ArrowUpIcon />}
                            {vgv < 0 && <ArrowDownIcon />}
                        <span className="resultado">
                            <Chip className={`chip ${returnClass(vgv)} valor`} label={returnLabel(vgv)} />
                        </span>
                        {vgv != 0 && <span className="valor">{`R$ ${formatoMoeda(vgv).replace('R$', '').trim()}`}</span>}
                    </div>
                    <div className={`comparacao-vgv ${returnClass(vgv)}`}>
                        {vgv > 0 && <ArrowUpIcon />}
                        {vgv < 0 && <ArrowDownIcon />}
                        <Chip className={`chip ${returnClass(vgv)} `} label={`${quantidade_total} OPÇÕES`} />
                    </div>
                </div>

                <div className="content-body">

                    {DATA_CHART && <PieChart
                        series={[{
                            data: DATA_CHART,
                            startAngle: -90,
                            endAngle: 90,
                            innerRadius: 50,
                            outerRadius: 117,
                            cx: 112,
                            cy: 112,
                        }]}
                        height={118}
                        width={234}
                        slotProps={{ legend: { hidden: true } }}
                    />}
                </div>
                <div className="legenda-grafico">
                    {DATA_CHART?.map((item, index) => (
                        <div className="item-container" key={index}>
                            <span className="valor" style={{ color: item.color }}>{item.value}%</span>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}