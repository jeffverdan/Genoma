import React, { useContext, useEffect, useState } from 'react'
import { GetServerSideProps } from 'next';
import HeadSeo from '@/components/HeadSeo';
import { CheckBadgeIcon, CheckIcon, DocumentTextIcon, HomeModernIcon } from "@heroicons/react/24/solid";
import getProcesso from '@/apis/getProcesso';
import { useRouter } from 'next/router';
import redirect403 from '@/functions/redirect403';
import Header from '@/components/GG_Gerentes/Header';
import BasicCard from '@/components/Card';
import { FaExclamationTriangle } from 'react-icons/fa';
import SellerIco from '@/images/Seller_ico';
import ImgDevolverVenda from '@/images/devolver_venda.svg';
import BuyerIco from '@/images/Buyer_ico';
import CardInfo from './@cardInfo';
import ReviewImovel from './@ReviewImovel';
import ReviewPF_PJ from './@ReviewPF_PJ';
import ReviewRecibo from './@ReviewRecibo';
import ImovelData from '@/interfaces/Imovel/imovelData';
import { HiArrowPath, HiCheck } from 'react-icons/hi2';
import ButtonComponent from '@/components/ButtonComponent';
import EntregarVenda from '@/apis/postEntregarVenda';
import SimpleDialog from '@/components/Dialog';
import Image from 'next/image';
import { CircularProgress } from '@mui/material';

// Componente Dashboard
const RevisaoVenda = ({ idProcesso }: { idProcesso: any }) => {
    const [loading, setLoading] = useState(false);
    const [imovelData, setImovelData] = useState<ImovelData>({});
    const [modalConfirm, setModalConfirm] = useState(false);
    const router = useRouter();
    const [suspense, setSuspense] = useState<boolean>(true);

    const getImovelData = async () => {
        setLoading(true);
        //SE NÃO CONSEGUI PUXA DA API 'retorna_processo' USANDO ID PASSADO NO LINK

        const data = await getProcesso(idProcesso, router) as any;
        console.log(data);

        // Processo enviado para o Pós nos sequintes status, vai exibir tela de 403
        // 1,2,3,4,5,6,7,21,26
        const statusProcesso = data?.status[0]?.id;
        redirect403(statusProcesso, router, setSuspense)

        if (data) {
            setImovelData(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        getImovelData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const arrCards = [
        {
            label: 'Imóvel',
            icon: HomeModernIcon,
            hidden: imovelData?.devolucoes?.valores_documentos_imovel !== 1,
            url: 'imovel',
            check: imovelData.devolucoes?.imovel?.reviewChecks?.every(e => e.saved)
        },
        {
            label: 'Vendedores',
            icon: SellerIco,
            url: 'vendedor',
            hidden: 
                // imovelData?.devolucoes?.cadastro_incompleto_vendedor !== 1 && 
                imovelData?.devolucoes?.vendedores !== 1 && 
                imovelData?.devolucoes?.vendedores_juridicos !== 1,
            check: 
                imovelData?.devolucoes?.cadastro_incompleto_vendedor !== 1 && 
                imovelData?.devolucoes?.vendedor_pf?.reviews?.every(vendedor => vendedor.reviewChecks.every(e => e.saved)) && 
                imovelData?.devolucoes?.vendedor_pj?.reviews?.every(vendedor => vendedor.reviewChecks.every(e => e.saved))
        },
        {
            label: 'Compradores',
            icon: BuyerIco,
            url: 'comprador',
            hidden: 
                // imovelData?.devolucoes?.cadastro_incompleto_comprador !== 1 && 
                imovelData?.devolucoes?.compradores !== 1 && 
                imovelData?.devolucoes?.compradores_juridicos !== 1,
            check: 
                imovelData?.devolucoes?.cadastro_incompleto_comprador !== 1 && 
                imovelData?.devolucoes?.comprador_pf?.reviews?.every(comprador => comprador.reviewChecks.every(e => e.saved)) && 
                imovelData?.devolucoes?.comprador_pj?.reviews?.every(comprador => comprador.reviewChecks.every(e => e.saved))
        },
        {
            label: 'Recibo',
            icon: DocumentTextIcon,
            hidden: imovelData?.devolucoes?.recibo_sinal !== 1,
            url: 'recibo',
            check: imovelData.devolucoes?.recibo?.reviewChecks?.every(e => e.saved)
        },
    ];

    const reenviarPos = async () => {
        setLoading(true);
        const data = {
            imovel_id: imovelData.imovel_id || '',
            processo_id: imovelData.id || '',
            informacao_imovel_id: imovelData.informacao?.id,
            prazo_type: imovelData.imovel?.informacao?.tipo_dias,
            reciboType: 'manual' as 'manual',
            data_assinatura: imovelData.informacao?.data_assinatura,
            prazo_escritura: imovelData.informacao?.prazo_escritura,
            posvenda_franquia: '0',
            valor_comissao_liquida: imovelData.comissao?.valor_comissao_liquida,
            deducao: imovelData.comissao?.deducao,
            valor_comissao_total: imovelData.comissao?.valor_comissao_total || '',
            data_previsao_escritura: '',
            observacao: '',
            // testemunhas: [
            //     {
            //         id: imovelData.testemunhas?.data?.[0]?.id || '',
            //         name: imovelData.testemunhas?.data?.[0]?.nome || '',
            //         email: imovelData.testemunhas?.data?.[0]?.email || '',
            //         tipo_pessoa: 3,
            //     },
            //     {
            //         id: imovelData.testemunhas?.data?.[1]?.id || '',
            //         name: imovelData.testemunhas?.data?.[1]?.nome || '',
            //         email: imovelData.testemunhas?.data?.[1]?.email || '',
            //         tipo_pessoa: 3,
            //     },
            // ]
        };        
        const res = await EntregarVenda(data);
        setLoading(false);
        if(res) {
            const storage = globalThis?.sessionStorage;
            storage.setItem("confirmRenvioVenda", idProcesso);
            router.push('/vendas');
        }
        console.log("Result API entregarVenda: ", res);
    };

    return (
        suspense === false &&
        <>
            <HeadSeo titlePage='Revisar Venda' description="" />
            <Header
                imovel={imovelData as ImovelData}
                urlVoltar={'/vendas'}
                title='realize as correções solicitadas abaixo:'
            />

            <div className="revisar-venda-container">
                <div className='cards-container'>
                    {arrCards.map((card) => (
                        <BasicCard
                            key={card.label}
                            options={{
                                id: undefined,
                                label: card.label,
                                icon: card.check ? CheckIcon : card.icon,
                                fillIcon: card.check ? '#01988C' : '#E33838',
                                badgeLabel: card.check ? 'FEITO' : 'PENDENTE',
                                url: card.url,
                                IconRight: card.check ? '' : FaExclamationTriangle,
                                hidden: card.hidden
                            }} />
                    ))}
                </div>

                <CardInfo />

                {!arrCards[0].hidden &&
                    <ReviewImovel
                        review={imovelData?.devolucoes?.imovel}
                    />
                }

                {!arrCards[1].hidden &&
                    <ReviewPF_PJ
                        type='vendedor'
                        reviewPF={imovelData?.devolucoes?.vendedor_pf}
                        reviewPJ={imovelData?.devolucoes?.vendedor_pj}
                        incompleto={imovelData?.devolucoes?.cadastro_incompleto_vendedor === 1}
                        incompletoObs={imovelData?.devolucoes?.cadastro_incompleto_observacao}
                    />
                }

                {!arrCards[2].hidden &&
                    <ReviewPF_PJ
                        type='comprador'
                        reviewPF={imovelData?.devolucoes?.comprador_pf}
                        reviewPJ={imovelData?.devolucoes?.comprador_pj}
                        incompleto={imovelData?.devolucoes?.cadastro_incompleto_comprador === 1}
                        incompletoObs={imovelData?.devolucoes?.cadastro_incompleto_observacao}
                    />
                }

                {!arrCards[3].hidden &&
                    <ReviewRecibo
                        review={imovelData?.devolucoes?.recibo}
                    />
                }
            </div>
            <SimpleDialog
                open={modalConfirm}
                onClose={() => setModalConfirm(false)}
                className='dialog-review-imovel'
            >
                <div className='modal-confirm-review'>
                    <Image src={ImgDevolverVenda} alt='Devolução da venda' />
                    <div className='text-button'>
                        <div className='text-container'>
                            <p className='title'>
                                Tem certeza que tudo foi revisado?
                            </p>
                            <p className='subtitle'>
                                Se algum item da revisão ficou pendente, o a equipe de pós-venda poderá devolver a venda novamente, atrasando ainda mais o processo para seus clientes.
                            </p>
                            <p className='subtitle bold'>
                                Atenção: os prazos de vendas devolvidas só voltam ao seu status prévio após nova Análise.
                            </p>

                        </div>
                        <ButtonComponent 
                            size={'large'} 
                            variant={'contained'} 
                            label={'Tudo foi revisado'}
                            endIcon={loading ? <CircularProgress /> : <HiCheck fill='white' />}
                            onClick={reenviarPos}
                            labelColor='white'
                            disabled={loading}
                        />
                    </div>
                </div>

            </SimpleDialog>
            <footer className='footer review'>
                <ButtonComponent
                    size='large'
                    variant='contained'
                    disabled={!arrCards.every(e => e.check)}
                    label='Enviar venda revisada '
                    endIcon={<HiCheck fill='white' />}
                    labelColor='white'
                    onClick={() => setModalConfirm(true)}
                />
            </footer>
        </>
    );
};

// EXECUTA ANTES DO DASHBOARD
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso } = context.params as { idProcesso: string };
    return { props: { idProcesso } };
};

export default RevisaoVenda;