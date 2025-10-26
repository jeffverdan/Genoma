import { Skeleton } from '@mui/material';
import React from 'react';

export default function SkeletonTableGerente() {
  const style = { ml: '22px', borderRadius: '12px', mb: '-25px' }

  return (
    <>
      <Skeleton sx={style} width='100%' height={112} />

      <Skeleton sx={style} width={688} height={96} />

      <Skeleton sx={style} style={{marginTop: -76}} width='calc(100% - 35px)' height="calc(90vh - 100px )" />
    </>
  )
}