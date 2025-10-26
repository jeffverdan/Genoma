
import ShowDocument from '@/apis/getDocument';
import ButtonComponent from '@/components/ButtonComponent';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { Tipos } from '@/interfaces/Users/document';
import { Chip, Divider, Link } from '@mui/material';
import { HiPencil } from 'react-icons/hi2';

interface Props {
    imovelData: imovelDataInterface
    handleShow?: any
    index?: number
};

const Documentos = ({ imovelData, handleShow, index }: Props) => {
    const perfil = localStorage.getItem('perfil_login');
    return (
        <div className='detalhes-content'>
            <h2>Documentos do imóvel</h2>

            <div className='doc-container'>
                {!!imovelData.imovel?.documentos[0] && <p>Tipo</p>}
                {!!imovelData.imovel?.documentos[0] && <p>Nome</p>}
                {imovelData.imovel?.documentos.filter((f) => f.identifica_documento === "imóvel" || f.identifica_documento === "imovel").map((doc) => (
                    <>
                            <Divider className='divider' />
                            <Divider className='divider hidden' />
                        <div className='name-validade-container'>
                            {doc.tipo_documento_ids?.length > 0 ?
                                <p className='tipo-doc' key={doc.id}>{doc.tipo_documento_ids.map((item: Tipos) => (
                                    (' ' + item.nome_tipo)
                                )).toString()}</p>
                                :
                                <p className='tipo-doc' key={doc.id}>{doc?.nome_tipo}</p>}
                            <div className={`validade-container ${!doc.tipo_documento_ids?.filter((e: Tipos) => !!e.validade_dias)[0] ? 'hidden' : ''}`}>
                                <p>Documento:</p>
                                <p>Validade:</p>
                                <p>Emissão:</p>
                                <p>Vencimento:</p>
                                {!!doc.tipo_documento_ids?.[0] && doc.tipo_documento_ids.filter((e:Tipos) => !!e.validade_dias).map((docs: Tipos) => (
                                    <>
                                        <Chip className='chip neutral' label={docs.nome_tipo} />
                                        <Chip className='chip neutral' label={docs.validade_dias + ' dias'} />
                                        <Chip className='chip neutral' label={docs.data_emissao || 'SEM INFORMAÇÃO'} />
                                        <Chip className='chip neutral' label={docs.data_vencimento || 'SEM INFORMAÇÃO'} />
                                    </>
                                ))}
                            </div>

                        </div>

                        
                        <div className='link' key={doc.id}>
                            <Link key={doc.id} className='link' onClick={() => ShowDocument(doc.id, 'documento')}>
                                {doc.nome_original || doc.arquivo}
                            </Link>
                        </div>

                    </>
                ))}
                {imovelData.imovel?.documentos?.length === 0 &&
                    <p className='tipo-doc'>Nenhum documento cadastrado.</p>
                }
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

export default Documentos;
