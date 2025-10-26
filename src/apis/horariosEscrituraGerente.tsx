import axiosInstance from '../http/axiosInterceptorInstance';

type ResponseAPI = {
    hora_permisao_real: HorariosType[],
    horarios_agendados: []
};

type HorariosType = { hora: string, permisao: 1 | 0 }

async function horariosEscrituraGerente(usuario_id?: Number, data?: string): Promise<HorariosType[] | []> {
    if(!usuario_id || !data) return [];
    let retorno: HorariosType[] | [] = [];
    // const error = 'Erro ao retornar listas';
    await axiosInstance.get('listagem_horario', {
        params: {
            usuario_id,
            data
        },
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }).then((res: {data: ResponseAPI}) => {
        retorno = res.data.hora_permisao_real;
        // console.log("Laudemios List ",data);
    })
        .catch(err => {
            console.log(err);
        })
    return retorno;
}

export default horariosEscrituraGerente;