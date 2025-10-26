import { ApiTopicosAnaliseType } from '@/interfaces/PosVenda/Analise';
import axiosInstance from '../http/axiosInterceptorInstance';

async function GetListTopicos(processo_id: number | string) {
    let data
    // function capitalizeFirstWord(str: string | undefined): string {
    //     if (!str) return ""
    //     const words = str.toLowerCase().split(' ');
    //     const capitalizedWords = words.map(word => {
    //       if (word.length > 1) return word.charAt(0).toUpperCase() + word.slice(1)
    //       else return word.charAt(0) + word.slice(1)
    //     });
    //     return capitalizedWords.join(' ');
    //   };

    await axiosInstance.post('topicos_analise', {
        processo_id
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }).then(res => {
        console.log(res);          
        data = res.data as ApiTopicosAnaliseType;
        data.lista_topicos.unshift({id: '', name: "Selecione..."});
        data.vendedores_envolvidos.unshift({id: '', nome: 'Selecione o vendedor responsável', tipo_pessoa: 0})
        // data.tipos.lista_averbacao.unshift({id: '', name: "Selecione..."});
    }).catch(err => {
        console.log(err);
    })
    return data
}

export default GetListTopicos;