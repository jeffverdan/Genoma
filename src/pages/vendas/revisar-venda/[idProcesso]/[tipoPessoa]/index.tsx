import React, { useContext, useEffect, useState } from 'react'
import { GetServerSideProps } from 'next';
import HeadSeo from '@/components/HeadSeo';
import getProcesso from '@/apis/getProcesso';
import redirect403 from '@/functions/redirect403';
import { useRouter } from 'next/router';
import Header from '@/components/GG_Gerentes/Header';
import ImovelData from '@/interfaces/Imovel/imovelData';
import { Chip, Collapse, Divider, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { PessoaType } from '@/interfaces/PosVenda/Devolucao';
import ButtonComponent from '@/components/ButtonComponent';
import { HiChevronDown, HiChevronUp, HiEllipsisHorizontal, HiPencil, HiPlus, HiUser, HiUserGroup, HiXMark } from 'react-icons/hi2';
import Card from '@/components/Card';
import { CheckIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import SellerIco from '@/images/Seller_ico';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ParamsType {
    idProcesso: string,
    tipoPessoa: 'vendedor' | 'comprador'

}

type ReviewsType = {
    pf: PessoaType,
    pj: PessoaType,
    faltando: boolean,
}

const RevisaoVenda = ({ idProcesso, tipoPessoa }: ParamsType) => {
    // MENU ACTION
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menus = { addUser: false, editUser: false, editEmpresa: false }; // VALOR ZERADO
    const [openMenu, setOpenMenu] = useState(menus);

    const router = useRouter();
    const [imovelData, setImovelData] = useState<ImovelData>({});
    const [reviews, setReviews] = useState<ReviewsType>({
        pf: {},
        pj: {},
        faltando: false
    });
    const [openCollapse, setOpenCollapse] = useState({
        pf: true,
        pj: true
    })

    const key_pf: 'vendedor_pf' | 'comprador_pf' = `${tipoPessoa}_pf`;
    const key_pj: 'vendedor_pj' | 'comprador_pj' = `${tipoPessoa}_pj`;

    useEffect(() => {
        if (tipoPessoa !== 'vendedor' && tipoPessoa !== 'comprador')
            router.push('/403');
        else
            getImovelData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getImovelData = async () => {
        const data = await getProcesso(idProcesso, router) as any;
        console.log(data.devolucoes);
        // const key: 'cadastro_incompleto_vendedor' | 'cadastro_incompleto_comprador' = `cadastro_incompleto_${tipoPessoa}`;
        setReviews({
            pf: data.devolucoes?.[key_pf],
            pj: data.devolucoes?.[key_pj],
            faltando: false 
            // data.devolucoes?.[key] === 1
        });

        if (data) {
            setImovelData(data);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpenMenu(menus);
    };

    const handleClickMenuOpen = (e: React.MouseEvent<HTMLButtonElement>, dataUsuario: any, tipo: string) => {
        const menu = e.currentTarget.id as 'addUser' | 'editUser' | 'editEmpresa';
        openMenu[menu] = true;
        setAnchorEl(e.currentTarget);
    };

    const handleEdtar = (e: any) => {
        // returnUsuarios()
        // router.push(`/vendas/gerar-venda/${idProcesso}/dashboard/${tipoPessoa}/${selectUser.url}`);
        setAnchorEl(null);
        setOpenMenu(menus);
    };

    const handleAddUser = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, type: string) => {
        // router.push(`/vendas/gerar-venda/${idProcesso}/dashboard/${urlParam.users}/${type}`);
    };

    console.log(reviews.pj.reviews);

    return (
        <>
            <HeadSeo titlePage='Revisar Venda' description="" />
            <Header
                imovel={imovelData as ImovelData}
                urlVoltar={`/vendas/revisar-venda/${idProcesso}`}
                title='realize as correções solicitadas abaixo:'
            />

            <div className='review_pf_pj_container'>
                <div className='btn-adduser-revisar'>
                    {reviews.faltando &&
                        <ButtonComponent
                            id='addUser'
                            size={'large'}
                            variant={'contained'}
                            onClick={e => handleClickMenuOpen(e, '', '')}
                            label={'Adicionar'}
                            labelColor='white'
                            endIcon={<HiPlus fill='white' />}
                        />
                    }
                </div>
                {/* PESSOA FISICA */}
                <Collapse in={openCollapse.pf} orientation="vertical" collapsedSize={45} className="review_pf_pj_content">
                    <div className='review_collapse_title'>
                        <div className='title-collapse'>
                            <p>Pessoas físicas</p>
                            <Chip
                                className='chip neutral'
                                label={`${reviews?.pf.reviews?.length || ''} ${tipoPessoa}${reviews?.pf.reviews?.[1] ? 'es' : ''}`}
                            />
                        </div>
                        <ButtonComponent
                            size={'large'}
                            variant={'text'}
                            name={'collapse'}
                            label={''}
                            onClick={() => setOpenCollapse({ ...openCollapse, pf: !openCollapse.pf })}
                            endIcon={openCollapse.pf ? <HiChevronUp className='colorP500' /> : <HiChevronDown className='colorP500' />}
                        />
                    </div>
                    <div className='cards-container'>
                        {reviews.pf.reviews?.map((pessoa) => (
                            <>
                                <div className='card-item'>
                                    {/* CARDS PESSOAS FISICAS */}
                                    <Card
                                        options={{
                                            id: Number(pessoa.id),
                                            label: pessoa.nome || '',
                                            icon: pessoa.reviewChecks.every(e => e.saved) ? CheckIcon : SellerIco,
                                            fillIcon: pessoa.reviewChecks.every(e => e.saved) ? '#01988C' : '#E33838',
                                            badgeLabel: pessoa.reviewChecks.every(e => e.saved) ? 'FEITO' : 'PENDENTE',
                                            badgeTipo: 'FÍSICA',
                                            url: `${pessoa.id}`,
                                            IconRight: pessoa.reviewChecks.every(e => e.saved) ? '' : FaExclamationTriangle,
                                        }}
                                    />
                                </div>
                            </>
                        ))}

                        {/* CARD ADD PESSOA FISICA */}
                        {reviews.faltando &&
                            <div className='add-card'>
                                <Card
                                    options={{
                                        label: 'Adicionar' + '\n' + 'pessoa física',
                                        icon: HiPlus,
                                        url: `pessoa-fisica`
                                    }}
                                />
                            </div>
                        }
                    </div>
                </Collapse>
            </div>

            {/* PESSOA JURIDICA E REP */}
            <div className='review_pf_pj_container'>
                <Collapse in={openCollapse.pj} orientation="vertical" collapsedSize={45} className="review_pf_pj_content">
                    <div className='review_collapse_title'>
                        <div className='title-collapse'>
                            <p>Pessoas jurídicas</p>
                            <Chip
                                className='chip neutral'
                                label={`${reviews?.pj.reviews?.length || ''} ${tipoPessoa}${reviews?.pj.reviews?.[1] ? 'es' : ''}`}
                            />
                        </div>
                        <ButtonComponent
                            size={'large'}
                            variant={'text'}
                            name={'collapse'}
                            label={''}
                            onClick={() => setOpenCollapse({ ...openCollapse, pj: !openCollapse.pj })}
                            endIcon={openCollapse.pj ? <HiChevronUp className='colorP500' /> : <HiChevronDown className='colorP500' />}
                        />
                    </div>

                    <div className='cards-container pj'>
                        {reviews.pj.reviews?.filter(e => !e.representante).map((empresa) => (
                            <div className='empresa-container' key={empresa.id}>
                                <div className='label-container'>
                                    <div className='name-empresa'> {empresa.nome} </div>
                                    <ButtonComponent id='editEmpresa' onClick={e => handleClickMenuOpen(e, empresa, 'usuario')} size={'small'} endIcon={<HiEllipsisHorizontal />} variant={'text'} label={''} />
                                </div>
                                <div className='cards-items'>

                                    {/* CARD EMPRESA */}
                                    <Card
                                        options={{
                                            id: Number(empresa.id),
                                            label: empresa.nome || '',
                                            subTitle: 'EMPRESA',
                                            icon: empresa.reviewChecks.every(e => e.saved) ? CheckIcon : UserGroupIcon,
                                            fillIcon: empresa.reviewChecks.every(e => e.saved) ? '#01988C' : '#E33838',
                                            badgeLabel: empresa.reviewChecks.every(e => e.saved) ? 'FEITO' : 'PENDENTE',
                                            badgeTipo: 'JURÍDICA',
                                            url: `${empresa.id}`,
                                            IconRight: empresa.reviewChecks.every(e => e.saved) ? '' : FaExclamationTriangle,
                                        }}
                                    />

                                    {/* CARD REPRESENTANTES */}
                                    {reviews.pj.reviews?.filter(e => e.nome_empresa === empresa.nome).map(rep => (
                                        <>
                                            <Card
                                                options={{
                                                    id: Number(rep.id),
                                                    label: rep.nome || '',
                                                    subTitle: empresa.nome,
                                                    icon: rep.reviewChecks.every(e => e.saved) ? CheckIcon : SellerIco,
                                                    fillIcon: rep.reviewChecks.every(e => e.saved) ? '#01988C' : '#E33838',
                                                    badgeLabel: rep.reviewChecks.every(e => e.saved) ? 'FEITO' : 'PENDENTE',
                                                    badgeTipo: 'JURÍDICA',
                                                    url: `${rep.id}`,
                                                    IconRight: rep.reviewChecks.every(e => e.saved) ? '' : FaExclamationTriangle,
                                                }}
                                            />
                                        </>
                                    ))}

                                    {/* CARD ADD REPRESENTANTE */}
                                    {reviews.faltando &&
                                        <div className='add-card'>
                                            <Card
                                                options={{
                                                    label: 'Adicionar' + '\n' + 'representante',
                                                    icon: HiPlus,
                                                    url: `representante`
                                                }}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        ))}

                        {/* CARD ADD EMPRESA */}
                        {reviews.faltando &&
                            <div className='empresa-container add-card'>
                                <Card
                                    options={{
                                        label: 'Adicionar' + '\n' + 'empresa',
                                        icon: HiPlus,
                                        url: `pessoa-juridica`
                                    }}
                                />
                            </div>
                        }
                    </div>
                </Collapse>
            </div>

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
                <MenuItem disabled className='menu-item danger'>
                    <ListItemIcon>
                        <HiXMark fontSize="small" />
                    </ListItemIcon>
                    {`Apagar ${openMenu.editEmpresa ? 'grupo' : ''}`}
                </MenuItem>
                <Divider className='menu-divider' />
            </Menu>
            {/* FIM MENUS POPOVER ADD E EDIT*/}

        </>
    );
};

// EXECUTA ANTES DO DASHBOARD
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { idProcesso, tipoPessoa } = context.params as unknown as ParamsType;
    return { props: { idProcesso, tipoPessoa } };
};

export default RevisaoVenda;