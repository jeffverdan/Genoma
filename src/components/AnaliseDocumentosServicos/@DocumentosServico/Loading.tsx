import React from 'react';
import Skeleton from '@mui/material/Skeleton';

export default function Loading() {
    return (
        <div className='new-topic-container'>
            <div className='cards cards-servicos'>
                <Skeleton animation="wave" variant="rounded" height={40} width={500} />
                <div style={{display: 'flex', gap: '20px'}}>
                    <Skeleton variant="rounded" width={400} height={60} />
                    <Skeleton variant="rounded" width={210} height={60} />
                </div>
            </div>
        </div>
    )
}
