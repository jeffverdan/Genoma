import styles from './index.module.scss';
import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import GlobalContext from '@/context/GlobalContext';
import Icon from '@mui/material/Icon';

import Chip from '@mui/material/Chip';
import { HomeModernIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import LoadingBar from '../LoadingBar'
import { useRouter } from 'next/router';
import ButtonComponent from '../ButtonComponent';
import { HiEllipsisHorizontal } from 'react-icons/hi2';

// export default function index({label, icon, startIcon, endIcon,  disabled, error, onClick}: ButtonProps) {


type ArrayPessoaFisicaData = {
  id?: number
  label: string
  progress?: number
  subTitle?: string
  icon: any
  badgeLabel?: string
  badgeTipo?: string
  url: string
  disable?: boolean
  fillIcon?: string
  IconRight?: any
  hidden?: boolean
}

export default function BasicCard({ options, handleClickMenuOpen }: { options: ArrayPessoaFisicaData, handleClickMenuOpen?: (event: React.MouseEvent<HTMLButtonElement>) => void }) {
  const { label, subTitle, icon: Icon, badgeLabel, progress, disable, url, badgeTipo, fillIcon, IconRight, hidden } = options;
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);


  const handleClick = () => {
    const path = subTitle === 'CONTINUAR NA SAFEBOX' ? 'https://safebox-homologacao.azurewebsites.net/' : router.asPath + '/' + url;
    router.push(path);
  };

  const handleClickButton2 = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (handleClickMenuOpen) handleClickMenuOpen(e);
  };

  const badgeLabelStyle = (tag?: string) => {
    if (!tag) return ''
    switch (tag.toLowerCase()) {
      case 'concluído':
        return styles.concluido
      case 'feito':
        return styles.concluido
      case 'fazendo':
        return styles.fazendo
      case 'pendente':
        return styles.pendente
      default:
        return styles.neutral
    }
  };

  const labelStyle = (tag?: string) => {
    if (!tag) return ''
    switch (tag.toLowerCase()) {
      case 'concluído':
        return styles.labelConcluido
      case 'feito':
        return styles.labelConcluido
      default:
        return styles.labelNeutral
    }
  };

  let styleCardBlock: any;

  async function reciboControll() {
    if (url === 'recibo') {
      if (disable === true) {
        styleCardBlock = {
          cursor: 'not-allowed',
          pointerEvents: 'none'
        }
      }

      else {
        styleCardBlock = {
          cursor: 'pointer',
          pointerEvents: 'auto'
        }
      }
    }
  }
  reciboControll();

  return (
    <div className={styles.cards} style={styleCardBlock} hidden={hidden}>
      <Card sx={{ width: 203, height: 231 }} className={disable ? styles.disable : styles.card} onClick={handleClick}>
        <CardContent className={styles.container}>
          <div className={styles.containerIcons}>
            <div className={styles.chips}>
              {badgeLabel && <Chip label={badgeLabel} className={'chip ' + ' ' + badgeLabelStyle(badgeLabel)} data-testid="status" />}
              {badgeTipo && <Chip label={badgeTipo} className={'chip ' + ' ' + badgeLabelStyle(badgeTipo)} size='small' />}
              {(badgeTipo && !IconRight) && <div className={styles.btnOptions}> <ButtonComponent id='editUser' size={'small'} variant={'text'} label={''} endIcon={<HiEllipsisHorizontal />} onClick={handleClickButton2} /> </div>}
            </div>
            {IconRight && <IconRight fill='red' className='icon-right' />}
          </div>


          <div className={styles.content + ' card-content'}>
            <div className={styles.items}>
              <Icon data-testid='icon-content' className='card-svg' fill={fillIcon ? fillIcon : 'rgba(1, 152, 140, 1)'} width={fillIcon ? 60 : 53} height={fillIcon ? 60 : 49} />
              <h5 data-testid='label' className={labelStyle(badgeLabel)}>{label ? label : ""}</h5>
            </div>

            <div className={styles.items}>
              <div className={styles.subtitle} data-testid='subtitle'>{subTitle ? subTitle : ""}</div>
              <div className={styles.mobileIcon}><ArrowRightIcon /></div>
            </div>
          </div>

          {Number(progress) >= 0 ? <LoadingBar progress={progress || 0} /> : <div></div>}
        </CardContent>
      </Card>
    </div>
  );
}