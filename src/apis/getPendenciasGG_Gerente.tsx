import { ResApiType } from '@/interfaces/Vendas/MenuPrincipal';
import axiosInstance from '../http/axiosInterceptorInstance';

type DataRow = {
    processo_id: number,
    imovel_id: number,
    loja_id: number,
    logradouro: string,
    numero: string,
    unidade: string,
    complemento: string | null,
    bairro: string,
    cidade: string,
    uf: string,
    recibo_type: 'manual' | 'docusign',
    recibo: string | null,
    status_processo_id: number,
    porcentagem_cadastro_total: string,
    porcentagem_comissao: number,
    pendencia: [
        'recibo' | 'não tem pendencia de recibo',
        'comissao' | 'não tem pendencia de comissão'
    ]
    menssagem: string
    endereco: string
    tag: TagType
};

type TagType = {
    color: 'green' | 'neutral'
    label: string
}

const returnMsg = (motivos: [
    'recibo' | 'não tem pendencia de recibo',
    'comissao' | 'não tem pendencia de comissão'
]) => {

    if (motivos.find((motivo) => motivo === 'recibo')) return 'Subir Recibo de Sinal assinado'
    else if (motivos.find((motivo) => motivo === 'comissao')) return 'Preencher dados da Comissão'
    else return motivos[0]
};

const returnTag = (motivos: [
    'recibo' | 'não tem pendencia de recibo',
    'comissao' | 'não tem pendencia de comissão'
]) => {
    let tag: TagType = {
        color: "neutral",
        label: 'NÃO SETADO'
    };

    if (motivos.find((motivo) => motivo === 'recibo')) return tag = {
        color: "green",
        label: 'PRONTO'
    }
    else if (motivos.find((motivo) => motivo === 'comissao')) return tag = {
        color: "green",
        label: 'pós-entrega'
    }
    else return tag;
};

async function GetPendencias(): Promise<ResApiType[] | undefined> {
    let data;

    await axiosInstance.post('lista_pendencias', {
        usuario_id: localStorage.getItem('usuario_id'),
        loja_id: localStorage.getItem('loja_id'),
        perfil_login_id: localStorage.getItem('perfil_login_id')
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    })
        .then(async (res: { data: ResApiType[] }) => {
            if (res) {
                // res.data.forEach((pendencia: DataRow) => {
                //     pendencia.menssagem = returnMsg(pendencia.pendencia);
                //     pendencia.endereco = `${pendencia.logradouro},${pendencia.numero}${pendencia.unidade ? ' / ' + pendencia.unidade : ''}${pendencia.complemento ? ' / ' + pendencia.complemento : ''}`
                //     pendencia.tag = returnTag(pendencia.pendencia);
                // })
                data = res.data;


                console.log("Retorna Pendencias ", data);
            }
        })
        .catch(err => {
            console.log(err);
            // router.push('/403')
        })
    return data;
}

export default GetPendencias;