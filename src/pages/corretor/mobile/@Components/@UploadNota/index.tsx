import ButtonComponent from '@/components/ButtonComponent'
import RadioGroup from '@/components/RadioGroup';
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FeedBack from './@FeedBack';
import UploadDocumentos from '@/components/UploadDocumentos';
import { MultiDocsType } from '@/components/UploadDocumentos/Interfaces';
import { ItemListRecentsType } from '@/interfaces/Corretores';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import alterarTipoDocumentoNota from '@/apis/alterarTipoDocumentoNota';
import ultimasComissoesCorretores from '@/apis/ultimasComissoesCorretores';
import { Chip, Skeleton } from '@mui/material/';
import CheckBox from '@/components/CheckBox';

type IProps = {
    openUpload: boolean,
    setOpenUpload: (e: boolean) => void
    selectProcess: any | ItemListRecentsType | null
    documentoNota: any[]
    setSelectedTab?: (e: number) => void
    setSelectProcess: (e: ItemListRecentsType | null) => void
    getListAndamento: () => void
}

export default function UploadNota({openUpload, setOpenUpload, selectProcess, documentoNota, setSelectedTab, setSelectProcess, getListAndamento} : IProps) {
    const [openFeedBack, setOpenFeedBack] = useState(false);
    const [options, setOptions] = useState([
        { value: '1', disabled: false, label: 'Recibo', checked: true },
        { value: '2', disabled: false, label: 'NFe', checked: false }
    ]);
    const [ultimaNotaTipoId, setUltimaNotaTipoId] = useState(documentoNota?.[0]?.tipo_documento?.tipo_documento_id || 81);
    const [documentoId, setDocumentoId] = useState(Number(ultimaNotaTipoId));
    const [label, setLabel] = useState('Recibo');
    console.log('documentoNota teste 2: ', documentoNota)
    const errorMsg = "Campo obrigatório";
    const { register, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            tipo_nota: ultimaNotaTipoId === 81 ? '1' : ultimaNotaTipoId === 82 ? '2' : '1'
        }
    });
    const artigo = watch('tipo_nota') === '1' ? 'o' : 'a';
    const artigo2 = watch('tipo_nota') === '1' ? 'eu' : 'ua';
    const [multiDocs, setMultiDocs] = useState<MultiDocsType[]>([]);
    const [addRecibo, setAddRecibo] = useState<boolean>(false);
    const [res, setRes] = useState<any>();
    const [loadingButton, setLoadingButton] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [checkConcordo, setCheckConcordo] = useState(false);
    const [btnDisabled, setbtnDisabled] = useState(true);

    const dataContext = {
        dataProcesso: selectProcess,
        idProcesso: String(selectProcess?.id) || '',
        multiDocs,
        setMultiDocs,
        setRes
    };

    useEffect(() => {
        getListAndamento();
    }, [selectProcess])

    const handleType = () => {
        if(watch('tipo_nota') === '1') {
            setLabel('Recibo')
            setDocumentoId(81)
        }
        else {
            setLabel('NFe')
            setDocumentoId(82)
        }
    };

    console.log('WATCH: ', watch())
    console.log('label: ', label)
    console.log('MULTIODOCS: ', multiDocs)
    console.log('dataContext.multiDocs: ', dataContext.multiDocs)

    const atualizarProcesso = async () => {
        const listProcessos: any = await ultimasComissoesCorretores({ ano: 2025, tipo: 'andamento' });
        console.log('LIST TESTE: ' , listProcessos.list)
        const attrProcess: any = listProcessos?.list?.find(
            (item: ItemListRecentsType) => item.id === selectProcess?.id
        );
        setSelectProcess(attrProcess || null);
    }

    const handleBackUpload = async () => {
        atualizarProcesso()
        setOpenUpload(false)
    }

    const handleRefreshDoc = async () => {
        setLoadingButton(true)
        atualizarProcesso()
        setLoadingButton(false)
    }

    const handleFeedBack = async () => {
        console.log('TESTE FEEDBACK')
        console.log('MULTIDOCS: ', multiDocs)

        const usuarioId: any = localStorage.getItem('usuario_id');
        let arrayData = new FormData();
        arrayData.append('usuario_id', usuarioId);
        arrayData.append('processo_id', selectProcess?.id);
        arrayData.append('papel', 'imovel');
        arrayData.append(`arquivos[${0}]`, multiDocs[0]?.file);
        arrayData.append(`tipo_documento_ids[${0}][${0}]`, String(documentoId));
        arrayData.append(`multiplo_documento_id[${0}][${0}]`, selectProcess?.documentos?.data?.[0]?.tipo_documento?.id || "");
        arrayData.append(`documentos_ids[${0}]`, /*String(multiDocs[0]?.info_id ||*/ selectProcess?.documentos?.data?.[0]?.id);
        arrayData.append(`idDonoDocumento[${0}]`, selectProcess?.imovel_id || '');

        for (let pair of arrayData.entries()) {
            console.log(pair[0]+ ':', pair[1]);
        }

        if(documentoNota && !!documentoNota?.[0]?.tipo_documento?.tipo_documento_id){
            console.log('Tem documento')
            const tipoDoc = watch('tipo_nota') === '1' ? 81 : 82
            if(documentoNota?.[0]?.tipo_documento?.tipo_documento_id !== tipoDoc) {
                // Salva o novo tipo de documento
                const data = await alterarTipoDocumentoNota(arrayData);
            }
        }

        // const listProcessos: any = await ultimasComissoesCorretores({ ano: 2025, tipo: 'andamento' });
        // console.log('LIST TESTE: ' , listProcessos.list)
        // const attrProcess: any = listProcessos?.list?.find(
        //     (item: ItemListRecentsType) => item.id === selectProcess?.id
        // );
        // console.log('novoProcesso: ' , attrProcess)            
        // setSelectProcess(attrProcess || null);
        atualizarProcesso()

        setOpenFeedBack(true)
    }

    // console.log('SELECTPROCESS EM UPLOAD NOTA: ' , selectProcess)

    const BlockUpload = () => {
        return(
            <div className="card-upload">
                <h3>Envie {artigo} s{artigo2} {label === 'Recibo' ? 'recibo' : label} assinad{artigo}:</h3>

                <p style={{marginBottom: '30px'}}>Atenção: subir arquivos no formato .png, .doc, docx ou .pdf.</p>

                <UploadDocumentos
                    context={dataContext}
                    pessoa="imovel"
                    idDonoDocumento={selectProcess?.imovel_id}
                    register={register}
                    errors={errors}
                    option={[{
                        id: documentoId,
                        nome: 'nota',
                        tipo: 'imóvel',
                        validade_dias: null
                    }]}
                    refresh={handleRefreshDoc}
                    // setAddRecibo={setAddRecibo}
                />

                {
                    dataContext?.multiDocs?.length !== 0 &&
                    <ButtonComponent
                        name="confirm"
                        variant="contained"
                        onClick={(e) => handleFeedBack()}
                        labelColor="white"
                        size={"large"}
                        label={"Enviar Nota"}
                        endIcon={<ArrowRightIcon />}
                        disabled={loadingButton}
                    />
                }
            </div>
        )
    }

    const BlockConfirmar = () => {
        return(
            <>
                <div className="mei-container">                 
                    <span className="title" style={{fontSize: '24px', marginBottom: '15px'}}>Confirme o valor:</span>
                    <Chip label={'11%'} className="chip default" />
                    <span className="title">Valor a receber</span>
                    <div className="valor">
                        <span className="moeda">R$</span>
                        <span className="valor-numero">
                            {(selectProcess?.valor || selectProcess?.valor_anunciado || 'R$ 0,00').toString().replace(/^R\$\s?/, '')}
                        </span>
                    </div>

                    <div className="checkBox">
                        <CheckBox
                            label={`Eu concordo com o valor`}
                            value={checkConcordo ? '1' : '0'}
                            checked={checkConcordo}
                            onChange={(e) => handleCheck(e)}
                        />
                    </div>

                    <ButtonComponent
                        name="confirm"
                        variant="contained"
                        onClick={(e) => setShowUpload(true)}
                        labelColor="white"
                        size={"large"}
                        label={"Confirme e envie a nota"}
                        endIcon={<ArrowRightIcon width={20} height={20} />}
                        disabled={btnDisabled}
                    />
                </div>

                <div className="info-container">
                    <>
                        <div className="item-detalhado">
                            <div className="title-item-detalhado">
                                Valor detalhado:
                            </div>

                            <div className="grid">
                                <div className="row">
                                    <div className="head">
                                        <div className="papel">Gerente</div>
                                        <Chip className="chip neutral" label={'5%'}/>
                                    </div>

                                    <div className="col">
                                        <div className="titulo">Porcentagem</div>
                                        <div className="titulo">Valor de rateio</div>
                                    </div>

                                    <div className="col">
                                        <div className="titulo">50%</div>
                                        <div className="valor">R$ 1.500,00</div>
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="head">
                                        <div className="papel">Corretor opcionista</div>
                                        <Chip className={'chip neutral'} label={'18%'}/>
                                    </div>

                                    <div className="col">
                                        <div className="titulo">Porcentagem</div>
                                        <div className="titulo">Valor de rateio</div>
                                    </div>

                                    <div className="col">
                                        <div className="valor">100%</div>
                                        <div className="valor">R$ 1.000,00</div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <div className="titulo-total">Total da comissão</div>
                                    </div>

                                    <div className="col">
                                        <div className="valor-total">R$ 2.500,00</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                </div>

                <div className="mei-container" style={{marginBottom: '60px'}}>                 
                    <span className="title" style={{width: '100%', textAlign: 'left'}}>O que acontece se eu não concordar com o valor?</span>
                    <p>Entre em contato com o seu Gerente. Puxamos esse valor diretamente da planilha de comissão da venda. Mas é sempre bom a confirmação :)</p>
                </div>
            </>                 
        )
    }

    const handleCheck = (e: any) => {
        const checked = e.target.checked;
        setCheckConcordo(checked);
        setbtnDisabled(checked ? false : true);
    }
    console.log('concordo: ', checkConcordo);

    return (
        <>
            <div className="upload-container">
                <div className="card-upload">
                    <ButtonComponent
                        name="close"
                        variant="text"
                        onClick={(e) => {showUpload ? setShowUpload(false) : handleBackUpload()}}
                        size={"large"}
                        label={"Voltar"}
                        startIcon={<ArrowLeftIcon width={20} />}
                    />

                    {
                        showUpload
                        ?
                        <>
                            <h2>Qual tipo de nota será usada?</h2>

                            <div className="type-upload">
                                <RadioGroup
                                    value={watch('tipo_nota')}
                                    label=''
                                    options={options}
                                    setOptions={setOptions}
                                    setValue={setValue}
                                    {...register('tipo_nota', {
                                        required: errorMsg,
                                    })}
                                    changeFunction={handleType}
                                />
                            </div>
                        </>
                        :''
                    }
                    
                </div>

                { showUpload && <BlockUpload /> }
            </div>

            { !showUpload && <BlockConfirmar /> }

            {
                !!openFeedBack &&
                <FeedBack openFeedBack={openFeedBack} setOpenFeedBack={setOpenFeedBack} setSelectedTab={setSelectedTab} setSelectProcess={setSelectProcess}  />
            }
        </>
    )
}
