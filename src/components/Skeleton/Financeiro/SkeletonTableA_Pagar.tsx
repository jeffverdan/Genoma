import { Skeleton, TableBody, TableCell, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface PropsType {
    columns: readonly { id: string, label: string, minWidth: string, align: string }[],
}

export default function SkeletonTableA_Pagar({ columns }: PropsType) {

    console.log(columns.length);    

    return (
        <TableBody>
            {columns.map((row, index) => (
                <TableRow
                    hover
                    key={index}
                    tabIndex={-1}
                    className={`row-table novo`}
                // onMouseEnter={() => setIsHover(row.processo_id)}
                >
                    <TableCell padding='none'>
                        <div className={`first  ${index === 0 && 'rowHover'}`}>
                            <div className='col text' style={{ width: columns[0].minWidth }}>                                
                                <Skeleton animation="wave" width="100%" height={16} />
                            </div>
                        </div>
                    </TableCell>

                    <TableCell padding='none'>
                        <div className={`col-table`}>
                            <div className='col text' style={{ width: columns[1]?.minWidth }}>
                                <Skeleton animation="wave" width="80%" />
                                <Skeleton animation="wave" width="50%" />
                            </div>
                        </div>
                    </TableCell>

                    <TableCell padding='none'>
                        <div className={`col-table`}>
                            <div className='col data' style={{ width: columns[2]?.minWidth }}>
                                <Skeleton animation="wave" width="100%" />
                            </div>
                        </div>
                    </TableCell>

                    <TableCell padding='none'>
                        <div className={`col-table`}>
                            <div className='col text' style={{ width: columns[3]?.minWidth }}>
                                <Skeleton animation="wave" width="80%" />
                                
                            </div>
                        </div>
                    </TableCell>

                    <TableCell padding='none'>
                        <div className={`col-table`}>
                            <div className='col graph' style={{ width: columns[4]?.minWidth }}>
                                <Skeleton animation="wave" width="100%" />
                                <Skeleton animation="wave" width="50%" />
                            </div>
                        </div>
                    </TableCell>

                    <TableCell padding='none'>
                        <div className={`col-table ${columns.length > 10 ? 'no-pading' : ''}`}>
                            <div className='col actions' style={{ width: columns[5]?.minWidth }}>

                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}