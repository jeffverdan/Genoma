import axiosInstance from '../http/axiosInterceptorInstance';

interface PropsType {
    tipo: "financiado" | "a_vista"    
    valor_checked: boolean
    usuario_id: number | string
}

async function SalvarFila(props: PropsType): Promise<boolean> {    
    let data = false
    await axiosInstance.post('salvar_fila', {        
        ...props            
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(async res => {
            console.log("Result to save: ", res);
            data = true
            
        })
        .catch(err => {
            console.log("Error to save: ", err);            
        })    
        return data;
}

export default SalvarFila;