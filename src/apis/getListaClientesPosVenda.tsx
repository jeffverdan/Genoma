import axiosInstance from '../http/axiosInterceptorInstance';

type ResponseType = {
    cpf_cnpj: string
    id: string | number
    name: string
    label: string
}

type StatusType =  'andamento' | 'finalizadas' | 'revisoes' | 'cancelados'

function removeNonLetterPrefix(str: string): string {
    return str.replace(/^[^a-zA-Z]+/, "");
}

function sortByLabel(lista: ResponseType[]): ResponseType[] {
    return lista.sort((a, b) => a.label.localeCompare(b.label));
}

async function getListClientesPosVenda(status: StatusType): Promise<ResponseType[] | undefined> {
    // console.log(status_id)
    let data;
    await axiosInstance.get('filtro_clientes_pos', {
        params: {
            status
        },
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }).then(res => {
        if (res !== undefined) {
            if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
                localStorage.clear();
            } else {
                const listaClientes = res.data as ResponseType[];
                data = sortByLabel(listaClientes.filter((e) => e.name).map((cliente) => { return { ...cliente, "label": removeNonLetterPrefix(cliente.name) } }).filter((e) => e.label));
                                
            }
        }
    }).catch(error => {
        console.log(error);
    })

    return data;
}
export default getListClientesPosVenda