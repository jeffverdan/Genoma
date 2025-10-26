import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import Pessoa from '@/interfaces/Users/userData';
import { Alert, Chip } from '@mui/material';
import { FaExclamationCircle } from 'react-icons/fa';

interface Props {
    imovelData: imovelDataInterface
};


const ResumoProcesso = ({ imovelData }: Props) => {

    const returnLength = (arry: Pessoa[] | undefined): { fisicas: string, juridicas: string } => {
        const fisicas = arry?.filter((e) => !e.tipo_pessoa && !e.vinculo_empresa)?.length || 0;
        const juridicas = arry?.filter((e) => e.tipo_pessoa)?.length || 0;
        return {
            fisicas: fisicas > 1 ? `${fisicas} - Fisicas` : fisicas === 1 ? `1 - Fisica` : '',
            juridicas: juridicas > 1 ? `${juridicas} - Juridicas` : juridicas === 1 ? `1 - Juridica` : '',
        }
    };

    const ReturnPessoa = ({ pessoa }: { pessoa: 'vendedores' | 'compradores' }) => {
        return (
            <div className='content-container'>

                <div className='flex gap16'>
                    {!!returnLength(imovelData[pessoa]).fisicas && <Chip className='chip' label={returnLength(imovelData[pessoa]).fisicas} />}
                    {/* {!!returnLength(imovelData[pessoa]).juridicas && <Chip className='chip' label={returnLength(imovelData[pessoa]).juridicas} />} */}
                </div>

                <div className='grid coll2'>
                    {/* PRIMEIRA LINHA */}
                    <p className='subtitle'>Nome completo</p>
                    <p className='subtitle'>Telefone/Contato</p>

                    {/* SEGUNDA LINHA */}
                    {imovelData[pessoa]?.filter(e => !e.tipo_pessoa && !e.vinculo_empresa)?.map((pessoa => (
                        <>
                            <p className='content' key={pessoa.id}>
                                {pessoa.name || pessoa.nome_fantasia}
                            </p>
                            <span className='content' key={pessoa.id}>
                                {pessoa.telefone || "---"}
                            </span>
                        </>
                    )))}
                </div>
                {/*                 
                <div className='row'>
                    <div className='col-venda 1'>
                        <div className='sub-container'>
                            <p className='subtitle'>Nome completo</p>
                            {imovelData[pessoa]?.filter(e => !e.tipo_pessoa && !e.vinculo_empresa)?.map((pessoa => (
                                <p className='content' key={pessoa.id}>
                                    {pessoa.name || pessoa.nome_fantasia}
                                </p>
                            )))}
                        </div>
                    </div>
                    <div className='col-venda 2'>
                        <div className='sub-container'>
                            <p className='subtitle'>Telefone/Contato</p>
                            {imovelData[pessoa]?.filter(e => !e.tipo_pessoa && !e.vinculo_empresa)?.map((pessoa => (
                                <span className='content' key={pessoa.id}>
                                    {pessoa.telefone || "---"}
                                </span>
                            )))}
                        </div>
                    </div>
                </div> */}

                {!!imovelData[pessoa]?.filter(e => e.tipo_pessoa)?.[0] &&
                    <>
                        <div className='flex gap16'>
                            {!!returnLength(imovelData[pessoa]).juridicas && <Chip className='chip' label={returnLength(imovelData[pessoa]).juridicas} />}
                        </div>

                        <div className='grid coll2'>
                            {/* PRIMEIRA LINHA */}
                            <p className='subtitle'>Nome completo</p>
                            <p className='subtitle'>Telefone/Contato</p>

                            {/* SEGUNDA LINHA */}
                            {imovelData[pessoa]?.filter(e => e.tipo_pessoa)?.map((empresa => (
                                <>
                                    <p className='content' key={empresa.id}>
                                        {empresa.name || empresa.nome_fantasia}<br />
                                        {imovelData[pessoa]?.map((e) => e.vinculo_empresa === empresa.razao_social &&
                                            <p className='content' key={e.id}> ({e.name})</p>
                                        )}
                                    </p>

                                    <span className='content' key={empresa.id}>
                                        {empresa.telefone || "---"}<br />
                                        {imovelData[pessoa]?.map((e) => e.vinculo_empresa === empresa.razao_social &&
                                            <p className='content' key={e.id}>{e.telefone}</p>
                                        )}
                                    </span>
                                </>
                            )))}
                        </div>


                        {/* <div className='row'>
                            <div className='col-venda 1'>
                                <div className='sub-container'>
                                    <p className='subtitle'>Nome completo</p>
                                    {imovelData[pessoa]?.filter(e => e.tipo_pessoa)?.map((empresa => (
                                        <p className='content' key={empresa.id}>
                                            {empresa.name || empresa.nome_fantasia}<br />
                                            {imovelData[pessoa]?.map((e) => e.vinculo_empresa === empresa.razao_social &&
                                                <p className='content' key={e.id}> ({e.name})</p>
                                            )}
                                        </p>
                                    )))}
                                </div>
                            </div>
                            <div className='col-venda 2'>
                                <div className='sub-container'>
                                    <p className='subtitle'>Telefone/Contato</p>
                                    {imovelData[pessoa]?.filter(e => e.tipo_pessoa)?.map((empresa => (
                                        <span className='content' key={empresa.id}>
                                            {empresa.telefone || "---"}<br />
                                            {imovelData[pessoa]?.map((e) => e.vinculo_empresa === empresa.razao_social &&
                                                <p className='content' key={e.id}>{e.telefone}</p>
                                            )}
                                        </span>
                                    )))}
                                </div>
                            </div>
                        </div> */}
                    </>
                }
            </div>
        )
    };

    return (
        <div className='detalhes-content venda'>
            <h2>Resumo do processo</h2>
            <p className="title">Sobre o imóvel</p>
            <div className='content-container'>
                <div className='sub-container'>
                    <p className='subtitle'>Endereço</p>
                    <p className='content endereco'>
                        {imovelData.logradouro}
                        {imovelData.numero ? ", " + imovelData.numero : ''}
                        {imovelData.unidade ? ", " + imovelData.unidade : ''}
                        {imovelData.complemento ? ", " + imovelData.complemento : ''}
                        <br />
                        {imovelData.bairro}
                        {imovelData.uf ? " - " + imovelData.uf : ''}
                    </p>
                </div>
                <div className='sub-container'>
                    <p className='subtitle'>Inscrição Municipal</p>
                    <p className='content'>{imovelData.informacao?.inscricaoMunicipal}</p>
                </div>
            </div>
            <p className="title">Escritura</p>
            <div className='content-container'>
                <div className='sub-container'>
                    <p className='subtitle'>Data prevista</p>
                    <p className='content'>
                        {imovelData.informacao?.prazo_escritura}
                        {imovelData.dados_escritura && " - " + imovelData.dados_escritura?.status_escritura}
                    </p>
                </div>
            </div>
            <Alert
                className='alert info'
                severity="info"
                icon={<FaExclamationCircle size={20} />}
            >
                A data prevista da Escritura é influenciada pela Data de Assinatura do Recibo de Sinal assinado, e pelo prazo para Escritura no cadastro de imóvel.
            </Alert>

            <div className='content-container'>
                {
                    imovelData.dados_escritura &&
                        imovelData?.dados_escritura?.numero ?
                        <div className='sub-container'>
                            <p className='subtitle'>Local previsto</p>
                            <p className="content">{imovelData.dados_escritura?.nome_cartorio}</p>
                            <p className="content">{imovelData.dados_escritura?.logradouro}, {imovelData.dados_escritura?.numero} {imovelData.dados_escritura?.unidade || imovelData.dados_escritura?.complemento ? '-' : ''} {imovelData.dados_escritura?.unidade} {imovelData.dados_escritura?.unidade && imovelData.dados_escritura?.complemento ? '/' : ''} {imovelData.dados_escritura?.complemento}</p>
                            <p className="content">CEP:  {imovelData.dados_escritura?.cep}</p>
                        </div>
                        :
                        ''
                }
            </div>

            <p className="title">Vendedor{!!imovelData.vendedores?.[1] ? 'es' : ''}</p>
            <ReturnPessoa pessoa='vendedores' />

            <p className="title">Comprador{!!imovelData.compradores?.[1] ? 'es' : ''}</p>
            <ReturnPessoa pessoa='compradores' />

            <p className="title">Comissão total</p>
            <div className='grid coll2'>
                <div className='sub-container'>
                    <p className='subtitle'>Forma de pagamento</p>
                    <span className='content'>
                        {imovelData.comissao?.forma_pagamento || "---"}
                    </span>
                </div>
                <div className='sub-container'>
                    <p className='subtitle'>Valor de comissão</p>
                    <span className='content'>
                        {imovelData.comissao?.valor_comissao_liquida}
                    </span>
                </div>

                <div className='sub-container'>
                    <p className='subtitle'>Gerente</p>
                    <span className='content'>
                        {imovelData.comissao?.loja?.nome_gerente_geral}
                    </span>
                </div>
                <div className='sub-container'>
                    <p className='subtitle'>Loja</p>
                    <span className='content'>
                        {imovelData.comissao?.loja?.nome}
                    </span>
                </div>
            </div>
        </div>
    )
};

export default ResumoProcesso;