import AlterarStatusFinanceiro from "@/apis/postAlterarStatusFinanceiroRateio";
import ButtonComponent from "@/components/ButtonComponent";
import SimpleDialog from "@/components/Dialog";
import formatoMoeda from "@/functions/formatoMoedaViewApenas";
import { ParcelaProcessoResponse } from "@/interfaces/Financeiro/Status";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useState } from "react";

interface DialogLiberarComissaoProps {
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
    processData?: ParcelaProcessoResponse; // Replace with appropriate type
    usuarioId: number | null; 
}

const DialogLiberarComissao = ({ openDialog, setOpenDialog, processData, usuarioId }: DialogLiberarComissaoProps) => {
    const imovel = processData?.dados_processo;
    const pessoa = processData?.usuarios_agrupado.find((e) => e.usuario_id === usuarioId);
    const [loading, setLoading] = useState(false);

    const alterarStatusApi = async () => {
        if(usuarioId === null || processData?.parcela.id === undefined) return ''
        setLoading(true);
        const res = await AlterarStatusFinanceiro({
            usuario_id: usuarioId,
            financeiro_id: localStorage.getItem('usuario_id') || '',
            parcela_id: Number(processData.parcela.id),
            finance_status_id: 10 // "Liberado"
        })
        if(res?.status) {
            setOpenDialog(false);
            window.location.reload(); // Refresh the page to reflect changes
        } else {
            alert(res?.message || "Erro ao liberar comissão");
        }
        setLoading(false);
    };

    return (
        <SimpleDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}            
            className="dialog-liberar-comissao"
            Footer={
                <>
                    <ButtonComponent
                        variant='text'
                        size='large'
                        label='Voltar sem liberar'
                        name='close-dialog'
                        onClick={() => setOpenDialog(false)}
                    />
                    <ButtonComponent
                        variant='contained'
                        size='large'
                        disabled={loading}
                        label='Confirmar liberação'
                        labelColor="white"
                        name='confirm-dialog'
                        onClick={alterarStatusApi}
                    />
                </>
            }
        >
            <div className='content-container'>
                <h3 className="h3">Confirme a comissão a ser liberada</h3>
                <div className='row-adress'>
                    <div className="row-ico">
                        <LocationOnIcon className="icon-header" id="map-ico" />
                        <p className="p2">{imovel?.bairro}{(imovel?.bairro && imovel?.cidade) ? ' - ' : ''}{imovel?.cidade}</p>
                    </div>
                    <p className="p2 rua">{imovel?.logradouro}, {imovel?.numero}{(imovel?.unidade || imovel?.complemento) ? ' - ' : ''}{imovel?.unidade}{(imovel?.unidade && imovel?.complemento) ? ' - ' : ''}{imovel?.complemento}</p>
                </div>
                <div className="gerente-container">
                    <p className="s2">Beneficiado:</p>
                    <p className="p2">{pessoa?.nome}</p>
                </div>
                <div className="card-valor">
                    <p className="s2">Valor liberado:</p>
                    <div className="valor">
                        <p className="p2">R$</p>
                        <p className="p2 valor-number">{formatoMoeda(pessoa?.valor_total).replace("R$", '')}</p>
                    </div>                    
                </div>
            </div>
        </SimpleDialog>
    );
}

export default DialogLiberarComissao;