import React, { useState, useRef, MouseEvent, useEffect } from 'react'
import styles from './index.module.scss'
import { Chip, Paper } from '@mui/material'
import ButtonComponent from '../ButtonComponent'
import { HiInformationCircle, HiEllipsisHorizontal, HiCheck } from 'react-icons/hi2'
import { useRouter } from 'next/router'
import { CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import ArrowPrimary500 from '../../../src/images/status/arrow_primary500.svg';
import ArrowGreen500 from '../../../src/images/status/arrow_green500.svg';
import Image from 'next/image';
import DialogShowStatus from './DialogShowStatus'
import Skeleton from '@mui/material/Skeleton';
import { Visualizar } from '@/interfaces/PosVenda/AlterarStatus';
// import MenuOpcoesStatus from './MenuOpcoesStatus';
import MenuOpcoesVenda from '../PosVenda/MenuOpcoesVenda';
import DialogConcluirProcesso from '../DialogConcluirProcesso'
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso'
import Corner from '../Corner'
import getStatusRGI from '@/apis/statusRGI'
import GetListTipoRgi from '@/apis/getListTipoRgi'
interface IHistoricoStatus {
    dias_corridos: string;
    historico_status: {
        status_id: number
        id: number | string,
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
interface IStatus {
    idProcesso: string
    historicoStatus?: IHistoricoStatus
    loadingStatus: boolean
    setNewStatus: (e: boolean) => void
    cardSelect: Visualizar
    setCardSelect: (e: Visualizar) => void
    processData?: ProcessType
    openDialog: boolean
    setOpenDialog: (e: boolean) => void
    typeDialog: string
    setTypeDialog: (e: string) => void
    returnProcess: () => void
}

type StatusRGIType = {
    status: string,
    exigencia: string,
    error?: { name: string }
}

export default function StatusLine({ idProcesso, historicoStatus, loadingStatus, setNewStatus, cardSelect, setCardSelect, processData, openDialog, setOpenDialog, typeDialog, setTypeDialog, returnProcess }: IStatus) {
    const router = useRouter();
    const scrollableRef = useRef<HTMLDivElement>(null);
    const [isDown, setIsDown] = useState<boolean>(false);
    const [startX, setStartX] = useState<number>(0);
    const [scrollLeft, setScrollLeft] = useState<number>(0);
    const [hasScroll, setHasScroll] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const statusList = historicoStatus;
    const skltnCorridos = <Skeleton animation="wave" width={20} height={20} style={{ marginLeft: '5px' }} />;
    const skltnVerificaData = <Skeleton animation="wave" width={50} height={20} style={{ marginLeft: '5px' }} />;
    const skltnCard = <Skeleton variant='rectangular' animation="wave" width={'100%'} height={308} style={{ padding: '0 20px' }} />;
    const [openDialogConcluir, setOpenDialogConcluir] = useState<boolean>(false);
    const [tipoConcluir, setTipoConcluir] = useState('');

    // CONSULTA RGI
    const [statusLoading, setStatusLoading] = useState(false);
    const [statusRGI, setStatusRGI] = useState<StatusRGIType | null>();
    const [errorStatus, setErrorStatus] = useState<string>();

    useEffect(() => {
        if (!loadingStatus && scrollableRef.current) {
            setHasScroll(scrollableRef.current.scrollWidth > scrollableRef.current.clientWidth);
            scrollableRef.current.scrollLeft = scrollableRef.current.scrollWidth - scrollableRef.current.clientWidth;
        }
    }, [loadingStatus]);

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        setIsDown(true);
        if (scrollableRef.current) {
            setStartX(e.pageX - scrollableRef.current.offsetLeft);
            setScrollLeft(scrollableRef.current.scrollLeft);
        }
    };

    // console.log(historicoStatus);

    const handleMouseLeave = () => {
        setIsDown(false);
    };

    const handleMouseUp = () => {
        setIsDown(false);
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDown || !scrollableRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollableRef.current.offsetLeft;
        const walk = (x - startX) * 1; // Ajuste a sensibilidade aqui
        scrollableRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (!scrollableRef.current) return;
        scrollableRef.current.scrollLeft += e.deltaY * 1; // Ajuste a velocidade da rolagem aqui
    };

    const handleAlterarStatus = async () => {
        setNewStatus(true)
    };

    const handleClickCard = async (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>, status: any) => {
        setCardSelect(status);
        // console.log(status)

        if (status?.status_id !== 1) {
            if (status?.status_id === 2) {
                router.push(`/posvenda/${idProcesso}/analise/`)
            }
            else {
                if (status?.status === 'feito') setOpenModal(true)
                else if (status?.status === 'atual') handleAlterarStatus();
            }
        }
    };

    const handleConcluirProcesso = async () => {
        const registro = statusList?.historico_status.some(objeto => objeto.status_id === 5);
        // console.log(registro);

        if (registro) setTipoConcluir('completo');
        else setTipoConcluir('parcial');

        setOpenDialogConcluir(true);
    }

    const onCloseDialog = () => {
        setOpenDialogConcluir(false)
    };

    const puppeteerFunc = async () => {
        setErrorStatus('');
        const status = historicoStatus?.historico_status.find((item) => item.registro);
        setStatusRGI(null);

        const protocolo = status?.registro?.protocolo_rgi || '';
        const res: any = await GetListTipoRgi();
        const rgi = Number(res?.data.find((item: any) => item.id === Number(status?.registro?.tipo_rgi_id))?.nome.replace('º', ''));
        console.log(cardSelect.registro?.tipo_rgi_id);

        if (!protocolo || !rgi) {
            setErrorStatus('Informe o rgi e o protocolo.');            
            return '';
        }

        setStatusLoading(true);
        const resStatus = await getStatusRGI({ protocolo, rgi }) as any;
        if (!!resStatus.status || Number(resStatus.status) != 500) setStatusRGI({
            status: resStatus.status,
            exigencia: resStatus.exigencia,
        });
        else setErrorStatus('Protocolo incorreto ou consulta indisponível');
        setStatusLoading(false);
    };

    useEffect(() => {
        historicoStatus?.historico_status.find((item) => item.registro)?.status === 'atual' && puppeteerFunc();
    }, [historicoStatus]);

    return (
        <div className="status-posvenda">
            <div className={styles.container}>
                <div className={styles.content}>

                    {/*HEADER*/}
                    <div className={styles.header}>
                        <div className={styles.title}>Alterações de status</div>
                        <div className={styles.info}>
                            <div className={styles.diasCorridos}>
                                Dias Corridos: {loadingStatus ? skltnCorridos : historicoStatus?.dias_corridos}
                            </div>

                            {loadingStatus
                                ? skltnVerificaData
                                : <Chip
                                    className={`chip ${historicoStatus?.verifica_data === 'ATRASADO' ? 'red' : 'green'}`}
                                    label={historicoStatus?.verifica_data}
                                />
                            }

                            <div className={styles.verDetalhes}>
                                <MenuOpcoesVenda
                                    id={idProcesso}
                                    responsavelId={Number(processData?.imovel.processo_id)}
                                    label='Opções'
                                    startIcon={<HiEllipsisHorizontal fill='white' size={20} />}
                                    tools
                                    loading={loading}
                                    setLoading={setLoading}
                                    openDialog={openDialog}
                                    setOpenDialog={setOpenDialog}
                                    setTypeDialog={setTypeDialog}
                                    returnList={returnProcess}
                                // statusProcesso={row.statusProcessoAtual}
                                />
                            </div>
                        </div>
                    </div>

                    {/*LINHA DO TEMPO*/}
                    {
                        loadingStatus
                            ? skltnCard
                            :
                            <div
                                className={`${styles.blocks} ${styles.scrollable} ${hasScroll ? styles.grab : ''}`}
                                ref={scrollableRef}
                                onMouseDown={hasScroll ? handleMouseDown : undefined}
                                onMouseLeave={handleMouseLeave}
                                onMouseUp={handleMouseUp}
                                onMouseMove={handleMouseMove}
                                onWheel={handleWheel}
                            >
                                {
                                    statusList?.historico_status?.map((status: any, index: number) =>
                                        <>
                                            <div className={styles.row}>
                                                <div
                                                    className={`${styles.card} ${status?.status === 'feito' ? styles.feito : styles.atual}`}
                                                    onClick={(e) => handleClickCard(e, status)}
                                                >
                                                    <div className={styles.chipCard}>
                                                        <Chip
                                                            className={`chip ${status?.status === 'atual' ? 'neutral' : 'green'}`}
                                                            label={status?.status}
                                                        />
                                                    </div>

                                                    <div className={styles.cardContent}>
                                                        <div className={styles.icon}>
                                                            {status?.status === 'feito'
                                                                ? <CheckIcon />
                                                                // : <HiEllipsisHorizontal />
                                                                : <div className='dot-container primary'>
                                                                    <div className="dot-typing"></div>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className={styles.status}>{statusList?.historico_status[index - 1]?.nome === 'Correção solicitada' ? 'Venda corrigida' : status?.nome}</div>
                                                        <div className={styles.data}>Início: <span>{status?.data}</span></div>
                                                    </div>
                                                </div>

                                                {
                                                    status?.status_id !== 1 &&
                                                    <div className={styles.btnDetalhe}>
                                                        <ButtonComponent
                                                            label="Ver"
                                                            labelColor='#01988C'
                                                            variant="outlined"
                                                            size='small'
                                                            fullWidth
                                                            onClick={(e: any) => handleClickCard(e, status)}
                                                        />
                                                    </div>
                                                }
                                            </div>

                                            <div className="arrowCard">
                                                <Image
                                                    src={status?.status === 'feito' ? ArrowGreen500 : ArrowPrimary500}
                                                    alt={status?.status === 'feito' ? "arrow_green500" : "arrow_primary500"}
                                                />
                                            </div>
                                        </>
                                    )
                                }

                                {/*CARD ALTERAR STATUS*/}
                                <div className={`${styles.card} ${styles.cardBtn}`} onClick={handleAlterarStatus}>
                                    <div className={`${styles.icon} ${styles.iconAdd}`}><PlusIcon /></div>
                                    <div className={styles.status}>Alterar status</div>
                                </div>
                            </div>
                    }

                    {/*FOOTER*/}
                    <div className={styles.footer}>
                        <div>
                            {historicoStatus?.historico_status.find((item) => item.registro)?.status === 'atual' &&
                                <div className={styles.consulta_rgi}>
                                    <span>Consulta RGI -</span>
                                    {statusLoading && <Skeleton variant="text" width={280} />}


                                    {statusRGI?.status &&
                                        <div className=''>
                                            <span> Status: <Chip className={`chip ${statusRGI.exigencia ? 'red' : 'green'}`} label={statusRGI.status} /></span>
                                            {statusRGI.exigencia && <p> - {statusRGI.exigencia}</p>}
                                        </div>
                                    }
                                </div>
                            }
                        </div>

                        <div className={styles.btnFooter}>
                            <ButtonComponent
                                label="Concluir processo"
                                startIcon={<HiCheck />}
                                labelColor='white'
                                variant="contained"
                                size='small'
                                disabled={statusList?.historico_status.length === 2 ? true : false}
                                onClick={(e) => handleConcluirProcesso()}
                            />
                        </div>
                    </div>
                </div>

                {/*EXIBE INFORMAÇÕES DOS STATUS FEITO*/}
                <DialogShowStatus
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    cardSelect={cardSelect}
                    setCardSelect={setCardSelect}
                />

                {/*FEEDBACK AO CONCLUIR PROCESSO*/}
                <DialogConcluirProcesso open={openDialogConcluir} onClose={onCloseDialog} tipoConcluir={tipoConcluir} processData={processData} />
            </div>
        </div>
    )
}
