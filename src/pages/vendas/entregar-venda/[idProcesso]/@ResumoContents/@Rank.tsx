import React, { useState, useContext, useEffect, ReactElement } from 'react';

import Foguetes from '@/components/Foguetes';

import imovelDataInterface from '@/interfaces/Imovel/imovelData'
import dayjs from 'dayjs';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Chip, Paper, Skeleton } from '@mui/material';

const ResumoVenda = ({ imovelData, loading }: { imovelData: imovelDataInterface, loading: boolean }) => {
  const returnTitle = (e: number) => {
    switch (e) {
      case 1:
        return 'Sua venda não atende o padrão DNA Imóveis.'
      case 2:
        return 'Sua venda tem muito a melhorar.'
      case 3:
        return 'Dá pra melhorar essa venda, hein!'
      case 4:
        return 'Falta pouco para uma venda perfeita!'
      case 5:
        return 'Parabéns, sua venda está perfeita!'
    }
  };

  const returnText = (e: number) => {
    switch (e) {
      case 1:
        return 'Uma venda com pontuação de 1 foguete pode ter dados incorretos e perda de prazo. Revise sua venda para melhorar sua entrega.'
      case 2:
        return 'Uma venda 2 foguetes pode ter dados incorretos e pode atrasar o trabalho da Equipe de pós-venda. Revise os dados da venda para coseguir pontuar mais.'
      case 3:
        return 'Uma venda 3 foguetes pode parecer boa, mas sabemos que a Equipe DNA Imóveis sempre busca excelência. Melhore sua venda para pontuar mais!'
      case 4:
        return 'Uma venda 4 foguetes é boa, mas poderia ser melhor. Procure melhorar sua pontuação com as nossas dicas e entregue uma venda perfeita.'
      case 5:
        return 'Uma venda 5 foguetes é a prova da excelência de uma venda DNA Imóveis.'
    }
  };

  const returnDataPrevista = (dateString?: string) => {
    if (dateString) {
      const data = dateString.split("/");
      const oldDataFormat = data[2] + '-' + data[1] + '-' + data[0];
      const newData = dayjs(oldDataFormat);
      const today = dayjs();
      return today.diff(newData, 'day') <= 1;
    }
  };

  console.log(imovelData);

  const checklist = [
    {
      id: 1,
      label: { check: 'Inseriu documentos de vendedores', uncheck: 'Inserir documentos de vendedores' },
      check: imovelData?.todos_documentos_vendedores
    },
    {
      id: 2,
      label: { check: 'Inseriu documentos de compradores', uncheck: 'Inserir documentos de compradores' },
      check: imovelData?.todos_documentos_compradores
    },
    {
      id: 3,
      label: { check: 'Inseriu dados de Comissão antes de entregar a venda', uncheck: 'Inserir dados de Comissão antes de entregar a venda' },
      check: imovelData?.porcentagem_preenchida_comissao === 100 /*!!imovelData?.comissao?.id*/
    },
    {
      id: 4,
      label: { check: 'Preencher a segunda cláusula do imóvel.', uncheck: 'Preencher a segunda cláusula do imóvel.' },
      check: imovelData?.clausula_segunda
    },
    {
      id: 5,
      label: { check: 'Inserir os e-mails das partes envolvidas.', uncheck: 'Inserir os e-mails das partes envolvidas.' },
      check: imovelData?.emails_todos_envolvidos
    }
  ];

  return (
    <div className='rank'>
      {loading ?
        <Paper className='rockets'>
          <Skeleton animation='wave' width={180} height={36} />
          <Skeleton animation='wave' width={480} height={32} />
          <Skeleton animation='wave' width={1070} height={24} />
          <Skeleton animation='wave' width={320} height={24} />
        </Paper>
        :
        <Paper className='rockets'>
          <Foguetes quantidade={imovelData?.foguete || 1} />
          <h1>{returnTitle(imovelData?.foguete || 1)}</h1>
          <p>{returnText(imovelData?.foguete || 1)}</p>
        </Paper>
      }

      {loading ?
        <Paper className='rockets-content'>
          <h4><Skeleton animation='wave' width={1070} height={34} /></h4>

          <Skeleton className='title' animation='wave' width={280} height={32} />
          
          <Skeleton className='subtitle' animation='wave' width={660} height={24} />
          <Skeleton className='subtitle' animation='wave' width={660} height={24} />
          <Skeleton className='subtitle' animation='wave' width={660} height={24} />
          <Skeleton className='subtitle' animation='wave' width={660} height={24} />
          

        </Paper>
        :
        <Paper className='rockets-content'>
          <h4>Com base nas informações cadastradas, avaliamos sua venda. Quanto mais completa a entrega da venda, maior será sua pontuação. Confira: </h4>

          {!!checklist.filter((e) => e.check)[0] && <p className='title'>Checklist de pontos:</p>}
          {checklist.filter((e) => e.check).map((item) => (
            <>
              <div className='items check'>
                <CheckIcon height={20} />
                <Chip size='small' className='chip' label='1 FOGUETE' />
                <p className='subtitle'>{item.label.check}</p>
              </div>
            </>
          ))}

          {!!checklist.filter((e) => !e.check)[0] && <p className='title'>O que falta:</p>}
          {checklist.filter((e) => !e.check).map((item) => (
            <>
              <div className='items uncheck'>
                <Chip size='small' label='1 FOGUETE' className='chip' />
                <p className='subtitle'>{item.label.uncheck}</p>
              </div>
            </>
          ))}

        </Paper>
      }
    </div>
  )
}

export default ResumoVenda;