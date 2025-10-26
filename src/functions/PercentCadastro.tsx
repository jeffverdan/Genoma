import { FormValues } from "@/interfaces/IA_Recibo";
import Pessoa from "@/interfaces/Users/userData";

const checkDadosPessoa = (userData: Pessoa) => {
    type KeysType = 'cpf_cnpj' | 'name' | 'data_nascimento' | 'genero' | 'nome_mae' | 'nacionalidade' | 'telefone' | 'profissao' | 'estado_civil' | 'registro_casamento' | 'conjuge';

    const arrKeys = ['cpf_cnpj', 'name', 'data_nascimento', 'genero', 'nome_mae', 'nacionalidade', 'telefone', 'profissao', 'estado_civil'] as KeysType[];
    const arrMissKeys = [] as KeysType[];

    if (userData.estado_civil === '1') {
        arrKeys.push('registro_casamento');
        arrKeys.push('conjuge');
    }

    let count = 0;
    arrKeys.forEach((key) => {
        console.log(key, ': ', userData[key]);        
        if (!!userData[key]) count += 1;
        else {
            arrMissKeys.push(key);
            console.log("Faltando: ", key);
        }
    });
    const percent = Math.ceil((count / arrKeys.length) * 100);
    return { percent, miss: arrMissKeys };
}

const checkEndereco = (userData: Pessoa) => {
    type KeysType = 'cep' | 'logradouro' | 'numero' | 'cidade' | 'uf' | 'bairro';
    const arrKeys = ['cep', 'logradouro', 'numero', 'cidade', 'uf', 'bairro'] as KeysType[];
    const arrMissKeys = [] as KeysType[];

    let count = 0;
    arrKeys.forEach((key) => {
        if (!!userData[key]) count += 1;
        else {
            arrMissKeys.push(key);
            console.log("Faltando: ", key);
        }
    });
    const percent = Math.ceil((count / arrKeys.length) * 100);
    return { percent, miss: arrMissKeys };
}

const checkProcurador = (userData: Pessoa) => {
    type KeysType = 'nome' | 'telefone' 
    const arrKeys = ['nome', 'telefone'] as KeysType[];
    const arrMissKeys: string[] = [];

    let count = 0;
    arrKeys.forEach((key) => {
        console.log(key, userData?.procurador?.[key]);
        if (userData.procurador && !!userData.procurador[key]) count += 1;
        else {
            arrMissKeys.push('procurador.' + key);
            console.log("Faltando: ", key);
        }
    });
    const percent = Math.ceil((count / arrKeys.length) * 100);
    return { percent, miss: arrMissKeys };
}

const checkAverbacao = (userData: Pessoa) => {
    type KeysType = 'id' | 'id_edit' 
    const arrKeys = ['id', 'id_edit'] as KeysType[];
    const arrMissKeys: string[] = [];

    let count = 0;
    arrKeys.forEach((key) => {
        console.log(key, userData?.averbacao?.[0][key]);
        if (userData.averbacao && !!userData.averbacao[0][key]) count += 1;
        else {
            arrMissKeys.push('averbacao.' + key);
            console.log("Faltando: ", key);
        }
    });
    const percent = Math.ceil((count / arrKeys.length) * 100);
    return { percent, miss: arrMissKeys };
}

const checkOrigem = (userData: Pessoa) => {    
    type KeysType = 'origem' | 'forma_contato' | 'data_entrada'
    const arrKeys = ['origem', 'forma_contato', 'data_entrada'] as KeysType[];
    const arrMissKeys: string[] = [];

    let count = 0;
    arrKeys.forEach((key) => {
        console.log(key, userData?.origin_cliente?.[key]);
        if (userData.origin_cliente &&  !!userData.origin_cliente[key] && userData.origin_cliente[key] !== '0') count += 1;
        else {
            arrMissKeys.push('origin_cliente.' + key);
            console.log("Faltando: ", key);
        }
    });
    const percent = Math.ceil((count / arrKeys.length) * 100);
    return { percent, miss: arrMissKeys };
}

export { checkDadosPessoa, checkEndereco, checkProcurador, checkOrigem, checkAverbacao }