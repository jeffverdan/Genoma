import { Skeleton, TableBody, TableCell, TableRow } from '@mui/material';
import React, { useState } from 'react';

export default function SkeletonDocumentos() {

    return (
        <>
            <div className='item item-skeleton'>
                <div className='icon-label'>
                    <Skeleton animation="wave" variant="circular" height={20} width={20} />
                    <Skeleton animation="wave" width={76} height={20} />
                </div>
                <Skeleton animation="wave" width={167} height={36} />
            </div>
            <div className='item item-skeleton'>
                <div className='icon-label'>
                    <Skeleton animation="wave" variant="circular" height={20} width={20} />
                    <Skeleton animation="wave" width={76} height={20} />
                </div>
                <Skeleton animation="wave" width={167} height={36} />
            </div>
        </>
    )
}