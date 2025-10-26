import AlterarStatusFinanceiro from "@/apis/postAlterarStatusFinanceiroRateio";
import ButtonComponent from "@/components/ButtonComponent";
import SimpleDialog from "@/components/Dialog";
import InputText from "@/components/InputText/Index";
import formatoMoeda from "@/functions/formatoMoedaViewApenas";
import { CornerDateType, ParcelaProcessoResponse } from "@/interfaces/Financeiro/Status";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useForm } from "react-hook-form";
import { useState } from "react";
import EmptyTextarea from "@/components/TextArea";
import AlterarStatusFinanceiroParcela from "@/apis/postAlterarStatusFinanceiroParcela";
import { Check } from "@mui/icons-material";
import { useRouter } from 'next/router';

interface DialogLiberarComissaoProps {
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
    processData?: ParcelaProcessoResponse;    
    setCornerData?: (e: CornerDateType) => void;
    retunProcess?: () => void;
}

interface UseFormType {
    date: string;
    motivo: string;
}

const DialogCancelarParcela = (props: DialogLiberarComissaoProps) => {
    const { openDialog, setOpenDialog, processData, setCornerData, retunProcess } = props;
    const imovel = processData?.dados_processo;    
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        watch,
        setValue,
        clearErrors,
        formState: { errors },
        handleSubmit,
    } = useForm<UseFormType>({
        defaultValues: {
            date: '',
            motivo: '',
        },
    });

    const cancelarParcelaApi = async (data: UseFormType) => {
        if (!data.date || !data.motivo || !processData) {
            // setError('date', { type: 'manual', message: 'Data e motivo são obrigatórios.' });
            return;
        }

        setLoading(true);
        const res = await AlterarStatusFinanceiroParcela({
            parcela_id: Number(processData.parcela.id),
            finance_status_id: 8,
            data_cancelamento: data.date,
            observacao: data.motivo,
        });

        if (res?.status) {
            setOpenDialog(false);
            retunProcess && retunProcess();
            setCornerData && setCornerData({
                open: true,
                title: 'Você cancelou a cobrança!',
                subtitle: `Você pode conferir as cobranças canceladas na aba “Cancelados” no seu painel.`,
                actionPrimary: () => setCornerData({ open: false, title: '', subtitle: '' }),
                labelPrimary: 'Continuar',
                labelSecondary: 'Ir para aba Cancelados',
                secondaryAction: () => {
                    localStorage.setItem('financeiro_submenu', '3');
                    localStorage.setItem('financeiro_menu', '0');
                    router.push(`/financeiro/`);
                },
            });
        } else {
            alert(res?.message ? "Erro: " + res.message : "Erro ao cancelar cobrança");
        }
        setLoading(false);
    };

    return (
        <SimpleDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}            
            className="dialog-cancelar-parcela"
            Footer={
                <>
                    <ButtonComponent
                        variant='text'
                        size='large'
                        label='Voltar sem cancelar'
                        name='close-dialog'
                        onClick={() => setOpenDialog(false)}
                    />
                    <ButtonComponent
                        variant='contained'
                        size='large'
                        disabled={loading}
                        label='Cancelar cobrança'
                        name='contained-red'
                        onClick={handleSubmit(cancelarParcelaApi)}
                        endIcon={<Check className="icon-check" />}
                    />
                </>
            }
        >
            <div className='content-container'>
                <h3 className="h3">Você quer mesmo cancelar a cobrança?</h3>
                <div className='row-adress'>
                    <div className="row-ico">
                        <LocationOnIcon className="icon-header" id="map-ico" />
                        <p className="p2">{imovel?.bairro}{(imovel?.bairro && imovel?.cidade) ? ' - ' : ''}{imovel?.cidade}</p>
                    </div>
                    <p className="p2 rua">{imovel?.logradouro}, {imovel?.numero}{(imovel?.unidade || imovel?.complemento) ? ' - ' : ''}{imovel?.unidade}{(imovel?.unidade && imovel?.complemento) ? ' - ' : ''}{imovel?.complemento}</p>                    
                </div>
                <div className="gerente-container">
                    <p className="s2">Gerente: <b>{processData?.dados_processo.gerente_name}</b></p>
                    
                </div>
                <InputText
                    label="Data do cancelamento*"
                    type="date"
                    error={!!errors.date?.message}
                    msgError={errors.date}
                    {...register('date', { required: 'Campo obrigatório' })}                
                />
                <EmptyTextarea
                        placeholder="Escreva aqui o motivo"
                        minRows={3}
                        label="Por que a cobrança foi cancelada?*"
                        className="textarea-motivo"
                        error={!!errors.motivo?.message}
                        msgError={errors.motivo?.message}
                        value={watch('motivo') || ''}
                        {...register('motivo', {
                            required: 'Campo obrigatório',
                            onChange: (e) => {
                                clearErrors('motivo'); // Clear error when user starts typing
                                setValue('motivo', e.target.value)
                            },
                        })}
                    />
            </div>
        </SimpleDialog>
    );
}

export default DialogCancelarParcela;