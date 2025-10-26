import React, { useState, useEffect, ReactElement } from 'react';
import { GetServerSideProps } from 'next';
import getProcesso from '@/apis/getProcesso';
import PostLocalizarSolicitacaoNucleo from '@/apis/postLocalizarSolicitacaoNucleo';
import GetListaDocumentos from '@/apis/getListaDocumentos';
import HeadSeo from '@/components/HeadSeo';
import Header from './Header';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import TypePessoa from '@/interfaces/Users/userData';
// import SwipeableViews from 'react-swipeable-views';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import Imovel from './Imovel';
import Gerente from './Gerente';
import Pessoa from './Pessoa';
import Historico from './Historico/index';
import Venda from './Venda';
import { useRouter } from 'next/router';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { HiCheck } from 'react-icons/hi';
import Slide, { SlideProps } from '@mui/material/Slide';
import Nucleo from './Nucleo';
import PedidosNucleo from '@/interfaces/Nucleo/pedidos';
import NucleoInterface from '@/interfaces/Nucleo/nucleo'
import MenuOpcoesVenda from '../PosVenda/MenuOpcoesVenda';
import { HiEllipsisHorizontal } from 'react-icons/hi2';

type tabs = {
    label: string,
    active: boolean,
    componente: ReactElement
}

interface headerTabsType {
    tabs: tabs[],
    selectTab: number
};

interface Props {
    idProcesso: string
    imovel?: boolean
    vendedor?: boolean
    comprador?: boolean
    gerente?: boolean
    historico?: boolean
    venda?: boolean
    nucleo?: boolean
    menu?: boolean
    order?: number[]
}

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="down" />;
}


const DetalhesVenda = ({ idProcesso, imovel, vendedor, comprador, gerente, historico, venda, nucleo, menu, order }: Props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imovelData, setImovelData] = useState<imovelDataInterface>({});
    const [listaDocumentos, setListaDocumentos] = useState<[]>([]);
    const [tabs, setTabs] = useState<headerTabsType>({
        tabs: [], selectTab: -1
    });
    const [open, setOpen] = useState<boolean>(false);
    const [tituloCard, setTituloCard] = useState<string>('');
    const splitRouter = router.asPath.split('/');
    const painelRouter = splitRouter[1];
    const [solicitacoesNucleo, setSolicitacoesNucleo] = useState<PedidosNucleo[]>([]);
    const [documentosNucleo, setDocumentosNucleo] = useState<NucleoInterface>();
    const [currentCount, setCurrentCount] = useState<NodeJS.Timeout>();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [typeDialog, setTypeDialog] = useState<string>('');

    // console.log('ORDER: ', order)

    const realocandoRepresentantes = (oldValue: TypePessoa[]) => {
        const newValue: TypePessoa[] = []

        oldValue?.forEach(e => {
            newValue.push(e);
            if (e.tipo_pessoa === 1) {
                e.representante_socios?.data.forEach(r => {
                    r.vinculo_empresa = {
                        razao_social: e.razao_social || '',
                        id: Number(e.id),
                        nome_fantasia: e.nome_fantasia || '',
                    }
                    newValue.push(r);
                });
            }
        });
        return newValue;
    };

    const returnData = async () => {
        clearTimeout(currentCount);
        setLoading(true);

        setCurrentCount(setTimeout(async () => {
            const data = await getProcesso(idProcesso, router) as unknown as imovelDataInterface;
            if (data) {
                data.vendedores = realocandoRepresentantes(data.vendedores || []);
                data.compradores = realocandoRepresentantes(data.compradores || []);
                // data.gerente = data.gerente;

                setImovelData(data as imovelDataInterface);
                // if (!tabs.tabs[0].active) setTabs({ ...tabs, selectTab: 1 })
                // else setTabs({ ...tabs, selectTab: 0 })

                // RETORNA A LISTA DE DOCUMENTOS
                const documentos: any = await GetListaDocumentos();
                const documentosImovel = documentos.filter((documento: any) => documento.tipo === 'imovel' || documento.tipo === 'imóvel');
                //console.log(documentosImovel);
                setListaDocumentos(documentosImovel);
            }
        }, 100));

        await returnSolicitacoes();

        setLoading(false);
    };

    const returnSolicitacoes = async () => {
        const res: any = await PostLocalizarSolicitacaoNucleo(idProcesso);
        setSolicitacoesNucleo(res?.solicitação_nucleo?.data);
        setDocumentosNucleo(res?.processo);
    };

    useEffect(() => {
        returnData();
    }, []);

    let count = 0
    useEffect(() => {
        if (imovelData.processo_id && count === 0) {
            returnTabs();
            count++
        }
    }, [imovelData]);

    const returnTabs = () => {

        // Para definir uma tab pré selecionada
        const tabSelect = Number(localStorage.getItem('tab_select') || tabs.selectTab);        
        tabs.selectTab = tabSelect >= 0 ? tabSelect : 0;
        localStorage.removeItem('tab_select');

        const tabsPadrao = [
            { label: 'Venda', active: venda || false, componente: <Venda imovelData={imovelData} /> },
            { label: 'Imóvel', active: imovel || false, componente: <Imovel setOpen={setOpen} setTituloCard={setTituloCard} imovelData={imovelData} listaDocumentos={listaDocumentos} returnData={returnData} /> },
            { label: 'Gerente', active: gerente || false, componente: <Gerente imovelData={imovelData} type='gerente' returnData={returnData} /> },
            { label: 'Vendedores', active: vendedor || false, componente: <Pessoa setOpen={setOpen} setTituloCard={setTituloCard} imovelData={imovelData} type='vendedores' returnData={returnData} /> },
            { label: 'Compradores', active: comprador || false, componente: <Pessoa setOpen={setOpen} setTituloCard={setTituloCard} imovelData={imovelData} type='compradores' returnData={returnData} /> },
            { label: 'Núcleo', active: nucleo || false, componente: <Nucleo returnData={returnData} solicitacoes={solicitacoesNucleo} setSolicitacoes={setSolicitacoesNucleo} documentosNucleo={documentosNucleo} imovelData={imovelData} returnSolicitacoes={returnSolicitacoes} /> },
            { label: 'Histórico', active: historico || false, componente: <Historico imovelData={imovelData} /> },
        ];

        if (order) {
            const orderTabs = [] as tabs[];
            order.forEach((value) => {
                tabsPadrao.forEach((tab, index) => {
                    if (index === value) {
                        orderTabs.push(tab);
                    }
                });
            });
            setTabs({ ...tabs, tabs: orderTabs });
            console.log('orderTabs: ', orderTabs);
        } else {
            setTabs({ ...tabs, tabs: tabsPadrao, });
        }
    };

    const handleTab = (value: any) => {
        setTabs({ ...tabs, selectTab: value });
        setOpen(false);
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        setOpen(false);
    };

    const Menu = () => {
        return (
            <div className='menu'>
                {menu &&
                    <MenuOpcoesVenda
                        id={imovelData.processo_id || ''}
                        responsavelId={documentosNucleo?.responsaveis?.data[0].id || ''}
                        label='Opções'
                        startIcon={<HiEllipsisHorizontal fill='white' size={20} />}
                        tools
                        origem='detalhes'
                        loading={loading}
                        setLoading={setLoading}
                        openDialog={openDialog}
                        setOpenDialog={setOpenDialog}
                        setTypeDialog={setTypeDialog}
                        returnList={returnData}
                        statusProcesso={documentosNucleo?.status?.data[0].id}
                    />
                }
            </div>
        )
    }

    return (
        <>
            <HeadSeo titlePage={"Detalhes da Venda"} description='Detalhes da venda' />
            <Header imovel={imovelData} urlVoltar={`/${painelRouter}`} tabs={tabs} setTabs={setTabs as (tabs: headerTabsType | {}) => void} Menu={Menu} />
            <div className='detalhes-venda'>
                <SwipeableViews
                    axis={'x'}
                    index={tabs.selectTab}
                    onChangeIndex={handleTab}
                    className='swipe-container'
                >
                    {tabs?.tabs.map((tab, index) => (
                        <div key={index} hidden={index != tabs.selectTab}>
                            {tab.componente}
                        </div>
                    ))}
                </SwipeableViews>

                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={open}
                    autoHideDuration={5000}
                    onClose={handleClose}
                    TransitionComponent={SlideTransition}
                >
                    <Alert
                        className='alert green'
                        severity="error"
                        style={{ maxWidth: '860px', width: '100%' }}
                        icon={<HiCheck size={20} />}
                    >
                        As alterações em <strong>{tituloCard}</strong> foram salvas.
                    </Alert>
                </Snackbar>
            </div>
        </>
    )
}

export default DetalhesVenda;