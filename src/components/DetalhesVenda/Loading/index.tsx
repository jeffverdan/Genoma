import React from 'react'
import { Skeleton } from '@mui/material'

export default function Loading() {
    return (
        <div className="detalhes-container">
            <div className='detalhes-content'>
                <h2></h2>
                <Skeleton variant='text' width={360} height={30}  />

                <div className='row'>
                    <div className='col 1'>
                        <div>
                            <p><Skeleton animation="wave" variant='text' width={150}  /></p>
                            <span><Skeleton animation="wave" variant='text' width={200}  /></span>
                        </div>

                        <div>
                            <p><Skeleton animation="wave" variant='text' width={80}  /></p>
                            <span><Skeleton animation="wave" variant='text' width={180}  /></span>
                        </div>

                        <div>
                            <p><Skeleton animation="wave" variant='text' width={120}  /></p>
                            <span><Skeleton animation="wave" variant='text' width={95}  /></span>
                        </div>

                        <div>
                            <p><Skeleton animation="wave" variant='text' width={90}  /></p>
                            <span><Skeleton animation="wave" variant='text' width={150}  /></span>
                        </div>
                    </div>

                    <div className='col 2'>
                        <div>
                            <p><Skeleton animation="wave" variant='text' width={150}  /></p>
                            <span><Skeleton animation="wave" variant='text' width={200}  /></span>
                        </div>

                        <div>
                            <p><Skeleton animation="wave" variant='text' width={80}  /></p>
                            <span><Skeleton animation="wave" variant='text' width={180}  /></span>
                        </div>

                        <div>
                            <p><Skeleton animation="wave" variant='text' width={120}  /></p>
                            <span><Skeleton animation="wave" variant='text' width={95}  /></span>
                        </div>

                        <div>
                            <p><Skeleton animation="wave" variant='text' width={90}  /></p>
                            <span><Skeleton animation="wave" variant='text' width={150}  /></span>
                        </div>
                    </div>
                </div>            
            </div>
        </div>
        
    )
}
