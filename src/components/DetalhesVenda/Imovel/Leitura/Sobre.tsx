import React, { useState } from 'react';
import ButtonComponent from '@/components/ButtonComponent';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { HiPencil } from 'react-icons/hi2';
import CopyButton from '@/components/CopyButton/CopyButton';
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
            <div className='grid coll3'>
                {/* PRIMEIRA LINHA */}
                <div>
                    <p>Código do imóvel</p>
                    <span>{imovelData.codigo}</span>
                </div>
                <div className='empty'></div>
                <div className='empty'></div>

                {/* SEGUNDA LINHA */}
                <div>
                    <p>CEP</p>
                    <span>{imovelData.cep} <CopyButton textToCopy={imovelData.cep} /></span>
                </div>

                <div>
                    <p>Logradouro</p>
                    <span>{imovelData.logradouro} <CopyButton textToCopy={imovelData.logradouro} /></span>
                </div>
                <div className='empty'></div>

                {/* TERCEIRA LINHA */}
                <div>
                    <p>Numero</p>
                    <span>{imovelData.numero}</span>
                </div>
                <div>
                    <p>Unidade</p>
                    <span>{imovelData.unidade || '---'}</span>
                </div>
                <div>
                    <p>Complemento</p>
                    <span>{imovelData.complemento || '---'}</span>
                </div>

                {/* QUARTA LINHA */}
                <div>
                    <p>Cidade</p>
                    <span>{imovelData.cidade}</span>
                </div>
                <div>
                    <p>Estado</p>
                    <span>{imovelData.uf}</span>
                </div>
                <div>
                    <p>Bairro</p>
                    <span>{imovelData.bairro}</span>
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
