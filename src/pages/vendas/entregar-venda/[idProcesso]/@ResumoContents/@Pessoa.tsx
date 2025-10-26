import React, { useState, useContext, useEffect, ReactElement } from 'react';
// import SwipeableViews from 'react-swipeable-views';
import SwipeableViews from 'react-swipeable-views-react-18-fix';

import imovelDataInterface from '@/interfaces/Imovel/imovelData'
import userInterface from '@/interfaces/Users/userData'
import dayjs from 'dayjs';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { Button, Chip, Link, Menu, MenuItem, Paper, Tab, Tabs, Tooltip } from '@mui/material';
import ShowDocument from '@/apis/getDocument';
import ButtonComponent from '@/components/ButtonComponent';
import { HiChevronDown } from 'react-icons/hi2';

interface props {
  imovelData: imovelDataInterface
  pessoa: 'compradores' | 'vendedores'
}

interface propsCampo {
  title: string
  subtitle: string | number | undefined
}

interface TabsType {
  values?: userInterface[]
  selectTab: number
}

interface propsDados {
  user: userInterface,
  label: string
}

const Campo = (props: propsCampo) => {
  return (
    <div>
      <p className='title'>{props.title}</p>
      <p className='subtitle'>{props.subtitle}</p>
    </div>
  )
};

const DadosPessoais = (props: propsDados) => {
  const { user, label } = props;

  return (
    <Paper className='paper dados'>
      <h4>Dados do {label}</h4>
      <div className='row'>
        <Campo title='CPF' subtitle={user.cpf_cnpj} />
        <Campo title='Telefone / Celular' subtitle={user.telefone} />
      </div>

      <div className='row'>
        <Campo title='Nome completo' subtitle={user.name} />
        <Campo title='Gênero' subtitle={user.genero} />
      </div>

      <div className='row'>
        <Campo title='Data de nascimento' subtitle={user.data_nascimento.split(' ')[0]} />
        <Campo title='Nacionalidade' subtitle={user.nacionalidade} />
      </div>

      <div className='row'>
        <Campo title='Nome da mãe' subtitle={user.nome_mae} />
        <Campo title='Nome do pai' subtitle={user.nome_pai || '---'} />
      </div>

      <div className='row'>
        <Campo title='Estado civil' subtitle={user.estado_civil_nome} />
        <Campo title='União estavel' subtitle={user.uniao_estavel === 'S' ? "Sim" : "Não"} />
        {!!user.registro_casamento && <Campo title='Regime de casamento' subtitle={user.registro_casamento} />}
        {!!user.conjuge && <Campo title='Conjugue' subtitle={user.conjuge} />}
      </div>

      <div className='row'>
        <Campo title='Profissão' subtitle={user.profissao || '---'} />
        <Campo title='Email' subtitle={user.email || '---'} />
      </div>

      {!!user.rg &&
        <div className='row'>
          <Campo title='RG' subtitle={user.rg} />
          <Campo title='Expedida por' subtitle={user.rg_expedido} />
          <Campo title='Data de expedição' subtitle={user.data_rg_expedido} />
        </div>
      }

    </Paper>
  )
};

const Enderecos = (props: propsDados) => {
  const { user, label } = props;

  return (
    <Paper className='paper endereco'>
      <h4>Endereço {label === 'empresa' ? 'da' : 'do'} {label}</h4>
      <div className='row'>
        <Campo title='CEP' subtitle={user.cep} />
        <Campo title='Logradouro' subtitle={user.logradouro} />
      </div>

      <div className='row'>
        <Campo title='Número' subtitle={user.numero} />
        <Campo title='Unidade' subtitle={user.unidade || '---'} />
        <Campo title='Complemento' subtitle={user.complemento || '---'} />
      </div>

      <div className='row'>
        <Campo title='Cidade' subtitle={user.cidade} />
        <Campo title='Estado' subtitle={user.estado} />
        <Campo title='Bairro' subtitle={user.bairro} />
      </div>
    </Paper>
  )
};

const Documents = (props: propsDados) => {
  const { user, label } = props;

  return (
    <Paper className='paper documentos'>
      <h4>Documentos {label === 'empresa' ? 'da' : 'do'} {label}</h4>
      {user.documentos?.data?.map((doc) => (
        <div className='row' key={doc.id}>
          <Campo title='Tipo' subtitle={doc.tipo_documento_ids?.map((e) => " " + e.nome_tipo).toString()} />
          <div>
            <p className='title'>Nome do documento</p>
            <Link className='link' onClick={() => ShowDocument(doc.id, 'documento')} >{doc.nome_original}</Link>
          </div>
        </div>

      ))}

      {user.documentos?.data?.length === 0 && "Nenhum documento cadastrado"}
    </Paper>
  )
};

const ResumoPessoa = (props: props) => {
  const { imovelData, pessoa } = props
  const label: string = pessoa?.slice(0, -2);
  const [anchorMenu, setAnchorMenu] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorMenu);
  const [tabs, setTabs] = useState<TabsType>({
    values: [],
    selectTab: 0
  });

  useEffect(() => {
    if (imovelData[pessoa]) {
      setTabs({
        values: imovelData[pessoa] || [],
        selectTab: 0
      })
    }
  }, [imovelData, pessoa]);

  const handleTab = (value: any) => {
    setTabs({ ...tabs, selectTab: value });
    tabs.values?.forEach((user, index) => {
      if (index === value && user.tipo_pessoa === 1) console.log(user.tipo_pessoa);
    })

    handleCloseMenu()
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenu(null);
  };

  const returnName = (item: userInterface) => {
    if (item.name) return capitalizeFirstWord(item.name)
    else if (item.nome_fantasia) return capitalizeFirstWord(item.nome_fantasia)
    else return 'ERROR - Nome não cadastrado'
  };

  function capitalizeFirstWord(str: string | undefined): string {
    if (!str) return ""
    const words = str.toLowerCase().split(' ');
    const capitalizedWords = words.map(word => {
      if (word.length > 2) return word.charAt(0).toUpperCase() + word.slice(1)
      else return word.charAt(0) + word.slice(1)
    });
    return capitalizedWords.join(' ');
  };

  return (
    <div className='resumo-pessoa'>
      <Paper className='paper names'>
        {tabs.values?.map((item, index) => {
          if (index < 7) {
            return (
              <div key={index} className='tooltip' >
                <ButtonComponent
                  label={returnName(item)}
                  id={index.toString()}
                  name={tabs.selectTab === index ? 'name check' : 'name uncheck'}
                  onClick={() => handleTab(index)}
                  size={'medium'}
                  variant={'text'}
                />
                <span className='tooltip-text'>{returnName(item)}</span>
              </div>
            )
          }
        })}

        {!!tabs.values?.length && tabs.values?.length >= 7 &&
          <ButtonComponent
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleOpenMenu}
            size={'medium'}
            name='menu'
            variant={'text'}
            className={tabs.selectTab > 7 ? 'check' : 'uncheck'}
            startIcon={<HiChevronDown size={22} />}
            label={"+" + (tabs.values?.length - 7)}
          />
        }

        <Menu
          id="basic-menu"
          anchorEl={anchorMenu}
          className='resumo-menu'
          open={open}
          onClose={handleCloseMenu}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {tabs.values?.map((item, index) => {
            if (index >= 7) {
              return (
                <MenuItem
                  key={index}
                  onClick={() => handleTab(index)}
                  selected={index === tabs.selectTab}
                  className={tabs.selectTab === index ? 'check' : 'uncheck'}
                >
                  <span className='box-name'>{returnName(item)}</span>
                </MenuItem>
              )
            }
          })}
        </Menu>
      </Paper>

      <SwipeableViews
        axis={'x'}
        index={tabs.selectTab}
        onChangeIndex={handleTab}
      >
        {tabs.values?.map((user, index) => (
          index === tabs.selectTab && user.tipo_pessoa === 0 && !user.vinculo_empresa ?
            // PESSOA FISICA
            <div key={index} hidden={index !== tabs.selectTab} className='content-pessoa'>
              <DadosPessoais label={label} user={user} />

              <Paper className='paper procurador'>
                <h4>Dados do procurador</h4>
                {user.procurador?.id ?
                  <div className='row'>
                    <Campo title='Nome' subtitle={user.procurador.nome} />
                    <Campo title='Telefone / Celular' subtitle={user.procurador.telefone} />
                  </div>
                  : "Nenhum procurador cadastrado"
                }
              </Paper>

              <Enderecos label={label} user={user} />

              <Documents label={label} user={user} />
            </div>

            :
              // PESSOA JURIDICA   
              <div key={index} hidden={index !== tabs.selectTab} className='content-pessoa'>

                <Paper className='paper procurador'>
                  <h4>Dados da empresa</h4>
                  <div className='row'>
                    <Campo title='CNPJ' subtitle={user.cpf_cnpj} />
                    <Campo title='Telefone / Celular' subtitle={user.telefone} />
                  </div>

                  <div className='row'>
                    <Campo title='Razão Social' subtitle={user.razao_social} />
                    <Campo title='Nome Fantasia' subtitle={user.nome_fantasia} />
                  </div>
                </Paper>

                <Enderecos label={'empresa'} user={user} />

                <Documents label={'empresa'} user={user} />

                {user.representante_socios?.data.map((representante) => (
                  <>
                    <DadosPessoais label={'representante'} user={representante} />
                    <Documents label={'representante'} user={representante} />
                  </>
                ))}
              </div>
        ))}
      </SwipeableViews>
    </div>
  )
}

export default ResumoPessoa;