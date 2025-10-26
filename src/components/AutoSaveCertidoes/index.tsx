import getDebitosTrabalhistas from '@/apis/apiDebitosTrabalhistas';
import getEfiteutica from '@/apis/apiEfiteutica';
import getFunesbom from '@/apis/apiFunesbom';
import SaveDocument from '@/apis/saveDocument';
import ImovelData from '@/interfaces/Imovel/imovelData';
import { Tipos } from '@/interfaces/Users/document';
import Pessoa from '@/interfaces/Users/userData';
import { ItemType } from '../FeedbackCertidoes/interface';
import dayjs from 'dayjs';
import SaveDataEmissaoDoc from '@/apis/saveDataEmissaoDocs';

interface Props {
    inscricao: string,
    data: ImovelData,
    funesbom?: boolean,
    efiteutica?: boolean
    progressBar: Progress,
    setProgressBar: (e: Progress) => void
};

interface PropsDividaAtiva {
    userData: Pessoa
    processData: ImovelData
    type: 'vendedor' | 'comprador'
    setCheckItems: (e: ItemType[]) => void
    checkItems: ItemType[]
    progressBar: Progress
    setProgressBar: (e: Progress) => void
}

type Progress = {
    percent: number;
    status: string;
}[]

type ResponseCheckCertidoes = {
    funesbom?: {
        certidao_pdf: string,
        debitos: number
        error?: string
    },
    efiteutica?: {
        certidao_Base64?: string
        response?: string
        error?: string
    }
};

interface Respose {
    status: string // 'sucess' | 'error'
    base64?: string // Base64
    debito?: true | false
    texto?: string
    validade?: string // DD/MM/AAAA
    nome?: string
    error?: string | undefined
}

const selectFunesbom = [
    { value: "", label: "Escolha um Município" },
    { value: "064", label: "Rio de Janeiro" },
    { value: "001", label: "Angra dos Reis" },
    { value: "080", label: "Aperibé" },
    { value: "002", label: "Araruama" },
    { value: "081", label: "Areal" },
    { value: "091", label: "Armação dos Búzios" },
    { value: "065", label: "Arraial do Cabo" },
    { value: "003", label: "Barra do Piraí" },
    { value: "004", label: "Barra Mansa" },
    { value: "072", label: "Belford Roxo" },
    { value: "005", label: "Bom Jardim" },
    { value: "006", label: "Bom Jesus do Itabapoana" },
    { value: "007", label: "Cabo Frio" },
    { value: "008", label: "Cachoeiras de Macacu" },
    { value: "009", label: "Cambuci" },
    { value: "110", label: "Campos dos Goytacazes" },
    { value: "011", label: "Cantagalo" },
    { value: "085", label: "Carapebus" },
    { value: "071", label: "Cardoso Moreira" },
    { value: "012", label: "Carmo" },
    { value: "013", label: "Casimiro de Abreu" },
    { value: "078", label: "Comendador Levy Gasparian" },
    { value: "014", label: "Conceição de Macabu" },
    { value: "015", label: "Cordeiro" },
    { value: "016", label: "Duas Barras" },
    { value: "017", label: "Duque de Caxias" },
    { value: "018", label: "Engenheiro Paulo de Frontin" },
    { value: "073", label: "Guapimirim" },
    { value: "083", label: "Iguaba Grande" },
    { value: "019", label: "Itaboraí" },
    { value: "020", label: "Itaguaí" },
    { value: "066", label: "Italva" },
    { value: "021", label: "Itaocara" },
    { value: "022", label: "Itaperuna" },
    { value: "069", label: "Itatiaia" },
    { value: "077", label: "Japeri" },
    { value: "023", label: "Laje do Muriaé" },
    { value: "124", label: "Macaé" },
    { value: "090", label: "Macuco" },
    { value: "025", label: "Magé" },
    { value: "026", label: "Mangaratiba" },
    { value: "027", label: "Maricá" },
    { value: "028", label: "Mendes" },
    { value: "092", label: "Mesquita" },
    { value: "029", label: "Miguel Pereira" },
    { value: "030", label: "Miracema" },
    { value: "031", label: "Natividade" },
    { value: "032", label: "Nilópolis" },
    { value: "033", label: "Niterói" },
    { value: "034", label: "Nova Friburgo" },
    { value: "035", label: "Nova Iguaçu" },
    { value: "036", label: "Paracambi" },
    { value: "037", label: "Paraíba do Sul" },
    { value: "038", label: "Paraty" },
    { value: "067", label: "Paty do Alferes" },
    { value: "039", label: "Petrópolis" },
    { value: "084", label: "Pinheiral" },
    { value: "040", label: "Piraí" },
    { value: "041", label: "Porciúncula" },
    { value: "087", label: "Porto Real" },
    { value: "075", label: "Quatis" },
    { value: "074", label: "Queimados" },
    { value: "070", label: "Quissamã" },
    { value: "042", label: "Resende" },
    { value: "043", label: "Rio Bonito" },
    { value: "044", label: "Rio Claro" },
    { value: "045", label: "Rio das Flores" },
    { value: "079", label: "Rio das Ostras" },
    { value: "046", label: "Santa Maria Madalena" },
    { value: "047", label: "Santo Antônio de Pádua" },
    { value: "048", label: "São Fidélis" },
    { value: "082", label: "São Francisco de Itabapoana" },
    { value: "149", label: "São Gonçalo" },
    { value: "050", label: "São João da Barra" },
    { value: "051", label: "São João de Meriti" },
    { value: "088", label: "São José de Ubá" },
    { value: "068", label: "São José do Vale do Rio Preto" },
    { value: "052", label: "São Pedro da Aldeia" },
    { value: "053", label: "São Sebastião do Alto" },
    { value: "054", label: "Sapucaia" },
    { value: "055", label: "Saquarema" },
    { value: "086", label: "Seropédica" },
    { value: "056", label: "Silva Jardim" },
    { value: "057", label: "Sumidouro" },
    { value: "089", label: "Tanguá" },
    { value: "058", label: "Teresópolis" },
    { value: "059", label: "Trajano de Moraes" },
    { value: "060", label: "Três Rios" },
    { value: "061", label: "Valença" },
    { value: "076", label: "Varre-Sai" },
    { value: "062", label: "Vassouras" },
    { value: "063", label: "Volta Redonda" }
];

function base64ToFile(base64String: string, filename: string): File {
    // Converte a string Base64 em um buffer
    const buffer = Buffer.from(base64String, 'base64');
    // Cria um Blob a partir do buffer
    const blob = new Blob([buffer], { type: 'application/pdf' });
    // Cria e retorna um objeto File
    return new File([blob], filename, { type: 'application/pdf' });
};

const CheckEfiteutica = async (props: Props) => {
    const { inscricao, data, efiteutica, progressBar, setProgressBar } = props;
    const imovelID = data.imovel_id || data.id;

    const municipio = selectFunesbom.find((mun) => mun.label === data.cidade)?.value || '';
    const idEfiteutica = 6; // ID PRODUÇÃO, HOMOLOG E LOCAL tem quer ID 6    
    const efiteuticaDoc = data.imovel?.documentos.find((doc) => doc.tipo_documento_ids.find((tipo: Tipos) => tipo.tipo_documento_id === idEfiteutica));
    let resCheck = {
        efiteutica: {},
    } as ResponseCheckCertidoes;

    const onEfiteutica = async () => {
        // BAIXANDO EFITEUTICA
        const resE = await getEfiteutica({ inscricao });
        console.log(resE);
        if (!!resE?.code) {
            console.log(resE?.code);
            // onEfiteutica();
            // if( resE.response?.name === 'TimeoutError') {
            // }
            resCheck = { ...resCheck, efiteutica: { error: resE?.code } };
        }
        else resCheck = { ...resCheck, efiteutica: resE }
        if (!!resE?.certidao_Base64) {
            const pdfFile = base64ToFile(resE.certidao_Base64, 'Certidão de Situação Fiscal e Enfitêutica - Certidao automática.pdf');
            // const fileURL = URL.createObjectURL(pdfFile);
            // window.open(fileURL);

            const resSaveDoc = await SaveDocument(data.processo_id, { file: pdfFile, item: [{ value: idEfiteutica, id: '' }] }, imovelID, 'imovel', 0, setProgressBar, progressBar) as any;
            if (resSaveDoc?.id_documento) {
                const doc = resSaveDoc.id_documento;
                data.imovel?.documentos.push({
                    active: 1,
                    arquivo: doc.arquivo,
                    created_at: doc.created_at,
                    id: doc.id,
                    identifica_documento: 'imovel',
                    identifica_documento_id: doc.identifica_documento_id,
                    nome_original: doc.nome_original,
                    processo_id: doc.processo_id,
                    tipo_documento: null,
                    tipo_documento_id: null,
                    tipo_documento_ids: [{
                        data_emissao: null,
                        data_vencimento: null,
                        documento_id: doc.id,
                        id: resSaveDoc.ids_tipos_doc[0],
                        nome_tipo: "Certidão de Situação Fiscal e Enfitêutica do Imóvel",
                        processo_id: doc.processo_id,
                        tipo_documento_id: 6,
                        validade_dias: null
                    }]
                });
            }
        }
    };

    if (municipio && inscricao.length >= 7) {
        // CHAMA AS FUNÇÕES ACIMA SIMULTANEAMENTE

        if (efiteutica && !efiteuticaDoc) {
            // BAIXANDO EFITEUTICA
            await onEfiteutica();
        }
    };
    return resCheck;
};

const CheckFunesbom = async (props: Props) => {
    const { inscricao, data, funesbom, progressBar, setProgressBar } = props;
    const imovelID = data.imovel_id || data.id;
    const municipio = selectFunesbom.find((mun) => mun.label === data.cidade)?.value || '';
    const funesbomDoc = data.imovel?.documentos.find((doc) => doc.tipo_documento_ids.find((tipo: Tipos) => tipo.tipo_documento_id === 11));

    let resCheck = {
        funesbom: {},
    } as ResponseCheckCertidoes;

    const onFunesbom = async () => {
        const res = await getFunesbom({ inscricao, municipio }) as any;
        resCheck = { ...resCheck, funesbom: res };
        console.log('Funesbom: ', res);


        if (!!res?.certidao_pdf) {
            // Criar um objeto File a partir do base64String
            const pdfFile = base64ToFile(res?.certidao_pdf, 'Funesbom - Certidao automática.pdf');

            const resSaveDoc = await SaveDocument(data.processo_id, { file: pdfFile, item: [{ value: 11, id: '' }] }, imovelID, 'imovel', 0, setProgressBar, progressBar) as any;
            if (resSaveDoc?.id_documento) {
                const doc = resSaveDoc.id_documento;
                data.imovel?.documentos.push({
                    active: 1,
                    arquivo: doc.arquivo,
                    created_at: doc.created_at,
                    id: doc.id,
                    identifica_documento: 'imovel',
                    identifica_documento_id: doc.identifica_documento_id,
                    nome_original: doc.nome_original,
                    processo_id: doc.processo_id,
                    tipo_documento: null,
                    tipo_documento_id: null,
                    tipo_documento_ids: [{
                        data_emissao: null,
                        data_vencimento: null,
                        documento_id: doc.id,
                        id: resSaveDoc.ids_tipos_doc[0],
                        nome_tipo: "Certidão de quitação do FUNESBOM",
                        processo_id: doc.processo_id,
                        tipo_documento_id: 11,
                        validade_dias: null
                    }]
                });
            }
        };
        return resCheck;
    };

    if (municipio && inscricao.length >= 7) {
        if (funesbom && !funesbomDoc) {
            // BAIXANDO FUNESBOM          
            resCheck = await onFunesbom();
        }
    };
    return resCheck;
};

const CheckDebitoTrabalista = async (props: PropsDividaAtiva) => {
    const { userData, processData, type, setCheckItems, checkItems, progressBar, setProgressBar } = props;
    if(!userData?.cpf_cnpj) return;
    const cpf = userData.cpf_cnpj.length < 15 ? userData.cpf_cnpj : '';
    const cnpj = userData.cpf_cnpj.length > 14 ? userData.cpf_cnpj : '';
    const pessoaId = userData.usuario_id || userData.id;
    const certidaoID = 50;
    const certidao = userData.documentos?.data.find((doc) => doc.tipo_documento_ids.find((tipo) => tipo.tipo_documento_id === certidaoID));
    const dateNow = dayjs().format('DD/MM/YYYY');

    if (!certidao) {
        checkItems.push({ loading: true, label: 'Consultando débitos trabalhistas...', doc: 'debitos_trabalhistas' });
        setCheckItems(checkItems);

        const res = await getDebitosTrabalhistas({ cpf, cnpj });
        console.log('Débitos Trabalhistas: ', res);
        if (!!res?.base64) {
            // Criar um objeto File a partir do base64String
            const pdfFile = base64ToFile(res?.base64, 'Débitos trabalhistas - Certidao automática.pdf');

            const resSaveDoc = await SaveDocument(processData.processo_id, { file: pdfFile, item: [{ value: certidaoID, id: '' }] }, pessoaId, type, 0, setProgressBar, progressBar) as any;
            if (resSaveDoc?.id_documento) {
                const doc = resSaveDoc.id_documento;
                if (userData.documentos) {
                    userData.documentos.data.push({
                        active: 1,
                        arquivo: doc.arquivo,
                        created_at: doc.created_at,
                        id: doc.id,
                        identifica_documento: type,
                        identifica_documento_id: doc.identifica_documento_id,
                        nome_original: doc.nome_original,
                        processo_id: doc.processo_id,
                        tipo_documento: null,
                        tipo_documento_id: null,
                        tipo_documento_ids: [{
                            data_emissao: dateNow,
                            data_vencimento: res.validade || '',
                            documento_id: doc.id,
                            id: resSaveDoc.ids_tipos_doc[0],
                            nome_tipo: "Certidão negativa de débitos trabalhistas",
                            processo_id: doc.processo_id,
                            tipo_documento_id: certidaoID,
                            validade_dias: '180'
                        }]
                    });
                    console.log(userData.documentos);
                }
                await SaveDataEmissaoDoc({
                    data_emissao: dateNow,
                    validade_dias: '180',
                    data_vencimento: res.validade || '',
                    multiplo_documento_id: resSaveDoc.ids_tipos_doc[0],
                })
            }
            checkItems.forEach((item) => {
                if (item.doc === 'debitos_trabalhistas') {
                    item.loading = false;
                    item.label = 'Débitos Trabalhistas: Certidão salva com sucesso';
                }
            });
            setCheckItems(checkItems);
        } else {
            checkItems.forEach((item) => {
                if (item.doc === 'debitos_trabalhistas') {
                    item.loading = false;
                    item.label = 'Débitos Trabalhistas: Certidão não encontrada';
                    item.error = true;
                }
            });
            setCheckItems(checkItems);
        }
    }

};

export { CheckFunesbom, CheckEfiteutica, CheckDebitoTrabalista };


