import React, { useState, useContext, useEffect, ReactElement } from 'react';

import Foguetes from '@/components/Foguetes';

import imovelDataInterface from '@/interfaces/Imovel/imovelData'
import dayjs from 'dayjs';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Chip, Divider, Paper } from '@mui/material';
import { comissaoEnvolvidos } from '@/interfaces/Imovel/comissao';

interface props {
  imovelData: imovelDataInterface
}

interface propsCampo {
  title: string
  subtitle: string | number | undefined
}

interface propsComissaoEnvolvidos {
  data: comissaoEnvolvidos
}

const Campo = (props: propsCampo) => {
  return (
    <div>
      <p className='title'>{props.title}</p>
      <p className='subtitle'>{props.subtitle}</p>
    </div>
  )
};

const ComissaoEnvolvidos = (props: propsComissaoEnvolvidos) => {
  const { data } = props;

  return (
    <>
      <Divider />
      <div className='row'>
        <Campo title='Nome completo' subtitle={data.name} />
        <Campo title='Creci' subtitle={data.creci || "---"} />
      </div>

      <div className='row'>
        <Campo title='Pocentagem' subtitle={data.porcentagem_real + "%"} />
        <Campo title='Desconto' subtitle={data.desconto ? ("R$ " + data.desconto) : "---"} />
        <Campo title='Valor' subtitle={"R$ " + data.valor_real} />
      </div>


      <div className='row'>
        <Campo title='Banco' subtitle={data.nome_banco || "---"} />
        <Campo title='Agencia' subtitle={data.agencia || "---"} />
        <Campo title='Conta' subtitle={data.numero_conta || "---"} />
      </div>

      <div className='row'>
        <Campo title='Pix' subtitle={data.pix || "---"} />
      </div>
    </>
  )
}

const ResumoComissao = (props: props) => {

  const comissao = props?.imovelData?.comissao;

  const returnPagamento = (liquida?: string) => {
    switch (liquida) {
      case 'especie':
        return 'Espécie'
      case 'deposito':
        return 'Depósito'
      case 'ted_doc':
        return 'TED/DOC'
      case 'pix':
        return 'PIX'
      case 'cheque':
        return 'Cheque/Cheque adm.'
    };
  };
  
  const laudoOptions = [
    { label: "Simples", value: "simples", porcentagem: 16 },
    { label: "Com chave", value: "com_chave", porcentagem: 18 },
    { label: "Exclusividade", value: "exclusividade", porcentagem: 20 },
    { label: "Lançamentos", value: "lançamento", porcentagem: 8 },
  ];

  return (
    <>
      {comissao?.id ?
        <div className='resumo-comissao'>
          <Paper className='paper'>
            <h4>Dados gerais da comissão</h4>
            <div className='row'>
              <Campo title='Tipo' subtitle={comissao?.comissao === "partes" ? "Parcelada" : "Integral"} />
            </div>

            <div className='row'>
              <Campo title='Total' subtitle={comissao.valor_comissao_total} />
              <Campo title='Deduções' subtitle={comissao.deducao} />
              <Campo title='Liquida' subtitle={comissao.valor_comissao_liquida} />
            </div>

            <div className='row'>
              <Campo title='Forma de pagamento' subtitle={returnPagamento(comissao.liquida)} />
              <Campo title='Quant. de parcelas' subtitle={comissao.parcelas_empresa?.length || '1'} />
            </div>

            {comissao.parcelas_empresa?.map((parcela, index) => (
              <div className='row' key={index}>
                <Campo title={index + 1 + "ª parcela"} subtitle={parcela.valor_parcela} />
                <Campo title={"Período de pagamento"} subtitle={parcela.nome_periodo} />

              </div>
            ))}

            <div className='row'>
              <Campo title='Observações' subtitle={comissao.observacoes || '---'} />
            </div>
          </Paper>

          <Paper className='paper'>
            <h4>Dados {comissao.comissao_gerente_gerais?.[1] ? "dos gerentes gerais" : "do gerente geral"}</h4>
            <div className='row'>
              <Campo title='Total da comissao' subtitle={comissao.valor_comissao_gg + "%"} />
              <Campo title={'Quant. de gerentes gerais'} subtitle={comissao.comissao_gerente_gerais?.length} />
            </div>
            {comissao.comissao_gerente_gerais?.map((gerente) => (
              <ComissaoEnvolvidos
                data={gerente}
                key={gerente.id}
              />
            ))}
          </Paper>

          <Paper className='paper'>
            <h4>Dados {comissao.comissao_gerentes?.[1] ? "dos gerentes" : "do gerente"}</h4>
            <div className='row'>
              <Campo title='Total da comissao' subtitle={comissao.valor_comissao_gerente + "%"} />
              <Campo title={'Quant. de gerentes'} subtitle={comissao.comissao_gerentes?.length} />
            </div>
            {comissao.comissao_gerentes?.map((gerente) => (
              <ComissaoEnvolvidos
                data={gerente}
                key={gerente.id}
              />
            ))}
          </Paper>

          <Paper className='paper'>
            <h4>Dados {comissao.corretores_vendedores_comissao?.[1] ? "dos corretores vendedores" : "do corretor vendedor"}</h4>
            <div className='row'>
              <Campo title='Total da comissao' subtitle={comissao.corretores_vendedores_comissao?.[0]?.total_comissao_corretor + "%"} />
              <Campo title={'Quant. de corretores'} subtitle={comissao.corretores_vendedores_comissao?.length} />
            </div>
            {comissao.corretores_vendedores_comissao?.map((gerente) => (
              <ComissaoEnvolvidos
                data={gerente}
                key={gerente.id}
              />
            ))}
          </Paper>

          <Paper className='paper'>
            <h4>Dados {comissao.corretores_opicionistas_comissao?.[1] ? "dos opcionistas" : "do opcionista"}</h4>
            <div className='row'>
              <Campo title='Tipo de Laudo' subtitle={laudoOptions.find(e => e.value === comissao.corretores_opicionistas_comissao?.[0]?.tipo_laudo_opcionista)?.label} />
              <Campo title='Total da comissao' subtitle={laudoOptions.find(e => e.value === comissao.corretores_opicionistas_comissao?.[0]?.tipo_laudo_opcionista)?.porcentagem + "%"} />
              <Campo title={'Quant. de opcionistas'} subtitle={comissao.corretores_opicionistas_comissao?.length} />
            </div>
            {comissao.corretores_opicionistas_comissao?.map((gerente) => (
              <ComissaoEnvolvidos
                data={gerente}
                key={gerente.id}
              />
            ))}
          </Paper>
        </div>
        :
        <div className='resumo-comissao'>
          <Paper className='paper'>
            <h4>Comissão não preenchida</h4>
          </Paper>
        </div>
      }
    </>
  )
}

export default ResumoComissao;
