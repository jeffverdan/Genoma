import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import Header from '../../../../components/@Header';
import PostDadosParcelaUsuario from '@/apis/postDadosParcelaUsuario';
import { ItemListRecentsType } from '@/interfaces/Corretores';
import { Chip, Skeleton } from '@mui/material';
import CheckBox from '@/components/CheckBox';
import ButtonComponent from '@/components/ButtonComponent';
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import postConfirmarTransferencia from '@/apis/postConfirmarTransferencia';
import MobileNavPage from '@/pages/corretor/components/MobileNavPage';
import convertReal from '@/functions/converterReal';
import ValorDetalhado from '@/pages/corretor/components/@ValorDetalhado';

export default function SolicitarTransferencia() {
    const router = useRouter();
    const { idCorretor, slug, id } = router.query;
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [dadosParcela, setDadosParcela] = useState<ItemListRecentsType | null>(null);
    const [checkConcordo, setCheckConcordo] = useState(false);
    const [btnDisabled, setbtnDisabled] = useState(true);

    const returnValores = async () => {
        setLoading(true)
        if (router.isReady && slug) {
            if(slug !== 'parcela') {
                router.push('/corretor');
            }
            else{
                if(slug === 'parcela'){
                    const response: any = await PostDadosParcelaUsuario(id as string);
                    console.log('response: ', response)

                    if(response?.finance_status_id !== '10'){
                        router.push(`/corretor/${idCorretor}/${slug}/${id}/`)
                    }
                    else{
                        if(response){      
                            setDadosParcela(response);     
                            setCheckConcordo(response?.concorda_valor === 1 ? true : false || false);
                            setbtnDisabled(response?.concorda_valor === 1 ? false : true || true)
                            setLoading(false)
                        }
                        else{
                            setLoading(true)
                            setMessage('Erro ao retornar dados da venda')
                        }
                    }
                }
            }
        }
    }

    useEffect(() => {
       returnValores()
    }, [router.isReady, slug])

    console.log('DADOS PARCELA: ', dadosParcela)

    const handleCheck = (e: any) => {
        const checked = e.target.checked;
        setCheckConcordo(checked);
        setbtnDisabled(checked ? false : true);
    }

    const handleConfirm = async () => {
        const data = await postConfirmarTransferencia(Number(id), checkConcordo ? '1' : '0', dadosParcela?.soma);
        if(data){
            router.push(`/corretor/${idCorretor}/${slug}/${id}/upload-nota`)
        }
        else{
            router.push(`/corretor`)
        }
        
    }

    return (
        <>
            <Header data={dadosParcela} />
            <div className="corretor inicial-page">
                <div className="detalhes-container">
                    <div className="confirmar-container">
                        <div className="card-container">                 
                            <span className="title" style={{fontSize: '24px', marginBottom: '15px'}}>Confirme o valor:</span>
                            <Chip label={`${dadosParcela?.soma_porcentagem || 0}%`} className="chip default" />
                            <span className="title">Valor a receber</span>
                            <div className="valor">
                                {
                                    dadosParcela?.soma
                                    ?
                                        <>
                                            <span className="moeda">R$</span>
                                            <span className="valor-numero">
                                                {convertReal(dadosParcela?.soma)}
                                            </span>
                                        </>
                                    :
                                    <Skeleton width={180} animation="wave" />
                                }
                                
                            </div>

                            <div className="checkBox">
                                <CheckBox
                                    label={`Eu concordo com o valor`}
                                    value={checkConcordo ? '1' : '0'}
                                    checked={checkConcordo}
                                    onChange={(e) => handleCheck(e)}
                                    disabled={dadosParcela ? false : true}
                                />
                            </div>

                            <ButtonComponent
                                name="confirm"
                                variant="contained"
                                onClick={(e) => handleConfirm()}
                                labelColor="white"
                                size={"large"}
                                label={"Confirme e envie a nota"}
                                endIcon={<ArrowRightIcon width={20} height={20} />}
                                disabled={btnDisabled}
                            />
                        </div>

                        <ValorDetalhado dadosParcela={dadosParcela} />

                        <div className="card-container" style={{marginBottom: '60px'}}>                 
                            <span className="title" style={{width: '100%', textAlign: 'left'}}>O que fazer se eu não concordar com o valor?</span>
                            <p style={{width: '100%', textAlign: 'left'}}>Se você não concorda com o valor a ser recebido, entre em contato com seu Gerente Geral.</p>
                        </div>
                    </div>  
                </div>

                <MobileNavPage slug={slug} /> 
            </div>
        </>
    )
}
