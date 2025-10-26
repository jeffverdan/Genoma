import axiosInstance from '../http/axiosInterceptorInstance';

// TIPOS
// comprovante_transferencia_comissao

const ShowDocument = async (id?: number | string, tipo?: string, onlyFile?: boolean): Promise<File | undefined> => {
    if (!id || !tipo) {
        console.log('ERRO - ID OU TIPO NÃO INFORMADO');
        return undefined
    };

    let data

    await axiosInstance.post('exibir_arquivo', {
        id,
        tipo
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob',
    })
        .then(res => {
            if (res) {
                console.log(res);
                let type_arquivo = res.data.type;
                if (type_arquivo !== 'text/html') {
                    const file = new Blob(
                        [res.data],
                        { type: type_arquivo }
                    );
                    console.log(file);
                    if (onlyFile) {
                        const fileName = 'recibo.pdf';
                        const lastModified = new Date();
                        // Converte o blob para File
                        const fileReal = new File([file], fileName, {
                            type: file.type,
                            lastModified: lastModified.getTime()
                        });
                        data = fileReal;
                        return
                    }

                    if (type_arquivo === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || type_arquivo === 'application/msword') {
                        let finalTypeArquivo = 'docx';
                        if (type_arquivo === 'application/msword') {
                            finalTypeArquivo = 'doc';
                        }
                        let url = window.URL.createObjectURL(file);
                        let a = document.createElement("a");
                        a.href = url;
                        a.download = "arquivo_DNA." + finalTypeArquivo;
                        a.click();
                    } else {
                        const fileURL = URL.createObjectURL(file);
                        window.open(fileURL);
                    }
                } else {
                    console.log("não teve retorno satisfatorio");
                }
            }
        });

    return data;
}

export default ShowDocument;