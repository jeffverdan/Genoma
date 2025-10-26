import ParcelaProcessoById from "@/apis/getParcela_Processo";
import { ParcelaProcessoResponse, UserToPayType } from "@/interfaces/Financeiro/Status";
import { Chip, Tooltip } from '@mui/material';
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Header from '@/components/DetalhesVenda/Header';
import HeadSeo from "@/components/HeadSeo";
import EmptyTextarea from "@/components/TextArea";
import { useForm } from "react-hook-form";
import InputText from "@/components/InputText/Index";
import formatoMoeda from "@/functions/formatoMoeda";
import formatoMoedaView from "@/functions/formatoMoedaViewApenas";
import UploadDocumentos from '@/components/UploadDocumentos';
import { MultiDocsType } from "@/components/UploadDocumentos/Interfaces";
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import ButtonComponent from "@/components/ButtonComponent";
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import TransferirComissao from "@/apis/postTransferirComissaoFinanceiro";
import SaveComprovanteTransferencia from "@/apis/postSaveComprovanteTransf";

interface TransferirParcelaProps {
    idProcesso: string;
    idParcela: string;
    type: string;
    id: string;
}

interface UseFormType {
    valor_rateio: string;
    data_rateio: string;
    observacao: string;
    comprovante_transferencia: string;
}

type ContextType = {
    dataProcesso: imovelDataInterface,
    idProcesso: string,
    multiDocs: MultiDocsType[],
    setMultiDocs: (e: MultiDocsType[]) => void,
    setProgress?: (e: number) => void,
    setRes?: (e: any) => void,
}

const TransferirParcela = (props: TransferirParcelaProps) => {
    const { idProcesso, idParcela, type, id } = props;
    const [processData, setProcessData] = useState<ParcelaProcessoResponse>();
    const [loading, setLoading] = useState(true);
    const [userSelected, setUserSelected] = useState<UserToPayType>();
    const router = useRouter();
    const [multiDocs, setMultiDocs] = useState<MultiDocsType[]>([]);
    const [progress, setProgress] = useState<number>(0);
    const [dataProcesso, setDataProcesso] = useState<imovelDataInterface>({} as imovelDataInterface);

    const context: ContextType = {
        dataProcesso,
        idProcesso,
        multiDocs, setMultiDocs,
        setProgress,
    };

    const {
        register,
        watch,
        setValue,
        setError,
        clearErrors,
        reset,
        formState: { errors },
        handleSubmit,
    } = useForm<UseFormType>({
        defaultValues: {
            valor_rateio: '',
            data_rateio: '',
            comprovante_transferencia: '',
            observacao: '',
        },
    });

    useEffect(() => {
        requestAnimationFrame(() => {
            const scroller = document.querySelector<HTMLDivElement>("#__next");
            scroller?.scrollTo({ top: 0, behavior: "smooth" });
        });
    }, []);

    const retunProcess = async () => {
        setLoading(true);
        const req = { processo_id: idProcesso, parcela_id: idParcela };
        const res = await ParcelaProcessoById(req);
        setProcessData(res);
        if (res) {
            if (res.usuarios_agrupado && res.usuarios_agrupado.length > 0) {
                const userID = type === 'usuario' ? 'usuario_id' : 'empresa_id';
                const user = res.usuarios_agrupado.find(u => (u[userID]?.toString() === id));
                if (user) {
                    setUserSelected(user);
                    // setValue('valor_rateio', user.valor_a_receber || '');
                } else {
                    alert('Usuário não encontrado para essa parcela.');
                    setTimeout(() => {
                        router.push('/financeiro/' + idProcesso + '/' + idParcela + '/status');
                    }, 3000);
                }
            }
            // setComissao(res.comissao_geral);
        }
        setLoading(false);
    };

    const salvarSair = async () => {
        router.push('/financeiro');
    };

    const onVoltar = () => {
        router.back();
    };

    useEffect(() => {
        retunProcess();
    }, [idProcesso, idParcela]);

    const TooltipRateioContainer = (userSelected: UserToPayType) => {

        return (
            <div className="tooltip-rateio-container">
                <p className="p1">Valor restante: </p>
                <Chip className="chip orange" label={formatoMoedaView(userSelected?.valor_faltante)} />
                <p className="p1">Valor transferido: </p>
                <Chip className="chip primary" label={formatoMoedaView(userSelected?.valor_transferido)} />
                <p className="p1">Valor total:</p>
                <Chip className="chip green" label={formatoMoedaView(userSelected?.valor_total)} />
            </div>
        )
    };

    console.log(multiDocs);


    const saveRateio = async (data: UseFormType) => {
        setLoading(true);

        if (!userSelected) {
            return router.back();
        }
        const response = await TransferirComissao({
            usuario_id: id,
            parcela_id: idParcela,
            observacao: data.observacao,
            valor_transferido: data.valor_rateio,
            data_transferencia: data.data_rateio,
            tipo: userSelected.tipo,
            valor_total: formatoMoedaView(userSelected.valor_total),
            empresa_id: userSelected.empresa_id || '',
            documento_id: multiDocs[0].id,
            financeiro_id: localStorage.getItem('usuario_id') || ''

        });
        if (response) {
            router.back();
        } else {
            setLoading(false);
        }
    };

    console.log(errors);

    useEffect(() => {
        if (multiDocs.length > 0) {
            const doc = multiDocs[0];
            setValue('comprovante_transferencia', doc.id.toString());
            clearErrors('comprovante_transferencia');
        }
    }, [multiDocs])

    return (
        <div className="financeiro-transferir">
            <HeadSeo titlePage={"Status Parcela"} description="" />
            <Header
                imovel={processData?.dados_processo || {}}
                urlVoltar={'/financeiro/' + idProcesso + '/' + idParcela + '/status'}
                salvarSair={salvarSair}
                onVoltar={onVoltar}
            />
            <div className="content-container">
                <div className="card-transferir rateio">
                    <div className="header-rateio">
                        <h3 className="h3">Transferência de rateio</h3>
                        {userSelected &&
                            <Tooltip
                                title={TooltipRateioContainer(userSelected)}
                                placement="bottom"
                                arrow
                                slotProps={{
                                    tooltip: { className: 'tooltip-rateio' }
                                }}
                            >
                                <Chip className="chip orange" label={formatoMoedaView(userSelected?.valor_faltante)} />
                            </Tooltip>
                        }
                    </div>
                    <div className="info-bancarias">
                        <span className="s2">Informações bancárias:</span>
                        <div className="grid-table">
                            <div>
                                <p className="p2">Nome completo</p>
                                <p className="p2 sub">{userSelected?.nome || '---'}</p>
                            </div>
                            <div>
                                <p className="p2">CPF</p>
                                <p className="p2 sub">{userSelected?.cpf_cnpj || '---'}</p>
                            </div>
                            <div className="empty"></div>
                            <div className="empty"></div>
                            <div className="empty"></div>

                            <div>
                                <p className="p2">Método</p>
                                <p className="p2 sub">{userSelected?.dados_bancarios?.pix ? 'PIX' : 'Banco'}</p>
                            </div>

                            {userSelected?.dados_bancarios?.pix
                                ? <>
                                    <div>
                                        <p className="p2">Chave PIX</p>
                                        <p className="p2 sub">{userSelected?.dados_bancarios?.pix || '---'}</p>
                                    </div>
                                    <div className="empty"></div>
                                    <div className="empty"></div>
                                </>
                                : <>
                                    <div>
                                        <p className="p2">Cód.</p>
                                        <p className="p2 sub">{userSelected?.dados_bancarios?.banco_id || '---'}</p>
                                    </div>
                                    <div>
                                        <p className="p2">Instituição</p>
                                        <p className="p2 sub">{userSelected?.dados_bancarios?.banco_id || '---'}</p>
                                    </div>
                                    <div>
                                        <p className="p2">Agência</p>
                                        <p className="p2 sub">{userSelected?.dados_bancarios?.agencia || '---'}</p>
                                    </div>
                                    <div>
                                        <p className="p2">Conta</p>
                                        <p className="p2 sub">{userSelected?.dados_bancarios?.numero_conta || '---'}</p>
                                    </div>
                                </>
                            }
                        </div>

                    </div>
                    <div className="row-inputs">
                        <InputText
                            label="Valor do rateio*"
                            placeholder="R$ 0,00"
                            // className="input-valor"
                            msgError={errors.valor_rateio}
                            error={!!errors.valor_rateio?.message}
                            sucess={!!watch('valor_rateio')}
                            value={watch('valor_rateio') || ''}
                            {...register('valor_rateio', {
                                required: 'Valor é obrigatório',
                                // onChange: (e) => {
                                //     const value = e.target.value
                                //     setValue('valor_rateio', value);
                                //     clearErrors('valor_rateio');
                                // },
                                setValueAs: (value) => formatoMoeda(value),
                            })}
                        />

                        <InputText
                            label="Data do rateio*"
                            type="date"
                            // className="input-data"
                            error={!!errors.data_rateio?.message}
                            msgError={errors.data_rateio}
                            sucess={!!watch('data_rateio')}
                            value={watch('data_rateio') || ''}
                            {...register('data_rateio', {
                                required: 'Data é obrigatória',
                            })}
                        />
                    </div>

                </div>

                <div className="card-transferir comprovante">
                    <h3 className="h3">Comprovante de transferência</h3>

                    <div className="upload-container">
                        <UploadDocumentos
                            register={register}
                            errors={errors}
                            context={context}
                            pessoa="comprovante_transferencia"
                            idParcela={idParcela}
                            tipo={userSelected?.tipo}
                            idDonoDocumento={id}
                            option={[
                                { id: 1, nome: 'Comprovante de transferência', tipo: 'comissao', validade_dias: null }
                            ]}
                        />
                        {/* INPUT HIDDEN PARA VALIDAR O DOCUMENTO */}
                        <input
                            type="hidden"
                            {...register('comprovante_transferencia', {
                                validate: () => {
                                    if (multiDocs.length === 0) {
                                        setError('comprovante_transferencia', { message: 'Comprovante é obrigatório' });
                                        return false;
                                    } else {
                                        clearErrors('comprovante_transferencia');
                                        return true;
                                    }
                                },
                            })}
                        />
                        {errors.comprovante_transferencia &&
                            <span className="errorMsg">{'*Comprovante é obrigatório'}</span>
                        }

                    </div>


                </div>

                <div className="card-transferir observacoes">
                    <div>
                        <h3 className="h3">Observação para o gerente</h3>
                        <p className="p1">As informações colocadas abaixo serão enviadas ao gerente juntamente com a notificação de mudança de status.</p>
                    </div>
                    <EmptyTextarea
                        placeholder="Digite aqui a observação para o gerente"
                        minRows={3}
                        label="Escreva a observação livremente"
                        className="textarea-observacao"
                        value={watch('observacao') || ''}
                        {...register('observacao', {
                            onChange: (e) => setValue('observacao', e.target.value),
                        })}
                    />
                </div>

            </div>

            <footer>
                <ButtonComponent
                    variant='contained'
                    label='Confirmar transferência'
                    labelColor='white'
                    size='large'
                    disabled={loading}
                    endIcon={<ArrowRightIcon />}
                    onClick={handleSubmit((data) => saveRateio(data))}
                />
            </footer>

        </div>
    );
}

// EXECUTA ANTES
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso, idParcela, type, id } = context.params as { idProcesso: string, idParcela: string, type: string, id: string };
    return { props: { idProcesso, idParcela, type, id } };
};

export default TransferirParcela;