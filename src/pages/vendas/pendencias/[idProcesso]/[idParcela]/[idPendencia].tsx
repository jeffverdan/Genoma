import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { GetServerSideProps } from "next";
import HeadSeo from "@/components/HeadSeo";
import Header from "@/components/DetalhesVenda/Header";
import ParcelaProcessoById from "@/apis/getParcela_Processo";
import { DadosProcessType, ParcelaProcessoResponse } from "@/interfaces/Financeiro/Status";
import { ArrowRightIcon, CurrencyDollarIcon, PencilIcon } from "@heroicons/react/24/solid";
import { Alert, Chip, Divider, Tooltip } from '@mui/material';
import ButtonComponent from "@/components/ButtonComponent";
import baixarPlanilhaApoio from '@/apis/baixarPlanilhaApoio';
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import GroupUsers from '@/images/GroupUsers';
import CheckBox from "@/components/CheckBox";
import ModalConfirmacao from "./@componentes/ModalConfirm";
import EditarDadosResponsaveis from "./@componentes/EditarDadosResponsaveis";
import GerentePendenciasById from "@/apis/getPendenciaGerente";
import { ExibirPendenciasType } from "@/interfaces/Vendas/Pendencias";
import concluirPendencia from "@/apis/postConcluirPendencia";

interface PendenciasProps {
    idProcesso: string;
    idParcela: string;
    idPendencia: string;
}

const formatarEndereco = (imovel: DadosProcessType | undefined): string => {
    if (imovel === undefined) return '';
    const { logradouro, numero, unidade, complemento, bairro, cidade, uf } = imovel;
    return `${logradouro}, ${numero},${unidade ? ' ' + unidade + ',' : ''}${complemento ? ' ' + complemento + ',' : ''} ${bairro}, ${cidade} - ${uf}`;
};

const Pendencias = (props: PendenciasProps) => {
    const { idProcesso, idParcela, idPendencia } = props;
    const [processData, setProcessData] = useState<ExibirPendenciasType>();
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [dialogConfirm, setDialogConfirm] = useState(false);
    const [changeEditar, setChangeEditar] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (!idProcesso || !idParcela) {
            router.replace('/vendas');
            return;
        } else {
            retunProcess();
        }
    }, []);

    const retunProcess = async () => {
        setLoading(true);
        const req = { processo_id: idProcesso, parcela_id: idParcela, pendencia_id: idPendencia };
        const res = await GerentePendenciasById(req);
        if (res && res.pendencia_concluida) {
            router.replace('/vendas');
            return;
        } else if (res) {
            setProcessData({
                ...res,
                dados_processo: {
                    ...res.dados_processo,
                    gerente_name: '' // GAMBIARRA PRA REMOVER O GERENTE DO HEADER
                }
            });
        }
        setLoading(false);
    };

    const onClickConfirm = async () => {
        if (!processData) return;
        const sendData = {
            pendencia_id: processData?.pendencia_id || 0,
            parcela_id: processData?.dados_parcela.parcela_id || 0,
            usuario_id: localStorage.getItem('usuario_id') || ''
        }
        const res = await concluirPendencia(sendData);
        if (!!res) {
            setDialogConfirm(true);
        }
    };

    return (
        <div className="pendencias-parcela-container">
            <HeadSeo titlePage={"Pendencias"} description='Pendencias da Parcela' />
            <Header
                imovel={processData?.dados_processo || {}}
                urlVoltar={'/vendas'}
                salvarSair={() => router.back()}
                onVoltar={() => changeEditar ? setChangeEditar(false) : router.back()}
                responsavel={{ name: processData?.dados_processo?.pos_venda_name || 'AA' }}
            />

            {changeEditar
                ? <EditarDadosResponsaveis
                    processData={processData}
                    setChangeEditar={setChangeEditar}
                    retunProcess={retunProcess}
                />

                : <>
                    <div className="cards info">
                        <h4 className="h4 title">As informações da venda estão corretas?</h4>
                        <p className="p2 subtitle">Antes de seguir, revise as informações da venda para garantir o recebimento correto da sua comissão.</p>
                    </div>

                    <div className="cards comissao">
                        <div className="header-card chip-card">
                            <div className="title-icon">
                                <CurrencyDollarIcon className="icon" />
                                <p className="p1 title">Valor da comissão</p>
                            </div>
                            {processData?.dados_comissao_geral.tipo === 'PARCELADO' &&
                                <Chip className="chip orange" label={`Parcela Nº ${processData?.dados_parcela.numero_parcela}`} />
                            }
                        </div>
                        <Divider />

                        <div className="content">
                            <div className="row">
                                <div className="campo">
                                    <p className="p2 subtitle">Valor</p>
                                    <p className="p2 value">{processData?.dados_parcela.valor_parcela || 'R$ 0,00'}</p>
                                </div>

                                <div className="campo">
                                    <p className="p2 subtitle">Período de Pagamento</p>
                                    <p className="p2 value">{processData?.dados_parcela.periodo_pagamento || '---'}</p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="campo">
                                    <p className="p2 subtitle">Comissão total</p>
                                    <p className="p2 value">{processData?.dados_comissao_geral.valor_comissao_total || 'R$ 0,00'}</p>
                                </div>

                                <div className="campo">
                                    <p className="p2 subtitle">Comissão líquida</p>
                                    <p className="p2 value">{processData?.dados_comissao_geral.valor_comissao_liquida || '---'}</p>
                                </div>

                                <div className="campo">
                                    <p className="p2 subtitle">Forma de pagamento</p>
                                    <p className="p2 value">{processData?.dados_comissao_geral.forma_pagamento || '---'}</p>
                                </div>

                                <div className="campo">
                                    <p className="p2 subtitle">Tipo</p>
                                    <div className="chips-container">
                                        <Chip className="chip green" label={processData?.dados_comissao_geral.tipo} />
                                        {Number(processData?.dados_comissao_geral.quantidade_parcelas) > 1 && <Chip className="chip green" label={processData?.dados_comissao_geral.quantidade_parcelas + 'x'} />}
                                    </div>
                                </div>
                            </div>

                        </div>
                        <footer className="content-footer">
                            {!processData?.dados_parcela.planilha_id &&
                                <Alert className='alert yellow' icon={<ExclamationTriangleIcon />} >
                                    Aguardando revisão do apoio
                                </Alert>
                            }
                            <ButtonComponent
                                label="Ver planilha de comissão"
                                name="minimal"
                                size="medium"
                                variant="text"
                                id='btn-planilha'
                                disabled={!processData?.dados_parcela.planilha_id}
                                onClick={() => baixarPlanilhaApoio(processData?.dados_parcela.planilha_id || '', formatarEndereco(processData?.dados_processo))}
                            />

                        </footer>
                    </div>

                    <div className="cards responsaveis">
                        <div className="header-card">
                            <GroupUsers className="icon" />
                            <p className="p1 title">Responsáveis pelo pagamento</p>
                        </div>
                        <Divider />

                        <div className="content">
                            {['Vendedor', 'Comprador'].filter((p) => processData?.dados_parcela.responsaveis_pagamento.find(responsavel => responsavel.papel === p)).map((perfil, index) => (
                                <div className='card-responsavel' key={perfil + index}>
                                    <p className='p2 perfil-nome border'>{perfil}</p>
                                    <p className='s2 border'>Valor de pagamento</p>

                                    {processData?.dados_parcela.responsaveis_pagamento.filter(responsavel => responsavel.papel === perfil).map((responsavel, index) => (
                                        <>
                                            <span className='p2'>{responsavel.usuario_nome}</span>
                                            <span className='p2'>{responsavel.valor_pagamento}</span>
                                        </>
                                    ))}

                                </div>
                            ))}
                            {processData?.dados_parcela.responsaveis_pagamento.length === 0 &&
                                <Alert className='alert yellow' icon={<ExclamationTriangleIcon />} >
                                    Nenhum responsável definido
                                </Alert>
                            }

                        </div>
                        <div className="content-footer">
                            <ButtonComponent
                                label="Editar dados"
                                size="medium"
                                variant="text"
                                startIcon={<PencilIcon width={20} />}
                                name='editar'
                                onClick={() => setChangeEditar(true)}
                            />
                        </div>
                    </div>

                    <footer className="footer">
                        <CheckBox
                            label="Eu concordo com o valor"
                            checked={checked}
                            className="checkbox"
                            value="confirmado"
                            onChange={(e) => setChecked(e.target.checked)}
                            disabled={loading || processData?.dados_parcela.responsaveis_pagamento.length === 0} // !processData?.parcela.planilha_id
                        />

                        <ButtonComponent
                            label="Confirmar"
                            labelColor="white"
                            size="medium"
                            variant="contained"
                            name='prosseguir'
                            disabled={!checked || loading} // !processData?.parcela.planilha_id ||
                            onClick={() => onClickConfirm()}
                            endIcon={<ArrowRightIcon />}
                        />

                    </footer>
                </>
            }



            <ModalConfirmacao open={dialogConfirm} setOpen={setDialogConfirm} dadosProcesso={processData?.dados_processo} />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso, idParcela, idPendencia } = context?.params as { idProcesso: string, idParcela: string, idPendencia: string };
    return { props: { idProcesso, idParcela, idPendencia } };
};

export default Pendencias;