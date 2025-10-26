import axiosInstance from '../http/axiosInterceptorInstance';

interface PropsType {
    file: any
    processo_id: string | number
    parcela_id: string | number
    usuario_id: string | number
    papel: 'usuario' | 'empresa'
    setProgressBar: (e: ProgressType[]) => void
    progressBar: ProgressType[]
}

interface ResponseType {
    status: string
    documento_id?: number
}

interface ProgressType {
    percent: number
    status: string
    error?: string
  }

async function SaveComprovanteTransferencia(props: PropsType): Promise<ResponseType> {
    const { file, processo_id, parcela_id, usuario_id, papel, progressBar, setProgressBar } = props;
    let data = { status: 'error' };
    let arrayData = new FormData();
    const tipo = papel === 'usuario' ? 'comprovante_transferencia_usuario' : 'comprovante_transferencia_empresa';

    if (file.file) {
        if (typeof (file.file) === 'string' || file.file instanceof String) {
            return {status: 'error'};
        } else {
            arrayData.append(`arquivo`, file.file);
        }

        arrayData.append(`processo_id`, processo_id.toString());
        arrayData.append('parcela_id', parcela_id.toString());
        arrayData.append(`envolvido_id`, usuario_id.toString());
        arrayData.append('tipo', tipo);
    };

    await axiosInstance.post('salvar_comprovante_transferencia', arrayData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0 )) * 100);      
          progressBar[0] = { percent: percentage, status: 'active', error: '' };
          setProgressBar([...progressBar]);
        },        
      }).then(async res => {
            console.log("Result to save: ", res);
            data = res.data

        })
        .catch(err => {
            console.log("Error to save: ", err);
            return {status: 'error'};
        })
    return data;
}

export default SaveComprovanteTransferencia;