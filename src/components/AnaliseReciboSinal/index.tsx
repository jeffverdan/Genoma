import React, { useEffect, useState } from 'react'
import ButtonComponent from '../ButtonComponent'
import { CheckCircleIcon, ListBulletIcon, PencilIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import SkeletonTopicos from '@/components/Skeleton/PosVenda/Analise/topicos';
import { ApiTopicosAnaliseType, SelectsType } from '@/interfaces/PosVenda/Analise';
import { useRouter } from 'next/router';
import postDeletarCardAnalise from '@/apis/postDeletarCardAnalise.';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import getSaveTopicos from '@/apis/getSaveTopicos';
import GetListTopicos from '@/apis/getListTopicosAnalise';
import { Chip } from '@mui/material';

interface IAnaliseRecibo {
    processData?: ProcessType
    origem?: string
    idProcesso: string
    addNewTopic?: () => void
    onEditTopicLocal?: (e: SelectsType) => void
    refreshPorntosAtencao?: () => void
}

export default function AnaliseReciboSinal({ processData, origem, idProcesso, onEditTopicLocal, addNewTopic, refreshPorntosAtencao }: IAnaliseRecibo) {
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [arrTopics, setArrTopics] = useState<SelectsType[]>()
    const [lists, setLists] = useState<ApiTopicosAnaliseType>();
    const [optionQuant, setOptionQuant] = useState([
        { id: '', name: 'Selecione...' },
        { id: 1, name: 1 },
    ]);
    const router = useRouter();

    const onEditTopic = async (topic: SelectsType) => {
        if (onEditTopicLocal) onEditTopicLocal(topic)
        else {
            console.log(topic);
            sessionStorage.setItem('editar_analise', JSON.stringify(topic));
            router.push(`/posvenda/${idProcesso}/analise`)
        }
    };

    const openAnalise = () => {
        router.push(`/posvenda/${idProcesso}/analise`)
    };

    const handleDelete = async (topic: SelectsType) => {
        console.log(topic)
        const cardId: any = topic?.card_id;
        const res = await postDeletarCardAnalise(cardId);
        refreshPorntosAtencao && refreshPorntosAtencao();
        getTopicosData();
    };

    const getTopicosData = async () => {
        // setLoading(true);
        setLoadingTopics(true);

        if (processData) {
            const quantVendedores = processData.vendedores.length;
            for (let i = 2; i <= quantVendedores; i++) {
                optionQuant.push({ id: i, name: i })
            }

            const topics = await getSaveTopicos(idProcesso) as unknown as SelectsType[];
            setArrTopics([...topics]);

            const resLists = await GetListTopicos(idProcesso) as unknown as ApiTopicosAnaliseType;
            console.log(resLists);

            setLists(resLists);

        }
        setLoadingTopics(false);
    };

    useEffect(() => {
        if (processData) getTopicosData();
        else setLoadingTopics(true);
    }, [processData]);

    return (
        <>
            <section className='cards topicos'>
                <div className='topicos-content'>
                    <div className='title'>
                        <ListBulletIcon />
                        <h2>Análise do Recibo de Sinal</h2>
                    </div>
                    <div className='list-items'>
                        {loadingTopics
                            ? <SkeletonTopicos />
                            : arrTopics?.map((topic) => (
                                <div className='item' key={topic.card_id}>
                                    <div className='icon-label'>
                                        <CheckCircleIcon />
                                        <p>{lists?.lista_topicos.find((tipo) => tipo.id === topic.topico_id)?.name}</p>
                                        {(!!topic.data?.[0]?.name && topic.topico_id !== 3) && <Chip className='chip' label={topic.data?.[0].name} />}
                                        {topic.data?.[1]?.name && <Chip className='chip' label={`...mais ${topic.data.length - 1}`} />}

                                    </div>

                                    <div className='icon-label actions'>
                                        <ButtonComponent size={'small'} variant={'text'} startIcon={<PencilIcon />} label={''} onClick={() => onEditTopic(topic)} />
                                        <ButtonComponent size={'small'} variant={'text'} startIcon={<XMarkIcon />} name='red' label={''} onClick={() => handleDelete(topic)} />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='btn-action'>
                    {
                        origem === 'status'
                            ? <ButtonComponent size={'large'} variant={'text'} label={'Editar análise completa'} startIcon={<PencilIcon />} onClick={openAnalise} />
                            : <ButtonComponent size={'large'} variant={'text'} label={'Adicionar tópico'} startIcon={<PlusIcon />} onClick={addNewTopic} />
                    }
                </div>
            </section>
        </>
    )
}
