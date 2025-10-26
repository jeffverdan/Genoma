import Skeleton from '@mui/material/Skeleton';
import React from 'react'


export default function SkeletonCardGraficos() {
    return (
        <>
            <div className="content">
                <Skeleton className="card-pie-chart" style={{margin: '0px'}} variant="rounded" height={494} animation="wave" />
                <Skeleton className="card-pie-chart" style={{margin: '0px'}} variant="rounded" height={494} animation="wave" />
                <Skeleton className="card-pie-chart" style={{margin: '0px'}} variant="rounded" height={494} animation="wave" />
            </div>

            {/* <div className="content">
                <Skeleton className="card-pie-chart" variant="rounded" height={494} animation="wave" />
            </div>

            <div className="content">
                <Skeleton className="card-pie-chart" variant="rounded" height={494} animation="wave" />
            </div> */}
        </>
    )
}
