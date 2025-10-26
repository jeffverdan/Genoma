import { Skeleton, TableBody, TableCell, TableRow } from '@mui/material';
import React, { useState } from 'react';

export default function SkeletonTableGerente() {
  const rows = [{}, {}, {}, {}, {}, {}, {}]

  return (
    <TableBody>
      {rows.map((row, index) => (
        <TableRow
          hover
          key={index}
          tabIndex={-1}
        >
          <TableCell component="th" scope="row">
            <div className='row-table gap18'>
              <Skeleton animation="wave" width="50%" />
              <Skeleton animation="wave" width="30%"  sx={{marginRight: 5}} />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}