import getEnvelopeDetails from '@/apis/getEnvelopeDetails';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { EnvelopeDocusign } from '@/interfaces/Vendas/EnvelopeDocusign';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { HiDotsCircleHorizontal } from 'react-icons/hi';
import { HiCheckCircle } from 'react-icons/hi2';

interface Props {
    imovelData: imovelDataInterface
}

const WaitingDocusign = ({ imovelData }: Props) => {
    const [envelope, setEnvelope] = useState<undefined | EnvelopeDocusign>();
    const [loading, setLoading] = useState(false);

    const getEnvelope = async () => {
        setLoading(true);

        const res = await getEnvelopeDetails(imovelData.envelope_id) as unknown as EnvelopeDocusign;
        setEnvelope(res);

        setLoading(false);
    };

    useEffect(() => {
        getEnvelope();

        const intervalId = setInterval(async () => {
            const res = await getEnvelopeDetails(imovelData.envelope_id) as unknown as EnvelopeDocusign;
            setEnvelope(res);
        }, 60000); // 1 minuto = 60000 milissegundos

        return () => {
            clearInterval(intervalId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className='detalhes-content'>
            <h2>Assinaturas feitas pelo DocuSign</h2>

            {loading ? <div className='loading'><CircularProgress className='neutral' /></div> :
                <div className='signs-content'>
                    <ul className="steps">
                        <li className="step">
                            <HiCheckCircle className="green" size={32} />
                            <div>
                                <span className='bold'>{`${envelope?.data_envio_format}, ${envelope?.hora_envio} `}</span>
                                - E-mails com o recibo de sinal, foram disparados para os envolvidos.
                            </div>
                        </li>
                        <div className='step-line'>
                            <li className="line"></li>
                        </div>
                        {envelope?.quantidade_nao_assinantes && envelope?.quantidade_nao_assinantes > 0 &&
                            <li className="step">
                                <div className='dot-container'>
                                    <div className="dot-typing"></div>
                                </div>
                                <span>Os envolvidos estão em processo de revisão e assinatura.</span>
                            </li>
                        }
                        <div className='card'>
                            {envelope?.assinados.map((e, index) => (
                                <li className="step" key={index}>
                                    <HiCheckCircle className="green" size={32} />
                                    <div>
                                        <span className='bold'>{`${e.data_envio_format}, ${e.hora_envio} - ${e.nome} `}</span>
                                        assinou o recibo!
                                    </div>
                                </li>
                            ))}

                            {envelope?.nao_assinados.map((e, index) => (
                                <li className="step" key={index}>
                                    <div className='dot-container'>
                                        <div className="dot-typing"></div>
                                    </div>
                                    <div>
                                        <span className='bold'>{`${e.data_envio_format}, ${e.hora_envio} - ${e.nome} `}</span>
                                        ainda não assinou o recibo!
                                    </div>
                                </li>
                            ))}
                        </div>

                    </ul>
                </div>
            }

        </div>
    )
};

export default WaitingDocusign;