import axiosInstance from '../http/axiosInterceptorInstance';
import { ItemsCorrecoes, ListCorrecoes } from '@/interfaces/PosVenda/Devolucao';

async function getItemsCorrecoes() {
    let data: any = {}

    function capitalizeFirstWord(str: string | undefined): string {
        if (!str) return ""
        const words = str.toLowerCase().split(' ');
        const capitalizedWords = words.map(word => {
          if (word.length > 1) return word.charAt(0).toUpperCase() + word.slice(1)
          else return word.charAt(0) + word.slice(1)
        });
        return capitalizedWords.join(' ');
      };

    await axiosInstance.get('tipo_correcoes', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res => {
            data = {
                imovel: res.data.data.filter((e: ItemsCorrecoes) => e.tipo === 'Imóvel' && e.nome !== 'Outro motivo'),
                recibo: res.data.data.filter((e: ItemsCorrecoes) => e.tipo === 'Correções do recibo de sinal' && e.nome !== 'Outro motivo'),
                pf: res.data.data.filter((e: ItemsCorrecoes) => e.tipo === 'Pessoa Física' && e.nome !== 'Outro motivo'),
                pj: res.data.data.filter((e: ItemsCorrecoes) => e.tipo === 'Pessoa Jurídica' && e.nome !== 'Outro motivo'),
                representante: res.data.data.filter((e: ItemsCorrecoes) => e.tipo === 'Representante' && e.nome !== 'Outro motivo'),
            }
            res.data.data.forEach((e: ItemsCorrecoes) => {
                if(e.nome === "Outro motivo") {
                    // e.tipo === 'Imóvel' && data.imovel.push(e),
                    // e.tipo === 'Correções do recibo de sinal' && data.recibo.push(e),
                    // e.tipo === 'Pessoa Física' && data.pf.push(e),
                    // e.tipo === 'Pessoa Jurídica' && data.pj.push(e),
                    // e.tipo === 'Representante' && data.representante.push(e)
                }
            })
            console.log("List Correções ", data);
        })
        .catch(err => {
            console.log(err);
        })
        return data;
        
}

export default getItemsCorrecoes;