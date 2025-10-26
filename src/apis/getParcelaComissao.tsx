import { ParcelaComissoesType, ComissaoIndividuoType } from '@/interfaces/Apoio/planilhas_comissao';
import axiosInstance from '../http/axiosInterceptorInstance';

const arrKeys = [
    'corretores_opcionistas', 
    'corretores_vendedores', 
    'gerentes', 
    'gerentes_gerais',
    'diretores_gerais',
    'repasse_franquias',
    'empresas'
];

export default async function getParcelaComissao(parcela_id: string | number): Promise<ParcelaComissoesType> {
    const token = localStorage.getItem('token');
    let data: any;

    await axiosInstance.post('retornar_parcela', {
        parcela_id
      }, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0)) * 100);
          // setProgressBar([{percent: percentage, status: 'active'}]);
        },
      })
    .then(res => {
        if (!!res?.data) {
            if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
                localStorage.clear();
            } else {
                arrKeys.forEach((key) => {
                    res.data.parcela[key] = res.data.parcela[key].map((pessoa: any) => ({
                        ...pessoa,
                        value_autocomplete: {
                            usuario_id: Number(pessoa.usuario_id || pessoa.empresa_id),
                            label: pessoa.name || pessoa.nome_empresarial,
                        },
                    }));
                });
                
                data = {
                    ...res.data.parcela,
                    ...arrKeys.reduce((acc, key) => {
                        acc[`quantidade_${key}`] = res.data.parcela[key].length;
                        return acc;
                    }, {} as Record<string, number>),
                };                

            }
        }
    })   
    .catch(error => {
        console.log(error);
    })

    return data;
}
