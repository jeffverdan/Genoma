import React, { useState, useContext, useEffect } from 'react';
import HeadSeo from '@/components/HeadSeo';
import InputCodImovel from '@/components/Vendas/InputCodImovel';
import Mapa from '@/components/Mapa';
import VendasContext from '@/context/VendasContext';
import { MyImovel } from '@/interfaces/Imovel';
import ButtonBack from '@/components/ButtonBack';
import NavFooterMobile from '@/components/NavFooterMobile';
import { useRouter } from 'next/router';
import Axios from 'axios';
import GlobalContext from '@/context/GlobalContext';
import { CircularProgress, Collapse, LinearProgress } from '@mui/material';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
//import getMidas from '@/apis/getMidas';
import getImovelBancoMidas from '@/apis/getImovelBancoMidas';
import InputText from '@/components/InputText/Index';
import { useForm } from 'react-hook-form';
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/24/solid';

import ILovePDFApi from '@ilovepdf/ilovepdf-js';
import ILovePDFFile from '@ilovepdf/ilovepdf-js/ILovePDFFile';
import { createWorker } from 'tesseract.js';
import OpenAI from "openai";
import JSZip from 'jszip';
const instance = new ILovePDFApi('project_public_666b97bee23de12d6fa685dfde66ca06_R5eCX971e02038c9c7c222e959026549f3336');
import SaveDocument from '@/apis/saveDocument';
import SwitchWithLabel from '@/components/SwitchButton';
import ButtonComponent from '@/components/ButtonComponent';
import InputFileSingle from '@/components/InputFileSingle';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import analyzeDocument from '@/apis/Azure/DocumentsRead';
import openAI_API from '@/components/OpenAI_TextExtract/openAI_API';
import { promptOnusReais } from '@/components/OpenAI_TextExtract/prompts';
import { PDFDocument } from 'pdf-lib';
import validarCPF from '@/functions/validarCPF';

type DataToSaveType = {
    matricula: string
    vendedor?: ProprietarioDataType[],
    laudemios: {
        tipo_laudemio: string,
        valor_laudemio: number | string
    }[]
}

type ProprietarioDataType = {
    nome: string,
    pessoa_juridica: boolean,
    cpf: string,
    data_nascimento: string,
    telefone: string,
    rg: string,
    estado_civil: string,
    uniao_estavel: string,
    conjuge: string,
    regime_casamento: string
    email: string
}

type jsonFormatType = {
    rgi: boolean
    matricula_imovel: string,
    imovel_com_laudemio: string,
    laudemio_paragrafo: string,
    foreiro: string,
    ultimo_registro: string,
    percent: string,
    dados: ProprietarioDataType[]
};

interface ProgressType {
    percent: number
    status: string
    error?: string
}

interface CodImovel {
    codImovel: string
    disable: string
    error: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const links = {
    safebox: process.env.NEXT_PUBLIC_SAFEBOX_URL,
    laravel: process.env.NEXT_PUBLIC_SAFEBOX_API_V1
};

const vendedorEmpty = {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    estado_civil: '',
    uniao_estavel: '',
    conjuge: '',
    regime_casamento: ''    
}

export default function CodImovel() {
    const {
        setProcessoId
    } = useContext(GlobalContext);

    const {
        register,
        watch,
        setError,
        clearErrors,
        formState: { errors },
        handleSubmit,
    } = useForm<CodImovel>({
        defaultValues: { "codImovel": "" }
    })

    const [loading, setLoading] = useState(false);    
    const [imovelMidas, setImovelMidas] = useState<MyImovel>();    
    const [collapseAdress, setCollapseAdress] = useState(false);
    const [fileToSave, setFileToSave] = useState<File>();
    const [switchOnus, setSwitchOnus] = useState(false);
    const [collapseOnusFile, setCollapseOnusFile] = useState(false);
    const [progressBar, setProgressBar] = useState<ProgressType[]>([{ percent: 0, status: '', error: undefined }]);
    const inicialData = {
        matricula: '',
        laudemios: [],
        vendedor: [],
    };
    const [dataToSave, setDataToSave] = useState<DataToSaveType>(inicialData);
    const [urlImage, setUrlImage] = useState('');

    const [promptVendedores] = useState(`
        Os dados a seguir devem ser retirados do texto, 
        e apenas do adquirente que pode ser mais de uma pessoa,
        pessoa fisica ou juridica, 
        retorne em JSON:
        "dados": [{
            nome: '', 
            pessoa_juridica: true se for pessoa juridica e false se for pessoa fisica,
            cpf: se for pessoa fisica numero do cpf formatado,
            cnpj: se for pessoa juridica numero do cnpj formatado,
            data_nascimento: retorne se houver retornar a data de nascimento no formato DD/MM/AAAA pode ter mais de uma data então tenha cuidado para não pegar a data errada,
            telefone: retorne se houver retornar o numero do telefone no formato com DDD,
            rg: se houver retornar o numero do RG,
            rg_expedido: retorne se houver retornar o nome do orgão que expediu o RG,
            rg_data_expedicao: retorne se houver retornar a data em que foi expedido o RG no formato DD/MM/AAAA,
            estado_civil: retorne apenas os valores: '1' para Casado(a) ou '2' para Solteiro(a) ou '3' para Divorciado(a) ou '4' para Viúvo(a) ou '0' para nenhuma das opções anteriores,
            uniao_estavel: retorne true se houver união estável ou false se não,
            conjuge: retorne o nome do conjugue apenas se o estado_civil dessa pessoa for Casado ou Divorciado ou Viúvo,
            regime_casamento: retorne 1 para separação total ou 2 para separação parcial ou 3 para separação legal ou 4 para comunhão de bens ou 5 para comunhão parcial ou 0 se não encontrar a informação,
        }]: 
        segue o texto: 
    `);

    const router = useRouter();

    const [title, setTitle] = useState('Qual imóvel você vendeu?');
    useEffect(() => {
        setTitle(`${localStorage.getItem('nome_usuario')?.split(' ')[0]}, qual imóvel você vendeu?`);
    }, []);

    // 'progress' controla a barra de loading no rodapé
    const [progress, setProgress] = useState(0);
    const [feedbacksLoading, setFeedbacksLoading] = useState({
        // OS INDEX DAS MSG PRECISAM SER PASSADOS AO PASSAR 'progress'
        index: -1,
        msg: [
            'Preparando leitura da ônus reais',
            'Conferindo quantidade de páginas',
            'Ativando nossa ferramenta de IA',
            'Realizando scan do conteúdo da ônus',
            'Preenchendo campos automaticamente',
            'Tudo certo! Siga com o cadastro :)'
        ]
    });

    const handleSwitchOnus = (value: boolean) => {
        setCollapseOnusFile(value)
        if (!value) {
            setTimeout(() => {
                setSwitchOnus(value);
            }, 500)
        } else {
            setSwitchOnus(value);
        }
    };

    const handleCodImovel = async (value: string) => {
        if (value.length === 0 || value.length === null) {
            setCollapseAdress(false);
            clearErrors('codImovel');
            setTimeout(() => {
                setImovelMidas(undefined);
                setLoading(false);
            }, 500);
        }
        else if (value.length > 5) {
            setLoading(true);
            let data = await getImovelBancoMidas(value) as any;

            if (data) {
                setCollapseAdress(true)
                clearErrors('codImovel');
                setImovelMidas(data);
                // const res = await getImageToCod({ cod: value });
                // console.log(res);        
                // if(res.urls?.[0]) setUrlImage(res.urls[0]);       
                
            }
            else {
                setError('codImovel', { type: 'custom', message: "Código inválido" });
            }
            setLoading(false);
        }
    };

    const validNumber = (tel: string) => {
        return tel.split('')[0] === '0' ? tel.substring(1) : tel
    };

    async function handleClick() {
        const resMidas = imovelMidas
        let count = 1;
        const opcionistas = [];

        if (resMidas?.nome_proprietario) {
            const vendedor = dataToSave.vendedor?.find((e) => e.nome?.split(' ')[0].toLowerCase() == resMidas.nome_proprietario.split(' ')[0].toLowerCase()) 
                || vendedorEmpty as ProprietarioDataType;
            const index = dataToSave.vendedor?.indexOf(vendedor);
            console.log(vendedor);

            vendedor.nome = vendedor.nome  || resMidas.nome_proprietario;
            
            if(index && dataToSave.vendedor?.[index]) dataToSave.vendedor[index] = vendedor;
            else dataToSave.vendedor?.push(vendedor);
        }

        for (let prop in resMidas) {
            if (prop.includes('nome_opcionista') && resMidas[prop as 'nome_opcionista1'] !== "") {
                const keyId = 'opcionista' + count as 'opcionista1'; //PODE TER MAIS DE 1 
                const keyPercent = 'percentual_opcao' + count as 'percentual_opcao1';
                opcionistas.push({
                    id: resMidas[keyId],
                    nome: resMidas[prop as 'nome_opcionista1'],
                    percentual: resMidas[keyPercent]
                });
                count++;
            }
        }

        let imovel = {
            ...resMidas,
            opcionistas,
            ...dataToSave,
        };

        imovel.usuario_id = localStorage.getItem('usuario_id') || '';

        console.log(imovel);

        await Axios.post(links.laravel + 'salvar_dados_midas', imovel, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(async (res) => {
            if (res !== undefined) {
                if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
                    //localStorage.clear();
                } else {
                    setProcessoId(res.data.processo_id);
                    if (fileToSave) {
                        const docToSave = {
                            file: fileToSave,
                            item: [{
                                value: 1
                            }]
                        }
                        
                        await SaveDocument(
                            res.data.processo_id,
                            docToSave,
                            res.data.imovel.id,
                            'imovel',
                            0,
                            setProgressBar,
                            progressBar,
                        );
                    }

                    router.push({
                        pathname: (`/vendas/gerar-venda/${res.data.processo_id}/dashboard`),
                    })
                }
            }
        });
    };

    // INICIO BLOCO DE CODIGO DO GPT e OCR AZURE
    const handleFile = async (file: File | undefined) => {
        if (!file) {
            setFileToSave(undefined);
            setDataToSave(inicialData);
            return;
        }
        setLoading(true);
        setFileToSave(file);
        setProgress(1);
        setFeedbacksLoading({ ...feedbacksLoading, index: 0 });

        const ocr = await analyzeDocument(file);
        setProgress(40);
        setFeedbacksLoading({ ...feedbacksLoading, index: 3 })

        if (ocr) {
            const completion = await openAI_API({ prompt: promptOnusReais, ocr });

            if (completion?.choices[0]?.message?.content) {
                setProgress(70);
                setFeedbacksLoading({ ...feedbacksLoading, index: 4 })
                const jsonResult = JSON?.parse(completion?.choices[0]?.message?.content);
                const vendedoresCompletions = await openAI_API({ prompt: promptVendedores, ocr: jsonResult.ultimo_registro });
                const jsonResultVendedores = JSON?.parse(vendedoresCompletions?.choices[0]?.message?.content || '{}');
                jsonResult.dados = jsonResultVendedores.dados;
                dataGen(jsonResult);

                console.log("return ONUS: ", jsonResult);
                console.log("return VENDEDOR: ", jsonResultVendedores);
            }
            setProgress(100);
            setFeedbacksLoading({ ...feedbacksLoading, index: 5 })
        }
        setLoading(false);
    };

    // Função para gerar os dados uteis ao sistema
    function dataGen(jsonGPT: jsonFormatType) {
        if (!jsonGPT.rgi) return '';

        dataToSave.matricula = jsonGPT.matricula_imovel;

        jsonGPT.foreiro = jsonGPT.foreiro?.toLowerCase();
        if (jsonGPT.imovel_com_laudemio && jsonGPT.foreiro) {
            if (jsonGPT.foreiro.includes('união') || jsonGPT.foreiro.includes('unido') || jsonGPT.foreiro.includes('uniao')) {
                dataToSave.laudemios.push({ tipo_laudemio: '1', valor_laudemio: '' })
            }
            if (jsonGPT.foreiro.includes('municipio')) {
                dataToSave.laudemios.push({ tipo_laudemio: '2', valor_laudemio: '' })
            }
            if (jsonGPT.foreiro.includes('familia') || jsonGPT.foreiro.includes('famílias') || jsonGPT.foreiro.includes('familias')) {
                if (jsonGPT.foreiro.includes('burle') || jsonGPT.foreiro.includes('figueredo')) {
                    dataToSave.laudemios.push({ tipo_laudemio: '3', valor_laudemio: 1 })
                }
                if (jsonGPT.foreiro.includes('silva') || jsonGPT.foreiro.includes('porto')) {
                    dataToSave.laudemios.push({ tipo_laudemio: '3', valor_laudemio: 2 })
                }
                if (jsonGPT.foreiro.includes('moçapyr') || jsonGPT.foreiro.includes('apyr')) {
                    dataToSave.laudemios.push({ tipo_laudemio: '3', valor_laudemio: 3 })
                }
                if (jsonGPT.foreiro.includes('ely') || jsonGPT.foreiro.includes('jose') || jsonGPT.foreiro.includes('machado')) {
                    dataToSave.laudemios.push({ tipo_laudemio: '3', valor_laudemio: 4 })
                }
                if (jsonGPT.foreiro.includes('koening') || jsonGPT.foreiro.includes('koenig') || jsonGPT.foreiro.includes('kornig')) {
                    dataToSave.laudemios.push({ tipo_laudemio: '3', valor_laudemio: 5 })
                }
                if (jsonGPT.foreiro.includes('orleans') || jsonGPT.foreiro.includes('bragança')) {
                    dataToSave.laudemios.push({ tipo_laudemio: '3', valor_laudemio: 6 })
                }
                if (jsonGPT.foreiro.includes('regis') || jsonGPT.foreiro.includes('oliveira')) {
                    dataToSave.laudemios.push({ tipo_laudemio: '3', valor_laudemio: 7 })
                }
            }
            if (jsonGPT.foreiro.includes('mosteiro') || jsonGPT.foreiro.includes('irmandade') || jsonGPT.foreiro.includes('hospital')) {
                if (jsonGPT.foreiro.includes('mosteiro') || jsonGPT.foreiro.includes('bento')) {
                    dataToSave.laudemios.push({ tipo_laudemio: '4', valor_laudemio: 8 })
                }
                if (jsonGPT.foreiro.includes('irmandade') || jsonGPT.foreiro.includes('santíssimo') || jsonGPT.foreiro.includes('sacramento') || jsonGPT.foreiro.includes('candelária')) {
                    dataToSave.laudemios.push({ tipo_laudemio: '4', valor_laudemio: 9 })
                }
                if (jsonGPT.foreiro.includes('hospital') || jsonGPT.foreiro.includes('lazáros')) {
                    dataToSave.laudemios.push({ tipo_laudemio: '4', valor_laudemio: 10 })
                }
            }
        }

        // FILTRO PARA SEPARAR PESSOA JURIDICA
        dataToSave.vendedor = jsonGPT.dados?.filter(f => validarCPF(f.cpf) && !f.pessoa_juridica)?.map(e => ({
            ...e,
            cpf: e.cpf.length > 14 ? '' : e.cpf,
            tipo_usuario: e.pessoa_juridica ? 1 : 0,
        }));
        setDataToSave({ ...dataToSave });

        console.log('dataToSave: ', dataToSave);
    };

    const retornIdEstadoCivil = (value: string) => {
        if (value.includes('Casado')) return '1'
        else if (value.includes('Solteiro')) return '2'
        else if (value.includes('Divorciado')) return '3'
        else if (value.includes('Viúvo')) return '4'
        else return ''
    };

    // Função para extrair arquivos zipados a partir de um objeto File
    const extractZip = async (file: ArrayBuffer) => {
        const blob = new Blob([file], { type: 'application/zip' });
        const zipFile = new File([blob], 'zipfile.zip', { type: blob.type, lastModified: Date.now() });
        const zip = await JSZip.loadAsync(zipFile);
        const files: { [key: string]: JSZip.JSZipObject } = zip.files;
        const images: { name: string, data: ArrayBuffer }[] = [];

        for (const filename in files) {
            if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
                const fileData = await files[filename].async('arraybuffer');
                images.push({ name: filename, data: fileData });
            }
        }

        return images;
    };

    // Função para ler cada pagina dentro de um zip de imagens
    const findLargestImageInZip = async (file: Uint8Array): Promise<string | null> => {
        const images = await extractZip(file);
        const worker = await createWorker();
        let textAllPages = ''
        let count = 1;
        for (const image of images) {
            console.log(`LENDO PAGINA ${count}`)
            const imgFile = new File([image.data], image.name, { type: 'image/jpeg' });
            const { data: { text } } = await worker.recognize(imgFile);
            console.log(`Text Page ${count}: `, text);
            textAllPages = textAllPages + text;
            count += 1
        }
        return textAllPages
    };

    // FIM BLOCO DE CODIGO DO GPT 

    return (
        <>
            <HeadSeo titlePage={title} description='Alguma coisa aqui' />
            <div className="container-intro midas-intro">
                <div className="back-butn-desk" >
                    <ButtonBack />
                </div>
                <div className="row">
                    <div className="coll">
                        <h1 className="bold">{title}</h1>

                        <div className="comp-cod-imovel">
                            <InputText
                                label="Insira o código do MIDAS"
                                placeholder='Ex: NIAP1234'
                                autoComplete="off"
                                error={!!errors.codImovel}
                                msgError={errors.codImovel}
                                sucess={imovelMidas ? true : false}

                                {...register("codImovel", {
                                    required: "Campo obrigatório",
                                    onChange: (e) => handleCodImovel(e.target.value)
                                })}
                            />
                        </div>
                        <Collapse in={collapseAdress}>
                            {imovelMidas &&
                                <div className='info-imovel'>
                                    <div className='col-icon'>
                                        <FmdGoodIcon className="icon" />
                                    </div>
                                    <div className='col-info'>
                                        <p className='bairro'>
                                            {imovelMidas.bairro_comercial + ' - ' + imovelMidas.municipio}
                                        </p>
                                        <p>
                                            {imovelMidas.tipo_logradouro + ' ' + imovelMidas.nome_logradouro} {imovelMidas.numero ? ', ' + imovelMidas.numero : ''} {imovelMidas.unidade ? ' - ' + imovelMidas.unidade : ''}
                                        </p>
                                    </div>
                                </div>
                            }
                        </Collapse>


                        <div className='row-line'></div>

                        <div className='onus-container'>
                            <p className='title-onus'>
                                Está com a Ônus Reais do imóvel aí?
                            </p>
                            <p className='subtitle-onus'>
                                Com o Upload da Ônus, nossa IA escaneia o documento e preenche automaticamente campos críticos do cadastro.
                            </p>
                            <Collapse in={!collapseOnusFile}>
                                <p className='list-onus'>
                                    <CheckIcon />Poupa seu tempo para que você venda ainda mais.
                                </p>
                                <p className='list-onus'>
                                    <CheckIcon />Garante uma entrega ainda mais completa.
                                </p>
                                <p className='list-onus'>
                                    <CheckIcon />Diminui suas chances de ter uma venda devolvida.
                                </p>
                            </Collapse>
                            <SwitchWithLabel label={'Quero usar a Ônus Reais para acelerar o cadastro.'} check={collapseOnusFile} setCheck={handleSwitchOnus} />
                        </div>

                        <Collapse in={collapseOnusFile} orientation="horizontal" className='file-collapse'>
                            {switchOnus &&
                                <InputFileSingle handleFile={handleFile} variant={'outlined'} width={228} />
                            }
                        </Collapse>

                    </div>

                    <div className="coll map">
                        <div className="g-map">
                            <Mapa url={urlImage} />
                        </div>
                    </div>
                </div>
            </div>
            <footer className='footer loading'>
                {progress > 0 && <LinearProgress className='footer-line' variant="determinate" value={progress} />}

                <div className='feedback'>
                    {feedbacksLoading.index >= 0 &&
                        <SwipeableViews
                            axis={'y'}
                            index={feedbacksLoading.index}
                            className='swipe-container'
                        >
                            {feedbacksLoading.msg.map((e, index) => (
                                <div key={index}>
                                    {<p>{e}</p>}
                                </div>
                            ))}
                        </SwipeableViews>
                    }
                </div>

                <ButtonComponent
                    disabled={loading}
                    size={'large'}
                    variant={'contained'}
                    label={'Seguir com o cadastro'}
                    labelColor='white'
                    onClick={handleClick}
                    endIcon={loading ? <CircularProgress size={20} /> : <ArrowRightIcon width={20} fill='white' />}
                />

            </footer>
        </>
    )
}