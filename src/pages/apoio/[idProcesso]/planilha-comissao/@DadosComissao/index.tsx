import ButtonComponent from "@/components/ButtonComponent";
import { CurrencyDollarIcon, PencilIcon } from "@heroicons/react/24/solid";
import Header from "../@Header";
import { Skeleton } from "@mui/lab";
import { ComissaoDataType, DadosProcessoType, ParcelasEmpresaType } from "@/interfaces/Apoio/planilhas_comissao";
import { Chip, Divider, Menu, MenuItem } from "@mui/material";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { useState } from "react";
import { useRouter } from 'next/router';
import { Check } from "@mui/icons-material";

interface PropsType {
    imovelData: DadosProcessoType | undefined
    comissionData: ComissaoDataType | undefined
    setEditComissionData: (e: 0 | 1) => void
}

export default function DadosComissao(props: PropsType) {
    const { imovelData, comissionData, setEditComissionData } = props;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [parcelaSelect, setparcelaSelect] = useState<null | ParcelasEmpresaType>(null);
    const router = useRouter();

    const handleClickButton2 = (e: React.MouseEvent<HTMLButtonElement>, parcela: ParcelasEmpresaType) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
        setparcelaSelect(parcela);
    };

    const onCloseMenu = () => {
        setAnchorEl(null);
        setparcelaSelect(null)
    };

    const redirect = (idParcela: string) => {
        const processo_id = router.query?.idProcesso || ''
        const url = router.pathname.replace('[idProcesso]', processo_id as string);
        router.push(`${url}/${idParcela}`);
    };

    return (
        <div>
            <Header urlVoltar={`/apoio`} imovel={imovelData} />
            <div className="container-planilhas">
                <div className="card-apoio dados-comissao">
                    <h4>Dados da venda</h4>

                    <div className="container-comissao">
                        <p>Comissão total</p>
                        {comissionData ? <p className="sub">{comissionData.valor_comissao_total || '---'}</p> : <Skeleton variant="rounded" width={120} height={10} />}

                        <p>Deduções</p>
                        {comissionData ? <p className="sub">{comissionData.deducao || '---'}</p> : <Skeleton variant="rounded" width={120} height={10} />}

                        <p>Comissão líquida</p>
                        {comissionData ? <p className="sub">{comissionData.valor_comissao_liquida || '---'}</p> : <Skeleton variant="rounded" width={120} height={10} />}
                    </div>

                    <div className="forma-pagamento">
                        <p>Forma de pagamento</p>
                        {comissionData ? <p className="sub">{comissionData.forma_pagamento || '---'}</p> : <Skeleton variant="rounded" width={120} height={10} />}
                    </div>

                    <div className="quantidade-pagamento">
                        <p>Tipo</p>
                        {comissionData ? <Chip label={comissionData.tipo_pagamento || '---'} className="chip green" /> : <Skeleton variant="rounded" width={120} height={10} />}<br />
                        {comissionData?.tipo_pagamento === 'Parcelada' && <Chip label={comissionData?.parcelas_empresa.length + 'x'} className="chip green" />}
                    </div>

                    <ButtonComponent name="editar" size={"medium"} variant={"outlined"} label={"Editar dados da venda"} startIcon={<PencilIcon className="svg_editar" />} onClick={() => setEditComissionData(1)} />

                </div>

                {comissionData?.parcelas_empresa.map((parcela, index) => (
                    <div className="card-apoio planilhas" key={index} onClick={() => redirect(parcela.id.toString())}>
                        <div className="card-tools">
                            {parcela.ultima_data_envio
                                ? <Chip className="chip primary" label="entregue" />
                                : <Chip className="chip orange" label="pendente" />
                            }
                            <button className="btn-ellipsis" onClick={(e) => handleClickButton2(e, parcela)}><HiEllipsisHorizontal /></button>
                        </div>
                        <div className="container-title">
                            {parcela.ultima_data_envio
                                ? <Check sx={{width: '60px', height: '60px'}} />
                                : <CurrencyDollarIcon />
                            }
                            <h5>Planilha {index + 1}</h5>
                            <p className="sub">
                                {parcela.ultima_data_envio ? `ENVIADA EM ${parcela.ultima_data_envio}` : 'PARA ENVIAR'}
                            </p>
                        </div>

                    </div>
                ))}


            </div>



            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={onCloseMenu}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {/* <li className='menu-label'>ADICIONAR</li> */}
                {/* <Divider className='menu-divider' /> */}
                <MenuItem className='menu-item' onClick={() => redirect(parcelaSelect?.id.toString() || '')}>
                    {/* <ListItemIcon>
            <HiUser fontSize="small" />
          </ListItemIcon> */}
                    Editar Planilha
                </MenuItem>
                <Divider className='menu-divider' />
                <MenuItem className='menu-item' onClick={() => router.push(`/apoio/${imovelData?.processo_id}/planilha-comissao/${parcelaSelect?.id}/visualizar`)}>
                    Visualizar Planilha
                </MenuItem>
            </Menu>
        </div>
    )
}