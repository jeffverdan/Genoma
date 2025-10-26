import ButtonComponent from '@/components/ButtonComponent';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { HiDownload } from 'react-icons/hi';
import DownloadMei from './DownloadMei';
import { useState } from 'react';
import { Chip, Link } from "@mui/material";
import dayjs from 'dayjs';

interface Props {
    imovelData: imovelDataInterface
};

const Mei = ({ imovelData }: Props) => {
    const parcelas = imovelData.comissao?.parcelas_comissao;

    const returnVersao = () => {
        const formatDate = (date: string) => {
            const data = date?.split("/");
            const format = data[2] + '-' + data[1] + '-' + data[0];
            return format;
        };

        const parcela = imovelData?.comissao?.parcelas_comissao[0];
        if (parcela?.ultima_data_envio) {
            const dateEnvio = dayjs(formatDate(parcela.ultima_data_envio.split(' ')[0]));
            const dateLimite = dayjs('2025/01/15');
            return dateEnvio.diff(dateLimite) > 0;
        }
        else return false;
    };

    return (
        <div className='detalhes-content'>
            <h2>MEI</h2>
            <h3 className='subtitle'>Faça aqui o download do Recibo de MEI.</h3>

            {returnVersao()
                ? parcelas?.sort((a, b) => Number(a.numero_parcela) - Number(b.numero_parcela)).map((parcela, index) => (
                    <div className='row' key={parcela.id}>
                        <Chip className='chip' label={`Parcela ${parcela.numero_parcela}`} />
                        {parcela.ultima_data_envio ?
                            <>
                                <p>{parcela.ultima_data_envio}</p>
                                <DownloadMei imovelData={imovelData} parcela={parcela} />
                            </>
                            : <p>Apoio está revisando a planilha.</p>
                        }
                    </div>
                ))

                :
                <div className='row'>
                    {imovelData?.comissao?.parcelas_comissao?.[0]?.ultima_data_envio ?
                        <>
                            <div className='col'>
                                <div className='sub-container'>
                                    <p>Data atualização</p>
                                    <span className='content'>{imovelData.comissao?.data_atualizacao}</span>
                                </div>
                            </div>
                            <DownloadMei imovelData={imovelData} />

                        </>
                        : <p>Apoio está revisando a planilha.</p>
                    }
                </div>
            }



        </div>
    )
};

export default Mei;