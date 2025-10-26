// { name: 'União', id: '1' },
// { name: 'Prefeitura', id: '2' },
// { name: 'Família', id: '3' },
// { name: 'Igreja', id: '4' },

type Laudemios = {
  id: string
  imovel_id: string
  tipo_laudemio: "1" | "2" | "3" | "4"
  valor_laudemio: string
  nameTipo: string
  valorName: string
  labelTipo: string
}

type LaudemiosListItem = { 
  id: number | string, 
  nome: string
  tipo_laudemio_id: string
}

type LaudemiosList = LaudemiosListItem[]

export type { Laudemios, LaudemiosList, LaudemiosListItem }