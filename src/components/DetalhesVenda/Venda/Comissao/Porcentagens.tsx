import React, { useEffect, useState } from 'react';
import formatoMoeda from '@/functions/formatoMoeda';
import { comissaoEnvolvidos, comissaoType, ParcelasComissionType, ParcelasUserComissionType } from '@/interfaces/Imovel/comissao';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { Chip } from '@mui/material';

interface Props {
    imovelData: imovelDataInterface
};

interface CamposProps {
    label: string
    parcelas: ParcelasComissionType[] | []
    arrkey: "gerentes_gerais" | "gerentes" | "corretores_vendedores" | "corretores_opcionistas"
}

const ReturnCampos = (props: CamposProps) => {
    const { label, parcelas, arrkey } = props;
    const grupo = parcelas[0][arrkey];

    return (
        <>
            {grupo[0] &&
                <div className='content-container'>
                    <div className='label'>
                        <p className='title'>{label}</p>
                        {grupo[0]?.total_comissao && <Chip className='chip green' label={`Total = ${grupo[0]?.total_comissao}%`} />}
                        {grupo[0]?.tipo_laudo_opcionista_label && <Chip className='chip neutral' label={grupo[0]?.tipo_laudo_opcionista_label} />}
                    </div>
                    {parcelas.sort((a, b) => Number(a.planilha_id) - Number(b.numero_parcela)).filter((e) => !!e[arrkey][0]).map((parcela, index) => (
                        <>
                            <Chip className='chip' label={`Parcela ${parcela.numero_parcela || index + 1}`} />
                            <div className='grid coll4'>
                                <p>Nome completo</p>
                                <p>Porcentagem</p>
                                <p>Valor</p>
                                <p>Pagamento</p>

                                {parcela[arrkey]?.map((pessoa) => (
                                    <>
                                        <p className='content'>{pessoa.tipo_pessoa === "PF" ? pessoa.name : pessoa.nome_empresarial}</p>
                                        <p className='content'>{pessoa.porcentagem_real || "--- "}%</p>
                                        <p className='content'>{formatoMoeda(pessoa.valor_real || '---') || "---"}</p>
                                        {pessoa.tipo_pagamento === 'pix'
                                            ?
                                            <div className='pix'>
                                                <Chip className='chip neutral' label={"PIX"} />
                                                {pessoa.chave_pix && <Chip className='chip neutral' label={pessoa.chave_pix} />}
                                                {pessoa.pix && <Chip className='chip neutral' label={pessoa.pix} />}
                                            </div>
                                            :
                                            <div className='banco'>
                                                <Chip className='chip neutral' label={"BANCO"} />
                                                {pessoa.nome_banco && <Chip className='chip neutral' label={pessoa.nome_banco} />}
                                                {pessoa.agencia && <Chip className='chip neutral' label={pessoa.agencia} />}
                                                {pessoa.numero_conta && <Chip className='chip neutral' label={pessoa.numero_conta} />}
                                            </div>
                                        }
                                    </>
                                ))}
                            </div>
                        </>
                    ))}
                </div>
            }
        </>
    )
}


const Porcentagens = ({ imovelData }: Props) => {
    const parcelas = imovelData.comissao?.parcelas_comissao || [];
    const arrComssoes = [
        { label: 'Gerente Geral', key: 'gerentes_gerais' },
        { label: 'Gerente', key: 'gerentes' },
        { label: 'Corretor Vendedor', key: 'corretores_vendedores' },
        { label: 'Corretor Opcionista', key: 'corretores_opcionistas' },

    ] as const;

    console.log(arrComssoes);

    return (
        <div className='detalhes-content venda'>
            <h2>Porcentagens</h2>
            {arrComssoes.map((grupo) => (
                <ReturnCampos label={grupo.label} parcelas={parcelas} arrkey={grupo.key} key={grupo.key} />
            ))}
        </div>
    )
};

export default Porcentagens;