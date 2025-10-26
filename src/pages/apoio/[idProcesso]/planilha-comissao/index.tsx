import getDataPlanilhaComissao from "@/apis/getDataPlanilhaComissao";
import Header from "./@Header";
import HeadSeo from "@/components/HeadSeo";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { ComissaoDataType, DadosProcessoType } from "@/interfaces/Apoio/planilhas_comissao";
import { Skeleton } from "@mui/lab";
import ButtonComponent from "@/components/ButtonComponent";
import SwipeableViews from "react-swipeable-views-react-18-fix";
import DadosComissao from "./@DadosComissao";
import EditDadosComissao from "./@EditDadosComissao";
import { Check } from "@mui/icons-material";
import formatoMoeda from "@/functions/formatoMoedaViewApenas";
import { useRouter } from 'next/router';

export default function PlanilhasComissao({ idProcesso }: { idProcesso: string }) {
    const [imovelData, setImovelData] = useState<DadosProcessoType>();
    const [comissionData, setComissionData] = useState<ComissaoDataType>();
    const [editComissionData, setEditComissionData] = useState(-1);
    const router = useRouter();

    useEffect(() => {
        getData();
        setEditComissionData(0);
    }, []);

    const getData = async () => {
        const data = await getDataPlanilhaComissao(idProcesso);
        if (data?.comissao && data?.imovel) {
            setImovelData(data.imovel)
            setComissionData(data.comissao)
            console.log(data.comissao);
        }
    };

    const calcTotalDestribuido = () => {
        if (comissionData) {
            const porcentagemDestribuida = calcPercentDestribuida();
            const numberComissaoLiquida = (comissionData.valor_comissao_liquida?.replace(/[R$.]+/g, ''))?.replace(",", ".");
            const valorTotal = Number(numberComissaoLiquida || 0);
            const valorDestribuido = porcentagemDestribuida * valorTotal / 100;
            return formatoMoeda(valorDestribuido.toFixed(2))
        }
        return "R$ 0,00"
    };

    const calcPercentDestribuida = () => {
        if (comissionData) {
            const gerente = Number(comissionData.porcentagem_comissao_gerentes || 0);
            const gerenteGeral = Number(comissionData.porcentagem_comissao_gerente_gerais || 0);
            const opcionistas = Number(comissionData.porcentagem_corretores_opicionistas_comissao || 0);
            const vendedores = Number(comissionData.porcentagem_corretores_vendedores_comissao || 0);
            const valorDestribuido = (gerente + gerenteGeral + opcionistas + vendedores)
            return valorDestribuido;
        }
        return 0;
    };

    const calcTotalEmpres = () => {
        if (comissionData) {
            const numberComissaoLiquida = Number((comissionData.valor_comissao_liquida?.replace(/[R$.]+/g, ''))?.replace(",", ".") || 0);
            const valorDestribuido = Number((calcTotalDestribuido().replace(/[R$.]+/g, '')).replace(",", ".") || 0);
            const valorEmpresa = numberComissaoLiquida - valorDestribuido;

            return formatoMoeda(valorEmpresa.toFixed(2))
        }
        return "R$ 0,00"
    };

    const saveDataComission = () => {
        scrollTo(0, 0);
        setEditComissionData(0)
    };

    return (
        <div className="planilhas-apoio">
            <HeadSeo titlePage={"Planilhas"} description='Gerenciar planilhas' />


            <SwipeableViews
                axis={'y'}
                index={editComissionData}
                // onChangeIndex={handleTab}
                className={'swipe-container apoio ' + (editComissionData === 0 ? 'h138' : 'h98')}
            >
                {[{}, {}].map((tab, index) => (
                    <div key={index} hidden={index != editComissionData}>
                        {/* {tab.page} */}
                        {editComissionData === 0 && <DadosComissao imovelData={imovelData} comissionData={comissionData} setEditComissionData={setEditComissionData} />}
                        {/* {editComissionData === 1 && <DadosComissao imovelData={imovelData} comissionData={comissionData} setEditComissionData={setEditComissionData}  />} */}
                        {editComissionData === 1 && <EditDadosComissao comissionData={comissionData} setComissionData={setComissionData} />}
                    </div>
                ))}
            </SwipeableViews>

            <footer className={editComissionData === 0 ? 'h138' : 'h98'}>
                <div className="container-cards apoio">
                    <div className="card-apoio valores">
                        <p className="sub">Soma total de porcentagem =</p>
                        <p className="sub">{calcPercentDestribuida()}%</p>
                        <p className="sub border">Restante empresa =</p>
                        <p className="sub border">{100 - calcPercentDestribuida()}%</p>
                        <p className="title">Total de porcentagem = </p>
                        <p className="green">100%</p>
                    </div>

                    <div className="card-apoio valores">
                        <p className="sub">Soma total de comissão =</p>
                        <p className="sub">{calcTotalDestribuido()}</p>
                        <p className="sub border">Restante empresa =</p>
                        <p className="sub border">{calcTotalEmpres()}</p>
                        <p className="title">Valor total de comissão líquida = </p>
                        <p className="green">{comissionData?.valor_comissao_liquida ? comissionData.valor_comissao_liquida : <Skeleton variant="rounded" width={80} height={10} />}</p>
                    </div>
                </div>

                {!!comissionData?.parcelas_empresa[1] &&
                    <p className={editComissionData === 0 ? 'visibility' : 'hidden'}>
                        <b>{comissionData.parcelas_empresa.filter((e) => !!e.ultima_data_envio).length}/{comissionData.parcelas_empresa.length}</b> planilhas enviadas
                    </p>
                }

                {editComissionData === 0 && <ButtonComponent onClick={() => router.push(`/apoio`)} label={"Concluir tarefa"} size={"large"} variant={"contained"} labelColor="white" endIcon={<Check className="svg-save" />} />}
                {editComissionData === 1 && <ButtonComponent onClick={saveDataComission} label={"Salvar edição"} size={"large"} variant={"contained"} labelColor="white" endIcon={<Check className="svg-save" />} />}
            </footer>
        </div>
    )
}

// EXECUTA ANTES DO DASHBOARD
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso } = context.params as { idProcesso: string };
    return { props: { idProcesso } };
};