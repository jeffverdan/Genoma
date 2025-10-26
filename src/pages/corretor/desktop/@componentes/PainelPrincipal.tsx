import ButtonComponent from "@/components/ButtonComponent";
import { differenceInMinutes, format } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HiArrowPath } from "react-icons/hi2";
import Single from "@/images/single.png";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CardValor from "../../mobile/@Components/@ListVendas/CardValor";
import { ItemListRecentsType, listAndamentoType, TypeComissionsCorretores, TYPES_COMISSION_TYPE, UrlsAnunciosType, ValoresProducao } from "@/interfaces/Corretores";
import UltimasComissoes from "./@ElementosPainelPrincipal/TableUltimasComissoes";
import RecentQuestions from "../../mobile/@Components/@ListVendas/RecentesQuestions";
import CardValorGroup from "../../mobile/@Components/@ListVendas/CardValorGroup";

interface PropsType {
    returnList: (limite?: number, status?: number) => void
    loading: boolean
    listAndamento: listAndamentoType
    loadingConcluidos: boolean
    listConcluidos: listAndamentoType
    loadingCancelados: boolean
    listCancelados: listAndamentoType
    setSelectedIndex: (e: number) => void
    setSelectProcess: ( e: ItemListRecentsType | null ) => void
    selectProcess: ItemListRecentsType | null
    TYPES_COMISSION: TYPES_COMISSION_TYPE
    setSelectTabTypeComission: (e: number) => void; // TAB DE TIPO DE COMISSAO NA ABA COMISSAO
    valoresProducao: ValoresProducao[]; // Valores de produção para o painel
    listagemUltimaComissao: ItemListRecentsType[]; // Lista de últimas comissões
    statusIdMenu: number; // Status do menu
}

export default function PainelPrincipal(props: PropsType) {
    const [today] = useState(format(new Date(), 'dd-MM-yyyy'));
    const [userName, setUserName] = useState("");
    const [timeDifference, setTimeDifference] = useState<string | null>("0 minutos");
    const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
    const [hiddenChangeLog, setHiddenChangeLog] = useState(false);

    const { returnList, loading, listAndamento, setSelectedIndex, setSelectProcess, selectProcess, listConcluidos, loadingConcluidos, TYPES_COMISSION, setSelectTabTypeComission, loadingCancelados, listCancelados, valoresProducao, listagemUltimaComissao, statusIdMenu } = props;    

    useEffect(() => {
        const name = localStorage.getItem('nome_usuario') as string;
        setUserName(name);
    }, []);

    const calculateTimeDifference = (): string | null => {
        if (lastUpdated) {
            const minutesDifference = differenceInMinutes(new Date(), lastUpdated);
            return `${minutesDifference} minutos`;
        }
        return null;
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeDifference(calculateTimeDifference());
        }, 60000); // Atualiza a cada minuto (60000 milissegundos)

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const handleTab = (type: TypeComissionsCorretores) => {
        const index = TYPES_COMISSION?.findIndex(item => item?.key === type);
        setSelectTabTypeComission(index); // Define a aba de tipo de comissão na aba Comissão;
        setSelectedIndex(1); // Muda para a aba de comissão
    };

    return (
        <div className="painel-principal">
            <div className='header-container'>
                <div className='header-title'>
                    <span className='subtitle'>{today}</span>
                    <span><b>Olá {userName.split(" ")[0]}</b>, boas-vindas ao seu painel.</span>
                </div>
                <div className='atualizar-lista'>
                    <ButtonComponent
                        size={'medium'}
                        variant={'text'}
                        name={'atualizar-painel'}
                        onClick={() => returnList()}
                        label={'Atualizar painel'}
                        endIcon={<HiArrowPath className={loading ? 'rotate' : ''} />}
                    />
                    <span className="subtitle">{lastUpdated ? `Há ${timeDifference}` : ''}</span>
                </div>
            </div>

            {!hiddenChangeLog &&
                <div className='changelog-container'>
                    <div className='title-container'>
                        <Image src={Single} alt={"changelog-img"} />
                        <div className='changelog-title'>
                            <p>Acompanhe o seu saldo de comissão.</p>
                            {/* <span>Você tem, 3 pendências e 6 notificações novas.</span> */}
                        </div>
                    </div>
                    <div className="action-container">
                        <XMarkIcon width={20} height={20} className="icon-close" onClick={() => setHiddenChangeLog(true)} />
                        {/* <ButtonComponent size={'small'} variant={'outlined'} name={''} label={'Ver Changelog do painel'} /> */}
                    </div>
                </div>
            }

            <div className="container-cards" style={{ flexDirection: 'column' }}>
                <CardValorGroup type={"andamento"} list={listAndamento} loading={loading} handleTab={handleTab} valoresProducao={valoresProducao} />
                {/* <CardValor type={"concluidos"} list={listConcluidos} loading={loadingConcluidos} handleTab={handleTab} /> */}
            </div>
            {/* <CardValor type={"cancelados"} setSelectedTab={setSelectedIndex} list={listCancelados} loading={loadingCancelados} /> */}

            <UltimasComissoes 
                setSelectProcess={setSelectProcess} 
                selectProcess={selectProcess}             
                loading={loading} 
                setSelectedIndex={setSelectedIndex} 
                listAndamento={listAndamento}
                listConcluidos={listConcluidos}
                listCancelados={listCancelados}
                listagemUltimaComissao={listagemUltimaComissao}
            />

            {/* <RecentQuestions /> */}
        </div>
    )
}