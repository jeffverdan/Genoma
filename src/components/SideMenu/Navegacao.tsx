import React, { useEffect, useState } from 'react'
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { CheckIcon, PencilIcon, UserIcon, BellIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';

/*SASS*/
import styles from './index.module.scss';

interface MenuProps {
    categoria: string
    id?: number;
    name?: string;
    link?: string
    status?: string;
}

export default function Nvegacao({categoria}: MenuProps) {
    const menu = categoria;

    const [navegacao, setNavegacao] = useState([
        {
            categoria: 'dashboard',
            items: [
                {
                    id: 0,
                    name: 'Meu perfil',
                    status: 'link',
                    link: '/meu-perfil',
                },

                {
                    id: 1,
                    name: 'Notificações',
                    status: 'link',
                    link: '/notificacoes',
                },
            ]
        },

        {
            categoria: 'imóvel',
            items: [
                {
                    id: 0,
                    name: 'Código do imóvel',
                    status: 'checked',
                    link: '',
                },

                {
                    id: 1,
                    name: 'Endereço do imóvel',
                    status: 'active',
                    link: '',
                },

                {
                    id: 2,
                    name: 'Registro e Escritura',
                    status: '',
                    link: '',
                },

                {
                    id: 3,
                    name: 'Laudêmio',
                    status: '',
                    link: '',
                },

                {
                    id: 4,
                    name: 'Valores',
                    status: '',
                    link: '',
                },

                {
                    id: 5,
                    name: 'Prazo da Escritura',
                    status: '',
                    link: '',
                },

                {
                    id: 6,
                    name: 'Cláusulas',
                    status: '',
                    link: '',
                },

                {
                    id: 7,
                    name: 'Documentos do imóvel',
                    status: '',
                    link: '',
                },
            ]
        },

        {
            categoria: 'comprador',
            items: [
                {
                    id: 0,
                    name: 'Código do imóvel',
                    status: '',
                    link: '',
                },

                {
                    id: 1,
                    name: 'Endereço do imóvel',
                    status: '',
                    link: '',
                },

                {
                    id: 2,
                    name: 'Registro e Escritura',
                    status: '',
                    link: '',
                },
            ]
        },
    ])

    const categoriaNavegacao = navegacao.filter(categoria => categoria.categoria === menu);
    const listaNavegacao = categoriaNavegacao.map(item => item.items);
    console.log(categoriaNavegacao);
    console.log(listaNavegacao);

    const handleClick = () =>{
        console.log('teste');
    }

    return (
        <>
            <div className={styles.header}>
                {
                    menu !== 'dashboard' &&
                    <>
                        <div className={styles.etapas}>
                            Etapas 2/10
                        </div>

                        <div className={styles.titleMenu}>
                            Imóvel
                        </div>
                    </>
                }
            </div>

            <div className={styles.nav}>
                {listaNavegacao[0] && listaNavegacao[0].map((item, index) => (
                    <ListItem key={item.id} disablePadding>
                        {
                            categoriaNavegacao[0].categoria === 'dashboard' 
                            ?
                            <>
                                {/*Dashboard*/}
                                <Link href={item.link} target='_blank'>
                                    <ListItemButton>
                                        <ListItemIcon className={styles.iconDefault}>
                                            {
                                                item.id === 0 
                                                ? 
                                                    <UserIcon className={styles.statusDefault} /> 
                                                : 
                                                    <BellIcon className={styles.statusDefault} /> 
                                            }
                                        </ListItemIcon>
                                        <ListItemText primary={item.name} className={styles.statusActive} />
                                    </ListItemButton>
                                </Link>
                            </>

                            :
                            <>
                                {/*Sidebar*/}
                                <ListItemButton onClick={() => handleClick()}>
                                    <ListItemIcon className={item.status === '' ? styles.iconDefault : styles.iconChecked}>
                                        {item.status === '' ? <PencilIcon /> : <CheckIcon /> }
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={item.name} 
                                        className={
                                            item.status === '' 
                                                ? styles.statusDefault 
                                                : item.status === 'checked'
                                                    ? styles.statusChecked
                                                    : styles.statusActive
                                            } 
                                        />
                                </ListItemButton>
                            </>

                        }
                    </ListItem>
                ))}
            </div>
        </>
    )
}
