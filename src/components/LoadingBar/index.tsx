import React from 'react';
import styles from './index.module.scss';

import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  const returnColor = () => {
    if(props.value <= 0) {
      return 'inherit'
    } else if (props.value < 100) {
      return 'warning'
    } else {
      return 'primary'
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center',  borderRadius: '8px' }} data-testid='status-bar'>
      <Box sx={{ width: '100%', }}>
        <LinearProgress sx={{  borderRadius: '16px', height: '6px' }} variant="determinate" {...props} color={returnColor()} />
      </Box>
      
      {/* <Box sx={{ minWidth: 35 }}> ADICIONA O NUMERO NO FINAL DA BAR EX: 10%
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box> */}
    </Box>
  );
}

export default function LinearWithValueLabel({progress} : {progress: number}) {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}