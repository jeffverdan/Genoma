import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Avatar, Chip } from '@mui/material';

export default function index() {

    const qtdLoading = [1, 2, 3];

    return (
        <>
            {qtdLoading.map((_, index) => (
            <div className="list-corretores" key={index}>
                <div className="item-container">
                    <div className="valor-date">
                        <div className="valor-container">
                            
                            <Skeleton animation="wave" width={80} />
                            
                            <div className={`valor-content `}>
                                <span className="valor">{<Skeleton animation="wave" width={200} height={40} />}</span>
                            </div>
                        </div>
                        <div className="date-container">
                            <Skeleton animation="wave" width={100} />
                            <span><Skeleton animation="wave" width={100} /></span>
                        </div>
                    </div>

                    <div className="info-container">
                        <Skeleton animation="wave" variant="circular" width={40} height={40} />
                        <div className="endereco-container">
                            <p><Skeleton animation="wave" width={200} /></p>
                            <p className="subtitle">
                                <Skeleton animation="wave" width={100}/>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            ))}
        </>
    )
}
