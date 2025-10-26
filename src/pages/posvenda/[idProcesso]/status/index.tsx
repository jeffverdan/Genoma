import React, { useState, useEffect } from 'react';
import Header from '@/components/DetalhesVenda/Header';
import PostLocalizaProcesso from '@/apis/postLocalizaProcesso';
import { GetServerSideProps } from 'next';
import StatusLine from '@/components/StatusLine';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import postHistoricoStatus from '@/apis/postHistoricoStatus';
import getSaveTopicos from '@/apis/getSaveTopicos';
import PonstosAtencao from '@/components/PontosAtencao';
import AnaliseReciboSinal from '@/components/AnaliseReciboSinal';
import { SelectsType } from '@/interfaces/PosVenda/Analise';
import NotasRecentes from '@/components/NotasRecentes';
import postListarNotas from '@/apis/postListarNotas';
import AlterarStatus from './@AlterarStatus';
import DialogAlterarStatus from '@/components/DialogTrocaStatus';
import { Visualizar } from '@/interfaces/PosVenda/AlterarStatus';
import { useRouter } from 'next/router';
import Corner from '@/components/Corner';
import MapaPrazos from './@MapaPrazos';
import { arrDeadLines, returnDeadLines } from '@/functions/returnDeadLines';
import dayjs from 'dayjs';
interface IHistoricoStatus {
    dias_corridos: string;
    historico_status: {
        id: number | string,
        status_id: number,
        data: string;
        data_expiracao: string;
        nome: string;
        status: string;
        registro?: {
            id: string | number
            protocolo_rgi: string,
            tipo_rgi_id: string | number,
            check_registro: 0 | 1
        }
    }[];
    verifica_data: string;
}

const PainelStatus = ({ idProcesso }: { idProcesso: string }) => {
    const [loading, setLoading] = useState(false);
    const [processData, setProcessData] = useState<ProcessType>();
    const [historicoStatus, setHistoricoStatus] = useState<IHistoricoStatus>();
    const [statusAtual, setStatusAtual] = useState<string>('');
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [cardSelect, setCardSelect] = useState<Visualizar>({});
    const router = useRouter();

    // Posntos de Atenção
    const [origem, setOrigem] = useState('status');
    const [arrTopicsAtencao, setArrTopicsAtencao] = useState<SelectsType[]>();
    const [loadingPontosAtencao, setLoadingPontosAtencao] = useState(false);

    // Notas recentes
    const [loadingNotasRecentes, setLoadingNotasRecentes] = useState(false);
    const [notasRecentes, setNotasRecentes] = useState([]);

    // Alterar Status
    const [newStatus, setNewStatus] = useState(false);

    // DIALOG ALTERAR STATUS CONFIRM    
    const [openDialogStatus, setOpenDialogStatus] = useState(false);

    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [openDialogSolicitacao, setOpenDialogSolicitacao] = useState<boolean>(false)
    const [typeDialog, setTypeDialog] = useState<string>('');

    // Status Atual
    // console.log(statusAtual);

    const returnProcess = async () => {
        setLoading(true);
        const res = await PostLocalizaProcesso(idProcesso) as unknown as ProcessType;
        console.log(res);
        
        if(res) setProcessData({...res, deadline: returnDeadLines(dayjs(), res.mapa_prioridades)});
        setLoading(false);
    };

    const returnHistoricoStatus = async () => {
        setLoadingStatus(true);
        await returnProcess();
        const res: any = await postHistoricoStatus(Number(idProcesso));
        setHistoricoStatus(res);
        setLoadingStatus(false);

        const ultimoStatus: any = res?.historico_status.filter((value: any) => value.status === 'atual').map((value: any) => value);
        setStatusAtual(ultimoStatus?.[0]?.nome);

        if (ultimoStatus?.[0]?.nome === 'Análise') {
            setOpenDialogSolicitacao(true);
        }
    };

    const returnPontosAtencao = async () => {
        setLoadingPontosAtencao(true);

        const topics = await getSaveTopicos(idProcesso) as unknown as SelectsType[];
        setArrTopicsAtencao(topics);

        setLoadingPontosAtencao(false);
    };

    const returnNotas = async () => {
        setLoadingNotasRecentes(true);
        const res: any = await postListarNotas(Number(idProcesso));
        setNotasRecentes(res);
        setLoadingNotasRecentes(false);
    };

    const salvarSair = () => {
        router.push('/posvenda/');
    };

    const onVoltar = () => {
        setCardSelect({})
        setNewStatus(false);
    };

    useEffect(() => {
        // returnListStatus()        
        returnHistoricoStatus();
        returnPontosAtencao();
        returnNotas();
        const open = sessionStorage.getItem('change_status');
        if (open) {
            setOpenDialogStatus(true);
            sessionStorage.removeItem('change_status');
        }

        const param = localStorage.getItem('params')
        if (param) setNewStatus(true);
    }, []);

    const onCloseDialog = () => {
        setOpenDialogStatus(false)
    };

    console.log(processData);
    

    return (
        <>
            <Header
                imovel={processData?.imovel || {}}
                urlVoltar={newStatus ? 'voltar' : undefined}
                salvarSair={newStatus ? undefined : salvarSair}
                gerente={processData?.gerente.data[0]}
                onVoltar={newStatus ? onVoltar : undefined}
            />

            {
                !newStatus
                    ?
                    <>
                        <StatusLine
                            setNewStatus={setNewStatus}
                            idProcesso={idProcesso}
                            historicoStatus={historicoStatus}
                            loadingStatus={loadingStatus}
                            cardSelect={cardSelect}
                            setCardSelect={setCardSelect}
                            processData={processData}
                            openDialog={openDialog}
                            setOpenDialog={setOpenDialog}
                            typeDialog={typeDialog}
                            setTypeDialog={setTypeDialog}
                            returnProcess={returnProcess}
                        />

                        <div className="status-row">
                            <AnaliseReciboSinal
                                processData={processData}
                                origem={origem}
                                idProcesso={idProcesso}
                                refreshPorntosAtencao={returnPontosAtencao}
                            />
                            <div className='col-mapa'>
                                <MapaPrazos
                                    processData={processData}
                                    idProcesso={idProcesso}
                                    setNewStatus={setNewStatus}
                                />
                                <PonstosAtencao
                                    processData={processData}
                                    idProcesso={idProcesso}
                                    origem={origem}
                                    returnPontosAtencao={returnPontosAtencao}
                                    arrTopics={arrTopicsAtencao}
                                    loadingPontosAtencao={loadingPontosAtencao}
                                />

                            </div>
                        </div>
                        <NotasRecentes
                            loadingNotasRecentes={loadingNotasRecentes}
                            idProcesso={idProcesso}
                            notasRecentes={notasRecentes}
                            returnNotas={returnNotas}
                        />
                    </>
                    :
                    <AlterarStatus
                        processData={processData}
                        statusAtual={statusAtual}
                        setNewStatus={setNewStatus}
                        returnHistoricoStatus={returnHistoricoStatus}
                        historicoStatus={historicoStatus}
                        setOpenDialogStatus={setOpenDialogStatus}
                        arrTopics={arrTopicsAtencao}
                        cardSelect={cardSelect}
                        setCardSelect={setCardSelect}
                    />
            }
            <DialogAlterarStatus open={openDialogStatus} onClose={onCloseDialog} />

            {
                openDialog === true &&
                <Corner
                    open={openDialog}
                    setOpen={setOpenDialog}
                    vertical="bottom"
                    horizontal="right"
                    direction="up"
                    type={typeDialog}
                    className='bottom-10'
                />
            }

            {
                (openDialogSolicitacao === true && openDialogStatus === false) &&
                <Corner
                    open={openDialogSolicitacao}
                    setOpen={setOpenDialogSolicitacao}
                    vertical="bottom"
                    horizontal="right"
                    direction="up"
                    type={'solicitar-servico'}
                    className='bottom-10'
                    idProcesso={Number(idProcesso)}
                />
            }
        </>
    )
}

// EXECUTA ANTES DO Devolucao
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso } = context.params as { idProcesso: string };
    return { props: { idProcesso } };
};

export default PainelStatus;