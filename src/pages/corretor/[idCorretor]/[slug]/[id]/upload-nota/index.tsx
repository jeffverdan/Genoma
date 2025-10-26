import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import Header from '../../../../components/@Header';
import PostDadosParcelaUsuario from '@/apis/postDadosParcelaUsuario';
import { ItemListRecentsType } from '@/interfaces/Corretores';
import { Chip, Skeleton } from '@mui/material';
import RadioGroup from '@/components/RadioGroup';
import CheckBox from '@/components/CheckBox';
import ButtonComponent from '@/components/ButtonComponent';
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { MultiDocsType } from '@/components/UploadDocumentos/Interfaces';
import { useForm } from 'react-hook-form';
import UploadDocumentos from '@/components/UploadDocumentos';
import alterarTipoDocumentoNota from '@/apis/alterarTipoDocumentoNota';
import MobileNavPage from '@/pages/corretor/components/MobileNavPage';

export default function UploadNota() {
    const router = useRouter();
    const { idCorretor, slug, id } = router.query;
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [dadosParcela, setDadosParcela] = useState<any | ItemListRecentsType | null>(null);
    console.log('dadosParcela: ', dadosParcela)

    const [options, setOptions] = useState([
        { value: '1', disabled: false, label: 'Recibo', checked: true },
        { value: '2', disabled: false, label: 'NFe', checked: false }
    ]);
    const [ultimaNotaTipoId, setUltimaNotaTipoId] = useState(81);
    // console.log('documentoNota teste 2: ', documentoNota)
    const errorMsg = "Campo obrigatório";
    const { register, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            tipo_nota: '1'
        }
    });
    const tipoNota = watch('tipo_nota');
    const documentoId = tipoNota === '1' ? 81 : 82;
    const label = tipoNota === '1' ? 'Recibo' : 'NFe';
    const artigo = tipoNota === '1' ? 'o' : 'a';
    const artigo2 = tipoNota === '1' ? 'eu' : 'ua';
    const [multiDocs, setMultiDocs] = useState<MultiDocsType[]>([]);
    const [addRecibo, setAddRecibo] = useState<boolean>(false);
    const [res, setRes] = useState<any>();
    const [loadingButton, setLoadingButton] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    // const [parcelaId, setParcelaId] = useState('');

    const returnValores = async () => {
        setLoading(true)
        if (router.isReady && slug) {
            if(slug !== 'parcela') {
                router.push('/corretor');
            }
            else{
                if(slug === 'parcela'){
                    const response: any = await PostDadosParcelaUsuario(id as string);
                    console.log('response: ', response)
                    
                    if(response?.concorda_valor !== 1 || response?.finance_status_id !== '10'){
                        router.push(`/corretor/${idCorretor}/${slug}/${id}/`)
                    }
                    else{
                        if(response){      
                            setDadosParcela(response);   
                            // setParcelaId(String(response?.parcela_id))  
                            setUltimaNotaTipoId(response?.documentos?.data?.[0]?.tipo_documento?.tipo_documento_id)
                            setLoading(false)
                        }
                        else{
                            setLoading(true)
                            setMessage('Erro ao retornar dados da venda')
                        }
                    }
                }
            }
        }
    }

    useEffect(() => {
       returnValores()
    }, [router.isReady, slug])

    useEffect(() => {
        if(ultimaNotaTipoId) {
            const tipoNotaValue = ultimaNotaTipoId === 81 ? '1' : ultimaNotaTipoId === 82 ? '2' : '1';
            setValue('tipo_nota', tipoNotaValue);
        }
    }, [ultimaNotaTipoId, setValue])

    const dataContext = {
        dataProcesso: dadosParcela,
        idProcesso: dadosParcela?.processo_id || '',
        multiDocs,
        setMultiDocs,
        setRes
    };

    console.log('DADOS PARCELA: ', dadosParcela) 
    console.log('CONTEXT:', dataContext)

    const handleFeedBack = async () => {
        console.log('TESTE FEEDBACK')
        console.log('MULTIDOCS: ', multiDocs)

        const usuarioId: any = localStorage.getItem('usuario_id');
        let arrayData = new FormData();
        arrayData.append('usuario_id', usuarioId);
        arrayData.append('processo_id', dadosParcela?.processo_id);
        arrayData.append('papel', 'imovel');
        arrayData.append(`arquivos[${0}]`, multiDocs[0]?.file);
        arrayData.append(`tipo_documento_ids[${0}][${0}]`, String(documentoId));
        arrayData.append(`multiplo_documento_id[${0}][${0}]`, dadosParcela?.documentos?.data?.[0]?.tipo_documento?.id || "");
        arrayData.append(`documentos_ids[${0}]`, /*String(multiDocs[0]?.info_id ||*/ dadosParcela?.documentos?.data?.[0]?.id);
        arrayData.append(`idDonoDocumento[${0}]`, dadosParcela?.imovel_id || '');

        for (let pair of arrayData.entries()) {
            console.log(pair[0]+ ':', pair[1]);
        }

        if(dadosParcela && !!dadosParcela?.documentos?.data?.[0]?.tipo_documento?.tipo_documento_id){
            console.log('Tem documento')
            const tipoDoc = watch('tipo_nota') === '1' ? 81 : 82
            if(dadosParcela?.documentos?.data?.[0]?.tipo_documento?.tipo_documento_id !== tipoDoc) {
                // Salva o novo tipo de documento
                const data = await alterarTipoDocumentoNota(arrayData);
            }
        }

        // returnValores();
        router.push(`/corretor/${idCorretor}/${slug}/${id}/confirmar-dados-pagamento`)
        
    }

    console.log('ultimaNotaTipoId: ', ultimaNotaTipoId)

    return (
        <>
            <Header data={dadosParcela} />
            {
                (!loading && dadosParcela?.processo_id)
                ?
                <div className="corretor inicial-page">
                    <div className="detalhes-container">
                        <div className="confirmar-container">
                            <div className="upload-container" style={{padding: '0 20px'}}>
                                <div className="card-upload">
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
                                            />
                                        </div>
                                    </>
                                </div>
                            </div>
                            
                            <div className="upload-container" style={{padding: '0 20px'}}>
                                <div className="card-upload">
                                    <h3>Envie {artigo} s{artigo2} {label === 'Recibo' ? 'recibo' : label} assinad{artigo}:</h3>

                                    <p style={{marginBottom: '30px'}}>Atenção: subir arquivos no formato .png, .doc, docx ou .pdf.</p>

                                    <UploadDocumentos
                                        context={dataContext}
                                        pessoa="corretor"
                                        // idDonoDocumento={String(dadosParcela?.imovel_id)}
                                        idDonoDocumento={localStorage.getItem('usuario_id') || ''}
                                        register={register}
                                        errors={errors}
                                        option={[{
                                            id: documentoId,
                                            nome: 'nota',
                                            tipo: 'imóvel',
                                            validade_dias: null
                                        }]}
                                        refresh={returnValores}
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
                            </div>
                        </div>  
                    </div>

                    <MobileNavPage slug={slug} /> 
                </div>
                :
                ''
            }
            
        </>
    )
}
