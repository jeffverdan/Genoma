
import ButtonComponent from '@/components/ButtonComponent';
import userInterface from '@/interfaces/Users/userData';
import { Chip } from '@mui/material';
import { HiPencil } from 'react-icons/hi2';

interface Props {
    pessoaData: userInterface
    handleShow?: any
    index?: number
};

const DadosPessoa = ({ pessoaData, handleShow, index }: Props) => {

    const perfil = localStorage.getItem('perfil_login');

    const formatData = () => {
        // Data no formato "1986-03-22 00:00:00"
        const dataString = pessoaData?.data_nascimento;

        // Cria um objeto Date com a string de data
        const data = new Date(dataString);

        // Extrai o dia, mês e ano
        const dia = data.getDate();
        const mes = data.getMonth() + 1; // Os meses começam do zero, então adicionamos 1
        const ano = data.getFullYear();

        // Formata a data no formato "dd/mm/yyyy"
        const dataFormatada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`;

        return dataFormatada;
    }

    return (
        <div className='detalhes-content'>
            <h2>Dados pessoais</h2>

            <div className='grid coll3'>
                <div>
                    <p>CPF</p>
                    <span>{pessoaData?.cpf_cnpj}</span>
                </div>
                <div>
                    <p>Data de nascimento</p>
                    <span>{formatData()}</span>
                </div>
                <div>
                    <p>Gênero</p>
                    <span>{pessoaData?.genero_label}</span>
                </div>

                <div>
                    <p>Nome completo</p>
                    <span>{pessoaData?.name}</span>
                </div>
                <div>
                    <p>Nome da mãe</p>
                    <span>{pessoaData?.nome_mae}</span>
                </div>
                <div>
                    <p>Nome do pai</p>
                    <span>{pessoaData?.nome_pai || '---'}</span>
                </div>

                <div>
                    <p>Nacionalidade</p>
                    <span>{pessoaData?.nacionalidade}</span>
                </div>
                <div>
                    <p>Telefone/Celular</p>
                    <span>{pessoaData?.telefone}</span>
                </div>
                <div className='empty'></div>

                <div>
                    <p>Profissão</p>
                    <span>{pessoaData?.profissao}</span>
                </div>
                <div>
                    <p>E-mail</p>
                    <span>{pessoaData?.email || '---'}</span>
                </div>
                <div className='empty'></div>

                <div>
                    <p>RG</p>
                    <span>{pessoaData?.rg || '---'}</span>
                </div>
                <div>
                    <p>Expedida por</p>
                    <span>{pessoaData?.rg_expedido || '---'}</span>
                </div>
                <div>
                    <p>Data de Expedição</p>
                    <span>{pessoaData?.data_rg_expedido || '---'}</span>
                </div>

                <div>
                    <p>Estado Civil</p>
                    <span>{pessoaData?.estado_civil_nome}</span>
                </div>
                {pessoaData?.conjuge && <div>
                    <p>Cônjuge</p>
                    <span>{pessoaData?.conjuge}</span>
                </div>}
                {pessoaData?.registro_casamento === '1' && <div>
                    <p>Regime de casamento</p>
                    <span>{pessoaData?.registro_casamento_label || '---'}</span>
                </div>}
            </div>

            {/* {
                perfil === 'Pós-venda' && 
                <div className="btn-edit-detalhe">
                    <ButtonComponent 
                        size={'large'} 
                        variant={'text'} 
                        startIcon={<HiPencil size={20} />}
                        label={'Editar'}
                        onClick={e => handleShow(index, 'editar')}
                    />
                </div>
            } */}
        </div>
    )
}

export default DadosPessoa;
