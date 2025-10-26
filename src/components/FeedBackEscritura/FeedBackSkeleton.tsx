import React from 'react';
import Skeleton from '@mui/material/Skeleton';

export default function FeedBackSkeleton(){
    return(
        <div>
            <Skeleton animation="wave" variant="rectangular" height={40} style={{marginBottom: '40px'}} />
            <Skeleton animation="wave" variant="rectangular" height={24} style={{marginBottom: '10px'}} />
            <Skeleton animation="wave" variant="rectangular" width={300} height={24} style={{marginBottom: '40px'}} />
            <Skeleton animation="wave" variant="rectangular" height={24} style={{marginBottom: '40px'}} />
            <Skeleton animation="wave" variant="rectangular" height={72} style={{marginBottom: '25px'}} />
            <Skeleton animation="wave" variant="rectangular" height={72} style={{marginBottom: '25px'}} />
            <Skeleton animation="wave" variant="rectangular" height={72} style={{marginBottom: '25px'}} />
        </div>
    )
}