import React, { Context, useContext, useState } from 'react'
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Button from '../ButtonComponent';
import { ArrowLeftOnRectangleIcon, CheckIcon, PencilIcon } from "@heroicons/react/24/outline";
import Slider from "react-slick";
import { useRouter } from 'next/router';
import styles from './index.module.scss';

/*Menu*/
import { Chip, ListItemIcon, ListItemText, Skeleton } from '@mui/material';
import SideBarInterface from "@/interfaces/Vendas/SideBarInterface";
import ContextBlocks from "@/interfaces/Vendas/ContextBlocks";
import { Block } from '@/types/Block';
import { FaPencilAlt, FaPencilRuler } from 'react-icons/fa';
import { HiPencil } from 'react-icons/hi2';

type SidebarProps = {
    context: Context<ContextBlocks | SideBarInterface>;
    hasFooter?: boolean
    review?: boolean
    loading?: boolean
};

export default function SideMenu({ context, hasFooter, review, loading }: SidebarProps) {
    const {
        blocks, saveBlocks, selectItem, setSelectItem, idProcesso, statusProcesso
    } = useContext(context);

    console.log(selectItem);
    console.log(blocks)
    console.log(statusProcesso);

    // const items = blocks;
    const router = useRouter();
    const routerQuery = router.query;
    const param: any = routerQuery.users;

    const pathComissao: any = router.asPath.split('/');
    console.log(pathComissao)
    const paramComissao: any = pathComissao[5]; // comissão 

    const handleClick = (index: number) => {
        !!saveBlocks && saveBlocks();
        !!setSelectItem && setSelectItem(index);
    };

    function salvarSair() {
        if (saveBlocks) saveBlocks();

        const arrStatusGerente = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 24, 25];
        let redirect: string;
        console.log(arrStatusGerente.includes(statusProcesso))

        if(/*paramComissao === 'comissao' && */arrStatusGerente?.includes(statusProcesso)){
            switch (param) {
                case 'vendedor':
                    redirect = 'vendedor'
                    break;

                case 'comprador':
                    redirect = 'comprador'
                    break;

                default:
                    redirect = ''
                    break;
            }

            router.push(`/vendas/gerar-venda/${idProcesso}/dashboard/${redirect}`)
        }
        else{
            router.push(`/vendas`)
        }        
    }

    const returnStyle = (item: Block, type: string, index: number) => {
        if (selectItem === index) return type === 'icon' ? styles.iconChecked : styles.statusActive
        else if (item.status === 'checked' || item.saved) return type === 'icon' ? styles.iconChecked : styles.statusChecked
        else if (review) return type === 'icon' ? styles.iconError : styles.statusError
        else return type === 'icon' ? styles.iconDefault : styles.statusDefault
    };

    return (
        <>
            <div className={styles.sideMenu}>
                {(review && !loading) && <Chip className='chip red' label={blocks.length > 1 ? blocks.length + ` correções` : `1 correção`} />}
                <List>
                    {blocks.sort((a, b) => a.id - b.id).map((item, index) => (
                        <ListItemButton
                            selected={selectItem === index}
                            key={index}
                            onClick={() => handleClick(index)}
                            disabled={review ? !review : returnStyle(item, 'status', index) === styles.statusDefault}
                        >
                            {!loading ?
                                <>
                                    <ListItemIcon className={returnStyle(item, 'icon', index)}>
                                        {((selectItem === index || item.status === '') && !item.saved) ? <HiPencil /> : <CheckIcon />}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.name}
                                        className={returnStyle(item, 'status', index)}
                                    />
                                </>
                                : <Skeleton variant="rounded" width={204} height={42} />
                            }
                        </ListItemButton>
                    ))
                    }
                </List>
            </div>

            {hasFooter &&
                <div className={styles.footer}>
                    <Button
                        label="Salvar e sair"
                        name="secondary"
                        size='medium'
                        variant='text'
                        onClick={() => salvarSair()}
                        startIcon={<ArrowLeftOnRectangleIcon className="icon start-icon" />}
                    />

                </div>
            }
        </>
    )
}
