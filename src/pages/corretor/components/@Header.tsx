import React, { Dispatch, ReactComponentElement, ReactElement, ReactNode, SetStateAction, useEffect, useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ButtonSalvarSair from '@/components/ButtonSalvarSair';
import Button from '@/components/ButtonComponent';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Chip, Skeleton } from '@mui/material';
import { ItemListRecentsType } from '@/interfaces/Corretores';

type Props = {
    data: ItemListRecentsType | null;
}

export default function Header({ data }: Props) {
    const router = useRouter();
    // const { idCorretor, slug, id } = router.query;

    return (
        <div className="header-page header-corretor">
            <div className="content">
                <div className="nav">
                    <Button
                        label="Voltar"
                        name="minimal"
                        size="medium"
                        variant="text"
                        id='btn-back'
                        startIcon={<ArrowBackIcon className="icon icon-left" />}
                        onClick={() => router.back()}
                    />
                </div>

                <div className="info">
                    <div className="address">
                        <div className="row">
                            <LocationOnIcon className="icon-header" id="map-ico" />
                            { data?.logradouro ? <span data-testid="header-state">{data?.logradouro}, {data?.numero} {data?.unidade ? ', ' + data?.unidade : ''} {data?.complemento ? ' / ' + data?.complemento : ''}</span> : <Skeleton width={180} animation="wave" /> }
                        </div>

                        <div className="row">
                            { data?.logradouro ? <span data-testid="header-adress">{data?.cidade} - {data?.uf}</span> : <Skeleton width={180} animation="wave" /> }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
