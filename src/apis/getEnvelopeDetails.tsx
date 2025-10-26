// import Axios from 'axios';
import { pessoasType } from '@/interfaces/Vendas/EnvelopeDocusign';
import axiosInstance from '../http/axiosInterceptorInstance';

async function getEnvelopeDetails(envelopeId?: string) {
    if (!envelopeId) return '';

    function formatData(sentDateTime: string) {
        const dataHoraSent = new Date(sentDateTime);
        const dia = String(dataHoraSent.getDate()).padStart(2, '0');
        const mes = String(dataHoraSent.getMonth() + 1).padStart(2, '0'); // Os meses são baseados em zero
        const ano = dataHoraSent.getFullYear();
        const dataSentFormat = `${dia}/${mes}/${ano}`;
        return dataSentFormat;
    };

    function formatHora(sentDateTime: string) {
        const dataHoraSent = new Date(sentDateTime);
        const horas = String(dataHoraSent.getUTCHours()).padStart(2, '0');
        const minutos = String(dataHoraSent.getUTCMinutes()).padStart(2, '0');
        // const segundos = String(dataHoraSent.getUTCSeconds()).padStart(2, '0');
        const horaSentFormat = `${horas}h${minutos}`;
        return horaSentFormat
    };

    let data;

    await axiosInstance.get(process.env.NEXT_PUBLIC_SAFEBOX_API + 'getEnvelopeDetails/' + envelopeId, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    })
        .then(res => {
            if (res.data.status && res.data.status === (401 || 498)) {
                localStorage.clear();
            } else {
                data = res.data;

                data.data_envio_format = formatData(data.data_envio);
                data.hora_envio = formatHora(data.data_envio);

                data.nao_assinados.forEach((e: pessoasType) => {
                    e.data_envio_format = formatData(e.data_envio);
                    e.hora_envio = formatHora(e.data_envio);
                });

                data.assinados.forEach((e: pessoasType) => {
                    e.data_envio_format = formatData(e.data_envio);
                    e.hora_envio = formatHora(e.data_envio);
                });
            }
        })
        .catch(function (error) {
            console.log(error);
        })

    return data;
};

export default getEnvelopeDetails;