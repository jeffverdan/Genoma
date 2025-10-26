import Skeleton from '@mui/material/Skeleton'
import React from 'react'
import styles from './index.module.scss'

export default function SkeletonNotas() {
    return (
        <>
            <div className={styles.item} style={{display: 'flex'}}>
                <div className={`${styles.row} ${styles.row1}`}>
                    <div className={styles.persona}>
                        <Skeleton animation="wave" variant="circular" height={30} width={30} />
                    </div>
                    <div className={styles.col}>
                        <Skeleton animation="wave" variant="rectangular" width={200} height={20} style={{marginBottom: '10px'}} />
                        <Skeleton animation="wave" variant="rectangular" width={'100%'} height={35} />
                    </div>
                </div>
            </div>

            <div className={styles.item} style={{display: 'flex'}}>
                <div className={`${styles.row} ${styles.row1}`}>
                    <div className={styles.persona}>
                        <Skeleton animation="wave" variant="circular" height={30} width={30} />
                    </div>
                    <div className={styles.col}>
                        <Skeleton animation="wave" variant="rectangular" width={200} height={20} style={{marginBottom: '10px'}} />
                        <Skeleton animation="wave" variant="rectangular" width={'100%'} height={35} />
                    </div>
                </div>
            </div>

            <div className={styles.item} style={{display: 'flex'}}>
                <div className={`${styles.row} ${styles.row1}`}>
                    <div className={styles.persona}>
                        <Skeleton animation="wave" variant="circular" height={30} width={30} />
                    </div>
                    <div className={styles.col}>
                        <Skeleton animation="wave" variant="rectangular" width={200} height={20} style={{marginBottom: '10px'}} />
                        <Skeleton animation="wave" variant="rectangular" width={'100%'} height={35} />
                    </div>
                </div>
            </div>
        </>
    )
}
