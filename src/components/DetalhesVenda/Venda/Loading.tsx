import React from 'react'
import {Skeleton} from '@mui/material'

interface ILoading {
    tab: string
}

export default function Loading({tab}: ILoading) {
    return (
        <div className='detalhes-container'>
            <div className='detalhes-content'>
                <h2>
                    {
                        tab === 'Resumo'
                            ? 'Resumo do processo'
                            : tab === 'Recibo'
                                ? 'Recibo de Sinal assinado'
                                : 'Planilha de Comissão'
                    }
                </h2>
                <h3 className='subtitle'><Skeleton animation="wave" width={150} /></h3>
                <div className='row'>
                    <div className='col'>
                        <div className='sub-container'>
                            <Skeleton animation="wave" width={150} />
                            <span className='content'>
                                <Skeleton animation="wave" width={300} />
                            </span>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className='col'>
                        <div className='sub-container'>
                            <Skeleton animation="wave" width={150} />
                            <span className='content'>
                                <Skeleton animation="wave" width={300} />
                            </span>
                            <span className='content'>
                                <Skeleton animation="wave" width={200} />
                            </span>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className='col'>
                        <div className='sub-container'>
                            <Skeleton animation="wave" width={150} />
                            <span className='content'>
                                <Skeleton animation="wave" width={100} />
                            </span>
                            <span className='content'>
                                <Skeleton animation="wave" width={300} />
                            </span>
                            <span className='content'>
                                <Skeleton animation="wave" width={250} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
