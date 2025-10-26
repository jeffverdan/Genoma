import { Skeleton, TableBody, TableCell, TableRow } from '@mui/material';
import React, { useState } from 'react';

export default function SkeletonPontosAtencao() {

    return (
        <>
            <div className='skeleton-pontos-atencao'>
                <Skeleton animation="wave" variant='rounded' height={15} width={50} />
                <Skeleton animation="wave" variant='rounded' width="20%" height={15} />
            </div>
            <div className='skeleton-pontos-atencao'>
                <Skeleton animation="wave" variant='rounded' height={15} width={50} />
                <Skeleton animation="wave" variant='rounded' width="40%" height={15} />
            </div>
            <div className='skeleton-pontos-atencao'>
                <Skeleton animation="wave" variant='rounded' height={15} width={50} />
                <Skeleton animation="wave" variant='rounded' width="30%" height={15} />
            </div>
            <div className='skeleton-pontos-atencao'>
                <Skeleton animation="wave" variant='rounded' height={15} width={50} />
                <Skeleton animation="wave" variant='rounded' width="45%" height={15} />
            </div>
            <div className='skeleton-pontos-atencao'>
                <Skeleton animation="wave" variant='rounded' height={15} width={50} />
                <Skeleton animation="wave" variant='rounded' width="25%" height={15} />
            </div>
        </>
    )
}