import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import Pessoa from '@/interfaces/Users/userData';
import { Alert, Chip } from '@mui/material';

interface Props {
    imovelData: imovelDataInterface
};


const Responsaveis = ({ imovelData }: Props) => {

    return (
        <div className='detalhes-content'>
            <h2>Vendedores responsáveis pela comissão</h2>
        
            {imovelData.comissao?.vendedor_responsavel_pagamento?.map((parcela) => (
                <>
                    <div>
                        <Chip className='chip green' label={imovelData.comissao?.tipo} />
                    </div>

                    <div className='row' key={parcela.id}>
                        <div className='col 1'>
                            <div className='sub-container'>
                                <p>Vendedor</p>
                                <span className='content'>{parcela.name}</span>
                            </div>

                            <div className='sub-container'>
                                <p>Tipo</p>
                                <span className='content'>{imovelData.comissao?.tipo}</span>
                            </div>

                            <div className='sub-container'>
                                <p>Parcela</p>
                                <span className='content'>{parcela.numero_parcela}</span>
                            </div>
                        </div>

                        <div className='col 2'>
                            <div className='empty'>
                            </div>

                            <div className='sub-container'>
                                <p>Nº de Parcelas</p>
                                <span className='content'>{imovelData.comissao?.tipo === 'Integral' ? '---' : imovelData.comissao?.vendedor_responsavel_pagamento?.length}</span>
                            </div>

                            <div className='sub-container'>
                                <p>Valor</p>
                                <span className='content'>{parcela.parcela_valor}</span>
                            </div>
                        </div>
                    </div>
                </>
            ))}
            {imovelData.comissao?.vendedor_responsavel_pagamento?.length === 0 &&
                <div className='sub-container'>
                    <span className='content'>Equipe de pós venda está definindo o vendedor responsável.</span>
                </div>
            }
        </div>
    )
};

export default Responsaveis;