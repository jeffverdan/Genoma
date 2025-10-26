import ShowDocument from '@/apis/getDocument';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { Chip, Link } from '@mui/material';
import ButtonComponent from '@/components/ButtonComponent';
import { HiPencil } from 'react-icons/hi2';
import UploadDocumentos from '@/components/UploadDocumentos';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormValues from '@/interfaces/Vendas/EntregarVenda'
import styles from './BlockStyles.module.scss'
import Collapse from '@mui/material/Collapse';

interface Props {
    imovelData: imovelDataInterface
    returnData: any
}

const ReciboAssinado = ({ imovelData, returnData }: Props) => {
    const perfil = localStorage.getItem('perfil_login');
    const [multiDocs, setMultiDocs] = useState<any>([]);
    const [addRecibo, setAddRecibo] = useState<boolean>(false);
    const [block, setBlock] = useState<boolean>(false);
    const dataContext = {
        dataProcesso: imovelData,
        selectItem: '',
        idProcesso: imovelData.id || '',
        multiDocs,
        setMultiDocs
    };

    const {
        register,
        watch,
        setValue,
        formState: { errors },
        handleSubmit,
        clearErrors,
        setError,
        setFocus,
    } = useForm<FormValues>({
        defaultValues: {
            imovel_id: imovelData.imovel_id,
            processo_id: imovelData.id,
            informacao_imovel_id: imovelData.informacao?.id,
            prazo_type: imovelData.imovel?.informacao?.tipo_dias,
            reciboType: 'manual',
            data_assinatura: '',
            prazo_escritura: '',
            posvenda_franquia: '0',
            valor_comissao_liquida: imovelData.comissao?.valor_comissao_liquida,
            deducao: imovelData.comissao?.deducao,
            valor_comissao_total: imovelData.comissao?.valor_comissao_total,
            emailCheck: '0',
            data_previsao_escritura: '',
            observacao: '',
        }
    });
    const handleShow = async (tipo_exibir: number) => {
        console.log(tipo_exibir);
        if (tipo_exibir) {
            setBlock(true);
        } else {
            setBlock(false);
        }

        returnData();

    }
    return (
        <div className='detalhes-content venda'>
            <h2>Recibo de Sinal assinado</h2>
            <div>
                <Chip className='chip green' label={imovelData.informacao?.recibo_type === 'manual' ? 'Manual' : 'Docusign'} />
            </div>
            <div className='content-container'>
                <div className='row'>
                    <div className='sub-container'>
                        <p className='subtitle'>Tipo de entrega</p>
                        <p className='content'>
                            {imovelData.informacao?.recibo_type === 'manual'
                                ? 'Assinaturas coletadas manualmente.'
                                : 'Assinaturas coletadas pelo DocuSign.'
                            }
                        </p>
                    </div>
                    <div className='sub-container'>
                        <p className='subtitle'>Data de assinatura</p>
                        <p className='content'>{imovelData.informacao?.data_assinatura}</p>
                    </div>
                </div>
            </div>
            <p className="title">Arquivo do recibo</p>
            <Collapse orientation="vertical" in={block === false} collapsedSize={0}>
                <div className='content-container'>
                    <div className='sub-container'>
                        <p className='subtitle'>Nome do arquivo</p>
                        <Link className='link' onClick={() => ShowDocument(imovelData.imovel_id || '', 'recibo')} >
                            {imovelData.informacao?.recibo}
                        </Link>
                    </div>
                </div>
                {
                    (perfil === 'Backoffice' || perfil === 'Coordenadora de Pós-Negociação') &&
                    <div className="btn-edit-detalhe">
                        <ButtonComponent
                            size={'large'}
                            variant={'text'}
                            startIcon={<HiPencil size={20} />}
                            label={'Editar'}
                            onClick={e => handleShow(1)}
                        />
                    </div>
                }
            </Collapse>
            <Collapse orientation="vertical" in={block === true} collapsedSize={0}>


                <p className='subtitle'>Documentos apenas em .pdf.</p>
                <div className='upload'>
                    <UploadDocumentos
                        context={dataContext}
                        pessoa="imovel"
                        idDonoDocumento={imovelData.imovel_id}
                        register={register}
                        errors={errors}
                        option={[{
                            id: 8,
                            nome: "recibo",
                            tipo: 'imóvel',
                            validade_dias: null
                        }]}
                        setAddRecibo={setAddRecibo}
                    />

                    {
                        // Quando for Backoffice
                        perfil === 'Backoffice' &&
                        <footer className={styles.footerControls} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <ButtonComponent
                                    size={"large"}
                                    variant={"text"}
                                    name={"previous"}
                                    label={"Voltar"}
                                    onClick={e => handleShow(0)} /*goToPrevSlide(index)*/
                                />
                            </div>
                        </footer>
                    }

                </div>
            </Collapse>
        </div >



    )
};

export default ReciboAssinado;