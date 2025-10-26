import { Skeleton, TableBody, TableCell, TableRow } from '@mui/material';
import React, { useState } from 'react';

export default function SkeletonTablePos({ tabIndex }: { tabIndex: number }) {
    const rows = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]

    return (
        <TableBody>
            {rows.map((row, index) => (
                <TableRow
                    hover
                    key={index}
                    tabIndex={-1}
                    className='row-table'
                >
                    {tabIndex !== 0 &&
                        <TableCell className='skeleton-gerente' width={'6.60%'}>
                            <div className='col-gerente'>
                                <Skeleton animation="wave" variant="circular" height={28} width={28} />
                                <Skeleton animation="wave" width="80%" height={16} />
                            </div>
                        </TableCell>
                    }

                    {tabIndex === 3 &&
                        <>
                            <TableCell className='skeleton-endereco' width={'29.65%'}>
                                <Skeleton animation="wave" width="70%" />
                                <Skeleton animation="wave" width="50%" />
                            </TableCell>

                            <TableCell className='skeleton-status' width={'7.51%'}>
                                <Skeleton animation="wave" width="80%" />
                                <Skeleton animation="wave" width="90%" />
                            </TableCell>

                            <TableCell className='skeleton-prazo-status' width={'118px'}>
                                {/* <div className='col-status'> */}
                                <Skeleton animation="wave" width="100%" />
                                <Skeleton animation="wave" width="70%" />
                                {/* </div> */}
                            </TableCell>

                            <TableCell className='skeleton-data-entrada' width={'9.68%'}>
                                <Skeleton animation="wave" width="100%" />
                                <Skeleton animation="wave" width="50%" />
                            </TableCell>

                            <TableCell className='skeleton-forma-pagamento' width={'9.45%'}>
                                <Skeleton animation="wave" width="80%" />
                            </TableCell>

                            <TableCell className='skeleton-laudemio' width={'9.45%'}>
                                <Skeleton animation="wave" width="80%" />
                            </TableCell>
                        </>
                    }

                    {(tabIndex === 4) &&
                        <>
                            <TableCell className='skeleton-endereco' width={'33%'}>
                                <Skeleton animation="wave" width="70%" />
                                <Skeleton animation="wave" width="50%" />
                            </TableCell>

                            <TableCell className='skeleton-data-assinatura' width={'10%'}>
                                <Skeleton animation="wave" width="80%" />
                            </TableCell>

                            <TableCell className='skeleton-pedido-revisao' width={'10%'} >
                                <Skeleton animation="wave" width="100%" />
                                <Skeleton animation="wave" width="70%" />
                            </TableCell>

                            <TableCell className='skeleton-dias-corridos' width={'7%'}>
                                <Skeleton animation="wave" width="100%" />
                            </TableCell>

                            <TableCell className='skeleton-icons-revisoes' width={'10%'}>
                                <Skeleton animation="wave" width="80%" />
                            </TableCell>
                        </>
                    }

                    {(tabIndex === 5 || tabIndex === 6) &&
                        <>
                            <TableCell className='skeleton-endereco' width={'25%'}>
                                <Skeleton animation="wave" width="70%" />
                                <Skeleton animation="wave" width="50%" />
                            </TableCell>

                            <TableCell className='skeleton-data-conclusao' width={'10%'} >
                                <Skeleton animation="wave" width="100%" />
                                <Skeleton animation="wave" width="70%" />
                            </TableCell>

                            <TableCell className='skeleton-forma-pagamento' width={'9.45%'}>
                                <Skeleton animation="wave" width="80%" />
                            </TableCell>
                        </>
                    }
                    {tabIndex !== 0 &&
                        <TableCell className='skeleton-gerente' width={'8.31%'}>
                            <div className='col-gerente'>
                                <Skeleton animation="wave" variant="circular" height={28} width={28} />
                                <Skeleton animation="wave" width="80%" height={16} />
                            </div>
                        </TableCell>
                    }

                    {tabIndex === 0 &&
                        <>
                            <TableCell width={'7.6%'}>
                                <Skeleton animation="wave" width="20%" />
                            </TableCell>
                            <TableCell width={'50%'}>
                                <Skeleton animation="wave" width="40%" />
                            </TableCell>
                            <TableCell className='skeleton-action' width={'12%'}>
                                <div>
                                    <Skeleton animation="wave" width="10%" />
                                </div>
                            </TableCell>
                            <TableCell className='skeleton-action' width={'10%'}>
                                <div>
                                    <Skeleton animation="wave" width="10%" />
                                </div>
                            </TableCell>
                        </>
                    }


                    {tabIndex !== 0 &&
                        <TableCell className='skeleton-tools' width={'23%'}>
                        </TableCell>
                    }

                </TableRow>
            ))}
        </TableBody>
    )
}