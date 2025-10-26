import Header from "./@Header";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { ComissaoDataType, ComissaoIndividuoType, DadosProcessoType, ParcelaComissoesType } from "@/interfaces/Apoio/planilhas_comissao";
import getParcelaComissao from "@/apis/getParcelaComissao";
import getDataPlanilhaComissao from "@/apis/getDataPlanilhaComissao";
import { useRouter } from "next/router";
import ButtonComponent from "@/components/ButtonComponent";
import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import TablePlanilha from "./@Table";
import GetListChavesPix from "@/apis/GetListChavesPix";
import LogoDNA from "@/images/logotipo_color.png";
import { TypeGetListChavesPix } from "@/apis/Interfaces/typeGetListChavesPix";
import Image from "next/image";
import FooterCardsPercent from "../@FooterCardsPercent";
import { Check } from "@mui/icons-material";
import baixarPlanilhaApoio from "@/apis/baixarPlanilhaApoio";
import enviarPlanilhaApoio from "@/apis/enviarPlanilhaApoio";
import ConfirmModal from "./@DialogConfirmEnvio";

interface PropsType {
    idProcesso: string;
    idParcela: string;
};

interface ProcessDataType {
    comissao: ComissaoDataType
    imovel: DadosProcessoType
}

interface Row extends ComissaoIndividuoType {
    papel: string
    nome_planilha: string
    cpf_cnpj: string
    class: string
}

const formatarData = (): string => {
    const data = new Date();
    return format(data, "eeee, d 'de' MMMM 'de' yyyy", { locale: ptBR });
};

const formatarEndereco = (imovel: DadosProcessoType | undefined): string => {
    if (imovel === undefined) return '';
    const { logradouro, numero, unidade, complemento, bairro, cidade, uf } = imovel;
    return `${logradouro}, ${numero},${unidade ? ' ' + unidade + ',' : ''}${complemento ? ' ' + complemento + ',' : ''} ${bairro}, ${cidade} - ${uf}`;
};

const addParams = (data: ComissaoIndividuoType[] | ComissaoIndividuoType, key: string): Row[] => {
    if (!Array.isArray(data)) {
        return [{
            ...data,
            papel: `1º ${key}`,
            nome_planilha: data.nome_empresarial || '',
            cpf_cnpj: data.cnpj || '',
            class: key.toLowerCase()
        }];
    } else
        return data.map((item, index) => {
            return {
                ...item,
                papel: `${index + 1}º ${key}`,
                nome_planilha: item.tipo_pessoa === 'PF' ? item.name : item.nome_empresarial || '',
                cpf_cnpj: item.tipo_pessoa === 'PF' ? item.cpf : item.cnpj || '',
                class: key.toLowerCase(),

            }
        });
}

export default function VisualizarPlanilha(props: PropsType) {
    const router = useRouter();
    const { idProcesso, idParcela } = props;
    const [parcelaData, setParcelaData] = useState<ParcelaComissoesType | undefined>(undefined);
    const [listChavesPix, setListChavesPix] = useState<TypeGetListChavesPix>();
    const [dadosEmpresa, setDadosEmpresa] = useState<ComissaoIndividuoType>();
    const [processData, setProcessData] = useState<ProcessDataType | undefined>(undefined);
    const [rows, setRows] = useState<Row[]>([]);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);
    console.log(rows);


    useEffect(() => {
        getData();
    }, []);

    const onConfirm = async () => {
        setLoadingConfirm(true);
        await enviarPlanilhaApoio(idParcela);
        await getData();
        setLoadingConfirm(false);
        setConfirmModalOpen(false);
        // REDIRECIMENTO RETIRADO A PEDIDO DA FUNCIONARIA DE APOIO 30/01/2025
        // router.push(`/apoio/${idProcesso}/planilha-comissao/`);
    };

    const getData = async () => {
        const data = await getDataPlanilhaComissao(idProcesso);
        setProcessData(data);
        console.log(data);

        const arrSort = [];
        const dataParcela = await getParcelaComissao(idParcela);
        setParcelaData(dataParcela);
        console.log(dataParcela);
        if (dataParcela) {
            arrSort.push(addParams(dataParcela.corretores_vendedores, 'Vendedor'));
            arrSort.push(addParams(dataParcela.corretores_opcionistas, 'Opcionista'));
            arrSort.push(addParams(dataParcela.gerentes, 'Gerente'));
            arrSort.push(addParams(dataParcela.gerentes_gerais, 'Gerente Geral'));
            arrSort.push(addParams(dataParcela.diretores_gerais, 'Diretor Geral'));
            arrSort.push(addParams(dataParcela.repasse_franquias, 'Repasse franquia'));
            arrSort.push(addParams(dataParcela.royalties, 'Royalties'));
            arrSort.push(addParams(dataParcela.comunicacao, 'Comunicação'));
            arrSort.push(addParams(dataParcela.empresas, 'Empresa'));
            console.log(addParams(dataParcela.empresas, 'Empresa'));
            
            setRows(arrSort.flat());
        }


        if (dataParcela?.empresas[0]) {
            // PEGANDO DADOS DA DNA Imóveis LTDA
            setDadosEmpresa(dataParcela?.empresas.find((empresa) => empresa.cnpj === '48.271.471/0001-60'));
        };

        const chavesPix = await GetListChavesPix();
        setListChavesPix(chavesPix);
    };

    const onVoltar = () => {
        router.back();
    };


    return (
        <div className="visualizar-planilha">
            <Header imovel={processData?.imovel} title="Planilha de Comissão" onVoltar={onVoltar} />
            <div className="container-planilha">
                <div className="box">
                    <div className="info-planilha">
                        <div className="img-container">
                            <p className="date-now">{formatarData()} </p>
                            <Image src={LogoDNA} alt="Logo DNA Imóveis" height={100} />
                        </div>
                        <div className="info-processo">
                            <div className="container-info">
                                <span>Loja:</span>
                                <p>{processData?.imovel.loja_name}</p>
                            </div>

                            <div className="container-info">
                                <span>Data da Venda:</span>
                                <p>{processData?.imovel.data_assinatura}</p>
                            </div>

                            <div className="container-info">
                                <span>Referência:</span>
                                <p>{processData?.imovel.codigo}</p>
                            </div>

                            <div className="container-info">
                                <span>Imóvel:</span>
                                <p>{formatarEndereco(processData?.imovel)}</p>
                            </div>

                        </div>
                        <>
                            {/* 
                        <div className="info-bancaria">
                            <div className="container-info">
                                <span>Conta corrente:</span>
                                <p>{dadosEmpresa?.numero_conta}</p>
                            </div>

                            <div className="container-info">
                                <span>Banco:</span>
                                <p>{dadosEmpresa?.nome_banco}</p>
                            </div>

                            <div className="container-info">
                                <span>Chave Pix:</span>
                                <p>{dadosEmpresa?.pix}</p>
                            </div>

                            <div className="container-info">
                                <span>Creci:</span>
                                <p>{dadosEmpresa?.creci}</p>
                            </div>

                            <div className="container-info">
                                <span>Nome Fantasia:</span>
                                <p>{dadosEmpresa?.nome_empresarial}</p>
                            </div>
                        </div> */}
                        </>
                    </div>
                    <TablePlanilha rows={rows} dataParcela={parcelaData} listChavesPix={listChavesPix} />
                </div>

            </div>

            <footer className="footer-form">
                <div className="btn-download-container">
                    <ButtonComponent
                        label="Baixar .PDF"
                        name="download"
                        size="medium"
                        variant="text"
                        startIcon={<DocumentArrowDownIcon className="icon primary" />}
                        disabled={!parcelaData?.planilha_id}
                        onClick={() => baixarPlanilhaApoio(parcelaData?.planilha_id || '', formatarEndereco(processData?.imovel))}
                    />
                    <p className="sub-title-download">{parcelaData?.planilha_id ? parcelaData.ultima_data_envio : '(Planilha não enviada)'}</p>
                </div>
                <FooterCardsPercent dataParcela={parcelaData} />

                <ButtonComponent
                    label="Enviar Planilha de comissao"
                    variant="contained"
                    size={"large"}
                    labelColor="white"
                    endIcon={<Check className="icon white" />}
                    onClick={() => setConfirmModalOpen(true)}
                />
            </footer>

            <ConfirmModal 
                confirmModalOpen={confirmModalOpen} 
                setConfirmModalOpen={setConfirmModalOpen}
                onConfirm={onConfirm}
                loadingConfirm={loadingConfirm}
                processData={processData?.imovel}
            />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso, idParcela } = context.params as unknown as PropsType;
    return { props: { idProcesso, idParcela } };
};
