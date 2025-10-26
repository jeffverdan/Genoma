import {AxiosRequestConfig } from 'axios';
import axiosInstance from '../http/axiosInterceptorInstance';

async function getImovelBancoMidas(value: string) {
    let data;
    const error = 'O Banco de dados e o Mídas não retornou nenhum imóvel com esse código';
    
    await axiosInstance.get('pesquisar_codigo',{
        params: {
            codigo: value,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
            data = res.data
        })
        .catch(err => {
            //console.log(err);
            console.log(error);
        })
    return data;
}

export default getImovelBancoMidas;