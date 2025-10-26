import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Axios from 'axios';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
// import ReactDOM from 'react-dom';
// import { GetServerSideProps } from 'next';
// // import mammoth from 'mammoth';

const PDFView = ({ id }: { id?: number | string }) => {
    // const [documentHTML, setDocumentHTML] = useState<string>('');
    const [fileData, setFileData] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    const ShowDocument = useCallback(async (id?: number | string) => {        
        if (!id) return console.log('ERRO - ID OU TIPO NÃO INFORMADO');

        await Axios.post(process.env.NEXT_PUBLIC_SAFEBOX_API_V1 + 'exibir_arquivo', {
            id,
            tipo: 'recibo'
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            responseType: 'blob',
        })
            .then(async response => {
                if (response.data) {
                    console.log("API exibir_arquivo: ", response.data);
                    // const result = await mammoth.convertToHtml({ arrayBuffer: res.data });
                    // setDocumentHTML(result.value);
                    // const docs = [
                    //     { uri: "https://url-to-my-pdf.pdf" }, // Remote file
                    //     { uri: require(response.data) }, // Local File
                    // ];

                    const blob = response.data;
                    const type = blob.type.includes('word') ? 'docx' : 'pdf';
                    const fileName = `documento-${id}.${type}`; // Nome do arquivo                    
                    const file = new File([blob], fileName, { type: blob.type });

                    setFileData([file]);
                    setLoading(true);
                }
            }).catch((error) => {
                console.error('Erro ao obter o documento:', error);
            })
    }, []);

    let count = 0

    useEffect(() => {
        ShowDocument(id)
        console.log('test');
        // ReactDOM.render(<PDFContainer />, document.getElementById('pdf-read'));
    }, [id, ShowDocument])

    const memoFileData = useMemo(() => {
        return fileData.map((file) => ({
            uri: window.URL.createObjectURL(file),
            fileName: file.name,
        }));
    }, [fileData]);

    console.log(fileData);
    // <div className='doc-view' dangerouslySetInnerHTML={{ __html: documentHTML }} />
    return (
        <div className='doc-viewer'>
            {loading ?
                <DocViewer
                    // documents={fileData.map((file) => ({
                    //     uri: window.URL.createObjectURL(file),
                    //     fileName: file.name,
                    // }))}
                    documents={memoFileData}
                    pluginRenderers={DocViewerRenderers}
                />
                : ''
            }
        </div>
    )

}

export default React.memo(PDFView);