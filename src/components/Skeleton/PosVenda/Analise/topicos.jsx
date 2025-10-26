import { Skeleton, TableBody, TableCell, TableRow } from '@mui/material';
import React, { useState } from 'react';

export default function SkeletonTopics() {

    return (
        <>
            <div className='skeleton-topics'>
                <Skeleton animation="wave" variant="circular" height={20} width={20} />
                <Skeleton animation="wave" width="20%" height={20} />
            </div>
            <div className='skeleton-topics'>
                <Skeleton animation="wave" variant="circular" height={20} width={20} />
                <Skeleton animation="wave" width="40%" height={20} />
            </div>
            <div className='skeleton-topics'>
                <Skeleton animation="wave" variant="circular" height={20} width={20} />
                <Skeleton animation="wave" width="30%" height={20} />
            </div>
            <div className='skeleton-topics'>
                <Skeleton animation="wave" variant="circular" height={20} width={20} />
                <Skeleton animation="wave" width="45%" height={20} />
            </div>
            <div className='skeleton-topics'>
                <Skeleton animation="wave" variant="circular" height={20} width={20} />
                <Skeleton animation="wave" width="25%" height={20} />
            </div>
        </>
    )
}