import React, {useState} from 'react';
import ButtonComponent from '@/components/ButtonComponent';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { HiPencil } from 'react-icons/hi2';
// import SobreEditavel from '../Editavel/Sobre';
interface Props {
    imovelData: imovelDataInterface
    handleShow?: any
    index?: number
};

const Sobre = ({ imovelData, handleShow, index }: Props) => {
    const perfil = localStorage.getItem('perfil_login');
    const handleOpen = async () => { 
        console.log('Teste')
    }

    return (
        <div className='detalhes-content'>
            
            <h2>Sobre o imóvel</h2>

            <div className='row'>
                <div className='col 1'>
                    <div>
                        <p>Código do imóvel</p>
                        <span>{imovelData.codigo}</span>
                    </div>

                    <div>
                        <p>CEP</p>
                        <span>{imovelData.cep}</span>
                    </div>

                    <div>
                        <p>Numero</p>
                        <span>{imovelData.numero}</span>
                    </div>

                    <div>
                        <p>Cidade</p>
                        <span>{imovelData.cidade}</span>
                    </div>
                </div>

                <div className='col 2'>
                    <div className='empty'></div>

                    <div>
                        <p>Logradouro</p>
                        <span>{imovelData.logradouro}</span>
                    </div>

                    <div>
                        <p>Unidade</p>
                        <span>{imovelData.unidade || '---'}</span>
                    </div>

                    <div>
                        <p>Estado</p>
                        <span>{imovelData.uf}</span>
                    </div>
                </div>

                <div className='col 3'>
                    <div className='empty'></div>

                    <div className='empty'></div>

                    <div>
                        <p>Complemento</p>
                        <span>{imovelData.complemento || '---'}</span>
                    </div>

                    <div>
                        <p>Bairro</p>
                        <span>{imovelData.bairro}</span>
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

            
            {/* {
                !open === panels[0].status &&
                <SobreEditavel data={imovelData} handleNextBlock={e => e} handlePrevBlock={e => e } index={0} setOpen={setOpen} />
            } */}
        </div>
    )
}

export default Sobre;
