import InputText from "@/components/InputText/Index";
import { BlockProps, FormValues } from "@/interfaces/IA_Recibo/index";
import UploadDocumentos from '@/components/UploadDocumentos'
import { MultiDocsType } from '@/components/UploadDocumentos/Interfaces';
import { useEffect, useState } from "react";
import GetListaDocumentos from "@/apis/getListaDocumentos";


export default function Documentos({ index, data, type, userData, setUserData, register, errors, watch, setValue, clearErrors }: BlockProps) {
    const [multiDocs, setMultiDocs] = useState<MultiDocsType[]>([]);
    const [listaDocumentosPessoa, setListaDocumentosPessoa] = useState([]);

    const context = {
        dataProcesso: data,
        idProcesso: data?.id || '',
        multiDocs,
        setMultiDocs
    };

    const getList = async () => {
        const documentos: any = await GetListaDocumentos();
        const tipo = (userData.tipo_pessoa === 0 || userData?.vinculo_empresa?.id)
            ? 'fisica'
            : 'juridica';

        const documentosUsuario = documentos?.filter((documento: any) => documento?.tipo.includes(tipo));
        setListaDocumentosPessoa(documentosUsuario);
    };

    useEffect(() => {
        getList();
    }, [])

    return (
        <div className="form-container">
            <div className="title">
                <h3>Insira documentos pessoais de quem {type?.replace('dores', '')}.</h3>
                <p>Realize Upload dos arquivos no formato .doc, .docx ou .pdf.</p>
            </div>

            <UploadDocumentos
                register={register}
                errors={errors}
                context={context}
                pessoa={type || 'imovel'}
                idDonoDocumento={userData?.id.toString() || ''}
                option={listaDocumentosPessoa}
                userData={userData}
            />

        </div>
    )
}