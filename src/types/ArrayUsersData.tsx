import { ArrayPessoaFisicaData } from '@/types/ArrayPessoaFisicaData';
import { ArrayPessoaJuridicaData } from '@/types/ArrayPessoaJuridicaData';

export type ArrayUsersData = {
    fisicas: ArrayPessoaFisicaData[]
    empresas: ArrayPessoaJuridicaData[]
}