import formatoMoeda from "@/functions/formatoMoedaViewApenas";
import { ParcelaComissoesType } from "@/interfaces/Apoio/planilhas_comissao";
import { Skeleton } from "@mui/lab";

const formatNumber = (value: string | null) => {
    if (!value) return 0;
    return Number((value.replace(/[R$.]+/g, '')).replace(",", "."));
};

export default function FooterCardsPercent(props: { dataParcela: ParcelaComissoesType | undefined }) {
    const { dataParcela } = props;

    const calcPercentDestribuida = () => {
        const arrKeys = [
            'corretores_opcionistas',
            'corretores_vendedores',
            'gerentes',
            'gerentes_gerais',
            'diretores_gerais',
            'repasse_franquias',
        ] as const;

        let count = 0;
        arrKeys.forEach((key) => {
            count += Number(dataParcela?.[key]?.reduce((acc, value) => acc + Number(value.porcentagem_real), 0) || 0);
        });

        const royalties = Number(dataParcela?.royalties.porcentagem_real || 0);
        const comunicacao = Number(dataParcela?.comunicacao.porcentagem_real || 0);
        count = count + royalties + comunicacao;

        return count;
    };

    const calcTotalDestribuido = () => {
        const valorParcela = formatNumber(dataParcela?.valor_parcela || '0');
        const percent = calcPercentDestribuida();
        const valor = (valorParcela * percent) / 100
        return formatoMoeda(valor.toFixed(2));
    };

    const calcTotalEmpres = () => {
        const valorParcela = formatNumber(dataParcela?.valor_parcela || '0');
        const valoresDestribuidos = formatNumber(calcTotalDestribuido())
        const valor = valorParcela - valoresDestribuidos;
        console.log(valorParcela, valoresDestribuidos);
        
        return formatoMoeda(valor.toFixed(2));
    };

    const checkValorEmpresa = () => {
        const percentCadastrada = dataParcela?.empresas.reduce((acc, value) => acc + Number(value.porcentagem_real), 0) || 0;
        const percentCalculada = 100 - calcPercentDestribuida();        

        if (percentCadastrada !== percentCalculada) {
            return 'red'
        } else {

            return ''
        }
    };


    return (
        <div className="container-cards apoio">
            <div className="card-apoio valores">
                <p className="sub">Soma total de porcentagem =</p>
                <p className={`sub ${calcPercentDestribuida() >= 100 ? 'red' : ''}`}>{calcPercentDestribuida()}%</p>
                <p className="sub border">Restante empresa =</p>
                <p className={`sub border ${checkValorEmpresa()}`}>{100 - calcPercentDestribuida()}%</p>
                <p className="title">Total de porcentagem = </p>
                <p className="green">100%</p>
            </div>

            <div className="card-apoio valores">
                <p className="sub">Soma total de comissão =</p>
                <p className="sub">{calcTotalDestribuido()}</p>
                <p className="sub border">Restante empresa =</p>
                <p className={`sub border ${checkValorEmpresa()}`}>{calcTotalEmpres()}</p>
                <p className="title">Valor total da planilha = </p>
                <p className="green">{dataParcela?.valor_parcela ? dataParcela.valor_parcela : <Skeleton variant="rounded" width={80} height={10} />}</p>
            </div>
        </div>
    );
}