
import ButtonComponent from '@/components/ButtonComponent';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { HiPencil } from 'react-icons/hi2';

interface Props {
    imovelData: imovelDataInterface
    handleShow?: any
    index?: number
};

const Valores = ({ imovelData, handleShow, index }: Props) => {
    const perfil = localStorage.getItem('perfil_login');

    return (
        <div className='detalhes-content'>
            <h2>Valores</h2>

            <div className='row'>
                <div className='col 1'>
                    <div>
                        <p>Valor Anunciado</p>
                        <span>{imovelData.informacao?.valor_anunciado || '---'}</span>
                    </div>

                    <div>
                        <p>Forma de pagamento</p>
                        <span>{imovelData.informacao?.forma_pagamento_nome || '---'}</span>
                    </div>
                </div>

                <div className='col 2'>
                    <div>
                        <p>Valor da venda</p>
                        <span>{imovelData.informacao?.valor_venda || '---'}</span>
                    </div>

                    <div>
                        <p>Meio de pagamento</p>
                        <span>{'---'}</span>
                    </div>
                </div>

                <div className='col 3'>
                    <div>
                        <p>Valor de sinal</p>
                        <span>{imovelData.informacao?.valorSinal || '---'}</span>
                    </div>
                </div>
            </div>

            {
                (perfil === 'Pós-venda' || perfil === 'Coordenadora de Pós-Negociação') && 
                <div className="btn-edit-detalhe">
                    <ButtonComponent 
                        size={'large'} 
                        variant={'text'} 
                        startIcon={<HiPencil size={20} />}
                        label={'Editar'}
                        onClick={e => handleShow(index, 'editar')}
                    />
                </div>
            }
        </div>
    )
}

export default Valores;
