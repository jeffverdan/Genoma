import React, {useState, useEffect, useRef} from 'react';
import styles from './CardMessage.module.scss';
import Image from 'next/image';
import ImageMessage from '../../../../../../images/single.png';
import ImageError from '../../../../../../images/undraw_alert_re_j2op 1.svg';
import ButtonComponent from '@/components/ButtonComponent';
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/router';

interface FormValues {
    imovel: number;
    vendedores: number;
    compradores: number;
    recibo: number;
    comissao: number;
    foguete_segunda_clausula: number;
    foguete_doc_compradores: number;
    foguete_doc_vendedores: number;
    foguete_emails: number;
};

export default function CardMessage({progress} : {progress: FormValues}){
    const cardMessageRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [btnLabel, setBtnLabel] = useState('');
    const [link, setLink] = useState('');
    const [showBlock, setShowBlock] = useState(false);
    const [showButton, setshowButton] = useState(true);
    const [messageInfoDoc, setMessageInfoDoc] = useState('');

    console.log(progress);

    const docMStyle: any ={
        fontWeight: 700,
        fontSize: '20px',
        fontFamily: 'Roboto'
    }

    useEffect(() => {

        // const messageDocEntrega = async () => {
        //     const imovel = progress.imovel;

        //     if(imovel > 0 && imovel < 100){
        //         let string: any = <p style={{maxWidth: '532px'}}>Para entregar a venda, o <span style={docMStyle}>Imóvel</span> precisa ter pelo menos um documento de <span style={docMStyle}>Ônus Reais</span>, e os <span style={docMStyle}>Compradores</span> e <span style={docMStyle}>Vendedores</span> pelo menos um <span style={docMStyle}>RG, CNH e Passaporte</span>.</p>
        //         setMessageInfoDoc(string)
        //     }
        // }

        const variaveisCardMessage = async () => {
            if ((progress.compradores > 0 && progress.compradores < 100) || progress.vendedores > 0 && progress.vendedores < 100) {
                let pessoa: string = ''

                if (progress.compradores > 0 && progress.compradores < 100) {
                    pessoa = 'compradores'
                    setLink('comprador');
                    setShowBlock(true);
                } else if (progress.vendedores > 0 && progress.vendedores < 100) {
                    pessoa = 'vendedores'
                    setLink('vendedor');
                    setShowBlock(true);
                }
                else {
                    console.log(3);
                    setShowBlock(false);
                }
                setMessage('Você ainda precisa preencher os ' + pessoa + ' para conseguir gerar o rascunho do recibo de sinal!');
                setBtnLabel('Preencher dados de ' + pessoa);

            } else if (progress.imovel !== 100
                || progress.compradores !== 100
                || progress.vendedores !== 100) {
                //setMessage('Fica a dica, se você preencher a Comissão garante mais 1 Foguete na sua pontuação!');
                //setBtnLabel('Preencher dados de comissão');
                //setLink('comissao');
                setShowBlock(true);
                setshowButton(false);
            } /*else if (progress.foguete_segunda_clausula != 1) {
                setMessage('Fica a dica, se você preencher a Segunda Clausula em imóvel garante mais 1 Foguete na sua pontuação!');
                // setBtnLabel('Preencher Segunda Clausua');
                // setLink('imovel');
                setShowBlock(true);
                setshowButton(false);
            }  else if (progress.foguete_doc_vendedores != 1) {
                setMessage('Fica a dica, se você inserir todos os documentos de vendedores garante mais 1 Foguete na sua pontuação!');
                //setBtnLabel('Inserir documentos vendedores');
                setLink('vendedor');
                setshowButton(false);
                setShowBlock(true);
            } else if (progress.foguete_doc_compradores != 1) {
                setMessage('Fica a dica, se você inserir todos os documentos de compradores garante mais 1 Foguete na sua pontuação!');
                // setBtnLabel('Inserir documentos compradores');
                setLink('comprador');
                setshowButton(false);
                setShowBlock(true);
            }  else if (progress.foguete_emails != 1) {
                setMessage('Fica a dica, se você preencher os e-mails das partes envolvidas na venda, garante mais 1 Foguete na sua pontuação!');
                //setBtnLabel('Preencher dados de comissão');
                // setLink('comissao');
                setshowButton(false);
                setShowBlock(true);
            } */
            else {
                console.log(3);
                setShowBlock(false);

            }
        }
        // messageDocEntrega();
        variaveisCardMessage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    console.log(showBlock)

    const handleClick = (e: any, link: string) => {
        e.preventDefault();

        router.push(window.location.href + link);
    }

    return(
        <>
        {
            showBlock === true &&
            <>
                {
                    progress.imovel === 100 && progress.compradores === 100 && progress.vendedores === 100 
                    ? ''
                    : <div className={styles.cardMessage} style={{marginBottom: '0px'}}>
                            <div className={styles.content}>
                                <div className={styles.info}>
                                    <Image 
                                        width="90"
                                        height="100"
                                        src={ImageError}
                                        alt={'undraw_alert_re_j2op'}
                                    />
                                    <p style={{maxWidth: '100%'}}>
                                        Para concluir a entrega da venda, é obrigatório incluir a <span style={docMStyle}>Ônus reais</span> do imóvel e <span style={docMStyle}>ao menos um documento oficial com foto</span> (RG, CNH ou passaporte) dos compradores e vendedores referentes ao processo.</p>
                                </div>
                            </div>
                        </div>
                }
                
                {/* <div className={styles.cardMessage}>
                    <div className={styles.content}>
                        <div className={styles.info}>
                            <Image 
                                width="90"
                                height="100"
                                src={ImageMessage}
                                alt={'undraw_appreciate_it_re_yc8h'}
                            />

                            <p>{message}</p>
                        </div>
                    { showButton === true &&
                        <div className={styles.button}>
                            
                            <ButtonComponent 
                                name="secondary"
                                size="medium"
                                label={btnLabel}
                                startIcon={""}
                                endIcon={<ArrowRightIcon className="icon icon-left" />}
                                disabled={false}
                                error={false}
                                variant="text"
                                onClick={(e) => handleClick(e, link)}
                            />
                        </div>
                        }
                    </div>
                </div> */}
            </>
        }
        </>
    )
}
