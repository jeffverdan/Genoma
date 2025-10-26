import React, {useState} from 'react';
import styles from './index.module.scss';
import { RocketLaunchIcon } from "@heroicons/react/24/outline";

interface FoguetesProps{
    quantidade: number;
}

export default function Foguetes({quantidade} :FoguetesProps){

    const numFoguetes: number = 5
   
    return (
        <div className={styles.foguetes}>
            <div className={styles.icones} style={{display: 'none'}} data-testid="rockets-points">
                {[...Array(numFoguetes)].map((_, index) => (
                    <RocketLaunchIcon key={index} className={`${styles.icone} ${index+1 <= quantidade ? styles.active : ''}`} />
                ))}
            </div>
        </div>
    )
}