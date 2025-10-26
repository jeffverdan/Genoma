import SaveOCR from "@/apis/postSaveOCR";
import { promptRecibo } from "./prompts";
import openAI_API from "./openAI_API";
import { jsonFormatType } from "@/interfaces/OpenAI";
import { arrayEscritura } from "../Listas";
import imovelDataInterface from '@/interfaces/Imovel/imovelData'
import analyzeDocument from "@/apis/Azure/DocumentsRead";

interface PropsType {
    file: File
    setProgress: (e: number) => void
    imovelData: imovelDataInterface
}

let data: jsonFormatType

export default async function reciboAIExtract({ file, setProgress, imovelData }: PropsType) {
    const processo_id = imovelData?.processo_id;
    const nome = imovelData?.informacao?.recibo || '';
    console.log(file);
    // setFeedbacksLoading({ ...feedbacksLoading, index: 0 })
    setProgress(35);
    console.log("EFETUANDO OCR DAS PAGINAS PELO AZURE");
    const ocr = await analyzeDocument(file);

    console.log("INCIANDO LEITURA PELA OpenAI");
    
    // SALVANDO OCR NO BANCO
    if (processo_id) SaveOCR({
        ocr: ocr,
        tipo: 'recibo',
        processo_id,
        nome,
    });
    
    setProgress(65);
    const completion = await openAI_API({ prompt: promptRecibo, ocr: ocr });
    console.log("LEITURA FINALIZADA, GERANDO JSON");                
    
    if (completion && completion?.choices[0]?.message?.content) {
        const jsonResult = JSON?.parse(completion?.choices[0]?.message?.content) as jsonFormatType;
        console.log(completion.choices[0]);
        setProgress(70);
        data = dataGen(jsonResult);
        console.log("JSON FORMAT: ", data);
    };

    return data;

    // Função para gerar os dados uteis ao sistema
    function dataGen(jsonGPT: jsonFormatType) {
        jsonGPT.tipo_escritura = arrayEscritura.find(e => e.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(jsonGPT.tipo_escritura.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')))?.name || jsonGPT.tipo_escritura;                
        return jsonGPT;
    };    
}