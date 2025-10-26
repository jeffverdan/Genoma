import { ItemListRecentsType } from '@/interfaces/Corretores'
import { Chip, Skeleton } from '@mui/material';
import convertReal from '@/functions/converterReal';
import React from 'react'

type IProps = {
    dadosParcela: ItemListRecentsType | null
}

export default function ValorDetalhado({dadosParcela} : IProps) {
    return (
        <div className="info-container">
            <>
                <div className="item-detalhado">
                    <div className="title-item-detalhado">
                        Valor detalhado:
                    </div>

                    <div className="grid">
                        {
                            dadosParcela?.valor_gerente !== null &&
                            <div className="row">
                                <div className="head">
                                    <div className="papel">Gerente</div>
                                    {dadosParcela ? <Chip className="chip neutral" label={`${dadosParcela?.porcentagem_real_gerente || 0}%`} /> : <Skeleton width={50} animation="wave" />}
                                </div>
                                <div className="col">
                                    <div className="titulo">Porcentagem</div>
                                    <div className="titulo">Valor de rateio</div>
                                </div>
                                <div className="col">
                                    {dadosParcela ? <div className="titulo">{dadosParcela?.porcentagem_comissao_gerente || 0}%</div> : <Skeleton width={50} animation="wave" />}
                                    {dadosParcela ? <div className="valor">R$ {convertReal(dadosParcela?.valor_gerente ?? 0)}</div> : <Skeleton width={100} animation="wave" />}
                                </div>
                            </div>
                        }

                        {
                            dadosParcela?.valor_gg !== null &&
                            <div className="row">
                                <div className="head">
                                    <div className="papel">Gerente Geral</div>
                                    {dadosParcela ? <Chip className="chip neutral" label={`${dadosParcela?.porcentagem_real_gg || 0}%`} /> : <Skeleton width={10} animation="wave" />}
                                </div>
                                <div className="col">
                                    <div className="titulo">Porcentagem</div>
                                    <div className="titulo">Valor de rateio</div>
                                </div>
                                <div className="col">
                                    {dadosParcela ? <div className="titulo">{dadosParcela?.porcentagem_comissao_gg || 0}%</div> : <Skeleton width={50} animation="wave" />}
                                    {dadosParcela ? <div className="valor">R$ {convertReal(dadosParcela?.valor_gg ?? 0)}</div> : <Skeleton width={100} animation="wave" />}
                                </div>
                            </div>
                        }

                        {
                            dadosParcela?.valor_corretor !== null &&
                            <div className="row">
                                <div className="head">
                                    <div className="papel">Corretor</div>
                                    {dadosParcela ? <Chip className="chip neutral" label={`${dadosParcela?.porcentagem_real_corretor || 0}%`} /> : <Skeleton width={10} animation="wave" />}
                                </div>
                                <div className="col">
                                    <div className="titulo">Porcentagem</div>
                                    <div className="titulo">Valor de rateio</div>
                                </div>
                                <div className="col">
                                    {dadosParcela ? <div className="titulo">{dadosParcela?.porcentagem_comissao_corretor || 0}%</div> : <Skeleton width={50} animation="wave" />}
                                    {dadosParcela ? <div className="valor">R$ {convertReal(dadosParcela?.valor_corretor ?? 0)}</div> : <Skeleton width={100} animation="wave" />}
                                </div>
                            </div>
                        }

                        {
                            dadosParcela?.valor_opcionista !== null &&
                            <div className="row">
                                <div className="head">
                                    <div className="papel">Opcionista</div>
                                    <Chip className="chip neutral" label={`${dadosParcela?.porcentagem_real_opcionista || 0}%`}/>
                                </div>
                                <div className="col">
                                    <div className="titulo">Porcentagem</div>
                                    <div className="titulo">Valor de rateio</div>
                                </div>
                                <div className="col">
                                    <div className="titulo">{dadosParcela?.porcentagem_comissao_opcionista || 0}%</div>
                                    <div className="valor">R$ {convertReal(dadosParcela?.valor_opcionista ?? 0)}</div>
                                </div>
                            </div>
                        }

                        {
                            dadosParcela?.valor_diretor !== null &&
                            <div className="row">
                                <div className="head">
                                    <div className="papel">Diretor Comercial</div>
                                    {/* <Chip className="chip neutral" label={`${dadosParcela?.porcentagem_real_diretor || 0}%`}/> */}
                                </div>
                                <div className="col">
                                    {/* <div className="titulo">Porcentagem</div> */}
                                    <div className="titulo">Valor de rateio</div>
                                </div>
                                <div className="col">
                                    {/* <div className="titulo">{dadosParcela?.porcentagem_comissao_diretor || 0}%</div> */}
                                    <div className="valor">R$ {convertReal(dadosParcela?.valor_diretor ?? 0)}</div>
                                </div>
                            </div>
                        }

                        <div className="row">
                            <div className="col">
                                <div className="titulo-total">Total da comissão</div>
                            </div>

                            <div className="col">
                                {dadosParcela ? <div className="valor-total">R$ {convertReal(dadosParcela?.soma ?? 0)}</div> : <Skeleton width={100} animation="wave" />}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </div>
    )
}
