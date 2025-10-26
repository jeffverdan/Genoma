"use client";

import axiosInterceptorInstance from '@/http/axiosInterceptorInstance';
import { Avatar, Divider, ListItemIcon, Menu, MenuItem, Tab, Tabs } from '@mui/material';
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import NotificationSkeleton from './SkeletonList';

export type Notification = {
    id: string;
    imageUrl: string;
    address: string;
    title: string;
    date: string;
    read: boolean;
    processo_id: number;
    id_devolucao: number;
    date_format: string
}

export type NotificationsPageProps = {
    meta: {
        "current_page": number,
        "from": number,
        "last_page": number,
        "links": {
            "url": string,
            "label": string,
            "active": boolean
        }[],
        "path": string,
        "per_page": number,
        "to": number,
        "total": number
    }
    status: boolean,
    data: {
        "id": number,
        "processo_id": number,
        "solicitacao_id": number | null,
        "usuario_id": number,
        "data_humana": string,
        "status_visualizacao": 0 | 1,
        "ocultar_notificacao": 0 | 1,
        "data_criacao": string,
        "comissao_id": number,
        "progress_status_progresses_id": number,
        "link_imagem": string | null,
        "link_imagem_miniatura": string | null,
        "template": {
            "id": number,
            "mensagem": string,
            "created_at": null,
            "updated_at": null
        },
        "endereco": string
    }[]
}

interface Props {
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    loading: boolean;
    hasMore: boolean;
    indexTabs: number;
    setIndexTabs: React.Dispatch<React.SetStateAction<number>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function NotificationsPage({
    notifications,
    setNotifications,
    loading,
    hasMore,
    indexTabs,
    setIndexTabs,
    setPage,
    handleTabChange
}: Props) {
    const router = useRouter();

    const observerRef = useRef<HTMLDivElement | null>(null);

    // IntersectionObserver sempre ativo
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && hasMore) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [loading, hasMore]);

    // Função de ler notificação
    const markAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            await axiosInterceptorInstance.post(`nova_notificacao`, {
                "notificacao_id": id,
                "usuario_id": localStorage.getItem('usuario_id'),
            }, {
                headers: { Authorization: `Bearer ${token}` },
                onUploadProgress: (progressEvent) => {
                    const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0)) * 100);
                    // setProgressBar([{percent: percentage, status: 'active'}]);
                },
            })
        } catch (err) {
            console.error("Erro ao marcar notificação como lida", err);
        }
    };

    const onOpenNotification = async (id: string) => {
        setNotifications((prev) =>
            prev.map((notif) =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
        await markAsRead(id);

        const { id_devolucao, processo_id } = notifications.find(n => n.id === id) || { id_devolucao: 0, processo_id: 0 };
        if (id_devolucao === 1) {
            router.push(`/vendas/revisar-venda/${processo_id}`);
            // http://localhost:3000/vendas/revisar-venda/310/
        }
    };

    const [recentes, setRecentes] = useState<Notification[]>([]);
    const [anteriores, setAnteriores] = useState<Notification | undefined>(undefined);
    useEffect(() => {
        const FIVE_DAYS = 5 * 24 * 60 * 60 * 1000; // 5 dias em ms
        const now = new Date().getTime();
    
        setRecentes(notifications.filter(f => {
            const diff = now - new Date(f.date).getTime();
            return diff <= FIVE_DAYS;
        }));
    
        setAnteriores(notifications.find(f => {            
            const diff = now - new Date(f.date).getTime();            
            return diff > FIVE_DAYS;
        }));
    },[ notifications ])

    // console.log("recentes: ", recentes);
    // console.log("anteriores: ", anteriores);
    // console.log("notifications: ", notifications);    

    return (
        <div className='notif-content'>
            <Tabs value={indexTabs} onChange={(e: any, value) => handleTabChange(e, value)} className='tab-list'>
                {['Todas', "Não lidas"].map((item, i) => (
                    <Tab
                        key={i}
                        label={`${item}`}
                        value={i}
                        iconPosition="start"
                    />
                ))}
            </Tabs>
            <Divider />
            <div className='messagens-container'>
                
                {(!loading && notifications.length === 0) && <p className="p2">Você não tem notificações</p>}
                {notifications.length > 0 && notifications.filter(f => (indexTabs === 1 && !f.read) || indexTabs === 0).map((msg, i) => (
                    <>
                        {recentes && i === 0 && <p className='p2'>Recentes</p>}
                        {anteriores && i === recentes.length && <p className='p2'>Anteriores</p>}
                        <div key={i} className={`messagem-item ${!msg.read ? 'not-read' : ''}`} onClick={() => onOpenNotification(msg.id)}>
                            <Image src={msg.imageUrl || ''} alt="Imagem" width={50} height={50} className='img-messagem' />
                            <div className='messagem-info'>
                                <p className='address'>{msg.address}</p>
                                <p className='title'>{msg.title}</p>
                                <p className='date'>{msg.date_format}</p>
                            </div>
                            {!msg.read && <div className='dot-not-read'></div>}
                        </div>
                    </>
                ))}


                {loading && <NotificationSkeleton count={2} />}
                {!hasMore && notifications.length > 0 && <p className="p2">Fim das notificações</p>}

                {/* Sentinela invisível */}
                <div ref={observerRef} className="h-4"></div>
            </div>
        </div>
    );
}
