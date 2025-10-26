import axiosInstance from '../http/axiosInterceptorInstance';

type ResponseType = {
    cpf_cnpj: string
    id: number
    name: string
    perfil: "Cliente" | "Gerente"
    perfil_id: 1 | 2 | 3 // 1: Gerente, 2: Vendedor, 3: Comprador
    label: string
}

type StatusType =  'andamento' | 'finalizadas' | 'revisoes' | 'cancelados' | null

function removeNonLetterPrefix(str: string): string {
    str = captalizeLetters(str);
    return str.replace(/^[^a-zA-Z]+/, "");
}

function sortByLabel(lista: ResponseType[]): ResponseType[] {
    return lista.sort((a, b) => a.label.localeCompare(b.label));
}

function captalizeLetters(str: string): string {
    return str.toLowerCase().replace(/(^|\s)([a-záàâãéèêíïóôõöúçñ])/g, (match, p1, p2) => {
        return p1 + p2.toUpperCase();
    });
}

interface PropsType {
    status?: StatusType
    aba_financeiro?: "a_receber" | "a_pagar" | "concluido" | "cancelado"
}

async function getListClientesGerentes({ status, aba_financeiro }: PropsType): Promise<ResponseType[] | undefined> {
    // console.log(status_id)
    let data;
    await axiosInstance.get('listagem_clientes_gerentes', {
        params: {
            status,
            aba_financeiro
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
                console.log("listaClientes: ", listaClientes.filter((e) => e.perfil_id !== 1));
                
                data = sortByLabel(listaClientes.filter((e) => e.name).map((cliente) => { return { ...cliente, "label": removeNonLetterPrefix(cliente.name) } }).filter((e) => e.label));
                                
            }
        }
    }).catch(error => {
        console.log(error);
    })

    return data;
}
export default getListClientesGerentes