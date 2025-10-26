import ButtonComponent from '@/components/ButtonComponent'
import Chip from '@mui/material/Chip'
import React, { useEffect, useState } from 'react'
import SkeletonPontosAtencao from '@/components/Skeleton/PosVenda/Analise/pontosAtencao';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import { useRouter } from 'next/router';
import { ApiTopicosAnaliseType, SelectsType } from '@/interfaces/PosVenda/Analise';
// import getSaveTopicos from '@/apis/getSaveTopicos';
// import GetListTopicos from '@/apis/getListTopicosAnalise';
interface IPontos {
    loadingPontosAtencao: boolean
    processData?: ProcessType
    origem?: string
    idProcesso: string
    onEditTopicLocal?: (e: SelectsType) => void
    returnPontosAtencao: () => void
    arrTopics?: SelectsType[]
}

export default function PonstosAtencao({processData, origem, idProcesso, onEditTopicLocal, returnPontosAtencao, arrTopics, loadingPontosAtencao} : IPontos) {

    // const [loadingPontosAtencao, setLoadingPontosAtencao] = useState(false);
    // const [arrTopics, setArrTopics] = useState<SelectsType[]>()
    // const [lists, setLists] = useState<ApiTopicosAnaliseType>();
    // const [optionQuant, setOptionQuant] = useState([
    //     { id: '', name: 'Selecione...' },
    //     { id: 1, name: 1 },
    // ]);
    const router = useRouter();
    const [selects, setSelects] = useState<SelectsType>({
        processo_id: idProcesso,
        card_id: ''
    });

    const arrPontosLaudemio = [
        { id: 1, titulo: 'Dar entrada - no laudêmio pelo site da prefeitura;'},
        { id: 2, titulo: 'Acompanhar - foro (se em aberto);'},
        { id: 3, titulo: 'Emissão - Boleto do foro;'},
        { id: 4, titulo: 'Emissão - Boleto do laudêmio;'},
        { id: 5, titulo: ' Recolher o alvará;'},
    ]

    // const [newTopic, setNewTopic] = useState(false);
    // const [topicData, setTopicData] = useState([]);

    const onEditTopic = async (topic: SelectsType) => {
        if (onEditTopicLocal) onEditTopicLocal(topic)
        else {
            sessionStorage.setItem('editar_analise', JSON.stringify(topic));
            router.push(`/posvenda/${idProcesso}/analise`)
        }
    };

    return (
        <div className="pontos-atencao">
            <div className='analise-container'>
                <div className='cards-doc-topicos'>
                    <section className='cards topicos'>
                        <div className='title'>
                            <h2>Pontos de atenção</h2>
                        </div>

                        
                        <div className="list-items">
                            {
                                loadingPontosAtencao
                                ? <SkeletonPontosAtencao />
                                :
                                <>
                                    {
                                        arrTopics?.map((topic) => (
                                            <>
                                            {topic?.data?.filter((valor) => valor.tag).map((valor) =>
                                                <>
                                                    <div className='item'>
                                                        <div className="content">
                                                        <Chip label={valor.tag} className="chip tag" />
                                                            <p>{valor.ponto_atencao}</p>
                                                        </div>
                                                        <div className="btn-detalhes">
                                                            <ButtonComponent
                                                                label="Ver detalhes"
                                                                size="small"
                                                                variant="text"
                                                                labelColor='#464F53'
                                                                onClick={() => onEditTopic(topic)}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {
                                                topic?.data?.filter((valor) => valor.topico === 'Imóvel com laudêmio').map((valor) =>
                                                    arrPontosLaudemio.map((laudemio: any) =>
                                                        <>
                                                            <div className='item'>
                                                                <div className="content">
                                                                <Chip label={'Imóvel com laudêmio'} className="chip tag" />
                                                                    <p>{laudemio.titulo}</p>
                                                                </div>
                                                                <div className="btn-detalhes">
                                                                    <ButtonComponent
                                                                        label="Ver detalhes"
                                                                        size="small"
                                                                        variant="text"
                                                                        labelColor='#464F53'
                                                                        onClick={() => onEditTopic(topic)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                )
                                            }
                                            </>
                                        ))
                                    }                                    
                                </>
                            }
                        </div>

                        {/* {
                                                        valor.topico === 'Imóvel com laudêmio'
                                                        ?    
                                                            arrPontosLaudemio.map((laudemio: any) =>
                                                                <>
                                                                    <div className='item'>
                                                                        <div className="content">
                                                                        <Chip label={'Laudemio'} className="chip tag" />
                                                                            <p>{laudemio.titulo}</p>
                                                                        </div>
                                                                        <div className="btn-detalhes">
                                                                            <ButtonComponent
                                                                                label="Ver detalhes"
                                                                                size="small"
                                                                                variant="text"
                                                                                labelColor='#464F53'
                                                                                onClick={() => onEditTopic(topic)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )
                                                        :
                                                        ''
                                                    } */}
                        
                        <div className='btn-action'>
                            {/* <ButtonComponent size={'large'} variant={'text'} label={'Adicionar tópico'} startIcon={<PlusIcon />} onClick={addNewTopic} /> */}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
