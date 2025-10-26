
import getEfiteutica from '@/apis/apiEfiteutica';
import getFunesbom from '@/apis/apiFunesbom';
import SaveDocument from '@/apis/saveDocument';
import saveTipoDocumento from '@/apis/saveTipoDocumento';
import ButtonComponent from '@/components/ButtonComponent';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { Tipos } from '@/interfaces/Users/document';
import { CircularProgress, LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { HiPencil } from 'react-icons/hi2';

interface Props {
    imovelData: imovelDataInterface
    handleShow?: any
    index?: number
    saveBlocks: () => void
    refreshData?: () => void
};

const Registro = ({ imovelData, handleShow, index, refreshData }: Props) => {
    const perfil = localStorage.getItem('perfil_login');
    console.log(imovelData);

    return (
        <div className='detalhes-content'>
            <h2>Registro e Escritura</h2>

            <div className='grid coll4'>
                {/* PRIMEIRA LINHA */}
                <div>
                    <p>Escritura</p>
                    <span>{imovelData.informacao?.tipo_escritura}</span>
                </div>

                <div>
                    <p>Vagas Escrituradas</p>
                    <span>{imovelData.informacao?.vaga || '---'}</span>
                </div>

                <div className='empty'></div>

                <div className='empty'></div>

                {/* SEGUNDA LINHA */}
                <div>
                    <p>Matrícula n°</p>
                    <span>{imovelData.informacao?.matricula}</span>
                </div>

                <div>
                    <p>Inscrição Municipal</p>
                    <span>{imovelData.informacao?.inscricaoMunicipal || '---'}</span>
                </div>

                <div>
                    <p>RGI</p>
                    <span>{imovelData.informacao?.rgi || '---'}</span>
                </div>

                <div className='empty'></div>

                {/* TERCEIRA LINHA */}
                <div>
                    <p>Lavrada em</p>
                    <span>{imovelData.informacao?.lavrada || '---'}</span>
                </div>

                <div>
                    <p>Livro</p>
                    <span>{imovelData.informacao?.livro || '---'}</span>
                </div>

                <div>
                    <p>Folha</p>
                    <span>{imovelData.informacao?.folha || '---'}</span>
                </div>

                <div>
                    <p>Ato</p>
                    <span>{imovelData.informacao?.ato || '---'}</span>
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

export default Registro;
