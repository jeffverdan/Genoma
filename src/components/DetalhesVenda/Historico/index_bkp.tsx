
// import { historicoProcesso, statusType } from '@/interfaces/Imovel/historicoProcesso';
// import imovelDataInterface from '@/interfaces/Imovel/imovelData';
// import { Chip } from '@mui/material';

// interface Props {
//     imovelData: imovelDataInterface
// };

// const DocumentRow = ({ history }: { history: historicoProcesso }) => {
//     const returnDocTypes = () => {
//         if (history.nome) return history.nome
//         else {
//             return history.tipos_multiplos_documentos.map((e) => " " + e.nome_tipo).toString()
//         }

//     };

//     return (
//         <div className='detalhes-content' >
//             <div className='flex gap16'>
//                 <Chip label={history.tag} className='chip primary' />
//                 {history.empresa?.razao_social && <Chip label={history.empresa.razao_social} className='chip neutral' />}
//                 {history.cliente?.perfil && <Chip label={history.cliente.perfil} className='chip neutral' />}
//                 <Chip label="DOCUMENTO" className='chip neutral' />
//             </div>

//             <div className='subtitle-container'>
//                 <p>{history.data_historico}</p>
//                 <p className='subtitle'>
//                     {history.tag === 'Imóvel' && returnDocTypes()}
//                     {history.tag === 'Comissão' && returnDocTypes()}
//                     {(history.tag === "Pessoa Física" || history.tag === "Pessoa Jurídica") &&
//                         `${history.cliente?.name || 'SEM NOME'} > ${returnDocTypes()}`
//                     }
//                 </p>
//             </div>
//         </div>
//     )
// };

// const StatusRow = ({ history }: { history: historicoProcesso }) => {
//     const returnMsg = (history: historicoProcesso) => {
//         switch (history.status) {
//             case "Entrada":
//                 return 'Gerente enviou recibo para Pós-venda.'
//             case "Escritura":
//                 // return `O pós-venda alterou o status da venda para Escritura,
//                 // além de compartilhar a data e local onde as assinaturas serão realizadas.`
//                 return history.mensagem
//             case "Análise":
//                 return 'Analisando sua documentação. Conclusão em 2 dias.'
//             case "Averbação":
//                 return history.mensagem
//                 // return 'Realizando averbação de documentos. Conclusão em 30 dias.'
//             case "Certidões":
//                 return history.mensagem
//                 // return 'Solicitando certidões ao cartório. Conclusão em 7 dias.'
//             case "Taxas":
//                 return history.mensagem
//                 // return 'Aguardando pagamento das taxas. Conclusão em 5 dias.'
//             case "Registro":
//                 return history.mensagem
//                 // return 'Realizando transferência de propriedade. Conclusão em 40 dias.'
//             case "Engenharia":
//                 return history.mensagem
//                 // return 'O banco vai analisar o imóvel. Conclusão em 5 dias.'
//             case "Banco e Documentação":
//                 return history.mensagem
//                 // return 'O banco vai analisar a documentação dos envolvidos. Conclusão em 15 dias.'
//             case "Conformidade":
//                 return history.mensagem
//                 // return 'Aprovação final do banco. Conclusão em 15 dias.'
//             case "ITBI":
//                 return history.mensagem
//                 // return 'Aguardando pagamento das taxas de ITBI. Conclusão em 2 dias.'
//             case "Emissão de Contrato":
//                 return history.mensagem
//                 // return 'Contrato em preparação. Conclusão em 1 dia.'
//             default:
//                 return history.mensagem
//         }
//     };

//     return (
//         <div className='detalhes-content' >
//             <div>
//                 <Chip 
//                     label={history?.status === 'Cancelado' ? 'CANCELADO' : 'STATUS'} 
//                     className={`chip ${history?.status === 'Cancelado' ? 'red' : 'green'}`} 
//                 />
//             </div>

//             <div className='subtitle-container'>
//                 {history.status === 'Cancelado'
//                     ? 
//                         <>
//                             <p style={{fontWeight: 700, color: '#E33838'}}>{history.data_cancelamento}</p>
//                             <p className='subtitle'>{returnMsg(history)}</p>
//                             <p className="opacit">O distrato foi realizado no dia {history.data_historico}</p>
//                         </>
//                     :
//                     <>
//                         <p>{history.data_historico} - {history.status}</p>
//                         <p className='subtitle'>
//                             {returnMsg(history)}
//                         </p>
//                     </>
//                 }

//                 {history.status === 'Escritura' &&
//                     <p className='subtitle date'>
//                         {history.data_escritura && `Dia - ${history.data_escritura},`}
//                         {history.hora_escritura && ` Hora - ${history.hora_escritura}`}
//                         {history.logradouro && ` e Local - ${history.logradouro}`}
//                         {history.numero && `, ${history.numero}`}
//                     </p>
//                 }
//             </div>
//         </div>
//     )
// };

// const EscrituraRow = ({ history }: { history: historicoProcesso }) => {
//     return (
//         <div className='detalhes-content'>
//             <div className='flex gap16'>
//                 <Chip label={"Escritura"} className='chip orange' />
//             </div>

//             <div className='subtitle-container'>
//                 <p>{history.data_historico}</p>
//                 <p className='subtitle'>
//                     {history.status_escritura}
//                 </p>
//             </div>
//         </div>
//     )
// };

// const Historico = ({ imovelData }: Props) => {
//     console.log(imovelData.historico_processo);

//     return (
//         <div className='detalhes-container'>
//             <div className='detalhes-content'>
//                 <h2>Histórico da venda</h2>
//             </div>

//             {imovelData.historico_processo?.map((history) => {
//                 if (history.documento_id) {
//                     return <DocumentRow history={history} key={history.processo_id} />
//                 } else if (history.status) {
//                     return <StatusRow history={history} key={history.processo_id} />
//                 } else if (history.status_escritura) {
//                     return <EscrituraRow history={history} key={history.processo_id} />
//                 }
//             })}

//         </div>
//     )
// }

// export default Historico;
