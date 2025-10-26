import React, { useEffect, useState } from 'react'
import ButtonComponent from '../ButtonComponent'
import SkeletonTopicos from '@/components/Skeleton/PosVenda/Analise/topicos';
import { ApiTopicosAnaliseType, SelectsType } from '@/interfaces/PosVenda/Analise';
import { useRouter } from 'next/router';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import { Chip, Skeleton } from '@mui/material';
import { GetServerSideProps } from 'next';
import PedidosNucleo from '@/interfaces/Nucleo/pedidos';

interface IAnaliseRecibo {
    processData?: ProcessType
    origem?: string
    idProcesso: string
    idPedido?: string | number
    servicoDetalhado?: PedidosNucleo
    setServicoDetalhado: (e: PedidosNucleo) => void
    setOpenServico: (e: boolean) => void
}

export default function AnaliseServicos({ processData, origem, idProcesso, idPedido, servicoDetalhado, setServicoDetalhado, setOpenServico }: IAnaliseRecibo) {
    const [loadingServico, setLoadingServico] = useState(true);
    const [servicosSolicitados, setServicosSolicitados] = useState<PedidosNucleo>()
    const router = useRouter();
    const dataSolicitacao = servicosSolicitados?.data_criacao;
    // console.log('servicosSolicitados: ', servicosSolicitados)

    const openDetalhes = () => {
        router.push(`/nucleo/${idProcesso}/detalhes-venda`)
    }

    const getSolcitacoesNucleo = async () => {
        const servicosNucleo: any = processData?.solicitacao_nucleo?.find((data: any) => data?.id === Number(idPedido));
        setServicosSolicitados(servicosNucleo);
    }
    useEffect(() => {
        setLoadingServico(true);
        if (processData) {
            getSolcitacoesNucleo();
            setLoadingServico(false);
        }
        else setLoadingServico(true);
    }, [processData]);

    const onEditTopic = async (servico: any) => {
        setServicoDetalhado(servico);
        setOpenServico(true);
    };

    return (
        <>
            <section className='cards topicos servicos'>
                <div className='title'>
                    <div className="row">
                        <div className="content">
                            {/* <ListBulletIcon /> */}
                            <h2>Serviços</h2>
                            {
                                loadingServico
                                ? <Skeleton animation="wave" height={20} width={100} />
                                :
                                <Chip 
                                    className={`chip ${servicosSolicitados?.contador_concluido !== 0 ? 'green' : 'primary'}`} 
                                    label={'Concluídos ' + servicosSolicitados?.contador_concluido} 
                                />
                            }
                        </div>
                        
                        <div className="content">
                            <span>Solicitação</span>
                            <Chip className='chip default' label={dataSolicitacao} />
                        </div>
                    </div>
                </div>
                <div className='list-items' style={{paddingBottom: '0px'}}>
                    {loadingServico
                        ? <SkeletonTopicos />
                        :
                        servicosSolicitados?.grupo_id
                            ? servicosSolicitados?.servicos_pedido?.data?.map((data: any, index: number) => (
                                <>
                                    <div className='item' key={data?.id}>
                                        <div className='icon-label'>                                               
                                            <Chip className={`chip ${data?.status_solicitação?.data?.[0]?.id === 4 ? 'green' : 'neutral'}`} label={data?.servico_detalhado?.tipo_servico?.nome} />
                                            <Chip className={`chip ${data?.status_solicitação?.data?.[0]?.id === 4 ? 'green' : 'primary'}`} label={data?.servico_detalhado?.nome} />
                                        </div>

                                        {
                                            data?.status_solicitação?.data?.[0]?.id !== 4 &&
                                            <div className='icon-label actions'>
                                                <ButtonComponent size={'small'} variant={'outlined'} startIcon={''} label={'Fazer serviço'} onClick={() => onEditTopic(data)} />
                                            </div>
                                        }
                                    </div>
                                </>
                            ))
                            : <>
                                <div className='item' key={servicosSolicitados?.id}>
                                    <div className='icon-label'>                                                
                                        <Chip className={`chip ${servicosSolicitados?.status_solicitação?.data?.[0]?.id === 4 ? 'green' : 'neutral'}`} label={servicosSolicitados?.servico_detalhado?.tipo_servico?.nome} />
                                        <Chip className={`chip ${servicosSolicitados?.status_solicitação?.data?.[0]?.id === 4 ? 'green' : 'primary'}`} label={servicosSolicitados?.servico_detalhado?.nome} />
                                    </div>

                                    <div className='icon-label actions'>
                                        <ButtonComponent size={'small'} variant={'outlined'} startIcon={''} label={'Fazer serviço'} onClick={() => onEditTopic(servicosSolicitados?.servico_detalhado)} />
                                    </div>
                                </div>
                            </>
                    }
                </div>
                <div className='btn-action'>
                    <ButtonComponent 
                        size={'large'} 
                        variant={'text'} 
                        label={'Ver detalhes do serviço'} 
                        // startIcon={<PencilIcon />} 
                        onClick={openDetalhes} 
                    />
                </div>
            </section>
        </>
    )
}

// EXECUTA ANTES DO DASHBOARD
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idPedido } = context.params as { idPedido: string };
    return { props: { idPedido } };
};

// export default AnaliseServicosNucleo;