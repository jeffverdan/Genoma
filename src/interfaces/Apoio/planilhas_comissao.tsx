type DadosProcessoType = {
  "processo_id": number | string,
  "logradouro": string,
  "uf": string,
  "cidade": string,
  "numero": null | string,
  "unidade": null | string,
  "complemento": null | string,
  "bairro": string,
  "loja_name": string,
  "loja_id": number | string,
  "gerente_id": number | string,
  "gerente_name": string,
  "pos_venda_id": number | string,
  "pos_venda_name": string,
  "ultima_observacao_gerente": null | string
  data_assinatura: string
  codigo: string
}

type ComissaoIndividuoType = {
  "agencia": null | string
  "banco_id": null | number | string
  "nome_banco": null | string
  "chave_pix": null | string
  "cnpj": null | string
  // "comissao_id"?: number | string
  "cpf": string
  "creci": null | string
  // "dados_bancario_receber_id": number | string
  "desconto": null | string
  // "empresa_id": string | number | null
  "id": number | string
  "name": string
  "nome_empresarial": null | string
  "numero_conta": null | string
  // "parcela_id": string | number
  "pix": null | string
  "porcentagem_comissao": string
  "porcentagem_real": null | string
  // "processo_id": string | number
  "tipo_chave_pix_id": null | number | string
  "tipo_laudo_opcionista"?: string
  "tipo_pagamento": "pix" | "banco"
  "tipo_pessoa": "PF" | "PJ"
  "usuario_id": number | string
  "valor_real": null | string

  // CAMPOS CRIANDOS NO FRONT
  bonificacao?: string
  value_autocomplete: {
    usuario_id: string | number;
    label: string;
  }
}

type ComissaoFranquiasType = {
  "id": number | string
  // "usuario_id": number | string  
  "porcentagem_real": null | string
  "valor_real": null | string
}

type ParcelaIndividuosType = {
  corretores_vendedores: ComissaoIndividuoType[],
  corretores_opcionistas: ComissaoIndividuoType[],
  gerentes: ComissaoIndividuoType[],
  gerentes_gerais: ComissaoIndividuoType[],
  diretores_gerais: ComissaoIndividuoType[],
  repasse_franquias: ComissaoIndividuoType[],
  empresas: ComissaoIndividuoType[],
}

interface ParcelaComissoesType extends ParcelaIndividuosType, ParcelaFranquiasType {
  id: string | number
  comissao_id: string | number
  processo_id: string | number
  data_criacao: string
  data_ultima_atualizacao: string
  dia_pagamento: string | null
  numero_parcela: number | null
  periodo_pagamento: string | null
  valor_parcela: string | null
  planilha_id: string | null
  ultima_data_envio: string | null

  // CAMPOS CRIANDOS NO FRONT
  quantidade_corretores_vendedores: number,
  quantidade_corretores_opcionistas: number,
  quantidade_gerentes: number,
  quantidade_gerentes_gerais: number,
  quantidade_diretores_gerais: number,
  quantidade_repasse_franquias: number,
  quantidade_empresas: number,
}

type ParcelaFranquiasType = {
  comunicacao: ComissaoIndividuoType,
  royalties: ComissaoIndividuoType,
}

type ParcelasEmpresaType = {
  comfirmacao_pagamento: 0 | 1
  comissao_id: string | number
  created_at: string
  data_comissao: string
  dia_pagamento: string
  id: string | number
  nome_periodo: "Na assinatura do Recibo de Sinal" | 'Na retirada das certidões' | 'No ato da escritura do imóvel' | 'Na transferência de registros'
  numero_parcela: null | string
  periodo_pagamento: "1" | "2" | '3' | '4' | '0'
  processo_id: string | number
  updated_at: string
  valor_parcela: string
  ultima_data_envio: string | null
}

interface ComissaoDataType extends FormEditComissaoType {
  "ultima_observacao_gerente": string | null
  "verificar_enviar_planilha": 0 | 1,
  "data_atualizacao": string // "07/11/2024 06:38:26"
  "valor_receber_empresa": null | string,
  "valor_receber_empresa_opcao": "" | string,
  "porcentagem_comissao_gerentes": null | string,
  "porcentagem_comissao_gerente_gerais": null | string,
  "porcentagem_corretores_vendedores_comissao": null | string,
  "porcentagem_corretores_opicionistas_comissao": null | string,
  "porcentagem_empresa": null | string,
  "desconto_empresa": null | string,
  "status_visualizacao_apoio": 0 | 1,
  "verificar_repasse": null | string,
  "vendedor_responsavel_pagamento": [],
  "observacao_responsavel_pagamento": null | string
  tipo_pagamento: '' | 'Integral' | 'Parcelada',
  forma_pagamento: '' | 'Espécie' | 'Depósito' | 'TED/DOC' | 'PIX' | 'Cheque/Cheque adm.'
}

type FormEditComissaoType = {
  id: string | number
  processo_id: string | number
  valor_comissao_total: string
  deducao: null | string
  valor_comissao_liquida: string
  liquida: string | null
  comissao: null | 'integral' | 'partes',
  quantidade_parcelas: string
  parcelas_empresa: ParcelasEmpresaType[] | []
  observacoes: null | string,
}

export type {
  ComissaoDataType,
  DadosProcessoType,
  ComissaoIndividuoType,
  FormEditComissaoType,
  ParcelasEmpresaType,
  ParcelaComissoesType,
  ParcelaIndividuosType,
  ParcelaFranquiasType
}