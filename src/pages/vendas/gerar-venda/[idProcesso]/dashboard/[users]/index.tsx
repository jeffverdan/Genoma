import HeadSeo from '@/components/HeadSeo';
import React, { useContext, useEffect, useRef, useState } from 'react'
//import VendedorContext from '@/context/VendedorContext'; //Voltar, comentado para teste dando KO no form do user
//import ImovelContext from '@/context/ImovelContext';
import UsersContext from '@/context/Vendas/ContextBlocks';
import Slider from 'react-slick';
import Header from '../@header';
import getImovel from '@/apis/getImovel';
// import GetProcesso from '@/apis/getProcesso';
import getUsuariosProcesso from '@/apis/getUsuariosProcesso';
import FooterDashboard from '../@footerDashboard';
import Footer from '@/components/Footer';
import ButtonComponent from '@/components/ButtonComponent';
import { HiChevronDown, HiChevronUp, HiEllipsisHorizontal, HiPencil, HiPlus, HiUser, HiUserGroup, HiXMark, HiCheck } from 'react-icons/hi2';
import { Alert, AlertTitle, Chip, Collapse, Divider, Fade, Grow, ListItemIcon, Menu, MenuItem, Snackbar } from '@mui/material';
import Card from '@/components/Card';
import Link from 'next/link';
//import { useRouter } from 'next/navigation'
import { useRouter } from 'next/router'
import { type } from 'os';
import SaveUser from '@/apis/postSaveUser';
import GetApagarUser from '@/apis/getApagarUser';
import redirect403 from '@/functions/redirect403';
import Corner from '@/components/Corner';
import AlertCopyIA from '@/components/AlertIACopy';

const BlockEmpty = () => (
  <div></div>
);

type ImovelData = {
  bairro?: string
  cidade?: string
  logradouro?: string
  numero?: string
  complemento?: string
  unidade?: string
  type?: 'vendedores'
}

type ArrayPessoaFisicaData = {
  id?: number
  label: string
  progress: number
  subTitle?: string
  icon: any
  badgeLabel: string
  badgeTipo: string
  url: string
}

type ArrayPessoaJuridicaData = {
  id?: number
  label: string // nome fantasia
  progress: number
  subTitle?: string
  icon: any
  badgeLabel: string
  badgeTipo: string
  url: string
  representantes: ArrayPessoaFisicaData[]
}

type ArrayVendedoresData = {
  fisicas: ArrayPessoaFisicaData[]
  empresas: ArrayPessoaJuridicaData[]
}

type collapseEmpresas = {
  empresa: boolean
  representantes: boolean[]
}

const PainelVendedores = ({ idProcesso }: { idProcesso: any }) => {
  const router = useRouter();
  console.log('router: ', router.query);
  const urlParam = router.query;
  console.log(urlParam.users);
  // const arrayPessoaFisicaTest: ArrayPessoaFisicaData[] = [
  //   { id: 1, label: 'Carla', progress: 0, subTitle: '', icon: HiUser, badgeLabel: 'pendente', badgeTipo: 'física', url: 'user/id' },
  //   { id: 1, label: 'José', progress: 17, subTitle: '', icon: HiUser, badgeLabel: 'FAZENDO', badgeTipo: 'física', url: 'user/id' },
  //   { id: 1, label: 'Emanuel', progress: 0, subTitle: '', icon: HiUser, badgeLabel: 'pendente', badgeTipo: 'física', url: 'user/id' },
  //   { id: 1, label: 'Ana', progress: 53, subTitle: '', icon: HiUser, badgeLabel: 'FAZENDO', badgeTipo: 'física', url: 'user/id' },
  //   { id: 1, label: 'José', progress: 17, subTitle: '', icon: HiUser, badgeLabel: 'FAZENDO', badgeTipo: 'física', url: 'user/id' },
  //   { id: 1, label: 'Emanuel', progress: 0, subTitle: '', icon: HiUser, badgeLabel: 'pendente', badgeTipo: 'física', url: 'user/id' },
  //   { id: 1, label: 'Ana', progress: 53, subTitle: '', icon: HiUser, badgeLabel: 'FAZENDO', badgeTipo: 'física', url: 'user/id' },
  //   { id: 1, label: 'Emanuel', progress: 0, subTitle: '', icon: HiUser, badgeLabel: 'pendente', badgeTipo: 'física', url: 'user/id' },
  //   { id: 1, label: 'Ana', progress: 53, subTitle: '', icon: HiUser, badgeLabel: 'FAZENDO', badgeTipo: 'física', url: 'user/id' },
  // ];
  let arrayPessoaFisicaTest: ArrayPessoaFisicaData[] = [];

  // Corner
  const [open, setOpen] = React.useState(false);

  const newUserPFOptions = {
    label: 'Adicionar' + '\n' + 'pessoa física', icon: HiPlus, url: `pessoa-fisica`
  };

  const newUserPJOptions: any = (id: any) => {
    return { label: 'Adicionar sócio ou representante', icon: HiPlus, url: `pessoa-juridica/${id}/representante` }
  };

  const demoRepresentante: any = (id: any) => {
    return {
      id: '',
      label: '',
      progress: 0,
      subTitle: '', icon: HiUser,
      badgeLabel: 'pendente',
      badgeTipo: 'Jurídica',
      url: `pessoa-juridica/${id}/representante`
    }
  }

  /* const arrayPessoaJuridicaTest = [
    {
      id: 1, label: 'Loja Que Explode', progress: 17, subTitle: 'EMPRESA', icon: HiUser, badgeLabel: 'FAZENDO', badgeTipo: 'JURÍDICA', url: 'user/id',
      representantes: [
        { id: 2, label: 'Representante 1', progress: 0, subTitle: 'LOJA QUE EXPLODE', icon: HiUser, badgeLabel: 'pendente', badgeTipo: 'JURÍDICA', url: 'user/id' },
        { id: 3, label: 'Representante 2', progress: 50, subTitle: 'LOJA QUE EXPLODE', icon: HiUser, badgeLabel: 'FAZENDO', badgeTipo: 'JURÍDICA', url: 'user/id' },
        { id: 4, label: 'Representante 3', progress: 0, subTitle: 'LOJA QUE EXPLODE', icon: HiUser, badgeLabel: 'pendente', badgeTipo: 'JURÍDICA', url: 'user/id' },
        { id: 5, label: 'Representante 4', progress: 75, subTitle: 'LOJA QUE EXPLODE', icon: HiUser, badgeLabel: 'FAZENDO', badgeTipo: 'JURÍDICA', url: 'user/id' },
      ]
    },
  ]; */
  let arrayPessoaJuridicaTest: ArrayPessoaJuridicaData[] = [];
  let arrayRepresentantes: ArrayPessoaFisicaData[] = [];

  const sliderRef = useRef<Slider>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState({ open: false, msg: {} as any });
  const [dataProcesso, setDataProcesso] = useState([{}]);
  const [selectItem, setSelectItem] = useState(0);
  const [progress, setProgress] = useState(0) // 0 a 100
  const [lastBlock, setLastBlock] = useState(0) // 0 a 6
  const [dataSave, setDataSave] = useState([]);
  const [imovelData, setImovelData] = useState<ImovelData>({ type: 'vendedores' });
  const [usuarios, setUsuarios] = useState([]);
  const [foguetes, setFoguetes] = useState('');

  const [arrayVendedores, setArrayVendedores] = useState<ArrayVendedoresData>({ fisicas: arrayPessoaFisicaTest, empresas: arrayPessoaJuridicaTest });
  const [blocks, setBlocks] = useState([
    { id: 0, page: BlockEmpty, name: 'Código do imóvel', status: '' },
    // { id: 1, page: BlockEmpty, name: 'Endereço do imóvel', status: '' },
    // { id: 2, page: BlockEmpty, name: 'Registro e Escritura', status: '' },
    // { id: 3, page: BlockEmpty, name: 'Laudêmio', status: '' },
    // { id: 4, page: BlockEmpty, name: 'Valores', status: '' },
    // { id: 5, page: BlockEmpty, name: 'Prazo da escritura e multa', status: '' },
    // { id: 6, page: BlockEmpty, name: 'Cláusulas', status: '' },
    // { id: 7, page: BlockEmpty, name: 'Documentos do imóvel', status: '' },
  ]);

  // COLLAPSES
  const [collapseContainerEmpresas, setCollapseContainerEmpresas] = useState(true);

  //const [collapseEmpresas, setCollapseEmpresas] = useState<collapseEmpresas[]>(arrayPessoaJuridicaTest.map((e) => ({ 'empresa': true, representantes: [...e.representantes.map((r) => true), true] })));
  const [collapseEmpresas, setCollapseEmpresas] = useState<collapseEmpresas[]>([]);

  const [collapseContainerPessoas, setCollapseContainerPessoas] = useState(true);
  const [collapsePessoas, setCollapsePessoas] = useState(arrayPessoaFisicaTest.map(() => true));

  // MENU ACTION
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menus = { addUser: false, editUser: false, editEmpresa: false }; // VALOR ZERADO
  const [openMenu, setOpenMenu] = useState(menus);
  const [selectUser, setSelectUser] = useState<any>('');
  const [tipoUsuarioMenu, setTipoUsuarioMenu] = useState('');
  const [loadingMenu, setLoadingMenu] = useState(false);

  const [suspense, setSuspense] = useState<boolean>(true)

  // Upload Documentos
  const [multiDocs, setMultiDocs] = useState<any>({
    'imovel': [{ item: [], file: '', id: '' }],
    'vendedores': [
      [{ item: [], file: '', id: '' }]
    ],
    'compradores': [
      [{ item: [], file: '', id: '' }]
    ]
  });

  const [listaDocumentos, setListaDocumentos] = useState<[]>([]);

  const handleClickMenuOpen = (e: React.MouseEvent<HTMLButtonElement>, dataUsuario: any, tipo: string) => {
    const menu = e.currentTarget.id as 'addUser' | 'editUser' | 'editEmpresa';
    console.log(e.currentTarget.id);
    openMenu[menu] = true;
    setAnchorEl(e.currentTarget);
    console.log(tipo)

    setTipoUsuarioMenu(tipo);
    setSelectUser(dataUsuario);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenu(menus);
  };

  const handleApagar = async (e: any) => {
    e.preventDefault();

    setLoadingMenu(false)

    let tipoPessoa = urlParam.users; // comprador ou vendedor
    let apagarUsuario: any = await GetApagarUser(selectUser.id, idProcesso, tipoUsuarioMenu, tipoPessoa);
    // console.log(apagarUsuario);
    setProgress(apagarUsuario?.porcenagem_preenchida_rascunho ?? progress);
    setFoguetes(apagarUsuario?.foguete);

    // Recarrega os usuários
    let listaUsuarios: any = await getUsuariosProcesso(Number(idProcesso), urlParam.users);
    await setUsuarios(listaUsuarios.data);
    console.log('Recarrega lista', listaUsuarios);

    returnUsuarios()

    setAnchorEl(null);
    setOpenMenu(menus);
  }

  const handleEdtar = (e: any) => {
    returnUsuarios()

    let tipoPessoa = urlParam.users; // comprador ou vendedor
    console.log('tipoPessoa', tipoPessoa);
    console.log('Tipo usuario menu: ', tipoUsuarioMenu);
    console.log('Select user: ', selectUser);

    router.push(`/vendas/gerar-venda/${idProcesso}/dashboard/${tipoPessoa}/${selectUser.url}`);

    setAnchorEl(null);
    setOpenMenu(menus);
  };

  // CONTEXT
  const context = {
    loading, setLoading,
    blocks,
    sliderRef,
    dataProcesso, setDataProcesso,
    dataSave, setDataSave,
    selectItem, setSelectItem,

    idProcesso,

    // Documentos
    multiDocs, setMultiDocs,
    listaDocumentos, setListaDocumentos,
  };

  const returnUsuarios = async () => {
    console.log("aaa");
    // Limpa o id do usuário cadastrado no LocalStorage
    setLoading(false);
    let listaUsuarios: any = await getUsuariosProcesso(Number(idProcesso), urlParam.users);

    if (listaUsuarios.message) {
      setErro({ open: true, msg: listaUsuarios.message })
    }

    /* let porcentagem_total_usuarios = 0;
    let total_representante = 0;
    listaUsuarios?.data?.map((usuario: any) => {
      console.log(usuario.porcentagem_cadastro_concluida);
      porcentagem_total_usuarios += usuario.porcentagem_cadastro_concluida;
      if(usuario.tipo_pessoa == 1) {
        console.log(usuario?.representante_socios?.data.length)
        if(usuario?.representante_socios?.data.length === 0) {
          total_representante += 1;
        } else {
          usuario?.representante_socios?.data?.map((representante:any, index_representante: any) => {
            console.log(index_representante)
            porcentagem_total_usuarios += representante.porcentagem_cadastro_concluida;
            //if(index_representante != 0) {
            total_representante += 1;
            //}
          })
        }
      }
    });

    console.log(porcentagem_total_usuarios);
    if(listaUsuarios?.data?.length > 0 ) {
      porcentagem_total_usuarios = porcentagem_total_usuarios / (listaUsuarios?.data?.length + total_representante);
      porcentagem_total_usuarios = parseFloat(porcentagem_total_usuarios.toFixed(2));
    } */
    //options?.imovel + options?.vendedores + options?.compradores + options?.recibo) / 4
    //setProgress(porcentagem_total_usuarios);
    //setProgress(porcentagem_total_usuarios);
    setUsuarios(listaUsuarios.data);
    setLoading(true);

    let listUsuariosPessaFisica: any = listaUsuarios?.data?.filter((usuario: { tipo_pessoa: number; }) => usuario.tipo_pessoa === 0);
    let listUsuariosPessaJuridica: any = listaUsuarios?.data?.filter((usuario: { tipo_pessoa: number; }) => usuario.tipo_pessoa === 1);

    arrayPessoaFisicaTest = listUsuariosPessaFisica?.map((usuario: any) => ({ id: usuario.id, label: usuario.name, progress: usuario.porcentagem_cadastro_concluida, subTitle: '', icon: usuario.porcentagem_cadastro_concluida === 100 ? HiCheck : HiUser, badgeLabel: usuario.porcentagem_cadastro_concluida !== 100 ? 'fazendo' : 'concluído', badgeTipo: usuario.tipo_pessoa === 0 ? 'Física' : 'Jurídica', url: 'pessoa-fisica/' + usuario.id }))
    arrayPessoaJuridicaTest = listUsuariosPessaJuridica?.map((usuario: any) => (
      {
        id: usuario.id,
        label: usuario.nome_fantasia,
        progress: usuario.porcentagem_cadastro_concluida,
        subTitle: '',
        icon: usuario.porcentagem_cadastro_concluida === 100 ? HiCheck : HiUser,
        badgeLabel: usuario.porcentagem_cadastro_concluida !== 100 ? 'fazendo' : 'concluído',
        badgeTipo: usuario.tipo_pessoa === 0 ? 'Física' : 'Jurídica',
        url: usuario.tipo_pessoa === 0 ? 'pessoa-fisica/' : 'pessoa-juridica/' + usuario.id,
        representantes:
          (usuario?.representante_socios?.data?.map(
            (representante: any) => (
              {
                id: representante.id,
                label: representante.name,
                progress: representante.porcentagem_cadastro_concluida,
                subTitle: '', icon: representante.porcentagem_cadastro_concluida === 100 ? HiCheck : HiUser,
                badgeLabel: representante.porcentagem_cadastro_concluida !== 100 ? 'fazendo' : 'concluído',
                //badgeTipo: representante.tipo_pessoa === 0 ? 'Física' : 'Jurídica' , 
                badgeTipo: 'Jurídica',
                url: 'pessoa-juridica/' + usuario.id + '/representante/' + representante?.id
              }
            )
          )
          )

      }
    ))

    await setArrayVendedores({ fisicas: arrayPessoaFisicaTest, empresas: arrayPessoaJuridicaTest })
    await setCollapseEmpresas(arrayPessoaJuridicaTest.map((e) => ({ 'empresa': true, representantes: [...e.representantes.map((r) => true)] })))

    // const objUsers: any = listaUsuarios?.data.map((usuario: any) => ({ id: usuario.id, label: usuario.name, progress: 0, subTitle: '', icon: HiUser, badgeLabel: 'pendente', badgeTipo: 'física', url: 'pessoa-fisica/' + usuario.id }));
    // setVendedoresPf(objUsers);
    // console.log('Vendedores PF: ' , vendedoresPf)
  };

  // Usuários
  useEffect(() => {
    returnUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    returnUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnUser = async () => {
    // Limpa o id do usuário cadastrado e da empresa no LocalStorage
    localStorage.removeItem('usuario_cadastro_id');
    localStorage.removeItem('pj_cadastro_id');
    localStorage.removeItem('usuario_origem');

    setLoading(false);
    let processo: any = await getImovel(Number(idProcesso), router);

    // Exibe o modal quando a sessão existe e a porcentagem está 100%
    const sessionUrlCadastro = sessionStorage.getItem('urlCadastro');
    // const porcentagemCadastro: string = sessionStorage.getItem('porcentagemCadastro') || '';
    if (sessionUrlCadastro !== null) {
      if (sessionUrlCadastro?.includes('vendedor') && processo?.porcenagem_preenchida_vendedores === 100
        || sessionUrlCadastro?.includes('comprador') && processo?.porcenagem_preenchida_compradores === 100) {
        await setOpen(true);
        sessionStorage.removeItem('urlCadastro')
      }
      else {
        // await setOpen(false);
        sessionStorage.removeItem('urlCadastro')
      }
    }

    // let processo: any = await GetProcesso(idProcesso, router);

    // Processo enviado para o Pós nos sequintes status, vai exibir tela de 403
    // 1,2,3,4,5,6,7,21,26
    const statusProcesso = processo?.status[0]?.id;
    redirect403(statusProcesso, router, setSuspense)

    if (processo.message) {
      setErro({ open: true, msg: processo.message })
    }

    console.log(processo);

    const porcentagem_total_processo = processo?.porcentagem_total_concluida;
    setProgress(porcentagem_total_processo);

    setDataProcesso(processo);
    setFoguetes(processo.foguete);
    setImovelData({ ...processo.imovelData, type: 'vendedores' });
    //setProgress(processo?.porcenagem_preenchida as number);
    //returnUsuarios();
    setLoading(true);
  };

  const handleAddUser = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, type: string) => {
    router.push(`/vendas/gerar-venda/${idProcesso}/dashboard/${urlParam.users}/${type}`);
  };

  const handleCollapseEmpresa = () => {
    if (!collapseContainerEmpresas) setCollapseContainerEmpresas(true);
    collapseEmpresas.forEach((empresa, index_e) => {
      empresa.empresa = !empresa.empresa;
      empresa.representantes.forEach((r, index_r) => {
        setTimeout(() => {
          collapseEmpresas[index_e].representantes[index_r] = !r;
          setCollapseEmpresas([...collapseEmpresas]);

          if (index_r === empresa.representantes.length - 1 && r) setCollapseContainerEmpresas(false);
        }, (index_r + 1) * 100);
      })
    })
  };

  const handleCollapsePessoas = () => {
    if (!collapseContainerPessoas) setCollapseContainerPessoas(true);
    collapsePessoas.forEach((p, index_p) => {
      setTimeout(() => {
        collapsePessoas[index_p] = !p;
        setCollapsePessoas([...collapsePessoas]);

        if (index_p === collapsePessoas.length - 1 && p) setCollapseContainerPessoas(false);
      }, (index_p) * 100);
    })
  };

  return (
    suspense === false &&
    <div className='painel-vendedores'>
      <HeadSeo titlePage='Painel Vendedores' description="" />
      <UsersContext.Provider value={context}>
        <Header imovel={imovelData as ImovelData} />

        <section className='vendedores-content'>
          <div className='vendedores-container'>
            <div className='btn-info'>
              <ButtonComponent id='addUser' size={'large'} variant={'contained'} onClick={e => handleClickMenuOpen(e, '', '')} label={'Adicionar'} labelColor='white' endIcon={<HiPlus fill='white' />} />
              <AlertCopyIA />
            </div>

            <div className='pessoas-container'>
              {
                arrayVendedores.fisicas?.length !== 0 &&
                <div className='label-container'>
                  <div>
                    <span className='label-pessoa'>Pessoas físicas</span> <Chip size='small' label={`${arrayVendedores.fisicas?.length} ${urlParam.users === 'vendedor' ? 'Vendedor' : 'Comprador'}${arrayVendedores.fisicas?.length > 1 ? 'es' : ""}`} />
                  </div>
                  <ButtonComponent onClick={handleCollapsePessoas} size={'small'} variant={'text'} endIcon={collapseContainerPessoas ? <HiChevronDown /> : <HiChevronUp />} label={''} />
                </div>
              }

              {/* CARDS PESSOAS */}
              <Collapse in={collapseContainerPessoas} timeout={3000}>
                <div className='cards-container'>
                  {arrayVendedores.fisicas?.map((vendedor, index) => (
                    <>
                      {/* <Grow in={collapsePessoas[index]} key={vendedor.id} > */}
                      <div className='card-item'>
                        <Card options={vendedor} handleClickMenuOpen={e => handleClickMenuOpen(e, vendedor, 'usuario')} />
                      </div>
                      {/* </Grow> */}
                    </>
                  ))}

                  {/* CARD DE NEWUSER */}
                  {
                    arrayVendedores.fisicas?.length !== 0 &&
                    // <Grow in={collapseEmpresas.slice(-1)[0]?.representantes.slice(-1)[0]} >
                    <div className='newuser-card add-newuser-pf'>
                      <Card options={newUserPFOptions} handleClickMenuOpen={e => handleClickMenuOpen(e, '', '')} />
                    </div>
                    // </Grow>
                  }
                </div>
              </Collapse>
            </div>

            {
              arrayVendedores.empresas?.length !== 0 &&
              <div className='empresas-container'>
                <div className='label-container'>
                  <div>
                    <span className='label-pessoa'>Pessoas jurídicas</span> <Chip size='small' label={`${arrayVendedores.empresas?.length} Empresa${arrayVendedores.empresas?.length > 1 ? 's' : ""}`} />
                  </div>
                  <ButtonComponent onClick={handleCollapseEmpresa} size={'small'} variant={'text'} endIcon={collapseContainerEmpresas ? <HiChevronDown /> : <HiChevronUp />} label={''} />
                </div>
                {arrayVendedores.empresas?.map((empresa: any, index: any) => (
                  <>
                    <Collapse in={collapseContainerEmpresas} className='container-empresa' timeout={200}>
                      <div>
                        <div key={empresa.id}>
                          <div className='label-container'>
                            <div className='name-empresa'> {empresa.label} </div>
                            <ButtonComponent id='editEmpresa' onClick={e => handleClickMenuOpen(e, empresa, 'usuario')} size={'small'} endIcon={<HiEllipsisHorizontal />} variant={'text'} label={''} />
                          </div>

                          <div className='cards-container'>
                            {/* CARD DE EMPRESA */}
                            {/* <Grow in={collapseEmpresas[index]?.empresa} > */}
                            <div className='card-item'>
                              <Card options={empresa} handleClickMenuOpen={e => handleClickMenuOpen(e, empresa, 'usuario')} />
                            </div>
                            {/* </Grow> */}

                            {/* CARDS DE REPRESENTANTES */}
                            {empresa?.representantes?.map((representante: any, R_index: any) => (
                              <Grow in={collapseEmpresas[index].representantes[R_index]} key={representante.id} >
                                <div className='card-item'>
                                  <Card options={representante} handleClickMenuOpen={e => handleClickMenuOpen(e, representante, 'representante')} />
                                </div>
                              </Grow>
                            ))}

                            {/* CARDS DE REPRESENTANTES PENDENTES */}
                            {empresa?.length !== 0 && empresa?.representantes?.length === 0 ?
                              // <Grow in={collapseEmpresas[index].representantes[R_index]} key={representante.id} >
                              <div className='card-item'>
                                <Card options={demoRepresentante(empresa?.id)} handleClickMenuOpen={e => handleClickMenuOpen(e, '', '')} />
                              </div>
                              // </Grow>

                              :
                              ''
                            }

                            {/* CARD DE NEWUSER */}
                            {/* <Grow in={collapseEmpresas.slice(-1)[0]?.representantes.slice(-1)[0]} > */}
                            <div className='newuser-card'>
                              <Card options={newUserPJOptions(empresa?.id)} handleClickMenuOpen={e => handleClickMenuOpen(e, '', '')} />
                            </div>
                            {/* </Grow> */}
                          </div>
                        </div>
                      </div>
                    </Collapse>
                  </>
                ))}
              </div>
            }
          </div>
        </section>

        <Footer progress={progress} idProcesso={idProcesso} foguetes={foguetes} />

        <Corner
          open={open}
          setOpen={setOpen}
          vertical={'bottom'}
          direction='up'
          horizontal={'right'}
          type={'cadastrou-' + urlParam.users}
          idProcesso={idProcesso}
        />
      </UsersContext.Provider>

      {/* MENUS POPOVER ADD E EDIT*/}
      <Menu
        id="menu-adduser"
        anchorEl={anchorEl}
        open={openMenu.addUser}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          className: 'menu-container',
          sx: { ml: 1 }
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <li className='menu-label'>ADICIONAR</li>
        <Divider className='menu-divider' />
        <MenuItem onClick={e => handleAddUser(e, 'pessoa-fisica')} className='menu-item'>
          <ListItemIcon>
            <HiUser fontSize="small" />
          </ListItemIcon>
          Pessoa física
        </MenuItem>
        <Divider className='menu-divider' />
        <MenuItem onClick={e => handleAddUser(e, 'pessoa-juridica')} className='menu-item'>
          <ListItemIcon>
            <HiUserGroup fontSize="small" />
          </ListItemIcon>
          Pessoa jurídica
        </MenuItem>
        <Divider className='menu-divider' />
      </Menu>

      <Menu
        id="menu-edituser"
        anchorEl={anchorEl}
        open={openMenu.editUser || openMenu.editEmpresa}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          className: 'menu-container',
          sx: { mr: 1 }
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <li className='menu-label'>OPÇÕES</li>
        <Divider className='menu-divider' />
        <MenuItem onClick={e => handleEdtar(e)} className='menu-item'>
          <ListItemIcon>
            <HiPencil fontSize="small" />
          </ListItemIcon>
          {`Editar ${openMenu.editEmpresa ? 'empresa' : ''}`}
        </MenuItem>
        <Divider className='menu-divider' />
        <MenuItem onClick={e => handleApagar(e)} className='menu-item danger'>
          <ListItemIcon>
            <HiXMark fontSize="small" />
          </ListItemIcon>
          {`Apagar ${openMenu.editEmpresa ? 'grupo' : ''}`}
        </MenuItem>
        <Divider className='menu-divider' />
      </Menu>
      {/* FIM MENUS POPOVER ADD E EDIT*/}

      {/* ALERTA DE ERRO */}
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={erro.open} onClose={() => setErro({ open: false, msg: '' })}>
        <Alert onClose={() => setErro({ open: false, msg: '' })} severity="error">
          {erro.msg.title && <AlertTitle color='red'>{erro.msg.title}</AlertTitle>}
          <span>{erro.msg.subtitle ? erro.msg.subtitle : erro.msg} </span><br /><Link href="/">Relogar</Link>
        </Alert>
      </Snackbar>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const { idProcesso } = context.params as { idProcesso: string };
  return { props: { idProcesso } };
}

export default PainelVendedores;