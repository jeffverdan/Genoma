
import ShowDocument from '@/apis/getDocument';
import ButtonComponent from '@/components/ButtonComponent';
import userInterface from '@/interfaces/Users/userData';
import { Chip, Divider, Link } from '@mui/material';
import { HiPencil } from 'react-icons/hi2';

interface Props {
    pessoaData: userInterface
    handleShow?: any
    index?: number
};

const Documentos = ({ pessoaData, handleShow, index }: Props) => {

    const perfil = localStorage.getItem('perfil_login');

    return (
        <div className='detalhes-content'>
            <h2>Documentos {pessoaData.tipo_pessoa === 0 ? 'pessoais' : ' da empresa'}</h2>

            <div className='doc-container'>
                {!!pessoaData.documentos?.data[0] && <p>Tipo</p>}
                {!!pessoaData.documentos?.data[0] && <p>Nome do arquivo</p>}
                {pessoaData.documentos?.data.map(doc =>
                    <>
                        <Divider className='divider' />
                        <Divider className='divider hidden' />
                        <div className='name-validade-container'>
                            {doc.tipo_documento_ids?.length > 0 ? (
                                <p className='tipo-doc' key={doc.id}>{doc.tipo_documento_ids.map(e => ' ' + e.nome_tipo).toString()}</p>
                            ) : (
                                <p className='tipo-doc' key={doc.id}>{doc.tipo_documento?.nome}</p>
                            )}
                            <div className={`validade-container ${!doc.tipo_documento_ids?.filter((e) => !!e.validade_dias)[0] ? 'hidden' : ''}`}>
                                <p>Documento:</p>
                                <p>Validade:</p>
                                <p>Emissão:</p>
                                <p>Vencimento:</p>
                                {!!doc.tipo_documento_ids?.[0] && doc.tipo_documento_ids.filter((e) => !!e.validade_dias).map((docs) => (
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
                )}
                {pessoaData.documentos?.data.length === 0 &&
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
