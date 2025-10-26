
import { historicoProcesso, statusType } from '@/interfaces/Imovel/historicoProcesso';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { Chip, Link, Avatar } from '@mui/material';
import { data } from 'cypress/types/jquery';
import Valores from '../Imovel/Leitura/Valores';
import ShowDocument from '@/apis/getDocument';
import formatoMoeda from '@/functions/formatoMoeda';

interface Props {
    imovelData: imovelDataInterface
};

function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
    return color;
};

// const returnNameGerente = (name: string) => {
//     let nameAbv = name.split(' ')[0];
//     if(name.split(' ')[1]) {
//         nameAbv = nameAbv + " " + (name.split(' ')[1].length > 2 ? name.split(' ')[1][0]?.toUpperCase() : name.split(' ')[2][0]?.toUpperCase()) + '.';
//     }
//     return nameAbv;
// };

const returnNameGerente = (name: string) => {
    let nameAbv = name.split(' ')[0];
    if (!name || name === 'USUÁRIO') nameAbv = '??';
    
    if (name.split(' ')[1]) {
        const secondName = name.split(' ')[1];
        const thirdName = name.split(' ')[2];
        const initial = secondName.length > 2 
            ? secondName[0]?.toUpperCase() 
            : thirdName?.[0]?.toUpperCase() ?? '';
        nameAbv = `${nameAbv} ${initial}.`;
    }
    return nameAbv;
};

function stringAvatar(name: string) {
    name = returnNameGerente(name);
    return {
        sx: {
            bgcolor: stringToColor(name),
            width: 36,
            height: 36,
            padding: 1,
            fontSize: 12
        },
        children: `${name.split(' ')[0]?.[0]}${name.split(' ')[1]?.[0]}`,
    };
};

const AvatarRow = ({ history }: { history: historicoProcesso }) => {
    const resposanvel = history?.nome_responsavel_alteracao || '?NOME ?USUÁRIO';	
    return <Avatar {...stringAvatar(resposanvel.toUpperCase())} />
}

const NomeHora = ({history} : { history: historicoProcesso }) => {
    return <div className="destaque">{history?.nome_responsavel_alteracao === null ? ' Às ' : history?.nome_responsavel_alteracao + ' às '}  {history.hora_historico}</div>
}

const DocumentRow = ({ history }: { history: historicoProcesso }) => {
    // console.log('HISTORY DOCUMENTOS: ', history);

    const exibeDocumento = history?.documento_deletado === 1
    ? `O arquivo ${(history.nome) 
        ? history.nome 
        : history.tipos_multiplos_documentos.map(e => e.nome_tipo).join(", ")} foi deletado do processo.`
    : <Link 
        key={history.documento_id} 
        className='link' 
        style={{textDecoration: 'underline'}}
        onClick={() => ShowDocument(history?.documento_id?.toString(), 'documento')}
    >
        {(history.nome) ? history.nome : history.tipos_multiplos_documentos.map(e => e.nome_tipo).join(", ")}
    </Link>

    const returnDocTypes = () => {
        return exibeDocumento
    };

    const tag = history.identifica_documento === 'imóvel' 
        ? 'Imóvel'
        :  history.identifica_documento === 'comissão' || history.identifica_documento === 'Comissão'
            ? 'Comissão'
            : history.identifica_documento === 'pessoa_fisica' 
                ? 'Pessoa Física' 
                : (history.identifica_documento === 'nota' && history.papel === 'corretor')
                    ? 'Corretor' 
                    : (history.identifica_documento === 'nota' && history.status_membro_partilha_id === 12) || history.identifica_documento === 'boleto_financeiro'
                        ? 'Financeiro'       
                        : 'Pessoa Jurídica'

    return (
        <div className='detalhes-line' data-history-id={history.processo_id}>
            <div className="content">
                <div className="avatar">
                    <AvatarRow history={history} />
                </div>

                <div className="info">
                    <div className='flex gap16'>
                        <Chip label={tag} className='chip primary' />
                        {/* {history.empresa?.razao_social && <Chip label={history.empresa.razao_social} className='chip neutral' />} */}
                        {tag !== 'Financeiro' ? history.cliente?.perfil && <Chip label={history.cliente.perfil} className='chip neutral' /> : ''}
                        <Chip label="DOCUMENTO" className='chip neutral' />
                    </div>

                    <div className='subtitle-container'>
                        <div className='mb15'>
                            <NomeHora history={history} />
                        </div>

                        <p className='subtitle'>
                            {tag === 'Imóvel' && (
                                <span>
                                    Imóvel
                                    {' > '}
                                    {returnDocTypes()}
                                </span>
                            )}
                            {tag === 'Comissão' && (
                                <span>
                                    {returnDocTypes()}
                                    { history?.documento_deletado === 1 ? '' : ' fechada'}
                                </span>
                            )}
                            {(tag === "Pessoa Física" || tag === "Pessoa Jurídica" || 'Financeiro') && (
                                <span>
                                    {history.cliente?.name || history.empresa?.nome_fantasia || 'SEM NOME'}
                                    {' > '}
                                    {returnDocTypes()}
                                </span>
                            )}
                            {tag === 'Corretor' && (
                                <span>
                                    { history?.documento_deletado === null ? 'Enviou o arquivo > ' : ''}
                                    {returnDocTypes()}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        // <div className='detalhes-line' >
        //     <div className='flex gap16'>
        //         <Chip label={history.tag} className='chip primary' />
        //         {history.empresa?.razao_social && <Chip label={history.empresa.razao_social} className='chip neutral' />}
        //         {history.cliente?.perfil && <Chip label={history.cliente.perfil} className='chip neutral' />}
        //         <Chip label="DOCUMENTO" className='chip neutral' />
        //     </div>

        //     <div className='subtitle-container'>
        //         <p>{history.data_historico}</p>
        //         <p className='subtitle'>
        //             {history.tag === 'Imóvel' && returnDocTypes()}
        //             {history.tag === 'Comissão' && returnDocTypes()}
        //             {(history.tag === "Pessoa Física" || history.tag === "Pessoa Jurídica") &&
        //                 `${history.cliente?.name || 'SEM NOME'} > ${returnDocTypes()}`
        //             }
        //         </p>
        //     </div>
        // </div>
    )
};

const StatusRow = ({ history }: { history: historicoProcesso }) => {
    const returnMsg = (history: historicoProcesso) => {
        switch (history.status) {
            case "Entrada":
                return history?.status_anterior_processo_id === 22 ? 'Alguma mensagem informando que o gerente fez as revisões' : 'Gerente enviou recibo para Pós-venda.'
            case "Escritura":
                // return `O pós-venda alterou o status da venda para Escritura,
                // além de compartilhar a data e local onde as assinaturas serão realizadas.`
                return history.mensagem
            case "Análise":
                return 'Analisando sua documentação. Conclusão em 2 dias.'
            case "Averbação":
                return history.mensagem
                // return 'Realizando averbação de documentos. Conclusão em 30 dias.'
            case "Certidões":
                return history.mensagem
                // return 'Solicitando certidões ao cartório. Conclusão em 7 dias.'
            case "Taxas":
                return history.mensagem
                // return 'Aguardando pagamento das taxas. Conclusão em 5 dias.'
            case "Registro":
                return history.mensagem
                // return 'Realizando transferência de propriedade. Conclusão em 40 dias.'
            case "Engenharia":
                return history.mensagem
                // return 'O banco vai analisar o imóvel. Conclusão em 5 dias.'
            case "Banco e Documentação":
                return history.mensagem
                // return 'O banco vai analisar a documentação dos envolvidos. Conclusão em 15 dias.'
            case "Conformidade":
                return history.mensagem
                // return 'Aprovação final do banco. Conclusão em 15 dias.'
            case "ITBI":
                return history.mensagem
                // return 'Aguardando pagamento das taxas de ITBI. Conclusão em 2 dias.'
            case "Emissão de Contrato":
                return history.mensagem
                // return 'Contrato em preparação. Conclusão em 1 dia.'
            default:
                return history.mensagem
        }
    };

    return (
        <div className='detalhes-line'  data-history-id={history.processo_id}>
            <div className="content">
                <div className="avatar">
                    <AvatarRow history={history} />
                </div>

                <div className="info">
                    <div>
                        <Chip 
                            label={history?.status === 'Cancelado' 
                                ? 'CANCELADO' 
                                : history?.status_id === 22 || history?.status_anterior_processo_id === 22
                                    ? 'Revisão' 
                                    : 'STATUS'} 
                            className={`chip ${history?.status === 'Cancelado' ? 'red' : 'green'}`} 
                        />
                    </div>

                    <div className='subtitle-container'>
                        <div className="mb15">
                            <NomeHora history={history} />
                            {
                                history?.status_anterior_processo_id === 22
                                ? <p>Gerente entregou um pedido de <span className="status-name">revisão</span></p>
                                : 
                                <p>
                                    {
                                        history?.status === 'Entrada' 
                                        ? 'Entregou a venda para o pós.'
                                        : <>Alterou o status para: <span className="status-name">{history.status}</span></>
                                    }
                                    
                                </p>
                            }
                            
                        </div>

                        {
                            (history.status === 'Entrada' && history.status_anterior_processo_id !== 22) &&
                            <div className='mb15'>
                                <p style={{lineHeight: '22px'}}>Recibo de sinal:</p> 
                                <Link 
                                    key={history.imovel_id} 
                                    className='link' 
                                    style={{textDecoration: 'underline'}}
                                    onClick={() => ShowDocument(history?.imovel_id?.toString(), 'recibo')}
                                >
                                    {history.recibo}
                                </Link>
                            </div>
                        }

                        {history.status === 'Escritura' &&
                            <div className='mb15'>
                                <p className='subtitle date'>
                                    {history.data_escritura && `Dia - ${history.data_escritura},`}
                                    {history.hora_escritura && ` Hora - ${history.hora_escritura}`}
                                </p>

                                <p className='subtitle date'>
                                    Local - {history?.nome_cartorio ? history?.nome_cartorio + ' - ' : ''} {history?.logradouro + ', '} {history?.numero} {history?.unidade ? '/' + history?.unidade : ''} {history?.complemento ? '/' + history?.complemento : ', '} {history?.bairro + ' - '} {history?.uf}
                                </p>

                                <p className='subtitle date'>
                                    CEP - {history?.cep}
                                </p>
                            </div>
                        }

                        {history.status === 'Registro' &&
                            <div className='mb15'>
                                <p className='subtitle date'>
                                    Tipo de RGI - {history?.nome_tipo_rgi}
                                </p>

                                <p className='subtitle date'>
                                    Número do protocolo de RGI - {history?.protocolo_rgi}
                                </p>
                            </div>
                        }

                        {history.status === 'Cancelado'
                            ? 
                                <>
                                    <p style={{fontWeight: 700, color: '#E33838'}}>{history.data_cancelamento}</p>
                                    <p className='subtitle'>Observação: {returnMsg(history)}</p>
                                    <p className="opacit">O distrato foi realizado no dia {history.data_historico}</p>
                                </>
                            :
                                returnMsg(history) && 
                                <div className='mb15'>
                                    <p className='subtitle observacao'>
                                        Observação: {returnMsg(history)}
                                    </p>
                                </div>
                        }

                        {
                            history?.status_id === 22 &&
                            <div> 
                                {/*Observações adicionadas pelo Pós*/}
                                {
                                    history?.observacao_imovel &&
                                    <p className='subtitle observacao mb15'>
                                        Imóvel {' > '} {history?.observacao_imovel}
                                    </p>
                                }

                                {
                                    history?.observacao_recibo &&
                                    <p className='subtitle observacao mb15'>
                                        Recibo {' > '} {history?.observacao_recibo}
                                    </p>
                                }

                                {
                                    history?.observacao_vendedores &&
                                    <p className='subtitle observacao mb15'>
                                        Vendedores {' > '} {history?.observacao_vendedores}
                                    </p>
                                }

                                {
                                    history?.observacao_vendedores_juridicos &&
                                    <p className='subtitle observacao mb15'>
                                        Vendedores PJ {' > '} {history?.observacao_vendedores_juridicos}
                                    </p>
                                }
                                
                                {
                                    history?.observacao_compradores &&
                                    <p className='subtitle observacao mb15'>
                                        Compradores {' > '} {history?.observacao_compradores}
                                    </p>
                                }

                                {
                                    history?.observacao_compradores_juridicos &&
                                    <p className='subtitle observacao mb15'>
                                        Compradores PJ {' > '} {history?.observacao_compradores_juridicos}
                                    </p>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

const EscrituraRow = ({ history }: { history: historicoProcesso }) => {
    return (
        <div className='detalhes-line' data-history-id={history.processo_id}>
             <div className="content">
                <div className="avatar">
                    <AvatarRow history={history} />
                </div>

                <div className="info">
                        <div className='flex gap16'>
                        <Chip label={"Escritura"} className='chip orange' />
                    </div>

                    <div className="mb15">
                        <NomeHora history={history} />
                        {history.resposta_gerente_id === 6 && <p>A escritura foi reagendada</p>}
                    </div>

                    <div className='subtitle-container'>
                        {/* <p>{history.data_historico}</p> */}

                        {
                            history.resposta_gerente_id === 6
                            ?
                            <>
                                <p className='subtitle date'>
                                    {history.data_escritura && `Dia - ${history.data_escritura},`}
                                    {history.hora_escritura && ` Hora - ${history.hora_escritura}`}
                                </p>

                                <p className='subtitle date'>
                                    Local - {history?.nome_cartorio ? history?.nome_cartorio + ' - ' : ''} {history?.logradouro + ', '} {history?.numero} {history?.unidade ? '/' + history?.unidade : ''} {history?.complemento ? '/' + history?.complemento + ', ' : ''} {history?.bairro ? history?.bairro + ' - ' : ''} {!!history?.uf}
                                </p>

                                {
                                    history.cep &&
                                    <p className='subtitle date'>
                                        CEP - {history?.cep}
                                    </p>
                                }

                            </>
                            :
                            <>  
                                <p className='subtitle mb15'>
                                    {history.status_escritura}
                                </p>

                                {
                                    history.resposta_gerente_id === 3 &&
                                    <p className='subtitle mb15'>
                                        Nova data de pagamento - {history.nova_data_agendamento}
                                    </p>
                                }
                            </>
                        }

                        {
                            history?.motivo_escritura &&
                            <p className='subtitle'>
                                Observação: {history.motivo_escritura}
                            </p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

const ServicosRow = ({ history }: { history: historicoProcesso }) => {

    const explodeNomeSolicitacao = history.nome_solicitacao?.split(' > ');

    return (
        <div className='detalhes-line' data-history-id={history.processo_id}>
            <div className="content">
                <div className="avatar">
                    <AvatarRow history={history} />
                </div>

                <div className="info">
                    <div className='flex gap16'>
                        <Chip label={"Serviço"} className='chip green' />
                        <Chip label="DOCUMENTO" className='chip neutral' />
                    </div>

                    <div className="mb15">
                        <NomeHora history={history} />
                        <p className='subtitle' style={{color: '#5D696F'}}>
                            {
                                (history?.status_solicitacao === 'Entrada' && !history?.data_previsao_termino_solicitacao)
                                ? 'Solicitou 1 serviço'
                                : (history?.status_solicitacao === 'Entrada' && history?.data_previsao_termino_solicitacao)
                                    ? 'Previsão de entrega: ' + history?.data_previsao_termino_solicitacao
                                    : history?.status_solicitacao === 'Finalizado'
                                        ? 'Serviço finalizado'
                                        : history?.status_solicitacao === 'Cancelado'
                                            ? 'Serviço cancelado'
                                            : ''
                            }
                        </p>
                    </div>

                    <div className='subtitle-container'>
                        <p className='subtitle'>
                        Tipo de serviço: {explodeNomeSolicitacao?.[0]}
                        </p>

                        <p className='subtitle mb15'>
                        Serviço Detalhado: {explodeNomeSolicitacao?.[1]}
                        </p>

                        <p className='subtitle'>
                        Observação: {history.mensagem_solicitacao}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
};

const NotasRow = ({ history }: { history: historicoProcesso }) => {

    return (
        <div className='detalhes-line' data-history-id={history.processo_id}>
            <div className="content">
                <div className="avatar">
                    <AvatarRow history={history} />
                </div>

                <div className="info">
                    <div className='flex gap16'>
                        <Chip label={"Nota"} className='chip neutral' />
                        {history.importante ? <Chip label="Importante" className='chip yellow' /> : ''}
                    </div>

                    <div className="mb15">
                        <NomeHora history={history} />

                        <p className='subtitle' style={{color: '#5D696F'}}>
                        {history.titulo}
                        </p>
                    </div>

                    <div className='subtitle-container'>
                        <p className='subtitle'>
                        {history.descricao}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
};

const formatarNomes = (type: string, arrayDados: historicoProcesso) => {
    const nomes = type === 'boleto'
        ? arrayDados?.pagadores_historico?.map((item) => item?.name)
        : arrayDados?.pagadores?.map((item) => item?.usuario_nome)
    
    if (nomes?.length === 0) return '';
    if (nomes?.length === 1) return nomes[0];
    if (nomes?.length === 2) return nomes?.join(' e ');
    
    // Para 3 ou mais nomes - SEMPRE pega o último
    const ultimoNome = nomes?.pop(); // Remove e retorna o último elemento
    return nomes?.join(', ') + ' e ' + ultimoNome;
}

const FinanceiroCorretorRow = ({ history }: { history: historicoProcesso }) => {
    // const explodeNomeSolicitacao = history.nome_solicitacao?.split(' > ');
    const pessoa = (history?.status_membro_partilha_id === 10 && history?.papel === 'parcela_comissao') || history?.status_membro_partilha_id === 12
        ? 'financeiro'
        : (history?.status_membro_partilha_id === 10 && history?.papel === 'confirmar_valor') || history?.status_membro_partilha_id === 11
            ? 'corretor' /* history?.nome_corretor_parcela */
            : (history?.papel === 'cobranca_permitida' && !!history?.nome_gerente_processo)
                ? 'gerente'
                : history?.papel === 'confimar_pagamento'
                    ? 'financeiro'
                    : 'financeiro'
                

        history?.nome_responsavel_alteracao === null 
            ? history.nome_responsavel_alteracao = history?.nome_gerente_processo
            : history?.nome_responsavel_alteracao

    return (
        <div className='detalhes-line' data-history-id={history.processo_id}>
            <div className="content">
                <div className="avatar">
                    <AvatarRow history={history} />
                </div>

                <div className="info">
                    <div className='flex gap16'>
                        <Chip label={pessoa} className='chip neutral' />
                        {/* <Chip label="DOCUMENTO" className='chip neutral' /> */}
                    </div>

                    <div className="mb15">

                        <NomeHora history={history} />
                        {/*Financeiro muda o Status para Cobrança solicitada*/}
                        {
                            history?.status_parcela_id === 3 && 
                            <>
                                <p className='subtitle' style={{color: '#5D696F'}}>
                                    Cobrança solicitada para {history?.nome_gerente_processo}  
                                </p>   
                            </>
                        }

                        {/*Gerente autoriza a cobrança*/}
                        {
                            history?.status_parcela_id === 4 && 
                            <>
                                <p className='subtitle' style={{color: '#5D696F'}}>
                                    Cobrança autorizada pelo gerente
                                </p>   
                            </>
                        }

                        {/*Financeiro informa que boleto foi enviado */}
                        {
                            (history?.status_parcela_id === 5 && (history?.pagadores_historico?.length ?? 0) > 0) && 
                            <>
                                <p className='subtitle' style={{color: '#5D696F'}}>
                                    Boleto enviado para: {formatarNomes('boleto', history)}
                                </p>   
                            </>
                        }

                        {/*Financeiro informa que uma pessoa pagou o boleto */}
                        {
                            history?.papel === 'confimar_pagamento' && 
                            <>
                                <p className='subtitle' style={{color: '#5D696F'}}>
                                    {history?.nome_corretor_parcela} pagou o boleto no valor de {history?.valor_pagamento}.
                                </p>   
                            </>
                        }

                        {/*Financeiro informa que boleto foi pago */}
                        {
                            history?.status_parcela_id === 7 && 
                            <>
                                <p className='subtitle' style={{color: '#5D696F'}}>
                                    Pagamento realizado por: {formatarNomes('pagamento', history)}
                                </p>   
                            </>
                        }

                        {/*Financeiro informa que boleto foi pago em atraso */}
                        {
                            history?.papel === 'confimar_pagamento_atrasado' &&
                            <>
                                <p className='subtitle' style={{color: '#5D696F', marginBottom: '15px'}}>
                                    Confirmou que o boleto emitido contra o {history?.nome_corretor_parcela}, em relação a venda<br/> 
                                    do imóvel {history?.imovel_logradouro + ', '} {history?.imovel_numero} {history?.imovel_unidade ? '/' + history?.imovel_unidade : ''} {history?.imovel_complemento ? '/' + history?.imovel_complemento : ', '} {history?.imovel_bairro + ' - '} {history?.imovel_uf}, foi pago com atraso no dia {history?.data_pagamento}.
                                </p>   

                                <p className='subtitle' style={{color: '#5D696F', marginBottom: '5px'}}>Valor do boleto: {history?.valor_pagamento}</p>

                                <p className='subtitle' style={{color: '#5D696F'}}>Valor pago: {history?.valor_pago}</p>
                            </>
                        }

                        {/*Financeiro libera o rateio para o Corretor*/}
                        {
                            (history?.status_membro_partilha_id === 10 && history?.papel === 'parcela_comissao') &&
                            <p className='subtitle' style={{color: '#5D696F'}}>
                                Rateio liberado para {history?.nome_corretor_parcela}
                            </p>
                        }
                        
                        {/*Corretor confirma o valor*/}
                        {
                            (history?.status_membro_partilha_id === 10 && history?.papel === 'confirmar_valor') &&
                            <p className='subtitle' style={{color: '#5D696F'}}>
                                Confirmou o valor de {formatoMoeda(history?.valor_confirmado_parcela_corretor)}
                            </p>
                        }

                        {/*Corretor envia a nota e onde quer receber*/}
                        {
                            (history?.status_membro_partilha_id === 11) &&
                           <>
                                <p className='subtitle' style={{color: '#5D696F'}}>
                                   Solicitou o pagamento no valor de {formatoMoeda(history?.valor_confirmado_parcela_corretor)}.
                                </p>

                                <p className='subtitle' style={{color: '#5D696F', margin: '15px 0'}}>
                                   {
                                        history?.dados_bancarios_parcela?.tipo_pagamento_selecionado === 'banco' 
                                        ? 'Na seguinte conta: '
                                        : 'No seguinte PIX: '
                                   }
                                   
                                   <p className='subtitle' style={{color: '#5D696F', margin: '5px 0'}}>
                                    {
                                        history?.dados_bancarios_parcela?.tipo_pagamento_selecionado === 'banco'
                                            ? `${history?.dados_bancarios_parcela?.nome_banco} - Agência: ${history?.dados_bancarios_parcela?.agencia} / Conta: ${history?.dados_bancarios_parcela?.numero_conta}`
                                            : `Chave PIX: ${history?.dados_bancarios_parcela?.chave_pix || history?.dados_bancarios_parcela?.pix}`
                                    }
                                   </p>
                                </p>

                                <Link 
                                    key={history.documento_id} 
                                    className='link' 
                                    style={{textDecoration: 'underline'}}
                                    onClick={() => ShowDocument(history?.documentos?.data?.[0]?.id?.toString(), 'nota')}
                                >
                                    {history?.documentos?.data?.[0]?.nome_original}
                                </Link>
                           </>                           
                        }

                        {/*Financeiro transferir valor para o corretor*/}
                        {
                            (history?.status_membro_partilha_id === 12 || history?.status_membro_partilha_id === 13) &&
                            <>
                                <p className='subtitle' style={{color: '#5D696F', margin: '5px 0'}}>
                                    {formatoMoeda(history?.valor_transferido)} transferido para {history?.nome_corretor_parcela}, <br/> {
                                        history?.dados_bancarios_parcela?.tipo_pagamento_selecionado === 'banco' 
                                        ? 'na conta: ' + `${history?.dados_bancarios_parcela?.nome_banco} - Agência: ${history?.dados_bancarios_parcela?.agencia} / Conta: ${history?.dados_bancarios_parcela?.numero_conta}`
                                        : 'no PIX: ' + `Chave PIX: ${history?.dados_bancarios_parcela?.chave_pix}`
                                   }
                                </p>

                                <p className='subtitle' style={{color: '#5D696F', margin: '5px 0'}}>
                                    <Link 
                                        key={history.documento_id} 
                                        className='link' 
                                        style={{textDecoration: 'underline'}}
                                        onClick={() => ShowDocument(history?.documento_transferencia?.id?.toString(), 'nota')}
                                    >
                                        {history?.documento_transferencia?.nome_original}
                                    </Link>
                                </p>

                                {
                                    history?.status_membro_partilha_id === 13 &&
                                    <p className='subtitle' style={{color: '#5D696F', margin: '15px 0'}}>
                                        Rateio integral realizado.
                                    </p>
                                }

                                {
                                    history?.status_membro_partilha_id === 12 &&
                                    <p className='subtitle' style={{color: '#5D696F', margin: '15px 0'}}>
                                        Valor restante: {formatoMoeda(history?.valor_faltante)}
                                    </p>
                                }
                            </>
                        }
                    </div>

                    <div className='subtitle-container'>
                        {
                            history.observacao &&
                            <p className='subtitle'>
                                Observação: {history.observacao}
                            </p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

const getChipCounts = (history: any[]) => {
    const counts = {
        neutral: 0,
        danger: 0,
        primary: 0,
        green: 0
    };
    
    history.forEach(item => {
        if (item.documento_id) {
            if (item.identifica_documento) {
                counts.primary++; // For document tag
            }
            // Remove this line to ignore "DOCUMENTO" chip
            // counts.neutral++; // For DOCUMENTO chip
            if (item.cliente?.perfil) counts.neutral++; // For perfil chip
        }
        if (item.status) {
            if (item.status === 'Cancelado') {
                counts.danger++;
            } else {
                counts.green++;
            }
        }
        if (item.status_escritura) {
            counts.primary++; // For Escritura chip
        }
        if (item.nome_solicitacao) {
            counts.green++; // For Serviço chip
            // Remove this line to ignore "DOCUMENTO" chip
            // counts.neutral++; // For DOCUMENTO chip
        }
        if (item.nota_id) {
            counts.neutral++; // For Nota chip
            if (item.importante) counts.green++; // For Importante chip
        }
    });
    
    return counts;
};

const ShowQuantidadeTags = ({ history }: { history: any[] }) => {
    return (
        <>
            {
                getChipCounts(history).green > 0 &&
                <Chip 
                    label={`${getChipCounts(history).green}`} 
                    size="small" 
                    className="chip green" 
                />
            }

            {
                getChipCounts(history).primary > 0 &&
                <Chip 
                    label={`${getChipCounts(history).primary}`} 
                    size="small" 
                    className="chip primary" 
                />
            }

            {
                getChipCounts(history).neutral > 0 &&
                <Chip 
                    label={`${getChipCounts(history).neutral}`} 
                    size="small" 
                    className="chip neutral" 
                />
            }

            {
                getChipCounts(history).danger > 0 &&
                <Chip 
                    label={`${getChipCounts(history).danger}`} 
                    size="small" 
                    className="chip red" 
                />
            }
        </>
    );
}

const Historico = ({ imovelData }: Props) => {
    return (
        <div className='detalhes-container'>
            <div className='detalhes-content'>
                <h2>Histórico da venda</h2>
            </div>
            <>
                {imovelData?.historico_processo?.map((history: any, index: number) => 
                    <div key={`history-group-${index}`} className='detalhes-content detalhes-historico'>
                        <div className="data-historico">
                            {history?.[0]?.data_historico}
                            {/* <div style={{ display: 'inline-flex', gap: '8px', marginLeft: '16px' }}>
                                {history && history.length > 0 && (
                                    <ShowQuantidadeTags history={history} />
                                )}
                            </div> */}
                        </div>
                        <div className="row">
                            {history?.map((valores: any, messageIndex: number) => (
                                <>
                                    {/* {valores.mensagem} */}
                                    {valores.documento_id ? (
                                        <DocumentRow history={valores} key={valores.processo_id} />
                                    ) : valores.status ? (
                                        <StatusRow history={valores} key={valores.processo_id} />
                                    ) : valores.status_escritura ? (
                                        <EscrituraRow history={valores} key={valores.processo_id} />
                                    ) : valores.nome_solicitacao ? (
                                        <ServicosRow history={valores} key={valores.processo_id} />
                                    ) : valores.nota_id ? (
                                        <NotasRow history={valores} key={valores.processo_id} />
                                    ) : valores?.parcela_id ? (
                                        <FinanceiroCorretorRow history={valores} key={valores.processo_id} />
                                    ) : null } 
                                </>
                            ))}
                        </div>
                    </div>
                )}
            </>
            

            {/* {imovelData?.historico_processo?.map((history: any, index: number) => {
                // <>{console.log(history?.[index]?.data_historico)}</>
                // <>{history?.[index]?.data_historico}</>
                // if (history.documento_id) {
                //     return <DocumentRow history={history} key={history.processo_id} />;
                // } else if (history.status) {
                //     return <StatusRow history={history} key={history.processo_id} />;
                // } else if (history.status_escritura) {
                //     return <EscrituraRow history={history} key={history.processo_id} />;
                // }
                return null;
            })} */}

        </div>
    )
}

export default Historico;
