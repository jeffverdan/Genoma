
import ButtonComponent from '@/components/ButtonComponent';
import CopyButton from '@/components/CopyButton/CopyButton';
import userInterface from '@/interfaces/Users/userData';
import { Chip } from '@mui/material';
import { HiPencil } from 'react-icons/hi2';

interface Props {
    pessoaData: userInterface
    handleShow?: any
    index?: number
};

const DadosPessoais = ({ pessoaData, handleShow, index }: Props) => {

    const perfil = localStorage.getItem('perfil_login');

    return (
        <div className='detalhes-content'>
            <h2>Dados pessoais</h2>

            <div>
                {pessoaData.vinculo_empresa
                    ?
                    <div className='flex gap16'>
                        <Chip label='JÚRIDICA' className='chip green' />
                        <Chip label={pessoaData.vinculo_empresa?.razao_social} className='chip neutral' />
                        {!!pessoaData.pj_representante && <Chip label='representante legal' className='chip neutral' />}
                        {!!pessoaData.pj_socio && <Chip label='sócio' className='chip neutral' />}

                    </div>
                    : <Chip label='Fisica' className='chip green' />}
            </div>

            <div className='grid coll3'>
                <div>
                    <p>CPF</p>
                    <span>{pessoaData.cpf_cnpj} <CopyButton textToCopy={pessoaData.cpf_cnpj} /></span>
                </div>
                <div>
                    <p>Data de nascimento</p>
                    <span>{pessoaData.data_nascimento}</span>
                </div>
                <div>
                    <p>Gênero</p>
                    <span>{pessoaData.genero_label}</span>
                </div>
                <div>

                    <p>Nome completo</p>
                    <span>{pessoaData.name} <CopyButton textToCopy={pessoaData.name} /></span>
                </div>
                <div>
                    <p>Nome da mãe</p>
                    <span>{pessoaData.nome_mae} {<CopyButton textToCopy={pessoaData.nome_mae} />}</span>
                </div>
                <div>
                    <p>Nome do pai</p>
                    <span>{pessoaData.nome_pai || '---'}</span>
                </div>

                <div>
                    <p>Nacionalidade</p>
                    <span>{pessoaData.nacionalidade}</span>
                </div>
                <div>
                    <p>Telefone/Celular</p>
                    <span>{pessoaData.telefone} <CopyButton textToCopy={pessoaData.telefone} /></span>
                </div>
                <div className='empty'></div>

                <div>
                    <p>Profissão</p>
                    <span>{pessoaData.profissao}</span>
                </div>
                <div>
                    <p>E-mail</p>
                    <span>{pessoaData.email || '---'} {<CopyButton textToCopy={pessoaData.email} />}</span>
                </div>
                <div className='empty'></div>

                <div>
                    <p>RG</p>
                    <span>{pessoaData.rg || '---'}</span>
                </div>
                <div>
                    <p>Expedida por</p>
                    <span>{pessoaData.rg_expedido || '---'}</span>
                </div>
                <div>
                    <p>Data de Expedição</p>
                    <span>{pessoaData.data_rg_expedido || '---'}</span>
                </div>
                <div>
                    <p>Estado Civil</p>
                    <span>{pessoaData.estado_civil_nome}</span>
                </div>
                {pessoaData.conjuge && <div>
                    <p>Cônjuge</p>
                    <span>{pessoaData.conjuge}</span>
                </div>}
                {pessoaData.registro_casamento === '1' && <div>
                    <p>Regime de casamento</p>
                    <span>{pessoaData.registro_casamento_label || '---'}</span>
                </div>}

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

export default DadosPessoais;
