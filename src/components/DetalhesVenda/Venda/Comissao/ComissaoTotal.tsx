import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import Pessoa from '@/interfaces/Users/userData';
import { Alert, Chip } from '@mui/material';

interface Props {
    imovelData: imovelDataInterface
};

const ComissaoTotal = ({ imovelData }: Props) => {

    console.log(imovelData.comissao);

    return (
        <div className='detalhes-content'>
            <h2>Comissão total e líquida</h2>
            <div className='flex gap16'>
                {imovelData.comissao?.tipo && <Chip className='chip green' label={imovelData.comissao?.tipo} />}

                {imovelData.comissao?.comissao === 'partes' && <Chip className='chip neutral' label={imovelData.comissao?.parcelas_empresa?.length + "X"} />}
            </div>

            <div className='grid coll4'>
                <div className='sub-container'>
                    <p>Comissão total</p>
                    <span className='content'>{imovelData.comissao?.valor_comissao_total || '---'}</span>
                </div>

                <div className='sub-container'>
                    <p>Deduções</p>
                    <span className='content'>{imovelData.comissao?.deducao || 'R$ 0,00'}</span>
                </div>

                <div className='sub-container'>
                    <p>Comissão líquida</p>
                    <span className='content'>{imovelData.comissao?.valor_comissao_liquida || '---'}</span>
                </div>

                <div className='empty'>
                </div>

                <div className='sub-container'>
                    <p>Forma de pagamento</p>
                    <span className='content'>{imovelData.comissao?.forma_pagamento || '---'}</span>
                </div>

                <div className='empty'>
                </div>
                <div className='empty'>
                </div>
                <div className='empty'>
                </div>


                <div className='sub-container'>
                    <p>Tipo</p>
                    <span className='content'>{imovelData.comissao?.tipo || '---'}</span>
                </div>

                {imovelData.comissao?.comissao === 'partes'
                    ? <div className='sub-container'>
                        <p>Nº de Parcelas</p>
                        <span className='content'>{imovelData.comissao?.parcelas_empresa?.length || '---'}</span>
                    </div>
                    : <div className='empty'></div>
                }


                <div className='empty'>
                </div>
                <div className='empty'>
                </div>


                <div>Parcela</div>
                <div>Valor</div>
                <div>Período do pagamento</div>
                <div>Previsão</div>

                {imovelData.comissao?.parcelas_empresa?.map((parcela, index) => (
                    <>
                        <span className='content'>{(imovelData.comissao?.comissao === 'partes' ? index + 1 : "Única") || '---'}</span>
                        <span className='content'>{parcela.valor_parcela || imovelData.comissao?.valor_comissao_liquida}</span>
                        <span className='content'>{parcela.nome_periodo}</span>
                        <span className='content'>{parcela.data_comissao}</span>
                    </>
                )) || '---'}
            </div>
        </div>
    )
};

export default ComissaoTotal;