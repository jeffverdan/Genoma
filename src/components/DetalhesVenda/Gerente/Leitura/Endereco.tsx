
import ButtonComponent from '@/components/ButtonComponent';
import userInterface from '@/interfaces/Users/userData';
import { Chip } from '@mui/material';
import { HiPencil } from 'react-icons/hi2';

interface Props {
    pessoaData: userInterface
    handleShow?: any
    index?: number
};

const Endereco = ({ pessoaData, handleShow, index }: Props) => {

    const perfil = localStorage.getItem('perfil_login');

    return (
        <div className='detalhes-content'>
            <h2>Endereço</h2>

            <div className='grid coll3'>
                <div>
                    <p>CEP</p>
                    <span>{pessoaData?.cep || '---'}</span>
                </div>
                <div>
                    <p>Logradouro</p>
                    <span>{pessoaData?.logradouro || '---'}</span>
                </div>
                <div className='empty'></div>

                <div>
                    <p>Número</p>
                    <span>{pessoaData?.numero || '---'}</span>
                </div>
                <div>
                    <p>Unidade</p>
                    <span>{pessoaData?.unidade || '---'}</span>
                </div>
                <div>
                    <p>Complemento</p>
                    <span>{pessoaData?.complemento || '---'}</span>
                </div>

                <div>
                    <p>Cidade</p>
                    <span>{pessoaData?.cidade || '---'}</span>
                </div>
                <div>
                    <p>Estado</p>
                    <span>{pessoaData?.estado || '---'}</span>
                </div>
                <div>
                    <p>Bairro</p>
                    <span>{pessoaData?.bairro || '---'}</span>
                </div>

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
};

export default Endereco;
