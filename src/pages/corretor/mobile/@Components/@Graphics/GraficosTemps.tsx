
import { Chip, Divider, LinearProgress  } from '@mui/material/';
import { PieChart } from '@mui/x-charts/PieChart';

interface PropsType {
    index: number;
    icon: JSX.Element | undefined;
    chipColor: string;
    opcoes: number;
    label: string;
    value: number;
    color: string;
    valor_total: string;
    setSelectTabInvest: (e: number) => void;
}

const returnMsm = (item: string) => {
    switch (item) {
        case 'Frio':
            return <span>Chance de <b>aumentar</b> o potencial de retorno.</span>;
        case 'Morno':
            return <span><b>Atualize</b> antes que essa opção esfrie.</span>;
        case 'Quente':
            return <span></span>;
        default:
            return <span></span>;
    }
};

export default function GraficosTemps(props: PropsType) {
    const { index, icon, chipColor, opcoes, label, value, color, valor_total, setSelectTabInvest } = props;

    const handleSelectInvestimento = async (index: number) => {
        sessionStorage.setItem('investimento_menu_item', String(index + 1));
        setSelectTabInvest(index + 1)
    }
    
    return (
        <div className="card-temperaturas" key={index} onClick={() => handleSelectInvestimento(index)} style={{cursor: 'pointer'}}>
            <div className="header-card">
                <div className="label">
                    {icon}
                    <Chip className={`chip ${chipColor} pill`} label={label} />
                </div>
                <span className="opcoes">{opcoes} OPÇÕES</span>
            </div>

            <div className="card-content">
                <div className={`valor-percent ${chipColor}`}>
                    <span>{value?.toFixed(0)}%</span>
                </div>
                <div className="valor-real">
                    <span>
                        {`R$ `}
                        <span className="valor">{valor_total}</span>
                    </span>
                    <LinearProgress variant="determinate" value={Number(value || 0)} className={chipColor} />
                </div>
            </div>
            <Divider />
            <div className="footer-msg">
                {returnMsm(label)}
            </div>

        </div>
    );
}