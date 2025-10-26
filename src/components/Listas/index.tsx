const arrayEscritura = [
    { id: '0', name: 'Selecione o tipo de escritura' },
    { id: '1', name: 'Escritura Pública de Compra e Venda' },
    { id: '2', name: 'Escritura de Pública Promessa de Compra e Venda' },
    { id: '3', name: 'Escritura Pública Promessa Cessão de Direitos Aquisitivos' },
    { id: '4', name: 'Escritura Pública de Cessão de Direitos Aquisitivos' },
    { id: '5', name: 'Escritura Pública de Promessa de Compra e Venda e Bem Futuro' },
    { id: '6', name: 'Escritura Publica de Cessão de Direitos Aquisitivos' },
    { id: '7', name: 'Escritura Pública de Doação e Escritura Pública de Inventário' }
] as const;

const laudemiosFamilia = [
    { name: 'Selecione...', id: '0' },
    { "id": 1, name: "Burle de Figueredo", },
    { "id": 4, name: "Ely Jose Machado", },
    { "id": 5, name: "Koening", },
    { "id": 3, name: "Moçapyr", },
    { "id": 6, name: "Orleans e Bragança", },
    { "id": 7, name: "Regis de Oliveira", },
    { "id": 2, name: "Silva Porto", },
  ] as const;

  const laudemiosIgreja = [
    { name: 'Selecione...', id: '0' },
    { "id": 8, name: "Mosteiro de São Bento" },
    { "id": 9, name: "Irmandade do Santíssimo Sacramento da Candelária", },
    { "id": 10, name: "Hospital dos Lazáros", },
  ] as const;

  const tiposLaudemios = [
    { name: 'União, Prefeitura, Família ou Igreja', id: '0' },
    { name: 'União', id: '1' },
    { name: 'Prefeitura', id: '2' },
    { name: 'Família', id: '3' },
    { name: 'Igreja', id: '4' },
  ] as const;

  const listQuantLaudemios = [
    { name: 'Selecione...', id: '0' },
    { name: '1', id: '1' },
    { name: '2', id: '2' },
    { name: '3', id: '3' },
    { name: '4', id: '4' },
  ] as const;

export { arrayEscritura, laudemiosFamilia, laudemiosIgreja, tiposLaudemios, listQuantLaudemios }