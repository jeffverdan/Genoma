import { GetServerSideProps } from 'next';
import HeaderDevolucao from './@Header';
import { useEffect, useState } from 'react';
import CardInfo from './@CardInfo';
import ReviewRecibo from './@ReviewRecibo';
import { ChecksReviewType, ErrorDataType, ListCorrecoes } from '@/interfaces/PosVenda/Devolucao';
import getListCorrecoes from '@/apis/getListCorrecoes';
import ReviewImovel from './@ReviewImovel';
import ReviewPF from './@ReviewPF';
import ReviewPJ from './@ReviewPJ';
import GetProcesso from '@/apis/getProcesso';
import { useRouter } from 'next/router';
import PostLocalizaProcesso from '@/apis/postLocalizaProcesso';
import Pessoa from '@/interfaces/Users/userData';
import ButtonComponent from '@/components/ButtonComponent';
import { HiArrowRight } from 'react-icons/hi2';
import { DataToSaveType } from '@/interfaces/PosVenda/Devolucao';
import { ImovelData } from '@/types/ImovelData';
import DevolverVenda from '@/apis/postDevolverVenda';
// import ReviewIncompleto from './@ReviewIncompleto';
import ModalConfirm from './@ModalConfirm';
import ReturnDataRevisaoPos from '@/apis/returnDevolucaoPos';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import { CircularProgress } from '@mui/material';

// interface ProcessType {
//     imovel: ImovelData
//     gerente: {
//         data: Pessoa[]
//     }
//     vendedores: Pessoa[]
//     vendedores_pf: Pessoa[]
//     vendedores_pj: Pessoa[]
//     compradores: Pessoa[]
//     compradores_pf: Pessoa[]
//     compradores_pj: Pessoa[]
//     status_devolucao_id: number | undefined
// };

type keysChecks = 'recibo' | 'imovel' | 'vendedor_pf' | 'vendedor_pj' | 'comprador_pf' | 'comprador_pj';
type keysUsers = 'vendedor_pf' | 'vendedor_pj' | 'comprador_pf' | 'comprador_pj';

const Devolucao = ({ idProcesso }: { idProcesso: string }) => {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [readyOnly, setReadyOnly] = useState(false);
    const [processData, setProcessData] = useState<ProcessType>();
    const [dataToSave, setDataToSave] = useState<DataToSaveType>({
        imovel: {},
        recibo: {},
        vendedor_pf: { reviews: [{id: '', reviewChecks: []}] },
        vendedor_pj: { reviews: [{id: '', reviewChecks: []}] },
        comprador_pf: { reviews: [{id: '', reviewChecks: []}] },
        comprador_pj: { reviews: [{id: '', reviewChecks: []}] },
        // incompleto: {}
    });

    const emptyErrorData = {
        imovel: {},
        recibo: {},
        vendedor_pf: {reviews: []},
        vendedor_pj: {reviews: []},
        comprador_pf: {reviews: []},
        comprador_pj: {reviews: []},
        // incompleto: {}
    };
    const [errorData, setErrorData] = useState<ErrorDataType>(emptyErrorData);
    const [checksReview, setChecksReview] = useState<ChecksReviewType>({
        recibo: false,
        imovel: false,
        vendedor_pf: false,
        vendedor_pj: false,
        comprador_pf: false,
        comprador_pj: false,
        // incompleto: false
    });
    const [listCorrecoes, setListCorrecoes] = useState<ListCorrecoes>();
    const [loading, setLoading] = useState(true);
    const [disableDevolver, setDisableDevolver] = useState(true);

    const getList = async () => {
        setLoading(true);
        // const processo = await GetProcesso(idProcesso, router);
        const processo = await PostLocalizaProcesso(idProcesso) as unknown as ProcessType;
        setProcessData(processo);        
        
        const list = await getListCorrecoes() as unknown as ListCorrecoes;
        setListCorrecoes(list);

        if(processo?.status_devolucao_id) {
            const res = await ReturnDataRevisaoPos(processo?.status_devolucao_id);
            setDataToSave(res);
            
            setChecksReview({
                recibo: !!res.recibo.obs,
                imovel: !!res.imovel.obs,
                vendedor_pf: !!res.vendedor_pf.obs,
                vendedor_pj: !!res.vendedor_pj.obs,
                comprador_pf: !!res.comprador_pf.obs,
                comprador_pj: !!res.comprador_pj.obs,
                // incompleto: !!res.incompleto.obs
            });
            setReadyOnly(true);
        }
        setLoading(false);
    };
    
    let inicial = true;
    useEffect(() => {     
        if(inicial) getList();
        inicial = false;
    }, []);    

    useEffect(() => {
        let disable = true;
        (Object.keys(checksReview) as keysChecks[]).forEach((key) => {
            if(checksReview[key]) disable = false;   
        })
        setDisableDevolver(disable);
        
        // (Object.keys(checksReview) as keysChecks[]).some((key) => {
        //     if (checksReview[key] && dataToSave[key]) {
        //         console.log("Disable: ", false);
        //         setDisableDevolver(false);
        //     } else {
        //         console.log("Disable: ", true);
        //         setDisableDevolver(true);
        //     }
        // })
    }, [checksReview]);

    const saveData = (e: any) => {
        setDataToSave({ ...dataToSave, ...e });
    };

    const onDevolver = async () => {
        // LOGICA PARA VERIFICAR ERRORS
        let error = false;
        const newErrorData: ErrorDataType = emptyErrorData;
        
        (Object.keys(checksReview) as keysChecks[]).forEach((key) => {
            if (checksReview[key]) {
                newErrorData[key].obs = !dataToSave[key].obs;
                error = error ? error : !dataToSave[key].obs;
                if (key === 'imovel' || key === 'recibo') {
                    newErrorData[key].reviewChecks = !dataToSave[key].reviewChecks?.some(e => e.id);
                    error = error ? error : !dataToSave[key].reviewChecks?.some(e => e.id);
                }
                
                else if (key.includes('pf') || key.includes('pj')) {                                        
                    dataToSave[key as keysUsers].reviews?.forEach((user) => {
                        newErrorData[key as keysUsers].reviews?.push({
                            errorUser: !user.id,
                            errorCheck: !user.reviewChecks?.some(e => e.id)
                        })
                        error = error ? error : !user.id;
                        error = error ? error : !user.reviewChecks?.some(e => e.id);
                    })
                }
                // else {
                //     newErrorData.incompleto = {
                //         checkUsers: !dataToSave.incompleto.vendedor && !dataToSave.incompleto.comprador,
                //         obs: !dataToSave.incompleto.obs,
                //     }
                //     error = error ? error : !dataToSave.incompleto.vendedor && !dataToSave.incompleto.comprador;                    
                //     error = error ? error : !dataToSave.incompleto.obs;
                // }
            }
        })
        setErrorData({ ...newErrorData });
        if (error) {
            // LOGICA DE SCROLING
            console.log(newErrorData);
            
            return '' 
        } 
        await DevolverVenda({
            data: dataToSave,
            id: idProcesso
        });
        setOpenConfirm(true);
    };

    return (
        <div className='devolucao-posvenda'>
            <HeaderDevolucao readyOnly={readyOnly} imovel={processData?.imovel} gerente={processData?.gerente} />
            <section className='content'>
                <CardInfo />
                <ReviewImovel 
                    saveData={saveData} 
                    checks={checksReview} 
                    setChecks={setChecksReview} 
                    list={listCorrecoes?.imovel} 
                    error={errorData}
                    readyOnly={readyOnly}
                    returnData={dataToSave}
                />
                <ReviewRecibo 
                    saveData={saveData} 
                    checks={checksReview} 
                    setChecks={setChecksReview} 
                    list={listCorrecoes?.recibo}
                    error={errorData}
                    readyOnly={readyOnly}
                    returnData={dataToSave}
                />

                {!!processData?.vendedores_pf[0] &&
                    <ReviewPF 
                        saveData={saveData} 
                        checks={checksReview} 
                        setChecks={setChecksReview} 
                        list={listCorrecoes?.pf} 
                        type='vendedor' 
                        pessoas={processData.vendedores_pf} 
                        error={errorData}
                        readyOnly={readyOnly}
                        returnData={dataToSave}
                    />
                }
                {!!processData?.vendedores_pj[0] &&
                    <ReviewPJ 
                        saveData={saveData} 
                        checks={checksReview} 
                        setChecks={setChecksReview} 
                        list={listCorrecoes?.pj} 
                        list_rep={listCorrecoes?.representante} 
                        type='vendedor' 
                        pessoas={processData.vendedores_pj} 
                        error={errorData}
                        readyOnly={readyOnly}
                        returnData={dataToSave}
                    />
                }
                {!!processData?.compradores_pf[0] &&
                    <ReviewPF 
                        saveData={saveData} 
                        checks={checksReview} 
                        setChecks={setChecksReview} 
                        list={listCorrecoes?.pf} 
                        type='comprador' 
                        pessoas={processData.compradores_pf} 
                        error={errorData}
                        readyOnly={readyOnly}
                        returnData={dataToSave}
                    />
                }
                {!!processData?.compradores_pj[0] &&
                    <ReviewPJ 
                        saveData={saveData} 
                        checks={checksReview} 
                        setChecks={setChecksReview} 
                        list={listCorrecoes?.pj} 
                        list_rep={listCorrecoes?.representante} 
                        type='comprador' 
                        pessoas={processData.compradores_pj} 
                        error={errorData}
                        readyOnly={readyOnly}
                        returnData={dataToSave}
                    />
                }
                {/* <ReviewIncompleto 
                    saveData={saveData} 
                    checks={checksReview} 
                    setChecks={setChecksReview} 
                    error={errorData}
                    readyOnly={readyOnly}
                    returnData={dataToSave}
                /> */}
            </section>
           {!readyOnly && <footer className='footer-devolucao'>
                <ButtonComponent
                    size={'large'}
                    variant={'contained'}
                    disabled={disableDevolver}
                    endIcon={loading ? <CircularProgress size={20} /> : <HiArrowRight fill='white' />}
                    labelColor='white'
                    label={'Enviar pedido de correção'}
                    onClick={onDevolver}
                />
            </footer>}
            <ModalConfirm openConfirm={openConfirm} setOpenConfirm={setOpenConfirm} />
        </div>
    )
}

// EXECUTA ANTES DO Devolucao
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso } = context.params as { idProcesso: string };
    return { props: { idProcesso } };
};

export default Devolucao;