import React, { useState, useEffect } from 'react'
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import styles from './Corner.module.scss';
import { HiXMark } from 'react-icons/hi2';
import Slide, { SlideProps } from '@mui/material/Slide';
import ButtonComponent from '../ButtonComponent';
import { useRouter } from 'next/router';
import { TransitionProps } from '@mui/material/transitions';
import Fade from '@mui/material/Fade';

// interface State extends SnackbarOrigin {
//     open: boolean;
// }

interface ICorner {
    open: boolean
    setOpen: (newValue: boolean) => void;
    vertical: "top" | "bottom"
    horizontal: "center" | "left" | "right"
    direction: "up" | "left" | "right" | "down"
    type: string
    idProcesso?: number
    className?: string
    url?: string
    value?: string
    emailEnvelope?: string
}

let newDirection: "left" | "right" | "up" | "down" | undefined;

export default function Corner({ open, setOpen, vertical, horizontal, type, direction, idProcesso, className, url, value, emailEnvelope }: ICorner) {
    const [nomeUsuario, setNomeUsuario] = useState('');
    useEffect(() => {
        const usuario: any = (localStorage.getItem('nome_usuario') !== undefined || localStorage.getItem('nome_usuario') !== null) ? localStorage.getItem('nome_usuario') : '';
        const primeiroNome = usuario.split(' ') || '';
        setNomeUsuario(primeiroNome[0])
    },[])

    const router = useRouter();
    newDirection = direction;

    const handleBackDashBoard = () => {
        router.push('/vendas/gerar-venda/' + idProcesso + '/dashboard/')
        // localStorage.remove('procesoId')
    }

    const tipoPessoa = type === 'cadastrou-vendedor' ? 'vendedor' : 'comprador'

    const handleClose = async (event: React.SyntheticEvent | Event, reason?: string) => {
        setOpen(false);
        if(sessionStorage.getItem('type') !== undefined 
        || sessionStorage.getItem('type') !== null) sessionStorage.removeItem('type');
    };
    
    const handleClosePedidoNucleo = async (event: React.SyntheticEvent | Event, reason?: string) => {
        setOpen(false);
        if(sessionStorage.getItem('type') !== undefined || sessionStorage.getItem('type') !== null) {
            sessionStorage.removeItem('type')
        };
        router.push('posvenda/' + sessionStorage.getItem('idPedido') + '/detalhes-venda');
    };

    const handleSolicitarServico = () => {
        setOpen(false);
        // const processoId: any = idProcesso?.toString();
        // sessionStorage.setItem('sugestao-servicos', processoId);
        router.push('/posvenda/' + idProcesso + '/pedidos-servico')
    }

    const handleIrEntregas = () => {
        router.push('/vendas');
        sessionStorage.setItem('exibir-entregues', 'true');
    }

    const contentDialog = () => {
        if (type === 'login-invalido') {
            return <>
                <div className="title">Ops!</div>
                <div className="content">Seu e-mail ou senha estão incorretos.<br/> Tente novamente ou recupere sua senha.</div>
                <ButtonComponent
                    name={'primary'}
                    size={'small'}
                    variant={'text'}
                    label={'Fechar'}
                    onClick={handleClose}
                />
            </>
        }

        if (type === 'confirm-reenvio-devolucao') {
            return <>
                <p className="title">Você enviou a venda revisada!</p>
                <p className="content">A venda com as correções solicitadas pela equipe de pós-venda serão analisadas. Agora é só aguardar!</p>
                <div className='btn-actions'>
                    <ButtonComponent
                        size={'small'}
                        variant={'text'}
                        label={'Fechar'}
                        onClick={handleClose}
                    />
                    <ButtonComponent
                        name=""
                        size={'small'}
                        variant={'contained'}
                        labelColor='white'
                        label={'Ver detalhes'}
                        onClick={handleToUrl}
                    />
                </div>
            </>
        }

        if (type === 'cancelar-processo') {
            return <>
                <div className="title">Você cancelou a venda!</div>
                <div className="content">Você pode conferir as vendas canceladas na aba<br/> <strong>&quot;Cancelados&quot;</strong>, no seu painel.</div>
                <ButtonComponent
                    name={'primary'}
                    size={'small'}
                    variant={'text'}
                    label={'Ok'}
                    onClick={handleClose}
                />
            </>
        }

        if (type === 'trocar-responsavel') {
            return <>
                <div className="title">Troca de responsável feita com sucesso! :)</div>
                <div className="content">Você já pode ver essa mudança na sua listagem.</div>
                <ButtonComponent
                    name={'primary'}
                    size={'small'}
                    variant={'text'}
                    label={'Tudo bem!'}
                    onClick={handleClose}
                />
            </>
        }

        if (type === 'concluir-processo') {
            return <>
                {/* <div className="title">Obrigada, {nomeUsuario}! A venda<br/> foi concluída com sucesso.</div> */}
                <div className='title'>Parabéns! Venda entregue para o pós-venda :)</div>
                {/* <div className="content">Seu trabalho é indispensável para a DNA<br/> Imóveis, por isso celebramos essa entrega<br/> com você!</div> */}
                {/* <div className="content">Para acessar essa venda clique<br/> na aba <strong>Concluídas</strong> no seu painel.</div> */}
                <div className='content'>Você pode acompanhar o processo na aba de Entregues ou Detalhes da venda.</div>
                <ButtonComponent
                    name={'primary'}
                    size={'small'}
                    variant={'text'}
                    label={'Ver detalhes da venda'}
                    onClick={handleToUrl}
                />
            </>
        }

        if (type === 'concluir-pedido') {
            return <>
                <div className="title">Solicitação enviada!</div>
                <div className="content">Sua soliticação de Serviço ao Núcleo de Certidões foi<br/> enviada. Agora é só aguardar o upload dos documentos<br/> na plataforma.</div>
                <ButtonComponent
                    name={'primary'}
                    size={'small'}
                    variant={'text'}
                    label={'Ver Detalhes'}
                    onClick={handleClosePedidoNucleo}
                />
            </>
        }

        if (type === 'download-rascunho') {
            return <>
                <div className="title">Download do rascunho realizado!</div>
                <div className="content">Revise o rascunho para ver se está tudo certo. Em seguida,<br /> você pode usar a minuta para coletar assinaturas.</div>
                <ButtonComponent
                    name="primary"
                    size={'small'}
                    variant={'text'}
                    label={'Continuar cadastro'}
                    onClick={handleBackDashBoard}
                />
            </>
        }

        if (type === 'cadastrou-vendedor' || type === 'cadastrou-comprador') {
            return <>
                <div className="title">
                    Parabéns, você cadastrou<br /> {tipoPessoa}es do processo!
                </div>
                <div className="content">
                    Você pode <span>continuar nessa etapa</span> para concluir<br />
                    o cadastro de {tipoPessoa}es ou <span>escolher outra etapa do processo</span><br />
                    na tela de cadastro completo. A escolha é sua. ;)
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ButtonComponent
                        name="minimal"
                        size={'small'}
                        variant={'text'}
                        label={'Continuar nessa etapa '}
                        onClick={handleClose}
                    />

                    <ButtonComponent
                        name="primary"
                        size={'small'}
                        variant={'text'}
                        label={'Ir para cadastro completo'}
                        onClick={handleBackDashBoard}
                    />
                </div>
            </>
        }

        if (type === 'solicitar-servico') {
            return <>
                <div className="title">Vamos soliticar serviços ao núcleo?</div>
                <div className="content">Este é o momento de solicitar Guia do ITBI e demais certidões<br/> para a venda. Se atente aos prazos e não deixe de<br/> refrescar os documentos quando necessário.</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ButtonComponent
                        name="minimal"
                        size={'small'}
                        variant={'text'}
                        label={'Fechar'}
                        onClick={handleClose}
                    />
                    
                    <ButtonComponent
                        name={'primary'}
                        size={'small'}
                        variant={'text'}
                        label={'Solicitar serviço'}
                        onClick={handleSolicitarServico}
                    />
                </div>
            </>
        }

        if (type === 'reenviar-docsign') {
            return <>
                <div className="title">E-mail foi reenviado!</div>
                <div className="content" style={{maxWidth: '445px'}}>Reenviamos um e-mail para <span>{value}</span> ({emailEnvelope}), sobre o recibo do Docusign.<br/> Agora é só <span>aguardar a assinatura</span>.</div>
                <ButtonComponent
                    name={'primary'}
                    size={'small'}
                    variant={'text'}
                    label={'Fechar'}
                    onClick={handleClose}
                />
            </>
        }

        if (type === 'feedback-assinaturas-docusign') {
            return <>
                <div className="title">Assinaturas coletadas com sucesso!</div>
                <div className="content">Todos assinaram o Recibo de Sinal e sua venda foi entregue, agora é só acompanhar o processo.</div>
                <ButtonComponent
                    name={'primary'}
                    size={'small'}
                    variant={'text'}
                    label={'Acompanhar venda'}
                    onClick={handleIrEntregas}
                />
            </>
        }

        if (type === 'finalizar-pedido') {
            return <>
                <div className="title" style={{maxWidth: 'inherit'}}>Você finalizou o pedido solicitado!</div>
                <div className="content">O responsável pelo processo no pós-venda já recebeu a atualização do serviço.</div>
            </>
        }

        if (type === 'feedback-meu-perfil') {
            return <>
                <div className="title">
                    {
                        value === 'senha' ? 'Senha alterada'
                        : value === 'pessoa' ? 'Dados pessoais atualizados!'
                        : value === 'banco' ? 'Dados bancários atualizados!'
                        : ''
                    }
                </div>
                <div className="content" style={{maxWidth: '445px'}}>
                    {
                        value === 'senha' ? 'Você alterou sua senha.'
                        : value === 'pessoa' ? 'Seus dados foram atualizados com sucesso.'
                        : value === 'banco' ? 'Dados de pagamento atualizados com sucesso.'
                        : ''
                    }
                </div>
            </>
        }

        if (type === 'feedback-editar-boleto-financeiro') {
            return <>
                <div className="title">Boleto editado!</div>
                <div className="content" style={{maxWidth: '445px'}}>
                    Os dados do boleto de <span>{value}</span>, foram atualizados com sucesso.
                </div>
                <ButtonComponent
                    name={'primary'}
                    size={'small'}
                    variant={'text'}
                    label={'Fechar'}
                    onClick={handleClose}
                />
            </>
        }
    }

    const handleToUrl = () => {
        console.log(url);
        
        if (url) router.push(url);
        setOpen(false);
    };

    return (
        <div className={`corner ${className}`}>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                // autoHideDuration={5000}
                className='content-corner'
                onClose={handleClose}
                TransitionComponent={SlideTransition}
            >
                <section className={styles.cornerInfo}>
                    <div className={styles.header}>
                        <div className={styles.close} onClick={handleClose}>
                            <HiXMark />
                        </div>
                    </div>

                    {contentDialog()}
                </section>
            </Snackbar>
        </div>
    )
}

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction={newDirection} />;
}
