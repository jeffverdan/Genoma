import { FieldErrors, UseFormClearErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import Pessoa from "@/interfaces/Users/userData";

type ArrConflitosType = {
    id: string | number
    tipo_conflito: 'dados' | 'quantidade'
    campo: string
    campo_label: string
    valor_recibo: string | number
    valor_cadastro: string | number
    valor_edit: string | number
    checked_IA: boolean
    checked_edit: boolean
    pessoa?: Pessoa
    bloco?: number
}

type BlockProps = {
    index: number,
    data: imovelDataInterface
    type: 'vendedores' | 'compradores'
    userData: Pessoa;
    setUserData: (e: Pessoa) => void;
    register: UseFormRegister<FormValues>
    errors: FieldErrors<FormValues>
    watch: UseFormWatch<FormValues>
    setValue: UseFormSetValue<FormValues>
    clearErrors: UseFormClearErrors<FormValues>
};

type ArrMenuTypes = {
    id: number,
    label: string,
    checked: boolean,
    Block: React.FC<BlockProps>
    arrMissKeys: (keyof FormValues)[]
    hiddenIn: '' | 'vendedores' | 'compradores'
}

type FormValues = {
    // BLOCO DADOS PESSOAIS
    cpf_cnpj: string | '';
    data_nascimento: string | '';
    genero: string;
    name: string;
    nome_mae: string
    nome_pai: string
    nacionalidade: string;
    ddi: string;
    telefone: string;
    profissao: string;
    email: string;
    rg: string;
    rg_expedido: string
    data_rg_expedido: string
    estado_civil: any | number;
    registro_casamento: any | number;
    uniao_estavel: any | boolean;
    conjuge: string;
    pj_representante: boolean,
    pj_socio: boolean,

    // BLOCO ENDEREÇO    
    bairro: string
    cidade: string
    uf: string
    cep: string
    logradouro: string
    numero: string
    complemento: string
    unidade: string
    procurador: {
        nome: string
        telefone: string
        ddi: string
    }
    origin_cliente: {
        origem: string
        forma_contato: string
        data_entrada: string
    }
}

export type { FormValues, BlockProps, ArrMenuTypes, ArrConflitosType }