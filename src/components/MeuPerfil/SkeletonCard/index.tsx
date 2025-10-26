import React from 'react'
import { Chip, Paper, Skeleton } from '@mui/material';

export default function SkeletonCard() {
    const skeletonTitle = <Skeleton variant="text" sx={{ fontSize: '2rem' }} width={200} animation="wave" />;
    const skeletonText = <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={130} animation="wave" />;

    return (
        <div className="dados-pessoais-perfil">
        <Paper className='card-content'>
            <div className='detalhes-content'>
                <h2>{skeletonTitle}</h2>

                <div className="row">
                    <div className="col">
                        <p>{skeletonText}</p>
                        <span>
                            {skeletonText}
                        </span>
                    </div>

                    <div className="col">
                        <p>{skeletonText}</p>
                        <span>{skeletonText}</span>
                    </div>
                </div>

                <div className='row'>
                    <div className="col">
                        <p>{skeletonText}</p>
                        <span>{skeletonText}</span>
                    </div>

                    <div className="col">
                        <p>{skeletonText}</p>
                        <span>{skeletonText}</span>
                    </div>

                    <div className="col">
                        <p>{skeletonText}</p>
                        <span>{skeletonText}</span>
                    </div>
                </div>

                {/* <div className="subtitle">{skeletonTitle}</div> */}

                <div className="row">
                    <div className="col">
                        <p>{skeletonText}</p>
                        <span>{skeletonText}</span>
                    </div>
                </div>
            </div>
        </Paper>
        </div>
    )
}
