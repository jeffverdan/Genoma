import { dataDocument, Document } from "../Users/document"
export default interface Pessoa {
  id: number | string
  tipo_pessoa: number
  name?: string
  nome_fantasia?: string
  cpf_cnpj?: string
  email?: string
  telefone: string
  genero: string
  genero_label: string
  data_nascimento: string
  ddi: string
  nacionalidade: string
  nome_mae: string
  nome_pai: string
  estado_civil: string
  estado_civil_nome: string
  uniao_estavel: string
  registro_casamento: string
  registro_casamento_label: string
  conjuge: string
  profissao: string
  rg: string
  rg_expedido: string
  data_rg_expedido: string
  bairro?: string
  cidade?: string
  estado?: string
  uf?: string
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  unidade: string
  razao_social?: string
 
  documentos?: Document
  pj_representante?: 0 | 1
  vinculo_empresa?: {
    id: number
    nome_fantasia: string
    razao_social: string
  }  
  pj_socio?: 0 | 1
  representante_socios?: {
    data: Pessoa[]
  }
  loja?: {
    data: [
      {id: string, nome: string}
    ]
  }
  tipo?: 'vendedores' | 'compradores';
  origin_cliente?: {
    origem?: string
    forma_contato?: string
    data_entrada?: string
  }
  usuario_id?: string | number
  tipo_usuario?:  'vendedor' | 'comprador'
  procurador?: {
    id?: string
    nome?: string
    processo_id?: string | number
    ddi?: string
    telefone?: string
    usuario_id?: string | number
  }
  averbacao?: {        
      id: number | string
      id_edit: number | string    
  }[]
}