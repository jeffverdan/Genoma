import {ArrayPessoaFisicaData} from '@/types/ArrayPessoaFisicaData';

export type ArrayPessoaJuridicaData = {
    id?: number
    label: string // nome fantasia
    progress: number
    subTitle?: string
    icon: any
    badgeLabel: string
    badgeTipo: string
    url: string
    representantes: ArrayPessoaFisicaData[]
  }