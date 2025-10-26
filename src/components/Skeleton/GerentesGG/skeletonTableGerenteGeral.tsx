import { Skeleton, TableBody, TableCell, TableRow } from '@mui/material';
import React, { useState } from 'react';

export default function SkeletonTableGerente({ tabIndex }: { tabIndex: number }) {
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
          <TableCell className='skeleton-gerente'>
            <div className='col-gerente'>
              <Skeleton animation="wave" variant="circular" height={28} width={28} />
              <Skeleton animation="wave" width="80%" height={16} />
            </div>
          </TableCell>

          <TableCell className='skeleton-endereco'>
            <Skeleton animation="wave" width="70%" />
            <Skeleton animation="wave" width="50%" />
          </TableCell>

          {(tabIndex === 3 || tabIndex === 6) &&
            <>

              <TableCell className='skeleton-progresso'>
                <Skeleton animation="wave" width="80%" />
                <Skeleton animation="wave" width="80%" />
                <Skeleton animation="wave" width="80%" />
              </TableCell>

              <TableCell className='skeleton-status'>
                <div className='col-status'>
                  <Skeleton animation="wave" width="70%" />
                  <Skeleton animation="wave" width="100%" />
                </div>
              </TableCell>

              <TableCell className='skeleton-tools'>
              </TableCell>
            </>
          }

          {(tabIndex === 4) &&
            <>

              <TableCell className='col-data-assinatura'>
                <Skeleton animation="wave" width="80%" />
              </TableCell>

              <TableCell className='col-pedido-revisao'>
                  <Skeleton animation="wave" width="100%" />
                  <Skeleton animation="wave" width="70%" />
              </TableCell>

              <TableCell className='col-dias-corridos'>
                  <Skeleton animation="wave" width="100%" />
              </TableCell>

              <TableCell className='col-icons-revisoes'>
                <Skeleton animation="wave" width="80%" />
              </TableCell>

              <TableCell className='skeleton-tools'>
              </TableCell>
            </>
          }

          {(tabIndex === 5 || tabIndex === 7) &&
            <>
              <TableCell className='skeleton-assinatura'>
                <Skeleton animation="wave" width="80%" />
              </TableCell>

              <TableCell className='skeleton-escritura'>
                <Skeleton animation="wave" width="80%" />
                <Skeleton animation="wave" width="60%" />
              </TableCell>

              <TableCell className='skeleton-pagamento'>
                <Skeleton animation="wave" width="80%" />
              </TableCell>

              <TableCell className='skeleton-pos-venda' >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Skeleton animation="wave" variant="circular" height={28} width={28} />
                  <Skeleton animation="wave" width="80%" />
                </div>
              </TableCell>

              <TableCell className='skeleton-status'>
                <Skeleton animation="wave" width="80%" />
                <Skeleton animation="wave" width="80%" />
              </TableCell>

              <TableCell className='skeleton-recibo'>
                <Skeleton animation="wave" width="100%" />
                <Skeleton animation="wave" width="80%" />
              </TableCell>

              <TableCell className='skeleton-tools'>
              </TableCell>
              
            </>
          }

          
        </TableRow>
      ))}
    </TableBody>
  )
}