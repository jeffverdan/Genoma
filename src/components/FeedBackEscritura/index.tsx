import React, {useState, useEffect} from 'react';
import Dialog from '@mui/material/Dialog';
import ButtonComponent from '../ButtonComponent';
import { HiCheck, HiLockClosed } from 'react-icons/hi2';
import FeedBackSkeleton from './FeedBackSkeleton';
import getGerentePerguntasEscritura from '@/apis/getGerentePerguntasEscritura';
import ListaEscrituras from './ListaEscrituras';
import PerguntasEscritura from './PerguntasEscritura';
import { useForm } from 'react-hook-form';

interface IFeedBack {
    returnFeedBackGerente: () => void
    openFeedBack: boolean
    setOpenFeedBack: (e: boolean) => void
    escriturasFeedBack: IFeedBackEscrituras[]
    loading: boolean
    setLoading: (e: boolean) => void
    processoSelecionado?: IFeedBackEscrituras
    setProcessoSelecionado:(e: IFeedBackEscrituras) => void
    showListaEscritura: boolean
    setShowListaEscritura: (e: boolean) => void
    setOpenDialogFeedBackEscritura: (e: boolean) => void
    setEscriturasFeedBack: (e: IFeedBackEscrituras[]) => void
    perguntasEscritura: []
}
interface IFeedBackEscrituras{
    name?: string,
    ddi?: string,
    telefone?: string,
    data_escritura?: string,
    hora_escritura?: string,
    logradouro?: string,
    unidade?: string,
    processo_id?: number,
    pg_na_escritura?: number
}

export default function FeedBackEscritura({openFeedBack, setOpenFeedBack, escriturasFeedBack, loading, setLoading, processoSelecionado, setProcessoSelecionado, showListaEscritura, setShowListaEscritura, returnFeedBackGerente, setOpenDialogFeedBackEscritura, setEscriturasFeedBack, perguntasEscritura} : IFeedBack) {

    // console.log(escriturasFeedBack[0])
    // // const [perguntasEscritura, setPerguntasEscritura] = useState<[]>([]);

    // const retornaPerguntas = async () => {
    //     // const perguntas: any = await getGerentePerguntasEscritura();
    //     // setPerguntasEscritura(perguntas);
    //     // setLoading(false);
    // }

    // useEffect(() => {
    //     retornaPerguntas();
    // },[])

    // console.log(processoSelecionado);

    const onCloseFeedBack = async () => {}

    return(
        <div className="modal-form">
            <Dialog
                max-width='800'
                open={openFeedBack}
                className='modal-feedback-escritura'
                onClose={onCloseFeedBack}
            >
                <div className="content">

                    <div className="icon-close">
                        <HiLockClosed size={24} />
                    </div>
                    {
                        loading 
                        ? <FeedBackSkeleton />
                        : // escriturasFeedBack.length > 1
                            showListaEscritura
                            ? <ListaEscrituras 
                                processos={escriturasFeedBack} 
                                processoSelecionado={processoSelecionado} 
                                setProcessoSelecionado={setProcessoSelecionado} 
                                setShowListaEscritura={setShowListaEscritura}
                            />
                            : <PerguntasEscritura 
                                returnFeedBackGerente={returnFeedBackGerente}
                                processos={escriturasFeedBack} 
                                processo={processoSelecionado} 
                                showListaEscritura={showListaEscritura}
                                setShowListaEscritura={setShowListaEscritura} 
                                perguntasEscritura={perguntasEscritura}
                                setOpenFeedBack={setOpenFeedBack}
                                setOpenDialogFeedBackEscritura={setOpenDialogFeedBackEscritura}
                                // setEscriturasFeedBack={setEscriturasFeedBack}
                            />
                    }                  
                </div>
            </Dialog>
        </div>
    )
}