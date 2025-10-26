const formatoMoeda = (valor?: string | number) => {    
    if(!valor) return 'R$ 0,00';
    if(typeof valor === 'number') valor = valor.toFixed(2);
     // Remove "R$" se existir e limpa espaços extras
     const valorLimpo = valor.replace(/[^\d,.-]/g, '');

     // Identifica se o número usa ponto como separador decimal
     const usaPontoDecimal = /\.\d{2}$/.test(valorLimpo);
 
     // Normaliza o formato para sempre ter vírgula como separador decimal
     const valorNormalizado = usaPontoDecimal 
         ? valorLimpo.replace('.', ',') 
         : valorLimpo;
 
     // Remove quaisquer pontos fora da parte decimal
     const partes = valorNormalizado.split(',');
     partes[0] = partes[0].replace(/\./g, '');
 
     const valorFinal = partes.join(',');
 
     // Formata para moeda brasileira
     const numero = parseFloat(valorFinal.replace(',', '.'));
     if (isNaN(numero)) {
         console.error('Valor inválido:', valor);        
         return 'R$ 0,00';
     };
 
     return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

};

export default formatoMoeda;