import ShowDocument from '@/apis/getDocument';
import ButtonComponent from '@/components/ButtonComponent';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { HiDownload } from 'react-icons/hi';
import DownloadPlanilha from './DownloadPlanilha';
import { Chip, Link } from "@mui/material";
import baixarPlanilhaApoio from '@/apis/baixarPlanilhaApoio';
import dayjs from 'dayjs';
import { PlanilhasHistoricoType } from '@/interfaces/Imovel/comissao';
import { useEffect, useState } from 'react';

interface Props {
    imovelData: imovelDataInterface
};

const formatarEndereco = (imovel: imovelDataInterface | undefined): string => {
    if (imovel === undefined) return '';
    const { logradouro, numero, unidade, complemento, bairro, cidade, uf } = imovel;
    return `${logradouro}, ${numero},${unidade ? ' ' + unidade + ',' : ''}${complemento ? ' ' + complemento + ',' : ''} ${bairro}, ${cidade} - ${uf}`;
};


const Planilha = ({ imovelData }: Props) => {
    const comissao = imovelData.comissao;
    const [perfil, setPerfil] = useState<string | null>(null);

    useEffect(() => {
        setPerfil(localStorage.getItem('perfil_login'));
    }, []);

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
            console.log('Tipo: ', dateEnvio, dateLimite, dateEnvio.diff(dateLimite));
            return dateEnvio.diff(dateLimite) > 0;
        }
        else return false;
    };

    const returnHidden = (index: number) => {        
        if(perfil !== 'Apoio' && index >= 1) return 'hidden';
        else return '';
    };

    return (
        <div className='detalhes-content'>
            <h2>{perfil === 'Apoio' ? 'Histórico de entregas - planilhas' : 'Planilhas'} de comissão</h2>
            <h3 className='subtitle'>Faça aqui o download da Planilha inserida no sistema.</h3>
            {returnVersao() ? comissao?.parcelas_comissao.sort((a, b) => Number(a.numero_parcela) - Number(b.numero_parcela)).map((parcela, index) =>
                <div className='col' key={parcela.id}>
                    {parcela.planilhas.map((planilha, index) => (
                        <div className={`row parcela-comissao ${returnHidden(index)}`} key={planilha.id}>
                            <Chip className='chip' label={`Parcela ${parcela.numero_parcela}`} />
                            {planilha.created_at ?
                                <>
                                    <p>{dayjs(planilha.created_at).format('DD/MM/YYYY')}</p>
                                    <Link
                                        className='link'
                                        onClick={() => baixarPlanilhaApoio(planilha.id, formatarEndereco(imovelData))}>
                                        {`${dayjs(planilha.created_at).format('DD/MM/YYYY')}_planilha${parcela.numero_parcela || ''}`}
                                    </Link>
                                </>
                                : <p>Apoio está revisando a planilha.</p>
                            }
                        </div>
                    ))}
                </div>
            )
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

                            <ButtonComponent
                                disabled={imovelData.comissao?.verificar_enviar_planilha !== 1}
                                labelColor='white'
                                size={'large'}
                                variant={'contained'}
                                label={'Download planilha de comissão'}
                                startIcon={<HiDownload fill='white' />}
                                onClick={() => DownloadPlanilha(imovelData)}
                            />
                        </>
                        : <p>Apoio está revisando a planilha.</p>
                    }
                </div>
            }
        </div>
    )
};

export default Planilha;