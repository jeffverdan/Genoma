import { Skeleton, TableBody, TableCell, TableRow } from '@mui/material';
import React, { useState } from 'react';

export default function SkeletonTableNucleo({ tabIndex }: { tabIndex: number }) {
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
                    <TableCell padding='none' width={"97px"/*"7.3%"*/}>
                        <div className='first'>
                            <div className='col avatar'>
                                <Skeleton animation="wave" variant="circular" height={28} width={28} />
                                <Skeleton animation="wave" width="80%" height={16} />
                            </div>
                        </div>
                    </TableCell>

                    <TableCell padding='none' width={"79px"/*"7.3%"*/}>
                        <div className='first'>
                            <div className='col avatar'>
                                <Skeleton animation="wave" variant="circular" height={28} width={28} />
                                <Skeleton animation="wave" width="80%" height={16} />
                            </div>
                        </div>
                    </TableCell>

                    <TableCell padding='none' width={"75px"/*"6.7%"*/}>
                        <div className={`col-table`}>
                            <div className='col data'>
                                <Skeleton animation="wave" width="100%" />
                            </div>
                        </div>
                    </TableCell>

                    <TableCell padding='none' width={"230px"/*"6.7%"*/}>
                        <div className={`col-table`}>
                            <div className='col text'>
                                <Skeleton animation="wave" width="100%" />
                                <Skeleton animation="wave" width="80%" />
                            </div>
                        </div>
                    </TableCell>

                    <TableCell padding='none' width={"85px"/*"6.7%"*/}>
                        <div className={`col-table`}>
                            <div className='col text'>
                                <Skeleton animation="wave" width="50%" />
                            </div>
                        </div>
                    </TableCell>

                    <TableCell padding='none' width={"15px"/*"6.7%"*/}>
                        <div className={`col-table`}>
                            <div className='col text'>
                                <Skeleton animation="wave" width="100%" />
                            </div>
                        </div>
                    </TableCell>

                    <TableCell padding='none' width={"85px"/*"6.7%"*/}>
                        <div className={`col-table`}>
                            <div className='col data'>
                                <Skeleton animation="wave" width="50%" />
                            </div>
                        </div>
                    </TableCell>

                    <TableCell padding='none' width={"75px"/*"6.7%"*/}>
                        <div className={`col-table`}>
                            <div className='col text'>
                                <Skeleton animation="wave" width="100%" />
                            </div>
                        </div>
                    </TableCell>

                    <TableCell padding='none' width={"75px"/*"6.7%"*/}>
                        <div className={`col-table`}>
                            <div className='col text'>
                                <Skeleton animation="wave" width="100%" />
                            </div>
                        </div>
                    </TableCell>

                    <TableCell padding='none' width={"200px"/*"6.7%"*/}>
                        <div className={`col-table`}>
                            <div className='col text'>
                                <Skeleton animation="wave" width="100%" />
                            </div>
                        </div>
                    </TableCell>


                    <TableCell padding='none' width={"45px"/*"6.7%"*/}>
                        <div className={`col-table`}>
                            <div className='col text'>
                                <Skeleton animation="wave" width="100%" />
                            </div>
                        </div>
                    </TableCell>

                    <TableCell className='skeleton-action' width={"120px"/*'12%'*/}>
                        <div className={`col-table`}>
                            <div className='col actions'>

                            </div>
                        </div>
                    </TableCell>

                    {/* <TableCell className='skeleton-action' width={'10%'}>
                        <div className={`col-table`}>
                            <div className='col actions'>

                            </div>
                        </div>
                    </TableCell> */}
                </TableRow>
            ))}
        </TableBody>
    )
}