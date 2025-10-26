import React from 'react';
import {CircularProgress} from '@mui/material';
import { CircularProgressProps } from '@mui/material/CircularProgress';


export default function CircularLoading(){
    return(
        <CircularProgress 
            className="circle-loading"
        />
    )
}