import axiosInstance from '../http/axiosInterceptorInstance';
import { TypeGetListChavesPix } from './Interfaces/typeGetListChavesPix';

async function GetListChavesPix(): Promise<TypeGetListChavesPix> {
    let data = [{ name: 'CPF, celular ou e-mail', id: '' }];
    const error = 'Erro ao retornar os GetListChavesPix';

    await axiosInstance.get('tipos_chaves_pix', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }).then(res => {
            res.data.forEach((chave: {chave_pix: string, id: string}) => {
                data.push({name: chave.chave_pix, id: chave.id})
            });
            console.log("ChavesPix List ",data);
        })
        .catch(err => {
            console.log(error);
        })
    return data as TypeGetListChavesPix;
}

export default GetListChavesPix;