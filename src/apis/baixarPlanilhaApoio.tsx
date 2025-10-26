import axiosInstance from '../http/axiosInterceptorInstance';

export default async function baixarPlanilhaApoio(documento_id: string | null | number, name: string) {
    let data;
    if (!documento_id) return data;

    await axiosInstance.post('exibir_planilha', {
        documento_id,
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob',
    })
        .then(res => {
            if (res !== undefined) {
                if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
                    localStorage.clear();
                } else if (res) {
                    console.log(res);

                    const type_arquivo = res.data.type;
                    const file = new Blob(
                        [res.data],
                        { type: type_arquivo, },

                    );
                    
                    const fileURL = URL.createObjectURL(file);                    
                    let a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style.display = "none";
                    a.href = fileURL;
                    a.download = 'Planilha - ' + name + '.pdf';
                    a.click();
                    window.URL.revokeObjectURL(fileURL);
                    a.remove();

                    return;

                }
            }
        })

    return data || [];
}