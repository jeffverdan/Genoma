
import ButtonComponent from '@/components/ButtonComponent';
import userInterface from '@/interfaces/Users/userData';
import { Chip } from '@mui/material';
import { HiPencil } from 'react-icons/hi2';

interface Props {
    pessoaData: userInterface
    handleShow?: any
    index?: number
};

const DadosEmpresa = ({ pessoaData, handleShow, index }: Props) => {

    const perfil = localStorage.getItem('perfil_login');

    return (
        <div className='detalhes-content'>
            <h2>Dados da empresa</h2>
            
            <div className='flex gap16'>
                <Chip label='JURIDICA' className='chip green' />
                <Chip label='EMPRESA' className='chip neutral' />
            </div>

            <div className='row'>
                <div className='col 1'>
                    <div>
                        <p>CNPJ</p>
                        <span>{pessoaData.cpf_cnpj}</span>
                    </div>

                    <div>
                        <p>Razão Social</p>
                        <span>{pessoaData.razao_social}</span>
                    </div>
                </div>

                <div className='col 2'>
                    <div>
                        <p>Celular</p>
                        <span>{pessoaData.telefone}</span>
                    </div>

                    <div>
                        <p>Nome Fantasia</p>
                        <span>{pessoaData.nome_fantasia}</span>
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

export default DadosEmpresa;
