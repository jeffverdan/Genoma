import React from 'react';
import DadosPessoaLeitura from '@/components/MeuPerfil/DadosPessoais/Leitura/DadosPessoa';
import EnderecoLeitura from '@/components/MeuPerfil/DadosPessoais/Leitura/Endereco';

interface IProps{
    editar: Boolean,
    setEditar: (e: Boolean) => void
}

export default function DadosPessoais({editar, setEditar} : IProps) {
    return (
        <div className="dados-pessoais-perfil">
            {
                !editar
                ?
                <>
                    {/* <DadosPessoaLeitura />
                    <EnderecoLeitura /> */}
                </>
                
                :
                'true'
            }
        </div>
    )
}
