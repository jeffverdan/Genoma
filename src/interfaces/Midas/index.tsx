type ReturnApiMidas = {
    bairro_comercial: string
    cep: string
    codigo_proprietario: string | number
    complemento: string | ''
    cpf_cnpj_proprietario: string | null
    emails_proprietario: string | ''
    endereco_completo: string
    endereco_proprietario: string | null
    inscricao_municipal: string | ''
    municipio: string
    nome_logradouro: string
    nome_opcionista1: string | ''
    nome_opcionista2: string | ''
    nome_opcionista3: string | ''
    nome_opcionista4: string | ''
    nome_proprietario: string | ''
    numero: string
    opcionista1: string | ''
    opcionista2: string | ''
    opcionista3: string | ''
    opcionista4: string | ''
    percentual_opcao1: string | ''
    percentual_opcao2: string | ''
    percentual_opcao3: string | ''
    percentual_opcao4: string | ''
    qtde_vagas: string
    referencia: string
    telefones_proprietario: string
    tipo_imovel: string
    tipo_logradouro: string
    tipo_opcao: string
    unidade: string
    valor_venda: string | number
}

export type { ReturnApiMidas }